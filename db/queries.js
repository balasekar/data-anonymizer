/* eslint-disable no-template-curly-in-string */
const _ = require('lodash');
const db = require('../db');
const format = require('pg-promise/lib/formatting').as.format;

// All the queries used by the application should be listed here
const queries = {
  testPostgres: 'SELECT 1;',
  fetchUserDetails: 'SELECT lc.contractnumber,lc.fueltype, la.accountnumber, la.businesspartnerid, lc.premiseid, ' +
  'lc.installationnumber FROM live.contract lc JOIN live.customeraccount la ON (lc.accountnumber = la.accountnumber)' +
  ' WHERE lc.accountnumber = $1;',
  fetchTableData: 'SELECT * FROM ${schema~}.${table~} WHERE ${key~} = ${value}',
  fetchUtilTableData: 'SELECT * FROM ${schema~}.${table~} LIMIT ${limit}',
  fetchColumDetail: 'select column_name, data_type from INFORMATION_SCHEMA.COLUMNS ' +
  'where table_name = ${table} and table_schema=${schema};'
};

// loop through each query and turn it into a method that gets the database connection,
// runs the query and returns the result
module.exports = _.mapValues(queries, query => (values) => {
  console.log('Executing query:', format(query, values));
  return db.connection.query(query, values);
});

