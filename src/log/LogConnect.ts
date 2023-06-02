import { class_loader } from "../utils/helper";
abstract class LogConnect {
  config: Object;

  constructor(config) {
    this.config = config;
  }

  static async connect(config) {
    const log_type = config.log_type;

    let clazz = await class_loader("../log/" + log_type + "Connect");
    const connector = new clazz(config);

    return connector;
  }

  abstract get_log_by_query(application, query, from, to, cursor);
}

export { LogConnect };
