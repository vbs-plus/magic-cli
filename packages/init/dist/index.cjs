'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const magicCliUtils = require('@vbs/magic-cli-utils');
const path = require('path');
const fse = require('fs-extra');
const magicCliTemplates = require('@vbs/magic-cli-templates');
const semver = require('semver');
const inquirer = require('inquirer');
const ora = require('ora');
const os = require('os');
const magicCliModels = require('@vbs/magic-cli-models');
const glob = require('glob');
const ejs = require('ejs');
const execa = require('execa');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const fse__default = /*#__PURE__*/_interopDefaultLegacy(fse);
const semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);
const inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
const ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
const os__default = /*#__PURE__*/_interopDefaultLegacy(os);
const glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
const ejs__default = /*#__PURE__*/_interopDefaultLegacy(ejs);

const homeDir = os__default.homedir();
let templatePackage;
const { debug: debug$2, error: error$1, info: info$1 } = magicCliUtils.useLogger();
const installSpinner = ora__default({
  text: "\u{1F680} \u6B63\u5728\u5B89\u88C5\u6A21\u677F... \r",
  spinner: "material"
});
const updateSpinner = ora__default({
  text: "\u{1F680} \u6B63\u5728\u66F4\u65B0\u6A21\u677F... \r",
  spinner: "moon"
});
const renderSpinner = ora__default({
  text: "\u{1F4C4} \u5F00\u59CB\u6E32\u67D3\u6A21\u677F\u4EE3\u7801... \r",
  spinner: "material"
});
const commandSpinner = ora__default({
  text: "\u{1F52B} \u6B63\u5728\u6267\u884C\u4F9D\u8D56\u5B89\u88C5\u547D\u4EE4... \r",
  spinner: "material"
});
async function installTemplate(templates, projectInfo) {
  const { npmName } = projectInfo;
  const template = templates.find((item) => item.npmName === npmName);
  const TP_PATH = path__default.resolve(
    homeDir,
    magicCliUtils.DEFAULT_HOME_PATH,
    magicCliUtils.DEFAULT_TEMPLATE_TARGET_PATH
  );
  const STORE_PATH = path__default.resolve(TP_PATH, magicCliUtils.DEFAULT_STORE_SUFIX);
  debug$2(`TP_PATH: ${TP_PATH}`);
  debug$2(`STORE_PATH: ${STORE_PATH}`);
  templatePackage = new magicCliModels.Package({
    TP_PATH,
    STORE_PATH,
    PACKAGE_NAME: template?.npmName || "",
    PACKAGE_VERSION: template?.version || "1.0.0"
  });
  if (!await templatePackage.exists()) {
    try {
      installSpinner.start();
      await templatePackage.init();
    } catch (e) {
      installSpinner.fail("\u5B89\u88C5\u6A21\u677F\u5931\u8D25\uFF01\n");
      throw new Error(e.message);
    } finally {
      if (await templatePackage.exists())
        installSpinner.succeed("\u{1F389} \u6A21\u677F\u5B89\u88C5\u6210\u529F \n");
    }
  } else {
    try {
      updateSpinner.start();
      await templatePackage.update();
    } catch (e) {
      updateSpinner.fail("\u66F4\u65B0\u6A21\u677F\u5931\u8D25\uFF01\n");
      throw new Error(e.message);
    } finally {
      if (await templatePackage.exists())
        updateSpinner.succeed("\u{1F389} \u6A21\u677F\u66F4\u65B0\u6210\u529F \n");
    }
  }
  await renderTemplate(template, projectInfo);
}
async function renderTemplate(template, projectInfo) {
  const ignoreBase = ["**/node_modules/**", "**/pnpm-lock.yaml", "**/yarn.lock", "**/package-lock.json"];
  const { version, installCommand = "npm install", startCommand = "npm run dev", ignore: ignores = [] } = template;
  const { projectName } = projectInfo;
  const targetPath = path__default.resolve(process.cwd(), projectName);
  const templatePath = path__default.resolve(templatePackage.getCacheFilePath(version), magicCliUtils.DEFAULT_TEMPLATE_TARGET_PATH);
  const ignore = [...ignoreBase, ...ignores];
  try {
    renderSpinner.start();
    fse__default.ensureDirSync(targetPath);
    fse__default.ensureDirSync(templatePath);
    fse__default.copySync(templatePath, targetPath);
    ejsRenderTemplate({ ignore, targetPath }, projectInfo);
  } catch (e) {
    renderSpinner.fail("\u6E32\u67D3\u6A21\u677F\u4EE3\u7801\u5931\u8D25\uFF01\n");
    throw new Error(e.message);
  } finally {
    renderSpinner.succeed("\u{1F389} \u6A21\u677F\u6E32\u67D3\u6210\u529F \n!");
  }
  try {
    commandSpinner.start();
    fse__default.writeFileSync(path__default.resolve(targetPath, ".npmrc"), "strict-peer-dependencies = false");
    await execa.execaCommand(installCommand, { stdio: "inherit", encoding: "utf-8", cwd: targetPath });
  } catch (error2) {
    console.log();
    commandSpinner.fail("\u6A21\u677F\u5B89\u88C5\u4F9D\u8D56\u5931\u8D25\uFF01\n");
    process.exit(-1);
  } finally {
    commandSpinner.succeed("\u4F9D\u8D56\u5B89\u88C5\u5B8C\u6210 \n");
  }
  try {
    console.log();
    info$1("\u2728\u2728 \u5927\u529F\u544A\u6210\uFF01");
    await execa.execaCommand(startCommand, { stdio: "inherit", encoding: "utf-8", cwd: targetPath });
  } catch (error2) {
    debug$2(`ERROR ${JSON.stringify(error2)}`);
    error2("\u5E94\u7528\u542F\u52A8\u5931\u8D25\uFF01\n");
    process.exit(-1);
  }
}
function ejsRenderTemplate(options, projectInfo) {
  const { ignore, targetPath } = options;
  return new Promise((resolve, reject) => {
    glob__default("**", {
      cwd: targetPath,
      ignore: ignore || "",
      nodir: true
    }, (err, matches) => {
      if (err)
        reject(err);
      Promise.all(matches.map((file) => {
        const filePath = path__default.resolve(targetPath, file);
        return new Promise((resolvet, rejectt) => {
          ejs__default.renderFile(filePath, projectInfo, {}, (err2, result) => {
            if (err2) {
              error$1(`ejsRender ${err2.toString()}`);
              rejectt(err2);
            } else {
              fse__default.writeFileSync(filePath, result);
              resolvet(result);
            }
          });
        });
      })).then(() => resolve(null)).catch((err2) => reject(err2));
    });
  });
}

