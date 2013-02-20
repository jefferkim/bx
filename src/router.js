define(function(require, exports, module) {
  var $ = require('zepto'),
      _ = require('underscore'),
      Backbone = require('backbone');

  var Router = Backbone.Router.extend({

    routes: {
      '': 'index',
      'home': 'index',
      'detail/:snsId/:feedId': 'detail',
      'comment/:snsId/:feedId/:page': 'comment'
    },

    index: function() {

    },

    detail: function(snsId, feedId) {

    },

    comment :function(snsId, feedId, page) {
      page = page || 1;
    },

    start: function() {
      Backbone.history.start();
      console.log('start routing.')
    }

  });

  return new Router();

});