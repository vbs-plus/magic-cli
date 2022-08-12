import { prepare } from './prepare'

const core = async () => {
  console.log('core change')
  await prepare()
  console.log(111)
}

console.log('core change test')

export default core
