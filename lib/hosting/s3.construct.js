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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hvc3RpbmcvczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsNkNBQTBDO0FBWTFDLE1BQWEsU0FBVSxTQUFRLHNCQUFTO0lBSXBDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUhkLFlBQU8sR0FBc0IsRUFBdUIsQ0FBQztRQUt4RCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTdCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO1lBQzlGLCtEQUErRDtZQUMvRCx1RkFBdUY7WUFDdkYsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUMzRCwrQkFBK0I7WUFDL0IsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixrQ0FBa0M7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLDJHQUEyRztZQUMzRyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLDZDQUE2QztZQUM3QyxpQkFBaUIsRUFBRSxJQUFJO1NBQzFCLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXpCRCw4QkF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcblxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSG9zdGluZ1MzUHJvcHMge1xyXG4gICAgZG9tYWluTmFtZTogc3RyaW5nO1xyXG4gICAgYXBwTmFtZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElIb3N0aW5nUzNPdXRwdXRzIHtcclxuICAgIGJ1Y2tldDogczMuQnVja2V0O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSG9zdGluZ1MzIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuXHJcbiAgICBwdWJsaWMgb3V0cHV0czogSUhvc3RpbmdTM091dHB1dHMgPSB7fSBhcyBJSG9zdGluZ1MzT3V0cHV0cztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUhvc3RpbmdTM1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZyh0aGlzLm5vZGUpO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlID0gY29uZmlnLnN0YWdlKCk7XHJcblxyXG4gICAgICAgIHRoaXMub3V0cHV0cy5idWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShwcm9wcy5hcHBOYW1lKX1Ib3N0aW5nQnVja2V0YCwge1xyXG4gICAgICAgICAgICAvLyBCdWNrZXQgbmFtZSBtdXN0IGJlIGdsb2JhbGx5IHVuaXF1ZSBhY3Jvc3MgYWxsIEFXUyBhY2NvdW50cy5cclxuICAgICAgICAgICAgLy8gQnVja2V0IG5hbWUgbXVzdCBtYXRjaCBhcHAgdXJscyBlLmcuIGFkbWluLm15ZG9tYWluLmNvbSwgYWRtaW4uc2FuZGJveDEubXlkb21haW4uY29tXHJcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IGAke3Byb3BzLmFwcE5hbWV9LiR7c3RhZ2V9LiR7cHJvcHMuZG9tYWluTmFtZX1gLFxyXG4gICAgICAgICAgICAvLyBSZXF1aXJlZCBmb3IgcHVibGljIHdlYnNpdGUuXHJcbiAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIFNpbmdsZSBQYWdlIEFwcCAoU1BBKSBzZXR0aW5ncy5cclxuICAgICAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcclxuICAgICAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcclxuICAgICAgICAgICAgLy8gRGVzdHJveSBidWNrZXQgd2hlbiBzdGFjayBkZXN0cm95ZWQuIEJ1Y2tldCBpcyBkaXNwb3NhYmxlIGFuZCBjYW4gYmUgZGVzdHJveWVkIGFuZCByZS1jcmVhdGVkIGFzIG5lZWRlZC5cclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgICAgICAgLy8gQXV0byBkZWxldGUgZmlsZXMgb24gc3RhY2svYnVja2V0IGRlc3Ryb3kuXHJcbiAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19