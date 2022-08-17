export interface TemplateListItem {
  name: string
  npmName: string
  version: string
  type: 'normal' | 'custom'
  installCommand: string
  startCommand: string
  tag: string[]
  ignore: string[]
  buildPath?: string
  examplePath?: string
}

export async function getTemplateList() {
  const templateList: TemplateListItem[] = [{
    name: 'za-zi',
    npmName: 'za-zi',
    version: '0.0.6',
    type: 'normal',
    installCommand: 'zi',
    startCommand: 'zi',
    tag: ['project'],
    ignore: [],
  }]
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(templateList)
    }, 3000)
  }).catch((e) => { console.log(e) })
}
