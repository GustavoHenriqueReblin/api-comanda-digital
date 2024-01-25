import { fakeOrderData } from '../../model/orderModel';
import { fakeOrderItemsData } from '../../model/orderItemsModel';
import { nextId } from '../../helper';
import pubsub from '../pubsub';

const orderResolver = {
    Query: {
        orders: (_: any, { input }: any) => {
            return fakeOrderData.filter(order => input.status.includes(order.status));
        },
    },

    Mutation: {
        createOrder: (_: any, { input }: any) => {
            const { bartenderId, tableId, tableCode, date, status } = input;
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
                tableCode,
                value: sumItemsValue,
                date,
                status,
                items: newOrderItems
            };
            fakeOrderData.push(newOrder);

            const statusToReturn = [0, 1, 2];
            const Orders = fakeOrderData.filter(order => statusToReturn.includes(order.status));
            pubsub.publish('CHANGE_ORDER_STATUS', {
                ChangeOrderStatus: Orders.map(order => ({
                    data: order,
                    message: ''
                }))
            });
            
            return {
                data: newOrder,
                message: 'Pedido criado com sucesso!',
            };
        },
        updateOrder: (_: any, { input }: any) => {
            const { id, bartenderId, tableId, tableCode, value, date, status } = input;
            const items = input.items;

            const index = fakeOrderData.findIndex(order => order.id === Number(id));
            fakeOrderData[index] = {
                ...fakeOrderData[index],
                bartenderId,
                tableId,
                tableCode,
                value,
                date,
                status,
                items: items.map((item: any) => {
                    const itemIndex = fakeOrderItemsData.findIndex(existingItem => existingItem.id === Number(item.id));

                    if (itemIndex !== -1) { 
                        // Atualiza o item existente
                        fakeOrderItemsData[itemIndex] = {
                            ...fakeOrderItemsData[itemIndex],
                            productId: item.productId,
                            value: item.value,
                            status: item.status
                        };
                        return fakeOrderItemsData[itemIndex];
                    } else { 
                        // Adiciona o novo item
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

            const statusToReturn = [0, 1, 2];
            const Orders = fakeOrderData.filter(order => statusToReturn.includes(order.status));
            pubsub.publish('CHANGE_ORDER_STATUS', {
                ChangeOrderStatus: Orders.map(order => ({
                    data: order,
                    message: ''
                }))
            });
            
            return {
                data: fakeOrderData[index],
                message: 'Pedido atualizado com sucesso!',
            };
        },
    },

    Subscription: {
        ChangeOrderStatus: {
            subscribe: () => {
                return pubsub.asyncIterator(['CHANGE_ORDER_STATUS']);
            },
        },
    },
};
  
module.exports = orderResolver;