define(function (require, exports, module) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        Person = require('./person'),
        cache = require('../common/cache.js');

    return Backbone.Collection.extend({

        initialize:function () {
            console.log("init collection");

        },

        model:Person


    });
});