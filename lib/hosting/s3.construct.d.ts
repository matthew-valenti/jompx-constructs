import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
export interface IHostingS3Props {
    domainName: string;
}
export declare class HostingS3 extends Construct {
    bucket: s3.Bucket;
    constructor(scope: Construct, id: string, props: IHostingS3Props);
}
