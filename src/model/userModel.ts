import db from '../../knex';
import { User } from '../types';

interface FindUserParams {
    email?: string;
    password?: string;
    id?: number;
    token?: string;
}

interface UpdateUserParams {
    id: number;
    email?: string;
    password?: string;
    name?: string;
    token?: string;
}

export const findUser = async ({ id, email, password, token }: FindUserParams): Promise<User | null> => {
    try {
        const query = db<User>('user');

        if (id && token) {
            return await query
                .where({ id })
                .andWhere({ token })
                .first() as User | null;
        }

        if (email && password) {
            return await query
                .where({ email })
                .andWhere({ password })
                .first() as User | null;
        }

        return null;
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        throw new Error('Erro ao buscar usuário');
    }
};

export const updateUser = async ({
    id,
    email,
    password,
    name,
    token,
}: UpdateUserParams): Promise<User | null> => {
    try {
        if (!id) {
            throw new Error('ID do usuário é necessário para a atualização');
        }

        const updateData: { [key: string]: any } = {};

        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (name) updateData.name = name;
        if (token) updateData.token = token;

        await db<User>('user').where({ id }).update(updateData);

        const updatedUser = await db<User>('user').where({ id }).first();

        if (!updatedUser) {
            return null;
        }

        return updatedUser;
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        throw new Error('Erro ao atualizar usuário');
    }
};
