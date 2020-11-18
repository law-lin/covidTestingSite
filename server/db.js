const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'INSERT_PASSWORD_HERE',
  host: 'localhost',
  port: 5432,
  database: 'covid_testing',
});

module.exports = pool;
