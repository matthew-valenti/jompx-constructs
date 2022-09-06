"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostingCertificate = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const acm = require("aws-cdk-lib/aws-certificatemanager");
const route53 = require("aws-cdk-lib/aws-route53");
const constructs_1 = require("constructs");
const config_1 = require("../config/config");
/**
 * The certificate must be present in the AWS Certificate Manager (ACM) service in the US East (N. Virginia) region: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront-readme.html
 */
class HostingCertificate extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const restrictCertificateAuthorities = props.restrictCertificateAuthorities === undefined ? true : props.restrictCertificateAuthorities;
        const config = new config_1.Config(this.node);
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
exports.HostingCertificate = HostingCertificate;
_a = JSII_RTTI_SYMBOL_1;
HostingCertificate[_a] = { fqn: "@jompx/constructs.HostingCertificate", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGUuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hvc3RpbmcvY2VydGlmaWNhdGUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQTBEO0FBQzFELG1EQUFtRDtBQUNuRCwyQ0FBdUM7QUFDdkMsNkNBQTBDO0FBTzFDOztHQUVHO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxzQkFBUztJQU03QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQStCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSw4QkFBOEIsR0FBRyxLQUFLLENBQUMsOEJBQThCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQztRQUV4SSxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTdCLDJGQUEyRjtRQUMzRixNQUFNLFVBQVUsR0FBRyxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFaEcsOERBQThEO1FBQzlELDhGQUE4RjtRQUM5RixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXRHLG9KQUFvSjtRQUVwSixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixnRkFBZ0Y7WUFDaEYseUtBQXlLO1lBQ3pLLHFDQUFxQztZQUNyQyxzREFBc0Q7WUFDdEQsNEVBQTRFO1lBQzVFLE1BQU07WUFFTiwyREFBMkQ7WUFDM0QsbVRBQW1UO1lBQ25ULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLDZCQUE2QixFQUFFO2dCQUNwRixVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtnQkFDakMsVUFBVSxFQUFFLEtBQUssVUFBVSxFQUFFO2dCQUM3QixNQUFNLEVBQUUsV0FBVyxDQUFDLDBEQUEwRDthQUNqRixDQUFDLENBQUM7WUFFSCxxSEFBcUg7WUFDckgsSUFBSSw4QkFBOEIsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO29CQUN4RSxJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtvQkFDM0IsT0FBTyxFQUFFLGdGQUFnRjtpQkFDNUYsQ0FBQyxDQUFDO2FBQ047WUFFRCxpQ0FBaUM7WUFDakMscUVBQXFFO1lBQ3JFLDZFQUE2RTtZQUM3RSw0QkFBNEI7WUFDNUIsd0ZBQXdGO1lBQ3hGLE1BQU07U0FDVDtJQUNMLENBQUM7O0FBdERMLGdEQXVEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFjbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcclxuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1Myc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUhvc3RpbmdDZXJ0aWZpY2F0ZVByb3BzIHtcclxuICAgIHJvb3REb21haW5OYW1lOiBzdHJpbmc7XHJcbiAgICByZXN0cmljdENlcnRpZmljYXRlQXV0aG9yaXRpZXM/OiBib29sZWFuO1xyXG59XHJcblxyXG4vKipcclxuICogVGhlIGNlcnRpZmljYXRlIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgQVdTIENlcnRpZmljYXRlIE1hbmFnZXIgKEFDTSkgc2VydmljZSBpbiB0aGUgVVMgRWFzdCAoTi4gVmlyZ2luaWEpIHJlZ2lvbjogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5hd3NfY2xvdWRmcm9udC1yZWFkbWUuaHRtbFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEhvc3RpbmdDZXJ0aWZpY2F0ZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcblxyXG4gICAgcHVibGljIHB1YmxpY0hvc3RlZFpvbmU6IHJvdXRlNTMuSUhvc3RlZFpvbmUgfCB1bmRlZmluZWQ7XHJcbiAgICBwdWJsaWMgY2VydGlmaWNhdGU6IGFjbS5DZXJ0aWZpY2F0ZSB8IHVuZGVmaW5lZDtcclxuICAgIHB1YmxpYyBjYWFBbWF6b25SZWNvcmQ6IHJvdXRlNTMuQ2FhQW1hem9uUmVjb3JkIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJSG9zdGluZ0NlcnRpZmljYXRlUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCByZXN0cmljdENlcnRpZmljYXRlQXV0aG9yaXRpZXMgPSBwcm9wcy5yZXN0cmljdENlcnRpZmljYXRlQXV0aG9yaXRpZXMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBwcm9wcy5yZXN0cmljdENlcnRpZmljYXRlQXV0aG9yaXRpZXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG5cclxuICAgICAgICAvLyBVc2Ugcm9vdC9iYXJlL2FwZXggZG9tYWluIG5hbWUgZm9yIHByb2R1Y3Rpb24gb3Igc3ViZG9tYWluIGZvciBvdGhlciBBV1MgYWNjb3VudCBzdGFnZXMuXHJcbiAgICAgICAgY29uc3QgZG9tYWluTmFtZSA9IHN0YWdlID09PSAncHJvZCcgPyBwcm9wcy5yb290RG9tYWluTmFtZSA6IGAke3N0YWdlfS4ke3Byb3BzLnJvb3REb21haW5OYW1lfWA7XHJcblxyXG4gICAgICAgIC8vIExvb2t1cCBSb3V0ZTUzIHB1YmxpYyBob3N0ZWQgem9uZSBjcmVhdGVkIGJ5IG9yZy1mb3JtYXRpb24uXHJcbiAgICAgICAgLy8gSWYgQVdTIGFjY291bnQgZG9lc24ndCBoYXZlIGEgaG9zdGVkIHpvbmUgc3ViZG9tYWluIHRoZW4gYSBjZXJ0aWZpY2F0ZSB3aWxsIG5vdCBiZSBjcmVhdGVkLlxyXG4gICAgICAgIHRoaXMucHVibGljSG9zdGVkWm9uZSA9IHJvdXRlNTMuUHVibGljSG9zdGVkWm9uZS5mcm9tTG9va3VwKHRoaXMsICdMb29rdXBIb3N0ZWRab25lJywgeyBkb21haW5OYW1lIH0pO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiA/Pz8gVXNlIHRoZSBDYWFBbWF6b25SZWNvcmQgY29uc3RydWN0IHRvIGVhc2lseSByZXN0cmljdCBjZXJ0aWZpY2F0ZSBhdXRob3JpdGllcyBhbGxvd2VkIHRvIGlzc3VlIGNlcnRpZmljYXRlcyBmb3IgYSBkb21haW4gdG8gQW1hem9uIG9ubHkuXHJcblxyXG4gICAgICAgIGlmICh0aGlzLnB1YmxpY0hvc3RlZFpvbmUpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5jZXJ0aWZpY2F0ZSA9IG5ldyBhY20uQ2VydGlmaWNhdGUodGhpcywgJ1B1YmxpY0hvc3RlZFpvbmVDZXJ0aWZpY2F0ZScsIHtcclxuICAgICAgICAgICAgLy8gICAgIC8vIFdpbGRjYXJkIHByb3RlY3RzIG9uZSBzdWJkb21haW4gbGV2ZWwgb25seSBlLmcuICouZXhhbXBsZS5jb20gY2FuIHByb3RlY3QgbG9naW4uZXhhbXBsZS5jb20sIGFuZCB0ZXN0LmV4YW1wbGUuY29tLCBidXQgaXQgY2Fubm90IHByb3RlY3QgdGVzdC5sb2dpbi5leGFtcGxlLmNvbVxyXG4gICAgICAgICAgICAvLyAgICAgZG9tYWluTmFtZTogYCouJHtkb21haW5OYW1lfWAsXHJcbiAgICAgICAgICAgIC8vICAgICAvLyBWYWxpZGF0ZSBjZXJ0aWZpY2F0ZSB2aWEgRE5TIChhdXRvIGNyZWF0ZWQpLlxyXG4gICAgICAgICAgICAvLyAgICAgdmFsaWRhdGlvbjogYWNtLkNlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKHRoaXMucHVibGljSG9zdGVkWm9uZSksXHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgY3Jvc3MtcmVnaW9uIGNlcnRpZmljYXRlIChpbiByZWdpb24gdXMtZWFzdC0xKS5cclxuICAgICAgICAgICAgLy8gQUNNIGNlcnRpZmljYXRlcyB0aGF0IGFyZSB1c2VkIHdpdGggQ2xvdWRGcm9udCAtLSBvciBoaWdoZXItbGV2ZWwgY29uc3RydWN0cyB3aGljaCByZWx5IG9uIENsb3VkRnJvbnQgLS0gbXVzdCBiZSBpbiB0aGUgdXMtZWFzdC0xIHJlZ2lvbi4gVGhlIERuc1ZhbGlkYXRlZENlcnRpZmljYXRlIGNvbnN0cnVjdCBleGlzdHMgdG8gZmFjaWxpdGF0ZSBjcmVhdGluZyB0aGVzZSBjZXJ0aWZpY2F0ZXMgY3Jvc3MtcmVnaW9uLiBUaGlzIHJlc291cmNlIGNhbiBvbmx5IGJlIHVzZWQgd2l0aCBSb3V0ZTUzLWJhc2VkIEROUyB2YWxpZGF0aW9uLlxyXG4gICAgICAgICAgICB0aGlzLmNlcnRpZmljYXRlID0gbmV3IGFjbS5EbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZSh0aGlzLCAnUHVibGljSG9zdGVkWm9uZUNlcnRpZmljYXRlJywge1xyXG4gICAgICAgICAgICAgICAgaG9zdGVkWm9uZTogdGhpcy5wdWJsaWNIb3N0ZWRab25lLFxyXG4gICAgICAgICAgICAgICAgZG9tYWluTmFtZTogYCouJHtkb21haW5OYW1lfWAsXHJcbiAgICAgICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnIC8vIG11c3QgYmUgaW4gdGhlIHVzLWVhc3QtMSByZWdpb24gdG8gdXNlIHdpdGggQ2xvdWRGcm9udC5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBDQUEgcmVjb3JkIHRvIHJlc3RyaWN0IGNlcnRpZmljYXRlIGF1dGhvcml0aWVzIGFsbG93ZWQgdG8gaXNzdWUgY2VydGlmaWNhdGVzIGZvciBhIGRvbWFpbiB0byBBbWF6b24gb25seS5cclxuICAgICAgICAgICAgaWYgKHJlc3RyaWN0Q2VydGlmaWNhdGVBdXRob3JpdGllcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWFBbWF6b25SZWNvcmQgPSBuZXcgcm91dGU1My5DYWFBbWF6b25SZWNvcmQodGhpcywgJ0NhYUFtYXpvblJlY29yZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICB6b25lOiB0aGlzLnB1YmxpY0hvc3RlZFpvbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudDogJ1Jlc3RyaWN0IGNlcnRpZmljYXRlIGF1dGhvcml0aWVzIGFsbG93ZWQgdG8gaXNzdWUgY2VydGlmaWNhdGVzIHRvIEFtYXpvbiBvbmx5LidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPOiBDcmVhdGUgQ2xvdWRXYXRjaCBhbGFybS5cclxuICAgICAgICAgICAgLy8gdGhpcy5jZXJ0aWZpY2F0ZS5tZXRyaWNEYXlzVG9FeHBpcnkoKS5jcmVhdGVBbGFybSh0aGlzLCAnQWxhcm0nLCB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb21wYXJpc29uT3BlcmF0b3I6IGNsb3Vkd2F0Y2guQ29tcGFyaXNvbk9wZXJhdG9yLkxFU1NfVEhBTl9USFJFU0hPTEQsXHJcbiAgICAgICAgICAgIC8vICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcclxuICAgICAgICAgICAgLy8gICAgIHRocmVzaG9sZDogNDUsIC8vIEF1dG9tYXRpYyByb3RhdGlvbiBoYXBwZW5zIGJldHdlZW4gNjAgYW5kIDQ1IGRheXMgYmVmb3JlIGV4cGlyeVxyXG4gICAgICAgICAgICAvLyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19