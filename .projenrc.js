const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Jompx',
  authorAddress: 'go@jompx.com',
  name: '@jompx/constructs',
  repositoryUrl: 'https://github.com/matthew-valenti/jompx-constructs.git',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.1.0',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();