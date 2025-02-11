import { verifyUserToken } from '../../helper';
import { fakeUserData } from '../../model/userModel';
const jwt = require('jsonwebtoken');

const userResolver = {
    Query: {
        users: async () => {
            return fakeUserData;
        },

        user: async (_: any, { input }: any) => {
            const { email, password } = input;
            const user = fakeUserData.find(user => user.email === email && user.password === password);
            return verifyUserToken(user);
        },

        getUserByToken: (_: any, { input }: any) => {
            const { token } = input;
            try {
                const tokenTreaty = token.charAt(0) === '"' ? token.match(/"([^"]*)"/)[1] : token;
                const decodedToken = jwt.verify(tokenTreaty, process.env.SECRET_KEY);
                
                const user = fakeUserData.find(user => user.id === Number(decodedToken.id) && user.token === tokenTreaty);
                if (!user) throw "Usuário não encontrado! ";
                
                return user;
            } catch (error) {
                console.error("Erro ao buscar dados pelo token informado: " + error);
                return {
                    id: -1,
                    username: "",
                    password: "",
                    token: "",
                };
            }
        },
    },

    Mutation: {
        updateUser: (_: any, args: any, __: any) => {
            const { id } = args.input;
            const Index = fakeUserData.findIndex(user => user.id === Number(id));

            return verifyUserToken(fakeUserData[Index], false);
        },
    }
};
  
export default userResolver;