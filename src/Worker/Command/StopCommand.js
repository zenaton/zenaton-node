import chalk from 'chalk';

import Command from './Command';
import Microserver from './../Microserver';

const log = console.log;
const error = chalk.bold.red;
const success = chalk.green;

class StopCommand extends Command {
    constructor(){
        super();
        this.microserver = new Microserver();

    }

    execute(env) {
        let envFile = null;

        // Get and check --env option
        envFile = this.getEnvOption(env);
        if (!envFile) {
            return;
        }

        // Load env file and check app_id, app_env and app_token parameters.
        this.loadEnvFile(envFile);
        if (!this.checkEnvAppParameters(env)) {
            return
        }

        const feedback = this.stop();

        (feedback.error) ? log(error(feedback.error)) : log(success(feedback.msg));
    }

    stop() {

        const body = {
            app_id: process.env.ZENATON_APP_ID,
            api_token: process.env.ZENATON_API_TOKEN,
            app_env: process.env.ZENATON_APP_ENV,
            programming_language: 'Javascript'
        };

        return this.microserver.stop(body);
    }
}

module.exports = StopCommand;
