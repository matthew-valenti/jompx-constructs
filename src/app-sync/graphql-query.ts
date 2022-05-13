import * as changeCase from 'change-case';
import * as graphql from 'graphql';
import gql from 'graphql-tag';

export class GraphqlQuery {

    public static find(typeName: string, fieldsFragment: graphql.DocumentNode): graphql.DocumentNode {

        const queryName = `${changeCase.camelCase(typeName)}Find`;

        return gql`query ${queryName} (
                $filter: AWSJSON
                $limit: Int
                $skip: Int
                $sort: [SortInput]
            ) {
                ${queryName}(filter: $filter, limit: $limit, skip: $skip, sort: $sort) {
                    ...fields
                }
            }
            ${fieldsFragment}
        `;
    }
}