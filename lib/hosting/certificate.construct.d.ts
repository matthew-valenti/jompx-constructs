import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
export interface IHostingCertificateProps {
    domainName: string;
}
export interface IHostingCertificateOutputs {
    publicHostedZone: route53.IHostedZone;
    certificate: acm.Certificate | undefined;
}
export declare class HostingCertificate extends Construct {
    outputs: IHostingCertificateOutputs;
    constructor(scope: Construct, id: string, props: IHostingCertificateProps);
}
