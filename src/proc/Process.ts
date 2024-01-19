import { Logger } from "utils/Logger";
import { get_variable } from "utils/env_loader";

import { RESULT_CODE_NG } from "utils/constant";
var logger = new Logger();
abstract class Process {
  constructor() {}

  async main(proc) {
    try {
      logger.info("exec proc");
      this.extract_variable(proc);
      this.preproc(proc);
      let result_code = await this.exec(proc);
      this.postproc(proc);
      logger.info("end proc");
      return result_code;
    } catch (error) {
      logger.error("on process error.", error);
      return RESULT_CODE_NG;
    }
  }

  protected preproc(proc) {}
  protected abstract exec(proc);

  private extract_variable(proc) {
    let args = proc.args;
    for (let key of Object.keys(args)) {
      // nowの展開
      if (typeof proc.args[key] == "string") {
        proc.args[key] = proc.args[key].replaceAll("$now", new Date());
        proc.args[key] = proc.args[key].replaceAll("${now}", new Date());
        while (proc.args[key].indexOf("$") >= 0) {
          let arg_value = proc.args[key];
          if (arg_value.indexOf("${") >= 0) {
            // ${xxxx} の形式である場合
            let start = arg_value.indexOf("${");
            let end = arg_value.indexOf("}");
            let name = arg_value.substr(start + 2, end - 2);
            let val = get_variable(name);
            let rep_val = arg_value.replaceAll("${" + name + "}", val);
            proc.args[key] = rep_val;
          } else {
            // $xxxx の形式である場合
            let name = arg_value.match(/\$([a-zA-Z0-9])+/)[0].slice(1);
            let val = get_variable(name);
            let rep_val = arg_value.replaceAll("$" + name, val);
            proc.args[key] = rep_val;
          }
        }
      }
    }
  }

  protected postproc(proc) {}
}

export { Process };
