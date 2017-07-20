import Task from './Task';
import { Wait, WaitWhile} from './Tasks';

export default class OutputBox {
    constructor(box) {
        this.name = box.name;
        this.input = box.data;
        this.box = box;

        if (typeof box.getEvent !== 'undefined') {
            this.event = box.getEvent();
        }

        if(typeof box.getTimeout !== 'undefined') {
            this.timeout = (box.getTimeout());
        } else {
            this.timeout = 2147483647;
        }

        if (typeof box.getTimeoutTimestamp !== 'undefined') {
            this.timeout = box.getTimeoutTimestamp();
        }

    }

    setPosition(position) {
        this.position = position;

        return this;
    }

    getWork() {

        const data = {
            name: this.name,
            position: this.position,
            input: this.input,
            timeout: this.timeout
        };

        if (this.isTask()) {
            data.type = 'task';
        } else if (this.isWait()) {
            data.type = 'wait';
            data.event = this.event;
        } else if (this.isWaitWhile()) {
            data.type = 'while';
            data.event = this.event;
        }


        return data;
    }


    isTask() {
        return (this.box instanceof Task);
    }

    isWait() {
        return (this.box instanceof Wait);
    }

    isWaitWhile() {
        return (this.box instanceof WaitWhile);
    }
}
