import fse from 'fs-extra'
import inquirer from 'inquirer'
import { useSpinner } from '@vbs/magic-cli-utils'
import type { InitArgs } from '.'

const { logWithSpinner } = useSpinner()

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
  return !fileList || !fileList.length
}

export const checkPackageExist = async (force: boolean) => {
  const curPath = process.cwd()
  if (!isEmptyDir(curPath)) {
    let continueInit = false
    if (!force) {
      continueInit = (await inquirer.prompt({
        type: 'confirm',
        name: 'continue',
        default: false,
        message: '当前文件夹下不为空，是否继续创建项目？',
      })).continue

      if (!continueInit)
        return
    }
    if (continueInit && force) {
      const { confirmDelete } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirmDelete',
        default: false,
        message: '是否确认清空当前目录下所有文件？',
      })

      if (confirmDelete)
        fse.emptyDirSync(curPath)
    }
  }
}

export const checkTemplateExist = async () => {
  console.log()
  logWithSpinner('🗃 正在搜索系统模板...')
  console.log()
}

// prepare 阶段
export async function prepare(args: InitArgs) {
  // 用户界面选择获取模板信息

  await checkPackageExist(args.force!)
}

