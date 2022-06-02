"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostingS3 = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
const config_1 = require("../config/config");
class HostingS3 extends constructs_1.Construct {
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
exports.HostingS3 = HostingS3;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczNQaXBlbGluZS5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaG9zdGluZy9zM1BpcGVsaW5lLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMseUNBQXlDO0FBQ3pDLDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsMkNBQXVDO0FBQ3ZDLDZDQUEwQztBQVkxQyxNQUFhLFNBQVUsU0FBUSxzQkFBUztJQUlwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIZCxZQUFPLEdBQXNCLEVBQXVCLENBQUM7UUFLeEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtZQUM5RiwrREFBK0Q7WUFDL0QsdUZBQXVGO1lBQ3ZGLFVBQVUsRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDM0QsK0JBQStCO1lBQy9CLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsa0NBQWtDO1lBQ2xDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQywyR0FBMkc7WUFDM0csYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4Qyw2Q0FBNkM7WUFDN0MsaUJBQWlCLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUF6QkQsOEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUhvc3RpbmdTM1Byb3BzIHtcclxuICAgIGRvbWFpbk5hbWU6IHN0cmluZztcclxuICAgIGFwcE5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSG9zdGluZ1MzT3V0cHV0cyB7XHJcbiAgICBidWNrZXQ6IHMzLkJ1Y2tldDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEhvc3RpbmdTMyBleHRlbmRzIENvbnN0cnVjdCB7XHJcblxyXG4gICAgcHVibGljIG91dHB1dHM6IElIb3N0aW5nUzNPdXRwdXRzID0ge30gYXMgSUhvc3RpbmdTM091dHB1dHM7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElIb3N0aW5nUzNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm91dHB1dHMuYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocHJvcHMuYXBwTmFtZSl9SG9zdGluZ0J1Y2tldGAsIHtcclxuICAgICAgICAgICAgLy8gQnVja2V0IG5hbWUgbXVzdCBiZSBnbG9iYWxseSB1bmlxdWUgYWNyb3NzIGFsbCBBV1MgYWNjb3VudHMuXHJcbiAgICAgICAgICAgIC8vIEJ1Y2tldCBuYW1lIG11c3QgbWF0Y2ggYXBwIHVybHMgZS5nLiBhZG1pbi5teWRvbWFpbi5jb20sIGFkbWluLnNhbmRib3gxLm15ZG9tYWluLmNvbVxyXG4gICAgICAgICAgICBidWNrZXROYW1lOiBgJHtwcm9wcy5hcHBOYW1lfS4ke3N0YWdlfS4ke3Byb3BzLmRvbWFpbk5hbWV9YCxcclxuICAgICAgICAgICAgLy8gUmVxdWlyZWQgZm9yIHB1YmxpYyB3ZWJzaXRlLlxyXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBTaW5nbGUgUGFnZSBBcHAgKFNQQSkgc2V0dGluZ3MuXHJcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIC8vIERlc3Ryb3kgYnVja2V0IHdoZW4gc3RhY2sgZGVzdHJveWVkLiBCdWNrZXQgaXMgZGlzcG9zYWJsZSBhbmQgY2FuIGJlIGRlc3Ryb3llZCBhbmQgcmUtY3JlYXRlZCBhcyBuZWVkZWQuXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgICAgICAgIC8vIEF1dG8gZGVsZXRlIGZpbGVzIG9uIHN0YWNrL2J1Y2tldCBkZXN0cm95LlxyXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==