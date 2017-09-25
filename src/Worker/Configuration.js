import dotenv from 'dotenv';
import path from 'path';
import _ from 'lodash';

import Microserver from './Microserver';
import TaskManager from './TaskManager';
import WorkflowManager from './WorkflowManager';
import { ExternalZenatonException } from '../Common/Exceptions';

class Configuration {
    constructor(env = null, source = null) {
        this.microserver = new Microserver();
        this.taskManager = new TaskManager();
        this.workflowManager = new WorkflowManager();
        this.env = env;
        this.source = source;
    }

    startMicroserver()
    {

        let workflowsNamesOnly, workflowsNamesToExcept, tasksNamesOnly, tasksNamesToExcept;

        this.checkCredentials();

        // Load the source to have access to the workflow class && task class
        // Useful for Handle_ONLY and EXCEPT
        require(process.cwd() + '/' + this.source);

        if (process.env.ZENATON_HANDLE_ONLY) {
            [workflowsNamesOnly, tasksNamesOnly] = this.verifyClass(process.env.ZENATON_HANDLE_ONLY);
        }

        if (process.env.ZENATON_HANDLE_EXCEPT ) {
            [workflowsNamesToExcept, tasksNamesToExcept] = this.verifyClass(process.env.ZENATON_HANDLE_EXCEPT);
        }

        const body = {
            app_id: process.env.ZENATON_APP_ID,
            api_token: process.env.ZENATON_API_TOKEN,
            app_env: process.env.ZENATON_APP_ENV,
            api_url: process.env.ZENATON_API_URL || 'https://zenaton.com/api',
            concurrent_max: process.env.ZENATON_CONCURRENT_MAX || 100,
            workflows_name_only:  workflowsNamesOnly || [],
            tasks_name_only:  tasksNamesOnly || [],
            workflows_name_except: workflowsNamesToExcept || [],
            tasks_name_except: tasksNamesToExcept || [],
            // worker_script: process.cwd() + '/scripts/slave.js',
            worker_script: process.cwd() + '/node_modules/zenaton-javascript/scripts/slave.js',
            autoload_path: process.cwd() + '/' + this.source,
            programming_language: 'Javascript'
        };

        console.log(this.microserver.sendEnv(body));
        // return this.microserver.sendEnv(body);
    }

    stopMicroserver()
    {
        this.checkCredentials();

        const body = {
            app_id: process.env.ZENATON_APP_ID,
            api_token: process.env.ZENATON_API_TOKEN,
            app_env: process.env.ZENATON_APP_ENV,
            programming_language: 'Javascript'
        };

        this.microserver.stop(body);
    }

    checkCredentials() {
        dotenv.config({path: path.dirname(this.env) + '/' + path.basename(this.env) })

        if ( ! process.env.ZENATON_APP_ID) {
            throw new Error('Error! Environment variable ZENATON_APP_ID not set');
        }

        if ( ! process.env.ZENATON_API_TOKEN) {
            throw new Error('Error! Environment variable ZENATON_API_TOKEN not set');
        }

        if ( ! process.env.ZENATON_APP_ENV) {
            throw new Error('Error! Environment variable ZENATON_APP_ENV not set');
        }
    }

    verifyClass(request)
    {
        const workflowsNames = [];
        const tasksNames = [];
        const classes = request.trim().split(',');

        _.each(classes, (c) => {
            if (this.workflowManager.getWorkflow(c)) {
                workflowsNames.push(c);
            } else if (this.taskManager.getTaskByName(c)) {
                tasksNames.push(c);
            } else {
                throw new ExternalZenatonException('Invalid name provided ' + c + ' - must be a Zenaton.Task or Zenaton.Workflow ');
            }
        });

        return [workflowsNames, tasksNames];
    }

    status() {
        return this.microserver.status();
    }
}

module.exports = Configuration;
