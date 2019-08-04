// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = require("path").resolve(
  __dirname,
  __filename,
);

const { version } = require("./infos");
const Errors = require("./Errors");

const UP_TO_DATE_CODE_PATH = "2019-08";

/* If 'ZENATON_CODE_PATH_VERSION' is present,
 * it means we are loading through the agent/boot file.
 * Otherwise, we load by default 'UP_TO_DATE_CODE_PATH'. */
const codePath = process.env.ZENATON_CODE_PATH_VERSION || UP_TO_DATE_CODE_PATH;
// eslint-disable-next-line import/no-dynamic-require
const dynamicDependencies = require(`./${codePath}`);

/* We always expose the very last version of the client to account
 * for the special case of old tasks starting new workflows, which
 * always need to be on the last up-to-date code path */
// eslint-disable-next-line import/no-dynamic-require
const LastClient = require(`./${UP_TO_DATE_CODE_PATH}/Client`);

module.exports = {
  infos: {
    appVersion: version,
    codePath,
  },
  Errors,
  LastClient,
  ...dynamicDependencies,
};
