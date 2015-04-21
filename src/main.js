/*jslint browser: true */
/*global require, Processing, Pusher */

var $ = require('./lib/jquery-2.1.3');
var Grid = require('./app/grid');
var Seq = require('./app/sequencer');
var Audio = require('./app/audiosystem');

$(function () {

    var canvas = document.getElementById('display');

    var ctx = Audio.createContext(window);

    var audio = Audio.createAudio(ctx);

    var sequencer = Seq.create();
    var grid = Grid.create();

    sequencer.on('step', function () {
        grid.nextBeat();
    });

    sequencer.on('stop', function () {
        grid.stop();
    });

    sequencer.setBpm(120);

    var voiceNum = 12;
    var voices = [];
    var v;
    for (v = 0; v < voiceNum; v += 1) {
        voices.push(audio.createVoice())
    }
    audio.connectVoices(voices);

    var playFunc = function (note) {
        var n = note + 60; // increase octave, 60 is middle C
        var f = Math.pow(2, ((n - 69)/12)) * 440;
        console.log('playing note', note, n, f);
        voices[note].play(f, 1);
    };
    grid.setPlayFunc(playFunc);

    var processingInstance = new Processing(canvas, grid.sketch);

    window.grid = grid;
    window.sequencer = sequencer;

});

