import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import stripAnsi from 'strip-ansi';
import ora from 'ora';
import request from 'umi-request';
import semver from 'semver';
import semverSort from 'semver-sort';

const echoSuccessText = (text) => chalk.green(text);
const echoWarnText = (text) => chalk.yellow(text);
const echoInfoText = (text) => chalk.cyan(text);
const echoErrorText = (text) => chalk.red(text);
const echoBlueText = (text) => chalk.rgb(15, 100, 204)(text);
const echoSuccessBgText = (text) => chalk.green.inverse(text);
const echoWarnBgText = (text) => chalk.yellow.inverse(text);
const echoInfoBgText = (text) => chalk.cyan.inverse(text);
const echoErrorBgText = (text) => chalk.red.inverse(text);
const echoBlueBgText = (text) => chalk.rgb(15, 100, 204).inverse(text);

var LOGGER_MSG_ENUM = /* @__PURE__ */ ((LOGGER_MSG_ENUM2) => {
  LOGGER_MSG_ENUM2["DEBUG"] = " DEBUG ";
  LOGGER_MSG_ENUM2["INFO"] = " INFO ";
  LOGGER_MSG_ENUM2["DONE"] = " DONE ";
  LOGGER_MSG_ENUM2["WARN"] = " WARN ";
  LOGGER_MSG_ENUM2["ERROR"] = " ERROR ";
  return LOGGER_MSG_ENUM2;
})(LOGGER_MSG_ENUM || {});

function printMagicLogo(version) {
  clear();
  console.log("*************************************************");
  console.log(
    chalk.blue(
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
  console.log(`\u5F53\u524D\u811A\u624B\u67B6\u7248\u672C\u4E3A: ${chalk.bgGreen(` ${version} `)} \r
`);
}
printMagicLogo("123.1");

function useSpinner() {
  const spinner = ora();
  let lastMsg = null;
  let isPaused = false;
  const logWithSpinner = (symbol, msg) => {
    if (!msg) {
      msg = symbol;
      symbol = chalk.green("\u2714");
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
      text: msg
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
    spinner.succeed(chalk.green(text));
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

const useLogger = () => {
  const { stopSpinner } = useSpinner();
  const format = (label, msg) => {
    return msg.split("\n").map((line, i) => {
      return i === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length + line.length + 1);
    }).join("\n");
  };
  const echo = (symbol, text) => {
    console.log(format(chalk.bgGreen(symbol), chalk.green(text)));
  };
  const debug = (text, options = { needConsole: true }) => {
    if (options.needConsole && process.env.DEBUG)
      console.log(format(echoInfoBgText(LOGGER_MSG_ENUM.DEBUG), text));
    return format(echoInfoBgText(LOGGER_MSG_ENUM.DEBUG), text);
  };
  const info = (text, options = { needConsole: true }) => {
    if (options.needConsole)
      console.log(format(chalk.bgBlue(LOGGER_MSG_ENUM.INFO), text));
    return format(chalk.bgBlue(LOGGER_MSG_ENUM.INFO), text);
  };
  const done = (text, options = { needConsole: true }) => {
    if (options.needConsole)
      console.log(format(chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE), text));
    return format(chalk.bgGreen.black(LOGGER_MSG_ENUM.DONE), text);
  };
  const warn = (text, options = { needConsole: true }) => {
    if (options.needConsole) {
      console.log(
        format(chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN), chalk.yellow(text))
      );
    }
    return format(
      chalk.bgYellow.black(LOGGER_MSG_ENUM.WARN),
      chalk.yellow(text)
    );
  };
  const error = (text, options = { needConsole: true }) => {
    stopSpinner();
    if (options.needConsole)
      console.error(format(chalk.bgRed(LOGGER_MSG_ENUM.ERROR), chalk.red(text)));
    return format(chalk.bgRed(LOGGER_MSG_ENUM.ERROR), chalk.red(text));
  };
  return {
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
  return request(NPM_API_BASE_URL + packageName, {
    method: "GET"
  });
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
  return semverSort.desc(versions.filter((version) => semver.satisfies(version, `^${baseVersion}`)));
};
const getNpmLatestVersion = async (packageName) => {
  const versions = await getNpmVersions(packageName);
  if (versions)
    return semverSort.desc(versions)[0];
  return "";
};

export { LOGGER_MSG_ENUM, NPM_API_BASE_URL, echoBlueBgText, echoBlueText, echoErrorBgText, echoErrorText, echoInfoBgText, echoInfoText, echoSuccessBgText, echoSuccessText, echoWarnBgText, echoWarnText, getNpmLatestVersion, getNpmPackageData, getNpmSemverVersions, getNpmVersions, printMagicLogo, useLogger, useSpinner };
