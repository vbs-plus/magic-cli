import path from 'path'
import fse from 'fs-extra'
import { toLine, useLogger, useSpinner } from '@vbs/magic-cli-utils'
import type { TemplateListItem } from '@vbs/magic-cli-templates'
import { getTemplateListByType } from '@vbs/magic-cli-templates'
import semver from 'semver'
import inquirer from 'inquirer'
import type { ProjectInfo } from './type'
import { installTemplate } from './template'
import type { InitArgs } from '.'

const { logWithSpinner, successSpinner, failSpinner } = useSpinner()
const { debug, info, chalk } = useLogger()
const RANDOM_COLORS = [
  '#F94892',
  '#FF7F3F',
  '#FBDF07',
  '#89CFFD',
  '#A66CFF',
  '#9C9EFE',
  '#B1E1FF',
  '#293462',
]

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
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName,
  )
}

export const checkPackageExists = async (dirPath: string, force: boolean) => {
  const pwd = process.cwd()
  const targetDir = path.join(pwd, dirPath)
  if (fse.existsSync(targetDir)) {
    if (force) {
      await fse.remove(targetDir)
    }
    else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'confirm',
          message: '目录已存在是否需要进行移除？',
        },
      ])
      if (!action)
        return false
      else
        await fse.remove(targetDir)
      return true
    }
  }
  else {
    fse.mkdirSync(targetDir)
    return true
  }
}

export const getProjectInfo = async (
  args: InitArgs,
  templates: TemplateListItem[],
): Promise<Partial<ProjectInfo>> => {
  let targetDir = formatTargetDir(args.projectName!)
  const defaultName = 'magic-project'
  const defaultVersion = '1.0.0'
  let projectInfo: Partial<ProjectInfo> = {}

  try {
    const { type } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      default: 'project',
      message: '请选择初始化类型：',
      choices: [
        {
          name: '项目 🗂️',
          value: 'project',
        },
        {
          name: '组件 🧰',
          value: 'component',
        },
      ],
    })
    const title = type === 'component' ? '组件' : '项目'
    const projectNamePrompt: inquirer.QuestionCollection<any> = {
      type: 'input',
      name: 'projectName',
      default: defaultName,
      message: `请输入${title}名称：`,
      validate: (value: string) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!isValidPackageName(value)) {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('🚫 Invalid project name')
              return
            }
            resolve(true)
          }, 0)
        })
      },
    }

    const projectPrompts: inquirer.QuestionCollection<any>[] = []
    // 非法 projectName 或不传开启提问
    if (!args.projectName || !isValidPackageName(args.projectName))
      projectPrompts.push(projectNamePrompt)
    const values = await inquirer.prompt(projectPrompts)
    targetDir = formatTargetDir(values.projectName) || targetDir
    // TODO:文档记录 三种case： 1. 传入合法projectName 2. 不合法projectName 3. 不传
    debug(` TargetDir :${targetDir}`)

    const ret = await checkPackageExists(targetDir, args.force!)
    if (!ret)
      info('✖ 移除文件操作被取消，程序正常退出')

    const { projectVersion } = await inquirer.prompt({
      type: 'input',
      name: 'projectVersion',
      message: `请输入${title}版本号(此版本号仅作为模板渲染使用，默认下载系统最新版本模板)`,
      default: defaultVersion,
      validate: (value: string) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!semver.valid(value)) {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('🚫 Invalid project Version')
              return
            }
            resolve(true)
          }, 0)
        })
      },
      filter: (value: string) => {
        if (semver.valid(value))
          return semver.valid(value)

        return value
      },
    })
    debug(`projectVersion: ${projectVersion}`)

    const templateChoices = templates
      .filter(item => item.type === type)
      .map((item) => {
        return {
          name: chalk.hex(
            RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)],
          )(item.name),
          value: item.npmName,
        }
      })

    const { npmName } = await inquirer.prompt({
      type: 'list',
      name: 'npmName',
      message: `请选择${title}模板`,
      choices: templateChoices,
    })

    debug(`npmName : ${npmName}`)
    const { projectDescription } = await inquirer.prompt({
      type: 'input',
      name: 'projectDescription',
      message: `请输入${title}描述`,
      default: 'A Magic project',
    })

    projectInfo = {
      name: values.projectName || targetDir,
      projectName: toLine(values.projectName) || toLine(targetDir),
      type,
      npmName,
      projectVersion,
      projectDescription,
    }
  }
  catch (e: any) {
    console.log(e.message)
  }
  return projectInfo
}

export const checkTemplateExistAndReturn = async () => {
  console.log()
  logWithSpinner('🗃  正在检索系统模板是否存在，请稍后...')
  console.log()

  try {
    const { documents } = await getTemplateListByType('all')
    if (documents.length) { successSpinner('系统模板检索正常！'); return documents }
    else {
      failSpinner('系统模板异常')
      throw new Error('项目模板不存在')
    }
  }
  catch (error) {
    failSpinner('系统模板异常')
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
  }
  catch (error) {
    console.log(error)
  }
}

