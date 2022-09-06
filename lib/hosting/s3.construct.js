"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostingS3 = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const constructs_1 = require("constructs");
class HostingS3 extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // const config = new Config(this.node);
        // const stage = config.stage();
        this.bucket = new s3.Bucket(this, 'HostingS3Bucket', {
            // Bucket name must be globally unique across all AWS accounts.
            // Bucket name must match app urls e.g. admin.mydomain.com, admin.sandbox1.mydomain.com
            bucketName: props.domainName,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hvc3RpbmcvczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6QywyQ0FBdUM7QUFPdkMsTUFBYSxTQUFVLFNBQVEsc0JBQVM7SUFJcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLHdDQUF3QztRQUN4QyxnQ0FBZ0M7UUFFaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ2pELCtEQUErRDtZQUMvRCx1RkFBdUY7WUFDdkYsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLCtCQUErQjtZQUMvQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGtDQUFrQztZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsMkdBQTJHO1lBQzNHLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsNkNBQTZDO1lBQzdDLGlCQUFpQixFQUFFLElBQUk7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7QUF4QkwsOEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbi8vIGltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSG9zdGluZ1MzUHJvcHMge1xyXG4gICAgZG9tYWluTmFtZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSG9zdGluZ1MzIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuXHJcbiAgICBwdWJsaWMgYnVja2V0OiBzMy5CdWNrZXQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElIb3N0aW5nUzNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICAvLyBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0hvc3RpbmdTM0J1Y2tldCcsIHtcclxuICAgICAgICAgICAgLy8gQnVja2V0IG5hbWUgbXVzdCBiZSBnbG9iYWxseSB1bmlxdWUgYWNyb3NzIGFsbCBBV1MgYWNjb3VudHMuXHJcbiAgICAgICAgICAgIC8vIEJ1Y2tldCBuYW1lIG11c3QgbWF0Y2ggYXBwIHVybHMgZS5nLiBhZG1pbi5teWRvbWFpbi5jb20sIGFkbWluLnNhbmRib3gxLm15ZG9tYWluLmNvbVxyXG4gICAgICAgICAgICBidWNrZXROYW1lOiBwcm9wcy5kb21haW5OYW1lLFxyXG4gICAgICAgICAgICAvLyBSZXF1aXJlZCBmb3IgcHVibGljIHdlYnNpdGUuXHJcbiAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIFNpbmdsZSBQYWdlIEFwcCAoU1BBKSBzZXR0aW5ncy5cclxuICAgICAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcclxuICAgICAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcclxuICAgICAgICAgICAgLy8gRGVzdHJveSBidWNrZXQgd2hlbiBzdGFjayBkZXN0cm95ZWQuIEJ1Y2tldCBpcyBkaXNwb3NhYmxlIGFuZCBjYW4gYmUgZGVzdHJveWVkIGFuZCByZS1jcmVhdGVkIGFzIG5lZWRlZC5cclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgICAgICAgLy8gQXV0byBkZWxldGUgZmlsZXMgb24gc3RhY2svYnVja2V0IGRlc3Ryb3kuXHJcbiAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19