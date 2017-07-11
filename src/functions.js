
import Helpers from './Worker/Helpers';

if (typeof global.execute !== "function") {
    global.execute = function() {
        console.log("ici");
        console.log(arguments);
    };
}

    // function execute()
    // const execute = () => {
    //     return new (Helpers()).doExecute(arguments, true)
    // }
// }
//
// if (! typeof executeAsync === "function") {
//     const executeAsync = () => {
//         return new (Helpers()).doExecute(arguments, false)
//     }
// }
