import { dbConn } from '../db/dbConn';
import { Product } from '../types';

export const getProducts = async (categoriesIds: number[] | [], productsIds: number[] | []) => {
    let query = 'SELECT * FROM `product` WHERE state = 1';

    if (categoriesIds.length > 0) {
        const catFilter = 
            '(' + categoriesIds.map((id) => id) + ')';

        query += ' AND idCategory IN ' + catFilter;
    }

    if (productsIds.length > 0) {
        const prodFilter = 
            '(' + productsIds.map((id) => id) + ')';

        query += ' AND id IN ' + prodFilter;
    }

    const [products] = await dbConn.execute(query);
    return products as Product[];
};