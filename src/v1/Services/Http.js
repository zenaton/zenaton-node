const axios = require("axios");
const {
  ExternalZenatonError,
  InternalZenatonError,
  ZenatonError,
} = require("../../Errors");

const getError = (e) => {
  if (undefined === e.response) {
    return e;
  }
  // get message as status text
  const message =
    typeof e.response.statusText !== "string"
      ? "Unknown error"
      : e.response.statusText;
  // get status code
  if (e.response.status !== parseInt(e.response.status, 10)) {
    return new ZenatonError(`${message} - please contact Zenaton support`);
  }
  // Internal Server Error
  if (e.response.status >= 500) {
    return new InternalZenatonError(
      `${message} - please contact Zenaton support`,
    );
  }
  // User error
  if (
    undefined === e.response.data ||
    typeof e.response.data.error !== "string"
  ) {
    return new ExternalZenatonError(message);
  }
  return new ExternalZenatonError(e.response.data.error);
};

const get = (url, options) =>
  axios
    .get(url, options)
    .then((result) => result.data)
    .catch((error) => {
      throw getError(error);
    });

const post = (url, body, options) =>
  axios
    .post(url, body, options)
    .then((result) => result.data)
    .catch((error) => {
      throw getError(error);
    });

const put = (url, body, options) =>
  axios
    .put(url, body, options)
    .then((result) => result.data)
    .catch((error) => {
      throw getError(error);
    });

module.exports.get = get;
module.exports.post = post;
module.exports.put = put;
