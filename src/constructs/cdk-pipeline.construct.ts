import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as pipelines from 'aws-cdk-lib/pipelines';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { Config } from '../classes/config';

export interface ICdkPipelineProps {
    stage: string;
    gitHub: ICdkPipelineGitHubProps;
    commands?: string[];
}

export interface ICdkPipelineGitHubProps {
    owner: string;
    repo: string;
    token: cdk.SecretValue;
}

export interface IEnvironmentPipeline {
    branch: string;
    pipeline: pipelines.CodePipeline;
}

/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 * Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 * CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
 * Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
 * nx cicd: https://nx.dev/ci/monorepo-ci-circle-ci
 *
 * Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit
 */
export class CdkPipeline extends Construct {
    public environmentPipelines: IEnvironmentPipeline[] = [];

    constructor(scope: Construct, id: string, props: ICdkPipelineProps) {
        super(scope, id);

        const config = new Config(this.node);
        const commands = ['ls apps/cdk', 'npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk --args="--quiet --context stage=$STAGE"', 'ls apps/cdk/', 'ls apps/cdk/cdk.out/']; // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
        const primaryOutputDirectory = 'apps/cdk/cdk.out';

        const stages = new Map(Object.entries(config.stages()!));
        const branchStages = new Map([...stages].filter(([_, v]) => v.branch && !v.branch.startsWith(')') && !v.branch.endsWith(')')));
        const branchRegexStages = new Map([...stages].filter(([_, v]) => v.branch && v.branch.startsWith('(') && v.branch.endsWith(')')));

        // For static branches e.g. main, test
        for (const stage of branchStages.values()) {

            const branch = (props.stage === 'prod') ? stage.branch : `${props.stage}-${stage.branch}`;

            // create a standard cdk pipeline for static branches. Performance is better (no S3 file copy required).
            const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${changeCase.pascalCase(branch)}`, {
                pipelineName: `cdk-pipeline-${branch}`,
                crossAccountKeys: true, // Required for cross account deploys.
                synth: new pipelines.ShellStep('Synth', {
                    env: {
                        STAGE: `${props.stage}`
                    },
                    input: pipelines.CodePipelineSource.gitHub(
                        `${props.gitHub.owner}/${props.gitHub.repo}`,
                        branch,
                        { authentication: props.gitHub.token }
                    ),
                    commands: props.commands ?? commands,
                    primaryOutputDirectory
                })
            });

            this.environmentPipelines.push({ branch, pipeline });
        }

        if (branchRegexStages.size) {
            // Create bucket to save github sandbox feature branch files (as zip).
            // const bucketName = `${config.organizationName()}-cdk-pipeline-${account}`; // Must be unique across all buckets.
            const bucket = new s3.Bucket(this, `${config.organizationNamePascalCase()}CdkPipelineBranch`, {
                // bucketName,
                versioned: true, // Version bucket to use as CodePipeline source.
                publicReadAccess: false, // TODO: Is this needed?
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                enforceSSL: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY, // Destroy bucket on stack delete.
                autoDeleteObjects: true // Delete all bucket objects on destory.
            });

            for (const [stageName, stage] of branchRegexStages.entries()) {

                const branchFileName = `branch-${stageName}.zip`;
                const stageNamePascalCase = changeCase.pascalCase(stageName);

                const branchRegex = (props.stage === 'prod') ? stage.branch : [stage.branch.slice(0, 1), `-${props.stage}`, stage.branch.slice(1)].join(''); // e.g. main, (-test-main-)
                console.log('branchRegex', branchRegex);

                // Create github source (sandbox feature branch).
                const gitHubBranchSource = codebuild
                    .Source.gitHub({
                        owner: props.gitHub.owner,
                        repo: props.gitHub.repo,
                        fetchSubmodules: true,
                        webhook: true,
                        webhookFilters: [
                            codebuild.FilterGroup
                                .inEventOf(codebuild.EventAction.PUSH)
                                .andBranchIsNot('main') // For additional protection only.
                                .andBranchIs(`.*${branchRegex}.*`) // e.g. prod = mv-sandbox1-my-feature, test = mv-test-sandbox1-my-feature
                        ]
                    });

                // Create build project (to copy feature branch files to S3 on github push).
                const githubCodeBuildProject = new codebuild.Project(this, `GithubCodeBuildProject${stageNamePascalCase}`, {
                    projectName: `copy-github-${stageName}-branch-to-s3`,
                    buildSpec: codebuild.BuildSpec.fromObject({
                        version: 0.2,
                        artifacts: {
                            files: '**/*'
                        }
                    }),
                    source: gitHubBranchSource,
                    artifacts: codebuild.Artifacts.s3({
                        name: branchFileName,
                        bucket,
                        includeBuildId: false,
                        packageZip: true,
                        identifier: 'GithubArtifact'
                    })
                });
                // CodeBuild project requires permissions to S3 bucket objects.
                githubCodeBuildProject.addToRolePolicy(new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
                    resources: [
                        bucket.bucketArn,
                        `${bucket.bucketArn}/*`
                    ]
                }));

                const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${stageNamePascalCase}`, {
                    pipelineName: `cdk-pipeline-${stageName}`,
                    crossAccountKeys: true, // Required for cross account deploys.
                    synth: new pipelines.ShellStep('Synth', {
                        env: {
                            STAGE: stageName
                        },
                        input: pipelines.CodePipelineSource.s3(bucket, branchFileName),
                        commands: props.commands ?? commands,
                        primaryOutputDirectory
                    })
                });

                const branch = branchRegex.slice(1, -1); // Remove parenthesis first and last char.
                this.environmentPipelines.push({ branch, pipeline });
            }
        }
    }
}
