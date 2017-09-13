const config = require('config');
const pgp = require('pg-promise')();

const cn = {
  host: config.get('postgres.host'),
  port: config.get('postgres.port'),
  database: config.get('postgres.db'),
  user: config.get('postgres.username'),
  password: config.get('postgres.password')
};

const connection = pgp(cn);

module.exports = {
  connection,
  closeConnections: () => pgp.end()
};
