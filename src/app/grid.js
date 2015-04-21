/*jslint browser: true */
/*global require, module */

'use strict';

var Emitter = require('./emitter');

var createGrid = function () {
    var Grid = {};
    var emitter = Emitter.create();

    var conf = {};
    conf.canvasX = 1024;
    conf.canvasY = 768;
    conf.beats = 16;
    conf.notes = 12;
    conf.noteStates = {};
    conf.buttonWidth = conf.canvasX / conf.beats;
    conf.buttonHeight = conf.canvasY / conf.notes;

    conf.seqBeat = 0;

    var setupState = function () {
        var x, y, poskey;
        for (x = 0; x < conf.beats; x += 1) {
            for (y = 0; y < conf.notes; y += 1) {
                poskey = [x, y];
                conf.noteStates[poskey] = 0;
            }
        }
    };
    setupState();

    Grid.setSeqBeat = function (b) {
        conf.seqBeat = b;
    };

    Grid.setButtonState = function (buttonX, buttonY, newValue) {
        conf.noteStates[[buttonX, buttonY]] = newValue;
    };

    Grid.stop = function () {
        conf.seqBeat = -1;
    };

    Grid.nextBeat = function () {
        conf.seqBeat += 1;
        if (conf.seqBeat >= conf.beats) {
            conf.seqBeat = 0;
        }
        var x, y;
        x = conf.seqBeat;
        for (y = 0; y < conf.notes; y += 1) {
            if (conf.noteStates[[x, y]] === 1) {
                // flip the note numbers then
                // subtract the extra 1 so that
                // the bottom note is zero
                emitter.emit('play', [(conf.notes - y) - 1]);
            }
        }
    };

    Grid.sketch = function (p) {

        var drawButton = function (x, y) {
            if (conf.noteStates[[x, y]] === 1) {
                p.fill(220, 100, 0);
            } else {
                p.fill(0, 100, 0);
            }
            var posX = (x * conf.buttonWidth);
            var posY = (y * conf.buttonHeight);
            p.rect(posX, posY, conf.buttonWidth, conf.buttonHeight, 5);
        };

        p.setup = function () {
            p.size(conf.canvasX, conf.canvasY);
            p.background(0);
        };

        p.draw = function () {
            p.background(255);

            var y, x;
            for (x = 0; x < conf.beats; x += 1) {
                if (x === conf.seqBeat) {
                    p.stroke(255, 0, 0);
                } else {
                    p.stroke(0, 0, 0);
                }
                for (y = 0; y < conf.notes; y += 1) {
                    drawButton(x, y);
                }
            }

        };

        p.mouseClicked = function () {
            var buttonX = Math.floor(p.mouseX / conf.buttonWidth);
            var buttonY = Math.floor(p.mouseY / conf.buttonHeight);
            var newValue;
            if (conf.noteStates[[buttonX, buttonY]]) {
                newValue = 0;
            } else {
                newValue = 1;
            }
            conf.noteStates[[buttonX, buttonY]] = newValue;
            emitter.emit('buttonpress', [buttonX, buttonY, newValue]);
        };

    };

    Grid.on = function (eventName, cb) {
        emitter.on(eventName, cb);
    };

    return Grid;
};

module.exports = {
    create: createGrid
};

