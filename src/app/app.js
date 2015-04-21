/*jslint browser: true */
/*global require, module */

'use strict';

var createApp = function () {
    var App = {};

    var conf = {};

    App.sketch = function (p) {

        p.setup = function () {
            p.size(640, 480);
            p.background(0);
            p.println("running");
        };

        p.draw = function () {
            p.background(0);
            var centerX = p.width / 2,
                centerY = p.height / 2;
            p.line(centerX, centerY, 0, 0);
        };

    };

    return App;
};

module.exports = {
    create: createApp
};

