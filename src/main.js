/*jslint browser: true */
/*global require, Processing, Pusher, initialState */

var $ = require('./lib/jquery-2.1.3');
var Grid = require('./app/grid');
var Seq = require('./app/sequencer');
var Audio = require('./app/audiosystem');

$(function () {

    var canvas = document.getElementById('display');

    var ctx = Audio.createContext(window);

    var pusher = new Pusher(initialState.pusherKey);
    var channel = pusher.subscribe(initialState.seqId);
    channel.bind('button', function (data) {
        grid.setButtonState(data.row, data.column, data.state);
    });

    channel.bind('bpm', function (data) {
        sequencer.setBpm(data.bpm);
    });

    var audio = Audio.createAudio(ctx);

    var sequencer = Seq.create();
    var grid = Grid.create();

    sequencer.on('step', function () {
        grid.nextBeat();
    });

    var b;
    var xCoord, yCoord, data;
    for (b = 0; b < initialState.buttonInfo.length; b += 1) {
        data = initialState.buttonInfo[b][0].split(",");
        xCoord = data[0];
        yCoord = data[1];
        grid.setButtonState(xCoord, yCoord, 1);
    }

    sequencer.on('stop', function () {
        grid.stop();
    });

    sequencer.setBpm(initialState.bpm);

    var voiceNum = 12;
    var voices = [];
    var v;
    for (v = 0; v < voiceNum; v += 1) {
        voices.push(audio.createVoice())
    }
    audio.connectVoices(voices);

    grid.on('play', function (note) {
        var n = note + 60; // increase octave, 60 is middle C
        var f = Math.pow(2, ((n - 69)/12)) * 440;
        voices[note].play(f, 1);
    });

    grid.on('buttonpress', function (x, y, v) {
        $.ajax({
            method: 'POST',
            url: '/sequencer/' + initialState.seqId + '/button/press',
            contentType: "application/json",
            data: JSON.stringify({
                row: x,
                column: y,
                state: v
            })
        });
    });

    sequencer.on('bpmchange', function (newBpm) {

        $.ajax({
            method: 'POST',
            url: '/sequencer/' + initialState.seqId + '/bpm',
            contentType: "application/json",
            data: JSON.stringify({
                bpm: newBpm
            })
        });
    });

    var processingInstance = new Processing(canvas, grid.sketch);

    window.grid = grid;
    window.sequencer = sequencer;

});

