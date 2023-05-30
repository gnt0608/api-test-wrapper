let ServerConnect = require("../connector/Connect");
const fs = require("fs");
const { stringify } = require('csv-stringify/sync');
const { basename } = require("path");
const { db_env , base_dir} = require("../utils/env_loader");
async function main(table,out_dir) {
  // const table = args[0]
  // const out_dir = args[1]
  let connector = await ServerConnect.connect(db_env());
  console.log("Start")
  try {
    let result = await connector.executeSelect(table);
    fs.writeFileSync(base_dir() + "/" + out_dir + "/" + table + ".csv" ,stringify(result.rows,{header: true}));
  } finally {
    connector.destroy();
  }
}

module.exports.main = main