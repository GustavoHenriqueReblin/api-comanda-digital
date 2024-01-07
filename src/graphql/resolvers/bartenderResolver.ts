import { VerifyBartenderToken } from '../../helper';
import { fakeBartenderData } from '../../model/bartenderModel';

const bartenderResolver = {
    Query: {
        bartenders: () => {
            return fakeBartenderData;
        },
        bartender: (_: any, { input }: any) => {
            const { securityCode } = input;
            const bartender = fakeBartenderData.find(bartender => bartender.securityCode === securityCode);
            return bartender;
        },
        bartenderAuthToken: (_: any, { input }: any) => {
            const { id, loginAuthorization, token } = input;
            const bartender = fakeBartenderData.find(bartender => bartender.id === Number(id));
            
            if (bartender) {                
                return VerifyBartenderToken(loginAuthorization, token, bartender);
            }
            return "";
        },
    }
};
  
module.exports = bartenderResolver;