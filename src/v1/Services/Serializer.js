const { InternalZenatonError } = require("../../Errors");
// this string prefixs ids that are used to identify objects and Closure
const ID_PREFIX = "@zenaton#";

const KEY_OBJECT = "o";
const KEY_OBJECT_NAME = "n";
const KEY_OBJECT_PROPERTIES = "p";
const KEY_ARRAY = "a";
const KEY_CLOSURE = "c";
const KEY_DATA = "d";
const KEY_STORE = "s";

module.exports = new class {
  encode(data) {
    return JSON.stringify(data);

    this.encoded = [];
    this.decoded = [];

    const value = [];

    if (typeof data === "object") {
      if (data instanceof Array) {
        value[KEY_ARRAY] = this.encodeArray(data);
      } else {
        value[KEY_OBJECT] = this.encodeObject(data);
      }
    } else {
      value[KEY_DATA] = data;
    }

    //  this.encoded may have been updated by encodeClosure or encodeObject
    value[KEY_STORE] = this.encoded;

    return JSON.stringify(value);
  }

  decode(json) {
    const array = JSON.parse(json);

    return array;

    this.decoded = [];
    this.encoded = array[KEY_STORE];

    if (KEY_OBJECT in array) {
      const id = array[KEY_OBJECT].substr(ID_PREFIX.length);
      return this.decodeObject(id, this.encoded[id]);
    }
    // if (KEY_CLOSURE in array) {
    // 	id = substr(array[KEY_CLOSURE], strlen(ID_PREFIX))
    // 	return this.decodeClosure(id, this.encoded[id])
    // }
    if (KEY_ARRAY in array) {
      return this.decodeArray(array[KEY_ARRAY]);
    }
    if (KEY_DATA in array) {
      return array[KEY_DATA];
    }
    throw new InternalZenatonError(`Unknown key in: ${json}`);
  }

  isObjectId(s) {
    const len = ID_PREFIX.length;

    return (
      typeof s === "string" &&
      s.substr(0, len) === ID_PREFIX &&
      s.substr(len) in this.encoded
    );
  }

  encodeObject(o) {
    // get key of existing object
    let id = this.decoded.indexOf(o);

    // store object in encoded array if not yet present
    if (id === -1) {
      id = this.decoded.length;
      this.decoded[id] = o;
      this.encoded[id] = [];
      this.encoded[id][KEY_OBJECT_NAME] = o.constructor.name;
      this.encoded[id][KEY_OBJECT_PROPERTIES] = this.encodeArray(
        this.properties.getPropertiesFromObject(o),
      );
    }

    return ID_PREFIX + id;
  }

  encodeArray(a) {
    const array = [];
    a.forEach((key, value) => {
      if (typeof value === "object") {
        if (value instanceof Array) {
          array[key] = this.encodeArray(value);
        } else {
          array[key] = this.encodeObject(value);
        }
      } else {
        array[key] = value;
      }
    });

    return array;
  }

  decodeObject(id, encodedObject) {
    // return object if already known (avoid recursion)
    if (id in this.decoded) {
      return this.decoded[id];
    }

    // new empty instance
    const o = this.properties.getNewInstanceWithoutProperties(
      encodedObject[KEY_OBJECT_NAME],
    );

    // make sure this is in decoded array, before decoding properties, to avoid potential recursion
    this.decoded[id] = o;

    // transpile properties
    const properties = this.decodeArray(encodedObject[KEY_OBJECT_PROPERTIES]);

    // fill instance with properties
    return this.properties.setPropertiesToObject(o, properties);
  }

  decodeArray(array) {
    array.forEach((key, value) => {
      if (this.isObjectId(value)) {
        const id = value.substr(ID_PREFIX.length);
        const encoded = this.encoded[id];
        if (encoded instanceof Array) {
          // object is define by an array [n =>, p=>]
          array[key] = this.decodeObject(id, encoded);
        } else {
          // if it's not an object, then it's a closure
          array[key] = this.decodeClosure(id, encoded);
        }
      } else if (value instanceof Array) {
        array[key] = this.decodeArray(value);
      }
    });

    return array;
  }
}();
