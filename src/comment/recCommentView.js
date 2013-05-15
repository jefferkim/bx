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

      el: '#content',

      model: new CommentModel(),

      events: {
        'click #recCommentPage .reply-button': 'newComment',
        'click .fn_btns .refresh.rec-comment': 'refresh'
      },

      initialize: function() {

        this.pageSize = 10

        this.$container = $('#recCommentPage')
        this.model.on('change:replyList', this.renderComment, this)
      },

      refresh: function() {
        this.$('.fn_btns .refresh.rec-comment .btn div').addClass('spinner')
        if (this.page == 1) {
          this.model.getReplyList({curPage:1,pageSize:this.pageSize,direction:1,timestamp:0});
        } else {
          location.hash = 'recComment/1'
        }
      },

      goRecComment: function(page) {

        this.page = page

        this.$(".fn_btns .refresh.rec-comment .btn div").removeClass('spinner')

        $('header.navbar').html(recCommentHeaderTemplate({ href: '#index' }))

        this.model.getReplyList({curPage:this.page,pageSize:this.pageSize,direction:1,timestamp:0});
      },

      newComment: function(e) {
        var button = e.target
        if (h5_comm.isLogin()) {
          window.commentData = {
            from: 'replyList',
            authorId: button.getAttribute('authorid'),
            authorNick: button.getAttribute('authornick'),
            parentId: button.getAttribute('parentid')
          }
          var hash = 'newComment/' + button.getAttribute('snsid') + '/' + button.getAttribute('feedid') + '/' + this.page;
          changeHash(hash, 'rec_comment')
        } else {
          // h5_comm.goLogin('h5_allspark'
          h5_comm.goLogin({rediUrl:'h5_allSpark',hideType:'close'});
        }

      },

      renderComment: function() {

        var self = this

        setTimeout(function() {
          self.$(".fn_btns .refresh.rec-comment .btn div").removeClass('spinner')
        }, 2000)

          var _navbar=$('header.navbar');
          var _recCommentPage=$('#recCommentPage');
          var _show=$('.view-page.show');



          if($('#detailPage').hasClass('show')){
              _recCommentPage.removeClass(' iR iL').addClass('iL');
              _show.removeClass('show iC').addClass('iR').wAE(function(){
                  _show.addClass('hide');
              });
          }else{
              if(!_recCommentPage.hasClass('show')){
                  _show.removeClass('show iC').addClass('iL').wAE(function(){
                      _show.addClass('hide');
                  });
              }
          }
          _recCommentPage.removeClass('hide');
          setTimeout(function(){
              _recCommentPage.removeClass(' iR iL').addClass('show iC');
          },0);
          window.scrollTo(0,1);

        var list = this.model.get('replyList')
        if (list&&list.fail) {
          notification.message("请稍后重试");
          this.$container.html('<p class="no-comment">加载失败，稍后重试！</p>');
          return
        }

        if (parseInt(list.totalCount) == 0) {
            _recCommentPage.html('<p class="no-comment">还没有收到任何评论哦</p>');
        } else {
          list.userNick = h5_comm.isLogin() ? h5_comm.getNickFromCookie() : ""
          this.$container.html(recCommentTemplate(list))

          var pageCount = Math.ceil(list.totalCount / this.pageSize);
          if (pageCount > 1) {
           this.pageNav = new pageNav({
            'id': '#RecCommentPageNav',
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

        location.hash = 'recComment/' + page
      }

    })

    return RecCommentView
});