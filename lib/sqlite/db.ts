import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'data/db.sqlite',
});

export default db;
