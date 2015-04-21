/*jslint browser: true */
/*global require, Processing */

var $ = require('./lib/jquery-2.1.3');
var Grid = require('./app/grid');
var Seq = require('./app/sequencer');

$(function () {

    var canvas = document.getElementById('display');

    var sequencer = Seq.create();
    var grid = Grid.create();

    sequencer.on('step', function () {
        grid.nextBeat();
    });

    sequencer.on('stop', function () {
        grid.stop();
    });

    sequencer.setBpm(120);

    var processingInstance = new Processing(canvas, grid.sketch);

    window.grid = grid;
    window.sequencer = sequencer;

});

