import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface ICognitoProps {
    userPoolProps: cdk.aws_cognito.UserPoolProps;
}
/**
 * AWS AppSync (serverless GraphQL).
 */
export declare class Cognito extends Construct {
    userPool: cdk.aws_cognito.UserPool;
    constructor(scope: Construct, id: string, props: ICognitoProps);
}
