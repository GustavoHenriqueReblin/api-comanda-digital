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
          const { id, isWaiting, token } = input;
          const bartenderIndex = fakeBartenderData.findIndex(b => b.id === Number(id));
    
          if (bartenderIndex === -1) {
            return {
              data: null,
              message: 'Garçom não encontrado.',
            };
          }
          const sendAuth = isWaiting !== fakeBartenderData[bartenderIndex].isWaiting;
    
          fakeBartenderData[bartenderIndex] = {
            ...fakeBartenderData[bartenderIndex],
            isWaiting: isWaiting || fakeBartenderData[bartenderIndex].isWaiting,
            token: token || fakeBartenderData[bartenderIndex].token,
          };

          if (sendAuth) {
            pubsub.publish('BARTENDER_AUTH_REQUEST', { authBartenderRequest: fakeBartenderData[bartenderIndex] });
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
    },
};
  
module.exports = bartenderResolver;