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
import { authenticate } from './src/graphql/middleware';
import cookieParser from "cookie-parser";
import queue from './src/services/queue';

const corsOptions = {
    origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
    credentials: true,
};

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
    ],
    formatError: (err) => {
        return {
            message: err.message,
            code: err.extensions?.code || 'UNKNOWN_ERROR',
        };
    },
});

server.start().then(() => {
    app.use(
        "/",
        cors(corsOptions),
        bodyParser.json(),
        cookieParser(),
        authenticate,
        expressMiddleware(server, {
            context: async (context: any) => {
                return context;
            },
        })
    );
  
    httpServer.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}/`);
    });
});
