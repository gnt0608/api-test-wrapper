import winston from "winston";

class Logger {
  private logger: winston.Logger;

  public constructor() {
    if (!this.logger)
      this.logger = winston.createLogger({
        level: process.env.LOG_LEVEL ?? "info",
        transports: [new winston.transports.Console()],
      });
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
