const SEPARATOR_ASYNC = 'a';
const SEPARATOR_PARALLEL = 'p';
export default class Position
{

    constructor() {
        this.init();
    }

    init() {
        this.main = 0;
        this.counter = 0;
        this.position = "0";
    }

    get() {
        return this.position;
    }

    next() {
        this.main++;
        this.position = this.main.toString();
    }

    nextParallel() {
        if (this.isInParallel()) {
            this.counter++;
        } else {
            this.main++;
            this.counter = 0;
        }
        this.position = this.main + SEPARATOR_PARALLEL + this.counter;
    }

    nextAsync() {
        this.main++;
        this.position = this.main + SEPARATOR_ASYNC;
    }

    isInParallel() {
        return this.strpos(this.position, SEPARATOR_PARALLEL) !== false;
    }

    strpos(haystack, needle, offset) {
        var i = (haystack + '')
            .indexOf(needle, (offset || 0))
          return i === -1 ? false : i
    }
}
