import chalk from 'chalk';
import _ from 'lodash';

import Command from './Command';
import Microserver from './../Microserver';

const log = console.log;
const error = chalk.bold.red;
const success = chalk.green;

class StatusCommand extends Command {
    constructor(){
        super();
        this.microserver = new Microserver();

    }

    execute() {
        const feedback = this.status();

        _.each(feedback.msg, (m) => {
            log(success(m));
        });

        return;
    }

    status() {
        return this.microserver.status();
    }
}

module.exports = StatusCommand
