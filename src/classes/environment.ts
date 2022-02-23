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
        public environments: IEnvironment[],
        public defaultAccountName?: string
    ) {}

    public get(environmentName: string): IEnvironment | undefined {
        return this.environments.find(o => o.environmentName === environmentName);
    }

    public getByAccountId(accountId: string): IEnvironment | undefined {
        return this.environments.find(o => o.accountId === accountId);
    }

    /**
     * Get CDK env (to deploy stack to).
     * If default account exists then use it. Allows the env to be specified on the command line for manual deploys.
     * @param environmentName - environment name.
     * @returns - CDK environment.
     */
    public getEnv(environmentName: string): cdk.Environment {
        const name = this.defaultAccountName ?? environmentName;
        const environment = this.environments.find(o => o.environmentName === name);
        return { account: environment?.accountId, region: environment?.region };
    }
}