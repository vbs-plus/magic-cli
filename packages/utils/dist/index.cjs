'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const stripAnsi = require('strip-ansi');
const ora = require('ora');
const request = require('axios');
const semver = require('semver');
const semverSort = require('semver-sort');
const cp = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
const clear__default = /*#__PURE__*/_interopDefaultLegacy(clear);
const figlet__default = /*#__PURE__*/_interopDefaultLegacy(figlet);
const stripAnsi__default = /*#__PURE__*/_interopDefaultLegacy(stripAnsi);
const ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
const request__default = /*#__PURE__*/_interopDefaultLegacy(request);
const semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);
const semverSort__default = /*#__PURE__*/_interopDefaultLegacy(semverSort);
const cp__default = /*#__PURE__*/_interopDefaultLegacy(cp);

const echoSuccessText = (text) => chalk__default.green(text);
const echoWarnText = (text) => chalk__default.yellow(text);
const echoInfoText = (text) => chalk__default.cyan(text);
const echoErrorText = (text) => chalk__default.red(text);
const echoBlueText = (text) => chalk__default.rgb(15, 100, 204)(text);
const echoSuccessBgText = (text) => chalk__default.green.inverse(text);
const echoWarnBgText = (text) => chalk__default.yellow.inverse(text);
const echoInfoBgText = (text) => chalk__default.cyan.inverse(text);
const echoErrorBgText = (text) => chalk__default.red.inverse(text);
const echoBlueBgText = (text) => chalk__default.rgb(15, 100, 204).inverse(text);

var LOGGER_MSG_ENUM = /* @__PURE__ */ ((LOGGER_MSG_ENUM2) => {
  LOGGER_MSG_ENUM2["DEBUG"] = " DEBUG ";
  LOGGER_MSG_ENUM2["INFO"] = " INFO ";
  LOGGER_MSG_ENUM2["DONE"] = " DONE ";
  LOGGER_MSG_ENUM2["WARN"] = " WARN ";
  LOGGER_MSG_ENUM2["ERROR"] = " ERROR ";
  return LOGGER_MSG_ENUM2;
})(LOGGER_MSG_ENUM || {});

function printMagicLogo(version) {
  clear__default();
  console.log("*************************************************");
  console.log(
    chalk__default.blue(
      figlet__default.textSync("Magic Cli", { horizontalLayout: "full" })
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
  console.log(`\u5F53\u524D\u811A\u624B\u67B6\u7248\u672C\u4E3A: ${chalk__default.rgb(89, 206, 143).inverse(` ${version} `)} \r
`);
}

function useSpinner() {
  const spinner = ora__default();
  let lastMsg = null;
  let isPaused = false;
  const logWithSpinner = (symbol, msg) => {
    if (!msg) {
      msg = symbol;
      symbol = chalk__default.green("\u2714");
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
    spinner.succeed(chalk__default.green(text));
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
    const oraInstance = ora__default(message);
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

const useLogger = () => {
  const { stopSpinner } = useSpinner();
  const format = (label, msg) => {
    return msg.split("\n").map((line, i) => {
      return i === 0 ? `${label} ${line}` : line.padStart(stripAnsi__default(label).length + line.length + 1);
    }).join("\n");
  };
  const echo = (symbol, target) => {
    console.log(
      format(
        chalk__default.rgb(89, 206, 143).inverse(symbol),
        chalk__default.green(
          typeof target === "object" ? JSON.stringify(target) : target
        )
      )
    );
  };
  const debug = (target, options = { needConsole: true }) => {
    if (options.needConsole && process.env.DEBUG) {
      console.log(
        format(
          echoInfoBgText(LOGGER_MSG_ENUM.DEBUG),
          typeof target === "object" ? JSON.stringify(target) : target
        )
      );
    }
    return format(
      echoInfoBgText(LOGGER_MSG_ENUM.DEBUG),
      typeof target === "object" ? JSON.stringify(target) : target
    );
  };
  const info = (target, options = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        format(
          chalk__default.bgBlue(LOGGER_MSG_ENUM.INFO),
          typeof target === "object" ? JSON.stringify(target) : target
        )
      );
    }
    return format(
      chalk__default.bgBlue(LOGGER_MSG_ENUM.INFO),
      typeof target === "object" ? JSON.stringify(target) : target
    );
  };
  const done = (target, options = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        format(
          chalk__default.bgGreen.black(LOGGER_MSG_ENUM.DONE),
          typeof target === "object" ? JSON.stringify(target) : target
        )
      );
    }
    return format(
      chalk__default.bgGreen.black(LOGGER_MSG_ENUM.DONE),
      typeof target === "object" ? JSON.stringify(target) : target
    );
  };
  const warn = (target, options = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        format(chalk__default.bgYellow.black(LOGGER_MSG_ENUM.WARN), chalk__default.yellow(typeof target === "object" ? JSON.stringify(target) : target))
      );
    }
    return format(
      chalk__default.bgYellow.black(LOGGER_MSG_ENUM.WARN),
      chalk__default.yellow(typeof target === "object" ? JSON.stringify(target) : target)
    );
  };
  const error = (target, options = { needConsole: true }) => {
    stopSpinner();
    if (options.needConsole) {
      console.error(
        format(
          chalk__default.bgRed(LOGGER_MSG_ENUM.ERROR),
          chalk__default.red(
            typeof target === "object" ? JSON.stringify(target) : target
          )
        )
      );
    }
    return format(
      chalk__default.bgRed(LOGGER_MSG_ENUM.ERROR),
      chalk__default.red(typeof target === "object" ? JSON.stringify(target) : target)
    );
  };
  return {
    chalk: chalk__default,
    debug,
    info,
    done,
    warn,
    error,
    echo
  };
};

