const axios = require("axios");
const {
  ExternalZenatonError,
  InternalZenatonError,
  ZenatonError,
} = require("../../Errors");

function getError(err) {
  if (undefined === err.response) {
    if (err.message.includes("ECONNREFUSED")) {
      return new ZenatonError("Zenaton agent does not seem to be started");
    }

    return err;
  }
  // get message as status text
  const message =
    typeof err.response.statusText !== "string"
      ? "Unknown error"
      : err.response.statusText;
  // get status code
  if (err.response.status !== parseInt(err.response.status, 10)) {
    return new ZenatonError(`${message} - please contact Zenaton support`);
  }
  // Internal Server Error
  if (err.response.status >= 500) {
    return new InternalZenatonError(
      `${message} - please contact Zenaton support`,
    );
  }
  // User error
  if (
    undefined === err.response.data ||
    typeof err.response.data.error !== "string"
  ) {
    return new ExternalZenatonError(message);
  }
  return new ExternalZenatonError(err.response.data.error);
}

async function get(url, options) {
  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (err) {
    throw getError(err);
  }
}

async function post(url, body, options) {
  try {
    const response = await axios.post(url, body, options);
    return response.data;
  } catch (err) {
    throw getError(err);
  }
}

async function put(url, body, options) {
  try {
    const response = await axios.put(url, body, options);
    return response.data;
  } catch (err) {
    throw getError(err);
  }
}

module.exports.get = get;
module.exports.post = post;
module.exports.put = put;
