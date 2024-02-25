import gql from 'graphql-tag';

const productType = gql`
    type Product {
        id: ID!
        idCategory: ID!
        name: String!
        price: Float!
        description: String
    }

    input FilterInput {
        categoriesIds: [Int]
        productsIds: [Int]
    }

    type Query {
        products(filter: FilterInput): [Product!],
    }
`;

module.exports = productType;