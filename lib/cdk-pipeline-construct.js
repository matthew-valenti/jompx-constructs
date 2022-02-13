"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JompxCdkPipeline = void 0;
const cdk = require("aws-cdk-lib");
const pipelines_1 = require("aws-cdk-lib/pipelines");
const constructs_1 = require("constructs");
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 */
class JompxCdkPipeline extends constructs_1.Construct {
    constructor(scope, id, props = { test: 'hello; ' }) {
        super(scope, id);
        this.pipeline = this.pipeline = new pipelines_1.CodePipeline(this, 'CodePipeline', {
            pipelineName: 'CdkPipeline',
            crossAccountKeys: true,
            synth: new pipelines_1.ShellStep('Synth', {
                input: pipelines_1.CodePipelineSource.gitHub('matthew-valenti/jompx-org', 'ci', // Branch.
                {
                    // authentication: cdk.SecretValue.ssmSecure('/cicd/github/token', '1'),
                    authentication: cdk.SecretValue.secretsManager('cicd/github/token'),
                }),
                // commands: ['npm ci', 'npm run build', 'npx cdk synth']
                // npx -p typescript tsc   ???????????????
                commands: ['npm -g install typescript', 'npm install -g nx', 'ls', 'cd apps/cdk', 'npm ci', 'npx nx build cdk', 'npx nx synth cdk'],
                primaryOutputDirectory: 'apps/cdk/cdk.out',
            }),
        });
        console.log('!!!props.test!!!', props.test);
    }
}
exports.JompxCdkPipeline = JompxCdkPipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jZGstcGlwZWxpbmUtY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyxxREFJK0I7QUFDL0IsMkNBQXVDO0FBTXZDOztHQUVHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQUczQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUN6RixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNuRSxZQUFZLEVBQUUsYUFBYTtZQUMzQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLEtBQUssRUFBRSxJQUFJLHFCQUFTLENBQUMsT0FBTyxFQUFFO2dCQUMxQixLQUFLLEVBQUUsOEJBQWtCLENBQUMsTUFBTSxDQUM1QiwyQkFBMkIsRUFDM0IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCO29CQUNJLHdFQUF3RTtvQkFDeEUsY0FBYyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDO2lCQUN0RSxDQUNKO2dCQUNELHlEQUF5RDtnQkFDekQsMENBQTBDO2dCQUMxQyxRQUFRLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQztnQkFDbkksc0JBQXNCLEVBQUUsa0JBQWtCO2FBQzdDLENBQUM7U0FDTCxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0o7QUEzQkQsNENBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHtcclxuICAgIENvZGVQaXBlbGluZSxcclxuICAgIENvZGVQaXBlbGluZVNvdXJjZSxcclxuICAgIFNoZWxsU3RlcCxcclxufSBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUpvbXB4Q2RrUGlwZWxpbmVQcm9wcyB7XHJcbiAgICB0ZXN0OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXBsb3kgaW4gcGFyYWxsZWw/IFJFQUQgVEhJUzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjEvZG9jcy9waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBKb21weENka1BpcGVsaW5lIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyByZWFkb25seSBwaXBlbGluZTogY2RrLnBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElKb21weENka1BpcGVsaW5lUHJvcHMgPSB7IHRlc3Q6ICdoZWxsbzsgJyB9KSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IHRoaXMucGlwZWxpbmUgPSBuZXcgQ29kZVBpcGVsaW5lKHRoaXMsICdDb2RlUGlwZWxpbmUnLCB7XHJcbiAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogJ0Nka1BpcGVsaW5lJyxcclxuICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgc3ludGg6IG5ldyBTaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQ6IENvZGVQaXBlbGluZVNvdXJjZS5naXRIdWIoXHJcbiAgICAgICAgICAgICAgICAgICAgJ21hdHRoZXctdmFsZW50aS9qb21weC1vcmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICdjaScsIC8vIEJyYW5jaC5cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF1dGhlbnRpY2F0aW9uOiBjZGsuU2VjcmV0VmFsdWUuc3NtU2VjdXJlKCcvY2ljZC9naXRodWIvdG9rZW4nLCAnMScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoZW50aWNhdGlvbjogY2RrLlNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdjaWNkL2dpdGh1Yi90b2tlbicpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICApLCAvLyBBV1MgU2VjcmV0czogZ2l0aHViLXRva2VuXHJcbiAgICAgICAgICAgICAgICAvLyBjb21tYW5kczogWyducG0gY2knLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ11cclxuICAgICAgICAgICAgICAgIC8vIG5weCAtcCB0eXBlc2NyaXB0IHRzYyAgID8/Pz8/Pz8/Pz8/Pz8/P1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdscycsICdjZCBhcHBzL2NkaycsICducG0gY2knLCAnbnB4IG54IGJ1aWxkIGNkaycsICducHggbnggc3ludGggY2RrJ10sXHJcbiAgICAgICAgICAgICAgICBwcmltYXJ5T3V0cHV0RGlyZWN0b3J5OiAnYXBwcy9jZGsvY2RrLm91dCcsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnISEhcHJvcHMudGVzdCEhIScsIHByb3BzLnRlc3QpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==