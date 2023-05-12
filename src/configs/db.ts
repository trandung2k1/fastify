import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('db', 'root', '123456789', {
    dialect: 'mysql',
    dialectOptions: {},
    logging: true,
});
export default sequelize;
