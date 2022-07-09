import { GraphqlType, Field } from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Config as JompxConfig } from '../config/test/jompx.config';
import { AppSync } from './app-sync.construct';
import { auth } from './directives/auth';
import { AppSyncSchemaBuilder } from './schema-builder';

/**
 * npx jest schema-builder.test.ts
 */

let app: cdk.App;
let stack: cdk.Stack;
let jompxAppSync: AppSync;
let schemaBuilder: AppSyncSchemaBuilder;

beforeAll(async () => {
    app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'test' } } });
    stack = new cdk.Stack(app);

    jompxAppSync = new AppSync(stack, 'AppSync', { name: 'api' });
    schemaBuilder = new AppSyncSchemaBuilder(jompxAppSync.graphqlApi, []);
});

describe('AppSyncSchemaBuilder', () => {

    test('addOperationInputs', () => {

        const input = {
            input1: GraphqlType.id(),
            input2: new Field({
                returnType: GraphqlType.id(),
                directives: [
                    auth([{ allow: 'owner', provider: 'iam' }]) // TODO: Implement field level security.
                ]
            }),
            test: {
                input1: GraphqlType.string(),
                input2: GraphqlType.string(),
                test: {
                    input1: GraphqlType.string(),
                    input2: GraphqlType.string(),
                    test: {
                        input1: GraphqlType.string(),
                        input2: GraphqlType.string()
                    }
                }
            }
        };

        const inputType = schemaBuilder.addOperationInputs('Test', input);

        expect(inputType).toEqual(
            expect.objectContaining({
                definition: expect.objectContaining({
                    input1: expect.any(Object),
                    input2: expect.any(Object),
                    test: expect.objectContaining({
                        type: expect.stringMatching('INTERMEDIATE')
                    })
                })
            })
        );
    });

    test('addOperationOutputs', () => {

        const output = {
            input1: GraphqlType.id(),
            input2: new Field({
                returnType: GraphqlType.id(),
                directives: [
                    auth([{ allow: 'owner', provider: 'iam' }]) // TODO: Implement field level security.
                ]
            }),
            test: {
                input1: GraphqlType.string(),
                input2: GraphqlType.string(),
                test: {
                    input1: GraphqlType.string(),
                    input2: GraphqlType.string(),
                    test: {
                        input1: GraphqlType.string(),
                        input2: GraphqlType.string()
                    }
                }
            }
        };

        const rules = auth([
            { allow: 'private', provider: 'iam' }
        ]);

        const outputType = schemaBuilder.addOperationOutputs('Test', output, [rules]);

        expect(outputType).toEqual(
            expect.objectContaining({
                definition: expect.objectContaining({
                    input1: expect.any(Object),
                    input2: expect.any(Object),
                    test: expect.objectContaining({
                        type: expect.stringMatching('INTERMEDIATE')
                    })
                })
            })
        );
    });

    // test('addMutation', () => {

    //     const input = {
    //         input1: GraphqlType.id(),
    //         input2: new Field({
    //             returnType: GraphqlType.id(),
    //             directives: [
    //                 auth([{ allow: 'owner', provider: 'iam' }]) // TODO: Implement field level security.
    //             ]
    //         }),
    //         test: {
    //             input1: GraphqlType.string(),
    //             input2: GraphqlType.string(),
    //             test: {
    //                 input1: GraphqlType.string(),
    //                 input2: GraphqlType.string(),
    //                 test: {
    //                     input1: GraphqlType.string(),
    //                     input2: GraphqlType.string()
    //                 }
    //             }
    //         }
    //     };

    //     // const output = {
    //     //     input1: GraphqlType.id()
    //     // };

    //     // eslint-disable-next-line dot-notation
    //     const inputType = schemaBuilder.addOperationInputs('Test', input);
    //     // console.log(inputType);
    //     console.log(inputType.definition);

    //     // const auth2 = auth([
    //     //     { allow: 'private', provider: 'iam' }
    //     // ]);

    //     // schemaBuilder.addMutation({ name: 'test', dataSourceName: 'mysql', input, output, auth: auth2, methodName: 'test' });
    // });
});
