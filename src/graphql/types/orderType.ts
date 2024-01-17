import gql from 'graphql-tag';

const orderType = gql`
    scalar Date

    type OrderItems {
        id: ID!
        orderId: ID!
        productId: ID!
        value: Float!
        status: Int! #  0: Cancelado, 1: Confirmado
    }

    type Order {
        id: ID!
        bartenderId: ID!
        tableId: ID!
        value: Float!
        date: Date!
        status: Int! #  0: Concluído, 1: Resgatado, 2: Confirmado, 3: Finalizado
        items: [OrderItems]!
    }

    input OrderItemsInput {
        id: ID!
        orderId: ID!
        productId: ID!
        value: Float!
        status: Int!
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

    input OrderStatusInput {
        status: [Int!]!
    }

    type OrderResponse {
        data: Order!
        message: String
    }

    type Query {
        orders(input: OrderStatusInput): [Order!],
        ordersItems: [OrderItems!],
    }

    type Mutation {
        createOrder(input: OrderInput!): OrderResponse
        updateOrder(input: OrderInput!): OrderResponse
    }

    type Subscription {
        ChangeOrderStatus: [OrderResponse],
    }
`;

module.exports = orderType;