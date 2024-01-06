import { fakeTableData } from '../../model/tableModel';

const tableResolver = {
    Query: {
        tables: () => {
            return fakeTableData;
        }
    }
};
  
module.exports = tableResolver;