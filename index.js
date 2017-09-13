const engine = require('./engine');
const bossy = require('bossy');
const config = require('config');

const definition = {
  a: {
    description: 'Account number',
    alias: 'accNo',
    type: 'string'
  },
  o: {
    description: 'output file name',
    alias: 'outputFile',
    type: 'string'
  },
  d: {
    description: 'Delete existing output file',
    alias: 'canDeleteExistingOutputFile',
    type: 'boolean'
  },
  i: {
    description: 'Input file name of IDs to process',
    alias: 'inputFile',
    type: 'string'
  }
};

const args = bossy.parse(definition);

if (args instanceof Error) {
  console.error(args.message);
}

const actualObj = {
  inputFile: args.inputFile || config.get('file.inputFile'),
  outputFile: args.outputFile || config.get('file.outputFile'),
  canDeleteExistingOutputFile: args.canDeleteExistingOutputFile || false,
  accNo: args.accNo || config.get('defaultUser.accNo'),
};
engine.generateAnonymizedData(actualObj);
