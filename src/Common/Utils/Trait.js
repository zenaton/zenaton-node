// Mixin traits into an Object (another trait)
export const mixin = (object, ...traits) => {
	let _traits = [];
	if (object._traits) {
		Array.prototype.push.apply(_traits, object._traits);
	}
	let props = {
		_traits: {
			value: _traits,
			writable: true,
			configurable: true
		}
	};
	for (let trait of traits) {
		if (trait._traits) {
			Array.prototype.push.apply(_traits, trait._traits);
		}
		for (let name of Object.getOwnPropertyNames(trait)) {
			if (name !== "_traits" && ! object.hasOwnProperty(name)) {
				props[name] = {
					value: trait[name],
					writable: true,
					configurable: true
				};
			}
		}
		_traits.push(trait);
	}
	Object.defineProperties(object, props);
	return object;
}

// Mixin traits into a class. class Foo extends mixinClass(Base, Trait1) {}
export const mixinClass = (baseClass, ...traits) => {
	class traitedClass extends baseClass {};
	mixin.apply(this, [traitedClass.prototype].concat(traits));
	return traitedClass;
}

// Checks to see if a class or trait has a trait
export const hasTrait = (object, trait) => {
	let _traits;
	if (typeof object === "function") {
		_traits = object.prototype._traits;
	} else {
		_traits = object._traits;
	}
	return Array.isArray(_traits) && _traits.indexOf(trait) >= 0;
}

/*
  var Trait1 = {
    method1() {}
  };

  var Trait2 = {
    method2() {}
  };

  var Trait3 = mixin({
    method3() {}
  }, Trait2);
  hasTrait(Trait3, Trait2) // true
  hasTrait(Trait3, Trait1) // false

  class Base {}
  class Foo extends mixinClass(Base, Trait1) {}

  hasTrait(Foo, Trait1) // true
  hasTrait(Foo, Trait2) // false

  class Foo2 extends Foo {}

  hasTrait(Foo2, Trait1) // true
  hasTrait(Foo2, Trait2) // false

  class Foo3 extends mixinClass(Foo, Trait2) {}

  hasTrait(Foo3, Trait1) // true
  hasTrait(Foo3, Trait2) // true
  class Bar extends mixinClass(Base, Trait3) {}

  hasTrait(Bar, Trait1) // false
  hasTrait(Bar, Trait2) // true
  hasTrait(Bar, Trait3) // true
*/
