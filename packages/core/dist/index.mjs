import { PACKAGE_SETTINGS, useLogger, DEFAULT_STORE_PATH, DEFAULT_STORE_SUFIX, spawn, DEFAULT_PACKAGE_VERSION, DEFAULT_HOME_PATH, MAGIC_HOME_ENV, getNpmLatestVersion, LOWEST_NODE_VERSION, printMagicLogo } from '@vbs/magic-cli-utils';
import { Command } from 'commander';
import path from 'path';
import { Package } from '@vbs/magic-cli-models';
import os from 'os';
import semver from 'semver';
import rootCheck from 'root-check';
import fse from 'fs-extra';
import dotenv from 'dotenv';
import ora from 'ora';

const name = "@vbs/magic-cli-core";
const version = "1.0.9-beta.15";
const description = "";
const keywords = [
];
const license = "ISC";
const author = "";
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
	"@vbs/magic-cli-models": "workspace:*",
	"@vbs/magic-cli-utils": "workspace:*",
	commander: "^9.4.0",
	dotenv: "^16.0.1",
	"fast-glob": "^3.2.11",
	"fs-extra": "^10.1.0",
	ora: "^6.1.2",
	"root-check": "^2.0.0",
	semver: "^7.3.7",
	tslib: "^2.4.0",
	typescript: "^4.5.2",
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
	module: module,
	types: types,
	exports: exports,
	files: files,
	bin: bin,
	publishConfig: publishConfig,
	scripts: scripts,
	dependencies: dependencies
};

const exec = async (...args) => {
  let TP_PATH = process.env.TARGET_PATH;
  const HOME_PATH = process.env.MAGIC_CLI_HOME_PATH;
  let STORE_PATH = "";
  const cmd = args[args.length - 1];
  const curCommand = cmd.name();
  const PACKAGE_NAME = PACKAGE_SETTINGS[curCommand];
  const PACKAGE_VERSION = DEFAULT_PACKAGE_VERSION;
  let pkg;
  const { debug, error } = useLogger();
  if (TP_PATH) {
    pkg = new Package({
      TP_PATH,
      STORE_PATH,
      PACKAGE_NAME,
      PACKAGE_VERSION
    });
  } else {
    TP_PATH = path.resolve(HOME_PATH, DEFAULT_STORE_PATH);
    STORE_PATH = path.resolve(TP_PATH, DEFAULT_STORE_SUFIX);
    pkg = new Package({
      TP_PATH,
      STORE_PATH,
      PACKAGE_NAME,
      PACKAGE_VERSION
    });
    debug(pkg);
    debug(`exist:${await pkg.exists()}`);
    if (await pkg.exists()) {
      debug("\u6267\u884C\u66F4\u65B0");
      await pkg.update();
    } else {
      debug("\u6267\u884C\u521D\u59CB\u5316");
      await pkg.init();
    }
  }
  const execFilePath = await pkg.getRootFilePath();
  if (!execFilePath)
    throw new Error(error("\u5F53\u524D\u6307\u5B9A\u6587\u4EF6\u5939\u8DEF\u5F84\u6709\u8BEF", { needConsole: false }));
  debug(`execFilePath:${execFilePath}`);
  debug(`TP_PATH:${TP_PATH}`);
  debug(`STORE_PATH:${STORE_PATH}`);
  debug(`PACKAGE_NAME:${pkg.PACKAGE_NAME}`);
  debug(`PACKAGE_VERSION:${pkg.PACKAGE_VERSION}`);
  try {
    const params = [...args];
    const _suffixObject = /* @__PURE__ */ Object.create(null);
    const commanderObject = params[params.length - 1];
    Object.keys(commanderObject).forEach((key) => {
      if (commanderObject.hasOwnProperty(key) && !key.startsWith("_") && key !== "parent")
        _suffixObject[key] = commanderObject[key];
    });
    params[params.length - 1] = _suffixObject;
    const child = spawn(
      "node",
      [execFilePath, `${JSON.stringify(params)}`],
      {
        cwd: process.cwd(),
        stdio: "inherit"
      }
    );
    child.on("error", (e) => {
      error(`\u591A\u8FDB\u7A0B\u4EE3\u7801\u6267\u884C\u5F02\u5E38: ${e.message}`);
      process.exit(1);
    });
    child.on("exit", (e) => {
      debug(`${curCommand} \u547D\u4EE4\u6267\u884C\u6210\u529F`);
      process.exit(e);
    });
  } catch (e) {
    error(`catch error ${e.message}`);
  }
};

