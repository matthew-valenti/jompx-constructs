# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### AppPipeline <a name="AppPipeline" id="@jompx/constructs.AppPipeline"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.AppPipeline.Initializer"></a>

```typescript
import { AppPipeline } from '@jompx/constructs'

new AppPipeline(scope: Construct, id: string, props: IAppPipelineProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppPipeline.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppPipeline.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppPipeline.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IAppPipelineProps">IAppPipelineProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.AppPipeline.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.AppPipeline.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.AppPipeline.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IAppPipelineProps">IAppPipelineProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppPipeline.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.AppPipeline.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppPipeline.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.AppPipeline.isConstruct"></a>

```typescript
import { AppPipeline } from '@jompx/constructs'

AppPipeline.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.AppPipeline.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppPipeline.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.AppPipeline.property.environmentPipelines">environmentPipelines</a></code> | <code><a href="#@jompx/constructs.IEnvironmentPipeline">IEnvironmentPipeline</a>[]</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppPipeline.property.pipeline">pipeline</a></code> | <code>aws-cdk-lib.aws_codepipeline.Pipeline</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.AppPipeline.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `environmentPipelines`<sup>Required</sup> <a name="environmentPipelines" id="@jompx/constructs.AppPipeline.property.environmentPipelines"></a>

```typescript
public readonly environmentPipelines: IEnvironmentPipeline[];
```

- *Type:* <a href="#@jompx/constructs.IEnvironmentPipeline">IEnvironmentPipeline</a>[]

---

##### `pipeline`<sup>Optional</sup> <a name="pipeline" id="@jompx/constructs.AppPipeline.property.pipeline"></a>

```typescript
public readonly pipeline: Pipeline;
```

- *Type:* aws-cdk-lib.aws_codepipeline.Pipeline

---


### AppPipelineS3 <a name="AppPipelineS3" id="@jompx/constructs.AppPipelineS3"></a>

S3 bucket required to temporaryily store GitHub branch files (for app pipeline).

#### Initializers <a name="Initializers" id="@jompx/constructs.AppPipelineS3.Initializer"></a>

```typescript
import { AppPipelineS3 } from '@jompx/constructs'

new AppPipelineS3(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppPipelineS3.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppPipelineS3.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.AppPipelineS3.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.AppPipelineS3.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppPipelineS3.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.AppPipelineS3.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppPipelineS3.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.AppPipelineS3.isConstruct"></a>

```typescript
import { AppPipelineS3 } from '@jompx/constructs'

AppPipelineS3.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.AppPipelineS3.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppPipelineS3.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.AppPipelineS3.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.AppPipelineS3.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@jompx/constructs.AppPipelineS3.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

---


### AppSync <a name="AppSync" id="@jompx/constructs.AppSync"></a>

AWS AppSync (serverless GraphQL).

#### Initializers <a name="Initializers" id="@jompx/constructs.AppSync.Initializer"></a>

```typescript
import { AppSync } from '@jompx/constructs'

new AppSync(scope: Construct, id: string, props: IAppSyncProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppSync.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSync.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSync.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IAppSyncProps">IAppSyncProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.AppSync.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.AppSync.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.AppSync.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IAppSyncProps">IAppSyncProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSync.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.AppSync.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSync.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.AppSync.isConstruct"></a>

```typescript
import { AppSync } from '@jompx/constructs'

AppSync.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.AppSync.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppSync.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.AppSync.property.graphqlApi">graphqlApi</a></code> | <code>@aws-cdk/aws-appsync-alpha.GraphqlApi</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSync.property.schemaBuilder">schemaBuilder</a></code> | <code><a href="#@jompx/constructs.AppSyncSchemaBuilder">AppSyncSchemaBuilder</a></code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.AppSync.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `graphqlApi`<sup>Required</sup> <a name="graphqlApi" id="@jompx/constructs.AppSync.property.graphqlApi"></a>

```typescript
public readonly graphqlApi: GraphqlApi;
```

- *Type:* @aws-cdk/aws-appsync-alpha.GraphqlApi

---

##### `schemaBuilder`<sup>Required</sup> <a name="schemaBuilder" id="@jompx/constructs.AppSync.property.schemaBuilder"></a>

```typescript
public readonly schemaBuilder: AppSyncSchemaBuilder;
```

- *Type:* <a href="#@jompx/constructs.AppSyncSchemaBuilder">AppSyncSchemaBuilder</a>

---


### AppSyncMySqlDataSource <a name="AppSyncMySqlDataSource" id="@jompx/constructs.AppSyncMySqlDataSource"></a>

AWS AppSync (serverless GraphQL).

#### Initializers <a name="Initializers" id="@jompx/constructs.AppSyncMySqlDataSource.Initializer"></a>

```typescript
import { AppSyncMySqlDataSource } from '@jompx/constructs'

new AppSyncMySqlDataSource(scope: Construct, id: string, props: IAppSyncMySqlDataSourceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps">IAppSyncMySqlDataSourceProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.AppSyncMySqlDataSource.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.AppSyncMySqlDataSource.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.AppSyncMySqlDataSource.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps">IAppSyncMySqlDataSourceProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.AppSyncMySqlDataSource.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.AppSyncMySqlDataSource.isConstruct"></a>

```typescript
import { AppSyncMySqlDataSource } from '@jompx/constructs'

AppSyncMySqlDataSource.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.AppSyncMySqlDataSource.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.AppSyncMySqlDataSource.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@jompx/constructs.AppSyncMySqlDataSource.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---


### CdkPipeline <a name="CdkPipeline" id="@jompx/constructs.CdkPipeline"></a>

Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild-readme.html  Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html  TODO: nx affected: https://nx.dev/ci/monorepo-ci-circle-ci    * TODO deploy in parallel: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html  TODO: Trigger apps pipeline https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit  Create CDK pipelines that deploy CDK code across AWS accounts on GitHub branch updates. All CDK pipeline resources reside on a single AWS account (preferrably a dedicated CICD AWS account) This dedicated AWS account will have permissions to deploy to all other accounts (as needed). Developers can also be given admin or readonly permissions to troubleshoot CDK deployment errors. Allow for both test and prod CICD AWS accounts. CICD enhancements can be done safely on the test CICD AWS account without affecting production deployments. Create a CDK pipeline for each stage (e.g. sandbox1, test, prod) where each stage is an AWS account (e.g. prod resources reside on a prod AWS account). Each stage is compromised of a set of "CDK stages" which can be deployed to any account. This allows common CDK resources to be deployed to a common AWS account (e.g. AWS wAF can be deployed to a common AWS account and shared across stages sandbox1, test, prod). A github branch update will trigger a CDK pipeline to start. Each stage is associated with a branch (e.g. updates to the main branch triggers the prod pipeline to start, updates to the sandbox1 branch triggers the sandbox1 pipelien to start). An CDK stages is comprised or one or more CDK stacks. Developers can also manually deploy stacks (if they have the appropriate AWS account permissions setup on their local). During development, developers will typically manually deploy a stack they're working on to their sandbox AWS account. A manual deployment of the CDK pipeline stack is needed to the test and prod CICD AWS accounts. Supports configuration to allow a company to have any number of stages, accounts, and CDK stages. The CICD test AWS account listens to branches with test in the branch name. It's important that test pipelines don't trigger on commits to main, test, sandbox1, etc.  AWS CodePipeline recommends using a CodePipelineSource connection to securly connect to GitHub. However, CodeBuild only supports the old Github token authorization. Stage branches use a connection. Regex stage branches use a token. Setup steps are required to enable both a connection and a token.  GitHub has a 20 web hook limit per event (per repo). It may be necessary to switch from web hook to polling or not create unused code pipelines (e.g. test-sandbox1 branch deploys may not be needed).  AWS Docs: The pipeline is self-mutating, which means that if you add new application stages in the source code, or new stacks to MyApplication, the pipeline will automatically reconfigure itself to deploy those new stages and stacks.  Important: - The CDK pipeline acts in the context of a stage (e.g. sandbox1, test, prod) and a stage is typically associated with one AWS account (e.g. prod AWS account). - A stage parameter must always be available. This parameter can be specified on the command line (which always takes precedence) or from a config file. - The cdk synth command in the pipeline includes a stage param. When the pipeline runs, the stage param is available in our CDK code. e.g. When the main branch is updated, it triggers the prod pipeline to synth and deploy CDK changes with stage param = 'prod'. This allows developers to write conditional CDK code e.g. if (status === 'prod'). - A CDK pipeline is connected to one GitHub branch (and listens to that branch for updates).  Deployments supported: - Manual CDK Pipeline stack deployment to CICD test and prod environments. - GitHub triggered deployments across all branches and all CICD stage branches e.g. (prod & test-prod, test & test-test, sandbox1 & test-sandbox1). - Manual CDK stack deploys (to any env). e.g. deploy stack to sandbox1, deploy stack to test, deploy stack to prod.

#### Initializers <a name="Initializers" id="@jompx/constructs.CdkPipeline.Initializer"></a>

```typescript
import { CdkPipeline } from '@jompx/constructs'

new CdkPipeline(scope: Construct, id: string, props: ICdkPipelineProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.CdkPipeline.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.CdkPipeline.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.CdkPipeline.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.ICdkPipelineProps">ICdkPipelineProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.CdkPipeline.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.CdkPipeline.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.CdkPipeline.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.ICdkPipelineProps">ICdkPipelineProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.CdkPipeline.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.CdkPipeline.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.CdkPipeline.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.CdkPipeline.isConstruct"></a>

```typescript
import { CdkPipeline } from '@jompx/constructs'

