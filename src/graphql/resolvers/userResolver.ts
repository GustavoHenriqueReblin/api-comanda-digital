import { fakeUserData } from '../../model/userModel';
import { nextId, verifyUserToken } from '../../helper';
const jwt = require('jsonwebtoken');

const userResolver = {
    Query: {
        users: () => {
            return fakeUserData;
        },
        user: (_: any, { input }: any) => {
            const { username, password } = input;
            const user = fakeUserData.find(user => user.username === username && user.password === password);
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
        createUser: (_: any, args: any, __: any) => {
            const { username, password } = args.input;
            const newUser: any = {
                id: nextId(fakeUserData),
                username: username,
                password: password,
                token: ""
            };
            fakeUserData.push(newUser);
            return newUser;
        }, 

        updateUser: (_: any, args: any, __: any) => {
            const { id } = args.input;
            const Index = fakeUserData.findIndex(user => user.id === Number(id));

            return verifyUserToken(fakeUserData[Index], false);
        },
    }
  };
  
  module.exports = userResolver;