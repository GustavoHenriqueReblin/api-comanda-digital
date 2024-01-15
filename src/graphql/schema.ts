import gql from 'graphql-tag';
const userResolver = require('./resolvers/userResolver');
const userTypeSchema = require('./types/userType');
const categoryResolver = require('./resolvers/categoryResolver');
const categoryTypeSchema = require('./types/categoryType');
const productResolver = require('./resolvers/productResolver');
const productTypeSchema = require('./types/productType');
const tableResolver = require('./resolvers/tableResolver');
const tableTypeSchema = require('./types/tableTypes');
const bartenderResolver = require('./resolvers/bartenderResolver');
const bartenderTypeSchema = require('./types/bartenderType');
const orderResolver = require('./resolvers/orderResolver');
const orderTypeSchema = require('./types/orderType');

const rootSchema = gql`
    type Query {
        dummy: Boolean
    }

    type Mutation {
        dummy: Boolean
    }
`;

const schema = {
    typeDefs: [
        userTypeSchema, categoryTypeSchema, productTypeSchema, tableTypeSchema, bartenderTypeSchema, orderTypeSchema
    ],
    resolvers: [
        userResolver, categoryResolver, productResolver, tableResolver, bartenderResolver, orderResolver
    ],
};

module.exports = schema;