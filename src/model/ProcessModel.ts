class ProcessModel {
  proc_name: string;
  proc: string;
  args: Object | Array<string>;
  output: Object;

  constructor(proc_name, proc, args, output) {
    this.proc_name = proc_name;
    this.proc = proc;
    this.args = args;
    this.output = output;
  }
}

export { ProcessModel };
