import * as cdk from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Node } from 'constructs';
import { IEnvironment, IStage, IStageEnvironment } from './config.types';

export class Config {

    constructor(
        public appNode: Node
    ) { }

    /**
     * Get stage from command line or config. e.g. sandbox1, test, prod.
     * @returns
     */
    public stage(): string {
        const stage = this.appNode.tryGetContext('stage') ?? this.appNode.tryGetContext('@jompx-local').stage;
        if (!stage) throw Error('Jompx: stage not found! Stage is missing from command line or jompx.local.ts.');
        return stage;
    }

    /**
     * Get list of AWS environemnts. An AWS environment is primarily a accountId/region pair.
     * @returns
     */
    public environments(): IEnvironment[] | undefined {
        return this.appNode.tryGetContext('@jompx').environments;
    }

    /**
     * Get an AWS environment by friendly name.
     * @param name
     * @returns
     */
    public environmentByName(name: string): IEnvironment | undefined {
        return this.appNode.tryGetContext('@jompx').environments.find((o: IEnvironment) => o.name === name);
    }

    /**
     * Get an AWS environment by AWS account id.
     * @param accountId
     * @returns
     */
    public environmentByAccountId(accountId: string): IEnvironment | undefined {
        return this.appNode.tryGetContext('@jompx').environments.find((o: IEnvironment) => o.accountId === accountId);
    }

    /**
     * Get config stages. Use dot notation to get a stage e.g. stages.prod
     * Constructs don't support map object. To convert to map use: new Map(Object.entries(config.stages()));
     * @returns
     */
    public stages(): IStage | undefined {
        const configStages: IStage = this.appNode.tryGetContext('@jompx').stages;
        const localStages: IStage = this.appNode.tryGetContext('@jompx-local').stages;

        // Get stages from config and local config. Local config overrides config.
        const stages = { ...configStages, ...localStages };

        // TODO: Remove. I don't think we want to try to join an account to a stage.
        // // For each stage environment join to account environment (and set account).
        // const map = new Map(Object.entries(stages));
        // for (const value of map.values()) {
        //     value.environments.forEach(environment => {
        //         environment.account = this.environmentByName(environment.name);
        //     });
        // }

        return stages;
    }

    public stageEnvironments(stageName: string): IStageEnvironment[] | undefined {
        let rv = undefined;
        const stages = this.stages();

        if (stages) {
            const map = new Map(Object.entries(stages));
            rv = map.get(stageName)?.environments;
        }

        return rv;
    }

    /**
     * Get env (AWS accountId + region) from config (type + stageName) e.g. cicd + test = xxxxxxxxxxxx + us-west-2.
     * If no stage provided then will use current stage.
     * @param type
     * @param stage
     * @returns
     */
    public env(type: string, stage?: string): cdk.Environment | undefined {
        let rv = undefined;

        const stageEnvironments = this.stageEnvironments(stage ?? this.stage());
        const environmentName = stageEnvironments?.find(o => o.type === type)?.name;

        if (environmentName) {
            const environment = this.environmentByName(environmentName);
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