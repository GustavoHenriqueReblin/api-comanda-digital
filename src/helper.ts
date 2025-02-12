const jwt = require('jsonwebtoken');
import { fakeBartenderData } from './model/bartenderModel';
import { User } from './types';
import dotenv from "dotenv";

dotenv.config();

export const verifyBartenderToken = (token: string, id: string) => {
    let result = "";
    const bartender = fakeBartenderData.find(bartender => bartender.id === Number(id));

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
            name: bartender?.name,
            securityCode: bartender?.securityCode,
            isWaiting: bartender?.isWaiting,
            isApproved: bartender?.isApproved,
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

export const nextId = (data: any) => {
    return data.reduce((maxId: any, obj: any) => {
        return Math.max(maxId, obj.id);
    }, 0) + 1;
};