// src/chalk.ts
import chalk from "chalk";
var echoSuccessText = (text) => chalk.green(text);
var echoWarnText = (text) => chalk.yellow(text);
var echoInfoText = (text) => chalk.cyan(text);
var echoErrorText = (text) => chalk.red(text);
var echoBlueText = (text) => chalk.rgb(15, 100, 204)(text);
var echoSuccessBgText = (text) => chalk.green.inverse(text);
var echoWarnBgText = (text) => chalk.yellow.inverse(text);
var echoInfoBgText = (text) => chalk.cyan.inverse(text);
var echoErrorBgText = (text) => chalk.red.inverse(text);
var echoBlueBgText = (text) => chalk.rgb(15, 100, 204).inverse(text);

// src/enum.ts
var LOGGER_MSG_ENUM = /* @__PURE__ */ ((LOGGER_MSG_ENUM2) => {
  LOGGER_MSG_ENUM2["DEBUG"] = " DEBUG ";
  LOGGER_MSG_ENUM2["INFO"] = " INFO ";
  LOGGER_MSG_ENUM2["DONE"] = " DONE ";
  LOGGER_MSG_ENUM2["WARN"] = " WARN ";
  LOGGER_MSG_ENUM2["ERROR"] = " ERROR ";
  return LOGGER_MSG_ENUM2;
})(LOGGER_MSG_ENUM || {});
var DEFAULT_HOME_PATH = ".magic-cli";
var MAGIC_HOME_ENV = ".magic-cli.env";
var DEFAULT_PACKAGE_VERSION = "latest";
var DEFAULT_STORE_PATH = "dependencies";
var DEFAULT_TEMPLATE_TARGET_PATH = "template";
var DEFAULT_STORE_SUFIX = "node_modules";
var LOWEST_NODE_VERSION = "12.0.0";
var PACKAGE_SETTINGS = /* @__PURE__ */ ((PACKAGE_SETTINGS2) => {
  PACKAGE_SETTINGS2["init"] = "@vbs/magic-cli-init";
  PACKAGE_SETTINGS2["add"] = "@vbs/magic-cli-add";
  return PACKAGE_SETTINGS2;
})(PACKAGE_SETTINGS || {});

// src/figlet.ts
import chalk2 from "chalk";
import clear from "clear";
import figlet from "figlet";
function printMagicLogo(version) {
  clear();
  console.log("*************************************************");
  console.log(
    chalk2.blue(
      figlet.textSync("Magic Cli", { horizontalLayout: "full" })
    )
  );
  console.log("*************************************************");
  console.log(
    `\r
Run ${echoInfoText(
      "magic <command> --help"
    )} for detailed usage of given command\r
`
  );
  console.log(`\u5F53\u524D\u811A\u624B\u67B6\u7248\u672C\u4E3A: ${chalk2.rgb(89, 206, 143).inverse(` ${version} `)} \r
`);
}

// src/logger.ts
import chalk4 from "chalk";

// src/spinner.ts
import ora from "ora";
import chalk3 from "chalk";
function useSpinner() {
  const spinner = ora();
  let lastMsg = null;
  let isPaused = false;
  const logWithSpinner = (symbol, msg) => {
    if (!msg) {
      msg = symbol;
      symbol = chalk3.green("\u2714");
    }
    if (lastMsg) {
      spinner.stopAndPersist({
        symbol: lastMsg.symbol,
        text: lastMsg.text
      });
    }
    spinner.text = ` ${msg}`;
    lastMsg = {
      symbol: `${symbol} `,
      text: msg || ""
    };
    spinner.start();
  };
  const stopSpinner = (persist = false) => {
    if (!spinner.isSpinning)
      return;
    if (lastMsg && persist !== false) {
      spinner.stopAndPersist({
        symbol: lastMsg.symbol,
        text: lastMsg.text
      });
    } else {
      spinner.stop();
    }
    lastMsg = null;
  };
  const successSpinner = (text) => {
    spinner.succeed(chalk3.green(text));
  };
  const pauseSpinner = () => {
    if (spinner.isSpinning) {
      spinner.stop();
      isPaused = true;
    }
  };
  const resumeSpinner = () => {
    if (isPaused) {
      spinner.start();
      isPaused = false;
    }
  };
  const failSpinner = (text) => {
    spinner.fail(text);
  };
  const useLoading = async (fn, message, ...args) => {
    const oraInstance = ora(message);
    oraInstance.start();
    try {
      const res = await fn(...args);
      oraInstance.succeed();
      return res;
    } catch (error) {
      console.log(error);
      console.log(echoErrorBgText(" Please check your network first\uFF01 "));
      oraInstance.fail("Request failed, refetch ...");
    }
  };
  return {
    spinner,
    useLoading,
    successSpinner,
    logWithSpinner,
    stopSpinner,
    pauseSpinner,
    resumeSpinner,
    failSpinner
  };
}

