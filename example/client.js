// load .env file
require('dotenv').config();
var Client = require('../lib/Client');

var app_id = process.env.ZENATON_APP_ID
var api_token = process.env.ZENATON_API_TOKEN;
var app_env = process.env.ZENATON_APP_ENV;


if (!app_id) {
    console.log("Please add your Zenaton application id on '.env' file (https://zenaton.com/app/api)");
    process.exit(1);
}

if (!api_token) {
    console.log("Please add your Zenaton api token on '.env' file (https://zenaton.com/app/api)");
    process.exit(1);
}


module.exports = new Client(app_id, api_token, app_env) ;
