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
    .option('-d, --debug', '是否开启 Debug 模式', false)
    .option('-tp, --targetPath <targetPath>', '指定目标安装目录', '')

  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目', false)
    .action((projectName: string, { force }: { force: boolean }, cmd: Command) => {
      exec(projectName, force, cmd)
    })

  program
    .command('add [templateName]')
    .option('-f, --force', '是否强制添加模板', false)
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
        consola.success('重启应用成功! \n')
      } catch (error) {
        consola.error(error)
      }
    })

  // Debug
  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.DEBUG = 'debug'
      info('开启 DEBUG 模式')
    } else {
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

    if (avaliableCommands.length) echo(' 可用命令 ', avaliableCommands.join(','))
  })

  program.parse(process.argv)
  if (program.args && program.args.length < 1) program.outputHelp()

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
