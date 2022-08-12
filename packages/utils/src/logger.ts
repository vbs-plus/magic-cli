import chalk from 'chalk'
import stripAnsi from 'strip-ansi'
import { echoInfoBgText } from './chalk'
import { LOGGER_MSG_ENUM } from './enum'
import { useSpinner } from './spinner'

export interface LoggerParams {
  needConsole?: boolean
}

export const useLogger = () => {
  const { stopSpinner } = useSpinner()
  const format = (label: string, msg: string) => {
    return msg
      .split('\n')
      .map((line, i) => {
        return i === 0
          ? `${label} ${line}`
          : line.padStart(stripAnsi(label).length + line.length + 1)
      })
      .join('\n')
  }

  const echo = (
    symbol: string,
    text: string,
  ) => {
    console.log(format(chalk.bgGreen(symbol), chalk.green(text)))
  }

  const debug = (text: string, options: LoggerParams = { needConsole: true }) => {
    if (options.needConsole && process.env.DEBUG)
      console.log(format(echoInfoBgText(LOGGER_MSG_ENUM.DEBUG), text))

    return format(echoInfoBgText(LOGGER_MSG_ENUM.DEBUG), text)
  }

  const info = (
    text: string,
    options: LoggerParams = { needConsole: true },
  ) => {
    if (options.needConsole)
      console.log(format(chalk.bgBlue(LOGGER_MSG_ENUM.INFO), text))

    return format(chalk.bgBlue(LOGGER_MSG_ENUM.INFO), text)
  }

  const done = (
    text: string,
    options: LoggerParams = { needConsole: true },
  ) => {
    if (options.needConsole)
      console.log(format(chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE), text))
    return format(chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE), text)
  }

  const warn = (
    text: string,
    options: LoggerParams = { needConsole: true },
  ) => {
    if (options.needConsole) {
      console.log(
        format(chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN), chalk.yellow(text)),
      )
    }

    return format(
      chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN),
      chalk.yellow(text),
    )
  }

  const error = (
    text: string,
    options: LoggerParams = { needConsole: true },
  ) => {
    stopSpinner()
    if (options.needConsole)
      console.error(format(chalk.bgRed(LOGGER_MSG_ENUM.ERROR), chalk.red(text)))

    return format(chalk.bgRed(LOGGER_MSG_ENUM.ERROR), chalk.red(text))
  }

  return {
    debug,
    info,
    done,
    warn,
    error,
    echo,
  }
}
