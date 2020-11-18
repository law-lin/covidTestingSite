const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'bongobounce123',
  host: 'localhost',
  port: 5432,
  database: 'covid_testing',
});

module.exports = pool;
