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

    type Query {
        bartenders: [Bartender!],
        bartender(input: BartenderInput!): Bartender
    }

    type Subscription {
        messageAdded: String
    }
`;

module.exports = bartenderType;