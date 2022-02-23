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
    defaultAccountName?: string | undefined;
    constructor(environments: IEnvironment[], defaultAccountName?: string | undefined);
    get(environmentName: string): IEnvironment | undefined;
    getByAccountId(accountId: string): IEnvironment | undefined;
    /**
     * Get CDK env (to deploy stack to).
     * If default account exists then use it. Allows the env to be specified on the command line for manual deploys.
     * @param environmentName - environment name.
     * @returns - CDK environment.
     */
    getEnv(environmentName: string): cdk.Environment;
}
