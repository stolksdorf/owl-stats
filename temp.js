const config = require('./config');
const tsv = require('./tsv.convert.js');
const request = require('superagent');


const week1Data = require('./backup/20-2-2019 - OWL.json');

console.log(week1Data);

const fs = require('fs');


fs.writeFileSync('./oops.tsv', tsv.toTSV(week1Data), 'utf8');
fs.writeFileSync('./backup/week1-raw.json', JSON.stringify(week1Data, null, '\t'), 'utf8');
fs.writeFileSync('./backup/week1-raw.tsv', tsv.toTSV(week1Data), 'utf8');