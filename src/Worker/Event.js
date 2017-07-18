import _ from 'lodash';

export default class Event {
    constructor(event) {

        _.each(event, (p, k) => {
            this[k] = p
        });
        this.event = event;
        this.data = {};

        const dataSetter = (data = null) => {
            if (data) {
                this.setData(data);
            }
            return this;
        }

        return dataSetter;
    }

    setData(data) {
        _.each(data, (p, k ) => {
            this.data[k] = p;
            this[k] = p;
        });
    }
}
