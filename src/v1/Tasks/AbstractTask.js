const Engine = require('../Engine/Engine')

module.exports = class AbstractTask {
	constructor(name) {
		// class name
		this.name = name

		// ensure handle function is called
		// with right context
		// let binded = handle.bind(this)

		// let promiseHandle = function () {
		// 	return new Promise(function (resolve, reject) {
		// 		// call handle with custom done function
		// 		binded(function(err, data) {
		// 			if (err) return reject(err)
		// 			resolve(data)
		// 		})
		// 	})
		// }
	}

	// asynchroneous execution within a workflow
	dispatch() {
		new Engine().dispatch([this])
	}

	// synchroneous execution within a workflow
	execute() {
		return new Engine().execute([this])[0]
	}

	static methods() {
		return ['handle', 'getMaxProcessingTime']
	}
}
