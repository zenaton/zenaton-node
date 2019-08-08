// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = require("path").resolve(
  __dirname,
  __filename,
);

const { version } = require("./infos");
const Errors = require("./Errors");

const LAST_CODE_PATH = "2019-08";
/* We set this for helping the Agent
 * to check if is able to manage this version. */
process.env.ZENATON_LAST_CODE_PATH = LAST_CODE_PATH;

/* If 'ZENATON_CODE_PATH_VERSION' is present, it means
 * we are loading a specific code for processing an old workflow.
 * Otherwise, we load by default 'LAST_CODE_PATH'. */
const codePath = process.env.ZENATON_CODE_PATH_VERSION || LAST_CODE_PATH;

// eslint-disable-next-line import/no-dynamic-require
const dynamicDependencies = require(`./${codePath}`);

// eslint-disable-next-line import/no-dynamic-require
const async = require(`./async`);
const sync = require(`./sync`);

/* We always expose the very last version of the client to account
 * for the special case of old tasks starting new workflows, which
 * always need to be on the last up-to-date code path */
// eslint-disable-next-line import/no-dynamic-require
const LastClient = require(`./${LAST_CODE_PATH}/Client`);

module.exports = {
  infos: {
    appVersion: version,
    codePath,
  },
  async,
  sync,
  Errors,
  LastClient,
  ...dynamicDependencies,
};
