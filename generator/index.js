const _ = require('lodash');
const sql = require('squel');
const fs = require('fs');
const path = require('path');
const config = require('config');


const tableDataList = [];

const generatorData = {
  queryDetail: null,
  tableDetail: null
};

sql.registerValueHandler(Array, (inputArray) => {
  const arrStr = "'".concat(JSON.stringify(inputArray).replace('[', '{').replace(']', '}').concat("'"));
  return arrStr;
});

const createFileStream = (args) => {
  const filePath = config.get('file.dataPath') + args.outputFile;
  const outputPath = path.join(__dirname, filePath);
  const fileFlag = args.canDeleteExistingOutputFile ? { flags: 'w' } : { flags: 'a' };
  const fileStream = fs.createWriteStream(outputPath, fileFlag);
  return fileStream;
};

const dataGenerator = {
  fetchTableData: (userDetails, tableInfoList) => {
    _.map(userDetails, (userdetail) => {
      _.map(tableInfoList, (tableDetail) => {
        if (userdetail[tableDetail.value] instanceof Array) {
          _.map(userdetail[tableDetail.value], (keyValue) => {
            const querydetail = _.cloneDeep({
              schema: tableDetail.schema,
              table: tableDetail.table,
              key: tableDetail.key,
              value: keyValue,
              anon_columns: tableDetail.anon_columns,
              columns: tableDetail.columns
            });
            generatorData.queryDetail = querydetail;
            generatorData.tableDetail = tableDetail;
            tableDataList.push(_.cloneDeep(generatorData));
          });
        } else if (userdetail[tableDetail.value]) {
          const querydetail = _.cloneDeep({
            schema: tableDetail.schema,
            table: tableDetail.table,
            key: tableDetail.key,
            value: userdetail[tableDetail.value],
            anon_columns: tableDetail.anon_columns,
            columns: tableDetail.columns
          });
          generatorData.queryDetail = querydetail;
          generatorData.tableDetail = tableDetail;
          tableDataList.push(_.cloneDeep(generatorData));
        }
      });
    });
    return tableDataList;
  },
  generateSQL: ((myEnergyData, args) => {
    try {
      const fileStream = createFileStream(args);

      fileStream.write('----------------------- Util Data ------------------------------------------\n\n\n');

      for (let i = 0; i < myEnergyData.util_info_list.length; i += 1) {
        const tableName = myEnergyData.util_info_list[i].schema.concat('.').concat(myEnergyData.util_info_list[i].table);
        const tableDataObj = _.clone([]);
        let sqlString = _.clone('');

        for (let j = 0; j < myEnergyData.util_data_list[i].length; j += 1) {
          tableDataObj.push(JSON.parse(JSON.stringify(myEnergyData.util_data_list[i][j])));
        }
        if (tableDataObj && tableDataObj.length > 0) {
          sqlString = sql.insert().into(tableName)
            .setFieldsRows(JSON.parse(JSON.stringify(tableDataObj))).toString()
            .concat('; \n\n');
        }
        fileStream.write(sqlString);
      }

      fileStream.write('----------------------- User Data ------------------------------------------\n\n\n');

      for (let i = 0; i < myEnergyData.anon_data_list.length; i += 1) {
        const schema = myEnergyData.table_data_list[i].queryDetail.schema;
        const tableName = schema.concat('.').concat(myEnergyData.table_data_list[i].queryDetail.table);
        const tableDataObj = _.clone([]);
        let sqlString = _.clone('');
        for (let j = 0; j < myEnergyData.anon_data_list[i].length; j += 1) {
          tableDataObj.push(JSON.parse(JSON.stringify(myEnergyData.anon_data_list[i][j])));
        }
        if (tableDataObj && tableDataObj.length > 0) {
          sqlString = sql.insert().into(tableName)
            .setFieldsRows(JSON.parse(JSON.stringify(tableDataObj))).toString()
            .concat('; \n\n');
        }
        fileStream.write(sqlString);
      }

      fileStream.end();
      return 'file saved';
    } catch (err) {
      console.log('error:', err);
      return err.message;
    }
  })
};
module.exports = dataGenerator;
