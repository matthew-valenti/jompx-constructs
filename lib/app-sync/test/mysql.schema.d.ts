import { ISchemaTypes, IDataSource } from '../app-sync.types';
/**
 * Use GraphqlType for simple fields.
 * Use Field if additional attributes are required e.g. directives.
 * Use ResolvableField if the field exists in another type or datasource.
  */
export declare class MySqlSchema {
    private datasources;
    types: ISchemaTypes;
    constructor(datasources: IDataSource);
}
