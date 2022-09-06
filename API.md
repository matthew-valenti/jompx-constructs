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
| <code><a href="#@jompx/constructs.AppSync.property.activeAuthorizationTypes">activeAuthorizationTypes</a></code> | <code>@aws-cdk/aws-appsync-alpha.AuthorizationType[]</code> | *No description.* |
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

##### `activeAuthorizationTypes`<sup>Required</sup> <a name="activeAuthorizationTypes" id="@jompx/constructs.AppSync.property.activeAuthorizationTypes"></a>

```typescript
public readonly activeAuthorizationTypes: AuthorizationType[];
```

- *Type:* @aws-cdk/aws-appsync-alpha.AuthorizationType[]

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
| <code><a href="#@jompx/constructs.AppSyncMySqlDataSource.property.props">props</a></code> | <code><a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps">IAppSyncMySqlDataSourceProps</a></code> | *No description.* |

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

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.AppSyncMySqlDataSource.property.props"></a>

```typescript
public readonly props: IAppSyncMySqlDataSourceProps;
```

- *Type:* <a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps">IAppSyncMySqlDataSourceProps</a>

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

AppSyncResolver.callMethodFromEvent(classInstance: any, event: any)
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



### AppSyncSchemaBuilder <a name="AppSyncSchemaBuilder" id="@jompx/constructs.AppSyncSchemaBuilder"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.AppSyncSchemaBuilder.Initializer"></a>

```typescript
import { AppSyncSchemaBuilder } from '@jompx/constructs'

new AppSyncSchemaBuilder(graphqlApi: GraphqlApi, activeAuthorizationTypes: AuthorizationType[])
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.Initializer.parameter.graphqlApi">graphqlApi</a></code> | <code>@aws-cdk/aws-appsync-alpha.GraphqlApi</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.Initializer.parameter.activeAuthorizationTypes">activeAuthorizationTypes</a></code> | <code>@aws-cdk/aws-appsync-alpha.AuthorizationType[]</code> | *No description.* |

---

##### `graphqlApi`<sup>Required</sup> <a name="graphqlApi" id="@jompx/constructs.AppSyncSchemaBuilder.Initializer.parameter.graphqlApi"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.GraphqlApi

---

##### `activeAuthorizationTypes`<sup>Required</sup> <a name="activeAuthorizationTypes" id="@jompx/constructs.AppSyncSchemaBuilder.Initializer.parameter.activeAuthorizationTypes"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.AuthorizationType[]

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.addDataSource">addDataSource</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.addMutation">addMutation</a></code> | Add a mutation to the GraphQL schema. |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.addOperationInputs">addOperationInputs</a></code> | Iterate a list or nested list of AppSync fields and create input type(s). |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.addOperationOutputs">addOperationOutputs</a></code> | Iterate a list or nested list of AppSync fields and create output type(s). |
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
public addMutation(__0: IAddMutationArgs): ObjectType
```

Add a mutation to the GraphQL schema.

Wrap input in input type and output in output type. https://graphql-rules.com/rules/mutation-payload

###### `__0`<sup>Required</sup> <a name="__0" id="@jompx/constructs.AppSyncSchemaBuilder.addMutation.parameter.__0"></a>

- *Type:* <a href="#@jompx/constructs.IAddMutationArgs">IAddMutationArgs</a>

---

##### `addOperationInputs` <a name="addOperationInputs" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationInputs"></a>

```typescript
public addOperationInputs(name: string, operationFields: IAppSyncOperationFields, suffix?: string): InputType
```

Iterate a list or nested list of AppSync fields and create input type(s).

GraphQL doesn't support nested types so create a type for each nested type recursively. Types are added to the graphqlApi.

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationInputs.parameter.name"></a>

- *Type:* string

Create an input type with this name and an "Input" suffix.

---

###### `operationFields`<sup>Required</sup> <a name="operationFields" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationInputs.parameter.operationFields"></a>

- *Type:* <a href="#@jompx/constructs.IAppSyncOperationFields">IAppSyncOperationFields</a>

list of fields or nested list of AppSync fields e.g.{number1: GraphqlType.int(),number2: GraphqlType.int(),test: {number1: GraphqlType.int(),number2: GraphqlType.int(),}};