const { debug: debug$1, info, chalk } = magicCliUtils.useLogger();
const RANDOM_COLORS = [
  "#F94892",
  "#FF7F3F",
  "#FBDF07",
  "#89CFFD",
  "#A66CFF",
  "#9C9EFE",
  "#B1E1FF",
  "#293462"
];
const getInheritParams = () => {
  const args = JSON.parse(process.argv.slice(2)[0]);
  const inheritArgs = /* @__PURE__ */ Object.create(null);
  inheritArgs.projectName = args[0];
  inheritArgs.force = args[1];
  inheritArgs.cmd = args[2];
  return inheritArgs;
};
function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, "");
}
function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}
const checkPackageExists = async (dirPath, force) => {
  const pwd = process.cwd();
  const targetDir = path__default.join(pwd, dirPath);
  if (fse__default.existsSync(targetDir)) {
    if (force) {
      await fse__default.remove(targetDir);
    } else {
      const { action } = await inquirer__default.prompt([
        {
          name: "action",
          type: "confirm",
          message: "\u76EE\u5F55\u5DF2\u5B58\u5728\u662F\u5426\u9700\u8981\u8FDB\u884C\u79FB\u9664\uFF1F"
        }
      ]);
      if (!action)
        return false;
      else
        await fse__default.remove(targetDir);
      return true;
    }
  } else {
    fse__default.mkdirSync(targetDir);
    return true;
  }
};
const getProjectInfo = async (args, templates) => {
  let targetDir = formatTargetDir(args.projectName);
  const defaultName = "magic-project";
  const defaultVersion = "1.0.0";
  let projectInfo = {};
  try {
    const { type } = await inquirer__default.prompt({
      type: "list",
      name: "type",
      default: "project",
      message: "\u8BF7\u9009\u62E9\u521D\u59CB\u5316\u7C7B\u578B\uFF1A",
      choices: [
        {
          name: "\u9879\u76EE \u{1F5C2}\uFE0F",
          value: "project"
        },
        {
          name: "\u7EC4\u4EF6 \u{1F9F0}",
          value: "component"
        }
      ]
    });
    const title = type === "component" ? "\u7EC4\u4EF6" : "\u9879\u76EE";
    const projectNamePrompt = {
      type: "input",
      name: "projectName",
      default: defaultName,
      message: `\u8BF7\u8F93\u5165${title}\u540D\u79F0\uFF1A`,
      validate: (value) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!isValidPackageName(value)) {
              reject("\u{1F6AB} Invalid project name");
              return;
            }
            resolve(true);
          }, 0);
        });
      }
    };
    const projectPrompts = [];
    if (!args.projectName || !isValidPackageName(args.projectName))
      projectPrompts.push(projectNamePrompt);
    const values = await inquirer__default.prompt(projectPrompts);
    targetDir = formatTargetDir(values.projectName) || targetDir;
    debug$1(` TargetDir :${targetDir}`);
    const ret = await checkPackageExists(targetDir, args.force);
    if (!ret)
      info("\u2716 \u79FB\u9664\u6587\u4EF6\u64CD\u4F5C\u88AB\u53D6\u6D88\uFF0C\u7A0B\u5E8F\u6B63\u5E38\u9000\u51FA");
    const { projectVersion } = await inquirer__default.prompt({
      type: "input",
      name: "projectVersion",
      message: `\u8BF7\u8F93\u5165${title}\u7248\u672C\u53F7(\u6B64\u7248\u672C\u53F7\u4EC5\u4F5C\u4E3A\u6A21\u677F\u6E32\u67D3\u4F7F\u7528\uFF0C\u9ED8\u8BA4\u4E0B\u8F7D\u7CFB\u7EDF\u6700\u65B0\u7248\u672C\u6A21\u677F)`,
      default: defaultVersion,
      validate: (value) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!semver__default.valid(value)) {
              reject("\u{1F6AB} Invalid project Version");
              return;
            }
            resolve(true);
          }, 0);
        });
      },
      filter: (value) => {
        if (semver__default.valid(value))
          return semver__default.valid(value);
        return value;
      }
    });
    debug$1(`projectVersion: ${projectVersion}`);
    const templateChoices = templates.filter((item) => item.type === type).map((item) => {
      return {
        name: chalk.hex(
          RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)]
        )(item.name),
        value: item.npmName
      };
    });
    const { npmName } = await inquirer__default.prompt({
      type: "list",
      name: "npmName",
      message: `\u8BF7\u9009\u62E9${title}\u6A21\u677F`,
      choices: templateChoices
    });
    debug$1(`npmName : ${npmName}`);
    const { projectDescription } = await inquirer__default.prompt({
      type: "input",
      name: "projectDescription",
      message: `\u8BF7\u8F93\u5165${title}\u63CF\u8FF0`,
      default: "A Magic project"
    });
    projectInfo = {
      name: values.projectName || targetDir,
      projectName: magicCliUtils.toLine(values.projectName) || magicCliUtils.toLine(targetDir),
      type,
      npmName,
      projectVersion,
      projectDescription
    };
  } catch (e) {
    console.log(e.message);
  }
  return projectInfo;
};
const checkTemplateExistAndReturn = async () => {
  const spinner = ora__default({
    text: "\u{1F50D}  \u6B63\u5728\u68C0\u7D22\u7CFB\u7EDF\u6A21\u677F\uFF0C\u8BF7\u7A0D\u540E...\n"
  });
  console.log();
  spinner.start();
  console.log();
  try {
    const { documents } = await magicCliTemplates.getTemplateListByType("all");
    if (documents.length) {
      spinner.succeed("\u7CFB\u7EDF\u6A21\u677F\u68C0\u7D22\u6B63\u5E38\uFF01\n");
      return documents;
    } else {
      spinner.fail("\u7CFB\u7EDF\u6A21\u677F\u5F02\u5E38\n");
      throw new Error("\u9879\u76EE\u6A21\u677F\u4E0D\u5B58\u5728\n");
    }
  } catch (error) {
    spinner.fail("\u7CFB\u7EDF\u6A21\u677F\u5F02\u5E38\n");
    process.exit(-1);
  }
};
async function prepare(args) {
  try {
    const templates = await checkTemplateExistAndReturn();
    const projectInfo = await getProjectInfo(args, templates);
    debug$1(`projectInfo : ${JSON.stringify(projectInfo)}`);
    await installTemplate(templates, projectInfo);
  } catch (error) {
    console.log(error);
  }
}

const { error, debug } = magicCliUtils.useLogger();
const init = async () => {
  try {
    const args = getInheritParams();
    debug(` init args: ${JSON.stringify(args)}`);
    await prepare(args);
  } catch (e) {
    throw new Error(error(e.message, { needConsole: false }));
  }
};
init();

exports.init = init;
