import _ from 'lodash';
import { get, post, put } from '../Common/Services';
import WorkflowManager from './WorkflowManager';

let instance = null;

const MICROSERVER_URL = 'http://localhost:4001';

class Microserver {
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

    setHash(hash)
    {
        this.hash = hash;
        return this;
    }

    reset() {

        this.uuid = null;
        this.hash = null;

        return this;
    }

    isDeciding() {
        return (!this.hash && this.uuid);
    }

    isWorking() {
        return (this.hash && this.uuid);
    }

    sendEnv(body) {
        const url = this.microServerUrl('/configuration');
        return post(url, body);
    }

    stop(body) {
        const url = this.microServerUrl('/stop');
        return post(url, body);
    }

    status()
    {
        const url = this.microServerUrl('/status');
        return get(url);
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

        if (response.outputs) {
            const outputs = _.map(response.outputs, (output) => {
                if (output) {
                    return JSON.parse(output);
                }
            });

            response.outputs = outputs;
        }

        return response;

    }

    sendDecision(body) {
        const url = this.microServerUrl('/decisions/' + this.uuid);

        const response =  post(url, body)
        return response;
    }

    sendWork(body)
    {
        const url = this.microServerUrl('/works/' + this.uuid);

        body.hash = this.hash;
        return post(url, body);
    }


    completeDecision()
    {
        const response = this.sendDecision({
            action: 'terminate',
            status: 'running',
            properties: this.workflowManager.getCurrentWorkflow().workflow.data
        });
    }

    completeDecisionBranch(output = null) {

        const body = {
            action: 'terminate',
            status: 'completed',
            properties: this.workflowManager.getCurrentWorkflow().workflow.data,
            output: (output) ? JSON.stringify(output) : null
        };

        this.sendDecision(body);
    }

    failDecider(e) {

        this.sendDecision({
            action: 'terminate',
            status: 'zenatonFailed',
            error_code: 0,
            error_name: e.name,
            error_message: e.message,
            error_stacktrace: e.stack,
            failed_at: Date.now()
        });
    }

    failDecision(e) {

        this.sendDecision({
            action: 'terminate',
            status: 'failed',
            error_code: 0,
            error_name: e.name,
            error_message: e.message,
            error_stacktrace: e.stack,
            failed_at: Date.now()
        });
    }

    completeWork(output = null)
    {
        this.sendWork({
            action: 'terminate',
            status: 'completed',
            output: (output) ? JSON.stringify(output) : null,
            duration: 0
        });
    }

    failWorker(e) {
        this.sendWork({
            action: 'terminate',
            status: 'zenatonFailed',
            error_code: 0,
            error_message: e.message,
            error_name: e.name,
            error_stacktrace: e.stack,
            failed_at: Date.now()
        });
    }

    failWork(e) {
        this.sendWork({
            action: 'terminate',
            status: 'failed',
            error_code: 0,
            error_message: (e.message) || null,
            error_name: e.name || e,
            error_stacktrace: e.stack || null,
            failed_at: Date.now()
        });
    }


    microServerUrl(ressource)
    {
        const url = (process.env.ZENATON_WORKER_PORT) ? 'http://localhost:' + process.env.ZENATON_WORKER_PORT : MICROSERVER_URL;
        return url + ressource;
    }
}

module.exports = Microserver;
