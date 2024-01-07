const { gql: bartenderGql } = require('apollo-server');

const bartenderType = bartenderGql`
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
`;

module.exports = bartenderType;