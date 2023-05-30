class Connect {

  static async connect(config){
    const db_type = config.database_type

    const ServerConnect = require("./" + db_type + "Connect")
    const connector = await ServerConnect.connect(config);

    return connector;
  }
}

module.exports = Connect