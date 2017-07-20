import _ from 'lodash';

import Microserver from './Microserver';
import WorkflowManager from './WorkflowManager';
import OutputBox from './OutputBox';
import { ModifiedDeciderException, ScheduledBoxException } from '../Common/Exceptions';
let instance = null;

class Helpers {
    constructor() {

        if (instance) {
            return instance
        }

        this.microserver = new Microserver();
        this.workflowManager = new WorkflowManager();
        instance = this;
    }

    doExecute(boxes, isSync) {
        const outputs = [];

        this.checkArgumentsType(boxes)

        if (!this.isExecutedWithZenaton()) {
            _.each(boxes, (box) => {
                outputs.push(box.handle())
            });

            if (isSync) {
                return ((boxes.length) > 1) ? outputs : outputs[0];
            }

            return;
        }

        const dboxes = [];
        const flow = this.workflowManager.getCurrentWorkflow();
        _.each(boxes, (box) => {
            if (! isSync) {
                flow.nextAsync();
            } else if ((boxes.length) > 1 ) {
                flow.nextParallel();
            } else {
                flow.next();
            }

            let outputBox = (new OutputBox(box)).setPosition(flow.getPosition());
            dboxes.push(outputBox)
        });

        // throw new ScheduledBoxException();
        const response = this.microserver.execute(dboxes)

        if (response.status === 'modified') {
            throw new ModifiedDeciderException()
        }

        if (! isSync) {
            return;
        }

        if (response.status === 'scheduled') {
            throw new ScheduledBoxException();
        }

        if (response.status === 'completed') {
            flow.setData(response.properties);
            this.workflowManager.getCurrentWorkflow().setData(response.properties);
            const outputs = response.outputs;

            return (outputs.length > 1) ? outputs : outputs[0];
        }

    }

    checkArgumentsType(boxes) {

    }

    isExecutedWithZenaton() {
        return (this.microserver.getUuid()) ? true : false;
    }
}

module.exports = Helpers;
