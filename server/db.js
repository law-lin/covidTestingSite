const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'pw',
  host: 'localhost',
  port: 5432,
  database: 'COVIDTESTING',
});

module.exports = pool;
