// src/index.ts
import { useLogger as useLogger4 } from "@vbs/magic-cli-utils";

// src/commander.ts
import { Command } from "commander";
import { useLogger as useLogger2 } from "@vbs/magic-cli-utils";

// package.json
var package_default = {
  name: "@vbs/magic-cli-core",
  version: "1.0.6",
  description: "",
  keywords: [],
  license: "ISC",
  author: "",
  main: "./dist/index.cjs",
  module: "./dist/index.mjs",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      require: "./dist/index.cjs",
      import: "./dist/index.mjs",
      types: "./dist/index.d.ts"
    }
  },
  files: [
    "dist",
    "bin"
  ],
  bin: {
    magic: "bin/magic.mjs"
  },
  publishConfig: {
    access: "public"
  },
  scripts: {
    build: "tsup",
    stub: "tsup --watch",
    link: "pnpm link -g",
    test: "vitest"
  },
  dependencies: {
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
    typescript: "^4.5.2"
  }
};

// src/exec.ts
import path from "path";
import { Package } from "@vbs/magic-cli-models";
import {
  DEFAULT_PACKAGE_VERSION,
  DEFAULT_STORE_PATH,
  DEFAULT_STORE_SUFIX,
  PACKAGE_SETTINGS,
  spawn,
  useLogger
} from "@vbs/magic-cli-utils";
var exec = async (...args) => {
  let TP_PATH = process.env.TARGET_PATH;
  const HOME_PATH = process.env.MAGIC_CLI_HOME_PATH;
  let STORE_PATH = "";
  const cmd = args[args.length - 1];
  const curCommand = cmd.name();
  const PACKAGE_NAME = PACKAGE_SETTINGS[curCommand];
  const PACKAGE_VERSION = DEFAULT_PACKAGE_VERSION;
  let pkg;
  const { debug: debug2, error: error2 } = useLogger();
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
    debug2(pkg);
    debug2(`exist:${await pkg.exists()}`);
    if (await pkg.exists()) {
      debug2("\u6267\u884C\u66F4\u65B0");
      await pkg.update();
    } else {
      debug2("\u6267\u884C\u521D\u59CB\u5316");
      await pkg.init();
    }
  }
  const execFilePath = await pkg.getRootFilePath();
  if (!execFilePath)
    throw new Error(error2("\u5F53\u524D\u6307\u5B9A\u6587\u4EF6\u5939\u8DEF\u5F84\u6709\u8BEF", { needConsole: false }));
  debug2(`execFilePath:${execFilePath}`);
  debug2(`TP_PATH:${TP_PATH}`);
  debug2(`STORE_PATH:${STORE_PATH}`);
  debug2(`PACKAGE_NAME:${pkg.PACKAGE_NAME}`);
  debug2(`PACKAGE_VERSION:${pkg.PACKAGE_VERSION}`);
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
      error2(`\u591A\u8FDB\u7A0B\u4EE3\u7801\u6267\u884C\u5F02\u5E38: ${e.message}`);
      process.exit(1);
    });
    child.on("exit", (e) => {
      debug2(`${curCommand} \u547D\u4EE4\u6267\u884C\u6210\u529F`);
      process.exit(e);
    });
  } catch (e) {
    error2(`catch error ${e.message}`);
  }
};

// src/commander.ts
var InitCommander = () => {
  const program = new Command();
  const { info, echo, error: error2 } = useLogger2();
  program.name(Object.keys(package_default.bin)[0]).usage("<command> [options]").version(package_default.version).option("-d, --debug", "\u662F\u5426\u5F00\u542F Debug \u6A21\u5F0F", false).option("-tp, --targetPath <targetPath>", "\u6307\u5B9A\u76EE\u6807\u5B89\u88C5\u76EE\u5F55", "");
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
    error2(`\u672A\u77E5\u547D\u4EE4${cmd[0]}`);
    if (avaliableCommands.length)
      echo(" \u53EF\u7528\u547D\u4EE4 ", avaliableCommands.join(","));
  });
  program.parse(process.argv);
  if (program.args && program.args.length < 1)
    program.outputHelp();
  program.on("unhandleRejection", (reason) => {
    error2(`unhandleRejection${reason}`);
    throw reason;
  });
  program.on("uncaughtException", (error3) => {
    error3(`uncaughtException${error3}`);
    process.exit(-1);
  });
};

