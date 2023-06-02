import { Logger } from "utils/Logger";
import { RESULT_CODE_NG } from "utils/constant";
var logger = new Logger();
abstract class Process {
  constructor() {}

  async main(proc) {
    try {
      logger.info("exec proc");
      this.preproc(proc);
      let result_code = await this.exec(proc);
      this.postproc(proc);
      logger.info("end proc");
      return result_code;
    } catch (error) {
      logger.error("on process error.", error);
      return RESULT_CODE_NG;
    }
  }

  protected preproc(proc) {}
  protected abstract exec(proc);

  protected postproc(proc) {}
}

export { Process };
