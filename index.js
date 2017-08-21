'use strict';

const Alexa = require('alexa-sdk');

// An application ID provided by Amazon should be added here.
const APP_ID = null;

const defaults = {
    min: 1,
    max: 100,
};

function random(min, max) {
    // Random seed.
    let seed = Math.random();
    // Range multiplier.
    let multiplier = max - min + 1;
    // Apply multiplier to seed and cast to integer.
    let random = parseInt(Math.floor(seed * multiplier));
    // Cast to integer for safety.
    let minOffset = parseInt(min);
    // Adjust the random number to be within range parameters.
    let offsetAdjustedRandomInt = random + minOffset;

    return offsetAdjustedRandomInt;
}

// Convenience function for fetching nested obj vars without errors and
// intensive validation.
function getSlot(intent, slotName) {
    if (intent && intent.slots && intent.slots[slotName]) {
        if (intent.slots[slotName].value && intent.slots[slotName].value != '?') {
            return intent.slots[slotName].value;
        }
    }
}

const handlers = {
    'LaunchRequest': function () {
        this.emit('RandoIntent');
    },
    'RandoIntent': function () {
        this.emit('GenerateRandomNumber');
    },
    'GenerateRandomNumber': function () {
        let intent = this.event.request.intent;
        let minSlot = getSlot(intent, 'Minimum');
        let maxSlot = getSlot(intent, 'Maximum');

        // If the minimum slot is more than the default max, then
        // increase the max to 10x min.
        if (minSlot && !maxSlot) {
            maxSlot = minSlot * 10;
        }

        minSlot = minSlot || defaults.min;
        maxSlot = maxSlot || defaults.max;

        // If the arguments are reversed, invert them.
        if (minSlot > maxSlot) {
            let realMin = maxSlot;
            maxSlot = minSlot;
            minSlot = realMin;
        }

        let randomNumber = random(minSlot, maxSlot);

        this.emit(':tell', randomNumber);
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);

    if (APP_ID && 'undefined' === typeof process.env.DEBUG) {
        alexa.APP_ID = APP_ID;
    }

    alexa.registerHandlers(handlers);
    alexa.execute();
};
