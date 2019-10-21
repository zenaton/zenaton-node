/* eslint-disable no-param-reassign */

function encode(data) {
  if (data === undefined) {
    data = null;
  }

  return JSON.stringify(data);
}

function decode(data) {
  return JSON.parse(data);
}

module.exports.encode = encode;
module.exports.decode = decode;
