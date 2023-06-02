const Process = require("./model/Process");
let clsf = process.argv[2];

const proc = new Process(clsf, process.argv.slice(3), undefined);

exec = require("./proc/" + proc.proc_name);
console.log("execute. [" + JSON.stringify(proc) + "]");
exec.main(proc).then(() => {
  console.log("end");
});
