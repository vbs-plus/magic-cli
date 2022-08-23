export enum LOGGER_MSG_ENUM {
  DEBUG = ' DEBUG ',
  INFO = ' INFO ',
  DONE = ' DONE ',
  WARN = ' WARN ',
  ERROR = ' ERROR ',
}

export const DEFAULT_HOME_PATH = '.magic-cli'
export const MAGIC_HOME_ENV = '.magic-cli.env'
export const DEFAULT_PACKAGE_VERSION = 'latest'
export const DEFAULT_STORE_PATH = 'dependencies'
export const DEFAULT_TEMPLATE_TARGET_PATH = 'template'
export const DEFAULT_STORE_SUFIX = 'node_modules'
export const LOWEST_NODE_VERSION = '12.0.0'

/**
 * 动态配置命令读包，如有新命令，请务必配置此选项
 */
export enum PACKAGE_SETTINGS {
  init = '@vbs/magic-cli-init',
  add = '@vbs/magic-cli-add',
  // ...
}
