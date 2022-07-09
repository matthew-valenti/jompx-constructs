import { IAppSyncConnection, IAppSyncResolverEvent } from '../app-sync.types';
export declare class AppSyncDatasource {
    protected event: IAppSyncResolverEvent;
    constructor(event: IAppSyncResolverEvent);
    protected find?(): IAppSyncConnection;
}
