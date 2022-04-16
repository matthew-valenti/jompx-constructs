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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BpcGVsaW5lL2Nkay1waXBlbGluZS1jb25zdHJ1Y3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyx1REFBa0Q7QUFDbEQsNkNBQTBDO0FBQzFDLDhEQUFvRTtBQUNwRSxxRUFBMEU7QUFFMUUsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUM5QixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcscUJBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxNQUFNLGdCQUFnQixHQUFzQjtZQUN4QyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNyQixNQUFNLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osNkRBQTZEO2dCQUM3RCxhQUFhLEVBQUUscUdBQXFHO2FBQ3ZIO1NBQ0osQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLElBQUksb0NBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFNUUsNkJBQTZCO1FBQzdCLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUVwRixNQUFNLFFBQVEsR0FBRyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxRQUFRLENBQUMsZUFBZSxDQUFDLDZCQUE2QixFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxxQkFBVyxFQUFFLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM1RixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLE1BQU0sZ0JBQWdCLEdBQXNCO1lBQ3hDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ3JCLE1BQU0sRUFBRTtnQkFDSixLQUFLLEVBQUUsT0FBTztnQkFDZCxJQUFJLEVBQUUsTUFBTTtnQkFDWiw2REFBNkQ7Z0JBQzdELGFBQWEsRUFBRSxFQUFFO2FBQ3BCO1NBQ0osQ0FBQztRQUVGLE1BQU0sV0FBVyxHQUFHLElBQUksb0NBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFNUUsNkJBQTZCO1FBQzdCLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFFaEUsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MscURBQXFEO1FBQ3JELFFBQVEsQ0FBQyxlQUFlLENBQUMsNkJBQTZCLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXpFLHVGQUF1RjtRQUN2RixrRUFBa0U7UUFDbEUsOEJBQThCO1FBQzlCLG1DQUFtQztRQUNuQyxNQUFNO0lBQ1YsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5pbXBvcnQgeyBDb25maWcgYXMgSm9tcHhDb25maWcgfSBmcm9tICcuLi9jb25maWcvdGVzdC9qb21weC5jb25maWcnO1xyXG5pbXBvcnQgeyBDZGtQaXBlbGluZSwgSUNka1BpcGVsaW5lUHJvcHMgfSBmcm9tICcuL2Nkay1waXBlbGluZS5jb25zdHJ1Y3QnO1xyXG5cclxuZGVzY3JpYmUoJ0Nka1BpcGVsaW5lU3RhY2snLCAoKSA9PiB7XHJcbiAgICB0ZXN0KCdzdGFnZT10ZXN0IGNyZWF0ZXMgY29kZSBwaXBlbGluZXMnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyAuLi5Kb21weENvbmZpZywgJ0Bqb21weC1sb2NhbCc6IHsgc3RhZ2U6ICd0ZXN0JyB9IH0gfSk7XHJcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcoYXBwLm5vZGUpO1xyXG5cclxuICAgICAgICBjb25zdCBjZGtQaXBlbGluZVByb3BzOiBJQ2RrUGlwZWxpbmVQcm9wcyA9IHtcclxuICAgICAgICAgICAgc3RhZ2U6IGNvbmZpZy5zdGFnZSgpLFxyXG4gICAgICAgICAgICBnaXRIdWI6IHtcclxuICAgICAgICAgICAgICAgIG93bmVyOiAnb3duZXInLFxyXG4gICAgICAgICAgICAgICAgcmVwbzogJ3JlcG8nLFxyXG4gICAgICAgICAgICAgICAgLy8gdG9rZW46IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignY2ljZC9naXRodWIvdG9rZW4nKVxyXG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6dXMtd2VzdC0yOjg2MzA1NDkzNzU1NTpjb25uZWN0aW9uLzM4ZTczOWUzLWVkMjEtNGRiYy05OGY5LWI5N2U0MDc2NGQ1YidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNka1BpcGVsaW5lID0gbmV3IENka1BpcGVsaW5lKHN0YWNrLCAnQ2RrUGlwZWxpbmUnLCBjZGtQaXBlbGluZVByb3BzKTtcclxuXHJcbiAgICAgICAgLy8gVGVzdCBicmFuY2ggbmFtZXMgY29ycmVjdC5cclxuICAgICAgICBjb25zdCBicmFuY2hlcyA9IGNka1BpcGVsaW5lLmVudmlyb25tZW50UGlwZWxpbmVzLm1hcChvID0+IG8uYnJhbmNoKTtcclxuICAgICAgICBleHBlY3QoYnJhbmNoZXMpLnRvRXF1YWwoWyd0ZXN0LW1haW4nLCAndGVzdC11YXQnLCAndGVzdC10ZXN0JywgJy10ZXN0LXNhbmRib3gxLSddKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xyXG4gICAgICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgYnJhbmNoZXMubGVuZ3RoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRlc3QoJ3N0YWdlPXByb2QgY3JlYXRlcyBjb2RlIHBpcGVsaW5lcycsICgpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IC4uLkpvbXB4Q29uZmlnLCAnQGpvbXB4LWxvY2FsJzogeyBzdGFnZTogJ3Byb2QnIH0gfSB9KTtcclxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZyhhcHAubm9kZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNka1BpcGVsaW5lUHJvcHM6IElDZGtQaXBlbGluZVByb3BzID0ge1xyXG4gICAgICAgICAgICBzdGFnZTogY29uZmlnLnN0YWdlKCksXHJcbiAgICAgICAgICAgIGdpdEh1Yjoge1xyXG4gICAgICAgICAgICAgICAgb3duZXI6ICdvd25lcicsXHJcbiAgICAgICAgICAgICAgICByZXBvOiAncmVwbycsXHJcbiAgICAgICAgICAgICAgICAvLyB0b2tlbjogY2RrLlNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdjaWNkL2dpdGh1Yi90b2tlbicpXHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uQXJuOiAnJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgY2RrUGlwZWxpbmUgPSBuZXcgQ2RrUGlwZWxpbmUoc3RhY2ssICdDZGtQaXBlbGluZScsIGNka1BpcGVsaW5lUHJvcHMpO1xyXG5cclxuICAgICAgICAvLyBUZXN0IGJyYW5jaCBuYW1lcyBjb3JyZWN0LlxyXG4gICAgICAgIGNvbnN0IGJyYW5jaGVzID0gY2RrUGlwZWxpbmUuZW52aXJvbm1lbnRQaXBlbGluZXMubWFwKG8gPT4gby5icmFuY2gpO1xyXG4gICAgICAgIGV4cGVjdChicmFuY2hlcykudG9FcXVhbChbJ21haW4nLCAndWF0JywgJ3Rlc3QnLCAnLXNhbmRib3gxLSddKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZW1wbGF0ZScsIEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XHJcbiAgICAgICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCBicmFuY2hlcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAvLyBFeGFtcGxlIG9mIHRlc3RpbmcgcHJvcGVydGllczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS90ZXN0aW5nLmh0bWxcclxuICAgICAgICAvLyB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcclxuICAgICAgICAvLyAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcclxuICAgICAgICAvLyAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdSZXRhaW4nLFxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=