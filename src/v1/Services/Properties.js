module.exports = new class {
  getNewInstanceWithoutProperties(name) {
    return new ReflectionClass($name).newInstanceWithoutConstructor();
  }

  getPropertiesFromObject(o) {
    const properties = {};
    Object.keys(o).forEach((key) => (properties[key] = o.key));

    return properties;
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
    throw new Resurrect.prototype.Error(`Unknown constructor: ${name}`);
  }

  getClassByName(name) {}
}();

// Object.create(Object.getPrototypeOf(c))
