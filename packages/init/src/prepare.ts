import type { InitArgs } from '.'

export const getInheritParams = () => {
  const args = JSON.parse(process.argv.slice(2)[0])
  const inheritArgs: InitArgs = Object.create(null)
  inheritArgs.projectName = args[0]
  inheritArgs.force = args[1]
  inheritArgs.cmd = args[2]
  return inheritArgs
}

// prepare 阶段
export async function prepare() {
  // const curPwd = process.cwd()
  // TODO: 搜索、检查模板列表，curPwd目录判断，强制创建确认清空
  // 用户界面选择获取模板信息
}
