var AWS = require("aws-sdk");
const { dd_env } = require("../utils/env_loader");

class AWSConnect {
  constructor(config) {
    this.config = Object.assign(config, dd_env());

    // FIXME: アクセスキー設定
    // AWS.config.credentials = new AWS.SharedIniFileCredentials({
    //   profile: "your-profile",
    // });
    AWS.config.update({ region: "ap-northeast-1" });
  }

  async get_log_by_query(application, query, from, to, cursor) {
    // 適当なパラメータ
    //       logStreamNames: ["log-stream-1", "log-stream-2"],

    const params = {
      logGroupName: application,
      filterPattern: query,
      startTime: from.valueOf(),
      endTime: to.valueOf(),
    };

    if (cursor) params.nextToken = cursor;

    const CWLogs = new AWS.CloudWatchLogs();
    return new Promise((resolve, reject) => {
      CWLogs.filterLogEvents(params, (error, data) => {
        if (error) reject(error);
        else {
          resolve(data);
        }
      });
    });
  }

  transform(data) {
    return data.events.map((s) => {
      console.log(s);
      return {
        timestamp: new Date(s.timestamp).toISOString(),
        message: s.message,
      };
    });
  }

  get_next(data) {
    return data.nextToken;
  }
}

module.exports = AWSConnect;
