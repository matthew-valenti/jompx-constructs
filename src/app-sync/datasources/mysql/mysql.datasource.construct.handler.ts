// import { AppSyncDatasource } from '../../classes/app-sync/datasources/datasource';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AppSyncResolverEvent } from 'aws-lambda';
import { AppSyncMySqlDatasource } from './mysql.datasource';

/**
 * TODO: Error handling: https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-lambda-resolvers.html#returning-errors
 */
exports.handler = async (event: AppSyncResolverEvent<any>) => {
    console.log('event', event);
    console.log('process', process);

    let data = null;

    if (event?.stash?.operation) {
        const mySqlDatasource = new AppSyncMySqlDatasource(event);
        data = mySqlDatasource[event.stash.operation as keyof AppSyncMySqlDatasource]();
        // args, info, rargs
    }

    return data;
};

// Resolver arguments
// https://www.apollographql.com/docs/apollo-server/data/resolvers/
// parent, args, context, info