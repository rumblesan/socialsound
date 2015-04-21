/*jslint browser: true */
/*global require, Processing */

var $ = require('./lib/jquery-2.1.3');
var App = require('./app/app');

$(function () {

    var canvas = document.getElementById('display');

    var app = App.create();

    var processingInstance = new Processing(canvas, app.sketch);

    console.log('loaded');

});

