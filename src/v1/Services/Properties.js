module.exports = new class {
  getNewInstanceWithoutProperties(name) {
    // eslint-disable-next-line no-undef
    return new ReflectionClass(name).newInstanceWithoutConstructor();
  }

  getPropertiesFromObject(o) {
    return Object.keys(o).reduce((acc, key) => {
      acc[key] = o[key];
      return acc;
    }, {});
  }

  getNameClassFromObject(o) {
    const constructor = o.constructor.name;
    if (constructor === "") {
      const msg = "Can't manipulate objects with anonymous constructors.";
      throw new Error(msg);
    } else if (constructor === "Object" || constructor === "Array") {
      return null;
    } else {
      return constructor;
    }
  }

  getPrototype(name) {
    const constructor = this.scope[name];
    if (constructor) {
      return constructor.prototype;
    }
    // eslint-disable-next-line no-undef
    throw new Resurrect.prototype.Error(`Unknown constructor: ${name}`);
  }

  getClassByName(/* name */) {}
}();
