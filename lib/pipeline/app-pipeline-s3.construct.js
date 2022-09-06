"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPipelineS3 = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
const config_1 = require("../config/config");
/**
 * S3 bucket required to temporaryily store GitHub branch files (for app pipeline).
 */
class AppPipelineS3 extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        const config = new config_1.Config(this.node);
        const stage = config.stage();
        const stageNamePascalCase = changeCase.pascalCase(stage);
        // Create bucket to save github sandbox feature branch files (as zip).
        this.bucket = new s3.Bucket(this, `${config.organizationNamePascalCase()}AppPipelineBranch${stageNamePascalCase}`, {
            // Version must be true to use as CodePipeline source.
            versioned: true,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            // Destroy bucket on stack delete. Bucket contains temporary copy of source control files only.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            // Delete all bucket objects on bucket/stack destroy.
            autoDeleteObjects: true
        });
    }
}
exports.AppPipelineS3 = AppPipelineS3;
_a = JSII_RTTI_SYMBOL_1;
AppPipelineS3[_a] = { fqn: "@jompx/constructs.AppPipelineS3", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLXMzLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9hcHAtcGlwZWxpbmUtczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6Qyw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUFFMUM7O0dBRUc7QUFDSCxNQUFhLGFBQWMsU0FBUSxzQkFBUztJQUl4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpELHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsb0JBQW9CLG1CQUFtQixFQUFFLEVBQUU7WUFDL0csc0RBQXNEO1lBQ3RELFNBQVMsRUFBRSxJQUFJO1lBQ2YsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztZQUNqRCxVQUFVLEVBQUUsSUFBSTtZQUNoQiwrRkFBK0Y7WUFDL0YsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxxREFBcUQ7WUFDckQsaUJBQWlCLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUM7SUFDUCxDQUFDOztBQXZCTCxzQ0F3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcblxyXG4vKipcclxuICogUzMgYnVja2V0IHJlcXVpcmVkIHRvIHRlbXBvcmFyeWlseSBzdG9yZSBHaXRIdWIgYnJhbmNoIGZpbGVzIChmb3IgYXBwIHBpcGVsaW5lKS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBQaXBlbGluZVMzIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuXHJcbiAgICBidWNrZXQ6IHMzLkJ1Y2tldDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZyh0aGlzLm5vZGUpO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlID0gY29uZmlnLnN0YWdlKCk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2VOYW1lUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShzdGFnZSk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBidWNrZXQgdG8gc2F2ZSBnaXRodWIgc2FuZGJveCBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICB0aGlzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7Y29uZmlnLm9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCl9QXBwUGlwZWxpbmVCcmFuY2gke3N0YWdlTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAvLyBWZXJzaW9uIG11c3QgYmUgdHJ1ZSB0byB1c2UgYXMgQ29kZVBpcGVsaW5lIHNvdXJjZS5cclxuICAgICAgICAgICAgdmVyc2lvbmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSwgLy8gVE9ETzogSXMgdGhpcyBuZWVkZWQ/XHJcbiAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXHJcbiAgICAgICAgICAgIGVuZm9yY2VTU0w6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIERlc3Ryb3kgYnVja2V0IG9uIHN0YWNrIGRlbGV0ZS4gQnVja2V0IGNvbnRhaW5zIHRlbXBvcmFyeSBjb3B5IG9mIHNvdXJjZSBjb250cm9sIGZpbGVzIG9ubHkuXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgICAgICAgIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gYnVja2V0L3N0YWNrIGRlc3Ryb3kuXHJcbiAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19