CdkPipeline.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.CdkPipeline.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.CdkPipeline.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.CdkPipeline.property.environmentPipelines">environmentPipelines</a></code> | <code><a href="#@jompx/constructs.IEnvironmentPipeline">IEnvironmentPipeline</a>[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.CdkPipeline.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `environmentPipelines`<sup>Required</sup> <a name="environmentPipelines" id="@jompx/constructs.CdkPipeline.property.environmentPipelines"></a>

```typescript
public readonly environmentPipelines: IEnvironmentPipeline[];
```

- *Type:* <a href="#@jompx/constructs.IEnvironmentPipeline">IEnvironmentPipeline</a>[]

---


### Cognito <a name="Cognito" id="@jompx/constructs.Cognito"></a>

AWS AppSync (serverless GraphQL).

#### Initializers <a name="Initializers" id="@jompx/constructs.Cognito.Initializer"></a>

```typescript
import { Cognito } from '@jompx/constructs'

new Cognito(scope: Construct, id: string, props: ICognitoProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.Cognito.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.Cognito.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.Cognito.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.ICognitoProps">ICognitoProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.Cognito.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.Cognito.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.Cognito.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.ICognitoProps">ICognitoProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.Cognito.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.Cognito.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.Cognito.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.Cognito.isConstruct"></a>

```typescript
import { Cognito } from '@jompx/constructs'

