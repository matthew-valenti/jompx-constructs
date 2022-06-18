import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
/**
 * S3 bucket required to temporaryily store GitHub branch files (for app pipeline).
 */
export declare class AppPipelineS3 extends Construct {
    bucket: s3.Bucket;
    constructor(scope: Construct, id: string);
}
