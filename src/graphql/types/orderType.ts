import gql from 'graphql-tag';

const orderType = gql`
    scalar Date

    type Order {
        id: ID!
        bartenderId: ID!
        tableId: ID!
        value: Float!
        date: Date!
        status: Int! #  0: Concluído, 1: Resgatado, 2: Confirmado, 3: Finalizado
    }

    type OrderItems {
        id: ID!
        orderId: ID!
        productId: ID!
        value: Float!
        status: Int! #  0: Cancelado, 1: Confirmado
    }

    input OrderInput {
        id: ID!
        bartenderId: ID!
        tableId: ID!
        value: Float!
        date: Date!
        status: Int!
        items: [OrderItemsInput!]!
    }

    input OrderItemsInput {
        id: ID!
        orderId: ID!
        productId: ID!
        value: Float!
        status: Int!
    }

    type OrderResponse {
        data: Order!
        items: [OrderItems]!
        message: String
    }

    type Query {
        orders: [Order!],
        ordersItems: [OrderItems!],
    }

    type Mutation {
        createOrder(input: OrderInput!): OrderResponse
        updateOrder(input: OrderInput!): OrderResponse
    }
`;

module.exports = orderType;