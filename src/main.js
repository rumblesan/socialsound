/*jslint browser: true */
/*global require, Processing */

var $ = require('./lib/jquery-2.1.3');
var App = require('./app/app');

$(function () {

    document.body = document.createElement('body');

    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'sequencer');
    canvas.setAttribute('width', '640');
    canvas.setAttribute('height', '480');

    document.body.appendChild(canvas);

    var app = App.create();

    var processingInstance = new Processing(canvas, app.sketch);

    console.log('loaded');

});

