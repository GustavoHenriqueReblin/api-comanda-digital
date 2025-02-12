import gql from 'graphql-tag';

const tableSchema = gql`
    type Table {
        id: ID!
        code: Int!
        state: Boolean!
    }

    type Query {
        tables: [Table!],
    }

    type TableResponse {
        data: Table!
        message: String
    }

    input TableInput {
        id: ID!
        code: Int!
        state: Boolean!
    }

    type Mutation {
        updateTable(input: TableInput!): TableResponse
    }

    type Subscription {
        ChangeTableStatus: [TableResponse],
    }
`;

export default tableSchema;