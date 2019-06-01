import { Declaration, Step, ParamsMap } from 'pojoe/steps';
export declare class FileCopier extends Step {
    static readonly declaration: Declaration;
    constructor(params: ParamsMap);
    copy(): Promise<void>;
    input(inport: string, pojo: any): Promise<void>;
    process(): Promise<void>;
}
