import os from 'os'
import path from 'path'
import {
  getNpmLatestVersion,
  getNpmPackageData,
  getNpmSemverVersions,
  getNpmVersions,
  printMagicLogo,
  useLogger,
  useSpinner,
} from 'magic-cli-utils'
import rootCheck from 'root-check'
import fse from 'fs-extra'
import dotenv from 'dotenv'
import pkg from '../package.json'
import { DEFAULT_HOME_PATH, MAGIC_HOME_ENV } from './enum'

const { error, debug, echo } = useLogger()
const homePath = os.homedir()

export function checkUserHome(homePath: string) {
  if (!homePath || !fse.existsSync(homePath))
    throw new Error(error('当前登录用户主目录不存在', { needConsole: false }))
}

export function initDefaultConfig() {
  process.env.MAGIC_CLI_HOME_PATH = process.env.MAGIC_HOME_PATH
    ? path.join(homePath, process.env.MAGIC_HOME_PATH)
    : path.join(homePath, DEFAULT_HOME_PATH)
}

export function checkEnv() {
  // TODO: 补充文档，可配置全局magic_home_path,代表缓存操作的根目录
  const homeEnvPath = path.resolve(homePath, MAGIC_HOME_ENV)
  if (fse.existsSync(homeEnvPath)) {
    dotenv.config({
      path: homeEnvPath,
    })
  }
  initDefaultConfig()
  echo(' HOME_ENV_PATH ', homeEnvPath)
  echo(' MAGIC_CLI_HOME_PATH ', process.env.MAGIC_CLI_HOME_PATH!)
  echo(' MAGIC_HOME_PATH ', process.env.MAGIC_HOME_PATH!)
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

    console.log(await getNpmLatestVersion('za-zi'))
    console.log(await getNpmPackageData('za-zi'))
    console.log(await getNpmSemverVersions('za-zi', '0.0.2'))
    console.log(await getNpmVersions('za-zi'))
  }
  catch (error) {}
}
