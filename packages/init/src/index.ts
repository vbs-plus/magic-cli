import { useLogger } from '@vbs/magic-cli-utils'
import consola from 'consola'
import { getInheritParams, prepare } from './prepare'

export interface InitArgs {
  projectName?: string
  force?: boolean
  cmd?: any
}

const { debug } = useLogger()

export const init = async () => {
  try {
    const args = getInheritParams()
    debug(` init args: ${JSON.stringify(args)}`)
    await prepare(args)
  }
  catch (e: any) {
    consola.error(new Error(e.message))
  }
}

init()
