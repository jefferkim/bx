define(function(require, exports, module) {
  var $ = require('zepto'),
      _ = require('underscore'),
      Backbone = require('backbone');

  var Router = Backbone.Router.extend({

    routes: {
      '': 'index',
      'home': 'index'
    },

    index: function() {

    },

    start: function() {
      Backbone.history.start();
      console.log('start routing.')
    }

  });

  return new Router();

});