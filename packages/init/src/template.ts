import path from 'path'
import os from 'os'
import fse from 'fs-extra'
import { DEFAULT_HOME_PATH, DEFAULT_STORE_SUFIX, DEFAULT_TEMPLATE_TARGET_PATH, useLogger, useSpinner } from '@vbs/magic-cli-utils'
import { Package } from '@vbs/magic-cli-models'
import type { TemplateListItem } from '@vbs/magic-cli-templates'
import type { ProjectInfo } from './type'

const homeDir = os.homedir()
let templatePackage: Package
const { debug } = useLogger()
const { spinner } = useSpinner()

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
    const installSpinner = spinner.start('🚀 正在安装模板...')
    try {
      await templatePackage.init()
    }
    catch (e: any) {
      installSpinner.fail('安装模板失败！')
      throw new Error(e.message)
    }
    finally {
      if (await templatePackage.exists())
        installSpinner.succeed('🎉 模板安装成功')
    }
  }
  else {
    const updateSpinner = spinner.start('🚀 正在更新模板...')
    try {
      await templatePackage.update()
    }
    catch (e: any) {
      updateSpinner.fail('更新模板失败！')
      throw new Error(e.message)
    }
    finally {
      if (await templatePackage.exists())
        updateSpinner.succeed('🎉 模板更新成功')
    }
  }

  await renderTemplate(template, projectInfo)
}

export function renderTemplate(template: TemplateListItem, projectInfo: Partial<ProjectInfo>) {
  const { version } = template
  const { projectName } = projectInfo
  const renderSpinner = spinner.start('📄 开始渲染模板代码...')
  const targetPath = path.resolve(process.cwd(), projectName!)
  const templatePath = path.resolve(templatePackage.getCacheFilePath(version), DEFAULT_TEMPLATE_TARGET_PATH)

  try {
    fse.ensureDirSync(targetPath)
    fse.ensureDirSync(templatePath)
    fse.copySync(templatePath, targetPath)
  }
  catch (e: any) {
    renderSpinner.fail('渲染模板代码失败！')
    throw new Error(e.message)
  }
  finally {
    renderSpinner.succeed('🎉 模板渲染成功！')
  }
}
