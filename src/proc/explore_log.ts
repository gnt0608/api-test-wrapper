const { RESULT_CODE_OK } = require("../utils/constant");
let LogConnect = require("../log/LogConnect");
const fs = require("fs");
const { log_env, base_dir } = require("../utils/env_loader");
const { append_csv } = require("../utils/helper");
const path = require("path");

async function main(proc) {
  if (proc.args instanceof Array) {
    return await exec(...proc.args);
  } else {
    return await exec(
      proc.args["application"],
      proc.args["from"],
      proc.args["to"],
      proc.args["query"],
      proc.args["out_path"]
    );
  }
}

async function exec(application, from, to, query, out_path) {
  const env = log_env();
  console.log("Start");
  try {
    const from_date = new Date(from);
    const to_date = to ? new Date(to) : new Date();

    let connector = await LogConnect.connect(env);
    var data = await connector.get_log_by_query(
      application,
      query,
      from_date,
      to_date
    );
    var logs = connector.transform(data);
    const logpath = path.resolve(
      base_dir(),
      out_path ? out_path : "",
      logname(env.log_type, from_date, to_date)
    );
    append_csv(logpath, logs);

    var next = connector.get_next(data);
    while (next) {
      data = await connector.get_log_by_query(
        application,
        query,
        from_date,
        to_date,
        next
      );
      logs = connector.transform(data);
      append_csv(logpath, logs);

      next = connector.get_next(data);
    }
  } finally {
  }
  return RESULT_CODE_OK;
}

function logname(log_type, from, to) {
  return log_type + "_" + from.valueOf() + "_" + to.valueOf() + ".log";
}

module.exports.main = main;
