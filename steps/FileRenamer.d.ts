import { Declaration, Step, ParamsMap } from 'pojoe/steps';
export declare class FileRenamer extends Step {
    static readonly declaration: Declaration;
    constructor(params: ParamsMap);
    rename(): Promise<void>;
    input(inport: string, pojo: any): Promise<void>;
    process(): Promise<void>;
}
