// TODO: 记录一下此处的大坑，npminstall 默认无@types包，也没有导出全局入口文件，只能自己定义
// 1. 自己定义所有type，import等语句都需要写到里面，属于内置语句 详情：https://juejin.cn/post/7074783652772577316
declare module 'npminstall' {
  export interface npminstallOptions {
    // install root dir
    root?: string
    // optional packages need to install, default is package.json's dependencies and devDependencies
    pkgs?: [{ name: string; version: string }]
    // install to specific directory, default to root
    targetDir?: string
    // link bin to specific directory (for global install)
    binDir?: string
    // registry, default is https://registry.npmjs.org
    registry?: string
    // debug: false,
    storeDir?: string
    // ignoreScripts: true, // ignore pre/post install scripts, default is `false`
    // forbiddenLicenses: forbit install packages which used these licenses
  }
  export default function fn(options: npminstallOptions): any
}
