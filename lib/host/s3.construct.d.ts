import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
export interface ICertificateProps {
    domainName: string;
}
export interface ICertificateOutputs {
    publicHostedZone: route53.IHostedZone;
    certificate: acm.Certificate | undefined;
}
export declare class Certificate extends Construct {
    outputs: ICertificateOutputs;
    constructor(scope: Construct, id: string, props: ICertificateProps);
}
