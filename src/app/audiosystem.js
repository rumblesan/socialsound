
'use strict';

var createContext = function (w) {
    var context;
    try {
        // Fix up for prefixing
        w.AudioContext = w.AudioContext||w.webkitAudioContext;
        context = new w.AudioContext();
    } catch(e) {
        throw new Error("WebAudio API not available");
    }
    return context;
};

var createAudioSystem = function() {
};

module.exports = {
    createContext: createContext,
    createAudio: createAudioSystem
};


