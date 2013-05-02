define(function(require, exports, module) {
  var Backbone = require('backbone'),
    $ = require('zepto'),
    _ = require('underscore'),
    h5_comm = require('h5_comm'),
    loading = require('../ui/loading'),
    mtop = require('../common/mtopForAllspark.js'),
    pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');


    var CommentModel = require('./commentModel')

    var RecCommentView = Backbone.View.extend({

      el: '#content',

      model: new CommentModel(),

      events: {
      },

      goRecComment: function() {

      }
    })

    return RecCommentView
});