const { RESULT_CODE_OK } = require("../utils/constant");
let LogConnect = require("../log/LogConnect");
const fs = require("fs");
const { stringify } = require("csv-stringify/sync");
const { basename } = require("path");
const { log_env, base_dir } = require("../utils/env_loader");
const { append_data } = require("../utils/helper");

async function main(proc) {
  if (proc.args instanceof Array) {
    return await exec(...proc.args);
  } else {
    return await exec(
      proc.args["from"],
      proc.args["to"],
      proc.args["query"],
      proc.args["out_dir"]
    );
  }
}

async function exec(from, to, query, out_dir) {
  const env = log_env();
  console.log("Start");
  try {
    let connector = await LogConnect.connect(env);
    var data = await connector.get_log_by_query(query, from, to);
    var logs = connector.transfom(data);
    append_data(
      base_dir() + "/" + out_dir + "/" + logname(env.log_type, from, to),
      logs
    );

    var next = connector.get_next(data);
    while (next) {
      data = await connector.get_log_by_query(query, from, to, next);
      logs = connector.transfom(data);
      append_data(
        base_dir() + "/" + out_dir + "/" + logname(env.log_type, from, to),
        logs
      );

      next = connector.get_next(data);
    }
  } finally {
  }
  return RESULT_CODE_OK;
}

function logname(log_type, from, to) {
  return log_type + "_" + from + "_" + (to ? to : "") + ".log";
}

module.exports.main = main;
