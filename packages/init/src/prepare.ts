import type { InitArgs } from '.'

export const getInheritParams = () => {
  const args = JSON.parse(process.argv.slice(2)[0])
  const inheritArgs: InitArgs = Object.create(null)
  inheritArgs.projectName = args[0]
  inheritArgs.force = args[1]
  inheritArgs.cmd = args[2]
  return inheritArgs
}
