import gql from 'graphql-tag';

const tableType = gql`
    type Table {
        id: ID!
        code: Int!
        state: Boolean!
    }

    type Query {
        tables: [Table!],
    }
`;

module.exports = tableType;