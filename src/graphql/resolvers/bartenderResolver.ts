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
            if (bartender) {
                pubsub.publish('MESSAGE_ADDED', { messageAdded: 'Nova mensagem!' });
                console.log('Publicou MESSAGE_ADDED');
            }
            return bartender;
        },
    },

    Subscription: {
        messageAdded: {
            subscribe: () => {
                console.log('Subscreveu a MESSAGE_ADDED');
                return pubsub.asyncIterator(['MESSAGE_ADDED']);
            },
        },
    },
};
  
module.exports = bartenderResolver;