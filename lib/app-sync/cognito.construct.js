"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cognito = void 0;
const cdk = require("aws-cdk-lib");
const cognito = require("aws-cdk-lib/aws-cognito");
const constructs_1 = require("constructs");
/**
 * AWS AppSync (serverless GraphQL).
 */
class Cognito extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.userPool = new cognito.UserPool(this, 'Cognito', {
            userPoolName: 'apps',
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
            // Verify when required for security only (not on every user login).
            mfa: cognito.Mfa.OPTIONAL,
            mfaSecondFactor: {
                sms: true,
                otp: false
            },
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
    }
}
exports.Cognito = Cognito;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvY29nbml0by5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQUNuRCwyQ0FBdUM7QUFNdkM7O0dBRUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxzQkFBUztJQUdsQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUNsRCxZQUFZLEVBQUUsTUFBTTtZQUNwQix5RUFBeUU7WUFDekUsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTtZQUN2QyxzQkFBc0I7WUFDdEIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2Qix1Q0FBdUM7WUFDdkMsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUM5Qiw0REFBNEQ7WUFDNUQsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQ3pDLDBCQUEwQjtZQUMxQixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLCtCQUErQjtZQUMvQixlQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxVQUFVO1lBQ25ELG9FQUFvRTtZQUNwRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRO1lBQ3pCLGVBQWUsRUFBRTtnQkFDYixHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsS0FBSzthQUNiO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRTtvQkFDSCxRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUUsSUFBSTtpQkFDaEI7Z0JBQ0QsV0FBVyxFQUFFO29CQUNULFFBQVEsRUFBRSxLQUFLO29CQUNmLE9BQU8sRUFBRSxJQUFJO2lCQUNoQjthQUNKO1lBQ0QsR0FBRyxLQUFLLENBQUMsYUFBYTtTQUN6QixDQUFDLENBQUM7UUFFSCxxREFBcUQ7UUFDckQsaUlBQWlJO1FBQ2pJLDRGQUE0RjtRQUM1RixnREFBZ0Q7UUFDaEQsMkJBQTJCO1FBQzNCLDhDQUE4QztRQUM5Qyx5QkFBeUI7UUFDekIsb1FBQW9RO1FBQ3BRLDBFQUEwRTtRQUMxRSwrRUFBK0U7UUFDL0UsNEVBQTRFO1FBQzVFLGlCQUFpQjtRQUNqQixxQ0FBcUM7UUFDckMsNEtBQTRLO1FBQzVLLHlIQUF5SDtRQUN6SCxzQ0FBc0M7UUFDdEMsd0NBQXdDO1FBQ3hDLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IscURBQXFEO1FBQ3JELGtLQUFrSztRQUNsSyx5QkFBeUI7UUFDekIsMkNBQTJDO1FBQzNDLGdCQUFnQjtRQUNoQixZQUFZO1FBQ1oscUZBQXFGO1FBQ3JGLG9OQUFvTjtRQUNwTiwyQ0FBMkM7UUFDM0MseUNBQXlDO1FBQ3pDLHdDQUF3QztRQUN4QyxlQUFlO1FBQ2YsVUFBVTtRQUNWLElBQUk7SUFDUixDQUFDO0NBQ0o7QUF6RUQsMEJBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0byc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ29nbml0b1Byb3BzIHtcclxuICAgIHVzZXJQb29sUHJvcHM6IGNkay5hd3NfY29nbml0by5Vc2VyUG9vbFByb3BzO1xyXG59XHJcblxyXG4vKipcclxuICogQVdTIEFwcFN5bmMgKHNlcnZlcmxlc3MgR3JhcGhRTCkuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29nbml0byBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgdXNlclBvb2w6IGNkay5hd3NfY29nbml0by5Vc2VyUG9vbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUNvZ25pdG9Qcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMudXNlclBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbCh0aGlzLCAnQ29nbml0bycsIHtcclxuICAgICAgICAgICAgdXNlclBvb2xOYW1lOiAnYXBwcycsXHJcbiAgICAgICAgICAgIC8vIElNUE9SVEFOVDogRG8gbm90IGRlbGV0ZSB1c2VyIHBvb2wuIEFsbCBDb2duaXRvIHVzZXJzIHdpbGwgYmUgZGVsZXRlZC5cclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuUkVUQUlOLFxyXG4gICAgICAgICAgICAvLyBBbGxvdyB1c2VyIHNpZ24gdXAuXHJcbiAgICAgICAgICAgIHNlbGZTaWduVXBFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBVc2VycyBzaWduLWluIHdpdGggYW4gZW1haWwgYWRkcmVzcy5cclxuICAgICAgICAgICAgc2lnbkluQWxpYXNlczogeyBlbWFpbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gY29kZSBhdXRvbWF0aWNhbGx5IHNlbnQgdG8gZW1haWwgb24gc2lnbi11cC5cclxuICAgICAgICAgICAgYXV0b1ZlcmlmeTogeyBlbWFpbDogdHJ1ZSwgcGhvbmU6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIC8vIEJlc3QgcHJhY3RpY2UgaXMgZmFsc2UuXHJcbiAgICAgICAgICAgIHNpZ25JbkNhc2VTZW5zaXRpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyBSZWNvbW1lbmRlZCBDb2duaXRvIHNldHRpbmcuXHJcbiAgICAgICAgICAgIGFjY291bnRSZWNvdmVyeTogY29nbml0by5BY2NvdW50UmVjb3ZlcnkuRU1BSUxfT05MWSxcclxuICAgICAgICAgICAgLy8gVmVyaWZ5IHdoZW4gcmVxdWlyZWQgZm9yIHNlY3VyaXR5IG9ubHkgKG5vdCBvbiBldmVyeSB1c2VyIGxvZ2luKS5cclxuICAgICAgICAgICAgbWZhOiBjb2duaXRvLk1mYS5PUFRJT05BTCxcclxuICAgICAgICAgICAgbWZhU2Vjb25kRmFjdG9yOiB7XHJcbiAgICAgICAgICAgICAgICBzbXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvdHA6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YW5kYXJkQXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtdXRhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsIC8vIE1ha2UgcmVxdWlyZWQgaWYgZW5hYmxpbmcgTUZBLlxyXG4gICAgICAgICAgICAgICAgICAgIG11dGFibGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLi4ucHJvcHMudXNlclBvb2xQcm9wc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBpZiAocHJvcHMudXNlclBvb2xQcm9wcy5tZmEgIT09IGNvZ25pdG8uTWZhLk9GRikge1xyXG4gICAgICAgIC8vICAgICAvLyBEZWZpbmUgQ29nbml0byBhZHZhbmNlZCBzZWN1cml0eSBmZWF0dXJlIChmb3IgYWxsIHVzZXIgcG9vbCBjbGllbnRzKS4gQ2FuIGJlIG9uL29mZiBvciBjdXN0b21pemVkIHBlciB1c2VyIHBvb2wgY2xpZW50LlxyXG4gICAgICAgIC8vICAgICBuZXcgY29nbml0by5DZm5Vc2VyUG9vbFJpc2tDb25maWd1cmF0aW9uQXR0YWNobWVudCh0aGlzLCAnQ29nbml0b0FkdmFuY2VkU2VjdXJpdHknLCB7XHJcbiAgICAgICAgLy8gICAgICAgICB1c2VyUG9vbElkOiB0aGlzLnVzZXJQb29sLnVzZXJQb29sSWQsXHJcbiAgICAgICAgLy8gICAgICAgICBjbGllbnRJZDogJ0FMTCcsXHJcbiAgICAgICAgLy8gICAgICAgICBhY2NvdW50VGFrZW92ZXJSaXNrQ29uZmlndXJhdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGFjdGlvbnM6IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY29nbml0by11c2VycG9vbHJpc2tjb25maWd1cmF0aW9uYXR0YWNobWVudC1hY2NvdW50dGFrZW92ZXJhY3Rpb250eXBlLmh0bWwjY2ZuLWNvZ25pdG8tdXNlcnBvb2xyaXNrY29uZmlndXJhdGlvbmF0dGFjaG1lbnQtYWNjb3VudHRha2VvdmVyYWN0aW9udHlwZS1ldmVudGFjdGlvblxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBsb3dBY3Rpb246IHsgZXZlbnRBY3Rpb246ICdOT19BQ1RJT04nLCBub3RpZnk6IGZhbHNlIH0sXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIG1lZGl1bUFjdGlvbjogeyBldmVudEFjdGlvbjogJ01GQV9SRVFVSVJFRCcsIG5vdGlmeTogdHJ1ZSB9LFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBoaWdoQWN0aW9uOiB7IGV2ZW50QWN0aW9uOiAnTUZBX1JFUVVJUkVEJywgbm90aWZ5OiB0cnVlIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICB9LFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIG5vdGlmeUNvbmZpZ3VyYXRpb246IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY29nbml0by11c2VycG9vbHJpc2tjb25maWd1cmF0aW9uYXR0YWNobWVudC1ub3RpZnljb25maWd1cmF0aW9udHlwZS5odG1sXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNvdXJjZUFybjogZW1haWxBZGRyZXNzQXJuLCAvLyBTRVMgdmVyaWZpZWQgZW1haWwgYWRkcmVzcy4gRW1haWwgYWRkcmVzcyBpcyBjcmVhdGVkIGluIGV4dGVybmFsIHN0YWNrLlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBmcm9tOiBlbWFpbEFkZHJlc3MsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJlcGx5VG86IGVtYWlsQWRkcmVzc1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH0sXHJcbiAgICAgICAgLy8gICAgICAgICBjb21wcm9taXNlZENyZWRlbnRpYWxzUmlza0NvbmZpZ3VyYXRpb246IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTSmF2YVNjcmlwdFNESy92My9sYXRlc3QvY2xpZW50cy9jbGllbnQtY29nbml0by1pZGVudGl0eS1wcm92aWRlci9lbnVtcy9jb21wcm9taXNlZGNyZWRlbnRpYWxzZXZlbnRhY3Rpb250eXBlLmh0bWxcclxuICAgICAgICAvLyAgICAgICAgICAgICBhY3Rpb25zOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnTk9fQUNUSU9OJ1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgIC8vIEtlZXAgZm9yIHJlZmVyZW5jZS4gSVAgd2hpdGVsaXN0L2JsYWNrbGlzdCBtYXkgYmUgdXNlZnVsIGluIHRoZSBmdXR1cmUuXHJcbiAgICAgICAgLy8gICAgICAgICAvLyBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1jb2duaXRvLXVzZXJwb29scmlza2NvbmZpZ3VyYXRpb25hdHRhY2htZW50Lmh0bWwjY2ZuLWNvZ25pdG8tdXNlcnBvb2xyaXNrY29uZmlndXJhdGlvbmF0dGFjaG1lbnQtcmlza2V4Y2VwdGlvbmNvbmZpZ3VyYXRpb25cclxuICAgICAgICAvLyAgICAgICAgIC8vIHJpc2tFeGNlcHRpb25Db25maWd1cmF0aW9uOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyAgICAgYmxvY2tlZElwUmFuZ2VMaXN0OiBbXSxcclxuICAgICAgICAvLyAgICAgICAgIC8vICAgICBza2lwcGVkSXBSYW5nZUxpc3Q6IFtdXHJcbiAgICAgICAgLy8gICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxufVxyXG4iXX0=