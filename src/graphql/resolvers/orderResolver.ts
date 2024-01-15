import { fakeOrderData } from '../../model/orderModel';
import { fakeOrderItemsData } from '../../model/orderItemsModel';
import { nextId } from '../../helper';

const orderResolver = {
    Query: {
        orders: () => {
            return fakeOrderData;
        },
        ordersItems: () => {
            return fakeOrderItemsData;
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
                status
            };
            fakeOrderData.push(newOrder);
            
            return {
                data: newOrder,
                items: newOrderItems,
                message: 'Pedido criado com sucesso!',
            };
        },
        updateOrder: (_: any, { input }: any) => {
            const { id, bartenderId, tableId, value, date, status } = input;
            const items = input.items;

            // Pedido
            const Index = fakeOrderData.findIndex(order => order.id === Number(id));
            fakeOrderData[Index] = {
                ...fakeOrderData[Index],
                id,
                bartenderId,
                tableId,
                value,
                date,
                status
            };

            // Itens
            const existingItems = fakeOrderItemsData.filter(item => item.orderId === Number(id));
            items.forEach((item: any) => {
                const existingItemIndex = existingItems.findIndex(existingItem => existingItem.id === Number(item.id));
            
                if (existingItemIndex !== -1) { // Atualiza o item existente
                    fakeOrderItemsData[existingItemIndex] = {
                        ...existingItems[existingItemIndex],
                        productId: item.productId,
                        value: item.value,
                        status: item.status
                    };
                } else { // Adiciona o novo item
                    const newItem = {
                        id: nextId(fakeOrderItemsData),
                        orderId: Number(id),
                        productId: item.productId,
                        value: item.value,
                        status: item.status
                    };
                    fakeOrderItemsData.push(newItem);
                }
            });

            const updatedOrder = fakeOrderData[Index];
            const updatedItems = fakeOrderItemsData.filter(item => item.orderId === Number(id));

            return {
                data: updatedOrder,
                items: updatedItems,
                message: 'Pedido atualizado com sucesso!',
            };
        },
    },
};
  
module.exports = orderResolver;