import { AppSyncMySqlDatasource } from './mysql.datasource';
// https://github.com/tjmehta/graphql-parse-fields

/**
 * npx jest mysql.datasource.test.ts
 */

let event = {
    arguments: { filter: { a: 1 }, skip: 10, limit: 10 },
    identity: {
        accountId: '066209653567',
        cognitoIdentityAuthProvider: null,
        cognitoIdentityAuthType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        sourceIp: ['205.251.233.33'],
        userArn: 'arn:aws:sts::066209653567:assumed-role/AWSReservedSSO_AdministratorAccess_95acdbc81c844c56/admin',
        username: 'AROAQ62THEM76XQ6TOUPK:admin'
    } as any,
    source: null,
    request: {
        headers: {
            'content-encoding': 'amz-1.0',
            'x-forwarded-for': '205.251.233.33, 70.132.31.72',
            'cloudfront-viewer-country': 'US',
            'cloudfront-is-tablet-viewer': 'false',
            'x-amzn-requestid': 'f03eea15-03a5-4bdd-87a1-e4026b8f55c2',
            'via': '1.1 0aebf3fe433ff96e68d785fad4ea4c0e.cloudfront.net (CloudFront)',
            'cloudfront-forwarded-proto': 'https',
            'content-length': '227',
            'host': 'rd7b4x2rbjha7k2ti6z6yjedly.appsync-api.us-west-2.amazonaws.com',
            'x-forwarded-proto': 'https',
            'user-agent': 'aws-internal/3 aws-sdk-java/1.12.182 Linux/5.4.181-109.354.amzn2int.x86_64 OpenJDK_64-Bit_Server_VM/25.322-b06 java/1.8.0_322 kotlin/1.3.72 vendor/Oracle_Corporation cfg/retry-mode/standard',
            'cloudfront-is-mobile-viewer': 'false',
            'accept': 'application/json, text/javascript',
            'x-amz-date': '20220410T215348Z',
            'cloudfront-is-smarttv-viewer': 'false',
            'amz-sdk-request': 'ttl=20220410T215448Z;attempt=1;max=1',
            'amz-sdk-invocation-id': '46a0e49f-f009-cbab-804e-59241ff028e3',
            'x-amz-security-token': 'IQoJb3JpZ2luX2VjEHUaCXVzLXdlc3QtMiJGMEQCICCr3P8SudRDvePK8TWYvbM5V/+mZjqouWtd/pDrqpmqAiBg1g8lOX2xjg+SndFRfZ4iLMM9dbOi4Fr2hXu9DIyrnyr2AwgeEAAaDDA2NjIwOTY1MzU2NyIMnok8Idc245Bd4l/QKtMDQ6przoayy6u4i6gYoJfXwKyj1ZVfRagT6g0nn4pyRs5rcF2Wdong1yYMLl+CCcTZIPFxCHgtvnGeoREVyyyJwA48IR9bkGVA3qVkD/5YKwRm0gjvPDvxyUSQ2XQPZ+j2hnt8qsnnqROm3HUwYO8sFTkCiOoa9jI7zUTJ54fdun/3lnMhSLeMcPOl0UFLpmVp+nrN+K9dSg4suHemlLDXEozrNAZ+ssUoeoQ8EPX2ttlC5ci/NYKzMN9WpDqa+P8SjRN9kzMmI2nNcVL9dRJORieqURJbFAiFzZ0Eq332zXcKKK7oAx0s57Te5GnWf71zD8v9OQX2MdJs1qsMZ8e+bb5VJ+Gi1LlJ+4LEzGhK2tZlIjvC4TOspzducviNkd/nfvLYA4kMNC/23yV+ToxGu1MJyvOJ79mfxDL/RvpPYIw8WzCrRnJ+ktO/U29s7OcqyLmidiEA9j+DtGjkN6fGpyh20B6M/ZaNNON2UFXQ3dX0vyiYIt85VFdh7LsMzy2R/QEK0oXCPuWZqJ72NgijCqBqE66hN5ATDX3DMtAIgcU8W3Ti6Z9JZWMswE3O3Fdw/26A/KBXsLUXKmY1CsmHfxhxckcP0zwXYbUKFfciYWc8IHowsv3MkgY6mQI60UGUHcqJ+2mssJdam4YjN5Ae7FEpUOELorpACL+1h7+uAnInRpVRpyd+Aa7OtJ+tkKL/FJEpDwzSvIk+6tf+GYC/QmkuUXPBEphOb/2/n/aqFjjtBBZr7nrx6yBJlWfKrod4R7GQkI19j0fSW8M9S06hDNFQz694rGx8kPqMJflIO6yNtDzig5OXrD1dyJdEBUCrc0ZaGIx/ocEZplkHWS2Mhh/iakEjgbsTVNb6c1hPQALOvVz7gF+SBQq3CE/fseydOUITQcR8xafgmDO7xdF0usLYt8DXm58yaEd+pNtr5u7vs5aFspofPLhIdttrK1KnG9LZlLflZa8ZhUvJifRiL+vBVnQRbRb5GNUhZ79/xMhpdV8RgQ==',
            'content-type': 'application/json',
            'x-amz-cf-id': '-S2AVEzYyb-Xox2BL9nDCkh3NXAoMJvilmBadS0XH3JAxXHvwS0SMw==',
            'x-amzn-trace-id': 'Root=1-625351ec-290b3f6862b99a6931f36bb9',
            'authorization': 'AWS4-HMAC-SHA256 Credential=ASIAQ62THEM7S7HTOCGV/20220410/us-west-2/appsync/aws4_request, SignedHeaders=accept;content-encoding;content-length;content-type;host;x-amz-date;x-amz-security-token, Signature=94c63af07ab0f824ba02b0a3334eae990ee0feca988c20068c0b86df65584e59',
            'amz-sdk-retry': '0/0/500',
            'cloudfront-is-desktop-viewer': 'true',
            'x-forwarded-port': '443'
        },
        domainName: null
    },
    prev: null,
    info: {
        selectionSetList: [
            'edges',
            'edges/node',
            'edges/node/id',
            'edges/node/title',
            'edges/node/mcomments',
            'edges/node/mcomments/id',
            'edges/node/mcomments/html'
        ],
        selectionSetGraphQL: '{\n' +
            '  edges {\n' +
            '    node {\n' +
            '      id\n' +
            '      title\n' +
            '      mcomments {\n' +
            '        id\n' +
            '        html\n' +
            '      }\n' +
            '    }\n' +
            '  }\n' +
            '}',
        fieldName: 'mpostFind',
        parentTypeName: 'Query',
        variables: {}
    },
    stash: { operation: 'find' }
};

beforeAll(async () => {

});

describe('mysql.datasource', () => {

    test('find', () => {

        event.info.parentTypeName = 'Query';
        event.info.fieldName = 'movieFind';
        event.info.selectionSetList = [
            'items',
            'items/id',
            'items/name'
        ];

        const datasource = new AppSyncMySqlDatasource(event);
        const sql = datasource.findSql();
        expect(sql).toBe('select * from');
    });
});
