import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import gradient from 'gradient-string'
import { echoInfoText } from './chalk'

export function printMagicLogo(version: string) {
  clear()
  console.log(
    `\n${(`${gradient.vice(
      figlet.textSync('Magic Cli', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
        whitespaceBreak: true,
        width: 200,
      }),
    )} ${chalk.cyanBright(`[version: v${version}]`)}
  `)}`,
  )
  console.log(
     `\r\nRun ${echoInfoText(
       'magic <command> --help',
     )} for detailed usage of given command\r\n`,
  )
}
