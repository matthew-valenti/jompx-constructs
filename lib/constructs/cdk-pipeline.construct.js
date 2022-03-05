"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JompxCdkPipeline = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
class JompxCdkPipeline extends constructs_1.Construct {
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
exports.JompxCdkPipeline = JompxCdkPipeline;
_a = JSII_RTTI_SYMBOL_1;
JompxCdkPipeline[_a] = { fqn: "@jompx/constructs.JompxCdkPipeline", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdHJ1Y3RzL2Nkay1waXBlbGluZS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBMEQ7QUFDMUQsbURBQW1EO0FBQ25ELDJDQUF1QztBQU92Qzs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFHM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNuRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNoRSxZQUFZLEVBQUUsY0FBYztZQUM1QixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUNwQyxHQUFHLEVBQUU7b0JBQ0QsS0FBSyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRTtpQkFDMUI7Z0JBQ0QsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjO2dCQUMzQixRQUFRLEVBQUUsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLDhDQUE4QyxDQUFDO2dCQUMzSSxzQkFBc0IsRUFBRSxrQkFBa0I7YUFDN0MsQ0FBQztTQUNMLENBQUMsQ0FBQztJQUNQLENBQUM7O0FBbEJMLDRDQW1CQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcclxuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSm9tcHhDZGtQaXBlbGluZVByb3BzIHtcclxuICAgIHN0YWdlOiBzdHJpbmc7XHJcbiAgICBzaGVsbFN0ZXBJbnB1dDogcGlwZWxpbmVzLklGaWxlU2V0UHJvZHVjZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXBsb3kgaW4gcGFyYWxsZWw/IFJFQUQgVEhJUzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjEvZG9jcy9waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogQ29udGludW91cyBpbnRlZ3JhdGlvbiBhbmQgZGVsaXZlcnkgKENJL0NEKSB1c2luZyBDREsgUGlwZWxpbmVzOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL3YyL2d1aWRlL2Nka19waXBlbGluZS5odG1sXHJcbiAqIENESyBkb2NvOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92Mi9kb2NzL2F3cy1jZGstbGliLnBpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKiBCdWlsZCBTcGVjIFJlZmVyZW5jZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLXNwZWMtcmVmLmh0bWxcclxuICogbnggY2ljZDogaHR0cHM6Ly9ueC5kZXYvY2kvbW9ub3JlcG8tY2ktY2lyY2xlLWNpXHJcbiAqXHJcbiAqIFRyaWdnZXIgYXBwcyBwaXBlbGluZT8/PyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82Mjg1NzkyNS9ob3ctdG8taW52b2tlLWEtcGlwZWxpbmUtYmFzZWQtb24tYW5vdGhlci1waXBlbGluZS1zdWNjZXNzLXVzaW5nLWF3cy1jb2RlY29tbWl0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSm9tcHhDZGtQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElKb21weENka1BpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ0Nka0NvZGVQaXBlbGluZScsIHtcclxuICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiAnY2RrLXBpcGVsaW5lJyxcclxuICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcclxuICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFNUQUdFOiBgJHtwcm9wcy5zdGFnZX1gXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHByb3BzLnNoZWxsU3RlcElucHV0LFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdueCBidWlsZCBjZGsnLCAnbnggc3ludGggY2RrIC0tYXJncz1cIi0tY29udGV4dCBzdGFnZT0kU1RBR0VcIiddLCAvLyBBV1MgZG9jcyBleGFtcGxlIGNvbW1hbmRzOiBbJ25wbSBjaScsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXVxyXG4gICAgICAgICAgICAgICAgcHJpbWFyeU91dHB1dERpcmVjdG9yeTogJ2FwcHMvY2RrL2Nkay5vdXQnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vICducHggbnggYnVpbGQgY2RrJywgJ25weCBueCBzeW50aCBjZGsnIl19