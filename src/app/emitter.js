/*jslint browser: true */

'use strict';

var createEmitter = function () {
    var Emitter = {};
    var callbacks = {};

    Emitter.emit = function (name, args) {
        if (callbacks[name] === undefined) {
            return;
        }
        var cbArgs = args || [];
        var i;
        for (i = 0; i < callbacks[name].length; i += 1) {
            callbacks[name][i].apply(window, args);
        }
    };

    Emitter.on = function (eventName, cb) {
        if (callbacks[eventName] === undefined) {
            callbacks[eventName] = [];
        }
        callbacks[eventName].push(cb);
    };

    return Emitter;
};

module.exports = {
    create: createEmitter
};

