import { Process } from "./Process";

import { RESULT_CODE_OK } from "../utils/constant";

class Export extends Process {
  async exec(proc) {
    console.log("Start");
    const dotenv = require("dotenv");
    const parsed = this._get_args(proc);

    dotenv.populate(process.env, parsed, { override: true });
    return RESULT_CODE_OK;
  }

  _get_args(proc) {
    const args = proc.args;
    if (args instanceof Array) {
      throw new Error("export args must be Object type.");
    } else {
      return args;
    }
  }
}
export { Export };
