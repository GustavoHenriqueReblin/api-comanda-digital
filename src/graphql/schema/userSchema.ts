import gql from 'graphql-tag';

const userSchema = gql`
    type User {
        id: ID!
        name: String
        email: String!
        password: String!
        token: String
    }

    input LoginInput {
        email: String
        password: String
    }

    # input UserInput {
    #     id: ID
    #     name: String
    #     email: String
    #     password: String
    #     token: String
    # }

    type UserResponse {
        data: [User]
    }

    type Query {
        user: UserResponse!,
        login(input: LoginInput!): UserResponse!,
    }

    # type Mutation {
    #    createUser(input: UserInput!): UserResponse!
    #    updateUser(input: UserInput!): UserResponse
    # }
`;

export default userSchema;