---

###### `suffix`<sup>Optional</sup> <a name="suffix" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationInputs.parameter.suffix"></a>

- *Type:* string

---

##### `addOperationOutputs` <a name="addOperationOutputs" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationOutputs"></a>

```typescript
public addOperationOutputs(name: string, operationFields: IAppSyncOperationFields, directives: Directive[], suffix?: string): ObjectType
```

Iterate a list or nested list of AppSync fields and create output type(s).

GraphQL doesn't support nested types so create a type for each nested type recursively. Types are added to the graphqlApi.

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationOutputs.parameter.name"></a>

- *Type:* string

Create an output type with this name and an "Output" suffix.

---

###### `operationFields`<sup>Required</sup> <a name="operationFields" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationOutputs.parameter.operationFields"></a>

- *Type:* <a href="#@jompx/constructs.IAppSyncOperationFields">IAppSyncOperationFields</a>

list of fields or nested list of AppSync fields e.g.{number1: GraphqlType.int(),number2: GraphqlType.int(),test: {number1: GraphqlType.int(),number2: GraphqlType.int(),}};

---

###### `directives`<sup>Required</sup> <a name="directives" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationOutputs.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

###### `suffix`<sup>Optional</sup> <a name="suffix" id="@jompx/constructs.AppSyncSchemaBuilder.addOperationOutputs.parameter.suffix"></a>

- *Type:* string

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
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.property.activeAuthorizationTypes">activeAuthorizationTypes</a></code> | <code>@aws-cdk/aws-appsync-alpha.AuthorizationType[]</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.property.dataSources">dataSources</a></code> | <code><a href="#@jompx/constructs.IDataSource">IDataSource</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.property.graphqlApi">graphqlApi</a></code> | <code>@aws-cdk/aws-appsync-alpha.GraphqlApi</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSyncSchemaBuilder.property.schemaTypes">schemaTypes</a></code> | <code><a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a></code> | *No description.* |

---

##### `activeAuthorizationTypes`<sup>Required</sup> <a name="activeAuthorizationTypes" id="@jompx/constructs.AppSyncSchemaBuilder.property.activeAuthorizationTypes"></a>

```typescript
public readonly activeAuthorizationTypes: AuthorizationType[];
```

- *Type:* @aws-cdk/aws-appsync-alpha.AuthorizationType[]

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


### AuthDirective <a name="AuthDirective" id="@jompx/constructs.AuthDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.AuthDirective.Initializer"></a>

