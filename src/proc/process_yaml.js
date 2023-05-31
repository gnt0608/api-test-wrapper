const { load_yaml_file } = require("../utils/helper");
const Process = require("../model/Process");
const { RESULT_CODE_OK, RESULT_CODE_NG } = require("../utils/constant");

const path = require("path");
const dotenv = require("dotenv");

async function main(proc) {
  if (proc.args instanceof Array) {
    await exec(...proc.args);
  } else {
    throw new Error("process_yaml proc must be called from index only.");
  }
}

async function exec(in_path) {
  console.log("Start");

  dotenv.populate(process.env, { config_base: path.dirname(in_path) });
  const procs = setup_procs(load_yaml_file(in_path));

  var returncode = RESULT_CODE_OK;
  for (const proc of procs) {
    console.log("execute. [" + JSON.stringify(proc) + "]");
    returncode = Math.max(returncode, await execute(proc));
    console.log("done. [" + JSON.stringify(proc) + "]");
  }

  if (returncode == RESULT_CODE_NG) {
    throw new Error("Result error. check results.");
  }
}

async function execute(proc) {
  const exec = require("../proc/" + proc.proc_name);
  return await exec.main(proc);
}

function setup_procs(yaml_data) {
  var procs_list = [];
  for (const mod_name of Object.keys(yaml_data)) {
    const mod = yaml_data[mod_name];
    proc = new Process(mod_name, mod["args"], mod["returns"]);
    procs_list.push(proc);
  }
  return procs_list;
}

module.exports.main = main;
