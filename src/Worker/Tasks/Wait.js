import { mixinClass } from '../../Common/Utils/Trait';
import WithTimeout from '../../Common/Traits/WithTimeout';

class Base {}
class Wait extends mixinClass(Base, WithTimeout) {
    constructor(event = null) {
        super();
        this.data = null;
        this.name = 'Wait';
        this.event = event;
    }

    getEvent() {
        return this.event;
    }
}

module.exports = Wait;