// src/logger.ts
var useLogger = () => {
  const { stopSpinner } = useSpinner();
  const echo = (symbol, target) => {
    console.log(
      chalk4.rgb(89, 206, 143).inverse(symbol),
      "",
      chalk4.green(
        typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target
      )
    );
  };
  const debug = (target, options = { needConsole: true }) => {
    if (options.needConsole && process.env.DEBUG) {
      console.log(
        echoInfoBgText(" DEBUG " /* DEBUG */),
        "",
        chalk4.green(typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target)
      );
    }
    return `${echoInfoBgText(" DEBUG " /* DEBUG */)} ${typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target}`;
  };
  const info = (target, options = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        chalk4.bgBlue(" INFO " /* INFO */),
        "",
        chalk4.blue(typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target)
      );
    }
    return `${chalk4.bgBlue(" INFO " /* INFO */)} ${typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target}`;
  };
  const done = (target, options = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        chalk4.bgGreen.black(" DONE " /* DONE */),
        "",
        chalk4.green(typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target)
      );
    }
    return `${chalk4.bgGreen.black(" DONE " /* DONE */)} ${typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target}`;
  };
  const warn = (target, options = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        chalk4.bgYellow.black(" WARN " /* WARN */),
        "",
        chalk4.yellow(
          typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target
        )
      );
    }
    return `${chalk4.bgYellow.black(" WARN " /* WARN */)} ${chalk4.yellow(
      typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target
    )}`;
  };
  const error = (target, options = { needConsole: true }) => {
    stopSpinner();
    if (options.needConsole) {
      console.error(
        chalk4.bgRed(" ERROR " /* ERROR */),
        "",
        chalk4.red(
          typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target
        )
      );
    }
    return `${chalk4.bgRed(" ERROR " /* ERROR */)} ${chalk4.red(
      typeof target === "object" || typeof target === "boolean" ? JSON.stringify(target) : target
    )}`;
  };
  return {
    chalk: chalk4,
    debug,
    info,
    done,
    warn,
    error,
    echo
  };
};

// src/npm.ts
import request from "axios";
import semver from "semver";
import semverSort from "semver-sort";
var NPM_API_BASE_URL = "https://registry.npmjs.org";
var getNpmPackageData = async (packageName) => {
  if (!packageName)
    return null;
  return (await request.get(`${NPM_API_BASE_URL}/${packageName}`)).data;
};
var getNpmVersions = async (packageName) => {
  const data = await getNpmPackageData(packageName);
  if (data)
    return Object.keys(data.versions);
  else
    return [];
};
var getNpmSemverVersions = async (packageName, baseVersion) => {
  const versions = await getNpmVersions(packageName);
  return semverSort.desc(versions.filter((version) => semver.gt(version, baseVersion)));
};
var getNpmLatestVersion = async (packageName) => {
  const versions = await getNpmVersions(packageName);
  if (versions)
    return semverSort.desc(versions)[0];
  return "";
};

// src/spawn.ts
import cp from "child_process";
var spawn = (command, args, options = {}) => {
  const win32 = process.platform === "win32";
  const cmd = win32 ? "cmd" : command;
  const cmdArgs = win32 ? ["/c"].concat(command, args) : args;
  return cp.spawn(cmd, cmdArgs, options);
};

// src/template.ts
async function getTemplateList() {
  const templateList = [{
    name: "za-zi",
    npmName: "za-zi",
    version: "0.0.6",
    type: "normal",
    installCommand: "zi",
    startCommand: "zi",
    tag: ["project"],
    ignore: []
  }];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(templateList);
    }, 3e3);
  }).catch((e) => {
    console.log(e);
  });
}

// src/index.ts
function toLine(str) {
  return str.replace("/([A-Z])/g", "-$1").toLowerCase();
}
export {
  DEFAULT_HOME_PATH,
  DEFAULT_PACKAGE_VERSION,
  DEFAULT_STORE_PATH,
  DEFAULT_STORE_SUFIX,
  DEFAULT_TEMPLATE_TARGET_PATH,
  LOGGER_MSG_ENUM,
  LOWEST_NODE_VERSION,
  MAGIC_HOME_ENV,
  NPM_API_BASE_URL,
  PACKAGE_SETTINGS,
  echoBlueBgText,
  echoBlueText,
  echoErrorBgText,
  echoErrorText,
  echoInfoBgText,
  echoInfoText,
  echoSuccessBgText,
  echoSuccessText,
  echoWarnBgText,
  echoWarnText,
  getNpmLatestVersion,
  getNpmPackageData,
  getNpmSemverVersions,
  getNpmVersions,
  getTemplateList,
  printMagicLogo,
  spawn,
  toLine,
  useLogger,
  useSpinner
};
