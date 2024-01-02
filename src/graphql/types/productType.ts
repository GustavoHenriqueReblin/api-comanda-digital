const { gql: productGql } = require('apollo-server');

const productType = productGql`
    type Product {
        id: ID!
        idCategory: Int!
        name: String!
        price: Float!
        description: String!
    }

    type Query {
        products: [Product!],
    }
`;

module.exports = productType;