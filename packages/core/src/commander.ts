import { Command } from 'commander'
import { useLogger } from '@vbs/magic-cli-utils'
import fse from 'fs-extra'
import consola from 'consola'
import pkg from '../package.json'
import { exec } from './exec'

export const InitCommander = () => {
  const program = new Command()
  const { info, echo } = useLogger()

  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', 'Whether to turn on Debug mode', false)
    .option('-tp, --targetPath <targetPath>', 'Specifies the command working directory', '')

  program
    .command('init [projectName]')
    .option('-f, --force', 'Whether to force initialization of the project', false)
    .action((projectName: string, { force }: { force: boolean }, cmd: Command) => {
      exec(projectName, force, cmd)
    })

  program
    .command('add [templateName]')
    .option('-f, --force', 'Whether to force the addition of a template', false)
    .action((templateName: string, { force }: { force: boolean }, cmd: Command) => {
      info(templateName)
      info(force)
      console.log(cmd)
      exec(templateName, force, cmd)
    })

  program
    .command('reset')
    .description('Reset the cli')
    .action(() => {
      try {
        const HOME_PATH = process.env.MAGIC_CLI_HOME_PATH || ''
        fse.removeSync(HOME_PATH)
        consola.success('The app is restarted successfully! \n')
      }
      catch (error) {
        consola.error(error)
      }
    })

  // Debug
  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.DEBUG = 'debug'
      info('Turn on DEBUG mode!')
    }
    else {
      process.env.DEBUG = ''
    }
  })

  // TargetPath
  program.on('option:targetPath', () => {
    process.env.TARGET_PATH = program.opts().targetPath
  })

  program.on('command:*', (cmd: any) => {
    const avaliableCommands = program.commands.map(item => item.name())
    consola.error(`未知命令${cmd[0]}`)

    if (avaliableCommands.length)
      echo(' Available commands ', avaliableCommands.join(','))
  })

  program.parse(process.argv)
  if (program.args && program.args.length < 1)
    program.outputHelp()

  // catch unhandle promise rejection
  program.on('unhandleRejection', (reason: any) => {
    consola.error(`unhandleRejection${reason}`)
    throw reason
  })
  // catch un handle exception
  program.on('uncaughtException', (error) => {
    consola.error(`uncaughtException${error}`)
    process.exit(-1)
  })
}
