"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPipelineS3 = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLXMzLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9hcHAtcGlwZWxpbmUtczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsNkNBQTBDO0FBRTFDOztHQUVHO0FBQ0gsTUFBYSxhQUFjLFNBQVEsc0JBQVM7SUFJeEMsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6RCxzRUFBc0U7UUFDdEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLDBCQUEwQixFQUFFLG9CQUFvQixtQkFBbUIsRUFBRSxFQUFFO1lBQy9HLHNEQUFzRDtZQUN0RCxTQUFTLEVBQUUsSUFBSTtZQUNmLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7WUFDakQsVUFBVSxFQUFFLElBQUk7WUFDaEIsK0ZBQStGO1lBQy9GLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMscURBQXFEO1lBQ3JELGlCQUFpQixFQUFFLElBQUk7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBeEJELHNDQXdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuXHJcbi8qKlxyXG4gKiBTMyBidWNrZXQgcmVxdWlyZWQgdG8gdGVtcG9yYXJ5aWx5IHN0b3JlIEdpdEh1YiBicmFuY2ggZmlsZXMgKGZvciBhcHAgcGlwZWxpbmUpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcFBpcGVsaW5lUzMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG5cclxuICAgIGJ1Y2tldDogczMuQnVja2V0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSBjb25maWcuc3RhZ2UoKTtcclxuICAgICAgICBjb25zdCBzdGFnZU5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHN0YWdlKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGJ1Y2tldCB0byBzYXZlIGdpdGh1YiBzYW5kYm94IGZlYXR1cmUgYnJhbmNoIGZpbGVzIChhcyB6aXApLlxyXG4gICAgICAgIHRoaXMuYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBgJHtjb25maWcub3JnYW5pemF0aW9uTmFtZVBhc2NhbENhc2UoKX1BcHBQaXBlbGluZUJyYW5jaCR7c3RhZ2VOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgIC8vIFZlcnNpb24gbXVzdCBiZSB0cnVlIHRvIHVzZSBhcyBDb2RlUGlwZWxpbmUgc291cmNlLlxyXG4gICAgICAgICAgICB2ZXJzaW9uZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLCAvLyBUT0RPOiBJcyB0aGlzIG5lZWRlZD9cclxuICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgICAgICAgICAgZW5mb3JjZVNTTDogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gRGVzdHJveSBidWNrZXQgb24gc3RhY2sgZGVsZXRlLiBCdWNrZXQgY29udGFpbnMgdGVtcG9yYXJ5IGNvcHkgb2Ygc291cmNlIGNvbnRyb2wgZmlsZXMgb25seS5cclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgICAgICAgLy8gRGVsZXRlIGFsbCBidWNrZXQgb2JqZWN0cyBvbiBidWNrZXQvc3RhY2sgZGVzdHJveS5cclxuICAgICAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=