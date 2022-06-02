import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipelineActions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as pipelines from 'aws-cdk-lib/pipelines';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { Config } from '../config/config';

export interface IAppPipelineProps {
    stage: string;
    appName: string;
    hostingBucket: s3.IBucket;
    pipelinegBucket: s3.IBucket;
    gitHub: IAppPipelineGitHubProps;
    codebuildBuildSpecObject: object;
    buildEnvironment?: cdk.aws_codebuild.BuildEnvironment;
}

export interface IAppPipelineGitHubProps {
    owner: string;
    repo: string;
    // Must use secret value because GitHubSourceAction oauthToken is of type cdk.SecretValue.
    token: cdk.SecretValue;
}

export interface IEnvironmentPipeline {
    branch: string;
    pipeline: pipelines.CodePipeline;
}

export interface IAppPipelineOutputs {
    pipeline: cdk.aws_codepipeline.Pipeline;
}

export class AppPipeline extends Construct {
    public environmentPipelines: IEnvironmentPipeline[] = [];

    public outputs: IAppPipelineOutputs = {} as IAppPipelineOutputs;

    constructor(scope: Construct, id: string, props: IAppPipelineProps) {
        super(scope, id);

        const config = new Config(this.node);
        const stage = config.stage();
        const stageNamePascalCase = changeCase.pascalCase(stage);
        const appNamePascalCase = changeCase.pascalCase(props.appName);

        // Get branch.
        const stageValue = new Map(Object.entries(config.stages()!)).get(stage);
        if (!stageValue?.branch) throw Error(`Jompx: branch not found! Branch is missing from jompx.config.ts stage ${stage}.`);
        let branch = stageValue.branch;

        // If branch is regex.
        let branchRegex = '';
        if (branch.startsWith('(') && branch.endsWith(')')) {
            branchRegex = branch;
        }

        // Create pipeline.
        this.outputs.pipeline = new codepipeline.Pipeline(this, `AppCodePipeline${stageNamePascalCase}${appNamePascalCase}`, {
            pipelineName: `app-pipeline-${stage}-${props.appName}`
        });

        // Define pipeline sourceAction. If branch is regex then source is S3 else GitHub.
        let sourceAction: cdk.aws_codepipeline_actions.GitHubSourceAction | cdk.aws_codepipeline_actions.S3SourceAction;
        const sourceOutput = new codepipeline.Artifact();

        if (branchRegex) {

            const branchFileName = `branch-${props.appName}.zip`;

            // Create github source (sandbox feature branch).
            const gitHubBranchSource = codebuild
                .Source.gitHub({
                    owner: props.gitHub.owner,
                    repo: props.gitHub.repo,
                    fetchSubmodules: true, // For all Git sources, you can fetch submodules while cloing git repo.
                    webhook: true,
                    webhookFilters: [
                        codebuild.FilterGroup
                            .inEventOf(codebuild.EventAction.PUSH)
                            .andBranchIsNot('main') // For additional protection only.
                            .andBranchIs(`.*${branchRegex}.*`) // e.g. author-sandbox1-my-feature, test = author-test-my-feature
                    ]
                });

            // Create build project (to copy feature branch files to S3 on github push).
            const githubCodeBuildProject = new codebuild.Project(this, `GithubCodeBuildProject${stageNamePascalCase}${appNamePascalCase}`, {
                projectName: `copy-github-${stage}-${props.appName}-branch-to-s3`,
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: 0.2,
                    artifacts: {
                        files: '**/*'
                    }
                }),
                source: gitHubBranchSource,
                artifacts: codebuild.Artifacts.s3({
                    name: branchFileName,
                    bucket: props.pipelinegBucket,
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
                    props.pipelinegBucket.bucketArn,
                    `${props.pipelinegBucket.bucketArn}/*`
                ]
            }));

            // Create S3 source action.
            sourceAction = new codepipelineActions.S3SourceAction({
                actionName: `s3-source-action-${stage}-${props.appName}`,
                bucket: props.pipelinegBucket,
                bucketKey: branchFileName,
                output: sourceOutput
            });

        } else {

            // Create GitHub source action.
            sourceAction = new codepipelineActions.GitHubSourceAction({
                actionName: `github-source-action-${stage}-${props.appName}`,
                owner: props.gitHub.owner,
                repo: props.gitHub.repo,
                oauthToken: props.gitHub.token,
                output: sourceOutput,
                branch: branch
            });
        }

        // Pipeline Stage 1: Set pipeline source to GitHub (source action).
        this.outputs.pipeline.addStage({
            stageName: `pipeline-source-${stage}-${props.appName}`,
            actions: [sourceAction]
        });

        // Use prop if exists, else default to small.
        const buildEnvironment = props.buildEnvironment ?? {
            buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
            computeType: codebuild.ComputeType.SMALL
        };

        // Create code build pipeline (commands to build app code).
        const codebuildPipeline = new codebuild.PipelineProject(this, `CodeBuild${stageNamePascalCase}${appNamePascalCase}`, {
            projectName: `app-code-build-${props.appName}`,
            buildSpec: codebuild.BuildSpec.fromObject(props.codebuildBuildSpecObject),
            environment: buildEnvironment
        });

        // Code build pipeline requires permissions to perform operations on the app S3 bucket.
        // e.g. Sync files, copy files, delete files.
        codebuildPipeline.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
            resources: [
                props.hostingBucket.bucketArn,
                `${props.hostingBucket.bucketArn}/*`
            ]
        }));

        // Create code pipline build action (with GitHub source as input).
        const codeBuildAction = new codepipelineActions.CodeBuildAction({
            actionName: `code-build-action-${props.appName}`,
            input: sourceOutput,
            project: codebuildPipeline
        });

        // Set pipeline stage = build.
        // Pipeline Stage 2: Set action to build (app code).
        this.outputs.pipeline.addStage({
            stageName: `app-build-${props.appName}`,
            actions: [codeBuildAction]
        });

        // const waitForCdkStage = this.outputs.pipeline.addStage({
        //     stageName: 'waitForCdkStage',
        //     transitionToEnabled: false,
        //     transitionDisabledReason: 'Manual transition only'
        // });
    }
}
