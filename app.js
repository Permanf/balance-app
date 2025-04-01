const express = require('express');
const { Sequelize } = require('sequelize');
const balanceController = require('./controllers/balanceController');

const app = express();
app.use(express.json());

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false
});

app.post('/balance', balanceController.updateBalance);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.APP_PORT || 8000, () => {
      console.log(`Server running on port ${process.env.APP_PORT || 8000}`);
    });
  })
  .catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
});