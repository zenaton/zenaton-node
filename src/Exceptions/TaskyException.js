export default class TaskyException extends Error {
   constructor(message, name) {
       super(message);
       Object.setPrototypeOf(this, TaskyException.prototype);
       this.name = name || this.constructor.name;
   }

   dump() {
       return { message: this.message, stack: this.stack };
   }
 }
