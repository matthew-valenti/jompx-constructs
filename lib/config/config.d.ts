import * as cdk from 'aws-cdk-lib';
import { Node } from 'constructs';
import { IEnvironment, IApp, IStage, IStageDeployment } from './config.types';
export declare class Config {
    appNode: Node;
    constructor(appNode: Node);
    organizationName(): string;
    organizationNamePascalCase(): string;
    /**
     * Get stage from command line or config. e.g. sandbox1, test, prod.
     * @returns
     */
    stage(): string;
    /**
     * Get list of AWS environemnts. An AWS environment is primarily a accountId/region pair.
     * @returns
     */
    environments(): IEnvironment[] | undefined;
    /**
     * Get an AWS environment by friendly name.
     * @param name
     * @returns
     */
    environmentByName(name: string): IEnvironment | undefined;
    /**
     * Get an AWS environment by AWS account id.
     * @param accountId
     * @returns
     */
    environmentByAccountId(accountId: string): IEnvironment | undefined;
    /**
     * Get list of apps. An app is typically deployed across all stages and is acceccable on each stage.
     * @returns
     */
    apps(): IApp[] | undefined;
    /**
     * Get a distinct/unique list of root domain names across all apps.
     * @returns
     */
    appRootDomainNames(): string[] | undefined;
    /**
     * Get config stages. Use dot notation to get a stage e.g. stages.prod
     * JSII constructs don't support map object. To convert to map use: new Map(Object.entries(config.stages()));
     * @returns
     */
    stages(): IStage | undefined;
    stageDeployments(stageName: string): IStageDeployment[] | undefined;
    /**
     * Get env (AWS accountId + region) from config (type + stage) e.g. cicd + test = xxxxxxxxxxxx + us-west-2.
     * If no stage provided then will use current stage.
     * @param deploymentType
     * @param stage
     * @returns
     */
    env(deploymentType: string, stage?: string): cdk.Environment | undefined;
}
