class Connect {
  static async connect(config) {
    const log_type = config.log_type;

    const LogConnect = require("./" + log_type + "Connect");
    const connector = new LogConnect(config);

    return connector;
  }
}

module.exports = Connect;
