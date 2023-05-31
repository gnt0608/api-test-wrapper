require("dotenv").config();
const path = require("path");

function db_env() {
  return {
    database_type: process.env.db_type,
    server: process.env.db_server,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.database,
    port: process.env.db_port,
  };
}

function log_env() {
  return {
    log_type: process.env.log_type,
  };
}

function dd_env() {
  return {
    dd_apikey: process.env.dd_apikey,
    dd_applicationkey: process.env.dd_applicationkey,
  };
}

function api_env() {
  return {
    api_type: process.env.api_type,
  };
}

function base_dir() {
  if (process.env.config_base) {
    return path.resolve(
      process.env.config_base,
      process.env.base_dir ? process.env.base_dir : ""
    );
  }
  return process.env.base_dir ? process.env.base_dir : "";
}

function check_type() {
  const check_type = process.env.check_type;
  if (check_type != "contain" && check_type != "complete") {
    throw new Error(
      "check_type must be contain / complete value:" + check_type
    );
  }

  return check_type;
}

module.exports = { db_env, dd_env, log_env, api_env, base_dir, check_type };
