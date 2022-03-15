import * as cdk from 'aws-cdk-lib';
import { Node } from 'constructs';
import { IEnvironment, IStage, IStageEnvironment } from '../types/config.interface';
export declare class Config {
    appNode: Node;
    constructor(appNode: Node);
    stage(): string;
    environments(): IEnvironment[] | undefined;
    environmentByName(name: string): IEnvironment | undefined;
    environmentByAccountId(accountId: string): IEnvironment | undefined;
    stages(): IStage | undefined;
    stageEnvironments(stageName: string): IStageEnvironment[] | undefined;
    env(type: string, stageName?: string): cdk.Environment | undefined;
    organizationName(): string;
    organizationNamePascalCase(): string;
}
