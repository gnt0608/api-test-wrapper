import { RESULT_CODE_OK } from "utils/constant";
import { Process } from "./Process";

import { APIConnect } from "api/APIConnect";
import { api_env, base_dir } from "utils/env_loader";
import * as path from "path";

class SendRequest extends Process {
  protected async exec(proc) {
    return await this._exec(proc.args["request_json"], proc.args["out_path"]);
  }

  private async _exec(request_json, out_path) {
    console.log("Start");
    const connect = await APIConnect.connect(api_env());
    await connect.send_request(path.resolve(base_dir(), request_json));
    return RESULT_CODE_OK;
  }
}

export { SendRequest };
