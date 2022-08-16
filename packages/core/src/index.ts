import { InitCommander } from './commander'
import { prepare } from './prepare'

const core = async () => {
  console.log('core start')
  try {
    await prepare()
    InitCommander()
  }
  catch (error) {
    if (error instanceof Error)
      console.log(error)
  }
}

core()

export * from './commander'
export * from './enum'
export * from './exec'
export * from './prepare'

