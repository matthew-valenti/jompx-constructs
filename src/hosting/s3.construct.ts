import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { Config } from '../config/config';


export interface IHostingS3Props {
    domainName: string;
    appName: string;
}

export interface IHostingS3Outputs {
    bucket: s3.Bucket;
}

export class HostingS3 extends Construct {

    public outputs: IHostingS3Outputs = {} as IHostingS3Outputs;

    constructor(scope: Construct, id: string, props: IHostingS3Props) {
        super(scope, id);

        const config = new Config(this.node);
        const stage = config.stage();

        this.outputs.bucket = new s3.Bucket(this, `${changeCase.pascalCase(props.appName)}HostingBucket`, {
            // Bucket name must be globally unique across all AWS accounts.
            // Bucket name must match app urls e.g. admin.mydomain.com, admin.sandbox1.mydomain.com
            bucketName: `${props.appName}.${stage}.${props.domainName}`,
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
