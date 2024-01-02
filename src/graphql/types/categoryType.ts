const { gql: categoryGql } = require('apollo-server');

const categoryType = categoryGql`
    type Category {
        id: ID!
        name: String!
    }

    type Query {
        categories: [Category!],
    }
`;

module.exports = categoryType;