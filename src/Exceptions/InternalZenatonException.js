export default class InternalZenatonException extends Error {
    constructor(message = null, name = null) {
        super(message);
        Object.setPrototypeOf(this, InternalZenatonException.prototype);
        this.name = name || this.constructor.name;
    }

    dump() {
        return { message: this.message, stack: this.stack };
    }
}
