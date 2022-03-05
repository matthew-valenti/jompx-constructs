import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
// import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
// import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as pipelines from 'aws-cdk-lib/pipelines';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { Config } from '../classes/config';
import { IEnvironment } from '../types/config.interface';

/**
 * Important: Sandbox account name must end in a number e.g. sandbox1. TODO: How else can we associate a branch with an account?
 */

export interface ICdkPipelineBranchProps {
    environmentNameSubstring: string;
    gitHubOwner: string;
    gitHubRepo: string;
}

export interface IEnvironmentPipeline {
    environment: IEnvironment;
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
export class CdkPipelineBranch extends Construct {
    public  environmentPipelines: IEnvironmentPipeline[] = [];
    constructor(scope: Construct, id: string, props: ICdkPipelineBranchProps) {
        super(scope, id);

        const jompxConfig = new Config(this.node);

        // Create bucket to save github feature branch files (as zip).
        const bucketName = `${jompxConfig.organizationName()}-cdk-branch`;
        const gitHubBranchBucket = new s3.Bucket(this, `${jompxConfig.organizationNamePascalCase()}CdkBranch`, {
            bucketName,
            versioned: true, // Version bucket to use as CodePipeline source.
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Destroy bucket on stack delete.
            autoDeleteObjects: true // Delete all bucket objects on destory.
        });

        // Create a pipeline for each sandbox environment.
        // TODO: Get branch name. Use one pipeline for all feature branches.
        jompxConfig.environments()?.filter(environment => environment.name.includes(props.environmentNameSubstring)).forEach((environment) => {

            const branchFileName = `branch-${environment.name}.zip`;
            const environmentNamePascalCase = changeCase.pascalCase(environment.name);

            let branchSubstring = environment.name;
            if (jompxConfig.stage() !== 'prod') {
                branchSubstring = `${jompxConfig.stage()}-${branchSubstring}`;
            }

            // Create github source (feature branch).
            const gitHubBranchSource = codebuild
                .Source.gitHub({
                    owner: props.gitHubOwner,
                    repo: props.gitHubRepo,
                    webhook: true,
                    webhookFilters: [
                        codebuild.FilterGroup
                            .inEventOf(codebuild.EventAction.PUSH)
                            .andBranchIsNot('main') // For additional protection only.
                            .andBranchIs(`(-${branchSubstring}-)`) // e.g. prod = mv-sandbox1-my-feature, test = mv-test-sandbox-my-feature
                    ]
                });

            // Create build project (to copy feature branch files to S3 on github push).
            const githubCodeBuildProject = new codebuild.Project(this, `GithubCodeBuildProject${environmentNamePascalCase}`, {
                projectName: `copy-github-branch-${environment.name}-to-s3`,
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: 0.2,
                    artifacts: {
                        files: '**/*'
                    }
                }),
                source: gitHubBranchSource,
                artifacts: codebuild.Artifacts.s3({
                    name: branchFileName,
                    bucket: gitHubBranchBucket,
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
                    gitHubBranchBucket.bucketArn,
                    `${gitHubBranchBucket.bucketArn}/*`
                ]
            }));

            // Create pipeline (to deploy CDK GitHub branch files on S3 to an AWS account).
            // const pipelineId = camelCase(`Pipeline${props.infixBranchName}${i}`, { pascalCase: true });
            // const pipeline = new codepipeline.Pipeline(this, pipelineId, {
            //     pipelineName: `github-branch-pipeline-${environment.name}`
            // });

            // Create S3 source action (GitHub files in S3).
            // const sourceOutput = new codepipeline.Artifact();
            // const sourceAction = new codepipeline_actions.S3SourceAction({
            //     actionName: `s3-source-${environment.name}`,
            //     bucket: gitHubBranchBucket,
            //     bucketKey: branchFileName,
            //     output: sourceOutput
            // });

            const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${environmentNamePascalCase}`, {
                pipelineName: `cdk-pipeline-${environment.name}`,
                crossAccountKeys: true, // Required for cross account deploys.
                synth: new pipelines.ShellStep('Synth', {
                    env: {
                        STAGE: environment.name
                    },
                    input: pipelines.CodePipelineSource.s3(gitHubBranchBucket, branchFileName),
                    commands: ['npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk --args="--context stage=$STAGE"'], // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
                    primaryOutputDirectory: 'apps/cdk/cdk.out'
                })
            });

            this.environmentPipelines.push({ environment, pipeline });
        });
    }
}