Cognito.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.Cognito.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.Cognito.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.Cognito.property.userPool">userPool</a></code> | <code>aws-cdk-lib.aws_cognito.UserPool</code> | *No description.* |
| <code><a href="#@jompx/constructs.Cognito.property.userPoolClients">userPoolClients</a></code> | <code>aws-cdk-lib.aws_cognito.UserPoolClient[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.Cognito.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `userPool`<sup>Required</sup> <a name="userPool" id="@jompx/constructs.Cognito.property.userPool"></a>

```typescript
public readonly userPool: UserPool;
```

- *Type:* aws-cdk-lib.aws_cognito.UserPool

---

##### `userPoolClients`<sup>Required</sup> <a name="userPoolClients" id="@jompx/constructs.Cognito.property.userPoolClients"></a>

```typescript
public readonly userPoolClients: UserPoolClient[];
```

- *Type:* aws-cdk-lib.aws_cognito.UserPoolClient[]

---


### HostingCertificate <a name="HostingCertificate" id="@jompx/constructs.HostingCertificate"></a>

The certificate must be present in the AWS Certificate Manager (ACM) service in the US East (N.

Virginia) region: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront-readme.html

#### Initializers <a name="Initializers" id="@jompx/constructs.HostingCertificate.Initializer"></a>

```typescript
import { HostingCertificate } from '@jompx/constructs'

new HostingCertificate(scope: Construct, id: string, props: IHostingCertificateProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.HostingCertificate.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingCertificate.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingCertificate.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IHostingCertificateProps">IHostingCertificateProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.HostingCertificate.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.HostingCertificate.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.HostingCertificate.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IHostingCertificateProps">IHostingCertificateProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.HostingCertificate.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.HostingCertificate.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.HostingCertificate.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.HostingCertificate.isConstruct"></a>

```typescript
import { HostingCertificate } from '@jompx/constructs'

HostingCertificate.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.HostingCertificate.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.HostingCertificate.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.HostingCertificate.property.caaAmazonRecord">caaAmazonRecord</a></code> | <code>aws-cdk-lib.aws_route53.CaaAmazonRecord</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingCertificate.property.certificate">certificate</a></code> | <code>aws-cdk-lib.aws_certificatemanager.Certificate</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingCertificate.property.publicHostedZone">publicHostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.HostingCertificate.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `caaAmazonRecord`<sup>Optional</sup> <a name="caaAmazonRecord" id="@jompx/constructs.HostingCertificate.property.caaAmazonRecord"></a>

```typescript
public readonly caaAmazonRecord: CaaAmazonRecord;
```

- *Type:* aws-cdk-lib.aws_route53.CaaAmazonRecord

---

##### `certificate`<sup>Optional</sup> <a name="certificate" id="@jompx/constructs.HostingCertificate.property.certificate"></a>

```typescript
public readonly certificate: Certificate;
```

- *Type:* aws-cdk-lib.aws_certificatemanager.Certificate

---

##### `publicHostedZone`<sup>Optional</sup> <a name="publicHostedZone" id="@jompx/constructs.HostingCertificate.property.publicHostedZone"></a>

```typescript
public readonly publicHostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

---


### HostingCloudFront <a name="HostingCloudFront" id="@jompx/constructs.HostingCloudFront"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.HostingCloudFront.Initializer"></a>

```typescript
import { HostingCloudFront } from '@jompx/constructs'

new HostingCloudFront(scope: Construct, id: string, props: IHostingCloudFrontProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.HostingCloudFront.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingCloudFront.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingCloudFront.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IHostingCloudFrontProps">IHostingCloudFrontProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.HostingCloudFront.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.HostingCloudFront.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.HostingCloudFront.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IHostingCloudFrontProps">IHostingCloudFrontProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.HostingCloudFront.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.HostingCloudFront.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.HostingCloudFront.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.HostingCloudFront.isConstruct"></a>

```typescript
import { HostingCloudFront } from '@jompx/constructs'

HostingCloudFront.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.HostingCloudFront.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.HostingCloudFront.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.HostingCloudFront.property.cachePolicy">cachePolicy</a></code> | <code>aws-cdk-lib.aws_cloudfront.CachePolicy</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingCloudFront.property.distribution">distribution</a></code> | <code>aws-cdk-lib.aws_cloudfront.Distribution</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.HostingCloudFront.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `cachePolicy`<sup>Required</sup> <a name="cachePolicy" id="@jompx/constructs.HostingCloudFront.property.cachePolicy"></a>

```typescript
public readonly cachePolicy: CachePolicy;
```

- *Type:* aws-cdk-lib.aws_cloudfront.CachePolicy

---

##### `distribution`<sup>Required</sup> <a name="distribution" id="@jompx/constructs.HostingCloudFront.property.distribution"></a>

```typescript
public readonly distribution: Distribution;
```

- *Type:* aws-cdk-lib.aws_cloudfront.Distribution

---


### HostingS3 <a name="HostingS3" id="@jompx/constructs.HostingS3"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.HostingS3.Initializer"></a>

```typescript
import { HostingS3 } from '@jompx/constructs'

new HostingS3(scope: Construct, id: string, props: IHostingS3Props)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.HostingS3.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingS3.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.HostingS3.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IHostingS3Props">IHostingS3Props</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.HostingS3.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.HostingS3.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.HostingS3.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IHostingS3Props">IHostingS3Props</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.HostingS3.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.HostingS3.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.HostingS3.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.HostingS3.isConstruct"></a>

```typescript
import { HostingS3 } from '@jompx/constructs'

HostingS3.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.HostingS3.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.HostingS3.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.HostingS3.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.HostingS3.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@jompx/constructs.HostingS3.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

---


## Structs <a name="Structs" id="Structs"></a>

### AppSyncIFields <a name="AppSyncIFields" id="@jompx/constructs.AppSyncIFields"></a>

#### Initializer <a name="Initializer" id="@jompx/constructs.AppSyncIFields.Initializer"></a>

```typescript
import { AppSyncIFields } from '@jompx/constructs'

const appSyncIFields: AppSyncIFields = { ... }
```


### JompxGraphqlTypeOptions <a name="JompxGraphqlTypeOptions" id="@jompx/constructs.JompxGraphqlTypeOptions"></a>

Extend GraphqlTypeOptions to include a new typeName parameter.

#### Initializer <a name="Initializer" id="@jompx/constructs.JompxGraphqlTypeOptions.Initializer"></a>

```typescript
import { JompxGraphqlTypeOptions } from '@jompx/constructs'

const jompxGraphqlTypeOptions: JompxGraphqlTypeOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxGraphqlTypeOptions.property.isList">isList</a></code> | <code>boolean</code> | property determining if this attribute is a list i.e. if true, attribute would be [Type]. |
| <code><a href="#@jompx/constructs.JompxGraphqlTypeOptions.property.isRequired">isRequired</a></code> | <code>boolean</code> | property determining if this attribute is non-nullable i.e. if true, attribute would be Type! |
| <code><a href="#@jompx/constructs.JompxGraphqlTypeOptions.property.isRequiredList">isRequiredList</a></code> | <code>boolean</code> | property determining if this attribute is a non-nullable list i.e. if true, attribute would be [ Type ]! or if isRequired true, attribe would be [ Type! ]! |
| <code><a href="#@jompx/constructs.JompxGraphqlTypeOptions.property.intermediateType">intermediateType</a></code> | <code>@aws-cdk/aws-appsync-alpha.IIntermediateType</code> | the intermediate type linked to this attribute. |
| <code><a href="#@jompx/constructs.JompxGraphqlTypeOptions.property.typeName">typeName</a></code> | <code>string</code> | *No description.* |

---

##### `isList`<sup>Optional</sup> <a name="isList" id="@jompx/constructs.JompxGraphqlTypeOptions.property.isList"></a>

```typescript
public readonly isList: boolean;
```

- *Type:* boolean
- *Default:* false

property determining if this attribute is a list i.e. if true, attribute would be [Type].

---

##### `isRequired`<sup>Optional</sup> <a name="isRequired" id="@jompx/constructs.JompxGraphqlTypeOptions.property.isRequired"></a>

```typescript
public readonly isRequired: boolean;
```

- *Type:* boolean
- *Default:* false

property determining if this attribute is non-nullable i.e. if true, attribute would be Type!

---

##### `isRequiredList`<sup>Optional</sup> <a name="isRequiredList" id="@jompx/constructs.JompxGraphqlTypeOptions.property.isRequiredList"></a>

```typescript
public readonly isRequiredList: boolean;
```

- *Type:* boolean
- *Default:* false

property determining if this attribute is a non-nullable list i.e. if true, attribute would be [ Type ]! or if isRequired true, attribe would be [ Type! ]!

---

##### `intermediateType`<sup>Optional</sup> <a name="intermediateType" id="@jompx/constructs.JompxGraphqlTypeOptions.property.intermediateType"></a>

```typescript
public readonly intermediateType: IIntermediateType;
```

- *Type:* @aws-cdk/aws-appsync-alpha.IIntermediateType
- *Default:* no intermediate type

the intermediate type linked to this attribute.

---

##### `typeName`<sup>Required</sup> <a name="typeName" id="@jompx/constructs.JompxGraphqlTypeOptions.property.typeName"></a>

```typescript
public readonly typeName: string;
```

- *Type:* string

---

## Classes <a name="Classes" id="Classes"></a>

### AppSyncMySqlCustomDirective <a name="AppSyncMySqlCustomDirective" id="@jompx/constructs.AppSyncMySqlCustomDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.AppSyncMySqlCustomDirective.Initializer"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

new AppSyncMySqlCustomDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSyncMySqlCustomDirective.datasource">datasource</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlCustomDirective.getArgumentByIdentifier">getArgumentByIdentifier</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlCustomDirective.lookup">lookup</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlCustomDirective.readonly">readonly</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlCustomDirective.schema">schema</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlCustomDirective.source">source</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncMySqlCustomDirective.operations">operations</a></code> | *No description.* |

---

##### `datasource` <a name="datasource" id="@jompx/constructs.AppSyncMySqlCustomDirective.datasource"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

AppSyncMySqlCustomDirective.datasource(name: string)
```

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.AppSyncMySqlCustomDirective.datasource.parameter.name"></a>

- *Type:* string

---

##### `getArgumentByIdentifier` <a name="getArgumentByIdentifier" id="@jompx/constructs.AppSyncMySqlCustomDirective.getArgumentByIdentifier"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

AppSyncMySqlCustomDirective.getArgumentByIdentifier(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.AppSyncMySqlCustomDirective.getArgumentByIdentifier.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.AppSyncMySqlCustomDirective.getArgumentByIdentifier.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.AppSyncMySqlCustomDirective.getArgumentByIdentifier.parameter.directives"></a>

- *Type:* any[]

---

##### `lookup` <a name="lookup" id="@jompx/constructs.AppSyncMySqlCustomDirective.lookup"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

AppSyncMySqlCustomDirective.lookup(value: ICustomDirectiveLookup)
```

###### `value`<sup>Required</sup> <a name="value" id="@jompx/constructs.AppSyncMySqlCustomDirective.lookup.parameter.value"></a>

- *Type:* <a href="#@jompx/constructs.ICustomDirectiveLookup">ICustomDirectiveLookup</a>

---

##### `readonly` <a name="readonly" id="@jompx/constructs.AppSyncMySqlCustomDirective.readonly"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

AppSyncMySqlCustomDirective.readonly(value: boolean)
```

###### `value`<sup>Required</sup> <a name="value" id="@jompx/constructs.AppSyncMySqlCustomDirective.readonly.parameter.value"></a>

- *Type:* boolean

---

##### `schema` <a name="schema" id="@jompx/constructs.AppSyncMySqlCustomDirective.schema"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

AppSyncMySqlCustomDirective.schema()
```

##### `source` <a name="source" id="@jompx/constructs.AppSyncMySqlCustomDirective.source"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

AppSyncMySqlCustomDirective.source(name: string)
```

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.AppSyncMySqlCustomDirective.source.parameter.name"></a>

- *Type:* string

---

##### `operations` <a name="operations" id="@jompx/constructs.AppSyncMySqlCustomDirective.operations"></a>

```typescript
import { AppSyncMySqlCustomDirective } from '@jompx/constructs'

AppSyncMySqlCustomDirective.operations(operations: string[])
```

###### `operations`<sup>Required</sup> <a name="operations" id="@jompx/constructs.AppSyncMySqlCustomDirective.operations.parameter.operations"></a>

- *Type:* string[]

---



### AppSyncResolver <a name="AppSyncResolver" id="@jompx/constructs.AppSyncResolver"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.AppSyncResolver.Initializer"></a>

```typescript
import { AppSyncResolver } from '@jompx/constructs'

new AppSyncResolver()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSyncResolver.callMethodFromEvent">callMethodFromEvent</a></code> | Call a method on a class from values in a AppSync Lambda event. |

---

##### `callMethodFromEvent` <a name="callMethodFromEvent" id="@jompx/constructs.AppSyncResolver.callMethodFromEvent"></a>

```typescript
import { AppSyncResolver } from '@jompx/constructs'

AppSyncResolver.callMethodFromEvent(classInstance: any, event: any, path?: string)
```

Call a method on a class from values in a AppSync Lambda event.

###### `classInstance`<sup>Required</sup> <a name="classInstance" id="@jompx/constructs.AppSyncResolver.callMethodFromEvent.parameter.classInstance"></a>

- *Type:* any

A class instance.

---

###### `event`<sup>Required</sup> <a name="event" id="@jompx/constructs.AppSyncResolver.callMethodFromEvent.parameter.event"></a>

- *Type:* any

AppSync Lambda event.

---

###### `path`<sup>Optional</sup> <a name="path" id="@jompx/constructs.AppSyncResolver.callMethodFromEvent.parameter.path"></a>

- *Type:* string

JSON path to method arguments in event.arguments.

---



### AppSyncSchemaBuilder <a name="AppSyncSchemaBuilder" id="@jompx/constructs.AppSyncSchemaBuilder"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.AppSyncSchemaBuilder.Initializer"></a>

```typescript
import { AppSyncSchemaBuilder } from '@jompx/constructs'

new AppSyncSchemaBuilder(graphqlApi: GraphqlApi)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.Initializer.parameter.graphqlApi">graphqlApi</a></code> | <code>@aws-cdk/aws-appsync-alpha.GraphqlApi</code> | *No description.* |

---

##### `graphqlApi`<sup>Required</sup> <a name="graphqlApi" id="@jompx/constructs.AppSyncSchemaBuilder.Initializer.parameter.graphqlApi"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.GraphqlApi

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.addDataSource">addDataSource</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.addMutation">addMutation</a></code> | Add a mutation to the GraphQL schema. |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.addSchemaTypes">addSchemaTypes</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.create">create</a></code> | *No description.* |

---

##### `addDataSource` <a name="addDataSource" id="@jompx/constructs.AppSyncSchemaBuilder.addDataSource"></a>

```typescript
public addDataSource(id: string, lambdaFunction: IFunction, options?: DataSourceOptions): LambdaDataSource
```

###### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.AppSyncSchemaBuilder.addDataSource.parameter.id"></a>

- *Type:* string

---

###### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@jompx/constructs.AppSyncSchemaBuilder.addDataSource.parameter.lambdaFunction"></a>

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.AppSyncSchemaBuilder.addDataSource.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.DataSourceOptions

---

##### `addMutation` <a name="addMutation" id="@jompx/constructs.AppSyncSchemaBuilder.addMutation"></a>

```typescript
public addMutation(__0: IAddMutationArguments): ObjectType
```

Add a mutation to the GraphQL schema.

###### `__0`<sup>Required</sup> <a name="__0" id="@jompx/constructs.AppSyncSchemaBuilder.addMutation.parameter.__0"></a>

- *Type:* <a href="#@jompx/constructs.IAddMutationArguments">IAddMutationArguments</a>

---

##### `addSchemaTypes` <a name="addSchemaTypes" id="@jompx/constructs.AppSyncSchemaBuilder.addSchemaTypes"></a>

```typescript
public addSchemaTypes(schemaTypes: ISchemaTypes): void
```

###### `schemaTypes`<sup>Required</sup> <a name="schemaTypes" id="@jompx/constructs.AppSyncSchemaBuilder.addSchemaTypes.parameter.schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

---

##### `create` <a name="create" id="@jompx/constructs.AppSyncSchemaBuilder.create"></a>

```typescript
public create(): void
```


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.property.dataSources">dataSources</a></code> | <code><a href="#@jompx/constructs.IDataSource">IDataSource</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.property.graphqlApi">graphqlApi</a></code> | <code>@aws-cdk/aws-appsync-alpha.GraphqlApi</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.property.schemaTypes">schemaTypes</a></code> | <code><a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a></code> | *No description.* |

---

##### `dataSources`<sup>Required</sup> <a name="dataSources" id="@jompx/constructs.AppSyncSchemaBuilder.property.dataSources"></a>

```typescript
public readonly dataSources: IDataSource;
```

- *Type:* <a href="#@jompx/constructs.IDataSource">IDataSource</a>

---

##### `graphqlApi`<sup>Required</sup> <a name="graphqlApi" id="@jompx/constructs.AppSyncSchemaBuilder.property.graphqlApi"></a>

```typescript
public readonly graphqlApi: GraphqlApi;
```

- *Type:* @aws-cdk/aws-appsync-alpha.GraphqlApi

---

##### `schemaTypes`<sup>Required</sup> <a name="schemaTypes" id="@jompx/constructs.AppSyncSchemaBuilder.property.schemaTypes"></a>

```typescript
public readonly schemaTypes: ISchemaTypes;
```

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

---


### Config <a name="Config" id="@jompx/constructs.Config"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.Config.Initializer"></a>

```typescript
import { Config } from '@jompx/constructs'

new Config(appNode: Node)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.Config.Initializer.parameter.appNode">appNode</a></code> | <code>constructs.Node</code> | *No description.* |

---

##### `appNode`<sup>Required</sup> <a name="appNode" id="@jompx/constructs.Config.Initializer.parameter.appNode"></a>

- *Type:* constructs.Node

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.Config.appRootDomainNames">appRootDomainNames</a></code> | Get a distinct/unique list of root domain names across all apps. |
| <code><a href="#@jompx/constructs.Config.apps">apps</a></code> | Get list of apps. |
| <code><a href="#@jompx/constructs.Config.env">env</a></code> | Get env (AWS accountId + region) from config (type + stage) e.g. cicd + test = xxxxxxxxxxxx + us-west-2. If no stage provided then will use current stage. |
| <code><a href="#@jompx/constructs.Config.environmentByAccountId">environmentByAccountId</a></code> | Get an AWS environment by AWS account id. |
| <code><a href="#@jompx/constructs.Config.environmentByName">environmentByName</a></code> | Get an AWS environment by friendly name. |
| <code><a href="#@jompx/constructs.Config.environments">environments</a></code> | Get list of AWS environemnts. |
| <code><a href="#@jompx/constructs.Config.organizationName">organizationName</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.organizationNamePascalCase">organizationNamePascalCase</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.stage">stage</a></code> | Get stage from command line or config. |
| <code><a href="#@jompx/constructs.Config.stageDeployments">stageDeployments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.stages">stages</a></code> | Get config stages. |

---

##### `appRootDomainNames` <a name="appRootDomainNames" id="@jompx/constructs.Config.appRootDomainNames"></a>

```typescript
public appRootDomainNames(): string[]
```

Get a distinct/unique list of root domain names across all apps.

##### `apps` <a name="apps" id="@jompx/constructs.Config.apps"></a>

```typescript
public apps(): IApp[]
```

Get list of apps.

An app is typically deployed across all stages and is acceccable on each stage.

##### `env` <a name="env" id="@jompx/constructs.Config.env"></a>

```typescript
public env(deploymentType: string, stage?: string): Environment
```

Get env (AWS accountId + region) from config (type + stage) e.g. cicd + test = xxxxxxxxxxxx + us-west-2. If no stage provided then will use current stage.

###### `deploymentType`<sup>Required</sup> <a name="deploymentType" id="@jompx/constructs.Config.env.parameter.deploymentType"></a>

- *Type:* string

---

###### `stage`<sup>Optional</sup> <a name="stage" id="@jompx/constructs.Config.env.parameter.stage"></a>

- *Type:* string

---

##### `environmentByAccountId` <a name="environmentByAccountId" id="@jompx/constructs.Config.environmentByAccountId"></a>

```typescript
public environmentByAccountId(accountId: string): IEnvironment
```

Get an AWS environment by AWS account id.

###### `accountId`<sup>Required</sup> <a name="accountId" id="@jompx/constructs.Config.environmentByAccountId.parameter.accountId"></a>

- *Type:* string

---

##### `environmentByName` <a name="environmentByName" id="@jompx/constructs.Config.environmentByName"></a>

```typescript
public environmentByName(name: string): IEnvironment
```

Get an AWS environment by friendly name.

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.Config.environmentByName.parameter.name"></a>

- *Type:* string

---

##### `environments` <a name="environments" id="@jompx/constructs.Config.environments"></a>

```typescript
public environments(): IEnvironment[]
```

Get list of AWS environemnts.

An AWS environment is primarily a accountId/region pair.

##### `organizationName` <a name="organizationName" id="@jompx/constructs.Config.organizationName"></a>

```typescript
public organizationName(): string
```

##### `organizationNamePascalCase` <a name="organizationNamePascalCase" id="@jompx/constructs.Config.organizationNamePascalCase"></a>

```typescript
public organizationNamePascalCase(): string
```

##### `stage` <a name="stage" id="@jompx/constructs.Config.stage"></a>

```typescript
public stage(): string
```

Get stage from command line or config.

e.g. sandbox1, test, prod.

##### `stageDeployments` <a name="stageDeployments" id="@jompx/constructs.Config.stageDeployments"></a>

```typescript
public stageDeployments(stageName: string): IStageDeployment[]
```

###### `stageName`<sup>Required</sup> <a name="stageName" id="@jompx/constructs.Config.stageDeployments.parameter.stageName"></a>

- *Type:* string

---

##### `stages` <a name="stages" id="@jompx/constructs.Config.stages"></a>

```typescript
public stages(): IStage
```

Get config stages.

Use dot notation to get a stage e.g. stages.prod JSII constructs don't support map object. To convert to map use: new Map(Object.entries(config.stages()));


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.Config.property.appNode">appNode</a></code> | <code>constructs.Node</code> | *No description.* |

---

##### `appNode`<sup>Required</sup> <a name="appNode" id="@jompx/constructs.Config.property.appNode"></a>

```typescript
public readonly appNode: Node;
```

- *Type:* constructs.Node

---


### CustomDirective <a name="CustomDirective" id="@jompx/constructs.CustomDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.CustomDirective.Initializer"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

new CustomDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.CustomDirective.datasource">datasource</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CustomDirective.getArgumentByIdentifier">getArgumentByIdentifier</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CustomDirective.lookup">lookup</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CustomDirective.readonly">readonly</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CustomDirective.schema">schema</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CustomDirective.source">source</a></code> | *No description.* |

---

##### `datasource` <a name="datasource" id="@jompx/constructs.CustomDirective.datasource"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.datasource(name: string)
```

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.CustomDirective.datasource.parameter.name"></a>

- *Type:* string

---

##### `getArgumentByIdentifier` <a name="getArgumentByIdentifier" id="@jompx/constructs.CustomDirective.getArgumentByIdentifier"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.getArgumentByIdentifier(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.CustomDirective.getArgumentByIdentifier.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.CustomDirective.getArgumentByIdentifier.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.CustomDirective.getArgumentByIdentifier.parameter.directives"></a>

- *Type:* any[]

---

##### `lookup` <a name="lookup" id="@jompx/constructs.CustomDirective.lookup"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.lookup(value: ICustomDirectiveLookup)
```

###### `value`<sup>Required</sup> <a name="value" id="@jompx/constructs.CustomDirective.lookup.parameter.value"></a>

- *Type:* <a href="#@jompx/constructs.ICustomDirectiveLookup">ICustomDirectiveLookup</a>

---

##### `readonly` <a name="readonly" id="@jompx/constructs.CustomDirective.readonly"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.readonly(value: boolean)
```

###### `value`<sup>Required</sup> <a name="value" id="@jompx/constructs.CustomDirective.readonly.parameter.value"></a>

- *Type:* boolean

---

##### `schema` <a name="schema" id="@jompx/constructs.CustomDirective.schema"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.schema()
```

##### `source` <a name="source" id="@jompx/constructs.CustomDirective.source"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.source(name: string)
```

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.CustomDirective.source.parameter.name"></a>

- *Type:* string

---



### JompxGraphqlType <a name="JompxGraphqlType" id="@jompx/constructs.JompxGraphqlType"></a>

Extend GraphqlType to create a new datatype to include a new typeName property.

#### Initializers <a name="Initializers" id="@jompx/constructs.JompxGraphqlType.Initializer"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

new JompxGraphqlType(type: Type, options?: JompxGraphqlTypeOptions)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxGraphqlType.Initializer.parameter.type">type</a></code> | <code>@aws-cdk/aws-appsync-alpha.Type</code> | *No description.* |
| <code><a href="#@jompx/constructs.JompxGraphqlType.Initializer.parameter.options">options</a></code> | <code><a href="#@jompx/constructs.JompxGraphqlTypeOptions">JompxGraphqlTypeOptions</a></code> | *No description.* |

---

##### `type`<sup>Required</sup> <a name="type" id="@jompx/constructs.JompxGraphqlType.Initializer.parameter.type"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Type

---

##### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.Initializer.parameter.options"></a>

- *Type:* <a href="#@jompx/constructs.JompxGraphqlTypeOptions">JompxGraphqlTypeOptions</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.JompxGraphqlType.argsToString">argsToString</a></code> | Generate the arguments for this field. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.directivesToString">directivesToString</a></code> | Generate the directives for this field. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.toString">toString</a></code> | Generate the string for this attribute. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.resolve">resolve</a></code> | Resolve a JompxGraphqlType with string type to a GraphqlType with actual type. |

---

##### `argsToString` <a name="argsToString" id="@jompx/constructs.JompxGraphqlType.argsToString"></a>

```typescript
public argsToString(): string
```

Generate the arguments for this field.

##### `directivesToString` <a name="directivesToString" id="@jompx/constructs.JompxGraphqlType.directivesToString"></a>

```typescript
public directivesToString(_modes?: AuthorizationType[]): string
```

Generate the directives for this field.

###### `_modes`<sup>Optional</sup> <a name="_modes" id="@jompx/constructs.JompxGraphqlType.directivesToString.parameter._modes"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.AuthorizationType[]

---

##### `toString` <a name="toString" id="@jompx/constructs.JompxGraphqlType.toString"></a>

```typescript
public toString(): string
```

Generate the string for this attribute.

##### `resolve` <a name="resolve" id="@jompx/constructs.JompxGraphqlType.resolve"></a>

```typescript
public resolve(schemaTypes: ISchemaTypes): GraphqlType
```

Resolve a JompxGraphqlType with string type to a GraphqlType with actual type.

###### `schemaTypes`<sup>Required</sup> <a name="schemaTypes" id="@jompx/constructs.JompxGraphqlType.resolve.parameter.schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsDate">awsDate</a></code> | `AWSDate` scalar type represents a valid extended `ISO 8601 Date` string. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsDateTime">awsDateTime</a></code> | `AWSDateTime` scalar type represents a valid extended `ISO 8601 DateTime` string. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsEmail">awsEmail</a></code> | `AWSEmail` scalar type represents an email address string (i.e.`username@example.com`). |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsIpAddress">awsIpAddress</a></code> | `AWSIPAddress` scalar type respresents a valid `IPv4` of `IPv6` address string. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsJson">awsJson</a></code> | `AWSJson` scalar type represents a JSON string. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsPhone">awsPhone</a></code> | `AWSPhone` scalar type represents a valid phone number. Phone numbers maybe be whitespace delimited or hyphenated. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsTime">awsTime</a></code> | `AWSTime` scalar type represents a valid extended `ISO 8601 Time` string. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsTimestamp">awsTimestamp</a></code> | `AWSTimestamp` scalar type represents the number of seconds since `1970-01-01T00:00Z`. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.awsUrl">awsUrl</a></code> | `AWSURL` scalar type represetns a valid URL string. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.boolean">boolean</a></code> | `Boolean` scalar type is a boolean value: true or false. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.float">float</a></code> | `Float` scalar type is a signed double-precision fractional value. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.id">id</a></code> | `ID` scalar type is a unique identifier. `ID` type is serialized similar to `String`. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.int">int</a></code> | `Int` scalar type is a signed non-fractional numerical value. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.intermediate">intermediate</a></code> | an intermediate type to be added as an attribute (i.e. an interface or an object type). |
| <code><a href="#@jompx/constructs.JompxGraphqlType.string">string</a></code> | `String` scalar type is a free-form human-readable text. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.objectType">objectType</a></code> | *No description.* |

---

##### `awsDate` <a name="awsDate" id="@jompx/constructs.JompxGraphqlType.awsDate"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsDate(options?: BaseTypeOptions)
```

`AWSDate` scalar type represents a valid extended `ISO 8601 Date` string.

In other words, accepts date strings in the form of `YYYY-MM-DD`. It accepts time zone offsets.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsDate.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsDateTime` <a name="awsDateTime" id="@jompx/constructs.JompxGraphqlType.awsDateTime"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsDateTime(options?: BaseTypeOptions)
```

`AWSDateTime` scalar type represents a valid extended `ISO 8601 DateTime` string.

In other words, accepts date strings in the form of `YYYY-MM-DDThh:mm:ss.sssZ`. It accepts time zone offsets.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsDateTime.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsEmail` <a name="awsEmail" id="@jompx/constructs.JompxGraphqlType.awsEmail"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsEmail(options?: BaseTypeOptions)
```

`AWSEmail` scalar type represents an email address string (i.e.`username@example.com`).

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsEmail.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsIpAddress` <a name="awsIpAddress" id="@jompx/constructs.JompxGraphqlType.awsIpAddress"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsIpAddress(options?: BaseTypeOptions)
```

`AWSIPAddress` scalar type respresents a valid `IPv4` of `IPv6` address string.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsIpAddress.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsJson` <a name="awsJson" id="@jompx/constructs.JompxGraphqlType.awsJson"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsJson(options?: BaseTypeOptions)
```

`AWSJson` scalar type represents a JSON string.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsJson.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsPhone` <a name="awsPhone" id="@jompx/constructs.JompxGraphqlType.awsPhone"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsPhone(options?: BaseTypeOptions)
```

`AWSPhone` scalar type represents a valid phone number. Phone numbers maybe be whitespace delimited or hyphenated.

The number can specify a country code at the beginning, but is not required for US phone numbers.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsPhone.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsTime` <a name="awsTime" id="@jompx/constructs.JompxGraphqlType.awsTime"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsTime(options?: BaseTypeOptions)
```

`AWSTime` scalar type represents a valid extended `ISO 8601 Time` string.

In other words, accepts date strings in the form of `hh:mm:ss.sss`. It accepts time zone offsets.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsTime.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsTimestamp` <a name="awsTimestamp" id="@jompx/constructs.JompxGraphqlType.awsTimestamp"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsTimestamp(options?: BaseTypeOptions)
```

`AWSTimestamp` scalar type represents the number of seconds since `1970-01-01T00:00Z`.

Timestamps are serialized and deserialized as numbers.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsTimestamp.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `awsUrl` <a name="awsUrl" id="@jompx/constructs.JompxGraphqlType.awsUrl"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.awsUrl(options?: BaseTypeOptions)
```

`AWSURL` scalar type represetns a valid URL string.

URLs wihtout schemes or contain double slashes are considered invalid.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.awsUrl.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `boolean` <a name="boolean" id="@jompx/constructs.JompxGraphqlType.boolean"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.boolean(options?: BaseTypeOptions)
```

`Boolean` scalar type is a boolean value: true or false.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.boolean.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `float` <a name="float" id="@jompx/constructs.JompxGraphqlType.float"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.float(options?: BaseTypeOptions)
```

`Float` scalar type is a signed double-precision fractional value.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.float.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `id` <a name="id" id="@jompx/constructs.JompxGraphqlType.id"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.id(options?: BaseTypeOptions)
```

`ID` scalar type is a unique identifier. `ID` type is serialized similar to `String`.

Often used as a key for a cache and not intended to be human-readable.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.id.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `int` <a name="int" id="@jompx/constructs.JompxGraphqlType.int"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.int(options?: BaseTypeOptions)
```

`Int` scalar type is a signed non-fractional numerical value.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.int.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `intermediate` <a name="intermediate" id="@jompx/constructs.JompxGraphqlType.intermediate"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.intermediate(options?: GraphqlTypeOptions)
```

an intermediate type to be added as an attribute (i.e. an interface or an object type).

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.intermediate.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.GraphqlTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList - intermediateType.

---

##### `string` <a name="string" id="@jompx/constructs.JompxGraphqlType.string"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.string(options?: BaseTypeOptions)
```

`String` scalar type is a free-form human-readable text.

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.string.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.BaseTypeOptions

the options to configure this attribute - isList - isRequired - isRequiredList.

---

##### `objectType` <a name="objectType" id="@jompx/constructs.JompxGraphqlType.objectType"></a>

```typescript
import { JompxGraphqlType } from '@jompx/constructs'

JompxGraphqlType.objectType(options?: JompxGraphqlTypeOptions)
```

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.JompxGraphqlType.objectType.parameter.options"></a>

- *Type:* <a href="#@jompx/constructs.JompxGraphqlTypeOptions">JompxGraphqlTypeOptions</a>

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxGraphqlType.property.isList">isList</a></code> | <code>boolean</code> | property determining if this attribute is a list i.e. if true, attribute would be `[Type]`. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.property.isRequired">isRequired</a></code> | <code>boolean</code> | property determining if this attribute is non-nullable i.e. if true, attribute would be `Type!` and this attribute must always have a value. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.property.isRequiredList">isRequiredList</a></code> | <code>boolean</code> | property determining if this attribute is a non-nullable list i.e. if true, attribute would be `[ Type ]!` and this attribute's list must always have a value. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.property.type">type</a></code> | <code>@aws-cdk/aws-appsync-alpha.Type</code> | the type of attribute. |
| <code><a href="#@jompx/constructs.JompxGraphqlType.property.intermediateType">intermediateType</a></code> | <code>@aws-cdk/aws-appsync-alpha.IIntermediateType</code> | the intermediate type linked to this attribute (i.e. an interface or an object). |
| <code><a href="#@jompx/constructs.JompxGraphqlType.property.typeName">typeName</a></code> | <code>string</code> | *No description.* |

---

##### `isList`<sup>Required</sup> <a name="isList" id="@jompx/constructs.JompxGraphqlType.property.isList"></a>

```typescript
public readonly isList: boolean;
```

- *Type:* boolean
- *Default:* false

property determining if this attribute is a list i.e. if true, attribute would be `[Type]`.

---

##### `isRequired`<sup>Required</sup> <a name="isRequired" id="@jompx/constructs.JompxGraphqlType.property.isRequired"></a>

```typescript
public readonly isRequired: boolean;
```

- *Type:* boolean
- *Default:* false

property determining if this attribute is non-nullable i.e. if true, attribute would be `Type!` and this attribute must always have a value.

---

##### `isRequiredList`<sup>Required</sup> <a name="isRequiredList" id="@jompx/constructs.JompxGraphqlType.property.isRequiredList"></a>

```typescript
public readonly isRequiredList: boolean;
```

- *Type:* boolean
- *Default:* false

property determining if this attribute is a non-nullable list i.e. if true, attribute would be `[ Type ]!` and this attribute's list must always have a value.

---

##### `type`<sup>Required</sup> <a name="type" id="@jompx/constructs.JompxGraphqlType.property.type"></a>

```typescript
public readonly type: Type;
```

- *Type:* @aws-cdk/aws-appsync-alpha.Type

the type of attribute.

---

##### `intermediateType`<sup>Optional</sup> <a name="intermediateType" id="@jompx/constructs.JompxGraphqlType.property.intermediateType"></a>

```typescript
public readonly intermediateType: IIntermediateType;
```

- *Type:* @aws-cdk/aws-appsync-alpha.IIntermediateType
- *Default:* no intermediate type

the intermediate type linked to this attribute (i.e. an interface or an object).

---

##### `typeName`<sup>Required</sup> <a name="typeName" id="@jompx/constructs.JompxGraphqlType.property.typeName"></a>

```typescript
public readonly typeName: string;
```

- *Type:* string

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IAddMutationArguments <a name="IAddMutationArguments" id="@jompx/constructs.IAddMutationArguments"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAddMutationArguments">IAddMutationArguments</a>

Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/ Support relay or not? https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066 Joins should be connections and named as such. e.g. in post TagsConnection https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo https://graphql-rules.com/rules/list-pagination https://www.apollographql.com/blog/graphql/basics/designing-graphql-mutations/ - Mutation: Use top level input type for ags. Use top level property for output type.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAddMutationArguments.property.args">args</a></code> | <code><a href="#@jompx/constructs.IAppSyncOperationArgs">IAppSyncOperationArgs</a></code> | Mutation input arguments. |
| <code><a href="#@jompx/constructs.IAddMutationArguments.property.dataSourceName">dataSourceName</a></code> | <code>string</code> | The mutation datasource. |
| <code><a href="#@jompx/constructs.IAddMutationArguments.property.name">name</a></code> | <code>string</code> | The name of the mutation as it will appear in the GraphQL schema. |
| <code><a href="#@jompx/constructs.IAddMutationArguments.property.returnType">returnType</a></code> | <code>@aws-cdk/aws-appsync-alpha.ObjectType</code> | The mutation return object type. |
| <code><a href="#@jompx/constructs.IAddMutationArguments.property.methodName">methodName</a></code> | <code>string</code> | The mutation method to call. |

---

##### `args`<sup>Required</sup> <a name="args" id="@jompx/constructs.IAddMutationArguments.property.args"></a>

```typescript
public readonly args: IAppSyncOperationArgs;
```

- *Type:* <a href="#@jompx/constructs.IAppSyncOperationArgs">IAppSyncOperationArgs</a>

Mutation input arguments.

These should exactly match the number and order of arguments in the method the mutation will call.

---

##### `dataSourceName`<sup>Required</sup> <a name="dataSourceName" id="@jompx/constructs.IAddMutationArguments.property.dataSourceName"></a>

```typescript
public readonly dataSourceName: string;
```

- *Type:* string

The mutation datasource.

---

##### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.IAddMutationArguments.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the mutation as it will appear in the GraphQL schema.

---

##### `returnType`<sup>Required</sup> <a name="returnType" id="@jompx/constructs.IAddMutationArguments.property.returnType"></a>

```typescript
public readonly returnType: ObjectType;
```

- *Type:* @aws-cdk/aws-appsync-alpha.ObjectType

The mutation return object type.

---

##### `methodName`<sup>Optional</sup> <a name="methodName" id="@jompx/constructs.IAddMutationArguments.property.methodName"></a>

```typescript
public readonly methodName: string;
```

- *Type:* string

The mutation method to call.

---

### IApp <a name="IApp" id="@jompx/constructs.IApp"></a>

- *Implemented By:* <a href="#@jompx/constructs.IApp">IApp</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IApp.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IApp.property.rootDomainName">rootDomainName</a></code> | <code>string</code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.IApp.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `rootDomainName`<sup>Required</sup> <a name="rootDomainName" id="@jompx/constructs.IApp.property.rootDomainName"></a>

```typescript
public readonly rootDomainName: string;
```

- *Type:* string

---

### IAppPipelineGitHubProps <a name="IAppPipelineGitHubProps" id="@jompx/constructs.IAppPipelineGitHubProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppPipelineGitHubProps">IAppPipelineGitHubProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppPipelineGitHubProps.property.owner">owner</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineGitHubProps.property.repo">repo</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineGitHubProps.property.token">token</a></code> | <code>aws-cdk-lib.SecretValue</code> | *No description.* |

---

##### `owner`<sup>Required</sup> <a name="owner" id="@jompx/constructs.IAppPipelineGitHubProps.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

---

##### `repo`<sup>Required</sup> <a name="repo" id="@jompx/constructs.IAppPipelineGitHubProps.property.repo"></a>

```typescript
public readonly repo: string;
```

- *Type:* string

---

##### `token`<sup>Required</sup> <a name="token" id="@jompx/constructs.IAppPipelineGitHubProps.property.token"></a>

```typescript
public readonly token: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

---

### IAppPipelineProps <a name="IAppPipelineProps" id="@jompx/constructs.IAppPipelineProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppPipelineProps">IAppPipelineProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppPipelineProps.property.appName">appName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineProps.property.codebuildBuildSpecObject">codebuildBuildSpecObject</a></code> | <code>object</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineProps.property.gitHub">gitHub</a></code> | <code><a href="#@jompx/constructs.IAppPipelineGitHubProps">IAppPipelineGitHubProps</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineProps.property.hostingBucket">hostingBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineProps.property.pipelinegBucket">pipelinegBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineProps.property.stage">stage</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppPipelineProps.property.buildEnvironment">buildEnvironment</a></code> | <code>aws-cdk-lib.aws_codebuild.BuildEnvironment</code> | *No description.* |

---

##### `appName`<sup>Required</sup> <a name="appName" id="@jompx/constructs.IAppPipelineProps.property.appName"></a>

```typescript
public readonly appName: string;
```

- *Type:* string

---

##### `codebuildBuildSpecObject`<sup>Required</sup> <a name="codebuildBuildSpecObject" id="@jompx/constructs.IAppPipelineProps.property.codebuildBuildSpecObject"></a>

```typescript
public readonly codebuildBuildSpecObject: object;
```

- *Type:* object

---

##### `gitHub`<sup>Required</sup> <a name="gitHub" id="@jompx/constructs.IAppPipelineProps.property.gitHub"></a>

```typescript
public readonly gitHub: IAppPipelineGitHubProps;
```

- *Type:* <a href="#@jompx/constructs.IAppPipelineGitHubProps">IAppPipelineGitHubProps</a>

---

##### `hostingBucket`<sup>Required</sup> <a name="hostingBucket" id="@jompx/constructs.IAppPipelineProps.property.hostingBucket"></a>

```typescript
public readonly hostingBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `pipelinegBucket`<sup>Required</sup> <a name="pipelinegBucket" id="@jompx/constructs.IAppPipelineProps.property.pipelinegBucket"></a>

```typescript
public readonly pipelinegBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

---

##### `stage`<sup>Required</sup> <a name="stage" id="@jompx/constructs.IAppPipelineProps.property.stage"></a>

```typescript
public readonly stage: string;
```

- *Type:* string

---

##### `buildEnvironment`<sup>Optional</sup> <a name="buildEnvironment" id="@jompx/constructs.IAppPipelineProps.property.buildEnvironment"></a>

```typescript
public readonly buildEnvironment: BuildEnvironment;
```

- *Type:* aws-cdk-lib.aws_codebuild.BuildEnvironment

---

### IAppSyncConnection <a name="IAppSyncConnection" id="@jompx/constructs.IAppSyncConnection"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncConnection">IAppSyncConnection</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncConnection.property.pageInfo">pageInfo</a></code> | <code><a href="#@jompx/constructs.IAppSyncPageInfoOffset">IAppSyncPageInfoOffset</a> \| <a href="#@jompx/constructs.IAppSyncPageInfoCursor">IAppSyncPageInfoCursor</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncConnection.property.edges">edges</a></code> | <code>object</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncConnection.property.totalCount">totalCount</a></code> | <code>number</code> | *No description.* |

---

##### `pageInfo`<sup>Required</sup> <a name="pageInfo" id="@jompx/constructs.IAppSyncConnection.property.pageInfo"></a>

```typescript
public readonly pageInfo: IAppSyncPageInfoOffset | IAppSyncPageInfoCursor;
```

- *Type:* <a href="#@jompx/constructs.IAppSyncPageInfoOffset">IAppSyncPageInfoOffset</a> | <a href="#@jompx/constructs.IAppSyncPageInfoCursor">IAppSyncPageInfoCursor</a>

---

##### `edges`<sup>Optional</sup> <a name="edges" id="@jompx/constructs.IAppSyncConnection.property.edges"></a>

```typescript
public readonly edges: object;
```

- *Type:* object

---

##### `totalCount`<sup>Optional</sup> <a name="totalCount" id="@jompx/constructs.IAppSyncConnection.property.totalCount"></a>

```typescript
public readonly totalCount: number;
```

- *Type:* number

---

### IAppSyncMethodProps <a name="IAppSyncMethodProps" id="@jompx/constructs.IAppSyncMethodProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncMethodProps">IAppSyncMethodProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncMethodProps.property.event">event</a></code> | <code>any</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncMethodProps.property.cognito">cognito</a></code> | <code><a href="#@jompx/constructs.IAppSyncMethodPropsCognito">IAppSyncMethodPropsCognito</a></code> | *No description.* |

---

##### `event`<sup>Required</sup> <a name="event" id="@jompx/constructs.IAppSyncMethodProps.property.event"></a>

```typescript
public readonly event: any;
```

- *Type:* any

---

##### `cognito`<sup>Optional</sup> <a name="cognito" id="@jompx/constructs.IAppSyncMethodProps.property.cognito"></a>

```typescript
public readonly cognito: IAppSyncMethodPropsCognito;
```

- *Type:* <a href="#@jompx/constructs.IAppSyncMethodPropsCognito">IAppSyncMethodPropsCognito</a>

---

### IAppSyncMethodPropsCognito <a name="IAppSyncMethodPropsCognito" id="@jompx/constructs.IAppSyncMethodPropsCognito"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncMethodPropsCognito">IAppSyncMethodPropsCognito</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncMethodPropsCognito.property.authorization">authorization</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncMethodPropsCognito.property.email">email</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncMethodPropsCognito.property.groups">groups</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncMethodPropsCognito.property.sub">sub</a></code> | <code>string</code> | *No description.* |

---

##### `authorization`<sup>Required</sup> <a name="authorization" id="@jompx/constructs.IAppSyncMethodPropsCognito.property.authorization"></a>

```typescript
public readonly authorization: string;
```

- *Type:* string

---

##### `email`<sup>Required</sup> <a name="email" id="@jompx/constructs.IAppSyncMethodPropsCognito.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

---

##### `groups`<sup>Required</sup> <a name="groups" id="@jompx/constructs.IAppSyncMethodPropsCognito.property.groups"></a>

```typescript
public readonly groups: string[];
```

- *Type:* string[]

---

##### `sub`<sup>Required</sup> <a name="sub" id="@jompx/constructs.IAppSyncMethodPropsCognito.property.sub"></a>

```typescript
public readonly sub: string;
```

- *Type:* string

---

### IAppSyncMySqlDataSourceProps <a name="IAppSyncMySqlDataSourceProps" id="@jompx/constructs.IAppSyncMySqlDataSourceProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps">IAppSyncMySqlDataSourceProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps.property.lambdaFunctionProps">lambdaFunctionProps</a></code> | <code>aws-cdk-lib.aws_lambda_nodejs.NodejsFunctionProps</code> | *No description.* |

---

##### `lambdaFunctionProps`<sup>Optional</sup> <a name="lambdaFunctionProps" id="@jompx/constructs.IAppSyncMySqlDataSourceProps.property.lambdaFunctionProps"></a>

```typescript
public readonly lambdaFunctionProps: NodejsFunctionProps;
```

- *Type:* aws-cdk-lib.aws_lambda_nodejs.NodejsFunctionProps

---

### IAppSyncOperationArgs <a name="IAppSyncOperationArgs" id="@jompx/constructs.IAppSyncOperationArgs"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncOperationArgs">IAppSyncOperationArgs</a>



### IAppSyncPageInfoCursor <a name="IAppSyncPageInfoCursor" id="@jompx/constructs.IAppSyncPageInfoCursor"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncPageInfoCursor">IAppSyncPageInfoCursor</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncPageInfoCursor.property.endCursor">endCursor</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncPageInfoCursor.property.hasNextPage">hasNextPage</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncPageInfoCursor.property.hasPreviousPage">hasPreviousPage</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncPageInfoCursor.property.startCursor">startCursor</a></code> | <code>string</code> | *No description.* |

---

##### `endCursor`<sup>Required</sup> <a name="endCursor" id="@jompx/constructs.IAppSyncPageInfoCursor.property.endCursor"></a>

```typescript
public readonly endCursor: string;
```

- *Type:* string

---

##### `hasNextPage`<sup>Required</sup> <a name="hasNextPage" id="@jompx/constructs.IAppSyncPageInfoCursor.property.hasNextPage"></a>

```typescript
public readonly hasNextPage: boolean;
```

- *Type:* boolean

---

##### `hasPreviousPage`<sup>Required</sup> <a name="hasPreviousPage" id="@jompx/constructs.IAppSyncPageInfoCursor.property.hasPreviousPage"></a>

```typescript
public readonly hasPreviousPage: boolean;
```

- *Type:* boolean

---

##### `startCursor`<sup>Required</sup> <a name="startCursor" id="@jompx/constructs.IAppSyncPageInfoCursor.property.startCursor"></a>

```typescript
public readonly startCursor: string;
```

- *Type:* string

---

### IAppSyncPageInfoOffset <a name="IAppSyncPageInfoOffset" id="@jompx/constructs.IAppSyncPageInfoOffset"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncPageInfoOffset">IAppSyncPageInfoOffset</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncPageInfoOffset.property.limit">limit</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncPageInfoOffset.property.skip">skip</a></code> | <code>number</code> | *No description.* |

---

##### `limit`<sup>Required</sup> <a name="limit" id="@jompx/constructs.IAppSyncPageInfoOffset.property.limit"></a>

```typescript
public readonly limit: number;
```

- *Type:* number

---

##### `skip`<sup>Required</sup> <a name="skip" id="@jompx/constructs.IAppSyncPageInfoOffset.property.skip"></a>

```typescript
public readonly skip: number;
```

- *Type:* number

---

### IAppSyncProps <a name="IAppSyncProps" id="@jompx/constructs.IAppSyncProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncProps">IAppSyncProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncProps.property.name">name</a></code> | <code>string</code> | Name of the AppSync GraphQL resource as it appears in the AWS Console. |
| <code><a href="#@jompx/constructs.IAppSyncProps.property.additionalAuthorizationModes">additionalAuthorizationModes</a></code> | <code>@aws-cdk/aws-appsync-alpha.AuthorizationMode[]</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncProps.property.userPool">userPool</a></code> | <code>aws-cdk-lib.aws_cognito.UserPool</code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.IAppSyncProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Name of the AppSync GraphQL resource as it appears in the AWS Console.

---

##### `additionalAuthorizationModes`<sup>Optional</sup> <a name="additionalAuthorizationModes" id="@jompx/constructs.IAppSyncProps.property.additionalAuthorizationModes"></a>

```typescript
public readonly additionalAuthorizationModes: AuthorizationMode[];
```

- *Type:* @aws-cdk/aws-appsync-alpha.AuthorizationMode[]

---

##### `userPool`<sup>Optional</sup> <a name="userPool" id="@jompx/constructs.IAppSyncProps.property.userPool"></a>

```typescript
public readonly userPool: UserPool;
```

- *Type:* aws-cdk-lib.aws_cognito.UserPool

---

### ICdkPipelineGitHubProps <a name="ICdkPipelineGitHubProps" id="@jompx/constructs.ICdkPipelineGitHubProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.ICdkPipelineGitHubProps">ICdkPipelineGitHubProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ICdkPipelineGitHubProps.property.connectionArn">connectionArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICdkPipelineGitHubProps.property.owner">owner</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICdkPipelineGitHubProps.property.repo">repo</a></code> | <code>string</code> | *No description.* |

---

##### `connectionArn`<sup>Required</sup> <a name="connectionArn" id="@jompx/constructs.ICdkPipelineGitHubProps.property.connectionArn"></a>

```typescript
public readonly connectionArn: string;
```

- *Type:* string

---

##### `owner`<sup>Required</sup> <a name="owner" id="@jompx/constructs.ICdkPipelineGitHubProps.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

---

##### `repo`<sup>Required</sup> <a name="repo" id="@jompx/constructs.ICdkPipelineGitHubProps.property.repo"></a>

```typescript
public readonly repo: string;
```

- *Type:* string

---

### ICdkPipelineProps <a name="ICdkPipelineProps" id="@jompx/constructs.ICdkPipelineProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.ICdkPipelineProps">ICdkPipelineProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ICdkPipelineProps.property.gitHub">gitHub</a></code> | <code><a href="#@jompx/constructs.ICdkPipelineGitHubProps">ICdkPipelineGitHubProps</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.ICdkPipelineProps.property.stage">stage</a></code> | <code>string</code> | The CICD stage. |
| <code><a href="#@jompx/constructs.ICdkPipelineProps.property.commands">commands</a></code> | <code>string[]</code> | *No description.* |

---

##### `gitHub`<sup>Required</sup> <a name="gitHub" id="@jompx/constructs.ICdkPipelineProps.property.gitHub"></a>

```typescript
public readonly gitHub: ICdkPipelineGitHubProps;
```

- *Type:* <a href="#@jompx/constructs.ICdkPipelineGitHubProps">ICdkPipelineGitHubProps</a>

---

##### `stage`<sup>Required</sup> <a name="stage" id="@jompx/constructs.ICdkPipelineProps.property.stage"></a>

```typescript
public readonly stage: string;
```

- *Type:* string

The CICD stage.

Typically prod or test.

---

##### `commands`<sup>Optional</sup> <a name="commands" id="@jompx/constructs.ICdkPipelineProps.property.commands"></a>

```typescript
public readonly commands: string[];
```

- *Type:* string[]

---

### ICognitoProps <a name="ICognitoProps" id="@jompx/constructs.ICognitoProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.ICognitoProps">ICognitoProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ICognitoProps.property.name">name</a></code> | <code>string</code> | Name of the Cognito user pool resource as it appears in the AWS Console. |
| <code><a href="#@jompx/constructs.ICognitoProps.property.appCodes">appCodes</a></code> | <code>string[]</code> | List of camelCase app codes. |
| <code><a href="#@jompx/constructs.ICognitoProps.property.userPoolGroups">userPoolGroups</a></code> | <code>aws-cdk-lib.aws_cognito.CfnUserPoolGroupProps[]</code> | List of Cognito user pool groups to create. |
| <code><a href="#@jompx/constructs.ICognitoProps.property.userPoolProps">userPoolProps</a></code> | <code>aws-cdk-lib.aws_cognito.UserPoolProps</code> | Optional CDK user pool props to override AWS and Jompx default prop values. |

---

##### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.ICognitoProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Name of the Cognito user pool resource as it appears in the AWS Console.

---

##### `appCodes`<sup>Optional</sup> <a name="appCodes" id="@jompx/constructs.ICognitoProps.property.appCodes"></a>

```typescript
public readonly appCodes: string[];
```

- *Type:* string[]

List of camelCase app codes.

A user pool client will be created for each app.

---

##### `userPoolGroups`<sup>Optional</sup> <a name="userPoolGroups" id="@jompx/constructs.ICognitoProps.property.userPoolGroups"></a>

```typescript
public readonly userPoolGroups: CfnUserPoolGroupProps[];
```

- *Type:* aws-cdk-lib.aws_cognito.CfnUserPoolGroupProps[]

List of Cognito user pool groups to create.

---

##### `userPoolProps`<sup>Optional</sup> <a name="userPoolProps" id="@jompx/constructs.ICognitoProps.property.userPoolProps"></a>

```typescript
public readonly userPoolProps: UserPoolProps;
```

- *Type:* aws-cdk-lib.aws_cognito.UserPoolProps

Optional CDK user pool props to override AWS and Jompx default prop values.

---

### IConfig <a name="IConfig" id="@jompx/constructs.IConfig"></a>

- *Implemented By:* <a href="#@jompx/constructs.IConfig">IConfig</a>



### ICustomDirectiveLookup <a name="ICustomDirectiveLookup" id="@jompx/constructs.ICustomDirectiveLookup"></a>

- *Implemented By:* <a href="#@jompx/constructs.ICustomDirectiveLookup">ICustomDirectiveLookup</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ICustomDirectiveLookup.property.foreignField">foreignField</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveLookup.property.from">from</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveLookup.property.localField">localField</a></code> | <code>string</code> | *No description.* |

---

##### `foreignField`<sup>Required</sup> <a name="foreignField" id="@jompx/constructs.ICustomDirectiveLookup.property.foreignField"></a>

```typescript
public readonly foreignField: string;
```

- *Type:* string

---

##### `from`<sup>Required</sup> <a name="from" id="@jompx/constructs.ICustomDirectiveLookup.property.from"></a>

```typescript
public readonly from: string;
```

- *Type:* string

---

##### `localField`<sup>Required</sup> <a name="localField" id="@jompx/constructs.ICustomDirectiveLookup.property.localField"></a>

```typescript
public readonly localField: string;
```

- *Type:* string

---

### IDataSource <a name="IDataSource" id="@jompx/constructs.IDataSource"></a>

- *Implemented By:* <a href="#@jompx/constructs.IDataSource">IDataSource</a>



### IEnv <a name="IEnv" id="@jompx/constructs.IEnv"></a>

- *Implemented By:* <a href="#@jompx/constructs.IEnv">IEnv</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IEnv.property.account">account</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IEnv.property.region">region</a></code> | <code>string</code> | *No description.* |

---

##### `account`<sup>Required</sup> <a name="account" id="@jompx/constructs.IEnv.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string

---

##### `region`<sup>Required</sup> <a name="region" id="@jompx/constructs.IEnv.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

---

### IEnvironment <a name="IEnvironment" id="@jompx/constructs.IEnvironment"></a>

- *Implemented By:* <a href="#@jompx/constructs.IEnvironment">IEnvironment</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IEnvironment.property.accountId">accountId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IEnvironment.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IEnvironment.property.region">region</a></code> | <code>string</code> | *No description.* |

---

##### `accountId`<sup>Required</sup> <a name="accountId" id="@jompx/constructs.IEnvironment.property.accountId"></a>

```typescript
public readonly accountId: string;
```

- *Type:* string

---

##### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.IEnvironment.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `region`<sup>Required</sup> <a name="region" id="@jompx/constructs.IEnvironment.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

---

### IEnvironmentPipeline <a name="IEnvironmentPipeline" id="@jompx/constructs.IEnvironmentPipeline"></a>

- *Implemented By:* <a href="#@jompx/constructs.IEnvironmentPipeline">IEnvironmentPipeline</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IEnvironmentPipeline.property.branch">branch</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IEnvironmentPipeline.property.pipeline">pipeline</a></code> | <code>aws-cdk-lib.pipelines.CodePipeline</code> | *No description.* |
| <code><a href="#@jompx/constructs.IEnvironmentPipeline.property.pipelineStage">pipelineStage</a></code> | <code>string</code> | *No description.* |

---

##### `branch`<sup>Required</sup> <a name="branch" id="@jompx/constructs.IEnvironmentPipeline.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

---

##### `pipeline`<sup>Required</sup> <a name="pipeline" id="@jompx/constructs.IEnvironmentPipeline.property.pipeline"></a>

```typescript
public readonly pipeline: CodePipeline;
```

- *Type:* aws-cdk-lib.pipelines.CodePipeline

---

##### `pipelineStage`<sup>Required</sup> <a name="pipelineStage" id="@jompx/constructs.IEnvironmentPipeline.property.pipelineStage"></a>

```typescript
public readonly pipelineStage: string;
```

- *Type:* string

---

### IHostingCertificateProps <a name="IHostingCertificateProps" id="@jompx/constructs.IHostingCertificateProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IHostingCertificateProps">IHostingCertificateProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IHostingCertificateProps.property.rootDomainName">rootDomainName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IHostingCertificateProps.property.restrictCertificateAuthorities">restrictCertificateAuthorities</a></code> | <code>boolean</code> | *No description.* |

---

##### `rootDomainName`<sup>Required</sup> <a name="rootDomainName" id="@jompx/constructs.IHostingCertificateProps.property.rootDomainName"></a>

```typescript
public readonly rootDomainName: string;
```

- *Type:* string

---

##### `restrictCertificateAuthorities`<sup>Optional</sup> <a name="restrictCertificateAuthorities" id="@jompx/constructs.IHostingCertificateProps.property.restrictCertificateAuthorities"></a>

```typescript
public readonly restrictCertificateAuthorities: boolean;
```

- *Type:* boolean

---

### IHostingCloudFrontProps <a name="IHostingCloudFrontProps" id="@jompx/constructs.IHostingCloudFrontProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IHostingCloudFrontProps">IHostingCloudFrontProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IHostingCloudFrontProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | *No description.* |
| <code><a href="#@jompx/constructs.IHostingCloudFrontProps.property.cachePolicyQueryStringAllowList">cachePolicyQueryStringAllowList</a></code> | <code>aws-cdk-lib.aws_cloudfront.CacheQueryStringBehavior</code> | *No description.* |
| <code><a href="#@jompx/constructs.IHostingCloudFrontProps.property.certificate">certificate</a></code> | <code>aws-cdk-lib.aws_certificatemanager.Certificate</code> | *No description.* |
| <code><a href="#@jompx/constructs.IHostingCloudFrontProps.property.domainName">domainName</a></code> | <code>string</code> | *No description.* |

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@jompx/constructs.IHostingCloudFrontProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

---

##### `cachePolicyQueryStringAllowList`<sup>Required</sup> <a name="cachePolicyQueryStringAllowList" id="@jompx/constructs.IHostingCloudFrontProps.property.cachePolicyQueryStringAllowList"></a>

```typescript
public readonly cachePolicyQueryStringAllowList: CacheQueryStringBehavior;
```

- *Type:* aws-cdk-lib.aws_cloudfront.CacheQueryStringBehavior

---

##### `certificate`<sup>Required</sup> <a name="certificate" id="@jompx/constructs.IHostingCloudFrontProps.property.certificate"></a>

```typescript
public readonly certificate: Certificate;
```

- *Type:* aws-cdk-lib.aws_certificatemanager.Certificate

---

##### `domainName`<sup>Required</sup> <a name="domainName" id="@jompx/constructs.IHostingCloudFrontProps.property.domainName"></a>

```typescript
public readonly domainName: string;
```

- *Type:* string

---

### IHostingS3Props <a name="IHostingS3Props" id="@jompx/constructs.IHostingS3Props"></a>

- *Implemented By:* <a href="#@jompx/constructs.IHostingS3Props">IHostingS3Props</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IHostingS3Props.property.domainName">domainName</a></code> | <code>string</code> | *No description.* |

---

##### `domainName`<sup>Required</sup> <a name="domainName" id="@jompx/constructs.IHostingS3Props.property.domainName"></a>

```typescript
public readonly domainName: string;
```

- *Type:* string

---

### ILocalConfig <a name="ILocalConfig" id="@jompx/constructs.ILocalConfig"></a>

- *Implemented By:* <a href="#@jompx/constructs.ILocalConfig">ILocalConfig</a>



### ISchemaTypes <a name="ISchemaTypes" id="@jompx/constructs.ISchemaTypes"></a>

- *Implemented By:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ISchemaTypes.property.enumTypes">enumTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.EnumType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaTypes.property.inputTypes">inputTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.InputType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaTypes.property.interfaceTypes">interfaceTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.InterfaceType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaTypes.property.objectTypes">objectTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.ObjectType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaTypes.property.unionTypes">unionTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.UnionType}</code> | *No description.* |

---

##### `enumTypes`<sup>Required</sup> <a name="enumTypes" id="@jompx/constructs.ISchemaTypes.property.enumTypes"></a>

```typescript
public readonly enumTypes: {[ key: string ]: EnumType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.EnumType}

---

##### `inputTypes`<sup>Required</sup> <a name="inputTypes" id="@jompx/constructs.ISchemaTypes.property.inputTypes"></a>

```typescript
public readonly inputTypes: {[ key: string ]: InputType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.InputType}

---

##### `interfaceTypes`<sup>Required</sup> <a name="interfaceTypes" id="@jompx/constructs.ISchemaTypes.property.interfaceTypes"></a>

```typescript
public readonly interfaceTypes: {[ key: string ]: InterfaceType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.InterfaceType}

---

##### `objectTypes`<sup>Required</sup> <a name="objectTypes" id="@jompx/constructs.ISchemaTypes.property.objectTypes"></a>

```typescript
public readonly objectTypes: {[ key: string ]: ObjectType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.ObjectType}

---

##### `unionTypes`<sup>Required</sup> <a name="unionTypes" id="@jompx/constructs.ISchemaTypes.property.unionTypes"></a>

```typescript
public readonly unionTypes: {[ key: string ]: UnionType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.UnionType}

---

### IStage <a name="IStage" id="@jompx/constructs.IStage"></a>

- *Implemented By:* <a href="#@jompx/constructs.IStage">IStage</a>



### IStageDeployment <a name="IStageDeployment" id="@jompx/constructs.IStageDeployment"></a>

- *Implemented By:* <a href="#@jompx/constructs.IStageDeployment">IStageDeployment</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IStageDeployment.property.environmentName">environmentName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IStageDeployment.property.type">type</a></code> | <code>string</code> | *No description.* |

---

##### `environmentName`<sup>Required</sup> <a name="environmentName" id="@jompx/constructs.IStageDeployment.property.environmentName"></a>

```typescript
public readonly environmentName: string;
```

- *Type:* string

---

##### `type`<sup>Required</sup> <a name="type" id="@jompx/constructs.IStageDeployment.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

---

