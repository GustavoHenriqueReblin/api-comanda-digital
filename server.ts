const { ApolloServer } = require('apollo-server');
const schemaGraphQL = require('./src/graphql/schema');

const server = new ApolloServer(schemaGraphQL);

server.listen().then(({ url }: any) => {
    console.log(`HTTP server running on ${url} `);
});