import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const getConnection = async () => {
    const connection = await mysql.createConnection({
        host: process.env.AWS_MYSQL_HOST,
        user: process.env.AWS_MYSQL_USER,
        password: process.env.AWS_MYSQL_PASSWORD,
        database: process.env.AWS_MYSQL_DB,
    });
    return connection;
};