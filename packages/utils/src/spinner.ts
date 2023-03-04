import ora from 'ora'
import chalk from 'chalk'
import { echoErrorBgText } from './chalk'

export type LastMsgType = {
  symbol: string
  text: string
} | null

export function useSpinner() {
  const spinner = ora()
  let lastMsg: LastMsgType = null
  let isPaused = false

  const logWithSpinner = (symbol?: string, msg?: string) => {
    if (!msg) {
      msg = symbol
      symbol = chalk.green('✔')
    }
    if (lastMsg) {
      spinner.stopAndPersist({
        symbol: lastMsg.symbol,
        text: lastMsg.text,
      })
    }
    spinner.text = ` ${msg}`
    lastMsg = {
      symbol: `${symbol} `,
      text: msg || '',
    }
    spinner.start()
  }

  const stopSpinner = (persist = false) => {
    if (!spinner.isSpinning)
      return

    if (lastMsg && persist !== false) {
      spinner.stopAndPersist({
        symbol: lastMsg.symbol,
        text: lastMsg.text,
      })
    }
    else {
      spinner.stop()
    }
    lastMsg = null
  }

  const successSpinner = (text: string) => {
    spinner.succeed(chalk.green(text))
  }

  const pauseSpinner = () => {
    if (spinner.isSpinning) {
      spinner.stop()
      isPaused = true
    }
  }

  const resumeSpinner = () => {
    if (isPaused) {
      spinner.start()
      isPaused = false
    }
  }

  const failSpinner = (text: string) => {
    spinner.fail(text)
  }

  const useLoading = async (fn: any, message: string, ...args: any[]) => {
    const oraInstance = ora(message)

    oraInstance.start()

    try {
      const res = await fn(...args)

      oraInstance.succeed()
      return res
    }
    catch (error: any) {
      console.log(error)
      console.log(echoErrorBgText(' Please check your network first！ '))
      oraInstance.fail('Request failed, refetch ...')
    }
  }

  return {
    spinner,
    useLoading,
    successSpinner,
    logWithSpinner,
    stopSpinner,
    pauseSpinner,
    resumeSpinner,
    failSpinner,
  }
}
