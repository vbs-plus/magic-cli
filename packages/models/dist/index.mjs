import path from 'path';
import fs from 'fs';
import { useLogger, getNpmLatestVersion } from '@vbs/magic-cli-utils';
import fse from 'fs-extra';
import { findUp } from 'find-up';
import npminstall from 'npminstall';

var NPM_REGISTRY_ORIGIN = /* @__PURE__ */ ((NPM_REGISTRY_ORIGIN2) => {
  NPM_REGISTRY_ORIGIN2["NPM"] = "https://registry.npmjs.org";
  NPM_REGISTRY_ORIGIN2["TAOBAO"] = "https://registry.npmjs.org";
  return NPM_REGISTRY_ORIGIN2;
})(NPM_REGISTRY_ORIGIN || {});

const { debug } = useLogger();
class Package {
  constructor(options) {
    if (!options)
      throw new Error("package options cannot be empty");
    this.TP_PATH = options.TP_PATH;
    this.STORE_PATH = options.STORE_PATH;
    this.PACKAGE_NAME = options.PACKAGE_NAME;
    this.PACKAGE_VERSION = options.PACKAGE_VERSION;
    this.NPM_INSTALL_PREFIX = this.PACKAGE_NAME.replace("/", "_");
  }
  getCacheFilePath(packageVersion) {
    return path.resolve(
      this.STORE_PATH,
      `_${this.NPM_INSTALL_PREFIX}@${packageVersion}@${this.PACKAGE_NAME}`
    );
  }
  async exists() {
    if (this.STORE_PATH) {
      try {
        await this.prepare();
      } catch (error) {
        console.log(error);
      }
      return await fse.pathExists(this.getCacheFilePath(this.PACKAGE_VERSION));
    } else {
      return await fse.pathExists(this.TP_PATH);
    }
  }
  async prepare() {
    if (this.STORE_PATH && !await fse.pathExists(this.STORE_PATH))
      fse.mkdirSync(this.STORE_PATH, { recursive: true });
    if (this.PACKAGE_VERSION === "latest")
      this.PACKAGE_VERSION = await getNpmLatestVersion(this.PACKAGE_NAME);
  }
  async init() {
    return npminstall({
      root: this.TP_PATH,
      storeDir: this.STORE_PATH,
      registry: NPM_REGISTRY_ORIGIN.NPM,
      pkgs: [
        {
          name: this.PACKAGE_NAME,
          version: this.PACKAGE_VERSION
        }
      ]
    });
  }
  async update() {
    await this.prepare();
    const latestPackageVersion = await getNpmLatestVersion(this.PACKAGE_NAME);
    debug(
      `exist${await fse.pathExists(this.getCacheFilePath(latestPackageVersion))}${this.getCacheFilePath(latestPackageVersion)}`
    );
    if (!await fse.pathExists(this.getCacheFilePath(latestPackageVersion))) {
      await npminstall({
        root: this.TP_PATH,
        storeDir: this.STORE_PATH,
        registry: NPM_REGISTRY_ORIGIN.NPM,
        pkgs: [
          {
            name: this.PACKAGE_NAME,
            version: latestPackageVersion
          }
        ]
      });
    }
    this.PACKAGE_VERSION = latestPackageVersion;
  }
  async _getPackageMainEntry(cwd) {
    const packageJsonPath = await findUp("package.json", { cwd });
    debug(`packageJsonPath:${packageJsonPath}`);
    if (packageJsonPath) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      if (pkg && pkg.main)
        return path.resolve(cwd, pkg.main);
    }
    return "";
  }
  async getRootFilePath() {
    if (this.STORE_PATH)
      return await this._getPackageMainEntry(this.getCacheFilePath(this.PACKAGE_VERSION));
    else
      return await this._getPackageMainEntry(this.TP_PATH);
  }
}

export { Package };
