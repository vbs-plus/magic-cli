import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import { echoInfoText } from './chalk'

export function printMagicLogo(version: string) {
  clear()

  console.log('*************************************************')
  console.log(
    chalk.blue(
      figlet.textSync('Magic Cli', { horizontalLayout: 'full' }),
    ),
  )
  console.log('*************************************************')
  console.log(
     `\r\nRun ${echoInfoText(
       'magic <command> --help',
     )} for detailed usage of given command\r\n`,
  )
  console.log(`当前脚手架版本为: ${chalk.rgb(89, 206, 143).inverse(` ${version} `)} \r\n`)
}
