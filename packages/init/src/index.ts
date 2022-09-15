import { useLogger } from '@vbs/magic-cli-utils'
import { getInheritParams, prepare } from './prepare'

export interface InitArgs {
  projectName?: string
  force?: boolean
  cmd?: any
}

const { error, debug } = useLogger()

export const init = async() => {
  try {
    const args = getInheritParams()
    debug(` init args: ${JSON.stringify(args)}`)
    await prepare(args)
  } catch (e: any) {
    throw new Error(error(e.message, { needConsole: false }))
  }
}

init()
