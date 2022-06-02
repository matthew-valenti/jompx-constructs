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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuY29uc3RydWN0IGNvcHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGlwZWxpbmUvczMuY29uc3RydWN0IGNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6Qyw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUFZMUMsTUFBYSxTQUFVLFNBQVEsc0JBQVM7SUFJcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSGQsWUFBTyxHQUFzQixFQUF1QixDQUFDO1FBS3hELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUU7WUFDOUYsK0RBQStEO1lBQy9ELHVGQUF1RjtZQUN2RixVQUFVLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQzNELCtCQUErQjtZQUMvQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGtDQUFrQztZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsMkdBQTJHO1lBQzNHLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsNkNBQTZDO1lBQzdDLGlCQUFpQixFQUFFLElBQUk7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBekJELDhCQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElIb3N0aW5nUzNQcm9wcyB7XHJcbiAgICBkb21haW5OYW1lOiBzdHJpbmc7XHJcbiAgICBhcHBOYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUhvc3RpbmdTM091dHB1dHMge1xyXG4gICAgYnVja2V0OiBzMy5CdWNrZXQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIb3N0aW5nUzMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG5cclxuICAgIHB1YmxpYyBvdXRwdXRzOiBJSG9zdGluZ1MzT3V0cHV0cyA9IHt9IGFzIElIb3N0aW5nUzNPdXRwdXRzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJSG9zdGluZ1MzUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSBjb25maWcuc3RhZ2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vdXRwdXRzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHByb3BzLmFwcE5hbWUpfUhvc3RpbmdCdWNrZXRgLCB7XHJcbiAgICAgICAgICAgIC8vIEJ1Y2tldCBuYW1lIG11c3QgYmUgZ2xvYmFsbHkgdW5pcXVlIGFjcm9zcyBhbGwgQVdTIGFjY291bnRzLlxyXG4gICAgICAgICAgICAvLyBCdWNrZXQgbmFtZSBtdXN0IG1hdGNoIGFwcCB1cmxzIGUuZy4gYWRtaW4ubXlkb21haW4uY29tLCBhZG1pbi5zYW5kYm94MS5teWRvbWFpbi5jb21cclxuICAgICAgICAgICAgYnVja2V0TmFtZTogYCR7cHJvcHMuYXBwTmFtZX0uJHtzdGFnZX0uJHtwcm9wcy5kb21haW5OYW1lfWAsXHJcbiAgICAgICAgICAgIC8vIFJlcXVpcmVkIGZvciBwdWJsaWMgd2Vic2l0ZS5cclxuICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogdHJ1ZSxcclxuICAgICAgICAgICAgLy8gU2luZ2xlIFBhZ2UgQXBwIChTUEEpIHNldHRpbmdzLlxyXG4gICAgICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICAvLyBEZXN0cm95IGJ1Y2tldCB3aGVuIHN0YWNrIGRlc3Ryb3llZC4gQnVja2V0IGlzIGRpc3Bvc2FibGUgYW5kIGNhbiBiZSBkZXN0cm95ZWQgYW5kIHJlLWNyZWF0ZWQgYXMgbmVlZGVkLlxyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgICAgICAgICAvLyBBdXRvIGRlbGV0ZSBmaWxlcyBvbiBzdGFjay9idWNrZXQgZGVzdHJveS5cclxuICAgICAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=