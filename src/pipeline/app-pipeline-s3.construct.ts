import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { Config } from '../config/config';

/**
 * S3 bucket required to temporaryily store GitHub branch files (for app pipeline).
 */
export class AppPipelineS3 extends Construct {

    bucket: s3.Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const config = new Config(this.node);
        const stage = config.stage();
        const stageNamePascalCase = changeCase.pascalCase(stage);

        // Create bucket to save github sandbox feature branch files (as zip).
        this.bucket = new s3.Bucket(this, `${config.organizationNamePascalCase()}AppPipelineBranch${stageNamePascalCase}`, {
            // Version must be true to use as CodePipeline source.
            versioned: true,
            publicReadAccess: false, // TODO: Is this needed?
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            // Destroy bucket on stack delete. Bucket contains temporary copy of source control files only.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            // Delete all bucket objects on bucket/stack destroy.
            autoDeleteObjects: true
        });
    }
}
