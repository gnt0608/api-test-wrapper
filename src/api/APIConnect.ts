import { class_loader } from "utils/helper";
abstract class APIConnect {
  config: Object;
  constructor(config) {
    this.config = config;
  }

  static async connect(config) {
    const api_type = config.api_type;

    let clazz = await class_loader("api/" + api_type + "Connect");
    const connector = await clazz.connect(config);

    return connector;
  }

  abstract send_request(request_json, out_path);
  abstract get_failure_count(result);
}

export { APIConnect };
