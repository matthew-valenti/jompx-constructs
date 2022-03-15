"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipeline = void 0;
// import * as codebuild from 'aws-cdk-lib/aws-codebuild';
const pipelines = require("aws-cdk-lib/pipelines");
const constructs_1 = require("constructs");
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 * Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 * CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
 * Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
 * nx cicd: https://nx.dev/ci/monorepo-ci-circle-ci
 *
 * Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit
 */
class CdkPipeline extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.pipeline = new pipelines.CodePipeline(this, 'CdkCodePipeline', {
            pipelineName: 'cdk-pipeline',
            crossAccountKeys: true,
            synth: new pipelines.ShellStep('Synth', {
                env: {
                    STAGE: `${props.stage}`
                },
                input: props.shellStepInput,
                commands: ['npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk --args="--context stage=$STAGE"'],
                primaryOutputDirectory: 'apps/cdk/cdk.out'
            })
        });
    }
}
exports.CdkPipeline = CdkPipeline;
// 'npx nx build cdk', 'npx nx synth cdk'
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5vbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc3RydWN0cy9jZGstcGlwZWxpbmUuY29uc3RydWN0Lm9sZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFBMEQ7QUFDMUQsbURBQW1EO0FBQ25ELDJDQUF1QztBQU92Qzs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBR3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDaEUsWUFBWSxFQUFFLGNBQWM7WUFDNUIsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixLQUFLLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtnQkFDcEMsR0FBRyxFQUFFO29CQUNELEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUU7aUJBQzFCO2dCQUNELEtBQUssRUFBRSxLQUFLLENBQUMsY0FBYztnQkFDM0IsUUFBUSxFQUFFLENBQUMsYUFBYSxFQUFFLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSw4Q0FBOEMsQ0FBQztnQkFDM0ksc0JBQXNCLEVBQUUsa0JBQWtCO2FBQzdDLENBQUM7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFuQkQsa0NBbUJDO0FBRUQseUNBQXlDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xyXG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDZGtQaXBlbGluZVByb3BzIHtcclxuICAgIHN0YWdlOiBzdHJpbmc7XHJcbiAgICBzaGVsbFN0ZXBJbnB1dDogcGlwZWxpbmVzLklGaWxlU2V0UHJvZHVjZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXBsb3kgaW4gcGFyYWxsZWw/IFJFQUQgVEhJUzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjEvZG9jcy9waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogQ29udGludW91cyBpbnRlZ3JhdGlvbiBhbmQgZGVsaXZlcnkgKENJL0NEKSB1c2luZyBDREsgUGlwZWxpbmVzOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL3YyL2d1aWRlL2Nka19waXBlbGluZS5odG1sXHJcbiAqIENESyBkb2NvOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92Mi9kb2NzL2F3cy1jZGstbGliLnBpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKiBCdWlsZCBTcGVjIFJlZmVyZW5jZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLXNwZWMtcmVmLmh0bWxcclxuICogbnggY2ljZDogaHR0cHM6Ly9ueC5kZXYvY2kvbW9ub3JlcG8tY2ktY2lyY2xlLWNpXHJcbiAqXHJcbiAqIFRyaWdnZXIgYXBwcyBwaXBlbGluZT8/PyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82Mjg1NzkyNS9ob3ctdG8taW52b2tlLWEtcGlwZWxpbmUtYmFzZWQtb24tYW5vdGhlci1waXBlbGluZS1zdWNjZXNzLXVzaW5nLWF3cy1jb2RlY29tbWl0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2RrUGlwZWxpbmUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQ2RrUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCAnQ2RrQ29kZVBpcGVsaW5lJywge1xyXG4gICAgICAgICAgICBwaXBlbGluZU5hbWU6ICdjZGstcGlwZWxpbmUnLFxyXG4gICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgZW52OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgU1RBR0U6IGAke3Byb3BzLnN0YWdlfWBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBpbnB1dDogcHJvcHMuc2hlbGxTdGVwSW5wdXQsXHJcbiAgICAgICAgICAgICAgICBjb21tYW5kczogWyducG0gaW5zdGFsbCcsICducG0gLWcgaW5zdGFsbCB0eXBlc2NyaXB0JywgJ25wbSBpbnN0YWxsIC1nIG54JywgJ254IGJ1aWxkIGNkaycsICdueCBzeW50aCBjZGsgLS1hcmdzPVwiLS1jb250ZXh0IHN0YWdlPSRTVEFHRVwiJ10sIC8vIEFXUyBkb2NzIGV4YW1wbGUgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXHJcbiAgICAgICAgICAgICAgICBwcmltYXJ5T3V0cHV0RGlyZWN0b3J5OiAnYXBwcy9jZGsvY2RrLm91dCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gJ25weCBueCBidWlsZCBjZGsnLCAnbnB4IG54IHN5bnRoIGNkayciXX0=