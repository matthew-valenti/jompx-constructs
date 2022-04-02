import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { Construct } from 'constructs';
/**
 * NodeJS Lambda. Temporarily here for reference.
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
 *
 * TypeScript Decorators
 * https://www.typescriptlang.org/docs/handbook/decorators.html
 */
export declare class AuroraServerlessDatasSource {
    dataSource: appsync.LambdaDataSource;
    constructor(scope: Construct, graphqlApi: appsync.GraphqlApi);
}
