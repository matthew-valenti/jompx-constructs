# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

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
| <code><a href="#@jompx/constructs.AppSync.addDataSource">addDataSource</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSync.addSchemaTypes">addSchemaTypes</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSync.createSchema">createSchema</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@jompx/constructs.AppSync.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addDataSource` <a name="addDataSource" id="@jompx/constructs.AppSync.addDataSource"></a>

```typescript
public addDataSource(id: string, lambdaFunction: IFunction, options?: DataSourceOptions): void
```

###### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.AppSync.addDataSource.parameter.id"></a>

- *Type:* string

---

###### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@jompx/constructs.AppSync.addDataSource.parameter.lambdaFunction"></a>

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

###### `options`<sup>Optional</sup> <a name="options" id="@jompx/constructs.AppSync.addDataSource.parameter.options"></a>

- *Type:* @aws-cdk/aws-appsync-alpha.DataSourceOptions

---

##### `addSchemaTypes` <a name="addSchemaTypes" id="@jompx/constructs.AppSync.addSchemaTypes"></a>

```typescript
public addSchemaTypes(schemaTypes: ISchemaType): void
```

###### `schemaTypes`<sup>Required</sup> <a name="schemaTypes" id="@jompx/constructs.AppSync.addSchemaTypes.parameter.schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaType">ISchemaType</a>

---

##### `createSchema` <a name="createSchema" id="@jompx/constructs.AppSync.createSchema"></a>

```typescript
public createSchema(): void
```

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
| <code><a href="#@jompx/constructs.AppSync.property.dataSources">dataSources</a></code> | <code><a href="#@jompx/constructs.IDataSource">IDataSource</a>[]</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSync.property.graphqlApi">graphqlApi</a></code> | <code>@aws-cdk/aws-appsync-alpha.GraphqlApi</code> | *No description.* |
| <code><a href="#@jompx/constructs.AppSync.property.schemaTypes">schemaTypes</a></code> | <code><a href="#@jompx/constructs.ISchemaType">ISchemaType</a></code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.AppSync.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `dataSources`<sup>Required</sup> <a name="dataSources" id="@jompx/constructs.AppSync.property.dataSources"></a>

```typescript
public readonly dataSources: IDataSource[];
```

- *Type:* <a href="#@jompx/constructs.IDataSource">IDataSource</a>[]

---

##### `graphqlApi`<sup>Required</sup> <a name="graphqlApi" id="@jompx/constructs.AppSync.property.graphqlApi"></a>

```typescript
public readonly graphqlApi: GraphqlApi;
```

- *Type:* @aws-cdk/aws-appsync-alpha.GraphqlApi

---

##### `schemaTypes`<sup>Required</sup> <a name="schemaTypes" id="@jompx/constructs.AppSync.property.schemaTypes"></a>

```typescript
public readonly schemaTypes: ISchemaType;
```

- *Type:* <a href="#@jompx/constructs.ISchemaType">ISchemaType</a>

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

Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild-readme.html  Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html  TODO: nx affected: https://nx.dev/ci/monorepo-ci-circle-ci    * TODO deploy in parallel: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html  TODO: Trigger apps pipeline https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit.

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


### JompxS3 <a name="JompxS3" id="@jompx/constructs.JompxS3"></a>

#### Initializers <a name="Initializers" id="@jompx/constructs.JompxS3.Initializer"></a>

```typescript
import { JompxS3 } from '@jompx/constructs'

