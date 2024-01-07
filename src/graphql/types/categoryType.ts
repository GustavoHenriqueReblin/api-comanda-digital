import gql from 'graphql-tag';

const categoryType = gql`
    type Category {
        id: ID!
        name: String!
    }

    type Query {
        categories: [Category!],
    }
`;

module.exports = categoryType;