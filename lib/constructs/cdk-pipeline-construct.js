"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JompxCdkPipeline = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const pipelines = require("aws-cdk-lib/pipelines");
const constructs_1 = require("constructs");
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 * Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 * CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
 *
 * Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit
 */
class JompxCdkPipeline extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // TOD: Look this up from config environments.
        // If branch contains *sandbox1* then lookup environmentName and set envs.
        // Get stage param (test, prod). If stage=test then stacks will deploy to test "common resource" accounts. If stage=prod then stack will deploy to prod "common" accounts.
        // If branch = main then find a way to deploy with stage = test and if successful deploy with stage = prod.
        // What about stuff env with all config environment properties?
        this.env = { env: { account: '066209653567', region: 'us-west-2' } };
        this.pipeline = new pipelines.CodePipeline(this, 'CodePipeline', {
            pipelineName: 'CdkPipeline',
            crossAccountKeys: true,
            synth: new pipelines.ShellStep('Synth', {
                input: props.shellStepInput,
                commands: ['npm install', 'npm -g install typescript', 'npm install -g nx', 'cd apps/cdk', 'npm run build', 'npx cdk synth'],
                primaryOutputDirectory: 'apps/cdk/cdk.out'
            })
        });
        // TODO: Consider moving the commands to a separate script file? Not sure if this helps or hurts us.
        // stage.addPost(new ShellStep('validate', {
        //     input: source,
        //     commands: ['sh ./tests/validate.sh']
        // }));
    }
}
exports.JompxCdkPipeline = JompxCdkPipeline;
_a = JSII_RTTI_SYMBOL_1;
JompxCdkPipeline[_a] = { fqn: "@jompx/constructs.JompxCdkPipeline", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdHJ1Y3RzL2Nkay1waXBlbGluZS1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtREFBbUQ7QUFDbkQsMkNBQXVDO0FBTXZDOzs7Ozs7R0FNRztBQUNILE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFJM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLDhDQUE4QztRQUM5QywwRUFBMEU7UUFDMUUsMEtBQTBLO1FBQzFLLDJHQUEyRztRQUMzRywrREFBK0Q7UUFDL0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUM7UUFFckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUM3RCxZQUFZLEVBQUUsYUFBYTtZQUMzQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUNwQyxLQUFLLEVBQUUsS0FBSyxDQUFDLGNBQWM7Z0JBQzNCLFFBQVEsRUFBRSxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQztnQkFDNUgsc0JBQXNCLEVBQUUsa0JBQWtCO2FBQzdDLENBQUM7U0FDTCxDQUFDLENBQUM7UUFFSCxvR0FBb0c7UUFDcEcsNENBQTRDO1FBQzVDLHFCQUFxQjtRQUNyQiwyQ0FBMkM7UUFDM0MsT0FBTztJQUNYLENBQUM7O0FBN0JMLDRDQThCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUpvbXB4Q2RrUGlwZWxpbmVQcm9wcyB7XHJcbiAgICBzaGVsbFN0ZXBJbnB1dDogcGlwZWxpbmVzLklGaWxlU2V0UHJvZHVjZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXBsb3kgaW4gcGFyYWxsZWw/IFJFQUQgVEhJUzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjEvZG9jcy9waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogQ29udGludW91cyBpbnRlZ3JhdGlvbiBhbmQgZGVsaXZlcnkgKENJL0NEKSB1c2luZyBDREsgUGlwZWxpbmVzOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL3YyL2d1aWRlL2Nka19waXBlbGluZS5odG1sXHJcbiAqIENESyBkb2NvOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92Mi9kb2NzL2F3cy1jZGstbGliLnBpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKiBcclxuICogVHJpZ2dlciBhcHBzIHBpcGVsaW5lPz8/IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYyODU3OTI1L2hvdy10by1pbnZva2UtYS1waXBlbGluZS1iYXNlZC1vbi1hbm90aGVyLXBpcGVsaW5lLXN1Y2Nlc3MtdXNpbmctYXdzLWNvZGVjb21taXRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBKb21weENka1BpcGVsaW5lIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyByZWFkb25seSBwaXBlbGluZTogcGlwZWxpbmVzLkNvZGVQaXBlbGluZTtcclxuICAgIHB1YmxpYyBlbnY6IGFueTsgLy8gVE9ETzogVHlwZSB0aGlzLlxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJSm9tcHhDZGtQaXBlbGluZVByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgLy8gVE9EOiBMb29rIHRoaXMgdXAgZnJvbSBjb25maWcgZW52aXJvbm1lbnRzLlxyXG4gICAgICAgIC8vIElmIGJyYW5jaCBjb250YWlucyAqc2FuZGJveDEqIHRoZW4gbG9va3VwIGVudmlyb25tZW50TmFtZSBhbmQgc2V0IGVudnMuXHJcbiAgICAgICAgLy8gR2V0IHN0YWdlIHBhcmFtICh0ZXN0LCBwcm9kKS4gSWYgc3RhZ2U9dGVzdCB0aGVuIHN0YWNrcyB3aWxsIGRlcGxveSB0byB0ZXN0IFwiY29tbW9uIHJlc291cmNlXCIgYWNjb3VudHMuIElmIHN0YWdlPXByb2QgdGhlbiBzdGFjayB3aWxsIGRlcGxveSB0byBwcm9kIFwiY29tbW9uXCIgYWNjb3VudHMuXHJcbiAgICAgICAgLy8gSWYgYnJhbmNoID0gbWFpbiB0aGVuIGZpbmQgYSB3YXkgdG8gZGVwbG95IHdpdGggc3RhZ2UgPSB0ZXN0IGFuZCBpZiBzdWNjZXNzZnVsIGRlcGxveSB3aXRoIHN0YWdlID0gcHJvZC5cclxuICAgICAgICAvLyBXaGF0IGFib3V0IHN0dWZmIGVudiB3aXRoIGFsbCBjb25maWcgZW52aXJvbm1lbnQgcHJvcGVydGllcz9cclxuICAgICAgICB0aGlzLmVudiA9IHsgZW52OiB7IGFjY291bnQ6ICcwNjYyMDk2NTM1NjcnLCByZWdpb246ICd1cy13ZXN0LTInIH0gfTtcclxuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsICdDb2RlUGlwZWxpbmUnLCB7XHJcbiAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogJ0Nka1BpcGVsaW5lJyxcclxuICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcclxuICAgICAgICAgICAgICAgIGlucHV0OiBwcm9wcy5zaGVsbFN0ZXBJbnB1dCxcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbJ25wbSBpbnN0YWxsJywgJ25wbSAtZyBpbnN0YWxsIHR5cGVzY3JpcHQnLCAnbnBtIGluc3RhbGwgLWcgbngnLCAnY2QgYXBwcy9jZGsnLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ10sIC8vIEFXUyBkb2NzIGV4YW1wbGUgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXHJcbiAgICAgICAgICAgICAgICBwcmltYXJ5T3V0cHV0RGlyZWN0b3J5OiAnYXBwcy9jZGsvY2RrLm91dCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogQ29uc2lkZXIgbW92aW5nIHRoZSBjb21tYW5kcyB0byBhIHNlcGFyYXRlIHNjcmlwdCBmaWxlPyBOb3Qgc3VyZSBpZiB0aGlzIGhlbHBzIG9yIGh1cnRzIHVzLlxyXG4gICAgICAgIC8vIHN0YWdlLmFkZFBvc3QobmV3IFNoZWxsU3RlcCgndmFsaWRhdGUnLCB7XHJcbiAgICAgICAgLy8gICAgIGlucHV0OiBzb3VyY2UsXHJcbiAgICAgICAgLy8gICAgIGNvbW1hbmRzOiBbJ3NoIC4vdGVzdHMvdmFsaWRhdGUuc2gnXVxyXG4gICAgICAgIC8vIH0pKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gJ25weCBueCBidWlsZCBjZGsnLCAnbnB4IG54IHN5bnRoIGNkayciXX0=