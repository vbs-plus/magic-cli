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
    target: any,
  ) => {
    console.log(format(chalk.bgGreen(symbol), chalk.green(typeof target === 'object' ? JSON.stringify(target) : target)))
  }

  const debug = (target: any, options: LoggerParams = { needConsole: true }) => {
    if (options.needConsole && process.env.DEBUG) {
      console.log(
        format(
          echoInfoBgText(LOGGER_MSG_ENUM.DEBUG),
          typeof target === 'object' ? JSON.stringify(target) : target,
        ),
      )
    }

    return format(
      echoInfoBgText(LOGGER_MSG_ENUM.DEBUG),
      typeof target === 'object' ? JSON.stringify(target) : target,
    )
  }

  const info = (
    target: any,
    options: LoggerParams = { needConsole: true },
  ) => {
    if (options.needConsole) {
      console.log(
        format(
          chalk.bgBlue(LOGGER_MSG_ENUM.INFO),
          typeof target === 'object' ? JSON.stringify(target) : target,
        ),
      )
    }

    return format(
      chalk.bgBlue(LOGGER_MSG_ENUM.INFO),
      typeof target === 'object' ? JSON.stringify(target) : target,
    )
  }

  const done = (target: any, options: LoggerParams = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        format(
          chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE),
          typeof target === 'object' ? JSON.stringify(target) : target,
        ),
      )
    }
    return format(
      chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE),
      typeof target === 'object' ? JSON.stringify(target) : target,
    )
  }

  const warn = (
    target: any,
    options: LoggerParams = { needConsole: true },
  ) => {
    if (options.needConsole) {
      console.log(
        format(chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN), chalk.yellow(typeof target === 'object' ? JSON.stringify(target) : target)),
      )
    }

    return format(
      chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN),
      chalk.yellow(typeof target === 'object' ? JSON.stringify(target) : target),
    )
  }

  const error = (
    target: any,
    options: LoggerParams = { needConsole: true },
  ) => {
    stopSpinner()
    if (options.needConsole) {
      console.error(
        format(
          chalk.bgRed(LOGGER_MSG_ENUM.ERROR),
          chalk.red(
            typeof target === 'object' ? JSON.stringify(target) : target,
          ),
        ),
      )
    }

    return format(
      chalk.bgRed(LOGGER_MSG_ENUM.ERROR),
      chalk.red(typeof target === 'object' ? JSON.stringify(target) : target),
    )
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
