import path from 'path'
import fse from 'fs-extra'
import { toLine, useLogger } from '@vbs/magic-cli-utils'
import { getTemplateListByType } from '@vbs/magic-cli-templates'
import semver from 'semver'
import ora from 'ora'
import clear from 'clear'
import { cancel, confirm, intro, isCancel, select, spinner, text } from '@clack/prompts'
import gradient from 'gradient-string'
import pkg from '../package.json'
import { installTemplate } from './template'
import type { ProjectInfo } from './type'
import type { TemplateListItem } from '@vbs/magic-cli-templates'
import type { InitArgs } from '.'

const { debug, chalk } = useLogger()
const RANDOM_COLORS = [
  '#FD841F',
  '#E14D2A',
  '#CD104D',
  '#9C2C77',
  '#A66CFF',
  '#9C9EFE',
  '#005555',
  '#069A8E',
  '#FF5677',
  '#113CFC',
  '#FFC107',
  '#F05454',
  '#16C79A',
]
const templateSpinner = ora({
  text: 'Retrieving system templates, please later...',
  spinner: 'material',
})

const logVersion = () => {
  clear()
  console.log(`\n  ${gradient.pastel(` Magic CLI ${`[version: ${pkg.version}]`}`)}\n`)
}

export const getInheritParams = () => {
  const args = JSON.parse(process.argv.slice(2)[0])
  const inheritArgs: InitArgs = Object.create(null)
  inheritArgs.projectName = args[0]
  inheritArgs.force = args[1]
  inheritArgs.cmd = args[2]
  return inheritArgs
}

export const isEmptyDir = (path: string) => {
  let fileList = fse.readdirSync(path)
  // filter startsWith .
  fileList = fileList.filter(item => !item.startsWith('.'))
  debug(`fileList: ${fileList}`)
  return !fileList || !fileList.length
}

export function formatTargetDir(targetDir: string) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
}

export const checkPackageExists = async(dirPath: string, force: boolean) => {
  const pwd = process.cwd()
  const targetDir = path.join(pwd, dirPath)
  if (fse.existsSync(targetDir)) {
    if (force) {
      await fse.remove(targetDir)
    } else {
      const action = await confirm({
        message: 'Does the directory already exist and need to be removed?',
      })
      if (!action || isCancel(action)) {
        cancel('✖ The file removal operation is canceled and the program exits normally!')
        process.exit(0)
      } else {
        const s = spinner()
        s.start('Removing the directory...')
        await fse.remove(targetDir)
        s.stop('✅ The directory has been removed successfully!')
      }
    }
  } else {
    fse.mkdirSync(targetDir)
  }
}

export const getProjectInfo = async(args: InitArgs, templates: TemplateListItem[]): Promise<Partial<ProjectInfo>> => {
  let targetDir = formatTargetDir(args.projectName!)
  const defaultVersion = '1.0.0'
  let projectInfo: Partial<ProjectInfo> = {}

  try {
    logVersion()
    intro(chalk.bgCyan(chalk.bold.black(' Welcome to Magic CLI!')))

    const type = await select({
      message: 'Please select the initialization type:',
      options: [
        { label: 'Project', value: 'project' },
        { label: 'Component', value: 'component' },
      ],
      initialValue: 'project',
    })

    const title = type === 'component' ? 'Component' : 'Project'

    // 非法 projectName 或不传开启提问
    const needProjectPromot = !args.projectName || !isValidPackageName(args.projectName)

    const projectName = needProjectPromot
      ? await text({
        message: `What is your ${title} name intended to be?`,
        placeholder: `Awesome-${title}`.toLowerCase(),
        validate: (value: string) => {
          if (!isValidPackageName(value))
            return `🚫 Invalid ${title} name`
        },
      })
      : ''

    if (isCancel(type) || isCancel(projectName)) {
      cancel('✖ The program exits normally!')
      process.exit(0)
    }

    targetDir = formatTargetDir(projectName as string) || targetDir
    // TODO: Documentation Three types of cases: 1. Pass in a legitimate projectName 2. Illegal projectName 3. Not passed
    debug(` TargetDir :${targetDir}`)

    await checkPackageExists(targetDir, args.force!)

    const projectVersion = await text({
      message: `Please enter the ${title} version number`,
      placeholder: `${defaultVersion} (Please refer to the semver specification for naming)`,
      validate: (value: string) => {
        if (!semver.valid(value))

          return `🚫 Invalid ${title} Version`
      },
    })

    if (isCancel(projectVersion)) {
      cancel('✖ Please enter the version correctly, The program exits normally!')
      process.exit(0)
    }

    const templateChoices = templates
      .filter(item => item.type === type)
      .map((item) => {
        return {
          name: chalk.hex(RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)])(item.name),
          value: item.npmName,
        }
      })

    const npmName = await select({
      message: `Please select the ${title} template`,
      options: templateChoices.map((item) => {
        return {
          label: item.name,
          value: item.value,
        }
      }),
    }) as string

    if (isCancel(npmName)) {
      cancel('✖ Please select the template correctly, The program exits normally!')
      process.exit(0)
    }

    const projectDescription = await text({
      message: `Please enter a description of ${title}`,
      placeholder: `A magic ${title}`,
    })

    if (isCancel(projectDescription)) {
      cancel('Please enter the projectDescription correctly, The program exits normally!')
      process.exit(0)
    }

    projectInfo = {
      name: projectName || targetDir || args.projectName,
      projectName: toLine(projectName || targetDir || args.projectName!),
      type,
      npmName,
      projectVersion,
      projectDescription,
    }
  } catch (e: any) {
    console.log(e.message)
  }
  return projectInfo
}

export const checkTemplateExistAndReturn = async() => {
  templateSpinner.start()
  try {
    const { documents } = await getTemplateListByType('all')
    if (documents.length) {
      templateSpinner.succeed('System template retrieval is normal!')
      return documents
    } else {
      templateSpinner.fail('System template exception!')
      throw new Error('The project template does not exist!')
    }
  } catch (error) {
    templateSpinner.fail('System template exception!')
    process.exit(-1)
  }
}

// prepare 阶段
export async function prepare(args: InitArgs) {
  try {
    // 用户界面选择获取模板信息
    const templates = await checkTemplateExistAndReturn()
    const projectInfo = await getProjectInfo(args, templates)
    debug(`projectInfo : ${JSON.stringify(projectInfo)}`)

    await installTemplate(templates, projectInfo)
  } catch (error) {
    console.log(error)
  }
}
