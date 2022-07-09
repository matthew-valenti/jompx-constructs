"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostingS3 = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hvc3RpbmcvczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMsMkNBQXVDO0FBT3ZDLE1BQWEsU0FBVSxTQUFRLHNCQUFTO0lBSXBDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQix3Q0FBd0M7UUFDeEMsZ0NBQWdDO1FBRWhDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNqRCwrREFBK0Q7WUFDL0QsdUZBQXVGO1lBQ3ZGLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QiwrQkFBK0I7WUFDL0IsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixrQ0FBa0M7WUFDbEMsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLDJHQUEyRztZQUMzRyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLDZDQUE2QztZQUM3QyxpQkFBaUIsRUFBRSxJQUFJO1NBQzFCLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXpCRCw4QkF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuLy8gaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElIb3N0aW5nUzNQcm9wcyB7XHJcbiAgICBkb21haW5OYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIb3N0aW5nUzMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG5cclxuICAgIHB1YmxpYyBidWNrZXQ6IHMzLkJ1Y2tldDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUhvc3RpbmdTM1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgY29uZmlnID0gbmV3IENvbmZpZyh0aGlzLm5vZGUpO1xyXG4gICAgICAgIC8vIGNvbnN0IHN0YWdlID0gY29uZmlnLnN0YWdlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnSG9zdGluZ1MzQnVja2V0Jywge1xyXG4gICAgICAgICAgICAvLyBCdWNrZXQgbmFtZSBtdXN0IGJlIGdsb2JhbGx5IHVuaXF1ZSBhY3Jvc3MgYWxsIEFXUyBhY2NvdW50cy5cclxuICAgICAgICAgICAgLy8gQnVja2V0IG5hbWUgbXVzdCBtYXRjaCBhcHAgdXJscyBlLmcuIGFkbWluLm15ZG9tYWluLmNvbSwgYWRtaW4uc2FuZGJveDEubXlkb21haW4uY29tXHJcbiAgICAgICAgICAgIGJ1Y2tldE5hbWU6IHByb3BzLmRvbWFpbk5hbWUsXHJcbiAgICAgICAgICAgIC8vIFJlcXVpcmVkIGZvciBwdWJsaWMgd2Vic2l0ZS5cclxuICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gU2luZ2xlIFBhZ2UgQXBwIChTUEEpIHNldHRpbmdzLlxyXG4gICAgICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICAvLyBEZXN0cm95IGJ1Y2tldCB3aGVuIHN0YWNrIGRlc3Ryb3llZC4gQnVja2V0IGlzIGRpc3Bvc2FibGUgYW5kIGNhbiBiZSBkZXN0cm95ZWQgYW5kIHJlLWNyZWF0ZWQgYXMgbmVlZGVkLlxyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgICAgICAgICAvLyBBdXRvIGRlbGV0ZSBmaWxlcyBvbiBzdGFjay9idWNrZXQgZGVzdHJveS5cclxuICAgICAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=