import { mixinClass } from '../../Common/Utils/Trait';
import WithDuration from '../../Common/Traits/WithDuration';

class Base {}
class WaitWhile extends mixinClass(Base, WithDuration) {
    constructor(event) {
        super();
        this.data = null;
        this.name = 'WaitWhile';
        this.event = event;
    }

    handle() {
        this.time_sleep_until(this.getTimeoutTimestamp());
    }

    getEvent() {
        return this.event;
    }
}

module.exports = WaitWhile;
