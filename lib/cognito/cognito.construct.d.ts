import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface ICognitoProps {
    /**
     * Name of the Cognito user pool resource as it appears in the AWS Console.
     */
    name: string;
    /**
     * Optional CDK user pool props to override AWS and Jompx default prop values.
     */
    userPoolProps?: cdk.aws_cognito.UserPoolProps;
    /**
     * List of camelCase app codes. A user pool client will be created for each app.
     */
    appCodes?: string[];
    /**
     * List of Cognito user pool groups to create.
     */
    userPoolGroups?: cdk.aws_cognito.CfnUserPoolGroupProps[];
}
/**
 * AWS AppSync (serverless GraphQL).
 */
export declare class Cognito extends Construct {
    userPool: cdk.aws_cognito.UserPool;
    userPoolClients: cdk.aws_cognito.UserPoolClient[];
    constructor(scope: Construct, id: string, props: ICognitoProps);
}
