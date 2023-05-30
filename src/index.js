let clsf = process.argv[2]

proc = require("./proc/" + clsf)
proc.main(...process.argv.slice(3)).then(() => {console.log("end")}); 