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
        expect(branches).toEqual(['test-main', 'test-uat', 'test-test', 'test-sandbox1']);
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
        expect(branches).toEqual(['main', 'uat', 'test', 'sandbox1']);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BpcGVsaW5lL2Nkay1waXBlbGluZS1jb25zdHJ1Y3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyx1REFBa0Q7QUFDbEQsNkNBQTBDO0FBQzFDLDhEQUFvRTtBQUNwRSxxRUFBMEU7QUFFMUUsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUM5QixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcscUJBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxNQUFNLGdCQUFnQixHQUFzQjtZQUN4QyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNyQixNQUFNLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osNkRBQTZEO2dCQUM3RCxhQUFhLEVBQUUscUdBQXFHO2FBQ3ZIO1NBQ0osQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLElBQUksb0NBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFNUUsNkJBQTZCO1FBQzdCLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFFbEYsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcscUJBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxNQUFNLGdCQUFnQixHQUFzQjtZQUN4QyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNyQixNQUFNLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osNkRBQTZEO2dCQUM3RCxhQUFhLEVBQUUsRUFBRTthQUNwQjtTQUNKLENBQUM7UUFFRixNQUFNLFdBQVcsR0FBRyxJQUFJLG9DQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTVFLDZCQUE2QjtRQUM3QixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRTlELE1BQU0sUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLHFEQUFxRDtRQUNyRCxRQUFRLENBQUMsZUFBZSxDQUFDLDZCQUE2QixFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV6RSx1RkFBdUY7UUFDdkYsa0VBQWtFO1FBQ2xFLDhCQUE4QjtRQUM5QixtQ0FBbUM7UUFDbkMsTUFBTTtJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuaW1wb3J0IHsgQ29uZmlnIGFzIEpvbXB4Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL3Rlc3Qvam9tcHguY29uZmlnJztcclxuaW1wb3J0IHsgQ2RrUGlwZWxpbmUsIElDZGtQaXBlbGluZVByb3BzIH0gZnJvbSAnLi9jZGstcGlwZWxpbmUuY29uc3RydWN0JztcclxuXHJcbmRlc2NyaWJlKCdDZGtQaXBlbGluZVN0YWNrJywgKCkgPT4ge1xyXG4gICAgdGVzdCgnc3RhZ2U9dGVzdCBjcmVhdGVzIGNvZGUgcGlwZWxpbmVzJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgLi4uSm9tcHhDb25maWcsICdAam9tcHgtbG9jYWwnOiB7IHN0YWdlOiAndGVzdCcgfSB9IH0pO1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKGFwcC5ub2RlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2RrUGlwZWxpbmVQcm9wczogSUNka1BpcGVsaW5lUHJvcHMgPSB7XHJcbiAgICAgICAgICAgIHN0YWdlOiBjb25maWcuc3RhZ2UoKSxcclxuICAgICAgICAgICAgZ2l0SHViOiB7XHJcbiAgICAgICAgICAgICAgICBvd25lcjogJ293bmVyJyxcclxuICAgICAgICAgICAgICAgIHJlcG86ICdyZXBvJyxcclxuICAgICAgICAgICAgICAgIC8vIHRva2VuOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2NpY2QvZ2l0aHViL3Rva2VuJylcclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb25Bcm46ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOnVzLXdlc3QtMjo4NjMwNTQ5Mzc1NTU6Y29ubmVjdGlvbi8zOGU3MzllMy1lZDIxLTRkYmMtOThmOS1iOTdlNDA3NjRkNWInXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjZGtQaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZShzdGFjaywgJ0Nka1BpcGVsaW5lJywgY2RrUGlwZWxpbmVQcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRlc3QgYnJhbmNoIG5hbWVzIGNvcnJlY3QuXHJcbiAgICAgICAgY29uc3QgYnJhbmNoZXMgPSBjZGtQaXBlbGluZS5lbnZpcm9ubWVudFBpcGVsaW5lcy5tYXAobyA9PiBvLmJyYW5jaCk7XHJcbiAgICAgICAgZXhwZWN0KGJyYW5jaGVzKS50b0VxdWFsKFsndGVzdC1tYWluJywgJ3Rlc3QtdWF0JywgJ3Rlc3QtdGVzdCcsICd0ZXN0LXNhbmRib3gxJ10pO1xyXG5cclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XHJcbiAgICAgICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCBicmFuY2hlcy5sZW5ndGgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGVzdCgnc3RhZ2U9cHJvZCBjcmVhdGVzIGNvZGUgcGlwZWxpbmVzJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgLi4uSm9tcHhDb25maWcsICdAam9tcHgtbG9jYWwnOiB7IHN0YWdlOiAncHJvZCcgfSB9IH0pO1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKGFwcC5ub2RlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2RrUGlwZWxpbmVQcm9wczogSUNka1BpcGVsaW5lUHJvcHMgPSB7XHJcbiAgICAgICAgICAgIHN0YWdlOiBjb25maWcuc3RhZ2UoKSxcclxuICAgICAgICAgICAgZ2l0SHViOiB7XHJcbiAgICAgICAgICAgICAgICBvd25lcjogJ293bmVyJyxcclxuICAgICAgICAgICAgICAgIHJlcG86ICdyZXBvJyxcclxuICAgICAgICAgICAgICAgIC8vIHRva2VuOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2NpY2QvZ2l0aHViL3Rva2VuJylcclxuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb25Bcm46ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjZGtQaXBlbGluZSA9IG5ldyBDZGtQaXBlbGluZShzdGFjaywgJ0Nka1BpcGVsaW5lJywgY2RrUGlwZWxpbmVQcm9wcyk7XHJcblxyXG4gICAgICAgIC8vIFRlc3QgYnJhbmNoIG5hbWVzIGNvcnJlY3QuXHJcbiAgICAgICAgY29uc3QgYnJhbmNoZXMgPSBjZGtQaXBlbGluZS5lbnZpcm9ubWVudFBpcGVsaW5lcy5tYXAobyA9PiBvLmJyYW5jaCk7XHJcbiAgICAgICAgZXhwZWN0KGJyYW5jaGVzKS50b0VxdWFsKFsnbWFpbicsICd1YXQnLCAndGVzdCcsICdzYW5kYm94MSddKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZW1wbGF0ZScsIEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XHJcbiAgICAgICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCBicmFuY2hlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyBFeGFtcGxlIG9mIHRlc3RpbmcgcHJvcGVydGllczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS90ZXN0aW5nLmh0bWxcclxuICAgICAgICAvLyB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcclxuICAgICAgICAvLyAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcclxuICAgICAgICAvLyAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdSZXRhaW4nLFxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=