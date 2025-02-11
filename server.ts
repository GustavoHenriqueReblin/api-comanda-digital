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
import schemaGraphQL from './src/graphql/schema';
import dotenv from "dotenv";

dotenv.config();

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

server.start().then(() => {
    app.use('/', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));
    httpServer.listen(process.env.PORT, Number(process.env.IP), () => {
        console.log(`Server running on http://${process.env.IP}:${process.env.PORT}/`);
    });
});
