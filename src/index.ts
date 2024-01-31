#!/usr/bin/env node
import { ProcessModel } from "model/ProcessModel";
import { class_loader, load_yaml_file } from "utils/helper";
import { RESULT_CODE_OK, RESULT_CODE_NG } from "utils/constant";
import { setup, set_scenario_dir, set_variable } from "utils/env_loader";
import { Logger } from "utils/Logger";
var logger = new Logger();

main(process.argv[2])
  .then(() => {
    logger.info("end");
  })
  .catch((e) => {
    logger.error(e.message);
  });

async function main(in_path: string) {
  logger.info("Start");

  setup();
  set_scenario_dir(in_path);
  set_variable("start_time", new Date());
  const procs = setup_procs(load_yaml_file(in_path));

  var returncode = RESULT_CODE_OK;
  for (const proc of procs) {
    logger.info("execute. [" + JSON.stringify(proc) + "]");
    const ret_val = await execute(proc);
    returncode = Math.max(returncode, ret_val);
    logger.info("done. [" + JSON.stringify(proc) + "]");
    if (proc.stopOnError && ret_val == RESULT_CODE_NG) {
      throw new Error("Result error. check results.");
    }
  }

  if (returncode == RESULT_CODE_NG) {
    throw new Error("Result error. check results.");
  }
}

async function execute(proc: ProcessModel) {
  let clazz = await class_loader("proc/" + proc.proc);
  return await new clazz().main(proc);
}

function setup_procs(yaml_data) {
  var procs_list = [];
  for (const mod_name of Object.keys(yaml_data)) {
    const mod = yaml_data[mod_name];
    const proc = new ProcessModel({
      proc_name: mod_name,
      proc: mod["process"],
      args: mod["args"],
      output: mod["returns"],
      stopOnError: mod["stopOnError"],
    });
    procs_list.push(proc);
  }
  return procs_list;
}
