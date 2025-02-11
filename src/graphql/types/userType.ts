import gql from 'graphql-tag';

const userType = gql`
    type User {
        id: ID!
        name: String
        email: String!
        password: String!
        token: String
    }

    input UserInput {
        id: ID
        name: String
        email: String
        password: String
        token: String
    }

    type UserResponse {
        data: [User]
        message: String
    }

    type Query {
        users: UserResponse!,
        user(input: UserInput!): UserResponse!,
        getUserByToken(input: UserInput!): UserResponse!
    }

    type Mutation {
        # createUser(input: UserInput!): UserResponse!
        updateUser(input: UserInput!): UserResponse
    }
`;

export default userType;