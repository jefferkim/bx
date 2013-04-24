define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      h5_comm = require('h5_comm'),
      loading = require('../ui/loading'),
      pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');

  var notification = require('../ui/notification.js')

  var commentListTemlate = _.template($('#comment_list_tpl').html())
  var commentListHeaderTemplate = _.template($('#comment_list_header_tpl').html());

  var CommentModel = require('./commentModel');

  var CommentListView = Backbone.View.extend({

    el: '#content',

    model: new CommentModel(),

    events: {
      'click .write-comment': 'newComment'
    },

    initialize: function() {

      this.pageSize = 10

      this.$container = $('#commentListPage .main');
      this.model.on('change:commentList', this.renderCommentList, this);

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
        var commentList = commentListTemlate(this.model.get('commentList'))
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

    newComment: function() {
      if (h5_comm.isLogin())
        location.hash = 'newComment/' + this.snsId + '/' + this.feedId + '/' + this.page;
      else
        h5_comm.goLogin('h5_allspark');
    }

  })

  return CommentListView
});