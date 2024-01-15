import { fakeOrderData } from '../../model/orderModel';
import { fakeOrderItemsData } from '../../model/orderItemsModel';
import { nextId } from '../../helper';
import pubsub from '../pubsub';

const orderResolver = {
    Query: {
        orders: () => {
            return fakeOrderData;
        },
    },

    Mutation: {
        createOrder: (_: any, { input }: any) => {
            const { bartenderId, tableId, date, status } = input;
            const items = input.items;
            let sumItemsValue = 0;

            const newOrderId = nextId(fakeOrderData);
            const newOrderItems = items.map((item: any) => {
                sumItemsValue += item.status === 1 ? item.value : 0;
                const newItem = {
                    id: nextId(fakeOrderItemsData),
                    orderId: newOrderId,
                    productId: item.productId,
                    value: item.value,
                    status: item.status 
                };
                fakeOrderItemsData.push(newItem);
                return newItem;
            });

            const newOrder = {
                id: newOrderId,
                bartenderId,
                tableId,
                value: sumItemsValue,
                date,
                status,
                items: newOrderItems
            };
            fakeOrderData.push(newOrder);
            
            return {
                data: newOrder,
                message: 'Pedido criado com sucesso!',
            };
        },
        updateOrder: (_: any, { input }: any) => {
            const { id, bartenderId, tableId, value, date, status } = input;
            const items = input.items;

            // Pedido
            const index = fakeOrderData.findIndex(order => order.id === Number(id));
            fakeOrderData[index] = {
                ...fakeOrderData[index],
                id,
                bartenderId,
                tableId,
                value,
                date,
                status,
                items: items.map((item: any) => {
                    const itemIndex = fakeOrderItemsData.findIndex(existingItem => existingItem.id === Number(item.id));

                    if (itemIndex !== -1) { // Atualiza o item existente
                        fakeOrderItemsData[itemIndex] = {
                            ...fakeOrderItemsData[itemIndex],
                            productId: item.productId,
                            value: item.value,
                            status: item.status
                        };
                        return fakeOrderItemsData[itemIndex];
                    } else { // Adiciona o novo item
                        const newItem = {
                            id: nextId(fakeOrderItemsData),
                            orderId: Number(id),
                            productId: item.productId,
                            value: item.value,
                            status: item.status
                        };
                        fakeOrderItemsData.push(newItem);
                        return newItem;
                    }
                })
            };
            
            return {
                data: fakeOrderData[index],
                message: 'Pedido atualizado com sucesso!',
            };
        },
    },

    Subscription: {
        changeOrderStatus: {
            subscribe: () => {
                return pubsub.asyncIterator(['ORDER_STATUS']);
            },
        },
    },
};
  
module.exports = orderResolver;