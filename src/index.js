const path = require("path");
const { readdirSync, statSync } = require("fs");

const getDirectories = (source) => readdirSync(source);

// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = path.resolve(__dirname, __filename);

const { version } = require("./infos");
const Errors = require("./Errors");

const lastCodePath = "201908_draft";

// Helping the Agent to check if is able to manage this version
process.env.ZENATON_LAST_CODE_PATH = `${lastCodePath}`;

// eslint-disable-next-line import/no-dynamic-require
const pathLast = require(`./Code/${lastCodePath}`);

// last version
const index = {
  Errors,
  infos: {
    appVersion: version,
    codePath: lastCodePath,
  },
  ...pathLast,
};

// add all code path
getDirectories(path.join(__dirname, "Code")).forEach((dir) => {
  if (statSync(path.join(__dirname, "Code", dir)).isDirectory()) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    index[dir] = require(`./Code/${dir}`);
  }
});

module.exports = index;
