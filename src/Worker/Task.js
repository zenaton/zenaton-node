import _ from 'lodash';
import { ExternalZenatonException, objectsHaveSameKeys } from '../Common/index';
import TaskManager from './TaskManager';

export default class Task {

    constructor(task = null) {

        const taskManager = new TaskManager();

        // this.task = task;
        // this.task.data = {};

        this.data = {};

        _.each(task, (p, k) => {
            this[k] = p;
        });

        taskManager.setTask(this);

        const dataSetter = (data = null) => {
            if (data) {
                this.setData(data);
            }
            return this;
        }

        return dataSetter;
    }

    setData(data) {
        _.each(data, (p, k ) => {
            this.data[k] = p;
            this[k] = p;
        });
    }
}
