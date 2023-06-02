import * as AWS from "aws-sdk";
import { aws_env } from "utils/env_loader";
import { LogConnect } from "./LogConnect";
class AWSConnect extends LogConnect {
  constructor(config) {
    super(Object.assign(config, aws_env()));

    const credentials = new AWS.Credentials({
      accessKeyId: super.config.access_key_id,
      secretAccessKey: super.config.secret_access_key,
    });
    AWS.config.credentials = credentials;
    AWS.config.update({ region: super.config.aws_region });
  }

  public async get_log_by_query(application, query, from, to, cursor) {
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

  public transform(data) {
    return data.events.map((s) => {
      return {
        timestamp: new Date(s.timestamp).toISOString(),
        message: s.message.trim(),
      };
    });
  }

  public get_next(data) {
    return data.nextToken;
  }
}

export { AWSConnect };
