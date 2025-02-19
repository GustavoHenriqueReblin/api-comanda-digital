import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    if (req.cookies) {
        const token = req.cookies?.[process.env.COOKIE_AUTH_TOKEN_NAME ?? ""];
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
