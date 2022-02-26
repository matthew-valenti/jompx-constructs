# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### JompxCdkPipeline <a name="JompxCdkPipeline" id="@jompx/constructs.JompxCdkPipeline"></a>

Deploy in parallel?

READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html nx cicd: https://nx.dev/ci/monorepo-ci-circle-ci  Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit

#### Initializers <a name="Initializers" id="@jompx/constructs.JompxCdkPipeline.Initializer"></a>

```typescript
import { JompxCdkPipeline } from '@jompx/constructs'

new JompxCdkPipeline(scope: Construct, id: string, props: IJompxCdkPipelineProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IJompxCdkPipelineProps">IJompxCdkPipelineProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constructs.JompxCdkPipeline.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.JompxCdkPipeline.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.JompxCdkPipeline.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IJompxCdkPipelineProps">IJompxCdkPipelineProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.JompxCdkPipeline.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@jompx/constructs.JompxCdkPipeline.isConstruct"></a>

```typescript
import { JompxCdkPipeline } from '@jompx/constructs'

JompxCdkPipeline.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.JompxCdkPipeline.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.property.pipeline">pipeline</a></code> | <code>aws-cdk-lib.pipelines.CodePipeline</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.JompxCdkPipeline.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `pipeline`<sup>Required</sup> <a name="pipeline" id="@jompx/constructs.JompxCdkPipeline.property.pipeline"></a>

```typescript
public readonly pipeline: CodePipeline;
```

- *Type:* aws-cdk-lib.pipelines.CodePipeline

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

##### ~~`isConstruct`~~ <a name="isConstruct" id="@jompx/constructs.JompxS3.isConstruct"></a>

```typescript
import { JompxS3 } from '@jompx/constructs'

JompxS3.isConstruct(x: any)
```

Checks if `x` is a construct.

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

new Config(configs: IConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.Config.Initializer.parameter.configs">configs</a></code> | <code><a href="#@jompx/constructs.IConfig">IConfig</a></code> | *No description.* |

---

##### `configs`<sup>Required</sup> <a name="configs" id="@jompx/constructs.Config.Initializer.parameter.configs"></a>

- *Type:* <a href="#@jompx/constructs.IConfig">IConfig</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@jompx/constructs.Config.get">get</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.getByAccountId">getByAccountId</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.getEnv">getEnv</a></code> | *No description.* |

---

##### `get` <a name="get" id="@jompx/constructs.Config.get"></a>

```typescript
public get(environmentName: string): IEnvironment
```

###### `environmentName`<sup>Required</sup> <a name="environmentName" id="@jompx/constructs.Config.get.parameter.environmentName"></a>

- *Type:* string

---

##### `getByAccountId` <a name="getByAccountId" id="@jompx/constructs.Config.getByAccountId"></a>

```typescript
public getByAccountId(accountId: string): IEnvironment
```

###### `accountId`<sup>Required</sup> <a name="accountId" id="@jompx/constructs.Config.getByAccountId.parameter.accountId"></a>

- *Type:* string

---

##### `getEnv` <a name="getEnv" id="@jompx/constructs.Config.getEnv"></a>

```typescript
public getEnv(environmentName: string): Environment
```

###### `environmentName`<sup>Required</sup> <a name="environmentName" id="@jompx/constructs.Config.getEnv.parameter.environmentName"></a>

- *Type:* string

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.Config.property.configs">configs</a></code> | <code><a href="#@jompx/constructs.IConfig">IConfig</a></code> | *No description.* |

---

##### `configs`<sup>Required</sup> <a name="configs" id="@jompx/constructs.Config.property.configs"></a>

```typescript
public readonly configs: IConfig;
```

- *Type:* <a href="#@jompx/constructs.IConfig">IConfig</a>

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IConfig <a name="IConfig" id="@jompx/constructs.IConfig"></a>

- *Implemented By:* <a href="#@jompx/constructs.IConfig">IConfig</a>



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
| <code><a href="#@jompx/constructs.IEnvironment.property.environmentName">environmentName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IEnvironment.property.region">region</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IEnvironment.property.stage">stage</a></code> | <code>string</code> | *No description.* |

---

##### `accountId`<sup>Required</sup> <a name="accountId" id="@jompx/constructs.IEnvironment.property.accountId"></a>

```typescript
public readonly accountId: string;
```

- *Type:* string

---

##### `environmentName`<sup>Required</sup> <a name="environmentName" id="@jompx/constructs.IEnvironment.property.environmentName"></a>

```typescript
public readonly environmentName: string;
```

- *Type:* string

---

##### `region`<sup>Required</sup> <a name="region" id="@jompx/constructs.IEnvironment.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

---

##### `stage`<sup>Required</sup> <a name="stage" id="@jompx/constructs.IEnvironment.property.stage"></a>

```typescript
public readonly stage: string;
```

- *Type:* string

---

### IJompxCdkPipelineProps <a name="IJompxCdkPipelineProps" id="@jompx/constructs.IJompxCdkPipelineProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IJompxCdkPipelineProps">IJompxCdkPipelineProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IJompxCdkPipelineProps.property.shellStepInput">shellStepInput</a></code> | <code>aws-cdk-lib.pipelines.IFileSetProducer</code> | *No description.* |

---

##### `shellStepInput`<sup>Required</sup> <a name="shellStepInput" id="@jompx/constructs.IJompxCdkPipelineProps.property.shellStepInput"></a>

```typescript
public readonly shellStepInput: IFileSetProducer;
```

- *Type:* aws-cdk-lib.pipelines.IFileSetProducer

---

### ILocalConfig <a name="ILocalConfig" id="@jompx/constructs.ILocalConfig"></a>

- *Implemented By:* <a href="#@jompx/constructs.ILocalConfig">ILocalConfig</a>



### ILocalConfigEnv <a name="ILocalConfigEnv" id="@jompx/constructs.ILocalConfigEnv"></a>

- *Implemented By:* <a href="#@jompx/constructs.ILocalConfigEnv">ILocalConfigEnv</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ILocalConfigEnv.property.from">from</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ILocalConfigEnv.property.to">to</a></code> | <code>string</code> | *No description.* |

---

##### `from`<sup>Required</sup> <a name="from" id="@jompx/constructs.ILocalConfigEnv.property.from"></a>

```typescript
public readonly from: string;
```

- *Type:* string

---

##### `to`<sup>Required</sup> <a name="to" id="@jompx/constructs.ILocalConfigEnv.property.to"></a>

```typescript
public readonly to: string;
```

- *Type:* string

---

