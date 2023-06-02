import { ProcessModel } from "model/ProcessModel";
import { class_loader, load_yaml_file } from "utils/helper";
import { RESULT_CODE_OK, RESULT_CODE_NG } from "utils/constant";

const path = require("path");
const dotenv = require("dotenv");

let clsf = process.argv[2];

main(process.argv[3]).then(() => {
  console.log("end");
});

async function main(in_path) {
  console.log("Start");

  dotenv.populate(process.env, { config_base: path.dirname(in_path) });
  const procs = setup_procs(load_yaml_file(in_path));

  var returncode = RESULT_CODE_OK;
  for (const proc of procs) {
    console.log("execute. [" + JSON.stringify(proc) + "]");
    const ret = await execute(proc);
    returncode = Math.max(returncode);
    console.log("done. [" + JSON.stringify(proc) + "]");
  }

  if (returncode == RESULT_CODE_NG) {
    throw new Error("Result error. check results.");
  }
}

async function execute(proc) {
  let clazz = await class_loader("proc/" + proc.proc);
  return await new clazz().main(proc);
}

function setup_procs(yaml_data) {
  var procs_list = [];
  for (const mod_name of Object.keys(yaml_data)) {
    const mod = yaml_data[mod_name];
    const proc = new ProcessModel(
      mod_name,
      mod["process"],
      mod["args"],
      mod["returns"]
    );
    procs_list.push(proc);
  }
  return procs_list;
}
