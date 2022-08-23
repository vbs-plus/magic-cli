'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const path = require('path');
const fs = require('fs');
const magicCliUtils = require('@vbs/magic-cli-utils');
const fse = require('fs-extra');
const findUp = require('find-up');
const npminstall = require('npminstall');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const fse__default = /*#__PURE__*/_interopDefaultLegacy(fse);
const npminstall__default = /*#__PURE__*/_interopDefaultLegacy(npminstall);

var NPM_REGISTRY_ORIGIN = /* @__PURE__ */ ((NPM_REGISTRY_ORIGIN2) => {
  NPM_REGISTRY_ORIGIN2["NPM"] = "https://registry.npmjs.org";
  NPM_REGISTRY_ORIGIN2["TAOBAO"] = "https://registry.npmjs.org";
  NPM_REGISTRY_ORIGIN2["ZHONGAN"] = "https://npm.zhonganonline.com";
  return NPM_REGISTRY_ORIGIN2;
})(NPM_REGISTRY_ORIGIN || {});

const { debug } = magicCliUtils.useLogger();
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
    return path__default.resolve(
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
      return await fse__default.pathExists(this.getCacheFilePath(this.PACKAGE_VERSION));
    } else {
      return await fse__default.pathExists(this.TP_PATH);
    }
  }
  async prepare() {
    if (this.STORE_PATH && !await fse__default.pathExists(this.STORE_PATH))
      fse__default.mkdirSync(this.STORE_PATH, { recursive: true });
    if (this.PACKAGE_VERSION === "latest")
      this.PACKAGE_VERSION = await magicCliUtils.getNpmLatestVersion(this.PACKAGE_NAME);
  }
  async init() {
    return npminstall__default({
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
    const latestPackageVersion = await magicCliUtils.getNpmLatestVersion(this.PACKAGE_NAME);
    debug(
      `exist${await fse__default.pathExists(this.getCacheFilePath(latestPackageVersion))}${this.getCacheFilePath(latestPackageVersion)}`
    );
    if (!await fse__default.pathExists(this.getCacheFilePath(latestPackageVersion))) {
      await npminstall__default({
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
    const packageJsonPath = await findUp.findUp("package.json", { cwd });
    debug(`packageJsonPath:${packageJsonPath}`);
    if (packageJsonPath) {
      const pkg = JSON.parse(fs__default.readFileSync(packageJsonPath, "utf8"));
      if (pkg && pkg.main)
        return path__default.resolve(cwd, pkg.main);
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

exports.Package = Package;
