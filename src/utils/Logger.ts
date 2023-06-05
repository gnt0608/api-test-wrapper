import winston from "winston";
import { format } from "winston";
import * as fs from "fs";
import * as path from "path";

const { combine, timestamp, prettyPrint, colorize, errors } = format;
class Logger {
  private logger: winston.Logger;

  public constructor() {
    if (!this.logger) {
      // FIXME: 実行ディレクトリに存在するenv.jsonを取得する形になっている
      let trans_setting = [];
      if (fs.existsSync(path.resolve(process.cwd(), "logger.json"))) {
        const logger_json = JSON.parse(
          fs.readFileSync(path.resolve(process.cwd(), "logger.json")).toString()
        );

        for (let log of logger_json) {
          trans_setting.push(
            new winston.transports.File({
              filename: log.name,
              level: log.level ?? "info",
              format: combine(
                errors({ stack: true }), // <-- use errors format
                timestamp(),
                format.printf(
                  ({ level, message, timestamp, extra }) =>
                    `${timestamp} ${level} ${message} ${extra}`
                )
              ),
            })
          );
        }
      }
      this.logger = winston.createLogger({
        level: process.env.LOG_LEVEL ?? "info",
        transports: [
          ...trans_setting,
          new winston.transports.Console({
            format: combine(
              errors({ stack: true }), // <-- use errors format
              colorize(),
              timestamp(),
              format.printf(
                ({ level, message, label, timestamp, extra }) =>
                  `${timestamp} ${level} ${message} ${extra}`
              )
            ),
          }),
        ],
      });
    }
  }

  public debug(message: string, extra: object = {}) {
    this.logger.debug(message, { extra: extra });
  }

  public info(message: string, extra: object = {}) {
    this.logger.info(message, { extra: extra });
  }

  public warn(message: string, extra: object = {}) {
    this.logger.warn(message, { extra: extra });
  }

  public error(message: string, extra: object = {}) {
    this.logger.error(message, { extra: extra });
  }
}

export { Logger };
