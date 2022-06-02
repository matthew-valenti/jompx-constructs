"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPipelineS3 = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
const config_1 = require("../config/config");
class AppPipelineS3 extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.outputs = {};
        const config = new config_1.Config(this.node);
        const stage = config.stage();
        this.outputs.bucket = new s3.Bucket(this, `${changeCase.pascalCase(props.appName)}HostingBucket`, {
            // Bucket name must be globally unique across all AWS accounts.
            // Bucket name must match app urls e.g. admin.mydomain.com, admin.sandbox1.mydomain.com
            bucketName: `${props.appName}.${stage}.${props.domainName}`,
            // Required for public website.
            publicReadAccess: true,
            // Single Page App (SPA) settings.
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            // Destroy bucket when stack destroyed. Bucket is disposable and can be destroyed and re-created as needed.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            // Auto delete files on stack/bucket destroy.
            autoDeleteObjects: true
        });
    }
}
exports.AppPipelineS3 = AppPipelineS3;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BpcGVsaW5lL3MzLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMseUNBQXlDO0FBQ3pDLDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsMkNBQXVDO0FBQ3ZDLDZDQUEwQztBQVkxQyxNQUFhLGFBQWMsU0FBUSxzQkFBUztJQUl4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIZCxZQUFPLEdBQXNCLEVBQXVCLENBQUM7UUFLeEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtZQUM5RiwrREFBK0Q7WUFDL0QsdUZBQXVGO1lBQ3ZGLFVBQVUsRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDM0QsK0JBQStCO1lBQy9CLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsa0NBQWtDO1lBQ2xDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQywyR0FBMkc7WUFDM0csYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4Qyw2Q0FBNkM7WUFDN0MsaUJBQWlCLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUF6QkQsc0NBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUhvc3RpbmdTM1Byb3BzIHtcclxuICAgIGRvbWFpbk5hbWU6IHN0cmluZztcclxuICAgIGFwcE5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSG9zdGluZ1MzT3V0cHV0cyB7XHJcbiAgICBidWNrZXQ6IHMzLkJ1Y2tldDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFBpcGVsaW5lUzMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG5cclxuICAgIHB1YmxpYyBvdXRwdXRzOiBJSG9zdGluZ1MzT3V0cHV0cyA9IHt9IGFzIElIb3N0aW5nUzNPdXRwdXRzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJSG9zdGluZ1MzUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSBjb25maWcuc3RhZ2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vdXRwdXRzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHByb3BzLmFwcE5hbWUpfUhvc3RpbmdCdWNrZXRgLCB7XHJcbiAgICAgICAgICAgIC8vIEJ1Y2tldCBuYW1lIG11c3QgYmUgZ2xvYmFsbHkgdW5pcXVlIGFjcm9zcyBhbGwgQVdTIGFjY291bnRzLlxyXG4gICAgICAgICAgICAvLyBCdWNrZXQgbmFtZSBtdXN0IG1hdGNoIGFwcCB1cmxzIGUuZy4gYWRtaW4ubXlkb21haW4uY29tLCBhZG1pbi5zYW5kYm94MS5teWRvbWFpbi5jb21cclxuICAgICAgICAgICAgYnVja2V0TmFtZTogYCR7cHJvcHMuYXBwTmFtZX0uJHtzdGFnZX0uJHtwcm9wcy5kb21haW5OYW1lfWAsXHJcbiAgICAgICAgICAgIC8vIFJlcXVpcmVkIGZvciBwdWJsaWMgd2Vic2l0ZS5cclxuICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gU2luZ2xlIFBhZ2UgQXBwIChTUEEpIHNldHRpbmdzLlxyXG4gICAgICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICAvLyBEZXN0cm95IGJ1Y2tldCB3aGVuIHN0YWNrIGRlc3Ryb3llZC4gQnVja2V0IGlzIGRpc3Bvc2FibGUgYW5kIGNhbiBiZSBkZXN0cm95ZWQgYW5kIHJlLWNyZWF0ZWQgYXMgbmVlZGVkLlxyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgICAgICAgICAvLyBBdXRvIGRlbGV0ZSBmaWxlcyBvbiBzdGFjay9idWNrZXQgZGVzdHJveS5cclxuICAgICAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=