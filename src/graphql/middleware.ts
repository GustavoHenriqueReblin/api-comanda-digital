import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLContext } from '../types';
import { GraphQLError } from 'graphql';
import { findUser } from '../model/userModel';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    if (req.cookies) {
        const token = req.cookies?.[process.env.COOKIE_AUTH_USER_TOKEN_NAME ?? ""];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY ?? "") as { Id: number, email: string };
                req.user = {
                    token,
                    ...decoded,
                };
            } catch (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }
        } else {
            req.user = undefined;
        }
        next();
    }
};

export const privateRouteAuth = async (context: GraphQLContext) => {
    if (!context.req.user || !context.req.user.Id) {
        throw new GraphQLError('Não autenticado', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }

    const user = await findUser({ id: context.req.user.Id, token: context.req.user.token });

    if (!user) {
        throw new GraphQLError('Não autenticado', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }

    return user;
}
