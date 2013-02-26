define(function(require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore');

  var newCommentHeaderTempalte = _.template($('#newComment_header_tpl').html())
  var newCommentInputTemplate = _.template($('#newComment_input_tpl').html())

  var NewCommentView = Backbone.View.extend({

    el: '#content',

    events: {
      'keyup #comment-area': 'typing'
    },

    initialize: function() {

      $('header.navbar').html(newCommentHeaderTempalte({}))

      $('.view-page.show').removeClass('show iC').addClass('iL');
      $('#newCommentPage').removeClass('iL').addClass('show iC');

      this.$container = $('#newCommentPage')
      this.$container.html(newCommentInputTemplate({}))

      this.$commentArea = $('#comment-area')
      this.$charCount = this.$container.find('.char-count')
    },

    typing: function() {
      var length = this.$commentArea.val().length
      this.$charCount.text(length)

      if (length) this.$charCount.addClass('typing')
      else this.$charCount.removeClass('typing')
    }

  })

  return NewCommentView;
})