import { Declaration, Step, ParamsMap } from 'pojoe/steps';
export declare class FileRemover extends Step {
    static readonly declaration: Declaration;
    constructor(params: ParamsMap);
    remove(): Promise<void>;
    input(inport: string, pojo: any): Promise<void>;
    process(): Promise<void>;
}
