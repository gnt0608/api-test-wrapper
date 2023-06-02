import { RESULT_CODE_OK } from "utils/constant";
import { LogConnect } from "log/LogConnect";
import * as fs from "fs";
import { log_env, base_dir } from "utils/env_loader";
import { append_csv } from "utils/helper";
import * as path from "path";
import { Process } from "./Process";

class ExploreLog extends Process {
  async exec(proc) {
    return await this._exec(
      proc.args["application"],
      proc.args["from"],
      proc.args["to"],
      proc.args["query"],
      proc.args["out_path"]
    );
  }

  async _exec(application, from, to, query, out_path) {
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
        this._logname(env.log_type, from_date, to_date)
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

  _logname(log_type, from, to) {
    return log_type + "_" + from.valueOf() + "_" + to.valueOf() + ".log";
  }
}

export { ExploreLog };
