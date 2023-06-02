import * as AWS from "aws-sdk";
import { aws_env } from "../utils/env_loader";
import { LogConnect } from "./LogConnect";
class AWSConnect extends LogConnect {
  constructor(config) {
    super(Object.assign(config, aws_env()));

    // FIXME: アクセスキー設定
    // AWS.config.credentials = new AWS.SharedIniFileCredentials({
    //   profile: "your-profile",
    // });
    AWS.config.update({ region: "ap-northeast-1" });
  }

  async get_log_by_query(application, query, from, to, cursor) {
    // 適当なパラメータ
    //       logStreamNames: ["log-stream-1", "log-stream-2"],
    let params = {
      logGroupName: application,
      filterPattern: query,
      startTime: from.valueOf(),
      endTime: to.valueOf(),
      nextToken: cursor ? cursor : undefined,
    };

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
        message: s.message.trim(),
      };
    });
  }

  get_next(data) {
    return data.nextToken;
  }
}

export { AWSConnect };