const InitCommander = () => {
  const program = new Command();
  const { info, echo, error } = useLogger();
  program.name(Object.keys(pkg.bin)[0]).usage("<command> [options]").version(pkg.version).option("-d, --debug", "\u662F\u5426\u5F00\u542F Debug \u6A21\u5F0F", false).option("-tp, --targetPath <targetPath>", "\u6307\u5B9A\u76EE\u6807\u5B89\u88C5\u76EE\u5F55", "");
  program.command("init [projectName]").option("-f, --force", "\u662F\u5426\u5F3A\u5236\u521D\u59CB\u5316\u9879\u76EE", false).action(
    (projectName, { force }, cmd) => {
      exec(projectName, force, cmd);
    }
  );
  program.command("add [templateName]").option("-f, --force", "\u662F\u5426\u5F3A\u5236\u6DFB\u52A0\u6A21\u677F", false).action(
    (templateName, { force }, cmd) => {
      info(templateName);
      info(force);
      console.log(cmd);
      exec(templateName, force, cmd);
    }
  );
  program.on("option:debug", () => {
    if (program.opts().debug) {
      process.env.DEBUG = "debug";
      info("\u5F00\u542F DEBUG \u6A21\u5F0F");
    } else {
      process.env.DEBUG = "";
    }
  });
  program.on("option:targetPath", () => {
    process.env.TARGET_PATH = program.opts().targetPath;
  });
  program.on("command:*", (cmd) => {
    const avaliableCommands = program.commands.map((item) => item.name());
    error(`\u672A\u77E5\u547D\u4EE4${cmd[0]}`);
    if (avaliableCommands.length)
      echo(" \u53EF\u7528\u547D\u4EE4 ", avaliableCommands.join(","));
  });
  program.parse(process.argv);
  if (program.args && program.args.length < 1)
    program.outputHelp();
  program.on("unhandleRejection", (reason) => {
    error(`unhandleRejection${reason}`);
    throw reason;
  });
  program.on("uncaughtException", (error2) => {
    error2(`uncaughtException${error2}`);
    process.exit(-1);
  });
};

const { error, warn, debug } = useLogger();
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
  debug(` HOME_ENV_PATH ${homeEnvPath}`);
  debug(` MAGIC_CLI_HOME_PATH ${process.env.MAGIC_CLI_HOME_PATH}`);
  debug(` MAGIC_HOME_PATH ${process.env.MAGIC_HOME_PATH}`);
}
async function checkPackageUpdate() {
  const version = pkg.version;
  const packageName = pkg.name;
  const latestVersion = await getNpmLatestVersion(packageName);
  if (latestVersion && semver.gt(latestVersion, version)) {
    console.log();
    warn(
      `\u6700\u65B0\u7248\u672C\u5DF2\u53D1\u5E03\uFF0C\u8BF7\u624B\u52A8\u66F4\u65B0\u811A\u624B\u67B6\u7248\u672C\uFF0C\u5F53\u524D\u7248\u672C\u4E3A\uFF1A${version}\uFF0C\u6700\u65B0\u7248\u672C\u4E3A\uFF1A${latestVersion} []~(\uFFE3\u25BD\uFFE3)~*\uFF0C\u63A2\u7D22\u8DDF\u591A\u5173\u4E8E Magic\uFF0C\u8BF7\u8BBF\u95EE: https://magic-cli.netlify.app/
`
    );
    console.log();
  }
}
function checkNodeVersion() {
  const currentVersion = process.version;
  if (!semver.gte(currentVersion, LOWEST_NODE_VERSION))
    throw new Error(error(`\u5F53\u524D Node \u7248\u672C\u8FC7\u4F4E\uFF0C\u63A8\u8350\u5B89\u88C5 v${LOWEST_NODE_VERSION} \u4EE5\u4E0A Node \u7248\u672C`, { needConsole: false }));
}
async function prepare() {
  printMagicLogo(pkg.version);
  const spinner = ora({
    text: "\u{1F449} \u68C0\u67E5\u6784\u5EFA\u73AF\u5883...  \n",
    spinner: "material"
  });
  spinner.start();
  try {
    rootCheck();
    checkUserHome(homePath);
    checkEnv();
    await checkPackageUpdate();
    checkNodeVersion();
    spinner.succeed("\u6784\u5EFA\u73AF\u5883\u6B63\u5E38\uFF01\n");
  } catch (error2) {
    spinner.fail("\u68C0\u67E5\u6784\u5EFA\u73AF\u5883\u5F02\u5E38! \n");
    console.log(error2);
    process.exit(-1);
  }
}

const core = async () => {
  const { error } = useLogger();
  try {
    await prepare();
    InitCommander();
  } catch (e) {
    if (e instanceof Error && process.env.DEBUG)
      console.log(e);
    else
      error(e.msg);
  }
};
core();

export { InitCommander, checkEnv, checkNodeVersion, checkPackageUpdate, checkUserHome, exec, initDefaultConfig, prepare };
