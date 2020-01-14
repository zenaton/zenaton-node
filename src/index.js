const path = require("path");
const { readdirSync, statSync } = require("fs");
const { version } = require("./infos");
const Errors = require("./Errors");

const LAST_CODE_PATH = "serverless";

// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = path.resolve(__dirname, __filename);

// Helping the Agent to check if is able to manage this version
process.env.ZENATON_LAST_CODE_PATH = LAST_CODE_PATH;

const PATH = process.env.ZENATON_JOB_CODE_PATH
  ? process.env.ZENATON_JOB_CODE_PATH
  : LAST_CODE_PATH;

// eslint-disable-next-line import/no-dynamic-require
const defaultPath = require(`./Code/${PATH}`);

// Define main version
const index = {
  Errors,
  infos: {
    appVersion: version,
    codePath: LAST_CODE_PATH,
  },
  ...defaultPath,
};

// add all code path
readdirSync(path.join(__dirname, "Code")).forEach((dir) => {
  if (statSync(path.join(__dirname, "Code", dir)).isDirectory()) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    index[dir] = require(`./Code/${dir}`);
  }
});

module.exports = index;
