import consola from 'consola'
import { InitCommander } from './commander'
import { prepare } from './prepare'

const core = async() => {
  try {
    await prepare()
    InitCommander()
  } catch (e: any) {
    if (e instanceof Error && process.env.DEBUG)
      consola.error(e)
    else
      consola.error(e)
  }
}

core()

export * from './commander'
export * from './exec'
export * from './prepare'
