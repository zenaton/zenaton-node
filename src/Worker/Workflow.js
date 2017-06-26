
let instance = null;

export default class Workflow {
    constructor(workflow) {
        if (instance) {
            return instance;
        }

        this.workflow = workflow
        instance = this;
    }

    
}
