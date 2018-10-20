// Mixin traits into another trait
const mix = (object, ...traits) => {
  const _traits = [];
  if (object._traits) {
    Array.prototype.push.apply(_traits, object._traits);
  }
  const props = {
    _traits: {
      value: _traits,
      writable: true,
      configurable: true,
    },
  };
  for (const trait of traits) {
    if (trait._traits) {
      Array.prototype.push.apply(_traits, trait._traits);
    }
    for (const name of Object.getOwnPropertyNames(trait)) {
      if (name !== "_traits" && !object.hasOwnProperty(name)) {
        props[name] = {
          value: trait[name],
          writable: true,
          configurable: true,
        };
      }
    }
    _traits.push(trait);
  }
  Object.defineProperties(object, props);
  return object;
};

// Mixin traits into a class.
const apply = (baseClass, ...traits) => {
  mix.apply(this, [baseClass.prototype].concat(traits));
  return baseClass;
};

// Checks to see if a class or trait has a trait
const has = (object, trait) => {
  let _traits;
  if (typeof object === "function") {
    _traits = object.prototype._traits;
  } else {
    _traits = object._traits;
  }
  return Array.isArray(_traits) && _traits.indexOf(trait) >= 0;
};

export { mix, apply, has };
