
import Helpers from './Worker/Helpers';

if (typeof global.execute !== "function") {
    global.execute = (...tasks) => {
        return (new Helpers()).doExecute(tasks, true)
    };
}


if (typeof global.executeAsync !== "function") {
    global.executeAsync = (...tasks) => {
        return (new Helpers()).doExecute(tasks, false)
    }
}
