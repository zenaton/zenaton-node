import Microserver from './Microserver';
import Decider from './Decider';
import Worker from './Worker';

class Slave {
    constructor(slave_id) {
        this.slaveId = slave_id;
        this.microserver = new Microserver();
    }

    process() {
        const result = this.microserver.askJob(this.slaveId);

        if (result.action) {
            switch (result.action) {
                case 'DecisionScheduled':
                    (new Decider(result.uuid)).launch();

                    break;
                case 'TaskScheduled':
                    (new Worker(result.uuid, result.name, result.input, result.hash)).process();
                    break;

            }
        }
    }
}

module.exports = Slave;
