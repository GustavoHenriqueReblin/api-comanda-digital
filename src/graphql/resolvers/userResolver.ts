import { findUser, updateUser } from '../../model/userModel';
import { GraphQLError } from 'graphql';
import { GraphQLContext } from "../../types";
import jwt from 'jsonwebtoken';
import { privateRouteAuth } from '../middleware';

const userResolver = {
    Query: {
        user: async (_: any, __: any, context: GraphQLContext) => {
            const user = await privateRouteAuth(context);

            return {
                data: [user],
            };
        },

        login: async (_: any, { input }: any, context: GraphQLContext) => {
            try {
                const { email, password } = input;
                const user = await findUser({ email, password });
                if (user) {
                    const token = jwt.sign(
                        { Id: user.id, email: user.email },
                        process.env.SECRET_KEY || 'secret',
                        { expiresIn: '1h' }
                    );
        
                    context.res.cookie(process.env.COOKIE_AUTH_USER_TOKEN_NAME ?? "", token, {
                        httpOnly: false,
                        secure: true,
                        maxAge: 3600000,
                    });

                    await updateUser({ id: user.id, token });
        
                    return {
                        data: [user],
                    };
                }

                return new GraphQLError('Usuário não encontrado', {
                    extensions: { code: 'NOT FOUND' },
                });
            } catch (error) {
                throw new GraphQLError('Falha ao buscar usuário - ' + error, {
                    extensions: { code: 'INTERNAL SERVER ERROR' },
                });
            }
        },
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