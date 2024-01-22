import { fakeTableData } from '../../model/tableModel';
import { fakeOrderData } from '../../model/orderModel';
import { Order, Table } from '../../types';
import pubsub from '../pubsub';

let expireTimers: any = {};

const updateTableState = (id: number, newState: boolean, data: Table[]) => {
    const Index = data.findIndex(table => table.id === Number(id));
    const availableStatus = [0, 1, 2];
    const orderInThisTable = fakeOrderData.find((order: Order) => order.tableId === id && availableStatus.includes(order.status));

    if (!orderInThisTable) {
        data[Index] = {
            ...data[Index],
            state: newState,
        };

        pubsub.publish('CHANGE_TABLE_STATUS', {
            ChangeTableStatus: data.map(table => ({
                data: table,
                message: ''
            }))
        });
    }

    return data[Index];
};

const tableResolver = {
    Query: {
        tables: () => {
            return fakeTableData;
        }
    },

    Mutation: {
        updateTable: (_: any, { input }: any) => {
            const { id, state } = input;
            expireTimers[id] && clearTimeout(expireTimers[id]);
            const tableData = updateTableState(id, state, fakeTableData);

            if (!state) {
                expireTimers[id] = setTimeout(() => {
                    updateTableState(id, !state, fakeTableData);
                }, 10 * 60 * 1000); // 10 minutos
            };
        
            return {
                data: tableData,
                message: 'Mesa atualizada com sucesso.',
            };
        },
    },

    Subscription: {
        ChangeTableStatus: {
            subscribe: () => {
                return pubsub.asyncIterator(['CHANGE_TABLE_STATUS']);
            },
        },
    },
};
  
module.exports = tableResolver;