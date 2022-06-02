"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostingS3 = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
_a = JSII_RTTI_SYMBOL_1;
HostingS3[_a] = { fqn: "@jompx/constructs.HostingS3", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hvc3RpbmcvczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6Qyw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUFZMUMsTUFBYSxTQUFVLFNBQVEsc0JBQVM7SUFJcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSGQsWUFBTyxHQUFzQixFQUF1QixDQUFDO1FBS3hELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUU7WUFDOUYsK0RBQStEO1lBQy9ELHVGQUF1RjtZQUN2RixVQUFVLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQzNELCtCQUErQjtZQUMvQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGtDQUFrQztZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsMkdBQTJHO1lBQzNHLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsNkNBQTZDO1lBQzdDLGlCQUFpQixFQUFFLElBQUk7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7QUF4QkwsOEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUhvc3RpbmdTM1Byb3BzIHtcclxuICAgIGRvbWFpbk5hbWU6IHN0cmluZztcclxuICAgIGFwcE5hbWU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSG9zdGluZ1MzT3V0cHV0cyB7XHJcbiAgICBidWNrZXQ6IHMzLkJ1Y2tldDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEhvc3RpbmdTMyBleHRlbmRzIENvbnN0cnVjdCB7XHJcblxyXG4gICAgcHVibGljIG91dHB1dHM6IElIb3N0aW5nUzNPdXRwdXRzID0ge30gYXMgSUhvc3RpbmdTM091dHB1dHM7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElIb3N0aW5nUzNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm91dHB1dHMuYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocHJvcHMuYXBwTmFtZSl9SG9zdGluZ0J1Y2tldGAsIHtcclxuICAgICAgICAgICAgLy8gQnVja2V0IG5hbWUgbXVzdCBiZSBnbG9iYWxseSB1bmlxdWUgYWNyb3NzIGFsbCBBV1MgYWNjb3VudHMuXHJcbiAgICAgICAgICAgIC8vIEJ1Y2tldCBuYW1lIG11c3QgbWF0Y2ggYXBwIHVybHMgZS5nLiBhZG1pbi5teWRvbWFpbi5jb20sIGFkbWluLnNhbmRib3gxLm15ZG9tYWluLmNvbVxyXG4gICAgICAgICAgICBidWNrZXROYW1lOiBgJHtwcm9wcy5hcHBOYW1lfS4ke3N0YWdlfS4ke3Byb3BzLmRvbWFpbk5hbWV9YCxcclxuICAgICAgICAgICAgLy8gUmVxdWlyZWQgZm9yIHB1YmxpYyB3ZWJzaXRlLlxyXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBTaW5nbGUgUGFnZSBBcHAgKFNQQSkgc2V0dGluZ3MuXHJcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIC8vIERlc3Ryb3kgYnVja2V0IHdoZW4gc3RhY2sgZGVzdHJveWVkLiBCdWNrZXQgaXMgZGlzcG9zYWJsZSBhbmQgY2FuIGJlIGRlc3Ryb3llZCBhbmQgcmUtY3JlYXRlZCBhcyBuZWVkZWQuXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgICAgICAgIC8vIEF1dG8gZGVsZXRlIGZpbGVzIG9uIHN0YWNrL2J1Y2tldCBkZXN0cm95LlxyXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==