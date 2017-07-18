var Zenaton = require('../../lib/Worker');

var orderCanceledEvent = new Zenaton.Event({
    name: 'OrderCanceledEvent'
});

module.exports = orderCanceledEvent;
