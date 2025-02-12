import gql from 'graphql-tag';

const categorySchema = gql`
    type Category {
        id: ID!
        name: String!
    }

    type Query {
        categories: [Category!],
    }
`;

export default categorySchema;