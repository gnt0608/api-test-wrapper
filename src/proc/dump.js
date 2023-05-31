const { RESULT_CODE_OK } = require("../utils/constant");

let ServerConnect = require("../db/DBConnect");
const fs = require("fs");
const { stringify } = require("csv-stringify/sync");
const { db_env, base_dir } = require("../utils/env_loader");
const path = require("path");

async function main(proc) {
  if (proc.args instanceof Array) {
    return await exec(...proc.args);
  } else {
    return await exec(proc.args["tables"], proc.args["out_path"]);
  }
}

async function exec(tables, out_path) {
  let connector = await ServerConnect.connect(db_env());
  console.log("Start");
  try {
    let table_list = tables instanceof Array ? tables : tables.split(",");
    for (const table of table_list) {
      let result = await connector.executeSelect(table);
      fs.writeFileSync(
        path.resolve(base_dir(), out_path ? out_path : "", table + ".csv"),
        stringify(result.rows, { header: true })
      );
    }
  } finally {
    connector.destroy();
  }
  return RESULT_CODE_OK;
}

function set_returns(output, obj) {
  if (output !== undefined) {
    for (var ret_key in Object.keys(output)) {
      if (get_value(obj, ret_key) !== undefined) var ret_name = output[ret_key];
    }
  }
}

function get_value(obj, key) {
  for (var obj_key of Object.keys(obj)) {
    if (obj_key.toUpperCase() == key.toUpperCase()) {
      return obj[obj_key];
    }
  }
  return undefined;
}

module.exports.main = main;
