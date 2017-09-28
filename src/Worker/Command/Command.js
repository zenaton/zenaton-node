import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';


import TaskManager from './../TaskManager';
import WorkflowManager from './../WorkflowManager';

const log = console.log;
const error = chalk.bold.red;
const info = chalk.bold.green;

class Command {
    constructor() {
        this.taskManager = new TaskManager();
        this.workflowManager = new WorkflowManager();
    }

    getEnvOption(envFile) {

        let usingDefault = false;
        if (!envFile) {
            envFile = '.env';
            usingDefault = true
        }

        if (!this.isAbsolutePath(envFile)) {
            envFile = process.cwd() + '/' + envFile;
        }

        if (!fs.existsSync(envFile)) {
            if (usingDefault) {
                log(error('Please locate your env file with --env option'));
            } else {
                log(error(`Unable to find ${envFile} file`));
            }

            return false;
        }

        return envFile;
    }

    getBootOption(bootFile) {
        let usingDefault = false;

        if (!bootFile) {
            bootFile = 'boot.js'
            usingDefault = true;
        }

        if (!this.isAbsolutePath(bootFile)) {
            bootFile = process.cwd() + '/' + bootFile;
        }

        if (!fs.existsSync(bootFile)) {
            if (usingDefault) {
                log(error('Please locate your boot file with --boot option'));
            } else {
                log(error(`Unable to find ${bootFile} file`));
            }

            return false;
        }

        return bootFile;
    }

    loadEnvFile(envFile) {
        dotenv.config({path: envFile });
    }

    loadBootFile(bootFile) {
        require(bootFile);
    }

    checkEnvAppParameters() {
        const appId = process.env.ZENATON_APP_ID;
        if (!appId) {
            log(error('Error ! Environment variable ZENATON_APP_ID not set.'));
            return false;
        }

        const apiToken = process.env.ZENATON_API_TOKEN;
        if (!apiToken) {
            log(error('Error ! Environment variable ZENATON_API_TOKEN not set.'));
            return false;
        }

        const appEnv = process.env.ZENATON_APP_ENV;
        if (!appEnv) {
            log(error('Error ! Environment variable ZENATON_APP_ENV not set.'));
            return false;
        }

        return true;
    }


    checkEnvHandleParameters() {
        const only = process.env.ZENATON_HANDLE_ONLY;
        if (only) {
            if (!this.checkClassTypeFromEnv('ZENATON_HANDLE_ONLY')) {
                return false;
            }
        }

        const except = process.env.ZENATON_HANDLE_EXCEPT;
        if (except) {
            if (!this.checkClassTypeFromEnv('ZENATON_HANDLE_EXCEPT')) {
                return false;
            }
        }

        return true;
    }

    checkConcurrentMaxParameter() {
        const max = process.env.ZENATON_CONCURRENT_MAX;
        if (max) {
            if (!isFinite(max)) {
                // Is not a  number
                log(error('Error ! Invalid value in ZENATON_CONCURRENT_MAX env variable - must be an integer.'));
                return false;
            }
            if (parseInt(max) <= 0) {
                log(error('Error ! Invalid value in ZENATON_CONCURRENT_MAX env variable - must be an integer > 0.'));
                return false;
            }
        }
        return true;
    }

    getConcurrentMaxParameter() {
        const max = process.env.ZENATON_CONCURRENT_MAX;
        if (max) {
            return parseInt(max);
        }
        return 100;
    }

    isAbsolutePath(file) {
        return /^(?:\/|[a-z]+:\/\/)/.test(file);
    }

    checkClassTypeFromEnv(key) {

        const classes = process.env[key].trim().split(',');

        const checktype = (c) => {
            return (this.workflowManager.getWorkflow(c) || this.taskManager.getTaskByName(c)) ? true : false;
        };

        if (_.every(_.map(classes, checktype), true)) {
            return false;
        }

        return true;
    }

    getClassNamesByTypeFromEnv(key, type) {
        let names = [];
        const classes = (process.env[key]) ? process.env[key].trim().split(',') : [];

        if (type === 'task') {
            _.each(classes, (c) => {
                if (this.taskManager.getTaskByName(c)) {
                    names.push(c);
                }
            });
        } else {
            _.each(classes, (c) => {
                if (this.workflowManager.getWorkflow(c)) {
                    names.push(c);
                }
            });
        }

        return names;
    }
}

module.exports = Command;
