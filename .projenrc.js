const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
    author: 'Jompx',
    authorAddress: 'go@jompx.com',
    name: '@jompx/constructs',
    repositoryUrl: 'https://github.com/matthew-valenti/jompx-constructs.git',
    defaultReleaseBranch: 'main',
    cdkVersion: '2.24.1',
    constructsVersion: '10.0.92'

    // deps: [],                /* Runtime dependencies of this module. */
    // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
    // devDeps: [],             /* Build dependencies for this module. */
    // packageName: undefined,  /* The "name" in package.json. */
});

// *** Start Jompx ***

// The construct library for this service is in preview. Since it is not stable yet, it is distributed as a separate package so that you can pin its version independently of the rest of the CDK.
project.package.addDevDeps('@aws-cdk/aws-appsync-alpha@2.24.1-alpha.0');
project.package.addPeerDeps('@aws-cdk/aws-appsync-alpha@2.24.1-alpha.0');

// Required to build LambdaNJS on local (vs slow docker).
project.package.addDevDeps('esbuild');

// Add npm packages. Lint wants these added as dependencies but results in lint errors.
project.package.addDevDeps('aws-lambda'); // For AppSyncResolverEvent type only.
project.package.addDevDeps('@types/aws-lambda'); // For AppSyncResolverEvent type only.
project.package.addDevDeps('axios');
project.package.addDevDeps('change-case');
project.package.addDevDeps('get-value');
project.package.addDevDeps('@types/get-value');
// project.package.addDevDeps('graphql'); // Error: Compilation errors prevented the JSII assembly from being created node_modules/graphql/NotSupportedTSVersion.d.ts(1,63): error TS1003: Identifier expected
// project.package.addDevDeps('graphql-tag');
project.package.addDevDeps('set-value');
project.package.addDevDeps('@types/set-value');

// project.package.addDevDeps('pluralize');
// project.package.addDevDeps('@types/pluralize');

// Fix for Windows error: 'shx' is not recognized as an internal or
project.package.addDevDeps('shx');

// Commit lib folder. Temporary workaround for linking to github repo in package.json.
project.eslint.addRules({ '@typescript-eslint/indent': ['error', 4] });
project.eslint.addRules({ 'comma-dangle': ['error', 'never'] });

// Ignore VSCode workspace files.
project.gitignore.exclude('/*.code-workspace');

// Fix for windows to match test files.
project.jest.addTestMatch('**/?(*.)@(spec|test).ts?(x)');
project.jest.addIgnorePattern('dist'); // Do not run tests in dist folder.

// Commit lib folder. Temporary workaround for linking to github repo in package.json.
project.gitignore.include('/lib');

// *** Jompx End ***

project.synth();

// Run synth: npx projen