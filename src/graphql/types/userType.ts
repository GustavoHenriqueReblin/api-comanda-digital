import gql from 'graphql-tag';

const userType = gql`
    type User {
        id: ID!
        username: String!
        password: String!
        token: String!
    }

    input UserInput {
        id: ID
        username: String
        password: String
        token: String
    }

    type Query {
        users: [User!],
        user(input: UserInput!): User,
        getIdByToken(input: UserInput!): ID
    }

    type Mutation {
        createUser(input: UserInput!): User!
        updateUser(input: UserInput!): User!
    }
`;

module.exports = userType;