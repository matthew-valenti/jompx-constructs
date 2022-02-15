"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JompxCdkPipeline = void 0;
const pipelines = require("aws-cdk-lib/pipelines");
const constructs_1 = require("constructs");
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 */
class JompxCdkPipeline extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.pipeline = new pipelines.CodePipeline(this, 'CodePipeline', {
            pipelineName: 'CdkPipeline',
            crossAccountKeys: true,
            synth: new pipelines.ShellStep('Synth', {
                input: props.shellStepInput,
                commands: ['npm ci', 'npm -g install typescript', 'npm install -g nx', 'cd apps/cdk', 'npm run build', 'npx cdk synth'],
                primaryOutputDirectory: 'apps/cdk/cdk.out'
            })
        });
    }
}
exports.JompxCdkPipeline = JompxCdkPipeline;
// 'npx nx build cdk', 'npx nx synth cdk'
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jZGstcGlwZWxpbmUtY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1EQUFtRDtBQUNuRCwyQ0FBdUM7QUFNdkM7O0dBRUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBRzNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBNkI7UUFDbkUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzdELFlBQVksRUFBRSxhQUFhO1lBQzNCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3BDLEtBQUssRUFBRSxLQUFLLENBQUMsY0FBYztnQkFDM0IsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO2dCQUN2SCxzQkFBc0IsRUFBRSxrQkFBa0I7YUFDN0MsQ0FBQztTQUNMLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQWhCRCw0Q0FnQkM7QUFFRCx5Q0FBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElKb21weENka1BpcGVsaW5lUHJvcHMge1xyXG4gICAgc2hlbGxTdGVwSW5wdXQ6IHBpcGVsaW5lcy5JRmlsZVNldFByb2R1Y2VyO1xyXG59XHJcblxyXG4vKipcclxuICogRGVwbG95IGluIHBhcmFsbGVsPyBSRUFEIFRISVM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YxL2RvY3MvcGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSm9tcHhDZGtQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElKb21weENka1BpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ0NvZGVQaXBlbGluZScsIHtcclxuICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiAnQ2RrUGlwZWxpbmUnLFxyXG4gICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHByb3BzLnNoZWxsU3RlcElucHV0LFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSAtZyBpbnN0YWxsIHR5cGVzY3JpcHQnLCAnbnBtIGluc3RhbGwgLWcgbngnLCAnY2QgYXBwcy9jZGsnLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ10sIC8vIEFXUyBkb2NzIGV4YW1wbGUgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXHJcbiAgICAgICAgICAgICAgICBwcmltYXJ5T3V0cHV0RGlyZWN0b3J5OiAnYXBwcy9jZGsvY2RrLm91dCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gJ25weCBueCBidWlsZCBjZGsnLCAnbnB4IG54IHN5bnRoIGNkayciXX0=