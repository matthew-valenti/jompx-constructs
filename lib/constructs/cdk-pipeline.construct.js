"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JompxCdkPipeline = void 0;
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
// 'npx nx build cdk', 'npx nx synth cdk'
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdHJ1Y3RzL2Nkay1waXBlbGluZS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbURBQW1EO0FBQ25ELDJDQUF1QztBQU92Qzs7Ozs7O0dBTUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBRzNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELFlBQVksRUFBRSxhQUFhO1lBQzNCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BDLEtBQUssRUFBRSxLQUFLLENBQUMsY0FBYztnQkFDM0IsUUFBUSxFQUFFLENBQUMsYUFBYSxFQUFFLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO2dCQUM1SCxzQkFBc0IsRUFBRSxrQkFBa0I7YUFDN0MsQ0FBQztTQUNMLENBQUMsQ0FBQztRQUVILG9HQUFvRztRQUNwRyw0Q0FBNEM7UUFDNUMscUJBQXFCO1FBQ3JCLDJDQUEyQztRQUMzQyxPQUFPO0lBQ1gsQ0FBQztDQUNKO0FBdEJELDRDQXNCQztBQUVELHlDQUF5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgSUVudmlyb25tZW50LCBTdGFnZSB9IGZyb20gJy4uL2NsYXNzZXMvZW52aXJvbm1lbnQnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSm9tcHhDZGtQaXBlbGluZVByb3BzIHtcclxuICAgIHNoZWxsU3RlcElucHV0OiBwaXBlbGluZXMuSUZpbGVTZXRQcm9kdWNlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlcGxveSBpbiBwYXJhbGxlbD8gUkVBRCBUSElTOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92MS9kb2NzL3BpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKiBDb250aW51b3VzIGludGVncmF0aW9uIGFuZCBkZWxpdmVyeSAoQ0kvQ0QpIHVzaW5nIENESyBQaXBlbGluZXM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvY2RrX3BpcGVsaW5lLmh0bWxcclxuICogQ0RLIGRvY286IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqXHJcbiAqIFRyaWdnZXIgYXBwcyBwaXBlbGluZT8/PyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82Mjg1NzkyNS9ob3ctdG8taW52b2tlLWEtcGlwZWxpbmUtYmFzZWQtb24tYW5vdGhlci1waXBlbGluZS1zdWNjZXNzLXVzaW5nLWF3cy1jb2RlY29tbWl0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSm9tcHhDZGtQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElKb21weENka1BpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ0NvZGVQaXBlbGluZScsIHtcclxuICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiAnQ2RrUGlwZWxpbmUnLFxyXG4gICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHByb3BzLnNoZWxsU3RlcElucHV0LFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdjZCBhcHBzL2NkaycsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXSwgLy8gQVdTIGRvY3MgZXhhbXBsZSBjb21tYW5kczogWyducG0gY2knLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ11cclxuICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3Rvcnk6ICdhcHBzL2Nkay9jZGsub3V0J1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBDb25zaWRlciBtb3ZpbmcgdGhlIGNvbW1hbmRzIHRvIGEgc2VwYXJhdGUgc2NyaXB0IGZpbGU/IE5vdCBzdXJlIGlmIHRoaXMgaGVscHMgb3IgaHVydHMgdXMuXHJcbiAgICAgICAgLy8gc3RhZ2UuYWRkUG9zdChuZXcgU2hlbGxTdGVwKCd2YWxpZGF0ZScsIHtcclxuICAgICAgICAvLyAgICAgaW5wdXQ6IHNvdXJjZSxcclxuICAgICAgICAvLyAgICAgY29tbWFuZHM6IFsnc2ggLi90ZXN0cy92YWxpZGF0ZS5zaCddXHJcbiAgICAgICAgLy8gfSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyAnbnB4IG54IGJ1aWxkIGNkaycsICducHggbnggc3ludGggY2RrJyJdfQ==