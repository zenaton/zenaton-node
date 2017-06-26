import moment from 'moment'

export const WithDuration = {
    _seconds(s) {
        this.getTimeoutMoment().add(s, 'seconds');

        return this
    },

    _minutes(m) {
        this.getTimeoutMoment().add(m, 'minutes');

        return this
    },

    _hours(h) {
        this.getTimeoutMoment().add(h, 'hours');

        return this
    },

    _days(d) {
        this.getTimeoutMoment().add(d, 'days');

        return this
    },

    _weeks(w) {
        this.getTimeoutMoment().add(w, 'weeks');

        return this
    },

    _months(m) {
        this.getTimeoutMoment().add(m, 'months');

        return this
    },

    _years(y) {
        this.getTimeoutMoment().add(y, 'years');

        return this;
    },

    getTimeoutMoment() {
        if(!this.timeoutMoment) {
            this.timeoutNow = moment();
            this.timeoutMoment = moment(this.timeoutNow);
        }

        return this.timeoutMoment;
    }
};

console.log(WithDuration._days(10)._years(1));
