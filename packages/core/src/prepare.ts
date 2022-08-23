import os from 'os'
import path from 'path'
import semver from 'semver'
import {
  DEFAULT_HOME_PATH,
  LOWEST_NODE_VERSION,
  MAGIC_HOME_ENV, getNpmLatestVersion,
  printMagicLogo,
  useLogger,
  useSpinner,
} from '@vbs/magic-cli-utils'
import rootCheck from 'root-check'
import fse from 'fs-extra'
import dotenv from 'dotenv'
import pkg from '../package.json'

const { error, warn, debug } = useLogger()
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
  debug(` HOME_ENV_PATH ${homeEnvPath}`)
  debug(` MAGIC_CLI_HOME_PATH ${process.env.MAGIC_CLI_HOME_PATH!}`)
  debug(` MAGIC_HOME_PATH ${process.env.MAGIC_HOME_PATH!}`)
}

export async function checkPackageUpdate() {
  const version = pkg.version
  const packageName = pkg.name
  const latestVersion = await getNpmLatestVersion(packageName)
  // debug(" Latest Version(sync)" + latestVersion);
  if (latestVersion && semver.gt(latestVersion, version)) {
    warn(
      `最新版本已发布，请手动更新脚手架版本，当前版本为：${version}，最新版本为：${latestVersion} []~(￣▽￣)~* `,
    )
  }
}

export function checkNodeVersion() {
  const currentVersion = process.version
  if (!semver.gte(currentVersion, LOWEST_NODE_VERSION))
    throw new Error(error(`当前 Node 版本过低，推荐安装 v${LOWEST_NODE_VERSION} 以上 Node 版本`, { needConsole: false }))
}

export async function prepare() {
  const { logWithSpinner, successSpinner, failSpinner } = useSpinner()

  printMagicLogo(pkg.version)
  logWithSpinner('👉 检查构建环境...')
  console.log()

  try {
    // TODO： 构建环境异常测试
    rootCheck()
    checkUserHome(homePath)
    checkEnv()
    await checkPackageUpdate()
    checkNodeVersion()
    successSpinner('构建环境正常！')
  }
  catch (error) {
    failSpinner('检查构建环境异常')
    console.log(error)
    process.exit(-1)
  }
}
