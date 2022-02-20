import * as cdk from 'aws-cdk-lib';
export interface IEnvironment {
    accountId: string;
    region: string;
    environmentName: string;
    stage: Stage;
}
export interface IEnv {
    account: string;
    region: string;
}
export declare type Stage = 'prod' | 'test' | 'sandbox';
export declare class Environment {
    environments: IEnvironment[];
    constructor(environments: IEnvironment[]);
    get(environmentName: string): IEnvironment | undefined;
    getByAccountId(accountId: string): IEnvironment | undefined;
    getEnv(environmentName: string): cdk.Environment;
}
