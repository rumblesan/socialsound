/*jslint browser: true */

'use strict';


var createSequencer = function () {

    var Seq = {};

    var state = {};
    state.callbacks = {
        start: [],
        stop: [],
        step: [],
        bpmchange: [],
    };
    state.bpm = 120;
    state.noteLength = (1/4);
    state.timer = null;

    // return time between steps in ms
    var calcInterval = function () {
        return ((60 / state.bpm) * state.noteLength) * 1000;
    };

    var triggerEvent = function (name, args) {
        var cbArgs = args || [];
        var i;
        for (i = 0; i < state.callbacks[name].length; i += 1) {
            state.callbacks[name][i].apply(window, args);
        }
    };

    var sequence = function () {
        triggerEvent('step');
        var interval = calcInterval();
        state.timer = setTimeout(
            function () {
                sequence();
            },
            calcInterval()
        );
    };

    Seq.start = function () {
        triggerEvent('start');
        sequence();
    };

    Seq.stop = function () {
        triggerEvent('stop');
        clearTimeout(state.timer);
    };

    Seq.setBpm = function (newBpm) {
        state.bpm = newBpm;
        triggerEvent('bpmchange', [newBpm]);
    };

    Seq.on = function (eventName, cb) {
        if (state.callbacks[eventName] === undefined) {
            state.callbacks[eventName] = [];
        }
        state.callbacks[eventName].push(cb);
    };

    return Seq;
};

module.exports = {
    create: createSequencer
};

