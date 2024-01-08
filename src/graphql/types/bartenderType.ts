import gql from 'graphql-tag';

const bartenderType = gql`
    type Bartender {
        id: ID!
        name: String!
        securityCode: String!
        token: String!
        isWaiting: Boolean!
    }

    type BartenderResponse {
        data: Bartender
        message: String
    }

    input BartenderInput {
        securityCode: String!
    }

    input UpdateBartenderInput {
        id: ID!
        token: String!
        isWaiting: Boolean!
    }

    type Query {
        bartenders: [Bartender!],
        bartender(input: BartenderInput!): BartenderResponse!,
        bartendersIsWaiting: [BartenderResponse]
    }

    type Mutation {
        updateBartender(input: UpdateBartenderInput!): BartenderResponse
    }

    type Subscription {
        authBartenderRequest: Bartender
    }
`;

module.exports = bartenderType;