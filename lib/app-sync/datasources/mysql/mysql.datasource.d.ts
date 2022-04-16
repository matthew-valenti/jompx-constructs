import { IAppSyncConnection } from '../../app-sync.types';
import { AppSyncDatasource } from '../datasource';
export declare class AppSyncMySqlDatasource extends AppSyncDatasource {
    find(): IAppSyncConnection;
}
