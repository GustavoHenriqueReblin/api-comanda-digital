import gql from 'graphql-tag';

const bartenderSchema = gql`
    type Bartender {
        id: ID!
        name: String!
        securityCode: Int!
        token: String
    }

    type BartenderResponse {
        data: [Bartender]
    }

    type AuthBartenderResponse {
        data: [Bartender]
        authRequestStatus: Boolean!
    }

    input BartenderInput {
        token: String
        securityCode: String
    }

    input BartenderLoginInput {
        securityCode: String
    }

    # input UpdateBartenderInput {
    #     id: ID!
    #     isWaiting: Boolean
    #     isApproved: Boolean
    #     token: String
    # }

    input BartenderAccessInput {
        bartenderId: Int!
        response: Boolean!
    }

    input CancelAuthBartenderRequestInput {
        bartenderId: Int!
    }

    type Query {
        bartenders: [Bartender!],
        bartender(input: BartenderInput): BartenderResponse!,
        bartenderLogin(input: BartenderLoginInput!): BartenderResponse!,
        bartendersAreWaiting: BartenderResponse!,
    }

    type Mutation {
        # Chamado pelo admin ao aceitar/recusar a solicitação
        bartenderAccess(input: BartenderAccessInput!): BartenderResponse!,
        cancelAuthBartenderRequest(input: CancelAuthBartenderRequestInput!): BartenderResponse!,
    }

    type Subscription {
        authBartenderRequest: [Bartender],
        authBartenderResponse: AuthBartenderResponse,
    }
`;

export default bartenderSchema;