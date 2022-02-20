export interface IEnvironment {
    accountId: string;
    region: string;
    environmentName: string;
    stage: Stage;
}
export declare type Stage = 'prod' | 'test';
export declare class Environment {
    static getByName(environments: IEnvironment[], name: string): Environment | undefined;
}
