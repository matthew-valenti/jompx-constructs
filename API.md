# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### JompxCdkPipeline <a name="JompxCdkPipeline" id="@jompx/constructs.JompxCdkPipeline"></a>

Deploy in parallel?

READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html

#### Initializers <a name="Initializers" id="@jompx/constructs.JompxCdkPipeline.Initializer"></a>

```typescript
import { JompxCdkPipeline } from '@jompx/constructs'

new JompxCdkPipeline(scope: Construct, id: string, props?: IJompxCdkPipelineProps)
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

##### `props`<sup>Optional</sup> <a name="props" id="@jompx/constructs.JompxCdkPipeline.Initializer.parameter.props"></a>

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




## Protocols <a name="Protocols" id="Protocols"></a>

### IJompxCdkPipelineProps <a name="IJompxCdkPipelineProps" id="@jompx/constructs.IJompxCdkPipelineProps"></a>

- *Implemented By:* <a href="#@jompx/constructs.IJompxCdkPipelineProps">IJompxCdkPipelineProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@jompx/constructs.IJompxCdkPipelineProps.property.test">test</a></code> | <code>string</code> | *No description.* |

---

##### `test`<sup>Required</sup> <a name="test" id="@jompx/constructs.IJompxCdkPipelineProps.property.test"></a>

```typescript
public readonly test: string;
```

- *Type:* string

---

