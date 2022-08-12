import * as ora from 'ora';

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
    debug: (text: string, options?: LoggerParams) => string;
    info: (text: string, options?: LoggerParams) => string;
    done: (text: string, options?: LoggerParams) => string;
    warn: (text: string, options?: LoggerParams) => string;
    error: (text: string, options?: LoggerParams) => string;
    echo: (symbol: string, text: string) => void;
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
declare const getNpmPackageData: (packageName: string) => Promise<NpmData>;
declare const getNpmVersions: (packageName: string) => Promise<string[]>;
declare const getNpmSemverVersions: (packageName: string, baseVersion: string) => Promise<string[]>;
declare const getNpmLatestVersion: (packageName: string) => Promise<string>;

export { LOGGER_MSG_ENUM, LastMsgType, LoggerParams, NPM_API_BASE_URL, NpmData, echoBlueBgText, echoBlueText, echoErrorBgText, echoErrorText, echoInfoBgText, echoInfoText, echoSuccessBgText, echoSuccessText, echoWarnBgText, echoWarnText, getNpmLatestVersion, getNpmPackageData, getNpmSemverVersions, getNpmVersions, printMagicLogo, useLogger, useSpinner };
