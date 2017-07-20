var Zenaton = require('../../lib/Worker');
var Wait = require('../../lib/Worker/Tasks/Wait');
var WaitWhile = require('../../lib/Worker/Tasks/WaitWhile');
var Wait = require('../../lib/Worker/Tasks/Wait');

var waitWorkflow = new Zenaton.Workflow({
    name: 'WaitWorkflow',
    handle: function() {

        execute((new Wait().seconds(15)));
    }
});

module.exports = waitWorkflow;
