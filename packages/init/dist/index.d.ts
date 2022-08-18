interface InitArgs {
    projectName?: string;
    force?: boolean;
    cmd?: any;
}
declare const init: () => Promise<void>;

export { InitArgs, init };
