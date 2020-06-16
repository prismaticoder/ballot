require('dotenv').config(); // this is important!
module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "ballot",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false,
  },
  "test": {
    "username": process.env.DB_USER,
    "password": null,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "operatorsAliases": false,
  }
}
