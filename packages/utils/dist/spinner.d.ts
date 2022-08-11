export declare type LastMsgType = {
    symbol: string;
    text: string;
} | null;
export declare function useSpinner(): {
    spinner: import("ora").Ora;
    useLoading: (fn: any, message: string, ...args: any[]) => Promise<any>;
    successSpinner: (text: string) => void;
    logWithSpinner: (symbol?: string, msg?: string) => void;
    stopSpinner: (persist?: boolean) => void;
    pauseSpinner: () => void;
    resumeSpinner: () => void;
    failSpinner: (text: string) => void;
};
