import os from 'os';
import path from 'path';
import { useLogger, useSpinner, printMagicLogo, getNpmLatestVersion, getNpmPackageData, getNpmSemverVersions, getNpmVersions } from 'magic-cli-utils';
import rootCheck from 'root-check';
import fse from 'fs-extra';
import dotenv from 'dotenv';

const name = "magic-cli-core";
const version = "1.0.2";
const description = "";
const keywords = [
];
const license = "ISC";
const author = "";
const bin = {
	magic: "bin/magic.mjs"
};
const main = "./dist/index.cjs";
const module = "./dist/index.mjs";
const types = "./dist/index.d.ts";
const exports = {
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
const publishConfig = {
	access: "public"
};
const scripts = {
	dev: "rollup -c -w",
	build: "unbuild",
	link: "pnpm link -g",
	test: "vitest"
};
const dependencies = {
	"@types/dotenv": "^8.2.0",
	"@types/fs-extra": "^9.0.13",
	"@types/node": "^18.6.4",
	"@types/root-check": "^1.0.0",
	dotenv: "^16.0.1",
	"fast-glob": "^3.2.11",
	"fs-extra": "^10.1.0",
	"magic-cli-utils": "workspace:1.0.0",
	"root-check": "^2.0.0",
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
	bin: bin,
	main: main,
	module: module,
	types: types,
	exports: exports,
	files: files,
	publishConfig: publishConfig,
	scripts: scripts,
	dependencies: dependencies
};

const DEFAULT_HOME_PATH = ".magic-cli";
const MAGIC_HOME_ENV = ".magic-cli.env";

const { error, debug, echo } = useLogger();
const homePath = os.homedir();
function checkUserHome(homePath2) {
  if (!homePath2 || !fse.existsSync(homePath2))
    throw new Error(error("\u5F53\u524D\u767B\u5F55\u7528\u6237\u4E3B\u76EE\u5F55\u4E0D\u5B58\u5728", { needConsole: false }));
}
function initDefaultConfig() {
  process.env.MAGIC_CLI_HOME_PATH = process.env.MAGIC_HOME_PATH ? path.join(homePath, process.env.MAGIC_HOME_PATH) : path.join(homePath, DEFAULT_HOME_PATH);
}
function checkEnv() {
  const homeEnvPath = path.resolve(homePath, MAGIC_HOME_ENV);
  if (fse.existsSync(homeEnvPath)) {
    dotenv.config({
      path: homeEnvPath
    });
  }
  initDefaultConfig();
  echo(" HOME_ENV_PATH ", homeEnvPath);
  echo(" MAGIC_CLI_HOME_PATH ", process.env.MAGIC_CLI_HOME_PATH);
  echo(" MAGIC_HOME_PATH ", process.env.MAGIC_HOME_PATH);
}
async function prepare() {
  const { logWithSpinner, successSpinner } = useSpinner();
  printMagicLogo(pkg.version);
  logWithSpinner("\u{1F449} \u68C0\u67E5\u6784\u5EFA\u73AF\u5883...");
  console.log();
  try {
    rootCheck();
    checkUserHome(homePath);
    debug(homePath);
    checkEnv();
    successSpinner("\u6784\u5EFA\u73AF\u5883\u6B63\u5E38\uFF01");
    console.log(await getNpmLatestVersion("za-zi"));
    console.log(await getNpmPackageData("za-zi"));
    console.log(await getNpmSemverVersions("za-zi", "0.0.2"));
    console.log(await getNpmVersions("za-zi"));
  } catch (error2) {
  }
}

const core = async () => {
  console.log("core change");
  await prepare();
  console.log(111);
};
console.log("core change test");

export { core as default };
