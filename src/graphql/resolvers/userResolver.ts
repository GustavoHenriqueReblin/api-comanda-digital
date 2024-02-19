import { getAllUsers, getUser, getUserById, getUserByToken, updateUser } from '../../model/userModel';
import { verifyUserToken } from '../../helper';
import { User } from '../../types';
const jwt = require('jsonwebtoken');

const userResolver = {
    Query: {
        users: async () => {
            const users = await getAllUsers();
            return {
                data: users,
                message: '',
            };
        },

        user: async (_: any, { input }: any) => {
            const { email, password } = input;
            const user = verifyUserToken(await getUser(email, password));
            const message = user ? '' : 'Usuário não encontrado!';
            return {
                data: [user],
                message: message,
            }
        },

        getUserByToken: async (_: any, { input }: any) => {
            const { token } = input;
            try {
                const tokenTreaty = token.charAt(0) === '"' ? token.match(/"([^"]*)"/)[1] : token;
                jwt.verify(tokenTreaty, process.env.SECRET_KEY);
                const user = await getUserByToken(tokenTreaty);
                if (!user) throw "Usuário não encontrado! ";
                
                return {
                    data: [user],
                    message: '',
                };
            } catch (error) {
                const message = "Erro ao buscar usuário pelo token: ";
                console.error(message + error);
                return { 
                    data: [null], 
                    message: message + error,
                };
            }
        },
    },

    Mutation: {
        updateUser: async (_: any, { input }: any, __: any) => {
            const affectedRows = await updateUser(input);
            const user = affectedRows && await getUserById(input.id);
            
            const message = user ? 'Usuário atualizado com sucesso!' : 'Usuário não encontrado!';
            const data = user ? [user] : [{
                id: -1, 
                email: '',
                password: ''
            } as User];
            
            return {
                data: data,
                message: message,
            }
        },
    }
  };
  
  module.exports = userResolver;