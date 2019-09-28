function encode(data) {
  return JSON.stringify(data);
}

function decode(json) {
  return JSON.parse(json);
}

module.exports.encode = encode;
module.exports.decode = decode;
