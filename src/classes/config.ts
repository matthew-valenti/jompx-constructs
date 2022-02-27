import * as cdk from 'aws-cdk-lib';
import { Node } from 'constructs';
import { IEnvironment, IStage, IStageEnvironment } from '../types/config.interface';

export class Config {

    constructor(
        public appNode: Node
    ) { }

    public getStage(): string {
        const stage = this.appNode.tryGetContext('stage') ?? this.appNode.tryGetContext('@jompx-local').stage;
        if (!stage) throw Error('Jompx stage not found! Stage is missing from command line or jompx.local.ts.');
        return stage;
    }

    public getEnvironment(environmentName: string): IEnvironment | undefined {
        return this.appNode.tryGetContext('@jompx').environments.find((o: IEnvironment) => o.name === environmentName);
    }

    public getEnvironmentByAccountId(accountId: string): IEnvironment | undefined {
        return this.appNode.tryGetContext('@jompx').environments.find((o: IEnvironment) => o.accountId === accountId);
    }

    public getStageEnvironments(stageName: string): IStageEnvironment[] | undefined {
        // Get stages from config and local config. Local config overrides config.
        const configStages: IStage = this.appNode.tryGetContext('@jompx').stages;
        const localStages: IStage = this.appNode.tryGetContext('@jompx-local').stages;
        const stages = { ...configStages, ...localStages };

        const map = new Map(Object.entries(stages));
        return map.get(stageName)?.environments;
    }

    public getEnv(environmentType: string, stageName?: string): cdk.Environment | undefined {
        let rv = undefined;

        const stageEnvironments = this.getStageEnvironments(stageName ?? this.getStage());
        const environmentName = stageEnvironments?.find(o => o.environmentType === environmentType)?.environmentName;

        if (environmentName) {
            const environment = this.getEnvironment(environmentName);
            rv = { account: environment?.accountId, region: environment?.region };
        }

        return rv;
    }
}