

export default class OutputBox {
    constructor(box) {
        this.name = box.task.name;
        this.input = box.task.data;

        if(typeof box.task.getTimeout !== 'undefined') {
            this.timeout = (box.task.getTimeout());
        } else {
            this.timeout = 2147483647;
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

        data.type = 'task';

        return data;
    }
}
