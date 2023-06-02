const fs = require("fs");
const { parse } = require("csv-parse/sync");

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

function append_data(out_path, data) {
  fs.appendFileSync(out_path, data + " \r\n");
}

function load_yaml_file(filename) {
  const fs = require("fs");
  const yaml = require("js-yaml");
  const yamlText = fs.readFileSync(filename, "utf8");
  return yaml.load(yamlText);
}

module.exports = { import_csv, append_data, load_yaml_file };
