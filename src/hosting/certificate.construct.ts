import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { Config } from '../config/config';

export interface IHostingCertificateProps {
    domainName: string;
}

export interface IHostingCertificateOutputs {
    publicHostedZone: route53.IHostedZone;
    certificate: acm.Certificate | undefined;
}

export class HostingCertificate extends Construct {

    public outputs: IHostingCertificateOutputs = {} as IHostingCertificateOutputs;

    constructor(scope: Construct, id: string, props: IHostingCertificateProps) {
        super(scope, id);

        const config = new Config(this.node);
        const stage = config.stage();

        // Use root/bare/apex domain name for production or subdomain for other AWS account stages.
        const stageDomainName = stage === 'prod' ? props.domainName : `${stage}.${props.domainName}`;

        // Lookup Route53 public hosted zone created by org-formation.
        // If AWS account doesn't have a hosted zone subdomain then a certificate will not be created.
        this.outputs.publicHostedZone = route53.PublicHostedZone.fromLookup(this, 'LookupHostedZone', { domainName: stageDomainName });

        // TODO: ??? Use the CaaAmazonRecord construct to easily restrict certificate authorities allowed to issue certificates for a domain to Amazon only.

        if (this.outputs.publicHostedZone) {
            this.outputs.certificate = new acm.Certificate(this, 'PublicHostedZoneCertificate', {
                // Wildcard protects one subdomain level only e.g. *.example.com can protect login.example.com, and test.example.com, but it cannot protect test.login.example.com
                domainName: `*.${stageDomainName}`,
                // Validate certificate via DNS (auto created).
                validation: acm.CertificateValidation.fromDns(this.outputs.publicHostedZone)
            });
        }
    }
}
