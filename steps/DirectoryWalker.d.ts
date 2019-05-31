import { Declaration, Step, ParamsMap } from 'pojoe/steps';
export declare class DirectoryWalker extends Step {
    static readonly declaration: Declaration;
    constructor(params: ParamsMap);
    process(): Promise<void>;
}
