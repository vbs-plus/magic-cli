import path from 'path'
import type { Command } from 'commander'
import { Package } from 'magic-cli-models'
import { spawn, useLogger } from 'magic-cli-utils'
import {
  DEFAULT_PACKAGE_VERSION,
  DEFAULT_STORE_PATH,
  DEFAULT_STORE_SUFIX,
  PACKAGE_SETTINGS,
} from './enum'

export const exec = async (...args: any[]) => {
  let TP_PATH = process.env.TARGET_PATH
  const HOME_PATH = process.env.MAGIC_CLI_HOME_PATH
  // 缓存目录
  let STORE_PATH = ''
  const cmd: Command = args[args.length - 1]
  const curCommand = cmd.name() as keyof typeof PACKAGE_SETTINGS
  const PACKAGE_NAME = PACKAGE_SETTINGS[curCommand]
  const PACKAGE_VERSION = DEFAULT_PACKAGE_VERSION
  let pkg: Package
  const { debug, error, info } = useLogger()

  if (TP_PATH) {
    // 直接赋值
    pkg = new Package({
      TP_PATH,
      STORE_PATH,
      PACKAGE_NAME,
      PACKAGE_VERSION,
    })
  }
  else {
    // 走全局缓存目录 ex:/Users/zhongan/.magic-cli/dependenices
    TP_PATH = path.resolve(HOME_PATH!, DEFAULT_STORE_PATH)
    STORE_PATH = path.resolve(TP_PATH, DEFAULT_STORE_SUFIX)

    pkg = new Package({
      TP_PATH,
      STORE_PATH,
      PACKAGE_NAME,
      PACKAGE_VERSION,
    })

    debug(pkg)
    debug(`exist:${await pkg.exists()}`)

    // 判断缓存目录是否已存在
    if (await pkg.exists()) {
      debug('执行更新')
      await pkg.update()
    }
    else {
      debug('执行初始化')
      await pkg.init()
    }
  }

  const execFilePath = await pkg.getRootFilePath()
  if (!execFilePath)
    throw new Error(error('当前指定文件夹路径有误', { needConsole: false }))

  debug(`execFilePath:${execFilePath}`)
  debug(`TP_PATH:${TP_PATH}`)
  debug(`STORE_PATH:${STORE_PATH}`)
  debug(`PACKAGE_NAME:${PACKAGE_NAME}`)
  debug(`PACKAGE_VERSION:${PACKAGE_VERSION}`)

  try {
    const params = [...args]
    const _suffixObject = Object.create(null)
    const commanderObject = params[params.length - 1]
    Object.keys(commanderObject).forEach((key) => {
      if (commanderObject.hasOwnProperty(key) && !key.startsWith('_') && key !== 'parent')
        _suffixObject[key] = commanderObject[key]
    })
    params[params.length - 1] = _suffixObject

    // 开启多进程执行命令代码
    const child = spawn(
      'node',
      [execFilePath, `${JSON.stringify(params)}`],
      {
        cwd: process.cwd(),
        stdio: 'inherit' as any,
      },
    )

    child.on('error', (e: Error) => {
      error(`多进程代码执行异常: ${e.message}`)
      process.exit(1)
    })

    child.on('exit', (e: number) => {
      info('NODE 进程启动成功')
      debug(`${curCommand} 命令执行成功`)
      process.exit(e)
    })
  }
  catch (e: any) {
    error(`catch error ${e.message}`)
  }
}
