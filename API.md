# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CdkPipeline <a name="CdkPipeline" id="@jompx/constructs.CdkPipeline"></a>

Deploy in parallel?

READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-CdkPipelineadme.html
 Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
 nx cicd: https://nx.dev/ci/monorepo-ci-circle-ci
 CdkPipeline
 Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit
CdkPipelineCdkPipeline
#### Initializers <a name="Initializers" id="@jompx/constructs.JompxCdkPipeline.Initializer"></a>

```typescript
import { JompxCdkPipeline } from '@jompx/constructs'
CdkPipeline
new JompxCdkPipeline(scope: ConstrucCdkPipelinerops: IJompxCdkPipelineProps)
```CdkPipelineCdkPipelineCdkPipeline

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.Initializer.parameCdkPipeline</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.Initializer.parameter.props">props</a></code> | <code><a href="#@jompx/constructs.IJompxCdkPipelineProps">IJompxCdkPipelineProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@jompx/constCdkPipelinepeline.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@jompx/constructs.JompxCCdkPipelinealizer.parameter.id"></a>

- *Type:* stringCdkPipelineCdkPipeline

---

##### `props`<sup>Required</sup> <a name="props" id="@jompx/constructs.JompxCdkPipeline.Initializer.parameter.props"></a>

- *Type:* <a href="#@jompx/constructs.IJompxCdkPipelineProps">IJompxCdkPipelineProps</a>

---CdkPipeline

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |CdkPipeline
| --- | --- |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@jompx/constructs.JompxCdkPipeline.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of tCdkPipeline

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |CdkPipeline
| --- | --- |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
CdkPipeline
---
CdkPipeline
##### ~~`isConstruct`~~ <a name="isConstruct" id="@jompx/constructs.JompxCdkPipeline.isConstruct"></a>

```typescript
import { JompxCdkPipeline } from '@jompx/constructs'
CdkPipeline
JompxCdkPipeline.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@jompx/constructs.JompxCdkPipeline.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---CdkPipeline
CdkPipeline
#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |CdkPipeline
| <code><a href="#@jompx/constructs.JompxCdkPipeline.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@jompx/constructs.JompxCdkPipeline.property.pipeline">pipeline</a></code> | <code>aws-cdk-lib.pipelines.CodePipeline</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@jompx/constructs.JompxCdkPipeline.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.NodeCdkPipeline

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
| <code><a href="#@jompx/constructs.Config.environment">environment</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.environmentByAccountId">environmentByAccountId</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.environments">environments</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.organizationName">organizationName</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.organizationNamePascalCase">organizationNamePascalCase</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.stage">stage</a></code> | *No description.* |
| <code><a href="#@jompx/constructs.Config.stageEnvironments">stageEnvironments</a></code> | *No description.* |

---

##### `env` <a name="env" id="@jompx/constructs.Config.env"></a>

```typescript
public env(environmentType: string, stageName?: string): Environment
```

###### `environmentType`<sup>Required</sup> <a name="environmentType" id="@jompx/constructs.Config.env.parameter.environmentType"></a>

- *Type:* string

---

###### `stageName`<sup>Optional</sup> <a name="stageName" id="@jompx/constructs.Config.env.parameter.stageName"></a>

- *Type:* string

---

##### `environment` <a name="environment" id="@jompx/constructs.Config.environment"></a>

```typescript
public environment(environmentName: string): IEnvironment
```

###### `environmentName`<sup>Required</sup> <a name="environmentName" id="@jompx/constructs.Config.environment.parameter.environmentName"></a>

- *Type:* string

---

##### `environmentByAccountId` <a name="environmentByAccountId" id="@jompx/constructs.Config.environmentByAccountId"></a>

```typescript
public environmentByAccountId(accountId: string): IEnvironment
```

###### `accountId`<sup>Required</sup> <a name="accountId" id="@jompx/constructs.Config.environmentByAccountId.parameter.accountId"></a>

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
```CdkPipelineCdkPipelineCdkPipeline

- *Type:* stringCdkPipelineCdkPipeline

---

### IJompxCdkPipelineProps <a name="IJompxCdkPipelineProps" id="@jompx/constructs.IJompxCdkPipelineProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IJompxCdkPipelineProps">IJompxCdkPipelineProps</a>
CdkPipeline
CdkPipeline
#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |CdkPipeline
| <code><a href="#@jompx/constructs.IJompxCdkPipelineProps.property.shellStepInput">shellStepInput</a></code> | <code>aws-cdk-lib.pipelines.IFileSetProducer</code> | *No description.* |
| <code><a href="#@jompx/constructs.IJompxCdkPipelineProps.property.stage">stage</a></code> | <code>string</code> | *No description.* |

---

##### `shellStepInput`<sup>Required</sup> <a name="shellStepInput" id="@jompx/constructs.IJompxCdkPipelineProps.property.shellStepInput"></a>

```typescript
public readonly shellStepInput: IFileSetProducer;
```CdkPipeline

- *Type:* aws-cdk-lib.pipelines.IFileSetProducer

---

##### `stage`<sup>Required</sup> <a name="stage" id="@jompx/constructs.IJompxCdkPipelineProps.property.stage"></a>

```typescript
public readonly stage: string;
```

- *Type:* string

---

### ILocalConfig <a name="ILocalConfig" id="@jompx/constructs.ILocalConfig"></a>

- *Implemented By:* <a href="#@jompx/constructs.ILocalConfig">ILocalConfig</a>



### IStage <a name="IStage" id="@jompx/constructs.IStage"></a>

- *Implemented By:* <a href="#@jompx/constructs.IStage">IStage</a>



### IStageEnvironment <a name="IStageEnvironment" id="@jompx/constructs.IStageEnvironment"></a>

- *Implemented By:* <a href="#@jompx/constructs.IStageEnvironment">IStageEnvironment</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IStageEnvironment.property.environmentName">environmentName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.IStageEnvironment.property.environmentType">environmentType</a></code> | <code>string</code> | *No description.* |

---

##### `environmentName`<sup>Required</sup> <a name="environmentName" id="@jompx/constructs.IStageEnvironment.property.environmentName"></a>

```typescript
public readonly environmentName: string;
```

- *Type:* string

---

##### `environmentType`<sup>Required</sup> <a name="environmentType" id="@jompx/constructs.IStageEnvironment.property.environmentType"></a>

```typescript
public readonly environmentType: string;
```

- *Type:* string

---

