import path from 'path'
import os from 'os'
import fse from 'fs-extra'
import { DEFAULT_HOME_PATH, DEFAULT_STORE_SUFIX, DEFAULT_TEMPLATE_TARGET_PATH, useLogger } from '@vbs/magic-cli-utils'
import { Package } from '@vbs/magic-cli-models'
import glob from 'glob'
import ejs from 'ejs'
import { execaCommand } from 'execa'
import ora from 'ora'
import { fileContent } from './gitignore'
import { npmrcContent } from './npmrc'
import type { TemplateListItem } from '@vbs/magic-cli-templates'
import type { ProjectInfo } from './type'

const homeDir = os.homedir()
let templatePackage: Package
const { debug, error, info } = useLogger()
const installSpinner = ora({
  text: '🚀 Installing the template... \r\n',
  spinner: 'material',
})
const updateSpinner = ora({
  text: '🚀 Updating template... \r\n',
  spinner: 'moon',
})
const renderSpinner = ora({
  text: '📄 Start rendering the template code... \r\n',
  spinner: 'material',
})
const commandSpinner = ora({
  text: '🔫 Start executing dependent installation commands...',
  spinner: 'shark',
})

export async function installTemplate(
  templates: TemplateListItem[],
  projectInfo: Partial<ProjectInfo>,
) {
  const { npmName } = projectInfo
  const template = templates.find(item => item.npmName === npmName)!
  const TP_PATH = path.resolve(
    homeDir,
    DEFAULT_HOME_PATH,
    DEFAULT_TEMPLATE_TARGET_PATH,
  )
  const STORE_PATH = path.resolve(TP_PATH, DEFAULT_STORE_SUFIX)

  debug(`TP_PATH: ${TP_PATH}`)
  debug(`STORE_PATH: ${STORE_PATH}`)

  templatePackage = new Package({
    TP_PATH,
    STORE_PATH,
    PACKAGE_NAME: template?.npmName || '',
    PACKAGE_VERSION: template?.version || '1.0.0',
  })

  // 更新机制
  if (!(await templatePackage.exists())) {
    try {
      installSpinner.start()
      await templatePackage.init()
    } catch (e: any) {
      installSpinner.fail('Failed to install template!')
      throw new Error(e.message)
    } finally {
      if (await templatePackage.exists())
        installSpinner.succeed('🎉 The template was installed successfully! ')
    }
  } else {
    try {
      updateSpinner.start()
      await templatePackage.update()
    } catch (e: any) {
      updateSpinner.fail('Failed to update template!')
      throw new Error(e.message)
    } finally {
      if (await templatePackage.exists())
        updateSpinner.succeed('🎉 Template updated successfully!')
    }
  }

  await renderTemplate(template, projectInfo)
}

export async function renderTemplate(template: TemplateListItem, projectInfo: Partial<ProjectInfo>) {
  const ignoreBase = ['**/node_modules/**', '**/pnpm-lock.yaml', '**/yarn.lock', '**/package-lock.json']
  const { version, installCommand = 'npm install', startCommand = 'npm run dev', ignore: ignores = [] } = template
  const { projectName } = projectInfo
  const targetPath = path.resolve(process.cwd(), projectName!)
  const templatePath = path.resolve(templatePackage.getCacheFilePath(version), DEFAULT_TEMPLATE_TARGET_PATH)
  const ignore = [...ignoreBase, ...ignores]
  try {
    renderSpinner.start()
    fse.ensureDirSync(targetPath)
    fse.ensureDirSync(templatePath)
    fse.copySync(templatePath, targetPath)
    ejsRenderTemplate({ ignore, targetPath }, projectInfo)
  } catch (e: any) {
    renderSpinner.fail('Rendering template code failed!\n')
    throw new Error(e.message)
  } finally {
    renderSpinner.succeed('🎉 Template rendered successfully! \n')
  }

  try {
    info('🔫 Executing dependent install command...')
    fse.writeFileSync(path.resolve(targetPath, '.npmrc'), npmrcContent)
    fse.writeFileSync(path.resolve(targetPath, '.gitignore'), fileContent)
    await execaCommand(installCommand, { stdio: 'inherit', encoding: 'utf-8', cwd: targetPath })
  } catch (error: any) {
    console.log(error)
    commandSpinner.fail('Template installation dependency failed!\n')
    process.exit(-1)
  } finally {
    commandSpinner.succeed('Dependency installation completes \n')
  }

  try {
    console.log()
    info('✨✨ The job installation completes!')
    await execaCommand(startCommand, { stdio: 'inherit', encoding: 'utf-8', cwd: targetPath })
  } catch (error: any) {
    debug(`ERROR ${JSON.stringify(error)}`)
    error('App launch failed!\n')
    process.exit(-1)
  }
}

export function ejsRenderTemplate(options: { ignore: string[], targetPath: string }, projectInfo: Partial<ProjectInfo>) {
  const { ignore, targetPath } = options
  return new Promise((resolve, reject) => {
    glob('**', {
      cwd: targetPath,
      ignore: ignore || '',
      nodir: true,
    }, (err, matches) => {
      if (err)
        reject(err)
      Promise.all(matches.map((file) => {
        const filePath = path.resolve(targetPath, file)
        // eslint-disable-next-line promise/param-names
        return new Promise((resolvet, rejectt) => {
          ejs.renderFile(filePath, projectInfo, {}, (err, result) => {
            if (err) {
              error(`ejsRender ${err.toString()}`)
              rejectt(err)
            } else {
              fse.writeFileSync(filePath, result)
              resolvet(result)
            }
          })
        })
      })).then(() => resolve(null)).catch((err: any) => reject(err))
    })
  })
}
