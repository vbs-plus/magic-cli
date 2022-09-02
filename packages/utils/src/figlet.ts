import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import gradient from 'gradient-string'
import { echoInfoText } from './chalk'

export function printMagicLogo(version: string) {
  clear()

  console.log(
    gradient.teen(
      figlet.textSync('MAGIC CLI', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
        font: '3D-ASCII',
        whitespaceBreak: true,
      }),
    ),
  )
  console.log(
     `\r\nRun ${echoInfoText(
       'magic <command> --help',
     )} for detailed usage of given command\r\n`,
  )
  console.log(`当前脚手架版本为: ${chalk.rgb(89, 206, 143).inverse(` ${version} `)} \r\n`)
}
