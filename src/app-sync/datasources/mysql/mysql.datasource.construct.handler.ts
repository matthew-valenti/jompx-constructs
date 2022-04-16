// import { AppSyncDatasource } from '../../classes/app-sync/datasources/datasource';
import { IAppSyncResolverEvent } from '../../app-sync.types';
import { AppSyncMySqlDatasource } from './mysql.datasource';

exports.handler = async (event: IAppSyncResolverEvent) => {
    console.log('event', event);
    let data = null;

    if (event?.stash?.operation) {
        const mySqlDatasource = new AppSyncMySqlDatasource(event);
        data = mySqlDatasource[event.stash.operation as keyof AppSyncMySqlDatasource]();
    }

    return data;
};
