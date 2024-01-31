import * as fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

import * as yaml from "js-yaml";
import { dirname } from "path";
function _make_dir(path) {
  if (!fs.existsSync(dirname(path))) {
    fs.mkdirSync(dirname(path), { recursive: true });
  }
}
async function class_loader(class_path) {
  let module = await import("../" + class_path);
  const clazz = module[Object.keys(module)[0]];
  return clazz;
}

function import_csv(input_path) {
  const data = fs.readFileSync(input_path);
  return parse(data, {
    cast: function (value, context) {
      if (value === "") {
        // blank to null
        return undefined;
      } else {
        return value;
      }
    },
    columns: true,
    skip_empty_lines: true,
  });
}

function export_csv(out_path, data) {
  _make_dir(out_path);
  fs.writeFileSync(out_path, stringify(data, { header: true }));
}

function append_csv(out_path, data) {
  if (fs.existsSync(out_path)) {
    fs.appendFileSync(out_path, stringify(data, { header: false }));
  } else {
    export_csv(out_path, data);
  }
}
function append_data(out_path, data) {
  _make_dir(out_path);
  fs.appendFileSync(out_path, data + " \r\n");
}

function load_yaml_file(filename) {
  const yamlText = fs.readFileSync(filename, "utf8");
  return yaml.load(yamlText);
}

export {
  class_loader,
  import_csv,
  export_csv,
  append_csv,
  append_data,
  load_yaml_file,
};
