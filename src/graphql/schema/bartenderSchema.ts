import gql from 'graphql-tag';

const bartenderSchema = gql`
    type Bartender {
        id: ID!
        name: String!
        securityCode: String!
        token: String!
        isWaiting: Boolean!
        isApproved: Boolean
    }

    type BartenderResponse {
        data: Bartender
        message: String
    }

    input BartenderInput {
        token: String
        securityCode: String!
    }

    input UpdateBartenderInput {
        id: ID!
        isWaiting: Boolean
        isApproved: Boolean
        token: String
    }

    type Query {
        bartenders: [Bartender!],
        bartender(input: BartenderInput!): BartenderResponse!,
        bartendersAreWaiting: [BartenderResponse],
        getBartenderByToken(input: BartenderInput!): BartenderResponse
    }

    type Mutation {
        updateBartender(input: UpdateBartenderInput!): BartenderResponse
    }

    type Subscription {
        authBartenderRequest: [Bartender]
        authBartenderResponse: Bartender
    }
`;

export default bartenderSchema;