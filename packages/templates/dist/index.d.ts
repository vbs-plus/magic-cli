interface TemplateListItem {
    name: string;
    npmName: string;
    version: string;
    type: 'project' | 'component';
    installCommand: string;
    startCommand: string;
    tag?: string[];
    isCustom: 0 | 1;
    ignore?: string[];
    buildPath?: string;
    examplePath?: string;
}
declare type ReturnType = 'project' | 'component' | 'all';
/**
 * 根据 npmName 获取模板详情
 * @param npmName 发布的 NpmName
 */
declare const getTemplateByNpmName: (npmName: string) => Promise<TemplateListItem | null>;
/**
 * 新增单个模板
 * @param params 模板详细参数
 */
declare const addSingleTemplate: (params: TemplateListItem) => Promise<{
    insertedId: string;
}>;
/**
 * 批量新增模板
 * @param params 批量模板参数
 */
declare const addMultiTemplate: (params: TemplateListItem[]) => Promise<{
    insertedIds: string[];
}>;
/**
 *更新单个模板
 * @param npmName 发布的 NpmName
 * @param params 需更新的参数
 */
declare const updateSingleTemplateByNpmName: (npmName: string, params: Partial<TemplateListItem>) => Promise<{
    matchedCount: number;
    modifiedCount: number;
    upsertedId?: string | undefined;
}>;
/**
 * 根据类型返回模板列表
 * @param type 需要返回的模板类型
 */
declare const getTemplateListByType: (type: ReturnType) => Promise<{
    documents: TemplateListItem[];
}>;
/**
 * 根据 NpmNames 删除模板
 * @param npmNames 发布的 NpmName数组
 */
declare const deleteTemplateByNpmName: (npmNames: string[]) => Promise<{
    deletedCount: number;
}>;

export { ReturnType, TemplateListItem, addMultiTemplate, addSingleTemplate, deleteTemplateByNpmName, getTemplateByNpmName, getTemplateListByType, updateSingleTemplateByNpmName };
