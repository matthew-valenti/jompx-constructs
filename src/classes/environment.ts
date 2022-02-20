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

export type Stage = 'prod' | 'test' | 'sandbox';

export class Environment {

    constructor(
        public environments: IEnvironment[]
    ) {}

    public get(environmentName: string): IEnvironment | undefined {
        return this.environments.find(o => o.environmentName === environmentName);
    }

    public getByAccountId(accountId: string): IEnvironment | undefined {
        return this.environments.find(o => o.accountId === accountId);
    }

    public getEnv(environmentName: string): cdk.Environment {
        const environment = this.environments.find(o => o.environmentName === environmentName);
        return { account: environment?.accountId, region: environment?.region };
    }
}