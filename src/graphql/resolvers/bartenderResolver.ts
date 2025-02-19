import pubsub from '../pubsub';
import { findBartender } from '../../model/bartenderModel';
import { verifyBartenderToken } from '../../helper';
import { GraphQLContext } from '../../types';
const jwt = require('jsonwebtoken');
import { GraphQLError } from 'graphql';

const bartenderResolver = {
    Query: {
        // bartenders: () => {
        //     return fakeBartenderData;
        // },
        bartender: async (_: any, { input }: any, context: GraphQLContext) => {
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

                // await updateBartender({ id: user.id, token });
    
                return {
                    data: [bartender],
                };
            }

            return new GraphQLError('Garçom não encontrado', {
                extensions: { code: 'NOT FOUND' },
            });
        },
        // bartendersAreWaiting: () => {
        //     const bartendersWaiting = fakeBartenderData.filter(bartender => bartender.isWaiting);
        //     return bartendersWaiting.map(bartender => ({
        //         data: bartender,
        //         message: ""
        //     }));
        // },
        // getBartenderByToken: (_: any, { input }: any) => {
        //     const { token } = input;
        //     try {
        //         const tokenTreaty = token.charAt(0) === '"' ? token.match(/"([^"]*)"/)[1] : token;
        //         const decodedToken = jwt.verify(tokenTreaty, process.env.SECRET_KEY);
        //         const bartender = fakeBartenderData.find(bartender => bartender.id === Number(decodedToken.id) && bartender.token === tokenTreaty);
        //         if (!bartender) throw "Garçom não encontrado! ";

        //         return {
        //             data: bartender,
        //             message: ""
        //         };
        //     } catch (error) {
        //         console.error("Erro ao buscar dados pelo token informado: " + error);
        //         return {
        //             data: {
        //                 id: -1,
        //                 name: "",
        //                 securityCode: "",
        //                 token: "",
        //                 isWaiting: false
        //             },
        //             message: "Erro ao buscar dados pelo token informado: " + error
        //         };
        //     }
        // },
    },

    // Mutation: {
    //     updateBartender: (_: any, { input }: any) => {
    //         const { id, isWaiting, isApproved, token } = input;
    //         const Index = fakeBartenderData.findIndex(bartender => bartender.id === Number(id));
    //         const sendAuthResponse = isApproved !== undefined;
    //         const isApprovedNewValue = sendAuthResponse ? isApproved : fakeBartenderData[Index].isApproved;

    //         // Atualiza os dados com o que foi passado na mutation
    //         fakeBartenderData[Index] = {
    //             ...fakeBartenderData[Index],
    //             isWaiting: isWaiting,
    //             isApproved: isApprovedNewValue,
    //             token: sendAuthResponse && isApprovedNewValue ? verifyBartenderToken(token, id) : token,
    //         };

    //         // Busca todos os garçons que estão aguardando aprovação para subscription retornar
    //         const bartendersAreWaiting = fakeBartenderData.filter((bartender: any) => bartender.isWaiting);

    //         if (bartendersAreWaiting.length > 0) {
    //             pubsub.publish('BARTENDER_AUTH_REQUEST', { authBartenderRequest: bartendersAreWaiting });
    //         }
            
    //         if (sendAuthResponse) {
    //             pubsub.publish('BARTENDER_AUTH_RESPONSE', { authBartenderResponse: fakeBartenderData[Index] });
    //         }
        
    //         return {
    //             data: fakeBartenderData[Index],
    //             message: 'Garçom atualizado com sucesso.',
    //         };
    //     },
    // },

    // Subscription: {
    //     authBartenderRequest: {
    //         subscribe: () => {
    //             return pubsub.asyncIterator(['BARTENDER_AUTH_REQUEST']);
    //         },
    //     },
    //     authBartenderResponse: {
    //         subscribe: () => {
    //             return pubsub.asyncIterator(['BARTENDER_AUTH_RESPONSE']);
    //         },
    //     },
    // },
};
  
export default bartenderResolver;