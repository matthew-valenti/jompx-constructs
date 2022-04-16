"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appsync = require("@aws-cdk/aws-appsync-alpha");
const jompx = require("../../../src");
const schema_builder_1 = require("../schema-builder");
describe('AppSyncSchemaBuilder', () => {
    test('graphql resolvable field with string type resolves to actual type', () => {
        var _a;
        const types = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };
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
        const resolvableField = schema_builder_1.AppSyncSchemaBuilder['resolveResolvableField'](types, MComment.definition.mpost);
        expect((_a = resolvableField === null || resolvableField === void 0 ? void 0 : resolvableField.fieldOptions) === null || _a === void 0 ? void 0 : _a.returnType).toMatchObject({ type: 'INTERMEDIATE', intermediateType: { name: 'MPost' } });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtc2NoZW1hLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwLXN5bmMvdGVzdC9hcHAtc3luYy1zY2hlbWEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUFzRDtBQUN0RCxzQ0FBc0M7QUFDdEMsc0RBQXlEO0FBRXpELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxDQUFDLG1FQUFtRSxFQUFFLEdBQUcsRUFBRTs7UUFFM0UsTUFBTSxLQUFLLEdBQXVCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFFekgsTUFBTSxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUMxQyxVQUFVLEVBQUU7Z0JBQ1IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFO2FBQy9CO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRWhDLE1BQU0sUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDaEQsVUFBVSxFQUFFO2dCQUNSLEtBQUssRUFBRSxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUM7b0JBQy9CLFVBQVUsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDO2lCQUN2RSxDQUFDO2FBQ0w7U0FDSixDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFdEMsd0NBQXdDO1FBQ3hDLE1BQU0sZUFBZSxHQUFHLHFDQUFvQixDQUFDLHdCQUF3QixDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekcsTUFBTSxPQUFDLGVBQWUsYUFBZixlQUFlLHVCQUFmLGVBQWUsQ0FBRSxZQUFZLDBDQUFFLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25JLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0ICogYXMgam9tcHggZnJvbSAnLi4vLi4vLi4vc3JjJztcclxuaW1wb3J0IHsgQXBwU3luY1NjaGVtYUJ1aWxkZXIgfSBmcm9tICcuLi9zY2hlbWEtYnVpbGRlcic7XHJcblxyXG5kZXNjcmliZSgnQXBwU3luY1NjaGVtYUJ1aWxkZXInLCAoKSA9PiB7XHJcbiAgICB0ZXN0KCdncmFwaHFsIHJlc29sdmFibGUgZmllbGQgd2l0aCBzdHJpbmcgdHlwZSByZXNvbHZlcyB0byBhY3R1YWwgdHlwZScsICgpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZXM6IGpvbXB4LklTY2hlbWFUeXBlcyA9IHsgZW51bVR5cGVzOiB7fSwgaW5wdXRUeXBlczoge30sIGludGVyZmFjZVR5cGVzOiB7fSwgb2JqZWN0VHlwZXM6IHt9LCB1bmlvblR5cGVzOiB7fSB9O1xyXG5cclxuICAgICAgICBjb25zdCBNUG9zdCA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ01Qb3N0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogYXBwc3luYy5HcmFwaHFsVHlwZS5pZCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0eXBlcy5vYmplY3RUeXBlcy5NUG9zdCA9IE1Qb3N0O1xyXG5cclxuICAgICAgICBjb25zdCBNQ29tbWVudCA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ01Db21tZW50Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBtcG9zdDogbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBqb21weC5Kb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUoeyB0eXBlTmFtZTogJ01Qb3N0JyB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHR5cGVzLm9iamVjdFR5cGVzLk1Db21tZW50ID0gTUNvbW1lbnQ7XHJcblxyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkb3Qtbm90YXRpb25cclxuICAgICAgICBjb25zdCByZXNvbHZhYmxlRmllbGQgPSBBcHBTeW5jU2NoZW1hQnVpbGRlclsncmVzb2x2ZVJlc29sdmFibGVGaWVsZCddKHR5cGVzLCBNQ29tbWVudC5kZWZpbml0aW9uLm1wb3N0KTtcclxuICAgICAgICBleHBlY3QocmVzb2x2YWJsZUZpZWxkPy5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUpLnRvTWF0Y2hPYmplY3QoeyB0eXBlOiAnSU5URVJNRURJQVRFJywgaW50ZXJtZWRpYXRlVHlwZTogeyBuYW1lOiAnTVBvc3QnIH0gfSk7XHJcbiAgICB9KTtcclxufSk7XHJcbiJdfQ==