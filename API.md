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
| <code><a href="#@jompx/constructs.AppSync.property.dataSources">dataSources</a></code> | <code><a href="#@jompx/constructs.IDataSource">IDataSource</a></code> | *No description.* |
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
public readonly dataSources: IDataSource;
```

- *Type:* <a href="#@jompx/constructs.IDataSource">IDataSource</a>

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


## Structs <a name="Structs" id="Structs"></a>

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
public resolve(schemaTypes: ISchemaType): GraphqlType
```

Resolve a JompxGraphqlType with string type to a GraphqlType with actual type.

###### `schemaTypes`<sup>Required</sup> <a name="schemaTypes" id="@jompx/constructs.JompxGraphqlType.resolve.parameter.schemaTypes"></a>

- *Type:* <a href="#@jompx/constructs.ISchemaType">ISchemaType</a>

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


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ISchemaType.property.enumTypes">enumTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.EnumType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaType.property.inputTypes">inputTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.InputType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaType.property.interfaceTypes">interfaceTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.InterfaceType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaType.property.objectTypes">objectTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.ObjectType}</code> | *No description.* |
| <code><a href="#@jompx/constructs.ISchemaType.property.unionTypes">unionTypes</a></code> | <code>{[ key: string ]: @aws-cdk/aws-appsync-alpha.UnionType}</code> | *No description.* |

---

##### `enumTypes`<sup>Required</sup> <a name="enumTypes" id="@jompx/constructs.ISchemaType.property.enumTypes"></a>

```typescript
public readonly enumTypes: {[ key: string ]: EnumType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.EnumType}

---

##### `inputTypes`<sup>Required</sup> <a name="inputTypes" id="@jompx/constructs.ISchemaType.property.inputTypes"></a>

```typescript
public readonly inputTypes: {[ key: string ]: InputType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.InputType}

---

##### `interfaceTypes`<sup>Required</sup> <a name="interfaceTypes" id="@jompx/constructs.ISchemaType.property.interfaceTypes"></a>

```typescript
public readonly interfaceTypes: {[ key: string ]: InterfaceType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.InterfaceType}

---

##### `objectTypes`<sup>Required</sup> <a name="objectTypes" id="@jompx/constructs.ISchemaType.property.objectTypes"></a>

```typescript
public readonly objectTypes: {[ key: string ]: ObjectType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.ObjectType}

---

##### `unionTypes`<sup>Required</sup> <a name="unionTypes" id="@jompx/constructs.ISchemaType.property.unionTypes"></a>

```typescript
public readonly unionTypes: {[ key: string ]: UnionType};
```

- *Type:* {[ key: string ]: @aws-cdk/aws-appsync-alpha.UnionType}

---

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