const NPM_API_BASE_URL = "https://registry.npmjs.org";
const getNpmPackageData = async (packageName) => {
  if (!packageName)
    return null;
  return (await request__default.get(`${NPM_API_BASE_URL}/${packageName}`)).data;
};
const getNpmVersions = async (packageName) => {
  const data = await getNpmPackageData(packageName);
  if (data)
    return Object.keys(data.versions);
  else
    return [];
};
const getNpmSemverVersions = async (packageName, baseVersion) => {
  const versions = await getNpmVersions(packageName);
  return semverSort__default.desc(versions.filter((version) => semver__default.gt(version, baseVersion)));
};
const getNpmLatestVersion = async (packageName) => {
  const versions = await getNpmVersions(packageName);
  if (versions)
    return semverSort__default.desc(versions)[0];
  return "";
};

const spawn = (command, args, options = {}) => {
  const win32 = process.platform === "win32";
  const cmd = win32 ? "cmd" : command;
  const cmdArgs = win32 ? ["/c"].concat(command, args) : args;
  return cp__default.spawn(cmd, cmdArgs, options);
};

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

exports.LOGGER_MSG_ENUM = LOGGER_MSG_ENUM;
exports.NPM_API_BASE_URL = NPM_API_BASE_URL;
exports.echoBlueBgText = echoBlueBgText;
exports.echoBlueText = echoBlueText;
exports.echoErrorBgText = echoErrorBgText;
exports.echoErrorText = echoErrorText;
exports.echoInfoBgText = echoInfoBgText;
exports.echoInfoText = echoInfoText;
exports.echoSuccessBgText = echoSuccessBgText;
exports.echoSuccessText = echoSuccessText;
exports.echoWarnBgText = echoWarnBgText;
exports.echoWarnText = echoWarnText;
exports.getNpmLatestVersion = getNpmLatestVersion;
exports.getNpmPackageData = getNpmPackageData;
exports.getNpmSemverVersions = getNpmSemverVersions;
exports.getNpmVersions = getNpmVersions;
exports.getTemplateList = getTemplateList;
exports.printMagicLogo = printMagicLogo;
exports.spawn = spawn;
exports.useLogger = useLogger;
exports.useSpinner = useSpinner;
