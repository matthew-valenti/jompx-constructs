"use strict";
// TODO: Where is the AppSync event type i.e. AppSyncResolverEvent? cdk.aws_lambda_event_sources.ApiEventSource
// import * as cdk from 'aws-cdk-lib';
Object.defineProperty(exports, "__esModule", { value: true });
/*
event {
  arguments: {},
  identity: {
    accountId: '066209653567',
    cognitoIdentityAuthProvider: null,
    cognitoIdentityAuthType: null,
    cognitoIdentityId: null,
    cognitoIdentityPoolId: null,
    sourceIp: [ '205.251.233.33' ],
    userArn: 'arn:aws:sts::066209653567:assumed-role/AWSReservedSSO_AdministratorAccess_95acdbc81c844c56/admin',
    username: 'AROAQ62THEM76XQ6TOUPK:admin'
  },
  source: null,
  request: {
    headers: {
      'content-encoding': 'amz-1.0',
      'x-forwarded-for': '205.251.233.33, 70.132.31.72',
      'cloudfront-viewer-country': 'US',
      'cloudfront-is-tablet-viewer': 'false',
      'x-amzn-requestid': 'f03eea15-03a5-4bdd-87a1-e4026b8f55c2',
      via: '1.1 0aebf3fe433ff96e68d785fad4ea4c0e.cloudfront.net (CloudFront)',
      'cloudfront-forwarded-proto': 'https',
      'content-length': '227',
      host: 'rd7b4x2rbjha7k2ti6z6yjedly.appsync-api.us-west-2.amazonaws.com',
      'x-forwarded-proto': 'https',
      'user-agent': 'aws-internal/3 aws-sdk-java/1.12.182 Linux/5.4.181-109.354.amzn2int.x86_64 OpenJDK_64-Bit_Server_VM/25.322-b06 java/1.8.0_322 kotlin/1.3.72 vendor/Oracle_Corporation cfg/retry-mode/standard',
      'cloudfront-is-mobile-viewer': 'false',
      accept: 'application/json, text/javascript',
      'x-amz-date': '20220410T215348Z',
      'cloudfront-is-smarttv-viewer': 'false',
      'amz-sdk-request': 'ttl=20220410T215448Z;attempt=1;max=1',
      'amz-sdk-invocation-id': '46a0e49f-f009-cbab-804e-59241ff028e3',
      'x-amz-security-token': 'IQoJb3JpZ2luX2VjEHUaCXVzLXdlc3QtMiJGMEQCICCr3P8SudRDvePK8TWYvbM5V/+mZjqouWtd/pDrqpmqAiBg1g8lOX2xjg+SndFRfZ4iLMM9dbOi4Fr2hXu9DIyrnyr2AwgeEAAaDDA2NjIwOTY1MzU2NyIMnok8Idc245Bd4l/QKtMDQ6przoayy6u4i6gYoJfXwKyj1ZVfRagT6g0nn4pyRs5rcF2Wdong1yYMLl+CCcTZIPFxCHgtvnGeoREVyyyJwA48IR9bkGVA3qVkD/5YKwRm0gjvPDvxyUSQ2XQPZ+j2hnt8qsnnqROm3HUwYO8sFTkCiOoa9jI7zUTJ54fdun/3lnMhSLeMcPOl0UFLpmVp+nrN+K9dSg4suHemlLDXEozrNAZ+ssUoeoQ8EPX2ttlC5ci/NYKzMN9WpDqa+P8SjRN9kzMmI2nNcVL9dRJORieqURJbFAiFzZ0Eq332zXcKKK7oAx0s57Te5GnWf71zD8v9OQX2MdJs1qsMZ8e+bb5VJ+Gi1LlJ+4LEzGhK2tZlIjvC4TOspzducviNkd/nfvLYA4kMNC/23yV+ToxGu1MJyvOJ79mfxDL/RvpPYIw8WzCrRnJ+ktO/U29s7OcqyLmidiEA9j+DtGjkN6fGpyh20B6M/ZaNNON2UFXQ3dX0vyiYIt85VFdh7LsMzy2R/QEK0oXCPuWZqJ72NgijCqBqE66hN5ATDX3DMtAIgcU8W3Ti6Z9JZWMswE3O3Fdw/26A/KBXsLUXKmY1CsmHfxhxckcP0zwXYbUKFfciYWc8IHowsv3MkgY6mQI60UGUHcqJ+2mssJdam4YjN5Ae7FEpUOELorpACL+1h7+uAnInRpVRpyd+Aa7OtJ+tkKL/FJEpDwzSvIk+6tf+GYC/QmkuUXPBEphOb/2/n/aqFjjtBBZr7nrx6yBJlWfKrod4R7GQkI19j0fSW8M9S06hDNFQz694rGx8kPqMJflIO6yNtDzig5OXrD1dyJdEBUCrc0ZaGIx/ocEZplkHWS2Mhh/iakEjgbsTVNb6c1hPQALOvVz7gF+SBQq3CE/fseydOUITQcR8xafgmDO7xdF0usLYt8DXm58yaEd+pNtr5u7vs5aFspofPLhIdttrK1KnG9LZlLflZa8ZhUvJifRiL+vBVnQRbRb5GNUhZ79/xMhpdV8RgQ==',
      'content-type': 'application/json',
      'x-amz-cf-id': '-S2AVEzYyb-Xox2BL9nDCkh3NXAoMJvilmBadS0XH3JAxXHvwS0SMw==',
      'x-amzn-trace-id': 'Root=1-625351ec-290b3f6862b99a6931f36bb9',
      authorization: 'AWS4-HMAC-SHA256 Credential=ASIAQ62THEM7S7HTOCGV/20220410/us-west-2/appsync/aws4_request, SignedHeaders=accept;content-encoding;content-length;content-type;host;x-amz-date;x-amz-security-token, Signature=94c63af07ab0f824ba02b0a3334eae990ee0feca988c20068c0b86df65584e59',
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
}
*/
const mysql_datasource_1 = require("../../classes/app-sync/datasources/mysql.datasource");
exports.handler = async (event, context) => {
    console.log('event', event);
    console.log('context', context);
    const mySqlDatasource = new mysql_datasource_1.AppSyncMySqlDatasource();
    console.log('event.stash.operation', event.stash.operation);
    // eslint-disable-next-line dot-notation
    return mySqlDatasource['find']('abc123');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwtZGF0YXNvdXJjZS5jb25zdHJ1Y3QuaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25zdHJ1Y3RzL2FwcC1zeW5jL215c3FsLWRhdGFzb3VyY2UuY29uc3RydWN0LmhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtHQUErRztBQUMvRyxzQ0FBc0M7O0FBRXRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBeUVFO0FBRUYsMEZBQTZGO0FBRTdGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxPQUFZLEVBQUUsRUFBRTtJQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVoQyxNQUFNLGVBQWUsR0FBRyxJQUFJLHlDQUFzQixFQUFFLENBQUM7SUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVELHdDQUF3QztJQUN4QyxPQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUT0RPOiBXaGVyZSBpcyB0aGUgQXBwU3luYyBldmVudCB0eXBlIGkuZS4gQXBwU3luY1Jlc29sdmVyRXZlbnQ/IGNkay5hd3NfbGFtYmRhX2V2ZW50X3NvdXJjZXMuQXBpRXZlbnRTb3VyY2VcclxuLy8gaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuXHJcbi8qXHJcbmV2ZW50IHtcclxuICBhcmd1bWVudHM6IHt9LFxyXG4gIGlkZW50aXR5OiB7XHJcbiAgICBhY2NvdW50SWQ6ICcwNjYyMDk2NTM1NjcnLFxyXG4gICAgY29nbml0b0lkZW50aXR5QXV0aFByb3ZpZGVyOiBudWxsLFxyXG4gICAgY29nbml0b0lkZW50aXR5QXV0aFR5cGU6IG51bGwsXHJcbiAgICBjb2duaXRvSWRlbnRpdHlJZDogbnVsbCxcclxuICAgIGNvZ25pdG9JZGVudGl0eVBvb2xJZDogbnVsbCxcclxuICAgIHNvdXJjZUlwOiBbICcyMDUuMjUxLjIzMy4zMycgXSxcclxuICAgIHVzZXJBcm46ICdhcm46YXdzOnN0czo6MDY2MjA5NjUzNTY3OmFzc3VtZWQtcm9sZS9BV1NSZXNlcnZlZFNTT19BZG1pbmlzdHJhdG9yQWNjZXNzXzk1YWNkYmM4MWM4NDRjNTYvYWRtaW4nLFxyXG4gICAgdXNlcm5hbWU6ICdBUk9BUTYyVEhFTTc2WFE2VE9VUEs6YWRtaW4nXHJcbiAgfSxcclxuICBzb3VyY2U6IG51bGwsXHJcbiAgcmVxdWVzdDoge1xyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnY29udGVudC1lbmNvZGluZyc6ICdhbXotMS4wJyxcclxuICAgICAgJ3gtZm9yd2FyZGVkLWZvcic6ICcyMDUuMjUxLjIzMy4zMywgNzAuMTMyLjMxLjcyJyxcclxuICAgICAgJ2Nsb3VkZnJvbnQtdmlld2VyLWNvdW50cnknOiAnVVMnLFxyXG4gICAgICAnY2xvdWRmcm9udC1pcy10YWJsZXQtdmlld2VyJzogJ2ZhbHNlJyxcclxuICAgICAgJ3gtYW16bi1yZXF1ZXN0aWQnOiAnZjAzZWVhMTUtMDNhNS00YmRkLTg3YTEtZTQwMjZiOGY1NWMyJyxcclxuICAgICAgdmlhOiAnMS4xIDBhZWJmM2ZlNDMzZmY5NmU2OGQ3ODVmYWQ0ZWE0YzBlLmNsb3VkZnJvbnQubmV0IChDbG91ZEZyb250KScsXHJcbiAgICAgICdjbG91ZGZyb250LWZvcndhcmRlZC1wcm90byc6ICdodHRwcycsXHJcbiAgICAgICdjb250ZW50LWxlbmd0aCc6ICcyMjcnLFxyXG4gICAgICBob3N0OiAncmQ3YjR4MnJiamhhN2sydGk2ejZ5amVkbHkuYXBwc3luYy1hcGkudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20nLFxyXG4gICAgICAneC1mb3J3YXJkZWQtcHJvdG8nOiAnaHR0cHMnLFxyXG4gICAgICAndXNlci1hZ2VudCc6ICdhd3MtaW50ZXJuYWwvMyBhd3Mtc2RrLWphdmEvMS4xMi4xODIgTGludXgvNS40LjE4MS0xMDkuMzU0LmFtem4yaW50Lng4Nl82NCBPcGVuSkRLXzY0LUJpdF9TZXJ2ZXJfVk0vMjUuMzIyLWIwNiBqYXZhLzEuOC4wXzMyMiBrb3RsaW4vMS4zLjcyIHZlbmRvci9PcmFjbGVfQ29ycG9yYXRpb24gY2ZnL3JldHJ5LW1vZGUvc3RhbmRhcmQnLFxyXG4gICAgICAnY2xvdWRmcm9udC1pcy1tb2JpbGUtdmlld2VyJzogJ2ZhbHNlJyxcclxuICAgICAgYWNjZXB0OiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0JyxcclxuICAgICAgJ3gtYW16LWRhdGUnOiAnMjAyMjA0MTBUMjE1MzQ4WicsXHJcbiAgICAgICdjbG91ZGZyb250LWlzLXNtYXJ0dHYtdmlld2VyJzogJ2ZhbHNlJyxcclxuICAgICAgJ2Ftei1zZGstcmVxdWVzdCc6ICd0dGw9MjAyMjA0MTBUMjE1NDQ4WjthdHRlbXB0PTE7bWF4PTEnLFxyXG4gICAgICAnYW16LXNkay1pbnZvY2F0aW9uLWlkJzogJzQ2YTBlNDlmLWYwMDktY2JhYi04MDRlLTU5MjQxZmYwMjhlMycsXHJcbiAgICAgICd4LWFtei1zZWN1cml0eS10b2tlbic6ICdJUW9KYjNKcFoybHVYMlZqRUhVYUNYVnpMWGRsYzNRdE1pSkdNRVFDSUNDcjNQOFN1ZFJEdmVQSzhUV1l2Yk01Vi8rbVpqcW91V3RkL3BEcnFwbXFBaUJnMWc4bE9YMnhqZytTbmRGUmZaNGlMTU05ZGJPaTRGcjJoWHU5REl5cm55cjJBd2dlRUFBYUREQTJOakl3T1RZMU16VTJOeUlNbm9rOElkYzI0NUJkNGwvUUt0TURRNnByem9heXk2dTRpNmdZb0pmWHdLeWoxWlZmUmFnVDZnMG5uNHB5UnM1cmNGMldkb25nMXlZTUxsK0NDY1RaSVBGeENIZ3R2bkdlb1JFVnl5eUp3QTQ4SVI5YmtHVkEzcVZrRC81WUt3Um0wZ2p2UER2eHlVU1EyWFFQWitqMmhudDhxc25ucVJPbTNIVXdZTzhzRlRrQ2lPb2E5akk3elVUSjU0ZmR1bi8zbG5NaFNMZU1jUE9sMFVGTHBtVnArbnJOK0s5ZFNnNHN1SGVtbExEWEVvenJOQVorc3NVb2VvUThFUFgydHRsQzVjaS9OWUt6TU45V3BEcWErUDhTalJOOWt6TW1JMm5OY1ZMOWRSSk9SaWVxVVJKYkZBaUZ6WjBFcTMzMnpYY0tLSzdvQXgwczU3VGU1R25XZjcxekQ4djlPUVgyTWRKczFxc01aOGUrYmI1VkorR2kxTGxKKzRMRXpHaEsydFpsSWp2QzRUT3NwemR1Y3ZpTmtkL25mdkxZQTRrTU5DLzIzeVYrVG94R3UxTUp5dk9KNzltZnhETC9SdnBQWUl3OFd6Q3JSbkora3RPL1UyOXM3T2NxeUxtaWRpRUE5aitEdEdqa042ZkdweWgyMEI2TS9aYU5OT04yVUZYUTNkWDB2eWlZSXQ4NVZGZGg3THNNenkyUi9RRUswb1hDUHVXWnFKNzJOZ2lqQ3FCcUU2NmhONUFURFgzRE10QUlnY1U4VzNUaTZaOUpaV01zd0UzTzNGZHcvMjZBL0tCWHNMVVhLbVkxQ3NtSGZ4aHhja2NQMHp3WFliVUtGZmNpWVdjOElIb3dzdjNNa2dZNm1RSTYwVUdVSGNxSisybXNzSmRhbTRZak41QWU3RkVwVU9FTG9ycEFDTCsxaDcrdUFuSW5ScFZScHlkK0FhN090Sit0a0tML0ZKRXBEd3pTdklrKzZ0ZitHWUMvUW1rdVVYUEJFcGhPYi8yL24vYXFGamp0QkJacjducng2eUJKbFdmS3JvZDRSN0dRa0kxOWowZlNXOE05UzA2aERORlF6Njk0ckd4OGtQcU1KZmxJTzZ5TnREemlnNU9YckQxZHlKZEVCVUNyYzBaYUdJeC9vY0VacGxrSFdTMk1oaC9pYWtFamdic1RWTmI2YzFoUFFBTE92Vno3Z0YrU0JRcTNDRS9mc2V5ZE9VSVRRY1I4eGFmZ21ETzd4ZEYwdXNMWXQ4RFhtNTh5YUVkK3BOdHI1dTd2czVhRnNwb2ZQTGhJZHR0cksxS25HOUxabExmbFphOFpoVXZKaWZSaUwrdkJWblFSYlJiNUdOVWhaNzkveE1ocGRWOFJnUT09JyxcclxuICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgJ3gtYW16LWNmLWlkJzogJy1TMkFWRXpZeWItWG94MkJMOW5EQ2toM05YQW9NSnZpbG1CYWRTMFhIM0pBeFhIdndTMFNNdz09JyxcclxuICAgICAgJ3gtYW16bi10cmFjZS1pZCc6ICdSb290PTEtNjI1MzUxZWMtMjkwYjNmNjg2MmI5OWE2OTMxZjM2YmI5JyxcclxuICAgICAgYXV0aG9yaXphdGlvbjogJ0FXUzQtSE1BQy1TSEEyNTYgQ3JlZGVudGlhbD1BU0lBUTYyVEhFTTdTN0hUT0NHVi8yMDIyMDQxMC91cy13ZXN0LTIvYXBwc3luYy9hd3M0X3JlcXVlc3QsIFNpZ25lZEhlYWRlcnM9YWNjZXB0O2NvbnRlbnQtZW5jb2Rpbmc7Y29udGVudC1sZW5ndGg7Y29udGVudC10eXBlO2hvc3Q7eC1hbXotZGF0ZTt4LWFtei1zZWN1cml0eS10b2tlbiwgU2lnbmF0dXJlPTk0YzYzYWYwN2FiMGY4MjRiYTAyYjBhMzMzNGVhZTk5MGVlMGZlY2E5ODhjMjAwNjhjMGI4NmRmNjU1ODRlNTknLFxyXG4gICAgICAnYW16LXNkay1yZXRyeSc6ICcwLzAvNTAwJyxcclxuICAgICAgJ2Nsb3VkZnJvbnQtaXMtZGVza3RvcC12aWV3ZXInOiAndHJ1ZScsXHJcbiAgICAgICd4LWZvcndhcmRlZC1wb3J0JzogJzQ0MydcclxuICAgIH0sXHJcbiAgICBkb21haW5OYW1lOiBudWxsXHJcbiAgfSxcclxuICBwcmV2OiBudWxsLFxyXG4gIGluZm86IHtcclxuICAgIHNlbGVjdGlvblNldExpc3Q6IFtcclxuICAgICAgJ2VkZ2VzJyxcclxuICAgICAgJ2VkZ2VzL25vZGUnLFxyXG4gICAgICAnZWRnZXMvbm9kZS9pZCcsXHJcbiAgICAgICdlZGdlcy9ub2RlL3RpdGxlJyxcclxuICAgICAgJ2VkZ2VzL25vZGUvbWNvbW1lbnRzJyxcclxuICAgICAgJ2VkZ2VzL25vZGUvbWNvbW1lbnRzL2lkJyxcclxuICAgICAgJ2VkZ2VzL25vZGUvbWNvbW1lbnRzL2h0bWwnXHJcbiAgICBdLFxyXG4gICAgc2VsZWN0aW9uU2V0R3JhcGhRTDogJ3tcXG4nICtcclxuICAgICAgJyAgZWRnZXMge1xcbicgK1xyXG4gICAgICAnICAgIG5vZGUge1xcbicgK1xyXG4gICAgICAnICAgICAgaWRcXG4nICtcclxuICAgICAgJyAgICAgIHRpdGxlXFxuJyArXHJcbiAgICAgICcgICAgICBtY29tbWVudHMge1xcbicgK1xyXG4gICAgICAnICAgICAgICBpZFxcbicgK1xyXG4gICAgICAnICAgICAgICBodG1sXFxuJyArXHJcbiAgICAgICcgICAgICB9XFxuJyArXHJcbiAgICAgICcgICAgfVxcbicgK1xyXG4gICAgICAnICB9XFxuJyArXHJcbiAgICAgICd9JyxcclxuICAgIGZpZWxkTmFtZTogJ21wb3N0RmluZCcsXHJcbiAgICBwYXJlbnRUeXBlTmFtZTogJ1F1ZXJ5JyxcclxuICAgIHZhcmlhYmxlczoge31cclxuICB9LFxyXG4gIHN0YXNoOiB7IG9wZXJhdGlvbjogJ2ZpbmQnIH1cclxufVxyXG4qL1xyXG5cclxuaW1wb3J0IHsgQXBwU3luY015U3FsRGF0YXNvdXJjZSB9IGZyb20gJy4uLy4uL2NsYXNzZXMvYXBwLXN5bmMvZGF0YXNvdXJjZXMvbXlzcWwuZGF0YXNvdXJjZSc7XHJcblxyXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dDogYW55KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZXZlbnQnLCBldmVudCk7XHJcbiAgICBjb25zb2xlLmxvZygnY29udGV4dCcsIGNvbnRleHQpO1xyXG5cclxuICAgIGNvbnN0IG15U3FsRGF0YXNvdXJjZSA9IG5ldyBBcHBTeW5jTXlTcWxEYXRhc291cmNlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnZXZlbnQuc3Rhc2gub3BlcmF0aW9uJywgZXZlbnQuc3Rhc2gub3BlcmF0aW9uKTtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkb3Qtbm90YXRpb25cclxuICAgIHJldHVybiBteVNxbERhdGFzb3VyY2VbJ2ZpbmQnXSgnYWJjMTIzJyk7XHJcbn07XHJcbiJdfQ==