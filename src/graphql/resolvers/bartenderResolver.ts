import pubsub from '../pubsub';
import { fakeBartenderData } from '../../model/bartenderModel';

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
            
            if (bartender && !bartender.isWaiting) { // Registra pedido de autorização apenas se já não foi solicitada anteriormente
                bartender.isWaiting = true;
                pubsub.publish('BARTENDER_AUTH', { authBartenderRequest: bartender });
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

    Subscription: {
        authBartenderRequest: {
            subscribe: () => {
                return pubsub.asyncIterator(['BARTENDER_AUTH']);
            },
        },
    },
};
  
module.exports = bartenderResolver;