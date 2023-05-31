const { check_type } = require("../utils/env_loader");
const { RESULT_CODE_OK, RESULT_CODE_NG } = require("../utils/constant");

const { import_csv, import_csv, append_data } = require("../utils/helper");

async function main(proc) {
  if (proc.args instanceof Array) {
    return await exec(...proc.args);
  } else {
    return await exec(
      proc.args["expect_data"],
      proc.args["actual_data"],
      proc.args["out_path"]
    );
  }
}

async function exec(expect_data, actual_data, out_path) {
  console.log("Start");

  const check_type = check_type();
  var expect = import_csv(expect_data);
  var actual = import_csv(actual_data);

  if (!expect || expect.length < 1) {
    // 期待にデータが存在せず、実績が存在する場合はすべてエラーとして終了
    // 実績も存在しない場合は forがスキップされて終了になる

    if (is_completely(check_type) && actual && actual.length > 0) {
      for (var index in actual) {
        append_data(
          out_path,
          "[NG] actual row [" +
            (Number(index) + 1) +
            "] did not exist in expect"
        );
      }
    }
    return RESULT_CODE_NG;
  }

  if (!actual || actual.length < 1) {
    for (var index in expect) {
      append_data(
        out_path,
        "[NG] exprect row [" + (Number(index) + 1) + "] did not match."
      );
    }
    return RESULT_CODE_NG;
  }

  var matched_actual_index = [];
  var returncode = RESULT_CODE_OK;
  for (var index in expect) {
    var actual_index = match(expect[index], actual, matched_actual_index);
    if (actual_index >= 0) {
      append_data(
        out_path,
        "[OK] expect row [" +
          (Number(index) + 1) +
          "] matched. actual row [" +
          (Number(actual_index) + 1) +
          "]"
      );
      matched_actual_index.push(actual_index);
    } else {
      append_data(
        out_path,
        "[NG] exprect row [" + (Number(index) + 1) + "] did not match."
      );
      returncode = RESULT_CODE_NG;
    }
  }

  for (var index in actual) {
    if (is_completely(check_type) && matched_actual_index.indexOf(index) < 0) {
      append_data(
        out_path,
        "[NG] actual row [" + (Number(index) + 1) + "] did not exist in expect."
      );
      returncode = RESULT_CODE_NG;
    }
  }

  return returncode;
}

function match(expect_row, actual_data, matched_actual_index) {
  for (const index in actual_data) {
    if (matched_actual_index.indexOf(index) > -1) {
      continue;
    }
    const actual_row = actual_data[index];
    const actual_keys = Object.keys(actual_row);

    match_flg = true;
    for (var key of Object.keys(expect_row)) {
      const actual_key = get_actual_key(actual_keys, key);
      if (actual_key) {
        const actual = cast(actual_row[actual_key]);
        const expect = cast(expect_row[key]);
        console.log(actual + "," + expect);
        if (actual == expect) {
          //match
          console.log("match");
        } else {
          match_flg = false;
        }
      } else {
        match_flg = false;
      }
    }
    if (match_flg) {
      return index;
    }
  }
  return -1;
}

function cast(variable) {
  const reg = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})*");
  if (reg.test(variable)) {
    return new Date(varialbe).getTime();
  }
  return variable;
}

function get_actual_key(actual_keys, key) {
  for (var actua_key of actual_keys) {
    if (actua_key.toUpperCase() == key.toUpperCase()) {
      return actual_key;
    }
  }
  return undefined;
}
function is_completely(check_type) {
  return check_type == "complete";
}
function is_contain(check_type) {
  return check_type == "contain";
}

module.exports.main = main;
