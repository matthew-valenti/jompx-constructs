import * as cdk from 'aws-cdk-lib';
import { Node } from 'constructs';
import { IEnvironment, IStageEnvironment } from '../types/config.interface';
export declare class Config {
    appNode: Node;
    constructor(appNode: Node);
    stage(): string;
    environments(): IEnvironment[] | undefined;
    environment(environmentName: string): IEnvironment | undefined;
    environmentByAccountId(accountId: string): IEnvironment | undefined;
    stageEnvironments(stageName: string): IStageEnvironment[] | undefined;
    env(environmentType: string, stageName?: string): cdk.Environment | undefined;
    organizationName(): string;
    organizationNamePascalCase(): string;
}
