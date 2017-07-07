export default class ZenatonException extends Error {
   constructor(message, name) {
       super(message);
       Object.setPrototypeOf(this, ZenatonException.prototype);
       this.name = name || this.constructor.name;
   }

   dump() {
       return { message: this.message, stack: this.stack };
   }
 }
