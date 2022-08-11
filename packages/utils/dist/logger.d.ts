export interface LoggerParams {
    needConsole?: boolean;
}
export declare const useLogger: () => {
    debug: (text: string, options?: LoggerParams) => string;
    info: (text: string, options?: LoggerParams) => string;
    done: (text: string, options?: LoggerParams) => string;
    warn: (text: string, options?: LoggerParams) => string;
    error: (text: string, options?: LoggerParams) => string;
};
