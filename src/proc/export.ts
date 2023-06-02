import { Process } from "./Process";
import { set_variables } from "utils/env_loader";
import { RESULT_CODE_OK } from "utils/constant";

class Export extends Process {
  protected async exec(proc) {
    const parsed = this._get_args(proc);

    set_variables(parsed);
    return RESULT_CODE_OK;
  }

  private _get_args(proc) {
    const args = proc.args;
    if (args instanceof Array) {
      throw new Error("export args must be Object type.");
    } else {
      return args;
    }
  }
}
export { Export };
