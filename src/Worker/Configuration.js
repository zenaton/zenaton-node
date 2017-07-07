import dotenv from 'dotenv';
import path from 'path';

import Microserver from './Microserver';

export default class Configuration {
    constructor(env, source) {
        this.microserver = new Microserver();
        this.env = env;
        this.source = source;
    }

    sendBackToMicroServer()
    {
        dotenv.config({path: path.dirname(this.env) + '/' + path.basename(this.env) })

        if ( ! process.env.ZENATON_APP_ID) {
            return 'Error! Environment variable ZENATON_APP_ID not set';
        }

        if ( ! process.env.ZENATON_API_TOKEN) {
            return 'Error! Environment variable ZENATON_API_TOKEN not set';
        }

        if ( ! process.env.ZENATON_APP_ENV) {
            return 'Error! Environment variable ZENATON_APP_ENV not set';
        }

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
            worker_script: process.cwd() + '/../slave.js',
            autoload_path: process.cwd() + this.source,
            programming_language: 'Javascript'
        };

        this.microserver.sendEnv(body)
    }

    verifyClass(request)
    {

    }
}
