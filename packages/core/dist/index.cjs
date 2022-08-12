'use strict';

const os = require('os');
const path = require('path');
const semver = require('semver');
const magicCliUtils = require('magic-cli-utils');
const rootCheck = require('root-check');
const fse = require('fs-extra');
const dotenv = require('dotenv');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const os__default = /*#__PURE__*/_interopDefaultLegacy(os);
const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);
const rootCheck__default = /*#__PURE__*/_interopDefaultLegacy(rootCheck);
const fse__default = /*#__PURE__*/_interopDefaultLegacy(fse);
const dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);

const name = "magic-cli-core";
const version = "1.0.2";
const description = "";
const keywords = [
];
const license = "ISC";
const author = "";
const main = "./dist/index.cjs";
const module$1 = "./dist/index.mjs";
const types = "./dist/index.d.ts";
const exports$1 = {
	".": {
		require: "./dist/index.cjs",
		"import": "./dist/index.mjs",
		types: "./dist/index.d.ts"
	}
};
const files = [
	"dist",
	"bin"
];
const bin = {
	magic: "bin/magic.mjs"
};
const publishConfig = {
	access: "public"
};
const scripts = {
	dev: "unbuild -w",
	build: "unbuild",
	stub: "unbuild --stub",
	link: "pnpm link -g",
	test: "vitest"
};
const dependencies = {
	"@types/dotenv": "^8.2.0",
	"@types/fs-extra": "^9.0.13",
	"@types/node": "^18.6.4",
	"@types/root-check": "^1.0.0",
	"@types/semver": "^7.3.12",
	dotenv: "^16.0.1",
	"fast-glob": "^3.2.11",
	"fs-extra": "^10.1.0",
	"magic-cli-utils": "workspace:*",
	"root-check": "^2.0.0",
	semver: "^7.3.7",
	tslib: "^2.4.0",
	typescript: "^4.5.2",
	"umi-request": "^1.4.0",
	unbuild: "^0.8.8"
};
const pkg = {
	name: name,
	version: version,
	description: description,
	keywords: keywords,
	license: license,
	author: author,
	main: main,
	module: module$1,
	types: types,
	exports: exports$1,
	files: files,
	bin: bin,
	publishConfig: publishConfig,
	scripts: scripts,
	dependencies: dependencies
};

const DEFAULT_HOME_PATH = ".magic-cli";
const MAGIC_HOME_ENV = ".magic-cli.env";

const { error, debug, echo, warn } = magicCliUtils.useLogger();
const homePath = os__default.homedir();
function checkUserHome(homePath2) {
  if (!homePath2 || !fse__default.existsSync(homePath2))
    throw new Error(error("\u5F53\u524D\u767B\u5F55\u7528\u6237\u4E3B\u76EE\u5F55\u4E0D\u5B58\u5728", { needConsole: false }));
}
function initDefaultConfig() {
  process.env.MAGIC_CLI_HOME_PATH = process.env.MAGIC_HOME_PATH ? path__default.join(homePath, process.env.MAGIC_HOME_PATH) : path__default.join(homePath, DEFAULT_HOME_PATH);
}
function checkEnv() {
  const homeEnvPath = path__default.resolve(homePath, MAGIC_HOME_ENV);
  if (fse__default.existsSync(homeEnvPath)) {
    dotenv__default.config({
      path: homeEnvPath
    });
  }
  initDefaultConfig();
  echo(" HOME_ENV_PATH ", homeEnvPath);
  echo(" MAGIC_CLI_HOME_PATH ", process.env.MAGIC_CLI_HOME_PATH);
  echo(" MAGIC_HOME_PATH ", process.env.MAGIC_HOME_PATH);
}
async function checkPackageUpdate() {
  const version = pkg.version;
  const latestVersion = "1.0.3";
  if (semver__default.gt(latestVersion, version)) {
    warn(
      `\u6700\u65B0\u7248\u672C\u5DF2\u53D1\u5E03\uFF0C\u8BF7\u624B\u52A8\u66F4\u65B0\u811A\u624B\u67B6\u7248\u672C\uFF0C\u5F53\u524D\u7248\u672C\u4E3A\uFF1A${version}\uFF0C\u6700\u65B0\u7248\u672C\u4E3A\uFF1A${latestVersion}`
    );
  }
}
async function prepare() {
  const { logWithSpinner, successSpinner } = magicCliUtils.useSpinner();
  magicCliUtils.printMagicLogo(pkg.version);
  logWithSpinner("\u{1F449} \u68C0\u67E5\u6784\u5EFA\u73AF\u5883...");
  console.log();
  try {
    rootCheck__default();
    checkUserHome(homePath);
    debug(homePath);
    checkEnv();
    checkPackageUpdate();
    successSpinner("\u6784\u5EFA\u73AF\u5883\u6B63\u5E38\uFF01");
  } catch (error2) {
    console.log(error2);
  }
}

const core = async () => {
  console.log("core change");
  await prepare();
  console.log(111);
};
core();
