import * as cef from 'cef-lib/step';
import * as fs from 'fs';
export declare const declaration: cef.Declaration;
declare class FileLogger extends cef.Step {
    streams: {
        [key: string]: fs.WriteStream;
    };
    constructor(params: cef.ParamsMap, batch: cef.Batch);
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extensions : the extension list filter
     */
    start(): void;
    end(): void;
    input_features(): void;
    /**
     * manage a pool of streams for multiple opened files for output
     * @param filename filename to get writestrem
     */
    getstream(filename: string): fs.WriteStream;
}
export declare function create(params: cef.ParamsMap, batch: cef.Batch): FileLogger;
export {};
