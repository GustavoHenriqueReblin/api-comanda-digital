import knex from 'knex';

const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST ?? '127.0.0.1',
        user: process.env.MYSQL_USER ?? 'root',
        password: process.env.MYSQL_PASSWORD ?? '',
        database: process.env.MYSQL_DATABASE ?? 'digital-command',
        port: 3306,
    },
});

export default db;
