import { log } from 'pmrepo-utils/src'

const core = () => {
  console.log('core change')
  log.info('test', 'Hello world!')
}

console.log('core change test')
log.info('test', 'Hello world!')

export default core
