import { Process } from "./Process";
import { Logger } from "utils/Logger";
var logger = new Logger();

class Echo extends Process {
  constructor() {
    super();
  }

  protected async exec(proc) {
    return await this._exec(proc.args["time"]);
  }

  private async _exec(time: number ) {
    await new Promise(resolve => setTimeout(resolve, time));
  }
  
}

export { Echo };
