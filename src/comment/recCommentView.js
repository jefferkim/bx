define(function(require, exports, module) {
  var Backbone = require('backbone'),
    $ = require('zepto'),
    _ = require('underscore'),
    h5_comm = require('h5_comm'),
    loading = require('../ui/loading'),
    mtop = require('../common/mtopForAllspark.js'),
    pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');

    var recCommentHeaderTemplate = _.template($('#recComment_header_tpl').html())
    var CommentModel = require('./commentModel')

    var RecCommentView = Backbone.View.extend({

      el: '#RecCommentPage',

      model: new CommentModel(),

      events: {
        'click .reply-button': 'newComment',
      },

      initialize: function() {
        var self = this
        this.$container = $('#RecCommentPage')
        this.model.on('change:replyList', function() { console.log(self.model.get('replyList')) })
      },

      goRecComment: function() {
        $('header.navbar').html(recCommentHeaderTemplate({ href: '#index' }))

        this.model.getReplyList({curPage:1,pageSize:24,direction:1,timestamp:0});
      },

      newComment: function() {

      }
    })

    return RecCommentView
});