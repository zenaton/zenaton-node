const credentials = {
  appId: null,
  apiToken: null,
  appEnv: null,
};

function init(appId, apiToken, appEnv) {
  credentials.appId = appId;
  credentials.apiToken = apiToken;
  credentials.appEnv = appEnv;
}

module.exports.init = init;
module.exports.credentials = credentials;
