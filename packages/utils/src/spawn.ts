import cp from 'child_process'
import type { SpawnOptionsWithoutStdio } from 'child_process'

export const spawn = (
  command: string,
  args: string[],
  options: SpawnOptionsWithoutStdio & {
    stdio?: string
  } = {},
) => {
  // 适配win32
  const win32 = process.platform === 'win32'
  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args
  return cp.spawn(cmd, cmdArgs, options)
}
