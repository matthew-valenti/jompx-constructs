import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
export interface IHostCertificateProps {
    domainName: string;
}
export interface IHostCertificateOutputs {
    publicHostedZone: route53.IHostedZone;
    certificate: acm.Certificate | undefined;
}
export declare class HostCertificate extends Construct {
    outputs: IHostCertificateOutputs;
    constructor(scope: Construct, id: string, props: IHostCertificateProps);
}
