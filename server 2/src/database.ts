import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'

dotenv.config()
const env = process.env



export const connect: Sequelize = new Sequelize(
    {
        database: env.DBNAME,
        dialect: 'mariadb',
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        port: Number(env.DB_PORT),
        host: env.HOST,
        models: [__dirname + '/models']
    }
)