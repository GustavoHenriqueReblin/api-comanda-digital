const { gql: tableGql } = require('apollo-server');

const tableType = tableGql`
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