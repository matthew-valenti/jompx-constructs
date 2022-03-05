import * as cdk from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Node } from 'constructs';
import { IEnvironment, IStage, IStageEnvironment } from '../types/config.interface';

export class Config {

    constructor(
        public appNode: Node
    ) { }

    public stage(): string {
        const stage = this.appNode.tryGetContext('stage') ?? this.appNode.tryGetContext('@jompx-local').stage;
        if (!stage) throw Error('Jompx stage not found! Stage is missing from command line or jompx.local.ts.');
        return stage;
    }

    public environments(): IEnvironment[] | undefined {
        return this.appNode.tryGetContext('@jompx').environments;
    }

    public environment(environmentName: string): IEnvironment | undefined {
        return this.appNode.tryGetContext('@jompx').environments.find((o: IEnvironment) => o.name === environmentName);
    }

    public environmentByAccountId(accountId: string): IEnvironment | undefined {
        return this.appNode.tryGetContext('@jompx').environments.find((o: IEnvironment) => o.accountId === accountId);
    }

    public stageEnvironments(stageName: string): IStageEnvironment[] | undefined {
        // Get stages from config and local config. Local config overrides config.
        const configStages: IStage = this.appNode.tryGetContext('@jompx').stages;
        const localStages: IStage = this.appNode.tryGetContext('@jompx-local').stages;
        const stages = { ...configStages, ...localStages };

        const map = new Map(Object.entries(stages));
        return map.get(stageName)?.environments;
    }

    public env(environmentType: string, stageName?: string): cdk.Environment | undefined {
        let rv = undefined;

        const stageEnvironments = this.stageEnvironments(stageName ?? this.stage());
        const environmentName = stageEnvironments?.find(o => o.environmentType === environmentType)?.environmentName;

        if (environmentName) {
            const environment = this.environment(environmentName);
            rv = { account: environment?.accountId, region: environment?.region };
        }

        return rv;
    }

    public organizationName(): string {
        return this.appNode.tryGetContext('@jompx').organizationName;
    }

    public organizationNamePascalCase(): string {
        return changeCase.pascalCase(this.organizationName());
    }
}