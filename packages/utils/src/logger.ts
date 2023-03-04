import chalk from 'chalk'
import { echoInfoBgText } from './chalk'
import { LOGGER_MSG_ENUM } from './enum'
import { useSpinner } from './spinner'

export interface LoggerParams {
  needConsole?: boolean
}

export const useLogger = () => {
  const { stopSpinner } = useSpinner()

  const echo = (
    symbol: string,
    target: any,
  ) => {
    console.log(
      chalk.rgb(89, 206, 143).inverse(symbol),
      '',
      chalk.green(
        (typeof target === 'object' || typeof target === 'boolean')
          ? JSON.stringify(target)
          : target,
      ),
    )
  }

  const debug = (target: any, options: LoggerParams = { needConsole: true }) => {
    if (options.needConsole && process.env.DEBUG) {
      console.log(
        echoInfoBgText(LOGGER_MSG_ENUM.DEBUG),
        '',
        chalk.green((typeof target === 'object' || typeof target === 'boolean') ? JSON.stringify(target) : target),
      )
    }
    return `${echoInfoBgText(LOGGER_MSG_ENUM.DEBUG)} ${
      (typeof target === 'object' || typeof target === 'boolean')
        ? JSON.stringify(target)
        : target
    }`
  }

  const info = (
    target: any,
    options: LoggerParams = { needConsole: true },
  ) => {
    if (options.needConsole) {
      console.log(
        chalk.bgBlue(LOGGER_MSG_ENUM.INFO),
        '',
        chalk.blue((typeof target === 'object' || typeof target === 'boolean')
          ? JSON.stringify(target)
          : target),
      )
    }

    return `${chalk.bgBlue(LOGGER_MSG_ENUM.INFO)} ${(typeof target === 'object' || typeof target === 'boolean')
        ? JSON.stringify(target)
        : target}`
  }

  const done = (target: any, options: LoggerParams = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE),
        '',
        chalk.green((typeof target === 'object' || typeof target === 'boolean')
          ? JSON.stringify(target)
          : target),
      )
    }
    return `${chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE)} ${(typeof target === 'object' || typeof target === 'boolean')
        ? JSON.stringify(target)
        : target}`
  }

  const warn = (
    target: any,
    options: LoggerParams = { needConsole: true },
  ) => {
    if (options.needConsole) {
      console.log(
        chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN),
        '',
        chalk.yellow(
          (typeof target === 'object' || typeof target === 'boolean')
            ? JSON.stringify(target)
            : target,
        ),
      )
    }

    return `${chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN)} ${chalk.yellow(
      (typeof target === 'object' || typeof target === 'boolean')
        ? JSON.stringify(target)
        : target,
    )}`
  }

  const error = (
    target: any,
    options: LoggerParams = { needConsole: true },
  ) => {
    stopSpinner()
    if (options.needConsole) {
      console.error(
        chalk.bgRed(LOGGER_MSG_ENUM.ERROR),
        '',
        chalk.red(
          (typeof target === 'object' || typeof target === 'boolean')
            ? JSON.stringify(target)
            : target,
        ),
      )
    }

    return `${chalk.bgRed(LOGGER_MSG_ENUM.ERROR)} ${chalk.red(
        (typeof target === 'object' || typeof target === 'boolean')
          ? JSON.stringify(target)
          : target,
      )}`
  }

  return {
    chalk,
    debug,
    info,
    done,
    warn,
    error,
    echo,
  }
}
