define(function(require, exports, module) {
  var Backbone = require('backbone'),
    $ = require('zepto'),
    _ = require('underscore'),
    h5_comm = require('h5_comm'),
    loading = require('../ui/loading'),
    mtop = require('../common/mtopForAllspark.js'),
    pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');

    var notification = require('../ui/notification.js')
    var recCommentTemplate = _.template($('#rec_comment_tpl').html())
    var recCommentHeaderTemplate = _.template($('#recComment_header_tpl').html())
    var CommentModel = require('./commentModel')

    var RecCommentView = Backbone.View.extend({

      el: '#RecCommentPage',

      model: new CommentModel(),

      events: {
        'click .reply-button': 'newComment',
      },

      initialize: function() {
        this.$container = $('#RecCommentPage')
        this.model.on('change:replyList', this.renderComment, this)
      },

      goRecComment: function(page) {

        this.page = page

        $('header.navbar').html(recCommentHeaderTemplate({ href: '#index' }))

        this.model.getReplyList({curPage:1,pageSize:24,direction:1,timestamp:0});
      },

      newComment: function(e) {
        var button = e.target
        if (h5_comm.isLogin()) {
          window.commentData = {
            authorId: button.getAttribute('authorid'),
            authorNick: button.getAttribute('authornick'),
            parentId: button.getAttribute('parentid')
          }
          location.hash = 'newComment/' + button.getAttribute('snsid') + '/' + button.getAttribute('feedid') + '/' + this.page;
        } else {
          // h5_comm.goLogin('h5_allspark'
          h5_comm.goLogin({rediUrl:'h5_allSpark',hideType:'close'});
        }

      },

      renderComment: function() {
        var list = this.model.get('replyList')

        if (list&&list.fail) {
          notification.message("请稍后重试");
          this.$container.html('加载失败，稍后重试！');
          return
        }

        if (list.totalCount == 0) {

        } else {
          list.userNick = h5_comm.isLogin() ? mtop.userNick : ""
          this.$container.html(recCommentTemplate(list))
        }

      }
    })

    return RecCommentView
});