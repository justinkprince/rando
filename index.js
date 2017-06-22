'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.8bd7344c-9f07-4291-ad1d-77bb5fb30b57';
const defaults = {
    min: 1,
    max: 100,
};

function rando(min, max) {
    let seed = Math.random();
    let multiplier = max - min + 1;

    return parseInt(Math.floor(seed * (max - min + 1))) + parseInt(min);
}

function getSlot(intent, slotName) {
    if (intent.slots && intent.slots[slotName]) {
        return intent.slots[slotName].value;
    }
}

const handlers = {
    'RandoIntent': function () {
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

        // If the numbers are reversed, invert them.
        if (minSlot > maxSlot) {
            let realMin = maxSlot;
            maxSlot = minSlot;
            minSlot = realMin;
        }

        console.log(minSlot, maxSlot);

        this.emit(':tell', rando(minSlot, maxSlot));
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);

    if ('undefined' === typeof process.env.DEBUG) {
        alexa.appId = APP_ID;
    }

    alexa.registerHandlers(handlers);
    alexa.execute();
};
