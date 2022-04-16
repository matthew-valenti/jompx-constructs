import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as jompx from '../../../src';
import { AppSyncSchemaBuilder } from '../schema-builder';

describe('AppSyncSchemaBuilder', () => {
    test('graphql resolvable field with string type resolves to actual type', () => {

        const types: jompx.ISchemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

        const MPost = new appsync.ObjectType('MPost', {
            definition: {
                id: appsync.GraphqlType.id()
            }
        });
        types.objectTypes.MPost = MPost;

        const MComment = new appsync.ObjectType('MComment', {
            definition: {
                mpost: new appsync.ResolvableField({
                    returnType: jompx.JompxGraphqlType.objectType({ typeName: 'MPost' })
                })
            }
        });
        types.objectTypes.MComment = MComment;

        // eslint-disable-next-line dot-notation
        const resolvableField = AppSyncSchemaBuilder['resolveResolvableField'](types, MComment.definition.mpost);
        expect(resolvableField?.fieldOptions?.returnType).toMatchObject({ type: 'INTERMEDIATE', intermediateType: { name: 'MPost' } });
    });
});
