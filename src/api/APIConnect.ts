class Connect {
  static async connect(config) {
    const api_type = config.api_type;

    const ServerConnect = require("./" + api_type + "Connect");
    const connector = await ServerConnect.connect(config);

    return connector;
  }
}

module.exports = Connect;
