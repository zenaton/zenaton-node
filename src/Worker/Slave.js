import Microserver from './Microserver';
import Decider from './Decider';

export default class Slave {
    constructor(source, instance_id, slave_id) {
        this.source = source;
        this.instanceId = instance_id;
        this.slaveId = slave_id;
        this.microserver = new Microserver();
    }

    process() {
        this.microserver.askJob(this.instanceId, this.slaveId)
            .then((result) => {
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
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