// src/prepare.ts
import os from "os";
import path2 from "path";
import semver from "semver";
import {
  DEFAULT_HOME_PATH,
  LOWEST_NODE_VERSION,
  MAGIC_HOME_ENV,
  getNpmLatestVersion,
  printMagicLogo,
  useLogger as useLogger3
} from "@vbs/magic-cli-utils";
import rootCheck from "root-check";
import fse from "fs-extra";
import dotenv from "dotenv";
import ora from "ora";
var { error, warn, debug } = useLogger3();
var homePath = os.homedir();
function checkUserHome(homePath2) {
  if (!homePath2 || !fse.existsSync(homePath2))
    throw new Error(error("\u5F53\u524D\u767B\u5F55\u7528\u6237\u4E3B\u76EE\u5F55\u4E0D\u5B58\u5728", { needConsole: false }));
}
function initDefaultConfig() {
  process.env.MAGIC_CLI_HOME_PATH = process.env.MAGIC_HOME_PATH ? path2.join(homePath, process.env.MAGIC_HOME_PATH) : path2.join(homePath, DEFAULT_HOME_PATH);
}
function checkEnv() {
  const homeEnvPath = path2.resolve(homePath, MAGIC_HOME_ENV);
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
  const version = package_default.version;
  const packageName = package_default.name;
  const latestVersion = await getNpmLatestVersion(packageName);
  if (latestVersion && semver.gt(latestVersion, version)) {
    warn(
      `\u6700\u65B0\u7248\u672C\u5DF2\u53D1\u5E03\uFF0C\u8BF7\u624B\u52A8\u66F4\u65B0\u811A\u624B\u67B6\u7248\u672C\uFF0C\u5F53\u524D\u7248\u672C\u4E3A\uFF1A${version}\uFF0C\u6700\u65B0\u7248\u672C\u4E3A\uFF1A${latestVersion} []~(\uFFE3\u25BD\uFFE3)~* `
    );
  }
}
function checkNodeVersion() {
  const currentVersion = process.version;
  if (!semver.gte(currentVersion, LOWEST_NODE_VERSION))
    throw new Error(error(`\u5F53\u524D Node \u7248\u672C\u8FC7\u4F4E\uFF0C\u63A8\u8350\u5B89\u88C5 v${LOWEST_NODE_VERSION} \u4EE5\u4E0A Node \u7248\u672C`, { needConsole: false }));
}
async function prepare() {
  printMagicLogo(package_default.version);
  const spinner = ora({
    text: "\u{1F449} \u68C0\u67E5\u6784\u5EFA\u73AF\u5883...",
    spinner: "dots"
  });
  spinner.start();
  try {
    rootCheck();
    checkUserHome(homePath);
    checkEnv();
    await checkPackageUpdate();
    checkNodeVersion();
    spinner.succeed("\u6784\u5EFA\u73AF\u5883\u6B63\u5E38\uFF01");
  } catch (error2) {
    spinner.fail("\u68C0\u67E5\u6784\u5EFA\u73AF\u5883\u5F02\u5E38");
    console.log(error2);
    process.exit(-1);
  }
}

// src/index.ts
var core = async () => {
  const { error: error2 } = useLogger4();
  try {
    await prepare();
    InitCommander();
  } catch (e) {
    if (e instanceof Error && process.env.DEBUG)
      console.log(e);
    else
      error2(e.msg);
  }
};
core();
export {
  InitCommander,
  checkEnv,
  checkNodeVersion,
  checkPackageUpdate,
  checkUserHome,
  exec,
  initDefaultConfig,
  prepare
};
