import { IAppSyncResolverEvent, IAppSyncConnection } from '../app-sync.types';
export declare abstract class AppSyncDatasource {
    protected props: IAppSyncResolverEvent;
    constructor(props: IAppSyncResolverEvent);
    protected find?(): IAppSyncConnection;
    protected findOne?(): any;
    protected insertOne?(): any;
    protected insertMany?(): any;
    protected updateOne?(): any;
    protected updateMany?(): any;
    protected deleteOne?(): any;
    protected deleteMany?(): any;
    protected destroyOne?(): any;
    protected destoryMany?(): any;
}
