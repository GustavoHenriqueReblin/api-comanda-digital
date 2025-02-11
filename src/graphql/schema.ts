import userResolver from './resolvers/userResolver';
import userTypeSchema from './types/userType';
import categoryResolver from './resolvers/categoryResolver';
import categoryTypeSchema from './types/categoryType';
import productResolver from './resolvers/productResolver';
import productTypeSchema from './types/productType';
import tableResolver from './resolvers/tableResolver';
import tableTypeSchema from './types/tableTypes';
import bartenderResolver from './resolvers/bartenderResolver';
import bartenderTypeSchema from './types/bartenderType';
import orderResolver from './resolvers/orderResolver';
import orderTypeSchema from './types/orderType';

const schema = {
    typeDefs: [
        userTypeSchema, categoryTypeSchema, productTypeSchema, tableTypeSchema, bartenderTypeSchema, orderTypeSchema
    ],
    resolvers: [
        userResolver, categoryResolver, productResolver, tableResolver, bartenderResolver, orderResolver
    ],
};

export default schema;