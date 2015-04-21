/*jslint browser: true */
/*global require, Processing */

var $ = require('./lib/jquery-2.1.3');
var App = require('./app/app');
var Seq = require('./app/sequencer');

$(function () {

    var canvas = document.getElementById('display');

    var sequencer = Seq.create();
    var app = App.create();

    sequencer.on('step', function () {
        app.nextBeat();
    });

    sequencer.on('stop', function () {
        app.stop();
    });

    sequencer.setBpm(120);

    var processingInstance = new Processing(canvas, app.sketch);

    window.app = app;
    window.sequencer = sequencer;

});

