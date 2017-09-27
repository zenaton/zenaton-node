import chalk from 'chalk';

import Command from './Command';
import Microserver from './../Microserver';

const log = console.log;
const error = chalk.bold.red;
const success = chalk.green;

class StartCommand extends Command {
    constructor() {
        super();
        this.microserver = new Microserver();
    }

    execute(env, boot) {
        let envFile = null;
        let bootFile = null;

        // Get and check --env option
        envFile = this.getEnvOption(env);
        if (!envFile) {
            return;
        }

        // Get and check --autoload option
        bootFile = this.getBootOption(boot);
        if (!bootFile) {
            return;
        }

        // Load env file and check app_id, app_env and app_token parameters.
        this.loadEnvFile(envFile);
        if (!this.checkEnvAppParameters(env)) {
            return
        }
        // Load boot file and check ZENATON_HANDLE_EXCEPT and ZENATON_HANDLE_ONLY parameters.
        this.loadBootFile(bootFile);
        if (!this.checkEnvHandleParameters()) {
            return;
        }

        if (!this.checkConcurrentMaxParameter()) {
            return;
        }

        const feedback = this.start(bootFile);

        (feedback.error) ? log(error(feedback.error)) : log(success(feedback.msg));
    }

    start(bootFile) {
        const body = {
            app_id: process.env.ZENATON_APP_ID,
            api_token: process.env.ZENATON_API_TOKEN,
            app_env: process.env.ZENATON_APP_ENV,
            api_url: process.env.ZENATON_API_URL || 'https://zenaton.com/api',
            concurrent_max: this.getConcurrentMaxParameter(),
            workflows_name_only: this.getClassNamesByTypeFromEnv('ZENATON_HANDLE_ONLY', 'workflow'),
            tasks_name_only:  this.getClassNamesByTypeFromEnv('ZENATON_HANDLE_ONLY', 'task'),
            workflows_name_except: this.getClassNamesByTypeFromEnv('ZENATON_HANDLE_EXCEPT', 'workflow'),
            tasks_name_except: this.getClassNamesByTypeFromEnv('ZENATON_HANDLE_EXCEPT', 'task'),
            // worker_script: process.cwd() + '/scripts/slave.js',
            worker_script: process.cwd() + '/node_modules/zenaton-javascript/scripts/slave.js',
            autoload_path: bootFile,
            programming_language: 'Javascript'

        }

        return this.microserver.sendEnv(body);
    }
}

module.exports = StartCommand;
