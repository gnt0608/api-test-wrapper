import * as fs from "fs";
import { parse } from "csv-parse/sync";
import * as yaml from "js-yaml";

async function class_loader(class_path) {
  let module = await import(class_path);
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
  // TODO:
}

function append_csv(pout_path, data) {
  // TODO:
}
function append_data(out_path, data) {
  fs.appendFileSync(out_path, data + " \r\n");
}

function load_yaml_file(filename) {
  const yamlText = fs.readFileSync(filename, "utf8");
  return yaml.load(yamlText);
}

export { class_loader, import_csv, append_csv, append_data, load_yaml_file };
