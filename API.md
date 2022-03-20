# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CdkPipeline <a name="CdkPipeline" id="@jompx/constructs.CdkPipeline"></a>

Deploy in parallel?

READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html nx cicd: https://nx.dev/ci/monorepo-ci-circle-ci  Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit

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

##### ~~`isConstruct`~~ <a name="isConstruct" id="@jompx/constructs.CdkPipeline.isConstruct"></a>

```typescript
import { CdkPipeline } from '@jompx/constructs'

CdkPipeline.isConstruct(x: any)
```

Checks if `x` is a construct.

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

### ICdkPipelineGitHubProps <a name="ICdkPipelineGitHubProps" id="@jompx/constructs.ICdkPipelineGitHubProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.ICdkPipelineGitHubProps">ICdkPipelineGitHubProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.ICdkPipelineGitHubProps.property.owner">owner</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICdkPipelineGitHubProps.property.repo">repo</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@jompx/constructs.ICdkPipelineGitHubProps.property.token">token</a></code> | <code>aws-cdk-lib.SecretValue</code> | *No description.* |

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

##### `token`<sup>Required</sup> <a name="token" id="@jompx/constructs.ICdkPipelineGitHubProps.property.token"></a>

```typescript
public readonly token: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

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
| <code><a href="#@jompx/constructs.IEnvironment.property.stage">stage</a></code> | <code>string</code> | *No description.* |

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

##### `stage`<sup>Required</sup> <a name="stage" id="@jompx/constructs.IEnvironment.property.stage"></a>

```typescript
public readonly stage: string;
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

