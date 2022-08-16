declare const InitCommander: () => void;

declare const DEFAULT_HOME_PATH = ".magic-cli";
declare const MAGIC_HOME_ENV = ".magic-cli.env";
declare const DEFAULT_PACKAGE_VERSION = "latest";
declare const DEFAULT_STORE_PATH = "dependencies";
declare const DEFAULT_STORE_SUFIX = "node_modules";
/**
 * 动态配置命令读包，如有新命令，请务必配置此选项
 */
declare enum PACKAGE_SETTINGS {
    init = "magic-cli-init",
    add = "magic-cli-add"
}

declare const exec: (...args: any[]) => Promise<void>;

declare function checkUserHome(homePath: string): void;
declare function initDefaultConfig(): void;
declare function checkEnv(): void;
declare function checkPackageUpdate(): Promise<void>;
declare function prepare(): Promise<void>;

export { DEFAULT_HOME_PATH, DEFAULT_PACKAGE_VERSION, DEFAULT_STORE_PATH, DEFAULT_STORE_SUFIX, InitCommander, MAGIC_HOME_ENV, PACKAGE_SETTINGS, checkEnv, checkPackageUpdate, checkUserHome, exec, initDefaultConfig, prepare };
