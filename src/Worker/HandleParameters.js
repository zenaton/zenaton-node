import _ from 'lodash';

class HandleParameters {
    constructor() {
    }

    process(classes) {
        let workflows = [];
        let tasks = [];
        classes = classes.trim().split(',');

        _.each(classes, (c) => {
            if (this.taskManager.getTaskByName(c)) {
                tasks.push(c);
            }
        });

        _.each(classes, (c) => {
            if (this.workflowManager.getWorkflow(c)) {
                workflows.push(c);
            }
        });


        return {
            tasks: tasks,
            workflows: workflows
        };
    }
}

module.exports = HandleParameters;
