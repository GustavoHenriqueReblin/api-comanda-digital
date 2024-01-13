import pubsub from '../pubsub';
import { fakeBartenderData } from '../../model/bartenderModel';
import { verifyBartenderToken } from '../../helper';
const jwt = require('jsonwebtoken');

const bartenderResolver = {
    Query: {
        bartenders: () => {
            return fakeBartenderData;
        },
        bartender: (_: any, { input }: any) => {
            const { securityCode } = input;
            const dataWithoutIsApproved = fakeBartenderData.map(({ isApproved, ...rest }) => rest);
            let bartender = dataWithoutIsApproved.find(bartender => bartender.securityCode === securityCode);
            let msg;

            if (bartender && bartender.token) {
                bartender = {
                    id: -1,
                    name: "",
                    securityCode: "",
                    token: "",
                    isWaiting: false
                }
                msg = "Este garçom já está logado em outro dispositivo...";
            }

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
        bartendersAreWaiting: () => {
            const bartendersWaiting = fakeBartenderData.filter(bartender => bartender.isWaiting);
            return bartendersWaiting.map(bartender => ({
                data: bartender,
                message: ""
            }));
        },
        getDataByToken: (_: any, { input }: any) => {
            const { token } = input;
            try {
                let tokenTreaty = token;
                tokenTreaty = token.charAt(0) === '"' && token.match(/"([^"]*)"/)[1];
                const decoded = jwt.verify(tokenTreaty, process.env.SECRET_KEY);

                const bartender = {
                    id: decoded.id,
                    name: decoded.name,
                    securityCode: decoded.securityCode,
                    token: "",
                    isWaiting: decoded.isWaiting,
                    isApproved: decoded.isApproved,
                };

                return {
                    data: bartender,
                    message: ""
                };
            } catch (error) {
                console.log("Erro ao buscar dados pelo token informado: " + error);
                return {
                    data: {
                        id: -1,
                        name: "",
                        securityCode: "",
                        token: "",
                        isWaiting: false
                    },
                    message: ""
                };
            }
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