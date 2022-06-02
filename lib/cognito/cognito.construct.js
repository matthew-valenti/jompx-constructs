"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cognito = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
        var _b;
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
        (_b = props.appCodes) === null || _b === void 0 ? void 0 : _b.forEach(appCode => {
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
_a = JSII_RTTI_SYMBOL_1;
Cognito[_a] = { fqn: "@jompx/constructs.Cognito", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29nbml0by9jb2duaXRvLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUFtQztBQUNuQyxtREFBbUQ7QUFDbkQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUF3QnZDOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsc0JBQVM7SUFJbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFvQjs7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUhkLG9CQUFlLEdBQXFDLEVBQUUsQ0FBQztRQUsxRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ2xELFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUN4Qix5RUFBeUU7WUFDekUsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTTtZQUN2QyxzQkFBc0I7WUFDdEIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2Qix1Q0FBdUM7WUFDdkMsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtZQUM5Qiw0REFBNEQ7WUFDNUQsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQ3pDLDBCQUEwQjtZQUMxQixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLCtCQUErQjtZQUMvQixlQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxVQUFVO1lBQ25ELDhHQUE4RztZQUM5RyxrQkFBa0IsRUFBRTtnQkFDaEIsS0FBSyxFQUFFO29CQUNILFFBQVEsRUFBRSxJQUFJO29CQUNkLE9BQU8sRUFBRSxJQUFJO2lCQUNoQjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1QsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsT0FBTyxFQUFFLElBQUk7aUJBQ2hCO2FBQ0o7WUFDRCxtREFBbUQ7WUFDbkQsb0VBQW9FO1lBQ3BFLDZCQUE2QjtZQUM3QixxQkFBcUI7WUFDckIsaUJBQWlCO1lBQ2pCLGlCQUFpQjtZQUNqQixLQUFLO1lBQ0wsR0FBRyxLQUFLLENBQUMsYUFBYTtTQUN6QixDQUFDLENBQUM7UUFFSCxxREFBcUQ7UUFDckQsaUlBQWlJO1FBQ2pJLDRGQUE0RjtRQUM1RixnREFBZ0Q7UUFDaEQsMkJBQTJCO1FBQzNCLDhDQUE4QztRQUM5Qyx5QkFBeUI7UUFDekIsb1FBQW9RO1FBQ3BRLDBFQUEwRTtRQUMxRSwrRUFBK0U7UUFDL0UsNEVBQTRFO1FBQzVFLGlCQUFpQjtRQUNqQixxQ0FBcUM7UUFDckMsNEtBQTRLO1FBQzVLLHlIQUF5SDtRQUN6SCxzQ0FBc0M7UUFDdEMsd0NBQXdDO1FBQ3hDLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IscURBQXFEO1FBQ3JELGtLQUFrSztRQUNsSyx5QkFBeUI7UUFDekIsMkNBQTJDO1FBQzNDLGdCQUFnQjtRQUNoQixZQUFZO1FBQ1oscUZBQXFGO1FBQ3JGLG9OQUFvTjtRQUNwTiwyQ0FBMkM7UUFDM0MseUNBQXlDO1FBQ3pDLHdDQUF3QztRQUN4QyxlQUFlO1FBQ2YsVUFBVTtRQUNWLElBQUk7UUFFSiwwQ0FBMEM7UUFDMUMsc0VBQXNFO1FBQ3RFLE1BQUEsS0FBSyxDQUFDLFFBQVEsMENBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzlCLE1BQU0sY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDdkcsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixrQkFBa0IsRUFBRSxPQUFPO2dCQUMzQiwrQkFBK0I7Z0JBQy9CLDBCQUEwQixFQUFFLElBQUk7Z0JBQ2hDLFNBQVMsRUFBRTtvQkFDUCwyQ0FBMkM7b0JBQzNDLFlBQVksRUFBRSxJQUFJO29CQUNsQix1REFBdUQ7b0JBQ3ZELE9BQU8sRUFBRSxJQUFJO2lCQUNoQjthQUNKLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsRUFBRTtJQUNQLENBQUM7O0FBN0ZMLDBCQThGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZ25pdG8nO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvZ25pdG9Qcm9wcyB7XHJcbiAgICAvKipcclxuICAgICAqIE5hbWUgb2YgdGhlIENvZ25pdG8gdXNlciBwb29sIHJlc291cmNlIGFzIGl0IGFwcGVhcnMgaW4gdGhlIEFXUyBDb25zb2xlLlxyXG4gICAgICovXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcHRpb25hbCBDREsgdXNlciBwb29sIHByb3BzIHRvIG92ZXJyaWRlIEFXUyBhbmQgSm9tcHggZGVmYXVsdCBwcm9wIHZhbHVlcy5cclxuICAgICAqL1xyXG4gICAgdXNlclBvb2xQcm9wcz86IGNkay5hd3NfY29nbml0by5Vc2VyUG9vbFByb3BzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdCBvZiBjYW1lbENhc2UgYXBwIGNvZGVzLiBBIHVzZXIgcG9vbCBjbGllbnQgd2lsbCBiZSBjcmVhdGVkIGZvciBlYWNoIGFwcC5cclxuICAgICAqL1xyXG4gICAgYXBwQ29kZXM/OiBzdHJpbmdbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIExpc3Qgb2YgQ29nbml0byB1c2VyIHBvb2wgZ3JvdXBzIHRvIGNyZWF0ZS5cclxuICAgICAqL1xyXG4gICAgdXNlclBvb2xHcm91cHM/OiBjZGsuYXdzX2NvZ25pdG8uQ2ZuVXNlclBvb2xHcm91cFByb3BzW107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBV1MgQXBwU3luYyAoc2VydmVybGVzcyBHcmFwaFFMKS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb2duaXRvIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyB1c2VyUG9vbDogY2RrLmF3c19jb2duaXRvLlVzZXJQb29sO1xyXG4gICAgcHVibGljIHVzZXJQb29sQ2xpZW50czogY2RrLmF3c19jb2duaXRvLlVzZXJQb29sQ2xpZW50W10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUNvZ25pdG9Qcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMudXNlclBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbCh0aGlzLCAnQ29nbml0bycsIHtcclxuICAgICAgICAgICAgdXNlclBvb2xOYW1lOiBwcm9wcy5uYW1lLFxyXG4gICAgICAgICAgICAvLyBJTVBPUlRBTlQ6IERvIG5vdCBkZWxldGUgdXNlciBwb29sLiBBbGwgQ29nbml0byB1c2VycyB3aWxsIGJlIGRlbGV0ZWQuXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTixcclxuICAgICAgICAgICAgLy8gQWxsb3cgdXNlciBzaWduIHVwLlxyXG4gICAgICAgICAgICBzZWxmU2lnblVwRW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gVXNlcnMgc2lnbi1pbiB3aXRoIGFuIGVtYWlsIGFkZHJlc3MuXHJcbiAgICAgICAgICAgIHNpZ25JbkFsaWFzZXM6IHsgZW1haWw6IHRydWUgfSxcclxuICAgICAgICAgICAgLy8gVmVyaWZpY2F0aW9uIGNvZGUgYXV0b21hdGljYWxseSBzZW50IHRvIGVtYWlsIG9uIHNpZ24tdXAuXHJcbiAgICAgICAgICAgIGF1dG9WZXJpZnk6IHsgZW1haWw6IHRydWUsIHBob25lOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAvLyBCZXN0IHByYWN0aWNlIGlzIGZhbHNlLlxyXG4gICAgICAgICAgICBzaWduSW5DYXNlU2Vuc2l0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgLy8gUmVjb21tZW5kZWQgQ29nbml0byBzZXR0aW5nLlxyXG4gICAgICAgICAgICBhY2NvdW50UmVjb3Zlcnk6IGNvZ25pdG8uQWNjb3VudFJlY292ZXJ5LkVNQUlMX09OTFksXHJcbiAgICAgICAgICAgIC8vIFdhcm5pbmc6IEEgQ0RLIGRlcGxveSBlcnJvciBpcyB0aHJvd24gd2hlbiBhbiBhdHRlbXB0IGlzIG1hZGUgdG8gbW9kaWZ5IHJlcXVpcmVkIGF0dHJpYnV0ZXMgZm9yIGEgVXNlclBvb2wuXHJcbiAgICAgICAgICAgIHN0YW5kYXJkQXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtdXRhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbXV0YWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBXYXJuaW5nOiBDb2duaXRvIGFkdmFuY2VkIHNlY3VyaXR5IGlzIGhpZ2ggY29zdC5cclxuICAgICAgICAgICAgLy8gVmVyaWZ5IHdoZW4gcmVxdWlyZWQgZm9yIHNlY3VyaXR5IG9ubHkgKG5vdCBvbiBldmVyeSB1c2VyIGxvZ2luKS5cclxuICAgICAgICAgICAgLy8gbWZhOiBjb2duaXRvLk1mYS5PUFRJT05BTCxcclxuICAgICAgICAgICAgLy8gbWZhU2Vjb25kRmFjdG9yOiB7XHJcbiAgICAgICAgICAgIC8vICAgICBzbXM6IHRydWUsXHJcbiAgICAgICAgICAgIC8vICAgICBvdHA6IGZhbHNlXHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgIC4uLnByb3BzLnVzZXJQb29sUHJvcHNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaWYgKHByb3BzLnVzZXJQb29sUHJvcHMubWZhICE9PSBjb2duaXRvLk1mYS5PRkYpIHtcclxuICAgICAgICAvLyAgICAgLy8gRGVmaW5lIENvZ25pdG8gYWR2YW5jZWQgc2VjdXJpdHkgZmVhdHVyZSAoZm9yIGFsbCB1c2VyIHBvb2wgY2xpZW50cykuIENhbiBiZSBvbi9vZmYgb3IgY3VzdG9taXplZCBwZXIgdXNlciBwb29sIGNsaWVudC5cclxuICAgICAgICAvLyAgICAgbmV3IGNvZ25pdG8uQ2ZuVXNlclBvb2xSaXNrQ29uZmlndXJhdGlvbkF0dGFjaG1lbnQodGhpcywgJ0NvZ25pdG9BZHZhbmNlZFNlY3VyaXR5Jywge1xyXG4gICAgICAgIC8vICAgICAgICAgdXNlclBvb2xJZDogdGhpcy51c2VyUG9vbC51c2VyUG9vbElkLFxyXG4gICAgICAgIC8vICAgICAgICAgY2xpZW50SWQ6ICdBTEwnLFxyXG4gICAgICAgIC8vICAgICAgICAgYWNjb3VudFRha2VvdmVyUmlza0NvbmZpZ3VyYXRpb246IHtcclxuICAgICAgICAvLyAgICAgICAgICAgICBhY3Rpb25zOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvZ25pdG8tdXNlcnBvb2xyaXNrY29uZmlndXJhdGlvbmF0dGFjaG1lbnQtYWNjb3VudHRha2VvdmVyYWN0aW9udHlwZS5odG1sI2Nmbi1jb2duaXRvLXVzZXJwb29scmlza2NvbmZpZ3VyYXRpb25hdHRhY2htZW50LWFjY291bnR0YWtlb3ZlcmFjdGlvbnR5cGUtZXZlbnRhY3Rpb25cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbG93QWN0aW9uOiB7IGV2ZW50QWN0aW9uOiAnTk9fQUNUSU9OJywgbm90aWZ5OiBmYWxzZSB9LFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBtZWRpdW1BY3Rpb246IHsgZXZlbnRBY3Rpb246ICdNRkFfUkVRVUlSRUQnLCBub3RpZnk6IHRydWUgfSxcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgaGlnaEFjdGlvbjogeyBldmVudEFjdGlvbjogJ01GQV9SRVFVSVJFRCcsIG5vdGlmeTogdHJ1ZSB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgfSxcclxuICAgICAgICAvLyAgICAgICAgICAgICBub3RpZnlDb25maWd1cmF0aW9uOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWNvZ25pdG8tdXNlcnBvb2xyaXNrY29uZmlndXJhdGlvbmF0dGFjaG1lbnQtbm90aWZ5Y29uZmlndXJhdGlvbnR5cGUuaHRtbFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzb3VyY2VBcm46IGVtYWlsQWRkcmVzc0FybiwgLy8gU0VTIHZlcmlmaWVkIGVtYWlsIGFkZHJlc3MuIEVtYWlsIGFkZHJlc3MgaXMgY3JlYXRlZCBpbiBleHRlcm5hbCBzdGFjay5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZnJvbTogZW1haWxBZGRyZXNzLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICByZXBseVRvOiBlbWFpbEFkZHJlc3NcclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICB9LFxyXG4gICAgICAgIC8vICAgICAgICAgY29tcHJvbWlzZWRDcmVkZW50aWFsc1Jpc2tDb25maWd1cmF0aW9uOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvdjMvbGF0ZXN0L2NsaWVudHMvY2xpZW50LWNvZ25pdG8taWRlbnRpdHktcHJvdmlkZXIvZW51bXMvY29tcHJvbWlzZWRjcmVkZW50aWFsc2V2ZW50YWN0aW9udHlwZS5odG1sXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgYWN0aW9uczoge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBldmVudEFjdGlvbjogJ05PX0FDVElPTidcclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAvLyBLZWVwIGZvciByZWZlcmVuY2UuIElQIHdoaXRlbGlzdC9ibGFja2xpc3QgbWF5IGJlIHVzZWZ1bCBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgIC8vICAgICAgICAgLy8gaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29nbml0by11c2VycG9vbHJpc2tjb25maWd1cmF0aW9uYXR0YWNobWVudC5odG1sI2Nmbi1jb2duaXRvLXVzZXJwb29scmlza2NvbmZpZ3VyYXRpb25hdHRhY2htZW50LXJpc2tleGNlcHRpb25jb25maWd1cmF0aW9uXHJcbiAgICAgICAgLy8gICAgICAgICAvLyByaXNrRXhjZXB0aW9uQ29uZmlndXJhdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgLy8gICAgIGJsb2NrZWRJcFJhbmdlTGlzdDogW10sXHJcbiAgICAgICAgLy8gICAgICAgICAvLyAgICAgc2tpcHBlZElwUmFuZ2VMaXN0OiBbXVxyXG4gICAgICAgIC8vICAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHVzZXIgcG9vbCBjbGllbnQgZm9yIGVhY2ggYXBwLlxyXG4gICAgICAgIC8vIEVhY2ggYXBwIHdpbGwgY29ubmVjdCB0byBDb2duaXRvIHVzaW5nIGl0cyBvd24gdXNlciBwb29sIGNsaWVudCBpZC5cclxuICAgICAgICBwcm9wcy5hcHBDb2Rlcz8uZm9yRWFjaChhcHBDb2RlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlclBvb2xDbGllbnQgPSBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCBgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UoYXBwQ29kZSl9VXNlclBvb2xDbGllbnRgLCB7XHJcbiAgICAgICAgICAgICAgICB1c2VyUG9vbDogdGhpcy51c2VyUG9vbCxcclxuICAgICAgICAgICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogYXBwQ29kZSxcclxuICAgICAgICAgICAgICAgIC8vIFJlY29tbWVuZGVkIENvZ25pdG8gc2V0dGluZy5cclxuICAgICAgICAgICAgICAgIHByZXZlbnRVc2VyRXhpc3RlbmNlRXJyb3JzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXV0aEZsb3dzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVxdWlyZWQgZm9yIGFwcCBDb2duaXRvIGF1dGhlbnRpY2F0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJQYXNzd29yZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBSZXF1aXJlZCBmb3IgQXBwU3luYyAobG9naW4gdmlhIENvZ25pdG8gdXNlciBwb29scykuXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlclNycDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51c2VyUG9vbENsaWVudHMucHVzaCh1c2VyUG9vbENsaWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19