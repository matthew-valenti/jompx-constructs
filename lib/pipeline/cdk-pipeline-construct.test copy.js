"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const config_1 = require("../config/config");
const jompx_config_1 = require("../config/test/jompx.config");
const cdk_pipeline_construct_1 = require("./cdk-pipeline.construct");
describe('CdkPipelineStack', () => {
    test('stage=test creates code pipelines', () => {
        const app = new cdk.App({ context: { ...jompx_config_1.Config, '@jompx-local': { stage: 'test' } } });
        const stack = new cdk.Stack(app);
        const config = new config_1.Config(app.node);
        const cdkPipelineProps = {
            stage: config.stage(),
            gitHub: {
                owner: 'owner',
                repo: 'repo',
                // token: cdk.SecretValue.secretsManager('cicd/github/token')
                connectionArn: 'arn:aws:codestar-connections:us-west-2:863054937555:connection/38e739e3-ed21-4dbc-98f9-b97e40764d5b'
            }
        };
        const cdkPipeline = new cdk_pipeline_construct_1.CdkPipeline(stack, 'CdkPipeline', cdkPipelineProps);
        // Test branch names correct.
        const branches = cdkPipeline.environmentPipelines.map(o => o.branch);
        expect(branches).toEqual(['test-main', 'test-uat', 'test-test', '-test-sandbox1-']);
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', branches.length);
    });
    test('stage=prod creates code pipelines', () => {
        const app = new cdk.App({ context: { ...jompx_config_1.Config, '@jompx-local': { stage: 'prod' } } });
        const stack = new cdk.Stack(app);
        const config = new config_1.Config(app.node);
        const cdkPipelineProps = {
            stage: config.stage(),
            gitHub: {
                owner: 'owner',
                repo: 'repo',
                // token: cdk.SecretValue.secretsManager('cicd/github/token')
                connectionArn: ''
            }
        };
        const cdkPipeline = new cdk_pipeline_construct_1.CdkPipeline(stack, 'CdkPipeline', cdkPipelineProps);
        // Test branch names correct.
        const branches = cdkPipeline.environmentPipelines.map(o => o.branch);
        expect(branches).toEqual(['main', 'uat', 'test', '-sandbox1-']);
        const template = assertions_1.Template.fromStack(stack);
        // console.log('template', JSON.stringify(template));
        template.resourceCountIs('AWS::CodePipeline::Pipeline', branches.length);
        // Example of testing properties: https://docs.aws.amazon.com/cdk/v2/guide/testing.html
        // template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
        //   DeletionPolicy: 'Retain',
        //   UpdateReplacePolicy: 'Retain',
        // });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0IGNvcHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGlwZWxpbmUvY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0IGNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQWtEO0FBQ2xELDZDQUEwQztBQUMxQyw4REFBb0U7QUFDcEUscUVBQTBFO0FBRTFFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLHFCQUFXLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEMsTUFBTSxnQkFBZ0IsR0FBc0I7WUFDeEMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDckIsTUFBTSxFQUFFO2dCQUNKLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxNQUFNO2dCQUNaLDZEQUE2RDtnQkFDN0QsYUFBYSxFQUFFLHFHQUFxRzthQUN2SDtTQUNKLENBQUM7UUFFRixNQUFNLFdBQVcsR0FBRyxJQUFJLG9DQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTVFLDZCQUE2QjtRQUM3QixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFcEYsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcscUJBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxNQUFNLGdCQUFnQixHQUFzQjtZQUN4QyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNyQixNQUFNLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osNkRBQTZEO2dCQUM3RCxhQUFhLEVBQUUsRUFBRTthQUNwQjtTQUNKLENBQUM7UUFFRixNQUFNLFdBQVcsR0FBRyxJQUFJLG9DQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTVFLDZCQUE2QjtRQUM3QixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRWhFLE1BQU0sUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLHFEQUFxRDtRQUNyRCxRQUFRLENBQUMsZUFBZSxDQUFDLDZCQUE2QixFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV6RSx1RkFBdUY7UUFDdkYsa0VBQWtFO1FBQ2xFLDhCQUE4QjtRQUM5QixtQ0FBbUM7UUFDbkMsTUFBTTtJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuaW1wb3J0IHsgQ29uZmlnIGFzIEpvbXB4Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL3Rlc3Qvam9tcHguY29uZmlnJztcclxuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIElDZGtQaXBlbGluZVByb3BzIH0gZnJvbSAnLi9jZGstcGlwZWxpbmUuY29uc3RydWN0JztcclxuXHJcbmRlc2NyaWJlKCdDZGtQaXBlbGluZVN0YWNrJywgKCkgPT4ge1xyXG4gICAgdGVzdCgnc3RhZ2U9dGVzdCBjcmVhdGVzIGNvZGUgcGlwZWxpbmVzJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgLi4uSm9tcHhDb25maWcsICdAam9tcHgtbG9jYWwnOiB7IHN0YWdlOiAndGVzdCcgfSB9IH0pO1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKGFwcC5ub2RlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2RrUGlwZWxpbmVQcm9wczogSUNka1BpcGVsaW5lUHJvcHMgPSB7XHJcbiAgICAgICAgICAgIHN0YWdlOiBjb25maWcuc3RhZ2UoKSxcclxuICAgICAgICAgICAgZ2l0SHViOiB7XHJcbiAgICAgICAgICAgICAgICBvd25lcjogJ293bmVyJyxcclxuICAgICAgICAgICAgICAgIHJlcG86ICdyZXBvJyxcclxuICAgICAgICAgICAgICAgIC8vIHRva2VuOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2NpY2QvZ2l0aHViL3Rva2VuJylcclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb25Bcm46ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOnVzLXdlc3QtMjo4NjMwNTQ5Mzc1NTU6Y29ubmVjdGlvbi8zOGU3MzllMy1lZDIxLTRkYmMtOThmOS1iOTdlNDA3NjRkNWInXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjZGtQaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZShzdGFjaywgJ0Nka1BpcGVsaW5lJywgY2RrUGlwZWxpbmVQcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRlc3QgYnJhbmNoIG5hbWVzIGNvcnJlY3QuXHJcbiAgICAgICAgY29uc3QgYnJhbmNoZXMgPSBjZGtQaXBlbGluZS5lbnZpcm9ubWVudFBpcGVsaW5lcy5tYXAobyA9PiBvLmJyYW5jaCk7XHJcbiAgICAgICAgZXhwZWN0KGJyYW5jaGVzKS50b0VxdWFsKFsndGVzdC1tYWluJywgJ3Rlc3QtdWF0JywgJ3Rlc3QtdGVzdCcsICctdGVzdC1zYW5kYm94MS0nXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcclxuICAgICAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIGJyYW5jaGVzLmxlbmd0aCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0ZXN0KCdzdGFnZT1wcm9kIGNyZWF0ZXMgY29kZSBwaXBlbGluZXMnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyAuLi5Kb21weENvbmZpZywgJ0Bqb21weC1sb2NhbCc6IHsgc3RhZ2U6ICdwcm9kJyB9IH0gfSk7XHJcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcoYXBwLm5vZGUpO1xyXG5cclxuICAgICAgICBjb25zdCBjZGtQaXBlbGluZVByb3BzOiBJQ2RrUGlwZWxpbmVQcm9wcyA9IHtcclxuICAgICAgICAgICAgc3RhZ2U6IGNvbmZpZy5zdGFnZSgpLFxyXG4gICAgICAgICAgICBnaXRIdWI6IHtcclxuICAgICAgICAgICAgICAgIG93bmVyOiAnb3duZXInLFxyXG4gICAgICAgICAgICAgICAgcmVwbzogJ3JlcG8nLFxyXG4gICAgICAgICAgICAgICAgLy8gdG9rZW46IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignY2ljZC9naXRodWIvdG9rZW4nKVxyXG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbkFybjogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNka1BpcGVsaW5lID0gbmV3IENka1BpcGVsaW5lKHN0YWNrLCAnQ2RrUGlwZWxpbmUnLCBjZGtQaXBlbGluZVByb3BzKTtcclxuXHJcbiAgICAgICAgLy8gVGVzdCBicmFuY2ggbmFtZXMgY29ycmVjdC5cclxuICAgICAgICBjb25zdCBicmFuY2hlcyA9IGNka1BpcGVsaW5lLmVudmlyb25tZW50UGlwZWxpbmVzLm1hcChvID0+IG8uYnJhbmNoKTtcclxuICAgICAgICBleHBlY3QoYnJhbmNoZXMpLnRvRXF1YWwoWydtYWluJywgJ3VhdCcsICd0ZXN0JywgJy1zYW5kYm94MS0nXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygndGVtcGxhdGUnLCBKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSkpO1xyXG4gICAgICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgYnJhbmNoZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgLy8gRXhhbXBsZSBvZiB0ZXN0aW5nIHByb3BlcnRpZXM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvdGVzdGluZy5odG1sXHJcbiAgICAgICAgLy8gdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XHJcbiAgICAgICAgLy8gICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXHJcbiAgICAgICAgLy8gICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcclxuICAgICAgICAvLyB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuIl19