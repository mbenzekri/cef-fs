import { Declaration, Step, ParamsMap } from 'pojoe/steps';
export declare class FileDirRemover extends Step {
    static readonly declaration: Declaration;
    constructor(params: ParamsMap);
    input(inport: string, pojo: any): Promise<{}>;
}
