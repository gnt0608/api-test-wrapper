import { RESULT_CODE_OK } from "utils/constant";
import * as fs from "fs";

import { DBConnect } from "db/DBConnect";
import { basename, resolve } from "path";
import { db_env, base_dir } from "utils/env_loader";
import { import_csv } from "utils/helper";
import { Process } from "./Process";

import { Logger } from "utils/Logger";
var logger = new Logger();
class Insert extends Process {
  protected async exec(proc) {
    return await this._exec(proc.args["in_dir"]);
  }

  private async _exec(in_dir) {
    let connector = await DBConnect.connect(db_env());
    try {
      let in_files = fs.readdirSync(resolve(base_dir(), in_dir));
      for (let in_file of in_files) {
        let tablename = basename(in_file, ".csv");
        logger.debug("file: " + in_file + ", table: " + tablename);

        const records = import_csv(resolve(base_dir(), in_dir, in_file));
        for (let record of records) {
          await connector.executeInsert(tablename, record);
        }
      }
    } finally {
      connector.destroy();
    }
    return RESULT_CODE_OK;
  }
}
export { Insert };
