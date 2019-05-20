import { Declaration, Step, ParamsMap } from 'pojoe/steps';
export declare class DirectoryWatcher extends Step {
    static readonly declaration: Declaration;
    private streams;
    private watcher;
    private directory;
    private resolve;
    constructor(params: ParamsMap);
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter
     */
    doit(): Promise<void>;
    stop(): void;
}
