const { gql: userGql } = require('apollo-server');

const userType = userGql`
    type User {
        id: ID!
        username: String!
        password: String!
        token: String!
    }

    input UserInput {
        username: String!
        password: String!
    }

    type Query {
        users: [User!]!,
        user(input: UserInput!): User!
    }

    type Mutation {
        createUser(input: UserInput!): User!
    }
`;

module.exports = userType;