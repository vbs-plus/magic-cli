import axios from 'axios'
import { MONGO_API_CONFIG } from './enum'

export interface TemplateListItem {
  name: string
  npmName: string
  version: string
  type: 'project' | 'component'
  installCommand: string
  startCommand: string
  tag?: string[]
  isCustom: 0 | 1
  ignore?: string[]
  buildPath?: string
  examplePath?: string
}

const request = axios.create({
  baseURL: MONGO_API_CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: {
    'api-key': MONGO_API_CONFIG.API_KEY,
    'Content-Type': 'application/json',
  },
})

const commnBodyParams = {
  dataSource: MONGO_API_CONFIG.DATASOURCE,
  database: MONGO_API_CONFIG.DATABASE,
  collection: MONGO_API_CONFIG.COLLECTION,
}

export type ReturnType = 'all' | 'project' | 'component'

/**
 * 根据 npmName 获取模板详情
 * @param npmName 发布的 NpmName
 */
export const getTemplateByNpmName = async (npmName: string) => {
  if (!npmName)
    return null
  return (await request.post<{ document: TemplateListItem }>('/action/findOne', {
    ...commnBodyParams,
    filter: {
      npmName,
    },
  })).data
}

// /**
//  * 新增单个模板
//  * @param params 模板详细参数
//  */
// export const addSingleTemplate = async (params: TemplateListItem) => {

// }

// /**
//  * 批量新增模板
//  * @param params 批量模板参数
//  */
// export const addMultiTemplate = async (params: TemplateListItem[]) => { }

// /**
//  *
//  * @param npmName 发布的 NpmName
//  * @param params 需更新的参数
//  */
// export const updateSingleTemplateByNpmName = async (npmName: string, params: Partial<TemplateListItem>) => { }

// /**
//  *
//  * @param npmNames 发布的 NpmName数组
//  * @param params 需更新的参数
//  */
// export const updateMultiTemplate = async (npmNames: string[], params: Partial<TemplateListItem>) => { }

// /**
//  * 根据类型返回模板列表
//  * @param type 需要返回的模板类型
//  */
// export const getTemplateListByType = async (type: ReturnType) => {

// }

// /**
//  * 根据 NpmNames 删除模板
//  * @param npmNames 发布的 NpmName数组
//  */
// export const deleteTemplateByNpmName = async (npmNames: string[]) => {

// }

