import gql from 'graphql-tag';

const orderSchema = gql`
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
        bertenderName: String
        tableId: ID
        tableCode: ID
        value: Float
        date: Date
        status: Int! #  0: Concluído, 1: Resgatado, 2: Confirmado, 3: Finalizado, 4: Cancelado
        items: [OrderItems]
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
        bertenderName: String
        tableId: ID
        tableCode: ID
        value: Float
        date: Date
        status: Int!
        items: [OrderItemsInput]
    }

    input OrderStatusInput {
        status: [Int!]!
    }

    input OrderIdInput {
        id: ID!
    }

    type OrderResponse {
        data: Order!
        message: String
    }

    type Query {
        order(input: OrderIdInput): Order,
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

export default orderSchema;