import os from 'os'
import path from 'path'
import { printMagicLogo, useLogger, useSpinner } from 'magic-cli-utils'
import rootCheck from 'root-check'
import fse from 'fs-extra'
import dotenv from 'dotenv'
import pkg from '../package.json'
import { MAGIC_HOME_ENV } from './enum'

const { error, debug } = useLogger()
const homePath = os.homedir()

export function checkUserHome(homePath: string) {
  if (!homePath || !fse.existsSync(homePath))
    throw new Error(error('当前登录用户主目录不存在', { needConsole: false }))
}

export function checkEnv() {
  // TODO: 补充文档，可配置全局magic_home_path,代表缓存操作的根目录
  const homeEnvPath = path.resolve(homePath, MAGIC_HOME_ENV)
  if (fse.existsSync(homeEnvPath)) {
    console.log(dotenv.config({
      path: homeEnvPath,
    }))
    console.log(process.env.MAGIC_HOME_PATH)
  }

  console.log(homeEnvPath)
}

export async function prepare() {
  const { logWithSpinner, successSpinner } = useSpinner()

  printMagicLogo(pkg.version)
  logWithSpinner('👉 检查构建环境...')
  console.log()

  try {
    rootCheck()
    checkUserHome(homePath)
    debug(homePath)
    checkEnv()
    successSpinner('构建环境正常！')
  }
  catch (error) {

  }
}

prepare()
