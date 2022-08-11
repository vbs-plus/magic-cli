import chalk from 'chalk'

export const echoSuccessText = (text: string) => chalk.green(text)
export const echoWarnText = (text: string) => chalk.yellow(text)
export const echoInfoText = (text: string) => chalk.cyan(text)
export const echoErrorText = (text: string) => chalk.red(text)
export const echoBlueText = (text: string) => chalk.rgb(15, 100, 204)(text)

export const echoSuccessBgText = (text: string) => chalk.green.inverse(text)
export const echoWarnBgText = (text: string) => chalk.yellow.inverse(text)
export const echoInfoBgText = (text: string) => chalk.cyan.inverse(text)
export const echoErrorBgText = (text: string) => chalk.red.inverse(text)
export const echoBlueBgText = (text: string) =>
  chalk.rgb(15, 100, 204).inverse(text)
