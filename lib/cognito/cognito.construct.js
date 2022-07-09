"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cognito = void 0;
const cdk = require("aws-cdk-lib");
const cognito = require("aws-cdk-lib/aws-cognito");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
/**
 * AWS AppSync (serverless GraphQL).
 */
class Cognito extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        this.userPoolClients = [];
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
        (_a = props.appCodes) === null || _a === void 0 ? void 0 : _a.forEach(appCode => {
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
exports.Cognito = Cognito;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29nbml0by9jb2duaXRvLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsbURBQW1EO0FBQ25ELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsMkNBQXVDO0FBd0J2Qzs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHNCQUFTO0lBSWxDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7O1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIZCxvQkFBZSxHQUFxQyxFQUFFLENBQUM7UUFLMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUNsRCxZQUFZLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDeEIseUVBQXlFO1lBQ3pFLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU07WUFDdkMsc0JBQXNCO1lBQ3RCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsdUNBQXVDO1lBQ3ZDLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDOUIsNERBQTREO1lBQzVELFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUN6QywwQkFBMEI7WUFDMUIsbUJBQW1CLEVBQUUsS0FBSztZQUMxQiwrQkFBK0I7WUFDL0IsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVTtZQUNuRCw4R0FBOEc7WUFDOUcsa0JBQWtCLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRTtvQkFDSCxRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUUsSUFBSTtpQkFDaEI7Z0JBQ0QsV0FBVyxFQUFFO29CQUNULFFBQVEsRUFBRSxLQUFLO29CQUNmLE9BQU8sRUFBRSxJQUFJO2lCQUNoQjthQUNKO1lBQ0QsbURBQW1EO1lBQ25ELG9FQUFvRTtZQUNwRSw2QkFBNkI7WUFDN0IscUJBQXFCO1lBQ3JCLGlCQUFpQjtZQUNqQixpQkFBaUI7WUFDakIsS0FBSztZQUNMLEdBQUcsS0FBSyxDQUFDLGFBQWE7U0FDekIsQ0FBQyxDQUFDO1FBRUgscURBQXFEO1FBQ3JELGlJQUFpSTtRQUNqSSw0RkFBNEY7UUFDNUYsZ0RBQWdEO1FBQ2hELDJCQUEyQjtRQUMzQiw4Q0FBOEM7UUFDOUMseUJBQXlCO1FBQ3pCLG9RQUFvUTtRQUNwUSwwRUFBMEU7UUFDMUUsK0VBQStFO1FBQy9FLDRFQUE0RTtRQUM1RSxpQkFBaUI7UUFDakIscUNBQXFDO1FBQ3JDLDRLQUE0SztRQUM1Syx5SEFBeUg7UUFDekgsc0NBQXNDO1FBQ3RDLHdDQUF3QztRQUN4QyxnQkFBZ0I7UUFDaEIsYUFBYTtRQUNiLHFEQUFxRDtRQUNyRCxrS0FBa0s7UUFDbEsseUJBQXlCO1FBQ3pCLDJDQUEyQztRQUMzQyxnQkFBZ0I7UUFDaEIsWUFBWTtRQUNaLHFGQUFxRjtRQUNyRixvTkFBb047UUFDcE4sMkNBQTJDO1FBQzNDLHlDQUF5QztRQUN6Qyx3Q0FBd0M7UUFDeEMsZUFBZTtRQUNmLFVBQVU7UUFDVixJQUFJO1FBRUosMENBQTBDO1FBQzFDLHNFQUFzRTtRQUN0RSxNQUFBLEtBQUssQ0FBQyxRQUFRLDBDQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM5QixNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3ZHLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsa0JBQWtCLEVBQUUsT0FBTztnQkFDM0IsK0JBQStCO2dCQUMvQiwwQkFBMEIsRUFBRSxJQUFJO2dCQUNoQyxTQUFTLEVBQUU7b0JBQ1AsMkNBQTJDO29CQUMzQyxZQUFZLEVBQUUsSUFBSTtvQkFDbEIsdURBQXVEO29CQUN2RCxPQUFPLEVBQUUsSUFBSTtpQkFDaEI7YUFDSixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5QyxDQUFDLEVBQUU7SUFDUCxDQUFDO0NBQ0o7QUE5RkQsMEJBOEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0byc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ29nbml0b1Byb3BzIHtcclxuICAgIC8qKlxyXG4gICAgICogTmFtZSBvZiB0aGUgQ29nbml0byB1c2VyIHBvb2wgcmVzb3VyY2UgYXMgaXQgYXBwZWFycyBpbiB0aGUgQVdTIENvbnNvbGUuXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIE9wdGlvbmFsIENESyB1c2VyIHBvb2wgcHJvcHMgdG8gb3ZlcnJpZGUgQVdTIGFuZCBKb21weCBkZWZhdWx0IHByb3AgdmFsdWVzLlxyXG4gICAgICovXHJcbiAgICB1c2VyUG9vbFByb3BzPzogY2RrLmF3c19jb2duaXRvLlVzZXJQb29sUHJvcHM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0IG9mIGNhbWVsQ2FzZSBhcHAgY29kZXMuIEEgdXNlciBwb29sIGNsaWVudCB3aWxsIGJlIGNyZWF0ZWQgZm9yIGVhY2ggYXBwLlxyXG4gICAgICovXHJcbiAgICBhcHBDb2Rlcz86IHN0cmluZ1tdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdCBvZiBDb2duaXRvIHVzZXIgcG9vbCBncm91cHMgdG8gY3JlYXRlLlxyXG4gICAgICovXHJcbiAgICB1c2VyUG9vbEdyb3Vwcz86IGNkay5hd3NfY29nbml0by5DZm5Vc2VyUG9vbEdyb3VwUHJvcHNbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFXUyBBcHBTeW5jIChzZXJ2ZXJsZXNzIEdyYXBoUUwpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvZ25pdG8gZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIHVzZXJQb29sOiBjZGsuYXdzX2NvZ25pdG8uVXNlclBvb2w7XHJcbiAgICBwdWJsaWMgdXNlclBvb2xDbGllbnRzOiBjZGsuYXdzX2NvZ25pdG8uVXNlclBvb2xDbGllbnRbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQ29nbml0b1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgdGhpcy51c2VyUG9vbCA9IG5ldyBjb2duaXRvLlVzZXJQb29sKHRoaXMsICdDb2duaXRvJywge1xyXG4gICAgICAgICAgICB1c2VyUG9vbE5hbWU6IHByb3BzLm5hbWUsXHJcbiAgICAgICAgICAgIC8vIElNUE9SVEFOVDogRG8gbm90IGRlbGV0ZSB1c2VyIHBvb2wuIEFsbCBDb2duaXRvIHVzZXJzIHdpbGwgYmUgZGVsZXRlZC5cclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuUkVUQUlOLFxyXG4gICAgICAgICAgICAvLyBBbGxvdyB1c2VyIHNpZ24gdXAuXHJcbiAgICAgICAgICAgIHNlbGZTaWduVXBFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBVc2VycyBzaWduLWluIHdpdGggYW4gZW1haWwgYWRkcmVzcy5cclxuICAgICAgICAgICAgc2lnbkluQWxpYXNlczogeyBlbWFpbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gY29kZSBhdXRvbWF0aWNhbGx5IHNlbnQgdG8gZW1haWwgb24gc2lnbi11cC5cclxuICAgICAgICAgICAgYXV0b1ZlcmlmeTogeyBlbWFpbDogdHJ1ZSwgcGhvbmU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIC8vIEJlc3QgcHJhY3RpY2UgaXMgZmFsc2UuXHJcbiAgICAgICAgICAgIHNpZ25JbkNhc2VTZW5zaXRpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyBSZWNvbW1lbmRlZCBDb2duaXRvIHNldHRpbmcuXHJcbiAgICAgICAgICAgIGFjY291bnRSZWNvdmVyeTogY29nbml0by5BY2NvdW50UmVjb3ZlcnkuRU1BSUxfT05MWSxcclxuICAgICAgICAgICAgLy8gV2FybmluZzogQSBDREsgZGVwbG95IGVycm9yIGlzIHRocm93biB3aGVuIGFuIGF0dGVtcHQgaXMgbWFkZSB0byBtb2RpZnkgcmVxdWlyZWQgYXR0cmlidXRlcyBmb3IgYSBVc2VyUG9vbC5cclxuICAgICAgICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG11dGFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwaG9uZU51bWJlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBtdXRhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFdhcm5pbmc6IENvZ25pdG8gYWR2YW5jZWQgc2VjdXJpdHkgaXMgaGlnaCBjb3N0LlxyXG4gICAgICAgICAgICAvLyBWZXJpZnkgd2hlbiByZXF1aXJlZCBmb3Igc2VjdXJpdHkgb25seSAobm90IG9uIGV2ZXJ5IHVzZXIgbG9naW4pLlxyXG4gICAgICAgICAgICAvLyBtZmE6IGNvZ25pdG8uTWZhLk9QVElPTkFMLFxyXG4gICAgICAgICAgICAvLyBtZmFTZWNvbmRGYWN0b3I6IHtcclxuICAgICAgICAgICAgLy8gICAgIHNtczogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gICAgIG90cDogZmFsc2VcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgLi4ucHJvcHMudXNlclBvb2xQcm9wc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBpZiAocHJvcHMudXNlclBvb2xQcm9wcy5tZmEgIT09IGNvZ25pdG8uTWZhLk9GRikge1xyXG4gICAgICAgIC8vICAgICAvLyBEZWZpbmUgQ29nbml0byBhZHZhbmNlZCBzZWN1cml0eSBmZWF0dXJlIChmb3IgYWxsIHVzZXIgcG9vbCBjbGllbnRzKS4gQ2FuIGJlIG9uL29mZiBvciBjdXN0b21pemVkIHBlciB1c2VyIHBvb2wgY2xpZW50LlxyXG4gICAgICAgIC8vICAgICBuZXcgY29nbml0by5DZm5Vc2VyUG9vbFJpc2tDb25maWd1cmF0aW9uQXR0YWNobWVudCh0aGlzLCAnQ29nbml0b0FkdmFuY2VkU2VjdXJpdHknLCB7XHJcbiAgICAgICAgLy8gICAgICAgICB1c2VyUG9vbElkOiB0aGlzLnVzZXJQb29sLnVzZXJQb29sSWQsXHJcbiAgICAgICAgLy8gICAgICAgICBjbGllbnRJZDogJ0FMTCcsXHJcbiAgICAgICAgLy8gICAgICAgICBhY2NvdW50VGFrZW92ZXJSaXNrQ29uZmlndXJhdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY29nbml0by11c2VycG9vbHJpc2tjb25maWd1cmF0aW9uYXR0YWNobWVudC1hY2NvdW50dGFrZW92ZXJhY3Rpb250eXBlLmh0bWwjY2ZuLWNvZ25pdG8tdXNlcnBvb2xyaXNrY29uZmlndXJhdGlvbmF0dGFjaG1lbnQtYWNjb3VudHRha2VvdmVyYWN0aW9udHlwZS1ldmVudGFjdGlvblxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBsb3dBY3Rpb246IHsgZXZlbnRBY3Rpb246ICdOT19BQ1RJT04nLCBub3RpZnk6IGZhbHNlIH0sXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIG1lZGl1bUFjdGlvbjogeyBldmVudEFjdGlvbjogJ01GQV9SRVFVSVJFRCcsIG5vdGlmeTogdHJ1ZSB9LFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBoaWdoQWN0aW9uOiB7IGV2ZW50QWN0aW9uOiAnTUZBX1JFUVVJUkVEJywgbm90aWZ5OiB0cnVlIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICB9LFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIG5vdGlmeUNvbmZpZ3VyYXRpb246IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY29nbml0by11c2VycG9vbHJpc2tjb25maWd1cmF0aW9uYXR0YWNobWVudC1ub3RpZnljb25maWd1cmF0aW9udHlwZS5odG1sXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNvdXJjZUFybjogZW1haWxBZGRyZXNzQXJuLCAvLyBTRVMgdmVyaWZpZWQgZW1haWwgYWRkcmVzcy4gRW1haWwgYWRkcmVzcyBpcyBjcmVhdGVkIGluIGV4dGVybmFsIHN0YWNrLlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBmcm9tOiBlbWFpbEFkZHJlc3MsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJlcGx5VG86IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH0sXHJcbiAgICAgICAgLy8gICAgICAgICBjb21wcm9taXNlZENyZWRlbnRpYWxzUmlza0NvbmZpZ3VyYXRpb246IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTSmF2YVNjcmlwdFNESy92My9sYXRlc3QvY2xpZW50cy9jbGllbnQtY29nbml0by1pZGVudGl0eS1wcm92aWRlci9lbnVtcy9jb21wcm9taXNlZGNyZWRlbnRpYWxzZXZlbnRhY3Rpb250eXBlLmh0bWxcclxuICAgICAgICAvLyAgICAgICAgICAgICBhY3Rpb25zOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnTk9fQUNUSU9OJ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIC8vIEtlZXAgZm9yIHJlZmVyZW5jZS4gSVAgd2hpdGVsaXN0L2JsYWNrbGlzdCBtYXkgYmUgdXNlZnVsIGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgLy8gICAgICAgICAvLyBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jb2duaXRvLXVzZXJwb29scmlza2NvbmZpZ3VyYXRpb25hdHRhY2htZW50Lmh0bWwjY2ZuLWNvZ25pdG8tdXNlcnBvb2xyaXNrY29uZmlndXJhdGlvbmF0dGFjaG1lbnQtcmlza2V4Y2VwdGlvbmNvbmZpZ3VyYXRpb25cclxuICAgICAgICAvLyAgICAgICAgIC8vIHJpc2tFeGNlcHRpb25Db25maWd1cmF0aW9uOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyAgICAgYmxvY2tlZElwUmFuZ2VMaXN0OiBbXSxcclxuICAgICAgICAvLyAgICAgICAgIC8vICAgICBza2lwcGVkSXBSYW5nZUxpc3Q6IFtdXHJcbiAgICAgICAgLy8gICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgdXNlciBwb29sIGNsaWVudCBmb3IgZWFjaCBhcHAuXHJcbiAgICAgICAgLy8gRWFjaCBhcHAgd2lsbCBjb25uZWN0IHRvIENvZ25pdG8gdXNpbmcgaXRzIG93biB1c2VyIHBvb2wgY2xpZW50IGlkLlxyXG4gICAgICAgIHByb3BzLmFwcENvZGVzPy5mb3JFYWNoKGFwcENvZGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyUG9vbENsaWVudCA9IG5ldyBjb2duaXRvLlVzZXJQb29sQ2xpZW50KHRoaXMsIGAke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShhcHBDb2RlKX1Vc2VyUG9vbENsaWVudGAsIHtcclxuICAgICAgICAgICAgICAgIHVzZXJQb29sOiB0aGlzLnVzZXJQb29sLFxyXG4gICAgICAgICAgICAgICAgdXNlclBvb2xDbGllbnROYW1lOiBhcHBDb2RlLFxyXG4gICAgICAgICAgICAgICAgLy8gUmVjb21tZW5kZWQgQ29nbml0byBzZXR0aW5nLlxyXG4gICAgICAgICAgICAgICAgcHJldmVudFVzZXJFeGlzdGVuY2VFcnJvcnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhdXRoRmxvd3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBSZXF1aXJlZCBmb3IgYXBwIENvZ25pdG8gYXV0aGVudGljYXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlclBhc3N3b3JkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcXVpcmVkIGZvciBBcHBTeW5jIChsb2dpbiB2aWEgQ29nbml0byB1c2VyIHBvb2xzKS5cclxuICAgICAgICAgICAgICAgICAgICB1c2VyU3JwOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJQb29sQ2xpZW50cy5wdXNoKHVzZXJQb29sQ2xpZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=