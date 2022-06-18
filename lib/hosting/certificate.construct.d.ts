import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
export interface IHostingCertificateProps {
    rootDomainName: string;
    restrictCertificateAuthorities?: boolean;
}
/**
 * The certificate must be present in the AWS Certificate Manager (ACM) service in the US East (N. Virginia) region: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront-readme.html
 */
export declare class HostingCertificate extends Construct {
    publicHostedZone: route53.IHostedZone | undefined;
    certificate: acm.Certificate | undefined;
    caaAmazonRecord: route53.CaaAmazonRecord | undefined;
    constructor(scope: Construct, id: string, props: IHostingCertificateProps);
}
