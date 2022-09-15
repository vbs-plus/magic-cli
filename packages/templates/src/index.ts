import { createMongoDBDataAPI } from 'mongodb-data-api'
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

const request = createMongoDBDataAPI({
  apiKey: MONGO_API_CONFIG.API_KEY,
  urlEndpoint: MONGO_API_CONFIG.API_BASE_URL,
})

const commnBodyParams = {
  dataSource: MONGO_API_CONFIG.DATASOURCE,
  database: MONGO_API_CONFIG.DATABASE,
  collection: MONGO_API_CONFIG.COLLECTION,
}

export type ReturnType = 'project' | 'component' | 'all'

/**
 * 根据 npmName 获取模板详情
 * @param npmName 发布的 NpmName
 */
export const getTemplateByNpmName = async(npmName: string) => {
  return request.findOne<TemplateListItem>({
    ...commnBodyParams,
    filter: { npmName },
  }).then(res => res.document)
}

/**
 * 新增单个模板
 * @param params 模板详细参数
 */
export const addSingleTemplate = async(params: TemplateListItem) => {
  return request.insertOne({
    ...commnBodyParams,
    document: params,
  })
}

/**
 * 批量新增模板
 * @param params 批量模板参数
 */
export const addMultiTemplate = async(params: TemplateListItem[]) => {
  return request.insertMany({
    ...commnBodyParams,
    documents: params,
  })
}

/**
 *更新单个模板
 * @param npmName 发布的 NpmName
 * @param params 需更新的参数
 */
export const updateSingleTemplateByNpmName = async(npmName: string, params: Partial<TemplateListItem>) => {
  return request.updateOne({
    ...commnBodyParams,
    filter: { npmName },
    update: { $set: params },
  })
}

/**
 * 根据类型返回模板列表
 * @param type 需要返回的模板类型
 */
export const getTemplateListByType = async(type: ReturnType) => {
  return request.find<TemplateListItem>({
    ...commnBodyParams,
    filter: type === 'all' ? {} : { type: type as Omit<ReturnType, 'all'> },
  })
}

/**
 * 根据 NpmNames 删除模板
 * @param npmNames 发布的 NpmName数组
 */
export const deleteTemplateByNpmName = async(npmNames: string[]) => {
  return request.deleteMany({
    ...commnBodyParams,
    filter: {
      npmName: { $in: npmNames },
    },
  })
}
