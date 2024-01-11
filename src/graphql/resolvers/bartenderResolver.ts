import pubsub from '../pubsub';
import { fakeBartenderData } from '../../model/bartenderModel';
import { verifyBartenderToken } from '../../helper';

const bartenderResolver = {
    Query: {
        bartenders: () => {
            return fakeBartenderData;
        },
        bartender: (_: any, { input }: any) => {
            const { securityCode } = input;
            const dataWithoutIsApproved = fakeBartenderData.map(({ isApproved, ...rest }) => rest);
            const bartender = dataWithoutIsApproved.find(bartender => bartender.securityCode === securityCode);

            let msg;
            if (bartender && bartender.isWaiting) {
                msg = "Já existe uma solicitação em aberto, por favor aguarde...";
            }

            if (!bartender) {
                msg = "Nenhum garçom encontrado com esse código!";
            }

            return {
                data: bartender,
                message: msg
            };
        },
    },

    Mutation: {
        updateBartender: (_: any, { input }: any) => {
            const { id, isWaiting, isApproved, token } = input;
            const Index = fakeBartenderData.findIndex(bartender => bartender.id === Number(id));
            const sendAuthResponse = isApproved !== undefined;
            const isApprovedNewValue = sendAuthResponse ? isApproved : fakeBartenderData[Index].isApproved;

            // Atualiza os dados com o que foi passado na mutation
            fakeBartenderData[Index] = {
                ...fakeBartenderData[Index],
                isWaiting: isWaiting,
                isApproved: isApprovedNewValue,
                token: sendAuthResponse && isApprovedNewValue ? verifyBartenderToken(token, id) : token,
            };

            // Busca todos os garçons que estão aguardando aprovação para subscription retornar
            const bartendersAreWaiting = fakeBartenderData.filter((bartender: any) => bartender.isWaiting);

            if (bartendersAreWaiting.length > 0) {
                console.log("Requestou");
                pubsub.publish('BARTENDER_AUTH_REQUEST', { authBartenderRequest: bartendersAreWaiting });
            }
            
            if (sendAuthResponse) {
                pubsub.publish('BARTENDER_AUTH_RESPONSE', { authBartenderResponse: fakeBartenderData[Index] });
            }
        
            return {
                data: fakeBartenderData[Index],
                message: 'Garçom atualizado com sucesso.',
            };
        },
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
  
module.exports = bartenderResolver;