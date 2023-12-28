const { gql: schemaGql, makeExecutableSchema } = require('apollo-server');
const userResolver = require('./resolvers/userResolver');
const userTypeSchema = require('./types/userType');

const rootSchema = schemaGql`
    type Query {
        dummy: Boolean
    }

    type Mutation {
        dummy: Boolean
    }
`;

const schema = {
    typeDefs: [rootSchema, userTypeSchema],
    resolvers: [userResolver],
};

module.exports = schema;