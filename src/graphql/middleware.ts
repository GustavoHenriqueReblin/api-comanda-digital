import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLContext } from '../types';
import { GraphQLError } from 'graphql';
import { findUser } from '../model/userModel';
import { findBartender } from '../model/bartenderModel';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    if (req.cookies) {
        const userToken = req.cookies?.[process.env.COOKIE_AUTH_USER_TOKEN_NAME ?? ""];
        if (userToken) {
            try {
                const decoded = jwt.verify(userToken, process.env.SECRET_KEY ?? "") as { Id: number, email: string };
                req.user = {
                    userToken,
                    ...decoded,
                };
            } catch (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }
        } else {
            req.user = undefined;
        }

        const bartenderToken = req.cookies?.[process.env.COOKIE_AUTH_BARTENDER_TOKEN_NAME ?? ""];
        if (bartenderToken) {
            try {
                const decoded = jwt.verify(bartenderToken, process.env.SECRET_KEY ?? "") as { Id: number, securityCode: number };
                req.bartender = {
                    bartenderToken,
                    ...decoded,
                };
            } catch (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }
        } else {
            req.bartender = undefined;
        }
        next();
    }
};

export const privateUserRouteAuth = async (context: GraphQLContext) => {
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

export const privateBartenderRouteAuth = async (context: GraphQLContext) => {
    if (!context.req.bartender || !context.req.bartender.Id) {
        throw new GraphQLError('Não autenticado', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }

    const bartender = await findBartender({ id: context.req.bartender.Id, token: context.req.bartender.token });

    if (!bartender) {
        throw new GraphQLError('Não autenticado', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }

    return bartender;
}
