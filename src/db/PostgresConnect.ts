import { Client } from "pg";
import { DBConnect } from "./DBConnect";
import { Logger } from "utils/Logger";
var logger = new Logger();
class PostgresConnect extends DBConnect {
  client: Client;

  constructor(config) {
    super(config);
    this.client = null;
  }

  static async connect(config) {
    const connector = new PostgresConnect(config);

    connector.client = new Client(config);
    await connector.client.connect();
    return connector;
  }

  public async executeSelect(tablename) {
    const sql = { text: "Select * from " + tablename };
    logger.debug(sql.text);
    const result = await this.client.query(sql);
    return result;
  }

  public async executeInsert(tablename, object) {
    let i = 1;
    let values = "";
    for (let key in Object.keys(object)) {
      if (i > 1) {
        values = values + ",";
      }
      values = values + "$" + i;
      i++;
    }
    let insert_sql =
      "insert into " +
      tablename +
      " (" +
      Object.keys(object).join(",") +
      ") values (" +
      values +
      ")";

    const sql = { text: insert_sql, values: Object.values(object) };
    logger.debug(sql.text);
    await this.client.query(sql);
  }

  public destroy() {
    if (this.client) this.client.end();
  }
}

export { PostgresConnect };
