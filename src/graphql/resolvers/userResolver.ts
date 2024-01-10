import { fakeUserData } from '../../model/userModel';
import { verifyUserToken } from '../../helper';

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
        }
    }
  };
  
  module.exports = userResolver;