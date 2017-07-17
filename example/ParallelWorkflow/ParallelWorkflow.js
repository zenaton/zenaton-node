var Zenaton = require('../../lib/Worker');

var getPriceFromProviderA = require('./GetPriceFromProviderA');
var getPriceFromProviderB = require('./GetPriceFromProviderB');
var orderFromProviderA = require('./OrderFromProviderA');
var orderFromProviderB = require('./OrderFromProviderB');

var parallelWorkflow = new Zenaton.Workflow({
    name: 'ParallelWorkflow',
    handle: function() {
        var [priceA, priceB] = execute(
            getPriceFromProviderA(),
            getPriceFromProviderB()
        );

        if (priceA < priceB) {
            execute(orderFromProviderA({item: this.item}));
        } else {
            execute(orderFromProviderB({item: this.item}));
        }
    }
});

module.exports = parallelWorkflow;
