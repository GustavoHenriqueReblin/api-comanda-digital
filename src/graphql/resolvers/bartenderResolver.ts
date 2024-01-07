import { PubSub } from 'graphql-subscriptions';
import { fakeBartenderData } from '../../model/bartenderModel';

const pubsub = new PubSub();

const bartenderResolver = {
    Query: {
        bartenders: () => {
            return fakeBartenderData;
        },
        bartender: (_: any, { input }: any) => {
            const { securityCode } = input;
            const bartender = fakeBartenderData.find(bartender => bartender.securityCode === securityCode);
            if (bartender) {
                pubsub.publish('BARTENDER_AUTH_REQUEST', {
                    bartenderSendedAuthRequest: bartender
                });
            }
            return bartender;
        },
    },

    Subscription: {
        bartenderSendedAuthRequest: {
            subscribe: () => pubsub.asyncIterator(['BARTENDER_AUTH_REQUEST']),
        },
    }
  };
  
  module.exports = bartenderResolver;