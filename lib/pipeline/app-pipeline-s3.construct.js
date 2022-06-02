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
        this.outputs = {};
        const config = new config_1.Config(this.node);
        const stage = config.stage();
        const stageNamePascalCase = changeCase.pascalCase(stage);
        // Create bucket to save github sandbox feature branch files (as zip).
        this.outputs.bucket = new s3.Bucket(this, `${config.organizationNamePascalCase()}AppPipelineBranch${stageNamePascalCase}`, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLXMzLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9hcHAtcGlwZWxpbmUtczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6Qyw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUFNMUM7O0dBRUc7QUFDSCxNQUFhLGFBQWMsU0FBUSxzQkFBUztJQUl4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSGQsWUFBTyxHQUEwQixFQUEyQixDQUFDO1FBS2hFLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpELHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLDBCQUEwQixFQUFFLG9CQUFvQixtQkFBbUIsRUFBRSxFQUFFO1lBQ3ZILHNEQUFzRDtZQUN0RCxTQUFTLEVBQUUsSUFBSTtZQUNmLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7WUFDakQsVUFBVSxFQUFFLElBQUk7WUFDaEIsK0ZBQStGO1lBQy9GLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMscURBQXFEO1lBQ3JELGlCQUFpQixFQUFFLElBQUk7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7QUF2Qkwsc0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwUGlwZWxpbmVTM091dHB1dHMge1xyXG4gICAgYnVja2V0OiBzMy5CdWNrZXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTMyBidWNrZXQgcmVxdWlyZWQgdG8gdGVtcG9yYXJ5aWx5IHN0b3JlIEdpdEh1YiBicmFuY2ggZmlsZXMgKGZvciBhcHAgcGlwZWxpbmUpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcFBpcGVsaW5lUzMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG5cclxuICAgIHB1YmxpYyBvdXRwdXRzOiBJQXBwUGlwZWxpbmVTM091dHB1dHMgPSB7fSBhcyBJQXBwUGlwZWxpbmVTM091dHB1dHM7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlTmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2Uoc3RhZ2UpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYnVja2V0IHRvIHNhdmUgZ2l0aHViIHNhbmRib3ggZmVhdHVyZSBicmFuY2ggZmlsZXMgKGFzIHppcCkuXHJcbiAgICAgICAgdGhpcy5vdXRwdXRzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7Y29uZmlnLm9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCl9QXBwUGlwZWxpbmVCcmFuY2gke3N0YWdlTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAvLyBWZXJzaW9uIG11c3QgYmUgdHJ1ZSB0byB1c2UgYXMgQ29kZVBpcGVsaW5lIHNvdXJjZS5cclxuICAgICAgICAgICAgdmVyc2lvbmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSwgLy8gVE9ETzogSXMgdGhpcyBuZWVkZWQ/XHJcbiAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXHJcbiAgICAgICAgICAgIGVuZm9yY2VTU0w6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIERlc3Ryb3kgYnVja2V0IG9uIHN0YWNrIGRlbGV0ZS4gQnVja2V0IGNvbnRhaW5zIHRlbXBvcmFyeSBjb3B5IG9mIHNvdXJjZSBjb250cm9sIGZpbGVzIG9ubHkuXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgICAgICAgIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gYnVja2V0L3N0YWNrIGRlc3Ryb3kuXHJcbiAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19