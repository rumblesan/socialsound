
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

var createAudioSystem = function(audioContext) {

    var AudioSystem = {};

    AudioSystem.createVoice = function () {

        var env = {};
        env.attack = 0.1;
        env.release = 0.2;

        var osc = audioContext.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 440;
        osc.start();

        var filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 1.2;

        var amp = audioContext.createGain();
        amp.gain.value = 0;

        osc.connect(filter);
        filter.connect(amp);

        var voice = {};

        voice.outputNode = amp;

        voice.play = function (freq, length) {
            console.log('playing', freq, length);
            osc.frequency.value = freq;
            var gainParam = amp.gain;
            gainParam.linearRampToValueAtTime(
                1,
                audioContext.currentTime + env.attack
            );
            gainParam.linearRampToValueAtTime(
                1,
                audioContext.currentTime + length
            );
            gainParam.linearRampToValueAtTime(
                0,
                audioContext.currentTime + length + env.release
            );
        };

        return voice;
    };

    AudioSystem.connectVoices = function(voices) {
        var i;
        for (i = 0; i < voices.length; i += 1) {
            voices[i].outputNode.connect(audioContext.destination);
        }
    };

    return AudioSystem;
};

module.exports = {
    createContext: createContext,
    createAudio: createAudioSystem
};


