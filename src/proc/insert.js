const { RESULT_CODE_OK } = require("../utils/constant");

let ServerConnect = require("./connector/Connect");
const { basename } = require("path");
const { db_env, base_dir } = require("../utils/env_loader");
const { import_csv } = require("../utils/helper");

async function main(proc) {
  if (proc.args instanceof Array) {
    return await exec(...proc.args);
  } else {
    return await exec(proc.args["in_dir"]);
  }
}

async function exec(in_dir) {
  let connector = await ServerConnect.connect(db_env());
  try {
    let in_files = fs.readdirSync(base_dir + "/" + in_dir);
    for (let in_file of in_files) {
      let tablename = basename(in_file, ".csv");
      console.log("file: " + in_file + ", table: " + tablename);

      const records = import_csv(base_dir + "/" + in_dir + "/" + in_file);
      for (let record of records) {
        await connector.executeInsert(tablename, record);
      }
    }
  } finally {
    connector.destroy();
  }
  return RESULT_CODE_OK;
}

module.exports.main = main;
