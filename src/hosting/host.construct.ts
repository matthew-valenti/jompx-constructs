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
