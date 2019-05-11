import * as cef from 'cef-lib/steps/step';
import * as fs from 'fs';
export declare const declaration: cef.Declaration;
declare class DirectoryWatcher extends cef.Step {
    streams: {
        [key: string]: fs.WriteStream;
    };
    constructor(params: cef.ParamsMap);
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter
     */
    start(): void;
    end(): void;
}
export declare function create(params: cef.ParamsMap): DirectoryWatcher;
export {};
