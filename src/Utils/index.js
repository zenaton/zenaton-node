import { hasTrait, mixin, mixinClass } from './Trait'

const objectsHaveSameKeys = (...objects) => {
	const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), [])
	const union = new Set(allKeys)
	return objects.every(object => union.size === Object.keys(object).length)
}

export { hasTrait, mixin,  mixinClass, objectsHaveSameKeys }
