require("dotenv").config();

function db_env(){
    return {
        database_type: process.env.db_type,
        server: process.env.db_server,
        user: process.env.db_user,
        password: process.env.db_password,
        database: process.env.database,
        port: process.env.db_port
      };
}

function base_dir(){
    return process.env.base_dir
}

function check_type(){
    const check_type = process.env.check_type
    if (check_type != 'contain' && check_type != 'complete'){
        throw new Error('check_type must be contain / complete value:' + check_type);
    }

    return check_type
}

module.exports = {db_env , base_dir}