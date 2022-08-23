import { useLogger, useSpinner, DEFAULT_HOME_PATH, DEFAULT_TEMPLATE_TARGET_PATH, DEFAULT_STORE_SUFIX, toLine } from '@vbs/magic-cli-utils';
import path from 'path';
import fse from 'fs-extra';
import { getTemplateListByType } from '@vbs/magic-cli-templates';
import semver from 'semver';
import inquirer from 'inquirer';
import os from 'os';
import { Package } from '@vbs/magic-cli-models';

const homeDir = os.homedir();
let templatePackage;
const { debug: debug$2 } = useLogger();
const { spinner } = useSpinner();
async function installTemplate(templates, projectInfo) {
  const { npmName } = projectInfo;
  const template = templates.find((item) => item.npmName === npmName);
  const TP_PATH = path.resolve(
    homeDir,
    DEFAULT_HOME_PATH,
    DEFAULT_TEMPLATE_TARGET_PATH
  );
  const STORE_PATH = path.resolve(TP_PATH, DEFAULT_STORE_SUFIX);
  debug$2(`TP_PATH: ${TP_PATH}`);
  debug$2(`STORE_PATH: ${STORE_PATH}`);
  templatePackage = new Package({
    TP_PATH,
    STORE_PATH,
    PACKAGE_NAME: template?.npmName || "",
    PACKAGE_VERSION: template?.version || "1.0.0"
  });
  if (!await templatePackage.exists()) {
    const installSpinner = spinner.start("\u{1F680} \u6B63\u5728\u5B89\u88C5\u6A21\u677F...");
    try {
      await templatePackage.init();
    } catch (e) {
      installSpinner.fail("\u5B89\u88C5\u6A21\u677F\u5931\u8D25\uFF01");
      throw new Error(e.message);
    } finally {
      if (await templatePackage.exists())
        installSpinner.succeed("\u{1F389} \u6A21\u677F\u5B89\u88C5\u6210\u529F");
    }
  } else {
    const updateSpinner = spinner.start("\u{1F680} \u6B63\u5728\u66F4\u65B0\u6A21\u677F...");
    try {
      await templatePackage.update();
    } catch (e) {
      updateSpinner.fail("\u66F4\u65B0\u6A21\u677F\u5931\u8D25\uFF01");
      throw new Error(e.message);
    } finally {
      if (await templatePackage.exists())
        updateSpinner.succeed("\u{1F389} \u6A21\u677F\u66F4\u65B0\u6210\u529F");
    }
  }
  await renderTemplate(template, projectInfo);
}
function renderTemplate(template, projectInfo) {
  const { version } = template;
  const { projectName } = projectInfo;
  const renderSpinner = spinner.start("\u{1F4C4} \u5F00\u59CB\u6E32\u67D3\u6A21\u677F\u4EE3\u7801...");
  const targetPath = path.resolve(process.cwd(), projectName);
  const templatePath = path.resolve(templatePackage.getCacheFilePath(version), DEFAULT_TEMPLATE_TARGET_PATH);
  try {
    fse.ensureDirSync(targetPath);
    fse.ensureDirSync(templatePath);
    fse.copySync(templatePath, targetPath);
  } catch (e) {
    renderSpinner.fail("\u6E32\u67D3\u6A21\u677F\u4EE3\u7801\u5931\u8D25\uFF01");
    throw new Error(e.message);
  } finally {
    renderSpinner.succeed("\u{1F389} \u6A21\u677F\u6E32\u67D3\u6210\u529F\uFF01");
  }
}

const { logWithSpinner, successSpinner, failSpinner } = useSpinner();
const { debug: debug$1, info, chalk } = useLogger();
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
  const targetDir = path.join(pwd, dirPath);
  if (fse.existsSync(targetDir)) {
    if (force) {
      await fse.remove(targetDir);
    } else {
      const { action } = await inquirer.prompt([
        {
          name: "action",
          type: "confirm",
          message: "\u76EE\u5F55\u5DF2\u5B58\u5728\u662F\u5426\u9700\u8981\u8FDB\u884C\u79FB\u9664\uFF1F"
        }
      ]);
      if (!action)
        return false;
      else
        await fse.remove(targetDir);
      return true;
    }
  } else {
    fse.mkdirSync(targetDir);
    return true;
  }
};
const getProjectInfo = async (args, templates) => {
  let targetDir = formatTargetDir(args.projectName);
  const defaultName = "magic-project";
  const defaultVersion = "1.0.0";
  let projectInfo = {};
  try {
    const { type } = await inquirer.prompt({
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
    const values = await inquirer.prompt(projectPrompts);
    targetDir = formatTargetDir(values.projectName) || targetDir;
    debug$1(` TargetDir :${targetDir}`);
    const ret = await checkPackageExists(targetDir, args.force);
    if (!ret)
      info("\u2716 \u79FB\u9664\u6587\u4EF6\u64CD\u4F5C\u88AB\u53D6\u6D88\uFF0C\u7A0B\u5E8F\u6B63\u5E38\u9000\u51FA");
    const { projectVersion } = await inquirer.prompt({
      type: "input",
      name: "projectVersion",
      message: `\u8BF7\u8F93\u5165${title}\u7248\u672C\u53F7(\u6B64\u7248\u672C\u53F7\u4EC5\u4F5C\u4E3A\u6A21\u677F\u6E32\u67D3\u4F7F\u7528\uFF0C\u9ED8\u8BA4\u4E0B\u8F7D\u7CFB\u7EDF\u6700\u65B0\u7248\u672C\u6A21\u677F)`,
      default: defaultVersion,
      validate: (value) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!semver.valid(value)) {
              reject("\u{1F6AB} Invalid project Version");
              return;
            }
            resolve(true);
          }, 0);
        });
      },
      filter: (value) => {
        if (semver.valid(value))
          return semver.valid(value);
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
    const { npmName } = await inquirer.prompt({
      type: "list",
      name: "npmName",
      message: `\u8BF7\u9009\u62E9${title}\u6A21\u677F`,
      choices: templateChoices
    });
    debug$1(`npmName : ${npmName}`);
    const { projectDescription } = await inquirer.prompt({
      type: "input",
      name: "projectDescription",
      message: `\u8BF7\u8F93\u5165${title}\u63CF\u8FF0`,
      default: "A Magic project"
    });
    projectInfo = {
      name: values.projectName || targetDir,
      projectName: toLine(values.projectName) || toLine(targetDir),
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
  console.log();
  logWithSpinner("\u{1F5C3}  \u6B63\u5728\u68C0\u7D22\u7CFB\u7EDF\u6A21\u677F\u662F\u5426\u5B58\u5728\uFF0C\u8BF7\u7A0D\u540E...");
  console.log();
  try {
    const { documents } = await getTemplateListByType("all");
    if (documents.length) {
      successSpinner("\u7CFB\u7EDF\u6A21\u677F\u68C0\u7D22\u6B63\u5E38\uFF01");
      return documents;
    } else {
      failSpinner("\u7CFB\u7EDF\u6A21\u677F\u5F02\u5E38");
      throw new Error("\u9879\u76EE\u6A21\u677F\u4E0D\u5B58\u5728");
    }
  } catch (error) {
    failSpinner("\u7CFB\u7EDF\u6A21\u677F\u5F02\u5E38");
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

const { error, debug } = useLogger();
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

export { init };
