const { RESULT_CODE_OK } = require("../utils/constant");
async function main(proc) {
  console.log("Start");
  const dotenv = require("dotenv");
  const parsed = get_args(proc);

  dotenv.populate(process.env, parsed);
  return RESULT_CODE_OK;
}

function get_args(proc) {
  const args = proc.args;
  if (args instanceof Array) {
    throw new Error("export args must be Object type.");
  } else {
    return args;
  }
}

module.exports.main = main;
