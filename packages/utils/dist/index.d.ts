import chalk from 'chalk';
import * as ora from 'ora';
import cp, { SpawnOptionsWithoutStdio } from 'child_process';

declare const echoSuccessText: (text: string) => string;
declare const echoWarnText: (text: string) => string;
declare const echoInfoText: (text: string) => string;
declare const echoErrorText: (text: string) => string;
declare const echoBlueText: (text: string) => string;
declare const echoSuccessBgText: (text: string) => string;
declare const echoWarnBgText: (text: string) => string;
declare const echoInfoBgText: (text: string) => string;
declare const echoErrorBgText: (text: string) => string;
declare const echoBlueBgText: (text: string) => string;

declare enum LOGGER_MSG_ENUM {
    DEBUG = " DEBUG ",
    INFO = " INFO ",
    DONE = " DONE ",
    WARN = " WARN ",
    ERROR = " ERROR "
}

declare function printMagicLogo(version: string): void;

interface LoggerParams {
    needConsole?: boolean;
}
declare const useLogger: () => {
    chalk: chalk.Chalk & chalk.ChalkFunction & {
        supportsColor: false | chalk.ColorSupport;
        Level: chalk.Level;
        Color: ("black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright") | ("bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright");
        ForegroundColor: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
        BackgroundColor: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
        Modifiers: "reset" | "bold" | "dim" | "italic" | "underline" | "inverse" | "hidden" | "strikethrough" | "visible";
        stderr: chalk.Chalk & {
            supportsColor: false | chalk.ColorSupport;
        };
    };
    debug: (target: any, options?: LoggerParams) => string;
    info: (target: any, options?: LoggerParams) => string;
    done: (target: any, options?: LoggerParams) => string;
    warn: (target: any, options?: LoggerParams) => string;
    error: (target: any, options?: LoggerParams) => string;
    echo: (symbol: string, target: any) => void;
};

declare type LastMsgType = {
    symbol: string;
    text: string;
} | null;
declare function useSpinner(): {
    spinner: ora.Ora;
    useLoading: (fn: any, message: string, ...args: any[]) => Promise<any>;
    successSpinner: (text: string) => void;
    logWithSpinner: (symbol?: string, msg?: string) => void;
    stopSpinner: (persist?: boolean) => void;
    pauseSpinner: () => void;
    resumeSpinner: () => void;
    failSpinner: (text: string) => void;
};

interface NpmData {
    _id: string;
    _rev: string;
    name: string;
    versions: string[];
    author: {
        name: string;
        email: string;
    };
    description: string;
}
declare const NPM_API_BASE_URL = "https://registry.npmjs.org";
declare const getNpmPackageData: (packageName: string) => Promise<NpmData | null>;
declare const getNpmVersions: (packageName: string) => Promise<string[]>;
declare const getNpmSemverVersions: (packageName: string, baseVersion: string) => Promise<string[]>;
declare const getNpmLatestVersion: (packageName: string) => Promise<string>;

declare const spawn: (command: string, args: string[], options?: SpawnOptionsWithoutStdio & {
    stdio?: string;
}) => cp.ChildProcessWithoutNullStreams;

interface TemplateListItem {
    name: string;
    npmName: string;
    version: string;
    type: 'normal' | 'custom';
    installCommand: string;
    startCommand: string;
    tag: string[];
    ignore: string[];
    buildPath?: string;
    examplePath?: string;
}
declare function getTemplateList(): Promise<unknown>;

export { LOGGER_MSG_ENUM, LastMsgType, LoggerParams, NPM_API_BASE_URL, NpmData, TemplateListItem, echoBlueBgText, echoBlueText, echoErrorBgText, echoErrorText, echoInfoBgText, echoInfoText, echoSuccessBgText, echoSuccessText, echoWarnBgText, echoWarnText, getNpmLatestVersion, getNpmPackageData, getNpmSemverVersions, getNpmVersions, getTemplateList, printMagicLogo, spawn, useLogger, useSpinner };
