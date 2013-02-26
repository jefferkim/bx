define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore');

  var commentListTemplate = _.template($('#comment_list_tpl').html())

  var CommentModel = require('./commentModel')

  var CommentListView = Backbone.View.extend({

    el: '#content',

    model: new CommentModel(),

    events: {
      'click .btn.comment': 'newComment'
    }

    initialize: function(snsId, feedId, page) {

      $('header.navbar').html(commentListTemplate({}))

      $('.view-page.show').removeClass('show iC').addClass('iL');
      $('#commentListPage').removeClass('iL').addClass('show iC');

      this.$container = $('#commentListPage')

      this.model.on('change:list', this.renderCommentList, this)

      this.model.getPageData({'snsId':snsId,'feedId':feedId});
    },

    renderCommentList: function() {
      console.log('comment list', this.model.get('list'))
    },

    newComment: function() {

    }

  })

  return CommentListView
});