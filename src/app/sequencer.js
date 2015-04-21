/*jslint browser: true */
/*global require */

'use strict';

var Emitter = require('./emitter');

var createSequencer = function () {

    var Seq = {};
    var emitter = Emitter.create();

    var state = {};
    state.callbacks = {};
    state.bpm = 120;
    state.noteLength = (1/4);
    state.timer = null;

    // return time between steps in ms
    var calcInterval = function () {
        return ((60 / state.bpm) * state.noteLength) * 1000;
    };


    var sequence = function () {
        emitter.emit('step');
        var interval = calcInterval();
        state.timer = setTimeout(
            function () {
                sequence();
            },
            calcInterval()
        );
    };

    Seq.start = function () {
        emitter.emit('start');
        sequence();
    };

    Seq.stop = function () {
        emitter.emit('stop');
        clearTimeout(state.timer);
    };

    Seq.setBpm = function (newBpm) {
        state.bpm = newBpm;
        emitter.emit('bpmchange', [newBpm]);
    };

    Seq.on = function (eventName, cb) {
        emitter.on(eventName, cb);
    };

    return Seq;
};

module.exports = {
    create: createSequencer
};

