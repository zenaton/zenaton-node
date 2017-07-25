import dotenv from 'dotenv';
import path from 'path';

import Microserver from './Microserver';

class Configuration {
    constructor(env = null, source = null) {
        this.microserver = new Microserver();
        this.env = env;
        this.source = source;
    }

    startMicroserver()
    {


        this.checkCredentials();

        // if (! process.env.ZENATON_HANDLE_ONLY ) {
        //     [workflowsNamesOnly, tasksNamesOnly] = this.verifyClass(process.env.ZENATON_HANDLE_ONLY);
        // }
        //
        // if (! process.env.ZENATON_HANDLE_EXCEPT ) {
        //     [workflowsNamesToExcept, tasksNamesToExcept] = this.verifyClass(process.env.ZENATON_HANDLE_EXCEPT);
        // }

        if (! process.env.ZENATON_CONCURRENT_MAX ) {
            const concurrentMax = process.env.ZENATON_CONCURRENT_MAX;
        }

        const body = {
            app_id: process.env.ZENATON_APP_ID,
            api_token: process.env.ZENATON_API_TOKEN,
            app_env: process.env.ZENATON_APP_ENV,
            concurrent_max: process.env.ZENATON_CONCURRENT_MAX || 100,
            workflows_name_only:  [],
            tasks_name_only:  [],
            workflows_name_except:  [],
            tasks_name_except:  [],
            // worker_script: process.cwd() + '/scripts/slave.js',
            worker_script: process.cwd() + '/node_modules/zenaton-javascript/scripts/slave.js',
            autoload_path: process.cwd() + '/' + this.source,
            programming_language: 'Javascript'
        };


        this.microserver.sendEnv(body)
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

    }

    status() {
        return this.microserver.status();
    }
}

module.exports = Configuration;
