import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as jompx from '../../src';
import { AppSyncSchema } from '../../src/classes/app-sync/schema';

describe('AppSyncSchema', () => {
    test('graphql resolvable field with string type resolves to actual type', () => {

        const types: jompx.ISchemaType = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

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
        const resolvableField = AppSyncSchema['resolveResolvableField'](types, MComment.definition.mpost);
        expect(resolvableField?.fieldOptions?.returnType).toMatchObject({ type: 'INTERMEDIATE', intermediateType: { name: 'MPost' } });
    });
});
