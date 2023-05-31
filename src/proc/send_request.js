const { RESULT_CODE_OK } = require("../utils/constant");

let ServerConnect = require("../api/APIConnect");
const fs = require("fs");
const { api_env, base_dir } = require("../utils/env_loader");
const path = require("path");
async function main(proc) {
  if (proc.args instanceof Array) {
    return await exec(...proc.args);
  } else {
    return await exec(proc.args["request_json"], proc.args["out_path"]);
  }
}

async function exec(request_json, out_path) {
  console.log("Start");
  const connect = await ServerConnect.connect(api_env());
  await connect.send_request(path.resolve(base_dir(), request_json));
  return RESULT_CODE_OK;
}

module.exports.main = main;
