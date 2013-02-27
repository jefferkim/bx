define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      h5_comm = require('h5_comm');

  var commentListHeaderTemplate = _.template($('#comment_list_header_tpl').html());

  var CommentModel = require('./commentModel');

  var CommentListView = Backbone.View.extend({

    el: '#content',

    model: new CommentModel(),

    events: {
      'click .write-comment.btn': 'newComment'
    },

    initialize: function() {

      this.$container = $('#commentListPage');

      this.model.on('change:commentList', this.renderCommentList, this);
    },
     goComment:function(snsId, feedId, page){

         var that=this;
         $('header.navbar').html(commentListHeaderTemplate({}));

         $('.view-page.show').removeClass('show iC').addClass('iL');
         $('#commentListPage').removeClass('iL').addClass('show iC');
         that.model.getPageData({'snsId':snsId,'feedId':feedId,'page':page});
     }
     ,
    renderCommentList: function() {
      var list = this.model.get('commentList');
      if (list.totalCount == 0) {
        this.$container.html('<p class="no-comment">暂时没有评论</p>')
      } else {

      }

      console.log('comment list', this.model.get('commentList'))
    },

    newComment: function() {
      //if (h5_comm.isLogin())
      if (true)
        location.hash='newComment/';
      else
        h5_comm.goLogin('h5_allspark');
    }

  })

  return CommentListView
});