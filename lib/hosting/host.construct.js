"use strict";
// import * as cdk from 'aws-cdk-lib';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as route53 from 'aws-cdk-lib/aws-route53';
// import { Construct } from 'constructs';
// import { Config } from '../config/config';
// export interface IHostingProps {
//     domainName: string;
// }
// /**
//  * AWS AppSync (serverless GraphQL).
//  * TODO: The problem with this approach is the complexity.
//  * Do we have to deploy in a specific order?
//  * Uses cross account roles.
//  * This will run always and add extra CDK deployment time.
//  * Subdomains are unlikely to change for the life of apps.
//  * How do we unit test this? But how would we unit test org-formation either?
//  */
// export class Hosting extends Construct {
//     public publicHostedZone: cdk.aws_route53.PublicHostedZone | undefined;
//     constructor(scope: Construct, id: string, props: IHostingProps) {
//         super(scope, id);
//         // TODO: Use org-formation instead? https://github.com/org-formation/org-formation-cli/blob/master/examples/templates/subdomains.yml
//         // https://theburningmonk.com/2021/05/how-to-manage-route53-hosted-zones-in-a-multi-account-environment/
//         // https://github.com/aws/aws-cdk/issues/6470
//         // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53-readme.html
//         const config = new Config(this.node);
//         const stage = config.stage();
//         const parentAccountId = config.environmentByName('prod')?.accountId; // Param this.
//         if (parentAccountId) {
//             if (stage === 'prod') {
//                 new route53.PublicHostedZone(this, 'HostedZone', {
//                     zoneName: props.domainName,
//                     crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal(parentAccountId),
//                     crossAccountZoneDelegationRoleName: 'JompxDelegationRole' // Props this.
//                 });
//             } else if (stage === 'sandbox1') {
//                 this.publicHostedZone = new route53.PublicHostedZone(this, 'SubZone', {
//                     zoneName: `${stage}.${props.domainName}` // Subdomain e.g. dev.jompx.com
//                 });
//                 // import the delegation role by constructing the roleArn
//                 const delegationRoleArn = cdk.Stack.of(this).formatArn({
//                     region: '', // IAM is global in each partition
//                     service: 'iam',
//                     account: parentAccountId,
//                     resource: 'role',
//                     resourceName: 'JompxDelegationRole' // Props this.
//                 });
//                 const delegationRole = iam.Role.fromRoleArn(this, 'DelegationRole', delegationRoleArn);
//                 // create the record
//                 new route53.CrossAccountZoneDelegationRecord(this, 'delegate', {
//                     delegatedZone: this.publicHostedZone,
//                     parentHostedZoneName: props.domainName, // Or use parentHostedZoneId.
//                     delegationRole
//                 });
//             }
//         }
//     }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaG9zdGluZy9ob3N0LmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDO0FBQ3RDLDhDQUE4QztBQUM5QyxzREFBc0Q7QUFDdEQsMENBQTBDO0FBQzFDLDZDQUE2QztBQUU3QyxtQ0FBbUM7QUFDbkMsMEJBQTBCO0FBQzFCLElBQUk7QUFFSixNQUFNO0FBQ04sdUNBQXVDO0FBQ3ZDLDZEQUE2RDtBQUM3RCwrQ0FBK0M7QUFDL0MsK0JBQStCO0FBQy9CLDZEQUE2RDtBQUM3RCw2REFBNkQ7QUFDN0QsZ0ZBQWdGO0FBQ2hGLE1BQU07QUFDTiwyQ0FBMkM7QUFFM0MsNkVBQTZFO0FBRTdFLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFFNUIsK0lBQStJO0FBQy9JLG1IQUFtSDtBQUNuSCx3REFBd0Q7QUFFeEQsNkZBQTZGO0FBRTdGLGdEQUFnRDtBQUNoRCx3Q0FBd0M7QUFDeEMsOEZBQThGO0FBRTlGLGlDQUFpQztBQUVqQyxzQ0FBc0M7QUFFdEMscUVBQXFFO0FBQ3JFLGtEQUFrRDtBQUNsRCxzR0FBc0c7QUFDdEcsK0ZBQStGO0FBQy9GLHNCQUFzQjtBQUV0QixpREFBaUQ7QUFFakQsMEZBQTBGO0FBQzFGLCtGQUErRjtBQUMvRixzQkFBc0I7QUFFdEIsNEVBQTRFO0FBQzVFLDJFQUEyRTtBQUMzRSxxRUFBcUU7QUFDckUsc0NBQXNDO0FBQ3RDLGdEQUFnRDtBQUNoRCx3Q0FBd0M7QUFDeEMseUVBQXlFO0FBQ3pFLHNCQUFzQjtBQUN0QiwwR0FBMEc7QUFFMUcsdUNBQXVDO0FBQ3ZDLG1GQUFtRjtBQUNuRiw0REFBNEQ7QUFDNUQsNEZBQTRGO0FBQzVGLHFDQUFxQztBQUNyQyxzQkFBc0I7QUFDdEIsZ0JBQWdCO0FBQ2hCLFlBQVk7QUFDWixRQUFRO0FBQ1IsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuLy8gaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1Myc7XHJcbi8vIGltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG4vLyBpbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuXHJcbi8vIGV4cG9ydCBpbnRlcmZhY2UgSUhvc3RpbmdQcm9wcyB7XHJcbi8vICAgICBkb21haW5OYW1lOiBzdHJpbmc7XHJcbi8vIH1cclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBBV1MgQXBwU3luYyAoc2VydmVybGVzcyBHcmFwaFFMKS5cclxuLy8gICogVE9ETzogVGhlIHByb2JsZW0gd2l0aCB0aGlzIGFwcHJvYWNoIGlzIHRoZSBjb21wbGV4aXR5LlxyXG4vLyAgKiBEbyB3ZSBoYXZlIHRvIGRlcGxveSBpbiBhIHNwZWNpZmljIG9yZGVyP1xyXG4vLyAgKiBVc2VzIGNyb3NzIGFjY291bnQgcm9sZXMuXHJcbi8vICAqIFRoaXMgd2lsbCBydW4gYWx3YXlzIGFuZCBhZGQgZXh0cmEgQ0RLIGRlcGxveW1lbnQgdGltZS5cclxuLy8gICogU3ViZG9tYWlucyBhcmUgdW5saWtlbHkgdG8gY2hhbmdlIGZvciB0aGUgbGlmZSBvZiBhcHBzLlxyXG4vLyAgKiBIb3cgZG8gd2UgdW5pdCB0ZXN0IHRoaXM/IEJ1dCBob3cgd291bGQgd2UgdW5pdCB0ZXN0IG9yZy1mb3JtYXRpb24gZWl0aGVyP1xyXG4vLyAgKi9cclxuLy8gZXhwb3J0IGNsYXNzIEhvc3RpbmcgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG5cclxuLy8gICAgIHB1YmxpYyBwdWJsaWNIb3N0ZWRab25lOiBjZGsuYXdzX3JvdXRlNTMuUHVibGljSG9zdGVkWm9uZSB8IHVuZGVmaW5lZDtcclxuXHJcbi8vICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUhvc3RpbmdQcm9wcykge1xyXG4vLyAgICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4vLyAgICAgICAgIC8vIFRPRE86IFVzZSBvcmctZm9ybWF0aW9uIGluc3RlYWQ/IGh0dHBzOi8vZ2l0aHViLmNvbS9vcmctZm9ybWF0aW9uL29yZy1mb3JtYXRpb24tY2xpL2Jsb2IvbWFzdGVyL2V4YW1wbGVzL3RlbXBsYXRlcy9zdWJkb21haW5zLnltbFxyXG4vLyAgICAgICAgIC8vIGh0dHBzOi8vdGhlYnVybmluZ21vbmsuY29tLzIwMjEvMDUvaG93LXRvLW1hbmFnZS1yb3V0ZTUzLWhvc3RlZC16b25lcy1pbi1hLW11bHRpLWFjY291bnQtZW52aXJvbm1lbnQvXHJcbi8vICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy82NDcwXHJcblxyXG4vLyAgICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIuYXdzX3JvdXRlNTMtcmVhZG1lLmh0bWxcclxuXHJcbi8vICAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZyh0aGlzLm5vZGUpO1xyXG4vLyAgICAgICAgIGNvbnN0IHN0YWdlID0gY29uZmlnLnN0YWdlKCk7XHJcbi8vICAgICAgICAgY29uc3QgcGFyZW50QWNjb3VudElkID0gY29uZmlnLmVudmlyb25tZW50QnlOYW1lKCdwcm9kJyk/LmFjY291bnRJZDsgLy8gUGFyYW0gdGhpcy5cclxuXHJcbi8vICAgICAgICAgaWYgKHBhcmVudEFjY291bnRJZCkge1xyXG5cclxuLy8gICAgICAgICAgICAgaWYgKHN0YWdlID09PSAncHJvZCcpIHtcclxuXHJcbi8vICAgICAgICAgICAgICAgICBuZXcgcm91dGU1My5QdWJsaWNIb3N0ZWRab25lKHRoaXMsICdIb3N0ZWRab25lJywge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHpvbmVOYW1lOiBwcm9wcy5kb21haW5OYW1lLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUHJpbmNpcGFsOiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwocGFyZW50QWNjb3VudElkKSxcclxuLy8gICAgICAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJvbGVOYW1lOiAnSm9tcHhEZWxlZ2F0aW9uUm9sZScgLy8gUHJvcHMgdGhpcy5cclxuLy8gICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuLy8gICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFnZSA9PT0gJ3NhbmRib3gxJykge1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIHRoaXMucHVibGljSG9zdGVkWm9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUodGhpcywgJ1N1YlpvbmUnLCB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgem9uZU5hbWU6IGAke3N0YWdlfS4ke3Byb3BzLmRvbWFpbk5hbWV9YCAvLyBTdWJkb21haW4gZS5nLiBkZXYuam9tcHguY29tXHJcbi8vICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAvLyBpbXBvcnQgdGhlIGRlbGVnYXRpb24gcm9sZSBieSBjb25zdHJ1Y3RpbmcgdGhlIHJvbGVBcm5cclxuLy8gICAgICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRpb25Sb2xlQXJuID0gY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiAnJywgLy8gSUFNIGlzIGdsb2JhbCBpbiBlYWNoIHBhcnRpdGlvblxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdpYW0nLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIGFjY291bnQ6IHBhcmVudEFjY291bnRJZCxcclxuLy8gICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogJ3JvbGUnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlTmFtZTogJ0pvbXB4RGVsZWdhdGlvblJvbGUnIC8vIFByb3BzIHRoaXMuXHJcbi8vICAgICAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRpb25Sb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4odGhpcywgJ0RlbGVnYXRpb25Sb2xlJywgZGVsZWdhdGlvblJvbGVBcm4pO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgcmVjb3JkXHJcbi8vICAgICAgICAgICAgICAgICBuZXcgcm91dGU1My5Dcm9zc0FjY291bnRab25lRGVsZWdhdGlvblJlY29yZCh0aGlzLCAnZGVsZWdhdGUnLCB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZGVsZWdhdGVkWm9uZTogdGhpcy5wdWJsaWNIb3N0ZWRab25lLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHBhcmVudEhvc3RlZFpvbmVOYW1lOiBwcm9wcy5kb21haW5OYW1lLCAvLyBPciB1c2UgcGFyZW50SG9zdGVkWm9uZUlkLlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIGRlbGVnYXRpb25Sb2xlXHJcbi8vICAgICAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gfVxyXG4iXX0=