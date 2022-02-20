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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLW1haW4uY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Nkay1waXBlbGluZS1tYWluLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1EQUFtRDtBQUNuRCwyQ0FBdUM7QUFNdkM7Ozs7OztHQU1HO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQUkzQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ25FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsOENBQThDO1FBQzlDLDBFQUEwRTtRQUMxRSwwS0FBMEs7UUFDMUssMkdBQTJHO1FBQzNHLCtEQUErRDtRQUMvRCxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQztRQUVyRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELFlBQVksRUFBRSxhQUFhO1lBQzNCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BDLEtBQUssRUFBRSxLQUFLLENBQUMsY0FBYztnQkFDM0IsUUFBUSxFQUFFLENBQUMsYUFBYSxFQUFFLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO2dCQUM1SCxzQkFBc0IsRUFBRSxrQkFBa0I7YUFDN0MsQ0FBQztTQUNMLENBQUMsQ0FBQztRQUVILG9HQUFvRztRQUNwRyw0Q0FBNEM7UUFDNUMscUJBQXFCO1FBQ3JCLDJDQUEyQztRQUMzQyxPQUFPO0lBQ1gsQ0FBQzs7QUE3QkwsNENBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSm9tcHhDZGtQaXBlbGluZVByb3BzIHtcclxuICAgIHNoZWxsU3RlcElucHV0OiBwaXBlbGluZXMuSUZpbGVTZXRQcm9kdWNlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlcGxveSBpbiBwYXJhbGxlbD8gUkVBRCBUSElTOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92MS9kb2NzL3BpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKiBDb250aW51b3VzIGludGVncmF0aW9uIGFuZCBkZWxpdmVyeSAoQ0kvQ0QpIHVzaW5nIENESyBQaXBlbGluZXM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvY2RrX3BpcGVsaW5lLmh0bWxcclxuICogQ0RLIGRvY286IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIFxyXG4gKiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmU/Pz8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEpvbXB4Q2RrUGlwZWxpbmUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG4gICAgcHVibGljIGVudjogYW55OyAvLyBUT0RPOiBUeXBlIHRoaXMuXHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElKb21weENka1BpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICAvLyBUT0Q6IExvb2sgdGhpcyB1cCBmcm9tIGNvbmZpZyBlbnZpcm9ubWVudHMuXHJcbiAgICAgICAgLy8gSWYgYnJhbmNoIGNvbnRhaW5zICpzYW5kYm94MSogdGhlbiBsb29rdXAgZW52aXJvbm1lbnROYW1lIGFuZCBzZXQgZW52cy5cclxuICAgICAgICAvLyBHZXQgc3RhZ2UgcGFyYW0gKHRlc3QsIHByb2QpLiBJZiBzdGFnZT10ZXN0IHRoZW4gc3RhY2tzIHdpbGwgZGVwbG95IHRvIHRlc3QgXCJjb21tb24gcmVzb3VyY2VcIiBhY2NvdW50cy4gSWYgc3RhZ2U9cHJvZCB0aGVuIHN0YWNrIHdpbGwgZGVwbG95IHRvIHByb2QgXCJjb21tb25cIiBhY2NvdW50cy5cclxuICAgICAgICAvLyBJZiBicmFuY2ggPSBtYWluIHRoZW4gZmluZCBhIHdheSB0byBkZXBsb3kgd2l0aCBzdGFnZSA9IHRlc3QgYW5kIGlmIHN1Y2Nlc3NmdWwgZGVwbG95IHdpdGggc3RhZ2UgPSBwcm9kLlxyXG4gICAgICAgIC8vIFdoYXQgYWJvdXQgc3R1ZmYgZW52IHdpdGggYWxsIGNvbmZpZyBlbnZpcm9ubWVudCBwcm9wZXJ0aWVzP1xyXG4gICAgICAgIHRoaXMuZW52ID0geyBlbnY6IHsgYWNjb3VudDogJzA2NjIwOTY1MzU2NycsIHJlZ2lvbjogJ3VzLXdlc3QtMicgfSB9O1xyXG5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ0NvZGVQaXBlbGluZScsIHtcclxuICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiAnQ2RrUGlwZWxpbmUnLFxyXG4gICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHByb3BzLnNoZWxsU3RlcElucHV0LFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdjZCBhcHBzL2NkaycsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXSwgLy8gQVdTIGRvY3MgZXhhbXBsZSBjb21tYW5kczogWyducG0gY2knLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ11cclxuICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3Rvcnk6ICdhcHBzL2Nkay9jZGsub3V0J1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBDb25zaWRlciBtb3ZpbmcgdGhlIGNvbW1hbmRzIHRvIGEgc2VwYXJhdGUgc2NyaXB0IGZpbGU/IE5vdCBzdXJlIGlmIHRoaXMgaGVscHMgb3IgaHVydHMgdXMuXHJcbiAgICAgICAgLy8gc3RhZ2UuYWRkUG9zdChuZXcgU2hlbGxTdGVwKCd2YWxpZGF0ZScsIHtcclxuICAgICAgICAvLyAgICAgaW5wdXQ6IHNvdXJjZSxcclxuICAgICAgICAvLyAgICAgY29tbWFuZHM6IFsnc2ggLi90ZXN0cy92YWxpZGF0ZS5zaCddXHJcbiAgICAgICAgLy8gfSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyAnbnB4IG54IGJ1aWxkIGNkaycsICducHggbnggc3ludGggY2RrJyJdfQ==