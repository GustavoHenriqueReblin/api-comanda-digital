import { fakeUserData } from '../../model/userModel';
import { verifyUserToken } from '../../helper';
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
        getIdByToken: (_: any, { input }: any) => {
            const { token } = input;
            const user = fakeUserData.find(user => user.token === token);
            if (user) {
                const decoded = jwt.verify(user.token, process.env.SECRET_KEY);
                return decoded.id;
            }
            return -1;
        },
    },

    Mutation: {
        createUser: (_: any, args: any, __: any) => {
            const { username, password } = args.input;
            const newUser: any = {
                id: fakeUserData.length + 1,
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