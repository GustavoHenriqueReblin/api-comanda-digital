import gql from 'graphql-tag';

const bartenderType = gql`
    type Bartender {
        id: ID!
        name: String!
        securityCode: String!
        token: String!
    }

    input BartenderInput {
        securityCode: String!
    }

    input BartenderAuthInput {
        id: ID!
        loginAuthorization: Boolean!
        token: String!
    }

    type Query {
        bartenders: [Bartender!],
        bartender(input: BartenderInput!): Bartender,
        bartenderAuthToken(input: BartenderAuthInput): String
    }

    type Subscription {
        messageAdded: String
    }
`;

module.exports = bartenderType;