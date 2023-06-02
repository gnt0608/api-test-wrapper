import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
dotenv.config();

var variables: any;

function setup() {
  // FIXME: 実行ディレクトリに存在するenv.jsonを取得する形になっている
  const env_json = fs
    .readFileSync(path.resolve(process.cwd(), "env.json"))
    .toString();
  JSON.parse(env_json);
  variables = Object.assign({ variable: {} }, JSON.parse(env_json));
}

function set_scenario_dir(scenario_path) {
  variables.screnario_dir = path.dirname(scenario_path);
}

function set_variable(key, value) {
  variables.variable[key] = value;
}

function get_variable(key) {
  return variables.variable[key];
}

function db_env() {
  return {
    database_type: variables.db.type,
    server: variables.db.server,
    user: variables.db.user,
    password: variables.db.password,
    database: variables.db.database,
    port: variables.db.port,
  };
}

function log_env() {
  return {
    log_type: variables.log.type,
  };
}

function dd_env() {
  return {
    dd_apikey: variables.log.apikey,
    dd_applicationkey: variables.log.applicationkey,
  };
}

function aws_env() {
  return {
    aws_region: variables.aws.aws_region,
    access_key_id: variables.aws.access_key_id,
    secret_access_key: variables.aws.secret_access_key,
  };
}

function api_env() {
  return {
    api_type: variables.api_type,
  };
}

function base_dir() {
  if (variables.screnario_dir) {
    return path.resolve(
      variables.screnario_dir,
      variables.base_dir ? variables.base_dir : ""
    );
  }
  return variables.base_dir ? variables.base_dir : "";
}

export {
  setup,
  set_scenario_dir,
  set_variable,
  get_variable,
  db_env,
  dd_env,
  aws_env,
  log_env,
  api_env,
  base_dir,
};
