export const DEFAULT_HOME_PATH = '.magic-cli'
export const MAGIC_HOME_ENV = '.magic-cli.env'
export const DEFAULT_PACKAGE_VERSION = 'latest'
export const DEFAULT_STORE_PATH = 'dependencies'
export const DEFAULT_STORE_SUFIX = 'node_modules'

/**
 * 动态配置命令读包，如有新命令，请务必配置此选项
 */
export enum PACKAGE_SETTINGS {
  init = 'magic-cli-init',
  add = 'magic-cli-add',
  // ...
}
