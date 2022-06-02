import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
export interface IHostingS3Props {
    domainName: string;
    appName: string;
}
export interface IHostingS3Outputs {
    bucket: s3.Bucket;
}
export declare class AppPipelineS3 extends Construct {
    outputs: IHostingS3Outputs;
    constructor(scope: Construct, id: string, props: IHostingS3Props);
}
