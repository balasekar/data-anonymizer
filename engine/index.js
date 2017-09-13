/* eslint-disable camelcase */
const config = require('config');
const _ = require('lodash');
const db = require('../db');
const data = require('../utils/data');
const dataGenerator = require('../generator');
const dataAnonymizer = require('../anonymizer');

const tableDetails = config.get('data.tables');
const utilTableDetails = config.get('data.utilTables');

const myEnergyData = {
  id_list: [],
  user_details_list: [],
  table_info_list: tableDetails,
  table_data_list: [],
  util_info_list: utilTableDetails,
  util_data_list: [],
  anon_data_list: []
};

module.exports = {
  generateAnonymizedData(args) {
    return Promise.resolve().then(() => {
      // Fetch user Ids for which the data has to be fetched
      if (args.accNo > 0) {
        myEnergyData.id_list = [args.accNo];
      } else {
        myEnergyData.id_list = data.fetchIds(args);
      }
      return myEnergyData.id_list;
    })
      .then(idList => data.fetchUserDetails(idList))
      .then((details) => {
        // Fetching final user Details
        _.map(details, (detail) => {
          myEnergyData.user_details_list.push(data.mergeDetails(detail));
        });
      })
      .then(() => {
        // Fetching Table data which is required for generating SQL scripts
        myEnergyData.table_data_list =
                dataGenerator
                  .fetchTableData(myEnergyData.user_details_list, tableDetails);
        return myEnergyData.table_data_list;
      })
      .then(tableDataList => data.fetchGeneratorUserData(tableDataList))
      .then(generatorTableDataList =>
        dataAnonymizer.anonymizeData(generatorTableDataList, myEnergyData.table_data_list))
      .then((anonymizedData) => {
        myEnergyData.anon_data_list = anonymizedData;
        const util_data_list = data.fetchUtilDetails(utilTableDetails);
        return util_data_list;
      })
      .then((util_data) => {
        myEnergyData.util_data_list = util_data;
        return dataGenerator.generateSQL(myEnergyData, args);
      })
      .then((status) => {
        console.log(status);
        db.closeConnections();
      })
      .catch(Error => console.log('Error:', Error));
  },
};
