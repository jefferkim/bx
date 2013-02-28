define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      notification = require('../ui/notification.js');

  var CommentModel = require('./commentModel')

  var newCommentHeaderTempalte = _.template($('#newComment_header_tpl').html())
  var newCommentInputTemplate = _.template($('#newComment_input_tpl').html())

  var NewCommentView = Backbone.View.extend({

    el: '#content',

    model: new CommentModel(),

    events: {
      'keyup #comment-area': 'typing',
      'click .publish-comment.btn': 'publish'
    },

    initialize: function() {
     this.$container = $('#newCommentPage');
      this.$container.html(newCommentInputTemplate({}));

      this.$commentArea = $('#comment-area');
      this.$charCount = this.$container.find('.char-count');
    },
      goNewComment : function(snsId, feedId,page){

        this.snsId = snsId;
        this.feedId = feedId;
        this.curPage = page;

          $('header.navbar').html(newCommentHeaderTempalte({}));
          $('.view-page.show').removeClass('show iC').addClass('iL');
          $('#newCommentPage').removeClass('iL').addClass('show iC');
      },
    typing: function() {
      var length = this.$commentArea.val().length
      this.$charCount.text(length)

      if (length) this.$charCount.addClass('typing')
      else this.$charCount.removeClass('typing')
    },

    publish: function() {
      var comment = this.$commentArea.val()
      console.log('comment length is', comment.length)

      if (comment.length == 0) {
        notification.message('写点什么吧 ^_^')
      } else if (comment.length <= 140) {
        this.model.addComment({
          snsId: this.snsId,
          feedId: this.feedId,
          content: _.escape(comment)
        }, function(success) {

        });
        notification.message("发布中请稍候")
      }
    }

  })

  return NewCommentView;
})