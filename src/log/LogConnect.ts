import { class_loader } from "utils/helper";
abstract class LogConnect {
  config: any;

  constructor(config) {
    this.config = config;
  }

  static async connect(config) {
    const log_type = config.log_type;

    let clazz = await class_loader("log/" + log_type + "Connect");
    const connector = new clazz(config);

    return connector;
  }

  abstract get_log_by_query(application, query, from, to, cursor);
  abstract transform(data);
  abstract get_next(data);
}

export { LogConnect };
