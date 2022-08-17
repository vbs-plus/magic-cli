interface PackageOptions {
    TP_PATH: string;
    STORE_PATH: string;
    PACKAGE_NAME: string;
    PACKAGE_VERSION: string;
}
declare class Package {
    /** 指定安装目录 */
    TP_PATH: string;
    /** 指定缓存目录，无 TP_PATH生效 */
    STORE_PATH: string;
    /** 包名 */
    PACKAGE_NAME: string;
    /** 包版本 */
    PACKAGE_VERSION: string;
    /** 辅助 npminstall 拼接 path */
    NPM_INSTALL_PREFIX: string;
    constructor(options: PackageOptions);
    getCacheFilePath(packageVersion: string): string;
    exists(): Promise<boolean>;
    prepare(): Promise<void>;
    init(): Promise<any>;
    update(): Promise<void>;
    private _getPackageMainEntry;
    /** 获取最终的执行入口文件路径 */
    getRootFilePath(): Promise<string>;
}

export { Package, PackageOptions };
