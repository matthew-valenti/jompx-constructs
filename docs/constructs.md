# Jompx Constructs

## TODO:
Discovery: multiple constructs setup best practices.

## Overview
https://github.com/projen/projen  
https://projen.io/api/API.html#projen-awscdk-awscdkconstructlibrary  
https://dev.to/aws-builders/a-beginner-s-guide-to-create-aws-cdk-construct-library-with-projen-5eh4  
https://matthewbonig.com/2020/10/04/converting-to-projen/

Projen sets up a CDK construct project structure.  
If constructs are going to be published/shared it's important to follow all best practices baked into this project.  

## Setup
```
// 1. Create a new projen construct project.
npx projen new awscdk-construct // create new project

// 2. Make changes in: .projenrc.js

// 3. Run synth to apply changes:
npx projen
```

### Build on Windows
The projen build command uses rsync which is not installed on Windows 10 by default. Error: rsync is not recognized as an internal or external command.
Download rsync. Go to https://www.itefix.net/cwrsync. Click "Rsync Client" tab. Click "download" tab.
Unzip rsync files to folder e.g. C:\Program Files\cwrsync_6.2.4_x64_free
In Windows environment variables, add the rsync bin folder to the path variable: C:\Program Files\cwrsync_6.2.4_x64_free\bin

## Commands
```
npx projen build
npx projen watch
npx projen test
npx projen test:watch
```

## Local Development
To consume constructs for local development, point to the local package.  
NPM package versions must be exactly the same or will result in compile errors? TODO: Is this still true?
```
// package.json
"dependencies": {
	"@jompx/constructs": "file:../constructs",
	"@jompx/constructs": "git+https://github.com/matthew-valenti/jompx-constructs.git#pipeline",

	// Caution: This fails in AWS CodePipeline with an SSH error. NPM changes the good url above to this bad url.
	"@jompx/constructs": "github:matthew-valenti/jompx-constructs#pipeline",

npm install "../constructs"
```

### VSCode Debug
The AWS docs are misleading but probably correct. Working sample taken from ConstructHub constructs.

```
// https://jestjs.io/docs/troubleshooting#debugging-in-vs-code
// .vscode\launch.json
{
	"version": "0.2.0",
	"configurations": [{
		"name": "Jest",
		"type": "node",
		"request": "launch",
		"runtimeArgs": [
			"--inspect-brk",
			"${workspaceRoot}/node_modules/jest/bin/jest.js",
			"--runInBand"
		],
		"console": "integratedTerminal",
		"internalConsoleOptions": "neverOpen",
		"port": 9229
	}]
}
```

## Education
- More CDK best practices: https://levelup.gitconnected.com/aws-cdk-pipelines-real-world-tips-and-tricks-part-2-7a0d093a89a0
- Multiple constructs in Lerna monorepo: https://www.npmjs.com/package/lerna-projen