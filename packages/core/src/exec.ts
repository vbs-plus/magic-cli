import path from 'path'
import type { Command } from 'commander'
import { Package } from 'magic-cli-models'
import { useLogger } from 'magic-cli-utils'
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
  const { debug } = useLogger()

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
  debug(`execFilePath:${execFilePath}`)
  debug(`TP_PATH:${TP_PATH}`)
  debug(`STORE_PATH:${STORE_PATH}`)
  debug(`PACKAGE_NAME:${PACKAGE_NAME}`)
  debug(`PACKAGE_VERSION:${PACKAGE_VERSION}`)
}
