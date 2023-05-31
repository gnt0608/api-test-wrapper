const { Client } = require("pg");

class PostgresConnect {
  constructor(config) {
    this.config = config;
    this.client = null;
  }

  static async connect(config) {
    const connector = new PostgresConnect(config);

    connector.client = new Client(config);
    connector.client.connect();
    return connector;
  }

  async executeSelect(tablename) {
    const sql = { text: "Select * from " + tablename };
    console.log(sql.text);
    const result = await this.client.query(sql);
    return result;
  }

  async executeInsert(tablename, object) {
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
    console.log(sql.text);
    await this.client.query(sql);
  }

  destroy() {
    this.client.end();
  }
}

module.exports = PostgresConnect;
