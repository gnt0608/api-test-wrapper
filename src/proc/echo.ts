import { Process } from "./Process";
import { Logger } from "utils/Logger";
var logger = new Logger();

class Echo extends Process {
  constructor() {
    super();
  }

  protected async exec(proc) {
    return await this._exec(proc.args);
  }

  private async _exec(args: object ) {
    for(let key of Object.keys(args)){
      logger.info(key + ": " + args[key]);
    }
  }
}

export { Echo };
