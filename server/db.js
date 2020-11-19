const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  password: process.env.password,
  host: 'localhost',
  port: 5432,
  database: 'covid_testing',
});

module.exports = pool;
