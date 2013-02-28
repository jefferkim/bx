define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      h5_comm = require('h5_comm'),
      pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');

  var notification = require('../ui/notification.js')

  var commentListTemlate = _.template($('#comment_list_tpl').html())
  var commentListHeaderTemplate = _.template($('#comment_list_header_tpl').html());

  var CommentModel = require('./commentModel');

  var CommentListView = Backbone.View.extend({

    el: '#content',

    model: new CommentModel(),

    events: {
      'click .write-comment.btn': 'newComment'
    },

    initialize: function() {

      this.pageSize = 3

      this.$container = $('#commentListPage');
      this.model.on('change:commentList', this.renderCommentList, this);

    },
     goComment:function(snsId, feedId, page){

         this.snsId = snsId
         this.feedId = feedId

         $('header.navbar').html(commentListHeaderTemplate({}));

         $('.view-page.show').removeClass('show iC').addClass('iL');
         $('#commentListPage').removeClass('iL').addClass('show iC');

         this.model.getPageData({'snsId':snsId,'feedId':feedId,'curPage':page, 'pageSize': this.pageSize });
     },

    renderCommentList: function() {

      var self = this
      var list = this.model.get('commentList');

      if (list.totalCount == 0) {
        this.$container.html('<p class="no-comment">暂时没有评论</p>')
      } else {
        var commentList = commentListTemlate(this.model.get('commentList'))
        this.$container.html(commentList)

        this.pageNav = new pageNav({
          'id': '#commentListPageNav',
          'index': 1,
          'pageCount': list.totalCount / this.pageSize,
          'pageSize': this.pageSize,'disableHash': 'true'});


        this.pageNav.pContainer().on('P:switchPage', function(e,page){
            self.changePage(page.index);
        });

      }

      console.log('comment list', this.model.get('commentList'))
    },

    changePage: function(page) {
      location.hash = '#comment/' + this.snsId + '/' + this.feedId + '/' + page
    },

    newComment: function() {
      //if (h5_comm.isLogin())
      if (true)
        location.hash = 'newComment/' + this.snsId + '/' + this.feedId ;
      else
        h5_comm.goLogin('h5_allspark');
    }

  })

  return CommentListView
});