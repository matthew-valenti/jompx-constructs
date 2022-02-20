# Jompx Constructs

## TODO:
Discovery: multiple constructs setup best practices.

## Pipeline 1
1. Deploy pipeline manually to test (one time only).
```
nx deploy cdk --args="CdkPipelineStack --profile jompx-cicd-test"
```
2. Deploy pipeline manually to prod (one time only).
```
nx deploy cdk --args="CdkPipelineStack --context stage=prod --profile jompx-cicd-test"
```
3. Push to main branch:
	- Pipeline to deploy to cicd-prod account.
	- Pipeline to deploy app stacks to test then prod accounts. If test fails then do not deploy to prod.
	- Add optional approval step prior to prod.
4. Push to test branch:
	- Pipeline to deploy to cicd-test account.
	- Pipeline to deploy app stacks to test accounts.