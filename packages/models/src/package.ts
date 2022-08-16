import path from 'path'
import fs from 'fs'
import { getNpmLatestVersion, useLogger } from 'magic-cli-utils'
import fse from 'fs-extra'
import { findUp } from 'find-up'
import npminstall from 'npminstall'
import { NPM_REGISTRY_ORIGIN } from './enum'

const { debug } = useLogger()

export interface PackageOptions {
  TP_PATH: string
  STORE_PATH: string
  PACKAGE_NAME: string
  PACKAGE_VERSION: string
}

export class Package {
  /** 指定安装目录 */
  public TP_PATH: string
  /** 指定缓存目录，无 TP_PATH生效 */
  public STORE_PATH: string

  /** 包名 */
  public PACKAGE_NAME: string
  /** 包版本 */
  public PACKAGE_VERSION: string
  /** 辅助 npminstall 拼接 path */
  public NPM_INSTALL_PREFIX: string

  constructor(options: PackageOptions) {
    if (!options)
      throw new Error('package options cannot be empty')

    this.TP_PATH = options.TP_PATH
    this.STORE_PATH = options.STORE_PATH
    this.PACKAGE_NAME = options.PACKAGE_NAME
    this.PACKAGE_VERSION = options.PACKAGE_VERSION
    this.NPM_INSTALL_PREFIX = this.PACKAGE_NAME.replace('/', '_')
  }

  // rules: https://github.com/cnpm/npminstall#node_modules-directory
  getCacheFilePath(packageVersion: string) {
    return path.resolve(
      this.STORE_PATH,
      `_${this.NPM_INSTALL_PREFIX}@${packageVersion}@${this.PACKAGE_NAME}`,
    )
  }

  async exists() {
    if (this.STORE_PATH) {
      try {
        await this.prepare()
      }
      catch (error) {
        console.log(error)
      }
      return await fse.pathExists(this.getCacheFilePath(this.PACKAGE_VERSION))
    }
    else { return await fse.pathExists(this.TP_PATH) }
  }

  async prepare() {
    if (this.STORE_PATH && !await fse.pathExists(this.STORE_PATH))
      fse.mkdirSync(this.STORE_PATH)

    if (this.PACKAGE_VERSION === 'latest')
      this.PACKAGE_VERSION = await getNpmLatestVersion(this.PACKAGE_NAME)
  }

  async init() {
    return npminstall({
      root: this.TP_PATH,
      storeDir: this.STORE_PATH, // 默认为 ''
      registry: NPM_REGISTRY_ORIGIN.NPM,
      pkgs: [
        {
          name: this.PACKAGE_NAME,
          version: this.PACKAGE_VERSION,
        },
      ],
    })
  }

  async update() {
    await this.prepare()

    const latestPackageVersion = await getNpmLatestVersion(this.PACKAGE_NAME)
    // 无缓存最新版本目录 执行安装
    if (!await fse.pathExists(this.getCacheFilePath(latestPackageVersion))) {
      await npminstall({
        root: this.TP_PATH,
        storeDir: this.STORE_PATH,
        registry: NPM_REGISTRY_ORIGIN.NPM,
        pkgs: [
          {
            name: this.PACKAGE_NAME,
            version: latestPackageVersion,
          },
        ],
      })
    }
    this.PACKAGE_VERSION = latestPackageVersion
  }

  private async _getPackageMainEntry(cwd: string) {
    const packageJsonPath = await findUp('package.json', { cwd })
    debug(`packageJsonPath:${packageJsonPath}`)
    if (packageJsonPath) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (pkg && pkg.main)
        return path.resolve(cwd, pkg.main)
    }
    return ''
  }

  /** 获取最终的执行入口文件路径 */
  async getRootFilePath() {
    if (this.STORE_PATH)
      return await this._getPackageMainEntry(this.getCacheFilePath(this.PACKAGE_VERSION))
    else
      return await this._getPackageMainEntry(this.TP_PATH)
  }
}
