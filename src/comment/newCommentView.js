define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      h5_comm = require('h5_comm'),
      notification = require('../ui/notification.js');

  var CommentModel = require('./commentModel')

  var newCommentHeaderTempalte = _.template($('#newComment_header_tpl').html())
  var newCommentInputTemplate = _.template($('#newComment_input_tpl').html())

  var NewCommentView = Backbone.View.extend({

    el: '#content',

    model: new CommentModel(),

    events: {
      'keyup #comment-area': 'typing',
      'click .publish-comment': 'publish'
    },

    initialize: function() {
     this.$container = $('#newCommentPage');
      this.$container.html(newCommentInputTemplate({}));

      this.$commentArea = $('#comment-area');
      this.$replyTo = $('.comment-wrap .reply-to')
      this.$charCount = this.$container.find('.char-count');

      // if (navigator.standalone != undefined) {
      //   this.$commentArea.on('focus', this.focus).on('blur', this.blur)
      // }
    },
      goNewComment : function(snsId, feedId,page){

        this.snsId = snsId;
        this.feedId = feedId;
        this.curPage = page;

        var self = this
        setTimeout(function() {
          if (window.commentData) {
            self.$replyTo.text('回复 ' + window.commentData.authorNick + ':')
            self.$commentArea.css('text-indent', self.$replyTo.width() + 3 + 'px')
          }
        }, 100)

        var _navbar=$('header.navbar');
        _navbar.html(newCommentHeaderTempalte({ href: this.backHref() }));

          window.scrollTo(0,1);
          //判断导航是否已经载入
          if(_navbar.hasClass('iT')){
              _navbar.removeClass('iT').addClass('iC');
          }
          var _show=$('.view-page.show');
          var _newCommentPage=$('#newCommentPage');
          //判断先后关系
          var _commentListPage= $('#commentListPage');

          _show.removeClass('show iC').addClass('iL').wAE(function(){
              _show.addClass('hide');
          });


          _newCommentPage.removeClass('hide');
          setTimeout(function(){
              _newCommentPage.removeClass(' iR iL').addClass('show iC');
          },0);
          $('.view-page.show').removeClass('show iC').addClass('iL');
          $('#newCommentPage').removeClass('iL').addClass('show iC');
      },

    backHref: function(page) {
      var href = null
      if (window.commentData.from == 'commentList') {
        href = '#comment/' + this.snsId + '/' + this.feedId + '/' + (page || this.curPage)
      } else if (window.commentData.from == 'replyList') {
        href = '#recComment/' + this.curPage
      }
      return href
    },

    back: function(page) {
      location.hash = this.backHref(page)
    },

    focus: function() {
      $('.navbar').hide()
    },

    blur: function() {
      $('.navbar').show()
      window.scroll(0, 1)
    },

    typing: function() {
      var length = this.$commentArea.val().length
      this.$charCount.text(length)

      if (length) this.$charCount.addClass('typing')
      else this.$charCount.removeClass('typing')

      if (length > 140) {
        this.$commentArea.val(this.$commentArea.val().substr(0, 140))
      }

      var self = this
      setTimeout(function() { self.typing() }, 200)
    },

    publish: function() {

      if (!h5_comm.isLogin()) {
        h5_comm.goLogin('h5_allspark')
        return
      }

      var self = this
      var comment = this.$commentArea.val()

      if (comment.length == 0) {
        notification.message('写点什么吧 ^_^')
        return
      } else if (comment.length <= 140) {
        this.model.addComment({
          snsId: this.snsId,
          feedId: this.feedId,
          content: comment,
          authorId: window.commentData.authorId,
          parentId: window.commentData.parentId,
          authorNick: window.commentData.authorNick
        }, function(success, message) {
          if (success) {
            if (message) {
              notification.message(message)
              return
            }
            notification.message('发布成功！')
            self.$commentArea.val('')
            setTimeout(function() { self.back(1) }, 1500)
          } else {
            notification.message('发布失败，请重试')
          }

        });
        notification.message("发布中，请稍候...", true)
      }
    }

  })

  return NewCommentView;
})