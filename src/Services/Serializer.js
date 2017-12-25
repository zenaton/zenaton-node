
const encode = (data) => {
	return JSON.stringify(data)
}

const decode = (json) => {
	return JSON.parse(json)
}

export { encode, decode }
