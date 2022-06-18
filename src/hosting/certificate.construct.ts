import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { Config } from '../config/config';

export interface IHostingCertificateProps {
    rootDomainName: string;
    restrictCertificateAuthorities?: boolean;
}

/**
 * The certificate must be present in the AWS Certificate Manager (ACM) service in the US East (N. Virginia) region: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront-readme.html
 */
export class HostingCertificate extends Construct {

    public publicHostedZone: route53.IHostedZone | undefined;
    public certificate: acm.Certificate | undefined;
    public caaAmazonRecord: route53.CaaAmazonRecord | undefined;

    constructor(scope: Construct, id: string, props: IHostingCertificateProps) {
        super(scope, id);

        const restrictCertificateAuthorities = props.restrictCertificateAuthorities === undefined ? true : props.restrictCertificateAuthorities;

        const config = new Config(this.node);
        const stage = config.stage();

        // Use root/bare/apex domain name for production or subdomain for other AWS account stages.
        const domainName = stage === 'prod' ? props.rootDomainName : `${stage}.${props.rootDomainName}`;

        // Lookup Route53 public hosted zone created by org-formation.
        // If AWS account doesn't have a hosted zone subdomain then a certificate will not be created.
        this.publicHostedZone = route53.PublicHostedZone.fromLookup(this, 'LookupHostedZone', { domainName });

        // TODO: ??? Use the CaaAmazonRecord construct to easily restrict certificate authorities allowed to issue certificates for a domain to Amazon only.

        if (this.publicHostedZone) {
            // this.certificate = new acm.Certificate(this, 'PublicHostedZoneCertificate', {
            //     // Wildcard protects one subdomain level only e.g. *.example.com can protect login.example.com, and test.example.com, but it cannot protect test.login.example.com
            //     domainName: `*.${domainName}`,
            //     // Validate certificate via DNS (auto created).
            //     validation: acm.CertificateValidation.fromDns(this.publicHostedZone),
            // });

            // Create a cross-region certificate (in region us-east-1).
            // ACM certificates that are used with CloudFront -- or higher-level constructs which rely on CloudFront -- must be in the us-east-1 region. The DnsValidatedCertificate construct exists to facilitate creating these certificates cross-region. This resource can only be used with Route53-based DNS validation.
            this.certificate = new acm.DnsValidatedCertificate(this, 'PublicHostedZoneCertificate', {
                hostedZone: this.publicHostedZone,
                domainName: `*.${domainName}`,
                region: 'us-east-1' // must be in the us-east-1 region to use with CloudFront.
            });

            // Create a CAA record to restrict certificate authorities allowed to issue certificates for a domain to Amazon only.
            if (restrictCertificateAuthorities) {
                this.caaAmazonRecord = new route53.CaaAmazonRecord(this, 'CaaAmazonRecord', {
                    zone: this.publicHostedZone,
                    comment: 'Restrict certificate authorities allowed to issue certificates to Amazon only.'
                });
            }

            // TODO: Create CloudWatch alarm.
            // this.certificate.metricDaysToExpiry().createAlarm(this, 'Alarm', {
            //     comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
            //     evaluationPeriods: 1,
            //     threshold: 45, // Automatic rotation happens between 60 and 45 days before expiry
            // });
        }
    }
}
