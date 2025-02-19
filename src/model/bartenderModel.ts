import db from '../../knex';
import { Bartender } from '../types';

interface FindBartenderParams {
    securityCode?: number;
}

export const findBartender = async ({ securityCode }: FindBartenderParams): Promise<Bartender | null> => {
    try {
        const query = db<Bartender>('bartender');

        return await query
            .where({ securityCode })
            .first() as Bartender | null;
    } catch (err) {
        console.error('Erro ao buscar garçom:', err);
        throw new Error('Erro ao buscar garçom');
    }
};