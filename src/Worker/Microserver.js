import _ from 'lodash';
import { get, post, put } from '../Common/Services/index';
import WorkflowManager from './WorkflowManager';

let instance = null;

const MICROSERVER_URL = 'http://localhost:4001';

export default class Microserver {
    constructor() {
        // Singleton
        if (instance) {
            return instance
        }
        this.workflowManager = new WorkflowManager();
        instance = this;
    }

    getUuid() {
        return this.uuid;
    }

    setUuid(uuid) {
        this.uuid = uuid;
        return this;
    }

    reset() {

        this.uuid = null;
        this.hash = null;

        return this;
    }

    sendEnv(body) {
        const url = this.microServerUrl('/configuration');

        return post(url, body);
    }

    stop(body) {
        const url = this.microServerUrl('/stop');

        return new Promise((resolve, reject) => {
            post(url, body)
                .then((response) => {
                    console.log(response.msg);
                    resolve(response.msg)
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    askJob(instanceId, slaveId) {
        const url = this.microServerUrl('/jobs/' + instanceId + '?slave_id=' + slaveId);
        return get(url);
    }

    getWorkflowToExecute() {
        return this.sendDecision({action: 'start'})
    }

    execute(boxes) {

        const body = {};

        body.action = 'execute';

        const works = [];
        _.each(boxes, (box) => {
            works.push(box.getWork());
        });
        body.works = works;

        const response = this.sendDecision(body)

        if (response.properties) {
            console.log("properties");
            console.log(response.properties);
        }

        if (response.outputs) {
            console.log("outputs");
            console.log(response.outputs);
        }

        return response;

    }

    sendDecision(body) {
        const url = this.microServerUrl('/decisions/' + this.uuid);

        const response =  post(url, body)
        return response;
    }


    completeDecision()
    {
        const response = this.sendDecision({
            action: 'terminate',
            status: 'running',
            properties: this.workflowManager.getCurrentWorkflow().workflow.data
        });

        console.log(response);
    }

    microServerUrl(ressource)
    {
        return MICROSERVER_URL + ressource;
    }
}
