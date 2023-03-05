import os from 'os'
import path from 'path'
import semver from 'semver'
import { DEFAULT_HOME_PATH, LOWEST_NODE_VERSION, MAGIC_HOME_ENV, getNpmLatestVersion, printMagicLogo, useLogger } from '@vbs/magic-cli-utils'
import rootCheck from 'root-check'
import fse from 'fs-extra'
import dotenv from 'dotenv'
import ora from 'ora'
import consola from 'consola'
import pkg from '../package.json'

const { error, debug } = useLogger()
const homePath = os.homedir()

export function checkUserHome(homePath: string) {
  if (!homePath || !fse.existsSync(homePath))
    consola.error(new Error('The home directory of the currently logged-on user does not exist!'))
}

export function initDefaultConfig() {
  process.env.MAGIC_CLI_HOME_PATH = process.env.MAGIC_HOME_PATH
    ? path.join(homePath, process.env.MAGIC_HOME_PATH)
    : path.join(homePath, DEFAULT_HOME_PATH)
}

export function checkEnv() {
  // TODO: Supplementary documentation, configurable global magic_home_path, represents the root directory of cache operations
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
    consola.warn(
      `The latest version is released, please manually update the scaffolding version, the current version is: ${version}, the latest version is: ${latestVersion} []~( ̄▽ ̄)~*, to explore and learn more about Magic, please visit: https://magic-cli.netlify.app/\n`,
    )
    console.log()
  }
}

export function checkNodeVersion() {
  const currentVersion = process.version
  if (!semver.gte(currentVersion, LOWEST_NODE_VERSION))
    throw new Error(error(`The current Node version is too low, it is recommended to install v${LOWEST_NODE_VERSION} or above Node version`, { needConsole: false }))
}

export async function prepare() {
  printMagicLogo(pkg.version)

  const spinner = ora({
    text: '👉 Check the build environment...  \n',
    spinner: 'material',
  })

  spinner.start()
  try {
    rootCheck()
    checkUserHome(homePath)
    checkEnv()
    await checkPackageUpdate()
    checkNodeVersion()
    spinner.succeed('The build environment is normal!\n')
  } catch (error) {
    spinner.fail('Check for build environment exceptions! \n')
    console.log(error)
    process.exit(-1)
  }
}
