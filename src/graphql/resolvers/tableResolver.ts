import { fakeTableData } from '../../model/tableModel';
import pubsub from '../pubsub';

const tableResolver = {
    Query: {
        tables: () => {
            return fakeTableData;
        }
    },

    Mutation: {
        updateTable: (_: any, { input }: any) => {
            const { id, state } = input;
            const Index = fakeTableData.findIndex(table => table.id === Number(id));

            fakeTableData[Index] = {
                ...fakeTableData[Index],
                state
            };

            pubsub.publish('CHANGE_TABLE_STATUS', {
                ChangeTableStatus: fakeTableData.map(table => ({
                    data: table,
                    message: ''
                }))
            });
        
            return {
                data: fakeTableData[Index],
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