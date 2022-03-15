const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
    author: 'Jompx',
    authorAddress: 'go@jompx.com',
    name: '@jompx/constructs',
    repositoryUrl: 'https://github.com/matthew-valenti/jompx-constructs.git',
    defaultReleaseBranch: 'main',
    cdkVersion: '2.15.0',
    constructsVersion: '10.0.76'

    // deps: [],                /* Runtime dependencies of this module. */
    // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
    // devDeps: [],             /* Build dependencies for this module. */
    // packageName: undefined,  /* The "name" in package.json. */
});

// *** Start Jompx ***

// Add npm packages. Lint wants dependencies but does not compile.
project.package.addDevDeps('get-value');
project.package.addDevDeps('@types/get-value');
project.package.addDevDeps('set-value');
project.package.addDevDeps('@types/set-value');
project.package.addDevDeps('change-case');

// Fix for Windows error: 'shx' is not recognized as an internal or
project.package.addDevDeps('shx');

// Commit lib folder. Temporary workaround for linking to github repo in package.json.
project.eslint.addRules({ '@typescript-eslint/indent': ['error', 4] });
project.eslint.addRules({ 'comma-dangle': ['error', 'never'] });

// Ignore VSCode workspace files.
project.gitignore.exclude('/*.code-workspace');

// Fix for windows to match test files.
project.jest.addTestMatch('**/?(*.)@(spec|test).[tj]s?(x)');
project.jest.addIgnorePattern('dist'); // Do not run tests in dist folder.

// Commit lib folder. Temporary workaround for linking to github repo in package.json.
project.gitignore.include('/lib');

// *** Jompx End ***

project.synth();

// Run synth: npx projen