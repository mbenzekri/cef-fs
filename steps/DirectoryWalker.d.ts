import * as cef from 'cef-lib/step';
export declare const declaration: cef.Declaration;
declare class DirectoryWalker extends cef.Step {
    constructor(params: cef.ParamsMap, batch: cef.Batch);
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extension : the extension list filter
     */
    walk(dir: string, re_file: RegExp, re_ext: RegExp): void;
    start(): void;
    end(): void;
}
export declare function create(params: cef.ParamsMap, batch: cef.Batch): DirectoryWalker;
export {};