new JompxS3(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxS3.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.JompxS3.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.JompxS3.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.JompxS3.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.JompxS3.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.JompxS3.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.JompxS3.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@jompx/constructs.JompxS3.isConstruct"></a>

```typescript
import { JompxS3 } from '@jompx/constructs'

JompxS3.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct` instances, even when the construct library is symlinked.  Explanation: in JavaScript, multiple copies of the `constructs` library on disk are seen as independent, completely different libraries. As a consequence, the class `Construct` in each copy of the `constructs` library is seen as a different class, and an instance of one class will not test as `instanceof` the other class. `npm install` will not create installations like this, but users may manually symlink construct libraries together or use a monorepo tool: in those cases, multiple copies of the `constructs` library can be accidentally installed, and `instanceof` will behave unpredictably. It is safest to avoid using `instanceof`, and using this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.JompxS3.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxS3.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.JompxS3.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---



## Classes <a name="Classes" id="Classes"></a>

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
| <code><a href="#@jompx/constructs.Config.env">env</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.environmentByAccountId">environmentByAccountId</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.environmentByName">environmentByName</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.environments">environments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.organizationName">organizationName</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.organizationNamePascalCase">organizationNamePascalCase</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.stage">stage</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.stageEnvironments">stageEnvironments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.stages">stages</a></code> | *No description.* |

---

##### `env` <a name="env" id="@jompx/constructs.Config.env"></a>

```typescript
public env(type: string, stageName?: string): Environment
```

###### `type`<sup>Required</sup> <a name="type" id="@jompx/constructs.Config.env.parameter.type"></a>

- *Type:* string

---

###### `stageName`<sup>Optional</sup> <a name="stageName" id="@jompx/constructs.Config.env.parameter.stageName"></a>

- *Type:* string

---

##### `environmentByAccountId` <a name="environmentByAccountId" id="@jompx/constructs.Config.environmentByAccountId"></a>

```typescript
public environmentByAccountId(accountId: string): IEnvironment
```

###### `accountId`<sup>Required</sup> <a name="accountId" id="@jompx/constructs.Config.environmentByAccountId.parameter.accountId"></a>

- *Type:* string

---

##### `environmentByName` <a name="environmentByName" id="@jompx/constructs.Config.environmentByName"></a>

```typescript
public environmentByName(name: string): IEnvironment
```

###### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.Config.environmentByName.parameter.name"></a>

- *Type:* string

---

##### `environments` <a name="environments" id="@jompx/constructs.Config.environments"></a>

```typescript
public environments(): IEnvironment[]
```

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

##### `stageEnvironments` <a name="stageEnvironments" id="@jompx/constructs.Config.stageEnvironments"></a>

```typescript
public stageEnvironments(stageName: string): IStageEnvironment[]
```

###### `stageName`<sup>Required</sup> <a name="stageName" id="@jompx/constructs.Config.stageEnvironments.parameter.stageName"></a>

- *Type:* string

---

##### `stages` <a name="stages" id="@jompx/constructs.Config.stages"></a>

```typescript
public stages(): IStage
```


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


## Protocols <a name="Protocols" id="Protocols"></a>

### IAppSyncDataSourceLambdaProps <a name="IAppSyncDataSourceLambdaProps" id="@jompx/constructs.IAppSyncDataSourceLambdaProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncDataSourceLambdaProps">IAppSyncDataSourceLambdaProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncDataSourceLambdaProps.property.memorySize">memorySize</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@jompx/constructs.IAppSyncDataSourceLambdaProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | *No description.* |

---

##### `memorySize`<sup>Required</sup> <a name="memorySize" id="@jompx/constructs.IAppSyncDataSourceLambdaProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* number

---

##### `timeout`<sup>Required</sup> <a name="timeout" id="@jompx/constructs.IAppSyncDataSourceLambdaProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

---

### IAppSyncMySqlDataSourceProps <a name="IAppSyncMySqlDataSourceProps" id="@jompx/constructs.IAppSyncMySqlDataSourceProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps">IAppSyncMySqlDataSourceProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncMySqlDataSourceProps.property.lambda">lambda</a></code> | <code><a href="#@jompx/constructs.IAppSyncDataSourceLambdaProps">IAppSyncDataSourceLambdaProps</a></code> | *No description.* |

---

##### `lambda`<sup>Optional</sup> <a name="lambda" id="@jompx/constructs.IAppSyncMySqlDataSourceProps.property.lambda"></a>

```typescript
public readonly lambda: IAppSyncDataSourceLambdaProps;
```

- *Type:* <a href="#@jompx/constructs.IAppSyncDataSourceLambdaProps">IAppSyncDataSourceLambdaProps</a>

---

### IAppSyncProps <a name="IAppSyncProps" id="@jompx/constructs.IAppSyncProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IAppSyncProps">IAppSyncProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IAppSyncProps.property.name">name</a></code> | <code>string</code> | Name of the AppSync GraphQL resource as it appears in the AWS Console. |

---

##### `name`<sup>Optional</sup> <a name="name" id="@jompx/constructs.IAppSyncProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Name of the AppSync GraphQL resource as it appears in the AWS Console.

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
| <code><a href="#@jompx/constructs.ICdkPipelineProps.property.stage">stage</a></code> | <code>string</code> | *No description.* |
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

---

##### `commands`<sup>Optional</sup> <a name="commands" id="@jompx/constructs.ICdkPipelineProps.property.commands"></a>

```typescript
public readonly commands: string[];
```

- *Type:* string[]

---

### IConfig <a name="IConfig" id="@jompx/constructs.IConfig"></a>

- *Implemented By:* <a href="#@jompx/constructs.IConfig">IConfig</a>



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

### ILocalConfig <a name="ILocalConfig" id="@jompx/constructs.ILocalConfig"></a>

- *Implemented By:* <a href="#@jompx/constructs.ILocalConfig">ILocalConfig</a>



### ISchemaType <a name="ISchemaType" id="@jompx/constructs.ISchemaType"></a>

- *Implemented By:* <a href="#@jompx/constructs.ISchemaType">ISchemaType</a>



### IStage <a name="IStage" id="@jompx/constructs.IStage"></a>

- *Implemented By:* <a href="#@jompx/constructs.IStage">IStage</a>



### IStageEnvironment <a name="IStageEnvironment" id="@jompx/constructs.IStageEnvironment"></a>

- *Implemented By:* <a href="#@jompx/constructs.IStageEnvironment">IStageEnvironment</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IStageEnvironment.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IStageEnvironment.property.type">type</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IStageEnvironment.property.account">account</a></code> | <code><a href="#@jompx/constructs.IEnvironment">IEnvironment</a></code> | *No description.* |

---

##### `name`<sup>Required</sup> <a name="name" id="@jompx/constructs.IStageEnvironment.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `type`<sup>Required</sup> <a name="type" id="@jompx/constructs.IStageEnvironment.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

---

##### `account`<sup>Optional</sup> <a name="account" id="@jompx/constructs.IStageEnvironment.property.account"></a>

```typescript
public readonly account: IEnvironment;
```

- *Type:* <a href="#@jompx/constructs.IEnvironment">IEnvironment</a>

---

