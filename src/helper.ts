const jwt = require('jsonwebtoken');
import { Bartender, User } from './types';
require('dotenv').config();

export const verifyUserToken = (user?: User) => {
    if (user) {
        if (user.token) { 
            // Verifica o token
            try {
                jwt.verify(user.token, process.env.SECRET_KEY);
            } catch (error: any) {
                if (error.message = "jwt expired") {
                    user.token = "";
                }
            }
        } else {
            // Cria um novo token e o retorna
            const payload = {
                id: user.id,
                username: user.username,
                password: user.password,
            };

            const options = {
                expiresIn: '1d', 
                algorithm: 'HS256', 
            };

            user.token = jwt.sign(payload, process.env.SECRET_KEY, options);
        }
    }
    
    // Retorna apenas o usuário vazio (não encontrado) ou já autenticado
    return user;
};

export const verifyBartenderToken = (token: string, id: string) => {
    let result = "";

    if (token && token !== "") {
        // Verifica o token
        try {
            jwt.verify(token, process.env.SECRET_KEY);
            result = token;
        } catch (error: any) {
            if (error.message = "jwt expired") {
                token = "";
            }
        }
    } else {
        // Cria um novo token e o retorna
        const payload = {
            id: id,
        };

        const options = {
            expiresIn: '1d', 
            algorithm: 'HS256', 
        };
        
        result = jwt.sign(payload, process.env.SECRET_KEY, options);
    }
    
    // Retorna apenas uma string vazia (não encontrado) ou token já autenticado
    return result;
};