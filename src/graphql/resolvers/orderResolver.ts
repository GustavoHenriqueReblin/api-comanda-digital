import { fakeOrderData } from '../../model/orderModel';
import { fakeOrderItemsData } from '../../model/orderItemsModel';
import { nextId } from '../../helper';
import pubsub from '../pubsub';

const orderResolver = {
    Query: {
        order: (_: any, { input }: any) => {
            const { id } = input;
            const order = fakeOrderData.find(order => order.id === Number(id));
            if (order) {
                return order;
            }
            return null;
        },
        orders: (_: any, { input }: any) => {
            return fakeOrderData.filter(order => input.status.includes(order.status));
        },
    },

    Mutation: {
        createOrder: (_: any, { input }: any) => {
            const { bartenderId, bertenderName, tableId, tableCode, date, status } = input;
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
                bertenderName,
                tableId,
                tableCode,
                value: sumItemsValue,
                date,
                status,
                items: newOrderItems
            };
            fakeOrderData.push(newOrder);

            const statusToReturn = [0, 1, 2, 3, 4];
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
            const { id, bartenderId, bertenderName, tableId, tableCode, value, date, status } = input;
            const items = input.items;
        
            const index = fakeOrderData.findIndex(order => order.id === Number(id));
            const updatedOrder = { ...fakeOrderData[index] };
        
            if (bartenderId !== undefined) {
                updatedOrder.bartenderId = bartenderId;
            }

            if (bertenderName !== undefined) {
                updatedOrder.bertenderName = bertenderName;
            }
        
            if (tableId !== undefined) {
                updatedOrder.tableId = tableId;
            }
        
            if (tableCode !== undefined) {
                updatedOrder.tableCode = tableCode;
            }
        
            if (value !== undefined) {
                updatedOrder.value = value;
            }
        
            if (date !== undefined) {
                updatedOrder.date = date;
            }
        
            if (status !== undefined) {
                updatedOrder.status = status;
            }
        
            if (items !== undefined) {
                updatedOrder.items = items.map((item: any) => {
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
                });
            }
        
            fakeOrderData[index] = updatedOrder;
        
            const statusToReturn = [0, 1, 2, 4];
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
  
export default orderResolver;