import * as cef from 'cef-lib';
import * as fs from 'fs';
export declare const declaration: cef.Declaration;
declare class FileLogger extends cef.Step {
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
    end(): Promise<void>;
    doit(): Promise<void>;
    /**
     * manage a pool of streams for multiple opened files for output
     * @param filename filename to get writestrem
     */
    getstream(filename: string): fs.WriteStream;
}
export declare function create(params: cef.ParamsMap): FileLogger;
export {};
