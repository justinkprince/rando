'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.8bd7344c-9f07-4291-ad1d-77bb5fb30b57';

function rando() {
    return Math.ceil(Math.random() * 100);
}

const handlers = {
    'RandoIntent': function () {
        this.emit(':tell', rando());
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = 'help';
        this.attributes.repromptSpeech = 'reprompt';
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', 'stop');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    //alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
