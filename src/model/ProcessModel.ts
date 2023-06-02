class ProcessModel {
  private _proc_name: string;
  private _proc: string;
  private _args: Object;

  private _output: Object;

  constructor(proc_name, proc, args, output) {
    this._proc_name = proc_name;
    this._proc = proc;
    this._args = args;
    this._output = output;
  }

  public get proc_name(): string {
    return this._proc_name;
  }
  public set proc_name(value: string) {
    this._proc_name = value;
  }
  public get proc(): string {
    return this._proc;
  }
  public set proc(value: string) {
    this._proc = value;
  }

  public get args(): Object {
    return this._args;
  }
  public set args(value: Object) {
    this._args = value;
  }

  public get output(): Object {
    return this._output;
  }
  public set output(value: Object) {
    this._output = value;
  }
}

export { ProcessModel };
