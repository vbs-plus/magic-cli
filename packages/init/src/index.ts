import { useLogger } from '@vbs/magic-cli-utils'
import { getInheritParams } from './prepare'

export interface InitArgs {
  projectName?: string
  force?: boolean
  cmd?: any
}

const { error, echo } = useLogger()

export const init = async () => {
  try {
    const args = getInheritParams()
    echo(' init args ', args)
  }
  catch (e: any) {
    throw new Error(error(e.message, { needConsole: false }))
  }
}

init()
