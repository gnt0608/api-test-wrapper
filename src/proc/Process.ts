abstract class Process {
  constructor() {}

  async main(proc) {
    this.preproc(proc);
    let result_code = this.exec(proc);
    this.postproc(proc);

    return result_code;
  }

  protected preproc(proc) {}
  protected abstract exec(proc);

  protected postproc(proc) {}
}

export { Process };
