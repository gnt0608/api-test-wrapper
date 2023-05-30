const sql = require('mssql');

class SQLServerConnect {
  constructor(config) {
    this.config = config
    this.con = null;
  }

  static async connect(config){
    const connector = new SQLServerConnect(config);
    connector.con = await sql.connect(config);
    return connector;
  }
  
  async executeSelect(tablename){
    const result = await this.con.query("Select * from "  + tablename);
    return result;
  }

  async executeInsert(tablename,object){
    let insert_sql = "insert into " + tablename + "(" +Object.keys(object).join(',') + ") values (@" + Object.keys(object).join(',@') + ")";
    let request = this.con.request();
    for(let key of Object.keys(object)){
      request.input(key,object[key]);
    }
    console.log(insert_sql);
    await request.query(insert_sql);
  }

  destroy(){
    this.con.close();
  }
}

module.exports = SQLServerConnect