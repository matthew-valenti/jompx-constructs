import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
export interface IAppPipelineS3Outputs {
    bucket: s3.Bucket;
}
/**
 * S3 bucket required to temporaryily store GitHub branch files (for app pipeline).
 */
export declare class AppPipelineS3 extends Construct {
    outputs: IAppPipelineS3Outputs;
    constructor(scope: Construct, id: string);
}
