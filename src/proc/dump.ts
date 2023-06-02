import { RESULT_CODE_OK } from "utils/constant";

import { DBConnect } from "db/DBConnect";
import * as fs from "fs";
import { stringify } from "csv-stringify/sync";
import { db_env, base_dir } from "utils/env_loader";
import * as path from "path";
import { Process } from "./Process";
class Dump extends Process {
  constructor() {
    super();
  }

  protected async exec(proc) {
    return await this._exec(proc.args["tables"], proc.args["out_path"]);
  }

  private async _exec(tables: string | Array<string>, out_path: string) {
    let connector;
    try {
      connector = await DBConnect.connect(db_env());
      let table_list = tables instanceof Array ? tables : tables.split(",");
      for (const table of table_list) {
        let result = await connector.executeSelect(table);
        fs.writeFileSync(
          path.resolve(base_dir(), out_path ? out_path : "", table + ".csv"),
          stringify(result.rows, { header: true })
        );
      }
    } finally {
      if (connector) connector.destroy();
    }
    return RESULT_CODE_OK;
  }
}

export { Dump };
