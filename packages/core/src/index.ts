import { useLogger } from '@vbs/magic-cli-utils'
import { InitCommander } from './commander'
import { prepare } from './prepare'

const core = async () => {
  const { error } = useLogger()
  try {
    await prepare()
    InitCommander()
  }
  catch (e: any) {
    if (e instanceof Error && process.env.DEBUG)
      console.log(e)
    else
      error(e.msg)
  }
}

core()

export * from './commander'
export * from './enum'
export * from './exec'
export * from './prepare'

