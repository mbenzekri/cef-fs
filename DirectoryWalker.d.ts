import * as cef from 'cef-lib/step';
declare class DirectoryWalker extends cef.Step {
    constructor(params: cef.ParamsMap, batch: cef.Batch);
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter
     */
    walk(dir: string, pattern: RegExp, extensions: RegExp): void;
    start(): void;
    end(): void;
}
export declare function create(params: cef.ParamsMap, batch: cef.Batch): DirectoryWalker;
export {};
