export * from './chalk'
export * from './enum'
export * from './figlet'
export * from './logger'
export * from './spinner'
export * from './npm'
export * from './spawn'
export * from './template'

export function toLine(str: string) {
  return str.replace('/([A-Z])/g', '-$1').toLowerCase()
}
