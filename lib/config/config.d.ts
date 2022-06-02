import * as cdk from 'aws-cdk-lib';
import { Node } from 'constructs';
import { IEnvironment, IStage, IStageEnvironment } from './config.types';
export declare class Config {
    appNode: Node;
    constructor(appNode: Node);
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
     * Get config stages. Use dot notation to get a stage e.g. stages.prod
     * Constructs don't support map object. To convert to map use: new Map(Object.entries(config.stages()));
     * @returns
     */
    stages(): IStage | undefined;
    stageEnvironments(stageName: string): IStageEnvironment[] | undefined;
    /**
     * Get env (AWS accountId + region) from config (type + stageName) e.g. cicd + test = xxxxxxxxxxxx + us-west-2.
     * If no stage provided then will use current stage.
     * @param type
     * @param stage
     * @returns
     */
    env(type: string, stage?: string): cdk.Environment | undefined;
    organizationName(): string;
    organizationNamePascalCase(): string;
}
