const newman = require("newman"); // require newman in your project

class NewmanConnect {
  constructor(config) {
    this.config = config;
  }

  static async connect(config) {
    const connector = new NewmanConnect(config);
    return connector;
  }

  send_request(request_json) {
    // call newman.run to pass `options` object and wait for callback
    newman.run(
      {
        collection: require(request_json),
        reporters: "cli",
      },
      function (err) {
        if (err) {
          throw err;
        }
        console.log("collection run complete!");
      }
    );
  }
}
module.exports = NewmanConnect;
