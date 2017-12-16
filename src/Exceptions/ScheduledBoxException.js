export default class ScheduledBoxException extends Error {
    constructor(message = null, name = null) {
        super(message);
        Object.setPrototypeOf(this, ScheduledBoxException.prototype);
        this.name = name || this.constructor.name;
    }

    dump() {
        return { message: this.message, stack: this.stack };
    }
}
