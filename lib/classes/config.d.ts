import * as cdk from 'aws-cdk-lib';
import { Node } from 'constructs';
import { IEnvironment, IStageEnvironment } from '../types/config.interface';
export declare class Config {
    appNode: Node;
    constructor(appNode: Node);
    getStage(): string;
    getEnvironment(environmentName: string): IEnvironment | undefined;
    getEnvironmentByAccountId(accountId: string): IEnvironment | undefined;
    getStageEnvironments(stageName: string): IStageEnvironment[] | undefined;
    getEnv(environmentType: string, stageName?: string): cdk.Environment | undefined;
}
