import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from "@apollo/server/express4"
import cors from 'cors';
import bodyParser from 'body-parser';
const schemaGraphQL = require('./src/graphql/schema');

( async function () {
    const app = express();
    const httpServer = createServer(app);

    const { typeDefs, resolvers } = schemaGraphQL;
    const schema = makeExecutableSchema({typeDefs, resolvers});
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/"
    });

    const serverCleanup = useServer({ schema }, wsServer);
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        }
                    }
                }
            }
        ]
    });

    await server.start();
    app.use('/', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));
    httpServer.listen(4000, () => {
        console.log("Server running on http://localhost:" + "4000" + "/");
    });

})();