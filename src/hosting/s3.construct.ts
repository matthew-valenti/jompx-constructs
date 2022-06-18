import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import { Config } from '../config/config';

export interface IHostingS3Props {
    domainName: string;
}

export class HostingS3 extends Construct {

    public bucket: s3.Bucket;

    constructor(scope: Construct, id: string, props: IHostingS3Props) {
        super(scope, id);

        // const config = new Config(this.node);
        // const stage = config.stage();

        this.bucket = new s3.Bucket(this, 'HostingS3Bucket', {
            // Bucket name must be globally unique across all AWS accounts.
            // Bucket name must match app urls e.g. admin.mydomain.com, admin.sandbox1.mydomain.com
            bucketName: props.domainName,
            // Required for public website.
            publicReadAccess: true,
            // Single Page App (SPA) settings.
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            // Destroy bucket when stack destroyed. Bucket is disposable and can be destroyed and re-created as needed.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            // Auto delete files on stack/bucket destroy.
            autoDeleteObjects: true
        });
    }
}
