import os from 'os'
import path from 'path'
import semver from 'semver'
import {
  DEFAULT_HOME_PATH,
  LOWEST_NODE_VERSION,
  MAGIC_HOME_ENV, getNpmLatestVersion,
  printMagicLogo,
  useLogger,
} from '@vbs/magic-cli-utils'
import rootCheck from 'root-check'
import fse from 'fs-extra'
import dotenv from 'dotenv'
import ora from 'ora'
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
  if (latestVersion && semver.gt(latestVersion, version)) {
    console.log()
    warn(
      `最新版本已发布，请手动更新脚手架版本，当前版本为：${version}，最新版本为：${latestVersion} []~(￣▽￣)~*，探索跟多关于 Magic，请访问: https://magic-cli.netlify.app/\n`,
    )
    console.log()
  }
}

export function checkNodeVersion() {
  const currentVersion = process.version
  if (!semver.gte(currentVersion, LOWEST_NODE_VERSION))
    throw new Error(error(`当前 Node 版本过低，推荐安装 v${LOWEST_NODE_VERSION} 以上 Node 版本`, { needConsole: false }))
}

export async function prepare() {
  printMagicLogo(pkg.version)

  const spinner = ora({
    text: '👉 检查构建环境...  \n',
    spinner: 'material',
  })

  spinner.start()
  try {
    // TODO： 构建环境异常测试
    rootCheck()
    checkUserHome(homePath)
    checkEnv()
    await checkPackageUpdate()
    checkNodeVersion()
    spinner.succeed('构建环境正常！\n')
  } catch (error) {
    spinner.fail('检查构建环境异常! \n')
    console.log(error)
    process.exit(-1)
  }
}
