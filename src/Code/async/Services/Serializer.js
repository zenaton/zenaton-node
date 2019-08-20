/* eslint-disable no-param-reassign */

const EventEmitter = require("events");

const ZENATON_PREFIX = "@zenaton";
const CURRENT_VERSION = "1.0.0";

const TYPED_ARRAYS_CLASS_NAMES = [
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Float32Array",
  "Float64Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
];

function encode(data) {
  const result = encodeData(data);

  return JSON.stringify(result);
}

function decode(data) {
  const parsedData = JSON.parse(data);

  return decodeData(parsedData);
}

function encodeData(data) {
  const store = [];
  const storePointers = new Map();
  const result = {
    v: CURRENT_VERSION,
    s: store,
  };

  const valueObject = encodeValue(data);

  if (valueObject.type === "primitive") {
    result.d = valueObject.value;
  } else if (valueObject.type === "object") {
    result.o = valueObject.value;
  }

  return result;

  function encodeValue(value) {
    if (value == null) {
      return {
        type: "primitive",
        value: null,
      };
    }

    if (isEventEmitter(value)) {
      return {
        type: "primitive",
        value: null,
      };
    }

    if (isString(value) || isNumber(value) || isBoolean(value)) {
      return {
        type: "primitive",
        value,
      };
    }

    if (isObject(value)) {
      return {
        type: "object",
        value: encodeObject(value),
      };
    }

    // Unknown values are ignored
    return {
      type: "primitive",
      value: null,
    };
  }

  function encodeObject(object) {
    if (storePointers.has(object)) {
      return storePointers.get(object);
    }

    const newIndex = store.length;
    const newZenatonToken = `${ZENATON_PREFIX}#${newIndex}`;
    storePointers.set(object, newZenatonToken);

    if (isDate(object)) {
      if (isValidDate(object)) {
        store.push({
          t: "Date",
          p: {
            isValid: true,
            iso8601: object.toISOString(),
          },
        });
      } else {
        store.push({
          t: "Date",
          p: { isValid: false },
        });
      }
    } else if (isArray(object)) {
      // We immediately push the object to the store
      const storeObject = {
        v: [],
      };
      store.push(storeObject);

      // Then we resolve the property
      object.reduce((acc, value) => {
        const encodedValue = encodeValue(value);

        acc.v.push(encodedValue.value);

        return acc;
      }, storeObject);
    } else if (ArrayBuffer.isView(object) && getTag(object) !== "DataView") {
      // We immediately push the object to the store
      const storeObject = {
        t: object.constructor.name,
        v: [],
      };
      store.push(storeObject);

      // Then we resolve the property
      object.reduce((acc, value) => {
        const encodedValue = encodeValue(value);

        acc.v.push(encodedValue.value);

        return acc;
      }, storeObject);
    } else if (isSet(object)) {
      // We immediately push the object to the store
      const storeObject = {
        t: "Set",
        v: [],
      };
      store.push(storeObject);

      // Then we resolve the property
      [...object].reduce((acc, value) => {
        const encodedValue = encodeValue(value);

        acc.v.push(encodedValue.value);

        return acc;
      }, storeObject);
    } else if (isMap(object)) {
      // We immediately push the object to the store
      const storeObject = {
        t: "Map",
        k: [],
        v: [],
      };
      store.push(storeObject);

      // Then we resolve the property
      [...object].reduce((acc, pair) => {
        const [key, value] = pair;

        const encodedKey = encodeValue(key);
        const encodedValue = encodeValue(value);

        acc.k.push(encodedKey.value);
        acc.v.push(encodedValue.value);

        return acc;
      }, storeObject);
    } else if (isPlainObject(object)) {
      // We immediately push the object to the store
      const storeObject = {
        k: [],
        v: [],
      };
      store.push(storeObject);

      // Then we resolve the property
      Object.keys(object).reduce((acc, key) => {
        const value = object[key];

        /* Functions are ignored and not included.
         * This is especially important to prevent private functions
         * added by user from being serialized. */
        if (isFunction(value)) {
          return acc;
        }

        const encodedKey = encodeValue(key);
        const encodedValue = encodeValue(value);

        acc.k.push(encodedKey.value);
        acc.v.push(encodedValue.value);

        return acc;
      }, storeObject);
    } else {
      // We immediately push the object to the store
      const storeObject = {
        n: object.constructor.name,
        p: {},
      };
      store.push(storeObject);

      // Then we resolve the property
      Object.keys(object).reduce((acc, key) => {
        const value = object[key];

        const encodedKey = encodeValue(key);
        const encodedValue = encodeValue(value);

        acc.p[encodedKey.value] = encodedValue.value;

        return acc;
      }, storeObject);
    }

    return newZenatonToken;
  }
}

