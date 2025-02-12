import userResolver from './resolvers/userResolver';
import userTypeSchema from './schema/userSchema';
import categoryResolver from './resolvers/categoryResolver';
import categoryTypeSchema from './schema/categorySchema';
import productResolver from './resolvers/productResolver';
import productTypeSchema from './schema/productSchema';
import tableResolver from './resolvers/tableResolver';
import tableTypeSchema from './schema/tableSchema';
import bartenderResolver from './resolvers/bartenderResolver';
import bartenderTypeSchema from './schema/bartenderSchema';
import orderResolver from './resolvers/orderResolver';
import orderTypeSchema from './schema/orderSchema';

const schema = {
    typeDefs: [
        userTypeSchema //, categoryTypeSchema, productTypeSchema, tableTypeSchema, bartenderTypeSchema, orderTypeSchema
    ],
    resolvers: [
        userResolver, // categoryResolver, productResolver, tableResolver, bartenderResolver, orderResolver
    ],
};

export default schema;