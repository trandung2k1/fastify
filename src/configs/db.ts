import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.DATABASE!, process.env.USER!, process.env.PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {},
    logging: true,
});
export default sequelize;
