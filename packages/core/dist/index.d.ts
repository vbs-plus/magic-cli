declare const InitCommander: () => void;

declare const exec: (...args: any[]) => Promise<void>;

declare function checkUserHome(homePath: string): void;
declare function initDefaultConfig(): void;
declare function checkEnv(): void;
declare function checkPackageUpdate(): Promise<void>;
declare function checkNodeVersion(): void;
declare function prepare(): Promise<void>;

export { InitCommander, checkEnv, checkNodeVersion, checkPackageUpdate, checkUserHome, exec, initDefaultConfig, prepare };
