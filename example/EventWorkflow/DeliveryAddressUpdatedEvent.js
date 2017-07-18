var Zenaton = require('../../lib/Worker');

var deliveryAddressUpdatedEvent = new Zenaton.Event({
    name: 'DeliveryAddressUpdatedEvent'
});

module.exports = deliveryAddressUpdatedEvent;
