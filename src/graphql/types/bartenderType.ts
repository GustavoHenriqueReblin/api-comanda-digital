const { gql: bartenderGql } = require('apollo-server');

const bartenderType = bartenderGql`
    type Bartender {
        id: ID!
        name: String!
        securityCode: String!
    }

    input BartenderInput {
        securityCode: String!
    }

    type Query {
        bartenders: [Bartender!],
        bartender(input: BartenderInput!): Bartender
    }

    type Subscription {
        bartenderSendedAuthRequest: Bartender
    }
`;

module.exports = bartenderType;