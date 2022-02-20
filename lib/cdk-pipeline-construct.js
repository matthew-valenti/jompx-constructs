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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jZGstcGlwZWxpbmUtY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbURBQW1EO0FBQ25ELDJDQUF1QztBQU12Qzs7Ozs7O0dBTUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBSTNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw4Q0FBOEM7UUFDOUMsMEVBQTBFO1FBQzFFLDBLQUEwSztRQUMxSywyR0FBMkc7UUFDM0csK0RBQStEO1FBQy9ELElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDO1FBRXJFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDN0QsWUFBWSxFQUFFLGFBQWE7WUFDM0IsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixLQUFLLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtnQkFDcEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjO2dCQUMzQixRQUFRLEVBQUUsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUM7Z0JBQzVILHNCQUFzQixFQUFFLGtCQUFrQjthQUM3QyxDQUFDO1NBQ0wsQ0FBQyxDQUFDO1FBRUgsb0dBQW9HO1FBQ3BHLDRDQUE0QztRQUM1QyxxQkFBcUI7UUFDckIsMkNBQTJDO1FBQzNDLE9BQU87SUFDWCxDQUFDOztBQTdCTCw0Q0E4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElKb21weENka1BpcGVsaW5lUHJvcHMge1xyXG4gICAgc2hlbGxTdGVwSW5wdXQ6IHBpcGVsaW5lcy5JRmlsZVNldFByb2R1Y2VyO1xyXG59XHJcblxyXG4vKipcclxuICogRGVwbG95IGluIHBhcmFsbGVsPyBSRUFEIFRISVM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YxL2RvY3MvcGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIENvbnRpbnVvdXMgaW50ZWdyYXRpb24gYW5kIGRlbGl2ZXJ5IChDSS9DRCkgdXNpbmcgQ0RLIFBpcGVsaW5lczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS9jZGtfcGlwZWxpbmUuaHRtbFxyXG4gKiBDREsgZG9jbzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogXHJcbiAqIFRyaWdnZXIgYXBwcyBwaXBlbGluZT8/PyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82Mjg1NzkyNS9ob3ctdG8taW52b2tlLWEtcGlwZWxpbmUtYmFzZWQtb24tYW5vdGhlci1waXBlbGluZS1zdWNjZXNzLXVzaW5nLWF3cy1jb2RlY29tbWl0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSm9tcHhDZGtQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcbiAgICBwdWJsaWMgZW52OiBhbnk7IC8vIFRPRE86IFR5cGUgdGhpcy5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUpvbXB4Q2RrUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIC8vIFRPRDogTG9vayB0aGlzIHVwIGZyb20gY29uZmlnIGVudmlyb25tZW50cy5cclxuICAgICAgICAvLyBJZiBicmFuY2ggY29udGFpbnMgKnNhbmRib3gxKiB0aGVuIGxvb2t1cCBlbnZpcm9ubWVudE5hbWUgYW5kIHNldCBlbnZzLlxyXG4gICAgICAgIC8vIEdldCBzdGFnZSBwYXJhbSAodGVzdCwgcHJvZCkuIElmIHN0YWdlPXRlc3QgdGhlbiBzdGFja3Mgd2lsbCBkZXBsb3kgdG8gdGVzdCBcImNvbW1vbiByZXNvdXJjZVwiIGFjY291bnRzLiBJZiBzdGFnZT1wcm9kIHRoZW4gc3RhY2sgd2lsbCBkZXBsb3kgdG8gcHJvZCBcImNvbW1vblwiIGFjY291bnRzLlxyXG4gICAgICAgIC8vIElmIGJyYW5jaCA9IG1haW4gdGhlbiBmaW5kIGEgd2F5IHRvIGRlcGxveSB3aXRoIHN0YWdlID0gdGVzdCBhbmQgaWYgc3VjY2Vzc2Z1bCBkZXBsb3kgd2l0aCBzdGFnZSA9IHByb2QuXHJcbiAgICAgICAgLy8gV2hhdCBhYm91dCBzdHVmZiBlbnYgd2l0aCBhbGwgY29uZmlnIGVudmlyb25tZW50IHByb3BlcnRpZXM/XHJcbiAgICAgICAgdGhpcy5lbnYgPSB7IGVudjogeyBhY2NvdW50OiAnMDY2MjA5NjUzNTY3JywgcmVnaW9uOiAndXMtd2VzdC0yJyB9IH07XHJcblxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCAnQ29kZVBpcGVsaW5lJywge1xyXG4gICAgICAgICAgICBwaXBlbGluZU5hbWU6ICdDZGtQaXBlbGluZScsXHJcbiAgICAgICAgICAgIGNyb3NzQWNjb3VudEtleXM6IHRydWUsIC8vIFJlcXVpcmVkIGZvciBjcm9zcyBhY2NvdW50IGRlcGxveXMuXHJcbiAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dDogcHJvcHMuc2hlbGxTdGVwSW5wdXQsXHJcbiAgICAgICAgICAgICAgICBjb21tYW5kczogWyducG0gaW5zdGFsbCcsICducG0gLWcgaW5zdGFsbCB0eXBlc2NyaXB0JywgJ25wbSBpbnN0YWxsIC1nIG54JywgJ2NkIGFwcHMvY2RrJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddLCAvLyBBV1MgZG9jcyBleGFtcGxlIGNvbW1hbmRzOiBbJ25wbSBjaScsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXVxyXG4gICAgICAgICAgICAgICAgcHJpbWFyeU91dHB1dERpcmVjdG9yeTogJ2FwcHMvY2RrL2Nkay5vdXQnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IENvbnNpZGVyIG1vdmluZyB0aGUgY29tbWFuZHMgdG8gYSBzZXBhcmF0ZSBzY3JpcHQgZmlsZT8gTm90IHN1cmUgaWYgdGhpcyBoZWxwcyBvciBodXJ0cyB1cy5cclxuICAgICAgICAvLyBzdGFnZS5hZGRQb3N0KG5ldyBTaGVsbFN0ZXAoJ3ZhbGlkYXRlJywge1xyXG4gICAgICAgIC8vICAgICBpbnB1dDogc291cmNlLFxyXG4gICAgICAgIC8vICAgICBjb21tYW5kczogWydzaCAuL3Rlc3RzL3ZhbGlkYXRlLnNoJ11cclxuICAgICAgICAvLyB9KSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vICducHggbnggYnVpbGQgY2RrJywgJ25weCBueCBzeW50aCBjZGsnIl19