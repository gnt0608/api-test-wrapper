abstract class Process {
  constructor() {}

  async main(proc) {
    this.preproc(proc);
    let result_code = this.exec(proc);
    this.postproc(proc);

    return result_code;
  }

  preproc(proc) {}
  abstract exec(proc);

  postproc(proc) {}
}

export { Process };
