import { Declaration, Step, ParamsMap } from 'pojoe/steps';
export declare class DirectoryWalker extends Step {
    static readonly declaration: Declaration;
    constructor(params: ParamsMap);
    /**
     * walk recursively a directory and output files mattching pattern and in extension list
     * @param {string} dir : the directory to walk
     * @param {RegExp} pattern : the pattern filter
     * @param {RegExp} extension : the extension list filter
     */
    walk(dir: string, filter: RegExp, recursive: boolean, outdirs: boolean, outfiles: boolean): Promise<void>;
    doit(): Promise<void>;
}
