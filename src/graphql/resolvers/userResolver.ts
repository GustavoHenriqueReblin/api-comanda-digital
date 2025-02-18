import { fakeUserData } from '../../model/userModel';
import { GraphQLError } from 'graphql';
import { GraphQLContext } from "../../types";
import jwt from 'jsonwebtoken';

const userResolver = {
    Query: {
        user: async (_: any, __: any, context: GraphQLContext) => {
            if (!context.req.user || !context.req.user.Id) {
                throw new GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const user = fakeUserData.find(user => user.id === context.req.user.Id as number);
            return {
                data: [user],
            };
        },

        login: async (_: any, { input }: any, context: GraphQLContext) => {
            try {
                const { email, password } = input;
                const user = fakeUserData.find(user => user.email === email && user.password === password);
                if (user) {
                    const token = jwt.sign(
                        { Id: user.id, email: user.email },
                        process.env.SECRET_KEY || 'secret',
                        { expiresIn: '1h' }
                    );
        
                    context.res.cookie(process.env.COOKIE_AUTH_TOKEN_NAME ?? "", token, {
                        httpOnly: false,
                        secure: true,
                        maxAge: 3600000,
                    });

                    user.token = token;
        
                    return {
                        data: [user],
                    };
                }

                return new GraphQLError('Usuário não encontrado', {
                    extensions: { code: 'NOT FOUND' },
                });
            } catch {
                throw new GraphQLError('Falha ao buscar usuário', {
                    extensions: { code: 'INTERNAL SERVER ERROR' },
                });
            }
        },

        // getUserByToken: (_: any, { input }: any) => {
        //     const { token } = input;
        //     try {
        //         const tokenTreaty = token.charAt(0) === '"' ? token.match(/"([^"]*)"/)[1] : token;
        //         const decodedToken = jwt.verify(tokenTreaty, process.env.SECRET_KEY);
                
        //         const user = fakeUserData.find(user => user.id === Number(decodedToken.id) && user.token === tokenTreaty);
        //         if (!user) throw "Usuário não encontrado! ";
                
        //         return user;
        //     } catch (error) {
        //         console.error("Erro ao buscar dados pelo token informado: " + error);
        //         return {
        //             id: -1,
        //             username: "",
        //             password: "",
        //             token: "",
        //         };
        //     }
        // },
    },

    // Mutation: {
    //     updateUser: (_: any, args: any, __: any) => {
    //         const { id } = args.input;
    //         const Index = fakeUserData.findIndex(user => user.id === Number(id));

    //         return verifyUserToken(fakeUserData[Index], false);
    //     },
    // }
};
  
export default userResolver;