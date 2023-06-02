import { dd_env } from "../utils/env_loader";
import { LogConnect } from "./LogConnect";
class DatadogConnect extends LogConnect {
  client: any;
  headers: Object;
  constructor(config) {
    super(Object.assign(config, dd_env()));

    var Client = require("node-rest-client").Client;
    this.client = new Client();
    this.headers = {
      "Content-Type": "application/json",
      "DD-API-KEY": super.config["dd_apikey"],
      "DD-APPLICATION-KEY": super.config["dd_applicationkey"],
    };
  }

  async get_log_by_query(application, query, from, to, cursor) {
    //FIXME: application
    // "service.application host:" + application
    var data = {
      filter: {
        from: from.toISOString(),
        to: to.toISOString(),
        query: query,
      },
      options: {
        timezone: this.config["timezone"]
          ? this.config["timezone"]
          : "UTC+09:00",
      },
      page: {
        limit: 5000,
      },
      sort: "timestamp",
    };

    if (cursor) {
      data.page["cursor"] = cursor;
    }

    var args = {
      data: data,
      headers: this.headers,
    };

    return await this.executePost(
      "https://api.datadoghq.com/api/v2/logs/events/search",
      args
    );
  }

  transform(data) {
    const targetKeys = this.config["target_keys"].split(",");
    return data.data.map((d) => {
      var log = {};
      var l = d.attributes;
      for (const key of targetKeys) {
        if (key in l) {
          log[key] = l[key];
        }
        if (key in l.attributes) {
          log[key] = l.attributes[key];
        }
      }
      return log;
    });
  }

  get_next(data) {
    if ("meta" in data) {
      if ("page" in data.meta) {
        return data.meta.page.after;
      }
    }
  }

  executePost(uri, args) {
    return new Promise((resolve, reject) => {
      this.client.post(uri, args, function (data, response) {
        resolve(data);
      });
    });
  }
}

export { DatadogConnect };
