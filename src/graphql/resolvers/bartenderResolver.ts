import pubsub from '../pubsub';
import { findBartender, updateBartender } from '../../model/bartenderModel';
import { Bartender, GraphQLContext } from '../../types';
const jwt = require('jsonwebtoken');
import { GraphQLError } from 'graphql';
import queue from '../../services/queue';
import { privateBartenderRouteAuth, privateUserRouteAuth } from '../middleware';

const bartenderResolver = {
    Query: {
        // bartenders: () => {
        //     return fakeBartenderData;
        // },
        bartenderLogin: async (_: any, { input }: any, context: GraphQLContext) => {
            try {
                const { securityCode } = input;
                const bartender = await findBartender({ securityCode });

                if (bartender) {
                    const token = jwt.sign(
                        { Id: bartender.id, securityCode: bartender.securityCode },
                        process.env.SECRET_KEY || 'secret',
                        { expiresIn: '1h' }
                    );
        
                    context.res.cookie(process.env.COOKIE_AUTH_BARTENDER_TOKEN_NAME ?? "", token, {
                        httpOnly: false,
                        secure: true,
                        maxAge: 3600000,
                    });

                    await updateBartender({ id: bartender.id, token });

                    let jobs = await queue.getJobs(["waiting"]);
                    let newRequest = true;

                    for (const job of jobs) {
                        const bartenderInQueue = job.data.mensagem ? JSON.parse(job.data.mensagem) : null;
                        if (bartenderInQueue && bartenderInQueue.id === bartender.id) {
                            newRequest = false;
                            break;
                        }
                    }

                    if (newRequest) {
                        await queue.add({ mensagem: JSON.stringify(bartender) });
                        jobs = await queue.getJobs(["waiting"]);
                        pubsub.publish(
                            'BARTENDER_AUTH_REQUEST', 
                            { authBartenderRequest: jobs.map((job) => job.data.mensagem ? JSON.parse(job.data.mensagem) : null) }
                        );
                    }
        
                    return {
                        data: [bartender],
                    };
                }

                return new GraphQLError('Garçom não encontrado', {
                    extensions: { code: 'NOT FOUND' },
                });
            } catch (error) {
                throw new GraphQLError('Falha ao buscar garçom - ' + error, {
                    extensions: { code: 'INTERNAL SERVER ERROR' },
                });
            }
        },

        bartender: async (_: any, { input }: any, context: GraphQLContext) => {
            try {
                const bartenderAutenticated = await privateBartenderRouteAuth(context);
                const { securityCode, token } = input ?? { securityCode: bartenderAutenticated.securityCode, token: bartenderAutenticated.token };
                const bartender = await findBartender({ securityCode, token });

                if (bartender) {
                    return {
                        data: [bartender],
                    };
                }

                return new GraphQLError('Garçom não encontrado', {
                    extensions: { code: 'NOT FOUND' },
                });
            } catch (error) {
                throw new GraphQLError('Falha ao buscar garçom - ' + error, {
                    extensions: { code: 'INTERNAL SERVER ERROR' },
                });
            }
        },

        bartendersAreWaiting: async (_: any, __: any, context: GraphQLContext) => {
            await privateUserRouteAuth(context);
            const jobs = await queue.getJobs(["waiting"]);
            return {
                data: jobs.filter((job) => !!job.data.mensagem).map((job) => JSON.parse(job.data.mensagem)) as Bartender[],
            };
        },
    },

    Mutation: {
        bartenderAccess: async (_: any, { input }: any, context: GraphQLContext) => {
            try {
                await privateUserRouteAuth(context);
                const { bartenderId, response } = input;

                const bartender = await findBartender({ id: bartenderId });
                if (bartender) {
                    const jobs = await queue.getJobs(["waiting"]);
                    for (const job of jobs) {
                        const bartenderInQueue = job.data.mensagem ? JSON.parse(job.data.mensagem) : null;
                        if (bartenderInQueue && bartenderInQueue.id === bartender.id) {
                            await job.remove();
                            pubsub.publish(
                                'BARTENDER_AUTH_RESPONSE', 
                                { authBartenderResponse: { data: [bartender], authRequestStatus: response }}
                            );

                            return {
                                data: [bartender],
                            }
                        }
                    }
                }

                return new GraphQLError('Garçom não encontrado', {
                    extensions: { code: 'NOT FOUND' },
                });
            } catch (error) {
                throw new GraphQLError('Falha ao enviar resposta de solicitação - ' + error, {
                    extensions: { code: 'INTERNAL SERVER ERROR' },
                });
            }
        },

        cancelAuthBartenderRequest: async (_: any, { input }: any, context: GraphQLContext) => {
            try {
                await privateBartenderRouteAuth(context);
                const { bartenderId } = input;
        
                const bartender = await findBartender({ id: bartenderId });
                if (!bartender) {
                    return new GraphQLError('Garçom não encontrado', {
                        extensions: { code: 'NOT FOUND' },
                    });
                }
        
                let jobs = await queue.getJobs(["waiting"]);
                const updatedJobs: typeof jobs = [];
        
                for (const job of jobs) {
                    const bartenderInQueue = job.data.mensagem ? JSON.parse(job.data.mensagem) : null;
        
                    if (bartenderInQueue && bartenderInQueue.id === bartender.id) {
                        await job.remove();
                    } else {
                        updatedJobs.push(job);
                    }
                }
        
                pubsub.publish(
                    'BARTENDER_AUTH_REQUEST',
                    { authBartenderRequest: updatedJobs.map(job => JSON.parse(job.data.mensagem ?? "{}")) }
                );
        
                return { data: [bartender] };
            } catch (error) {
                throw new GraphQLError('Falha ao cancelar solicitação - ' + error, {
                    extensions: { code: 'INTERNAL SERVER ERROR' },
                });
            }
        }        
    },

    Subscription: {
        authBartenderRequest: {
            subscribe: () => {
                return pubsub.asyncIterator(['BARTENDER_AUTH_REQUEST']);
            },
        },
        authBartenderResponse: {
            subscribe: () => {
                return pubsub.asyncIterator(['BARTENDER_AUTH_RESPONSE']);
            },
        },
    },
};
  
export default bartenderResolver;