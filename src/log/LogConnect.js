class Connect {
  static async connect(config) {
    const log_type = config.log_type;

    const LogConnect = require("./" + log_type + "Connect");
    const connector = await LogConnect.connect(config);

    return connector;
  }
}

module.exports = Connect;
