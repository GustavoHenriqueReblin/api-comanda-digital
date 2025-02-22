import db from '../../knex';
import { Bartender } from '../types';

interface FindBartenderParams {
    securityCode?: number;
    id?: number;
    token?: string;
}

interface UpdateBartenderParams {
    id: number;
    securityCode?: number;
    name?: string;
    token?: string;
}

export const findBartender = async ({ securityCode, id, token }: FindBartenderParams): Promise<Bartender | null> => {
    try {
        const query = db<Bartender>('bartender');

        if (id && token) {
            return await query
                .where({ id })
                .andWhere({ token })
                .first() as Bartender | null;
        }

        if (id) {
            return await query
                .where({ id })
                .first() as Bartender | null;
        }

        if (token) {
            return await query
                .where({ token })
                .first() as Bartender | null;
        }

        if (securityCode) {
            return await query
                .where({ securityCode })
                .first() as Bartender | null;
        }

        return null;
    } catch (err) {
        console.error('Erro ao buscar garçom:', err);
        throw new Error('Erro ao buscar garçom');
    }
};

export const updateBartender = async ({
    id,
    securityCode,
    name,
    token,
}: UpdateBartenderParams): Promise<Bartender | null> => {
    try {
        if (!id) {
            throw new Error('Id do garçom é necessário para a atualização');
        }

        const updateData: { [key: string]: any } = {};

        if (securityCode) updateData.securityCode = securityCode;
        if (name) updateData.name = name;
        if (token) updateData.token = token;

        await db<Bartender>('bartender').where({ id }).update(updateData);

        const updatedBartender = await db<Bartender>('bartender').where({ id }).first();

        if (!updatedBartender) {
            return null;
        }

        return updatedBartender;
    } catch (err) {
        console.error('Erro ao atualizar garçom:', err);
        throw new Error('Erro ao atualizar garçom');
    }
};
