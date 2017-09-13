const Anonymizer = require('data-anonymizer');
const _ = require('lodash');

const anon = new Anonymizer({});

const DataAnaon = {
  anonymizeData: ((generatorTableDataList, tableDataList) => {
    const anonTableDataList = generatorTableDataList;
    for (let i = 0; i < anonTableDataList.length; i += 1) {
      for (let j = 0; j < anonTableDataList[i].length; j += 1) {
        _.map(Object.keys(anonTableDataList[i][j]), ((columnName) => {
          if (tableDataList[i].queryDetail.anon_columns.indexOf(columnName.toString()) > -1) {
            anonTableDataList[i][j][columnName]
              = anonTableDataList[i][j][columnName] ?
                anon.anonymize(anonTableDataList[i][j][columnName].toString()) : null;
          }
        }));
      }
    }
    return anonTableDataList;
  })
};

module.exports = DataAnaon;
