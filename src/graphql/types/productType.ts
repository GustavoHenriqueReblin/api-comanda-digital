const { gql: productGql } = require('apollo-server');

const productType = productGql`
    type Product {
        id: ID!
        idCategory: ID!
        name: String!
        price: Float!
        description: String!
    }

    input FilterInput {
        idCategory: [Int]
    }

    type Query {
        products(filter: FilterInput): [Product!],
    }
`;

module.exports = productType;