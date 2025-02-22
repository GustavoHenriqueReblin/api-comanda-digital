import gql from 'graphql-tag';

const productSchema = gql`
    type Product {
        id: ID!
        idCategory: ID!
        name: String!
        price: Float!
        description: String
        srcImg: String
    }

    input FilterInput {
        categoriesIds: [Int]
        productsIds: [Int]
    }

    type Query {
        products(filter: FilterInput): [Product!],
    }
`;

export default productSchema;