```typescript
import { AuthDirective } from '@jompx/constructs'

new AuthDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AuthDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.AuthDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.AuthDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.AuthDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.AuthDirective.schema"></a>

```typescript
public schema(schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `schemaTypes`<sup>Required</sup> <a name="schemaTypes" id="@jompx/constructs.AuthDirective.schema.parameter.schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

---

##### `value` <a name="value" id="@jompx/constructs.AuthDirective.value"></a>

```typescript
public value(directives?: Directive[]): ICustomDirectiveAuthRule[]
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.AuthDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.AuthDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AuthDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AuthDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.AuthDirective.decodeArgument"></a>

```typescript
import { AuthDirective } from '@jompx/constructs'

AuthDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.AuthDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.AuthDirective.encodeArguments"></a>

```typescript
import { AuthDirective } from '@jompx/constructs'

AuthDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.AuthDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.AuthDirective.getIdentifierArgument"></a>

```typescript
import { AuthDirective } from '@jompx/constructs'

AuthDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.AuthDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.AuthDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.AuthDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

---



### CognitoDirective <a name="CognitoDirective" id="@jompx/constructs.CognitoDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.CognitoDirective.Initializer"></a>

```typescript
import { CognitoDirective } from '@jompx/constructs'

new CognitoDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.CognitoDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.CognitoDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.CognitoDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.CognitoDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.CognitoDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.CognitoDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

Global list of types.

---

##### `value` <a name="value" id="@jompx/constructs.CognitoDirective.value"></a>

```typescript
public value(directives?: Directive[]): boolean
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.CognitoDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.CognitoDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CognitoDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CognitoDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.CognitoDirective.decodeArgument"></a>

```typescript
import { CognitoDirective } from '@jompx/constructs'

CognitoDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.CognitoDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.CognitoDirective.encodeArguments"></a>

```typescript
import { CognitoDirective } from '@jompx/constructs'

CognitoDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.CognitoDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.CognitoDirective.getIdentifierArgument"></a>

```typescript
import { CognitoDirective } from '@jompx/constructs'

CognitoDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.CognitoDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.CognitoDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.CognitoDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

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

Abstract custom directive class.

Custom directives to extend this class and implement abstract methods. AppSync supports string value directives only. Documentation: https://www.apollographql.com/docs/apollo-server/schema/creating-directives/

#### Initializers <a name="Initializers" id="@jompx/constructs.CustomDirective.Initializer"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

new CustomDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.CustomDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.CustomDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |

---

##### `definition` <a name="definition" id="@jompx/constructs.CustomDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.CustomDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.CustomDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

Global list of types.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.CustomDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CustomDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.CustomDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.CustomDirective.decodeArgument"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.CustomDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.CustomDirective.encodeArguments"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.CustomDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.CustomDirective.getIdentifierArgument"></a>

```typescript
import { CustomDirective } from '@jompx/constructs'

CustomDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.CustomDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.CustomDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.CustomDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

---



### DatasourceDirective <a name="DatasourceDirective" id="@jompx/constructs.DatasourceDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.DatasourceDirective.Initializer"></a>

```typescript
import { DatasourceDirective } from '@jompx/constructs'

new DatasourceDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.DatasourceDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.DatasourceDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.DatasourceDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.DatasourceDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.DatasourceDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.DatasourceDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

Global list of types.

---

##### `value` <a name="value" id="@jompx/constructs.DatasourceDirective.value"></a>

```typescript
public value(directives?: Directive[]): string
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.DatasourceDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.DatasourceDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.DatasourceDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.DatasourceDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.DatasourceDirective.decodeArgument"></a>

```typescript
import { DatasourceDirective } from '@jompx/constructs'

DatasourceDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.DatasourceDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.DatasourceDirective.encodeArguments"></a>

```typescript
import { DatasourceDirective } from '@jompx/constructs'

DatasourceDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.DatasourceDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.DatasourceDirective.getIdentifierArgument"></a>

```typescript
import { DatasourceDirective } from '@jompx/constructs'

DatasourceDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.DatasourceDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.DatasourceDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.DatasourceDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

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


### LookupDirective <a name="LookupDirective" id="@jompx/constructs.LookupDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.LookupDirective.Initializer"></a>

```typescript
import { LookupDirective } from '@jompx/constructs'

new LookupDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.LookupDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.LookupDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.LookupDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.LookupDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.LookupDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.LookupDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

Global list of types.

---

##### `value` <a name="value" id="@jompx/constructs.LookupDirective.value"></a>

```typescript
public value(directives?: Directive[]): ICustomDirectiveLookup
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.LookupDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.LookupDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.LookupDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.LookupDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.LookupDirective.decodeArgument"></a>

```typescript
import { LookupDirective } from '@jompx/constructs'

LookupDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.LookupDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.LookupDirective.encodeArguments"></a>

```typescript
import { LookupDirective } from '@jompx/constructs'

LookupDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.LookupDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.LookupDirective.getIdentifierArgument"></a>

```typescript
import { LookupDirective } from '@jompx/constructs'

LookupDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.LookupDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.LookupDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.LookupDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

---



### OperationsDirective <a name="OperationsDirective" id="@jompx/constructs.OperationsDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.OperationsDirective.Initializer"></a>

```typescript
import { OperationsDirective } from '@jompx/constructs'

new OperationsDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.OperationsDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.OperationsDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.OperationsDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.OperationsDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.OperationsDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.OperationsDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

---

##### `value` <a name="value" id="@jompx/constructs.OperationsDirective.value"></a>

```typescript
public value(directives?: Directive[]): string[]
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.OperationsDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.OperationsDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.OperationsDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.OperationsDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.OperationsDirective.decodeArgument"></a>

```typescript
import { OperationsDirective } from '@jompx/constructs'

OperationsDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.OperationsDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.OperationsDirective.encodeArguments"></a>

```typescript
import { OperationsDirective } from '@jompx/constructs'

OperationsDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.OperationsDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.OperationsDirective.getIdentifierArgument"></a>

```typescript
import { OperationsDirective } from '@jompx/constructs'

OperationsDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.OperationsDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.OperationsDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.OperationsDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

---



### PaginationDirective <a name="PaginationDirective" id="@jompx/constructs.PaginationDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.PaginationDirective.Initializer"></a>

```typescript
import { PaginationDirective } from '@jompx/constructs'

new PaginationDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.PaginationDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.PaginationDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.PaginationDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.PaginationDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.PaginationDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.PaginationDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

Global list of types.

---

##### `value` <a name="value" id="@jompx/constructs.PaginationDirective.value"></a>

```typescript
public value(directives?: Directive[]): string
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.PaginationDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.PaginationDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.PaginationDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.PaginationDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.PaginationDirective.decodeArgument"></a>

```typescript
import { PaginationDirective } from '@jompx/constructs'

PaginationDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.PaginationDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.PaginationDirective.encodeArguments"></a>

```typescript
import { PaginationDirective } from '@jompx/constructs'

PaginationDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.PaginationDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.PaginationDirective.getIdentifierArgument"></a>

```typescript
import { PaginationDirective } from '@jompx/constructs'

PaginationDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.PaginationDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.PaginationDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.PaginationDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

---



### ReadonlyDirective <a name="ReadonlyDirective" id="@jompx/constructs.ReadonlyDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.ReadonlyDirective.Initializer"></a>

```typescript
import { ReadonlyDirective } from '@jompx/constructs'

new ReadonlyDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.ReadonlyDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.ReadonlyDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.ReadonlyDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.ReadonlyDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.ReadonlyDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.ReadonlyDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

Global list of types.

---

##### `value` <a name="value" id="@jompx/constructs.ReadonlyDirective.value"></a>

```typescript
public value(directives?: Directive[]): boolean
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.ReadonlyDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.ReadonlyDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.ReadonlyDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.ReadonlyDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.ReadonlyDirective.decodeArgument"></a>

```typescript
import { ReadonlyDirective } from '@jompx/constructs'

ReadonlyDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.ReadonlyDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.ReadonlyDirective.encodeArguments"></a>

```typescript
import { ReadonlyDirective } from '@jompx/constructs'

ReadonlyDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.ReadonlyDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.ReadonlyDirective.getIdentifierArgument"></a>

```typescript
import { ReadonlyDirective } from '@jompx/constructs'

ReadonlyDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.ReadonlyDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.ReadonlyDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.ReadonlyDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

---



### SourceDirective <a name="SourceDirective" id="@jompx/constructs.SourceDirective"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.SourceDirective.Initializer"></a>

```typescript
import { SourceDirective } from '@jompx/constructs'

new SourceDirective()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.SourceDirective.definition">definition</a></code> | Directive definition (to be added to GraphQL schema). |
| <code><a href="#@jompx/constructs.SourceDirective.schema">schema</a></code> | Directive schema (to be to added to GraphQL schema). |
| <code><a href="#@jompx/constructs.SourceDirective.value">value</a></code> | *No description.* |

---

##### `definition` <a name="definition" id="@jompx/constructs.SourceDirective.definition"></a>

```typescript
public definition(): string
```

Directive definition (to be added to GraphQL schema).

Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION

##### `schema` <a name="schema" id="@jompx/constructs.SourceDirective.schema"></a>

```typescript
public schema(_schemaTypes: ISchemaTypes): void
```

Directive schema (to be to added to GraphQL schema).

e.g. Auth directives adds enums and input types (required to support the definition).

###### `_schemaTypes`<sup>Required</sup> <a name="_schemaTypes" id="@jompx/constructs.SourceDirective.schema.parameter._schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaTypes">ISchemaTypes</a>

Global list of types.

---

##### `value` <a name="value" id="@jompx/constructs.SourceDirective.value"></a>

```typescript
public value(directives?: Directive[]): string
```

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.SourceDirective.value.parameter.directives"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.Directive[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.SourceDirective.decodeArgument">decodeArgument</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.SourceDirective.encodeArguments">encodeArguments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.SourceDirective.getIdentifierArgument">getIdentifierArgument</a></code> | *No description.* |

---

##### `decodeArgument` <a name="decodeArgument" id="@jompx/constructs.SourceDirective.decodeArgument"></a>

```typescript
import { SourceDirective } from '@jompx/constructs'

SourceDirective.decodeArgument(encodedJson: string)
```

###### `encodedJson`<sup>Required</sup> <a name="encodedJson" id="@jompx/constructs.SourceDirective.decodeArgument.parameter.encodedJson"></a>

- *Type:* string

---

##### `encodeArguments` <a name="encodeArguments" id="@jompx/constructs.SourceDirective.encodeArguments"></a>

```typescript
import { SourceDirective } from '@jompx/constructs'

SourceDirective.encodeArguments(json: any)
```

###### `json`<sup>Required</sup> <a name="json" id="@jompx/constructs.SourceDirective.encodeArguments.parameter.json"></a>

- *Type:* any

---

##### `getIdentifierArgument` <a name="getIdentifierArgument" id="@jompx/constructs.SourceDirective.getIdentifierArgument"></a>

```typescript
import { SourceDirective } from '@jompx/constructs'

SourceDirective.getIdentifierArgument(identifier: string, argument: string, directives?: any[])
```

###### `identifier`<sup>Required</sup> <a name="identifier" id="@jompx/constructs.SourceDirective.getIdentifierArgument.parameter.identifier"></a>

- *Type:* string

---

###### `argument`<sup>Required</sup> <a name="argument" id="@jompx/constructs.SourceDirective.getIdentifierArgument.parameter.argument"></a>

- *Type:* string

---

###### `directives`<sup>Optional</sup> <a name="directives" id="@jompx/constructs.SourceDirective.getIdentifierArgument.parameter.directives"></a>

- *Type:* any[]

---



## Protocols <a name="Protocols" id="Protocols"></a>

### IAddMutationArgs <a name="IAddMutationArgs" id="@jompx/constructs.IAddMutationArgs"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAddMutationArgs">IAddMutationArgs</a>

GraphQL Spec: https://spec.graphql.org/. Mostly for the backend but good to know about. Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/ Support relay or not? https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066 Joins should be connections and named as such. e.g. in post TagsConnection https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo https://graphql-rules.com/rules/list-pagination https://www.apollographql.com/blog/graphql/basics/designing-graphql-mutations/ - Mutation: Use top level input type for ags. Use top level property for output type.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAddMutationArgs.property.auth">auth</a></code> | <code>@aws-cdk/aws-appsync-alpha.Directive</code> | List of auth rules to apply to the mutation and output type. |
| <code><a href="#@jompx/constructs.IAddMutationArgs.property.dataSourceName">dataSourceName</a></code> | <code>string</code> | The mutation datasource. |
| <code><a href="#@jompx/constructs.IAddMutationArgs.property.input">input</a></code> | <code><a href="#@jompx/constructs.IAppSyncOperationFields">IAppSyncOperationFields</a> \| @aws-cdk/aws-appsync-alpha.InputType</code> | Mutation input (arguments wrapped in an input property). |
| <code><a href="#@jompx/constructs.IAddMutationArgs.property.name">name</a></code> | <code>string</code> | The name of the mutation as it will appear in the GraphQL schema. |
| <code><a href="#@jompx/constructs.IAddMutationArgs.property.output">output</a></code> | <code><a href="#@jompx/constructs.IAppSyncOperationFields">IAppSyncOperationFields</a> \| @aws-cdk/aws-appsync-alpha.ObjectType</code> | Mutation output (return value). |
| <code><a href="#@jompx/constructs.IAddMutationArgs.property.methodName">methodName</a></code> | <code>string</code> | The class method to call on request mutation. |

---

##### `auth`<sup>Required</sup> <a name="auth" id="@jompx/constructs.IAddMutationArgs.property.auth"></a>

```typescript
public readonly auth: Directive;
```

- *Type:* @aws-cdk/aws-appsync-alpha.Directive

List of auth rules to apply to the mutation and output type.

---

##### `dataSourceName`<sup>Required</sup> <a name="dataSourceName" id="@jompx/constructs.IAddMutationArgs.property.dataSourceName"></a>

```typescript
public readonly dataSourceName: string;
```

- *Type:* string

The mutation datasource.

---

##### `input`<sup>Required</sup> <a name="input" id="@jompx/constructs.IAddMutationArgs.property.input"></a>

```typescript
public readonly input: IAppSyncOperationFields | InputType;
```

- *Type:* <a href="#@jompx/constructs.IAppSyncOperationFields">IAppSyncOperationFields</a> | @aws-cdk/aws-appsync-alpha.InputType

Mutation input (arguments wrapped in an input property).

---

##### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.IAddMutationArgs.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the mutation as it will appear in the GraphQL schema.

---

##### `output`<sup>Required</sup> <a name="output" id="@jompx/constructs.IAddMutationArgs.property.output"></a>

```typescript
public readonly output: IAppSyncOperationFields | ObjectType;
```

- *Type:* <a href="#@jompx/constructs.IAppSyncOperationFields">IAppSyncOperationFields</a> | @aws-cdk/aws-appsync-alpha.ObjectType

Mutation output (return value).

---

##### `methodName`<sup>Optional</sup> <a name="methodName" id="@jompx/constructs.IAddMutationArgs.property.methodName"></a>

```typescript
public readonly methodName: string;
```

- *Type:* string

The class method to call on request mutation.

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

### IAppSyncOperationFields <a name="IAppSyncOperationFields" id="@jompx/constructs.IAppSyncOperationFields"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncOperationFields">IAppSyncOperationFields</a>



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



### ICustomDirectiveAuthRule <a name="ICustomDirectiveAuthRule" id="@jompx/constructs.ICustomDirectiveAuthRule"></a>

- *Implemented By:* <a href="#@jompx/constructs.ICustomDirectiveAuthRule">ICustomDirectiveAuthRule</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.allow">allow</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.provider">provider</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.groupClaim">groupClaim</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.groups">groups</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.groupsField">groupsField</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.identityClaim">identityClaim</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.operations">operations</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICustomDirectiveAuthRule.property.ownerField">ownerField</a></code> | <code>string</code> | *No description.* |

---

##### `allow`<sup>Required</sup> <a name="allow" id="@jompx/constructs.ICustomDirectiveAuthRule.property.allow"></a>

```typescript
public readonly allow: string;
```

- *Type:* string

---

##### `provider`<sup>Required</sup> <a name="provider" id="@jompx/constructs.ICustomDirectiveAuthRule.property.provider"></a>

```typescript
public readonly provider: string;
```

- *Type:* string

---

##### `groupClaim`<sup>Optional</sup> <a name="groupClaim" id="@jompx/constructs.ICustomDirectiveAuthRule.property.groupClaim"></a>

```typescript
public readonly groupClaim: string;
```

- *Type:* string

---

##### `groups`<sup>Optional</sup> <a name="groups" id="@jompx/constructs.ICustomDirectiveAuthRule.property.groups"></a>

```typescript
public readonly groups: string[];
```

- *Type:* string[]

---

##### `groupsField`<sup>Optional</sup> <a name="groupsField" id="@jompx/constructs.ICustomDirectiveAuthRule.property.groupsField"></a>

```typescript
public readonly groupsField: string;
```

- *Type:* string

---

##### `identityClaim`<sup>Optional</sup> <a name="identityClaim" id="@jompx/constructs.ICustomDirectiveAuthRule.property.identityClaim"></a>

```typescript
public readonly identityClaim: string;
```

- *Type:* string

---

##### `operations`<sup>Optional</sup> <a name="operations" id="@jompx/constructs.ICustomDirectiveAuthRule.property.operations"></a>

```typescript
public readonly operations: string[];
```

- *Type:* string[]

---

##### `ownerField`<sup>Optional</sup> <a name="ownerField" id="@jompx/constructs.ICustomDirectiveAuthRule.property.ownerField"></a>

```typescript
public readonly ownerField: string;
```

- *Type:* string

---

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

