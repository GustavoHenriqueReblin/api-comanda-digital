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
            const bartender = fakeBartenderData.find(bartender => bartender.securityCode === securityCode);
            
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
        bartendersIsWaiting: () => {
            const bartendersWaiting = fakeBartenderData.filter(bartender => bartender.isWaiting);
            return bartendersWaiting.map(bartender => ({
                data: bartender,
                message: ""
            }));
        },
    },

    Mutation: {
        updateBartender: (_: any, { input }: any) => {
            const { id, isWaiting, isApproved, token } = input;
            const bartenderIndex = fakeBartenderData.findIndex(b => b.id === Number(id));
        
            if (bartenderIndex === -1) {
                return {
                data: null,
                message: 'Garçom não encontrado.',
                };
            }

            const sendAuth = isWaiting !== fakeBartenderData[bartenderIndex].isWaiting && isWaiting;

            const sendAuthResponse = isApproved !== undefined;
            const isApprovedNewValue = sendAuthResponse ? isApproved : fakeBartenderData[bartenderIndex].isApproved;

            fakeBartenderData[bartenderIndex] = {
                ...fakeBartenderData[bartenderIndex],
                isWaiting: isWaiting,
                isApproved: isApprovedNewValue,
                token: sendAuthResponse && isApprovedNewValue ? verifyBartenderToken(token, id) : token,
            };
            
            if (sendAuth) {
                pubsub.publish('BARTENDER_AUTH_REQUEST', { authBartenderRequest: fakeBartenderData[bartenderIndex] });
            }
            
            if (sendAuthResponse) {
                pubsub.publish('BARTENDER_AUTH_RESPONSE', { authBartenderResponse: fakeBartenderData[bartenderIndex] });
            }
        
            return {
                data: fakeBartenderData[bartenderIndex],
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