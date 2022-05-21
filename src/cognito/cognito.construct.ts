import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';

export interface ICognitoProps {
    /**
     * Name of the Cognito user pool resource as it appears in the AWS Console.
     */
    name: string;

    /**
     * Optional CDK user pool props to override AWS and Jompx default prop values.
     */
    userPoolProps?: cdk.aws_cognito.UserPoolProps;

    /**
     * List of camelCase app codes. A user pool client will be created for each app.
     */
    appCodes?: string[];

    /**
     * List of Cognito user pool groups to create.
     */
    userPoolGroups?: cdk.aws_cognito.CfnUserPoolGroupProps[];
}

/**
 * AWS AppSync (serverless GraphQL).
 */
export class Cognito extends Construct {
    public userPool: cdk.aws_cognito.UserPool;
    public userPoolClients: cdk.aws_cognito.UserPoolClient[] = [];

    constructor(scope: Construct, id: string, props: ICognitoProps) {
        super(scope, id);

        this.userPool = new cognito.UserPool(this, 'Cognito', {
            userPoolName: props.name,
            // IMPORTANT: Do not delete user pool. All Cognito users will be deleted.
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            // Allow user sign up.
            selfSignUpEnabled: true,
            // Users sign-in with an email address.
            signInAliases: { email: true },
            // Verification code automatically sent to email on sign-up.
            autoVerify: { email: true, phone: false },
            // Best practice is false.
            signInCaseSensitive: false,
            // Recommended Cognito setting.
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            // Warning: A CDK deploy error is thrown when an attempt is made to modify required attributes for a UserPool.
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true
                },
                phoneNumber: {
                    required: false,
                    mutable: true
                }
            },
            // Warning: Cognito advanced security is high cost.
            // Verify when required for security only (not on every user login).
            // mfa: cognito.Mfa.OPTIONAL,
            // mfaSecondFactor: {
            //     sms: true,
            //     otp: false
            // },
            ...props.userPoolProps
        });

        // if (props.userPoolProps.mfa !== cognito.Mfa.OFF) {
        //     // Define Cognito advanced security feature (for all user pool clients). Can be on/off or customized per user pool client.
        //     new cognito.CfnUserPoolRiskConfigurationAttachment(this, 'CognitoAdvancedSecurity', {
        //         userPoolId: this.userPool.userPoolId,
        //         clientId: 'ALL',
        //         accountTakeoverRiskConfiguration: {
        //             actions: {
        //                 // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype.html#cfn-cognito-userpoolriskconfigurationattachment-accounttakeoveractiontype-eventaction
        //                 lowAction: { eventAction: 'NO_ACTION', notify: false },
        //                 mediumAction: { eventAction: 'MFA_REQUIRED', notify: true },
        //                 highAction: { eventAction: 'MFA_REQUIRED', notify: true }
        //             },
        //             notifyConfiguration: {
        //                 // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpoolriskconfigurationattachment-notifyconfigurationtype.html
        //                 sourceArn: emailAddressArn, // SES verified email address. Email address is created in external stack.
        //                 from: emailAddress,
        //                 replyTo: emailAddress
        //             }
        //         },
        //         compromisedCredentialsRiskConfiguration: {
        //             // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/enums/compromisedcredentialseventactiontype.html
        //             actions: {
        //                 eventAction: 'NO_ACTION'
        //             }
        //         }
        //         // Keep for reference. IP whitelist/blacklist may be useful in the future.
        //         // http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolriskconfigurationattachment.html#cfn-cognito-userpoolriskconfigurationattachment-riskexceptionconfiguration
        //         // riskExceptionConfiguration: {
        //         //     blockedIpRangeList: [],
        //         //     skippedIpRangeList: []
        //         // }
        //     });
        // }

        // Create a user pool client for each app.
        // Each app will connect to Cognito using its own user pool client id.
        props.appCodes?.forEach(appCode => {
            const userPoolClient = new cognito.UserPoolClient(this, `${changeCase.pascalCase(appCode)}UserPoolClient`, {
                userPool: this.userPool,
                userPoolClientName: appCode,
                // Recommended Cognito setting.
                preventUserExistenceErrors: true,
                authFlows: {
                    // Required for app Cognito authentication.
                    userPassword: true,
                    // Required for AppSync (login via Cognito user pools).
                    userSrp: true
                }
            });
            this.userPoolClients.push(userPoolClient);
        });
    }
}
