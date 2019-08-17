const path = require("path");

// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = path.resolve(__dirname, __filename);

const { version } = require("./infos");
const Errors = require("./Errors");

const lastCodePath = "async";
// const lastCodePath = "201809";

// Helping the Agent to check if is able to manage this version
process.env.ZENATON_LAST_CODE_PATH = `${lastCodePath}`;
// process.env.ZENATON_LAST_CODE_PATH = `${lastCodePath}_draft`;

// eslint-disable-next-line import/no-dynamic-require
const pathLast = require(`./${lastCodePath}`);
const pathAsync = require(`./async`);
const pathSync = require(`./sync`);

module.exports = {
  Errors,
  infos: {
    appVersion: version,
    codePath: lastCodePath,
  },
  async: pathAsync,
  sync: pathSync,
  ...pathLast,
};