function decodeData(data) {
  const store = data.s;
  const storeTokens = new Map();

  // Property 'd' can be present but 'null'
  if (hasField(data, "d")) {
    return data.d;
  }

  if (hasField(data, "o")) {
    return lookupToken(data.o);
  }

  throw new Error("[Serializer] Failed to decode data");

  function lookupToken(possibleToken) {
    if (!isToken(possibleToken)) {
      return possibleToken;
    }

    const token = possibleToken;
    return decodeToken(token);
  }

  function decodeToken(token) {
    if (storeTokens.has(token)) {
      return storeTokens.get(token);
    }

    const index = getIndexFromToken(token);
    const complexObject = store[index];

    // Dates
    if (hasField(complexObject, "t") && complexObject.t === "Date") {
      const object = decodeDate(complexObject.p);
      storeTokens.set(token, object);
      return object;
    }

    // Typed arrays
    if (
      hasField(complexObject, "v") &&
      !hasField(complexObject, "k") &&
      hasField(complexObject, "t") &&
      TYPED_ARRAYS_CLASS_NAMES.includes(complexObject.t)
    ) {
      const typedArray = new global[complexObject.t](complexObject.v);
      storeTokens.set(token, typedArray);
      return typedArray;
    }

    // Sets
    if (
      hasField(complexObject, "v") &&
      !hasField(complexObject, "k") &&
      hasField(complexObject, "t") &&
      complexObject.t === "Set"
    ) {
      const set = new Set();
      storeTokens.set(token, set);
      decodeSetIterable(complexObject.v, set);
      return set;
    }

    // Maps
    if (
      hasField(complexObject, "v") &&
      hasField(complexObject, "k") &&
      hasField(complexObject, "t") &&
      complexObject.t === "Map"
    ) {
      const map = new Map();
      storeTokens.set(token, map);
      decodeMapIterable(complexObject.k, complexObject.v, map);
      return map;
    }

    // Array as JSON literal
    if (
      hasField(complexObject, "v") &&
      !hasField(complexObject, "k") &&
      !hasField(complexObject, "n")
    ) {
      const array = [];
      storeTokens.set(token, array);
      decodeArray(complexObject.v, array);
      return array;
    }

    // Hashmap as JSON literal
    if (
      hasField(complexObject, "v") &&
      hasField(complexObject, "k") &&
      !hasField(complexObject, "n")
    ) {
      const object = {};
      storeTokens.set(token, object);
      decodeUnzippedObject(complexObject.k, complexObject.v, object);
      return object;
    }

    // Prototypal objects
    if (hasField(complexObject, "n") && hasField(complexObject, "p")) {
      const constructorName = complexObject.n;
      const jsonLiteral = complexObject.p;

      const DummyClass = class {};
      Object.defineProperty(DummyClass, "name", { value: constructorName });

      const object = new DummyClass();
      storeTokens.set(token, object);
      decodeHashmap(jsonLiteral, object);
      return object;
    }

    throw new Error(`[Serializer] Failed to decode token '${token}'`);
  }

  function decodeDate(date) {
    if (!date.isValid) {
      return new Date("Invalid Date");
    }

    return new Date(date.iso8601);
  }

  function decodeArray(array, target) {
    array.reduce((acc, value) => {
      const decodedValue = lookupToken(value);

      acc.push(decodedValue);

      return acc;
    }, target);
  }

  function decodeHashmap(object, target) {
    Object.keys(object).reduce((acc, key) => {
      const value = object[key];

      const decodedValue = lookupToken(value);

      acc[key] = decodedValue;

      return acc;
    }, target);
  }

  function decodeUnzippedObject(keys, values, target) {
    if (keys.length !== values.length) {
      throw new Error(
        "[Serializer] Failed to decode object: mismatch between keys and values length",
      );
    }

    keys.reduce((acc, key, index) => {
      const value = values[index];

      const decodedValue = lookupToken(value);

      acc[key] = decodedValue;

      return acc;
    }, target);
  }

  function decodeSetIterable(values, target) {
    return values.reduce((acc, value) => {
      const decodedValue = lookupToken(value);

      acc.add(decodedValue);

      return acc;
    }, target);
  }

  function decodeMapIterable(keys, values, target) {
    if (keys.length !== values.length) {
      throw new Error(
        "[Serializer] Failed to decode object: mismatch between keys and values length",
      );
    }

    return keys.reduce((acc, key, index) => {
      const value = values[index];

      const decodedKey = lookupToken(key);
      const decodedValue = lookupToken(value);

      acc.set(decodedKey, decodedValue);

      return acc;
    }, target);
  }
}

function isString(data) {
  return typeof data === "string" || getTag(data) === "String";
}

function isNumber(data) {
  return typeof data === "number" || getTag(data) === "Number";
}

function isBoolean(data) {
  return data === true || data === false || getTag(data) === "Boolean";
}

function isDate(data) {
  return data instanceof Date || getTag(data) === "Date";
}

function isValidDate(data) {
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(data);
}

function isEventEmitter(data) {
  return data instanceof EventEmitter;
}

function isSet(data) {
  return data instanceof Set;
}

function isMap(data) {
  return data instanceof Map;
}

function isObject(data) {
  return typeof data === "object";
}

function isPlainObject(data) {
  if (Object.getPrototypeOf(data) === null) {
    return true;
  }

  let proto = data;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(data) === proto;
}

function isArray(data) {
  return Array.isArray(data);
}

// eslint-disable-next-line no-unused-vars
function isFunction(data) {
  return typeof data === "function";
}

// eslint-disable-next-line no-unused-vars
function isSymbol(data) {
  return typeof data === "symbol";
}

function getTag(object) {
  const type = Object.prototype.toString.call(object);
  const regexp = /\[object (.+)\]/;
  const matches = type.match(regexp);
  return matches[1];
}

function isToken(token) {
  return typeof token === "string" && token.startsWith(ZENATON_PREFIX);
}

function hasField(complexObject, fieldName) {
  return Object.prototype.hasOwnProperty.call(complexObject, fieldName);
}

function getIndexFromToken(token) {
  const regexp = new RegExp(`${ZENATON_PREFIX}#(\\d+)`);
  const matches = token.match(regexp);
  return parseInt(matches[1], 10);
}

module.exports.CURRENT_VERSION = CURRENT_VERSION;
module.exports.encode = encode;
module.exports.decode = decode;
