const path = require('path');
const fs = require('fs');
const config = require('config');
const _ = require('lodash');

const queries = require('../db/queries');

const skeletonObj = () => ({
  contractnumber: [],
  accountnumber: null,
  installationnumber: [],
  fueltype: [],
  premiseid: null,
  businesspartnerid: null
});

const dataUtilities = {
  fetchIds: (args) => {
    let response;
    const filePath = config.get('file.dataPath') + args.inputFile;
    response = path.join(__dirname, filePath);
    try {
      fs.statSync(response);
    } catch (error) {
      const emptyFilePath = '../data/empty.json';
      response = path.join(__dirname, emptyFilePath);
    }
    const ids = JSON.parse(fs.readFileSync(response, 'utf8'));
    return ids;
  },
  fetchUtilDetails: (tableDetails) => {
    const calls = [];
    const tableQueryDetails = tableDetails;
    _.map(tableQueryDetails, (tableQueryDetail) => {
      calls.push(queries.fetchUtilTableData(tableQueryDetail));
    });
    return Promise.all(calls);
  },
  fetchUserDetails: (idList) => {
    const calls = [];
    const accNos = idList.ids;
    _.map(accNos, (accNo) => {
      calls.push(queries.fetchUserDetails(accNo));
    });
    return Promise.all(calls);
  },
  fetchGeneratorUserData: (tabledetails) => {
    const calls = [];
    const tableDetails = tabledetails;
    _.map(tableDetails, (tableDetail) => {
      calls.push(queries.fetchTableData(tableDetail.queryDetail));
    });
    return Promise.all(calls);
  },
  mergeDetails: accDetail => accDetail.reduce((mergedAcc, account) => {
    const mergedAccount = mergedAcc;
    mergedAccount.contractnumber.push(account.contractnumber);
    mergedAccount.accountnumber = mergedAccount.accountnumber ?
      mergedAccount.accountnumber : account.accountnumber;
    mergedAccount.installationnumber.push(account.installationnumber);
    mergedAccount.fueltype.push(account.fueltype);
    mergedAccount.premiseid = mergedAccount.premiseid ?
      mergedAccount.premiseid : account.premiseid;
    mergedAccount.businesspartnerid = mergedAccount.businesspartnerid ?
      mergedAccount.businesspartnerid : account.businesspartnerid;
    return mergedAccount;
  }, skeletonObj())
};

module.exports = dataUtilities;
