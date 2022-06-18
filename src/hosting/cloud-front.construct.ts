import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Config } from '../config/config';

export interface IHostingCloudFrontProps {
    domainName: string;
    bucket: s3.Bucket;
    certificate: acm.Certificate;
    cachePolicyQueryStringAllowList: cloudfront.CacheQueryStringBehavior;
}

export class HostingCloudFront extends Construct {

    public distribution: cdk.aws_cloudfront.Distribution;
    public cachePolicy: cloudfront.CachePolicy;

    constructor(scope: Construct, id: string, props: IHostingCloudFrontProps) {
        super(scope, id);

        const config = new Config(this.node);
        // const stage = config.stage();

        // Create a custom cache policy to allow service worker cache busting.
        this.cachePolicy = new cloudfront.CachePolicy(this, 'PwaCachePolicy', {
            cachePolicyName: `${config.organizationNamePascalCase()}PwaPolicy`,
            comment: 'Policy for Progressive Web App (PWA).',
            // defaultTtl: cdk.Duration.days(2),
            // minTtl: cdk.Duration.minutes(1),
            // maxTtl: cdk.Duration.days(10),
            headerBehavior: cloudfront.CacheHeaderBehavior.none(),
            queryStringBehavior: props.cachePolicyQueryStringAllowList, // e.g. Include 'ngsw-cache-bust' in cache key to allow Angluar Service Worker cache busting.
            cookieBehavior: cloudfront.CacheCookieBehavior.none(),
            enableAcceptEncodingGzip: true,
            enableAcceptEncodingBrotli: true
        });

        // TODO: Handle www???
        // https://medium.com/hatchsoftware/hosting-a-static-single-page-application-on-aws-using-the-cdk-f601b3ed9a6

        this.distribution = new cloudfront.Distribution(this, 'CloudFrontDistribution', {
            defaultBehavior: {
                // TODO: Enable Enable Origin Shield ?
                origin: new origins.S3Origin(props.bucket), // Automatically creates an Origin Access Identity.
                compress: false, // TODO: Change test true.
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: this.cachePolicy
                // originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN, // TODO: Do we need this?
            },
            domainNames: [props.domainName],
            certificate: props.certificate
            // minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            // sslSupportMethod: cloudfront.SSLMethod.SNI
            // additionalBehaviors: {
            //     'index.html': {
            //         origin: bucketOrigin,
            //         viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            //     }
            // }
        });
    }
}
