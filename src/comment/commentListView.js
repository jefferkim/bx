define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      h5_comm = require('h5_comm'),
      loading = require('../ui/loading'),
      mtop = require('../common/mtopForAllspark.js'),
      pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');

  var notification = require('../ui/notification.js')

  var commentListTemlate = _.template($('#comment_list_tpl').html())
  var commentListHeaderTemplate = _.template($('#comment_list_header_tpl').html());

  var CommentModel = require('./commentModel');

  var CommentListView = Backbone.View.extend({

    el: '#content',

    model: new CommentModel(),

    events: {
      'click .comment .send-button': 'addComment',
      'click .comment .reply-button': 'newComment',
      'keyup #add-comment-area': 'typing',
      'focusin #add-comment-area': 'expandTextArea',
      'focusout #add-comment-area': 'restoreTextArea'
    },

    initialize: function() {

console.log('init');
      this.pageSize = 10

      this.$container = $('#commentListPage .main');

      this.$commentArea = $('#add-comment-area')
      this.$charCount = $('.add-comment .char-count')

      this.model.on('change:commentList', this.renderCommentList, this);
      // var self = this
 	    // this.model.getReplyList({curPage:1,pageSize:24,direction:1,timestamp:0});
      // this.model.on('change:replyList', function() { console.log(self.model.get('replyList')) })
    },
     goComment:function(snsId, feedId, page){

         this.$container.html('<div class="loading"><span class="spinner"></span></div>');

         this.snsId = snsId;
         this.feedId = feedId;
         this.page = parseInt(page);
         var _navbar=$('header.navbar');
         var _commentListPage= $('#commentListPage');
         $('header.navbar').html(commentListHeaderTemplate({ href: '#detail/' + this.snsId + '/' + this.feedId +'/'+this.page}));
         window.scrollTo(0,1);
         //判断导航是否已经载入
         if(_navbar.hasClass('iT')){
             _navbar.removeClass('iT').addClass('iC');
         }

         var _show=$('.view-page.show');
         //判断动画先后顺序
         var _newCommentPage=$('#newCommentPage');
         if(_newCommentPage.hasClass('show')){
             _commentListPage.removeClass(' iR iL').addClass('iL');
             _show.removeClass('show iC').addClass('iR').wAE(function(){
                 _show.addClass('hide');
             });
         }else{
             if(!_commentListPage.hasClass('show')){
                 _show.removeClass('show iC').addClass('iL').wAE(function(){
                     _show.addClass('hide');
                 });
             }
         }

         _commentListPage.removeClass('hide');
         setTimeout(function(){
             _commentListPage.removeClass('iR iL').addClass('show iC');
         },0);



         this.model.getPageData({'snsId':this.snsId,'feedId':this.feedId,'curPage':this.page, 'pageSize': this.pageSize });
     },

    renderCommentList: function() {

      var self = this
      var list = this.model.get('commentList');

        if (list&&list.fail) {
            notification.message("请稍后重试");
            this.$container.html('加载失败，稍后重试！');
            return
        }

      if (list.totalCount == 0) {
        this.$container.html('<p class="no-comment">还没有评论，快抢沙发吧。</p>')
      } else {
        var data = this.model.get('commentList')
        data.userNick = h5_comm.isLogin() ? mtop.userNick : ""
        var commentList = commentListTemlate(data)
        this.$container.html(commentList)

        var pageCount = Math.ceil(list.totalCount / this.pageSize);
        if (pageCount > 1) {
         this.pageNav = new pageNav({
          'id': '#commentListPageNav',
          'index': this.page,
          'pageCount': pageCount,
          'pageSize': this.pageSize,'disableHash': 'true'});


          this.pageNav.pContainer().on('P:switchPage', function(e,page){
            self.changePage(page.index);
          });
        }
      }

    },

    changePage: function(page) {
        this.$container.html('<div class="loading"><span class="spinner"></span></div>');

        location.hash = '#comment/' + this.snsId + '/' + this.feedId + '/' + page
    },

    newComment: function(e) {

      if (h5_comm.isLogin()) {
        window.commentData = {
          authorId: e.target.getAttribute('authorid'),
          authorNick: e.target.getAttribute('authornick'),
          parentId: e.target.getAttribute('parentid')
        }
        location.hash = 'newComment/' + this.snsId + '/' + this.feedId + '/' + this.page;
      } else {
        // h5_comm.goLogin('h5_allspark'
        h5_comm.goLogin({rediUrl:'h5_allSpark',hideType:'close'});
      }
    },

    typing: function() {
      var length = this.$commentArea.val().length
      var $counter = this.$charCount.find('.counter')
      $counter.text(length)

      if (length) $counter.addClass('typing')
      else $counter.removeClass('typing')

      if (length > 140) {
        this.$commentArea.val(this.$commentArea.val().substr(0, 140))
      }

      var self = this
      setTimeout(function() { self.typing() }, 200)

    },

    expandTextArea: function() {
      this.$commentArea.attr('rows', 3)
      this.$charCount.show()
    },

    restoreTextArea: function() {
      this.$commentArea.attr('rows', 1)
      this.$charCount.hide()
    },

    addComment: function() {
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
          content: comment
        }, function(success, message) {
          if (success) {
            if (message) {
              notification.message(message)
              return
            }
            notification.message('发布成功！')
            self.$commentArea.val('')
            location.reolad()
          } else {
            notification.message('发布失败，请重试')
          }

        });
        notification.message("发布中，请稍候...", true)
      }
    }
  })

  return CommentListView
});