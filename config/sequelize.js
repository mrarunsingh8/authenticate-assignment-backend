import { Sequelize } from "sequelize";

export default new Sequelize({
    dialect: "mysql",
    host: process.env.MYSQL_DB_HOST,
    database: process.env.MYSQL_DB_NAME,
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD
});