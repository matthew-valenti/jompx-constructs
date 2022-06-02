import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import { Config } from '../src/classes/config';
// import { AppSync, IAppSyncProps } from '../../src/constructs/app-sync/app-sync.construct';
// import * as jompx from '../../../src';
import { Config } from './config';
import { Config as JompxConfig } from './test/jompx.config';
// import { MySqlSchema } from './mysql.schema';

/**
 * npx jest config.test.ts
 */

let config: Config;

beforeAll(async () => {
    const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'prod' } } });
    new cdk.Stack(app);
    config = new Config(app.node);
});

describe('Config', () => {
    test('stage', () => {
        const stage = config.stage();
        expect(stage).toBe('prod');
    });

    test('environments', () => {
        const environments = config.environments();
        expect(environments).toHaveLength(5);
    });

    test('environmentByName', () => {
        const environment = config.environmentByName('prod');
        expect(environment).toEqual(
            expect.objectContaining({
                accountId: '281660020318',
                region: 'us-west-2',
                name: 'prod'
            })
        );
    });

    test('environmentByAccountId', () => {
        const environment = config.environmentByAccountId('281660020318');
        expect(environment).toEqual(
            expect.objectContaining({
                accountId: '281660020318',
                region: 'us-west-2',
                name: 'prod'
            })
        );
    });

    test('stages', () => {
        const stages = config.stages();
        if (stages) {
            const stagesMap = new Map(Object.entries(stages));
            expect(stagesMap.size).toBe(4);
            expect(stages.prod).toHaveProperty('branch', 'main');
        }
    });

    test('stageEnvironments', () => {
        const stageEnvironments = config.stageEnvironments('prod');
        expect(stageEnvironments).toHaveLength(3);
    });

    test('env', () => {
        const env = config.env('app');
        expect(env).toEqual(
            expect.objectContaining({
                account: '281660020318',
                region: 'us-west-2'
            })
        );
    });

    test('env + stageName', () => {
        const env = config.env('app', 'test');
        expect(env).toEqual(
            expect.objectContaining({
                account: '706457422044',
                region: 'us-west-2'
            })
        );
    });

    test('organizationName', () => {
        const organizationName = config.organizationName();
        expect(organizationName).toBe('my-org');
    });

    test('organizationNamePascalCase', () => {
        const organizationName = config.organizationNamePascalCase();
        expect(organizationName).toBe('MyOrg');
    });
});
