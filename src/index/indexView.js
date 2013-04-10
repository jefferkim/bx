/**
 * User: butai
 * Date: 13-2-22
 * Time: AM11:18
 */
define(function (require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      _model=require('./indexModel'),
      cdn = require('cdn'),
      h5_base = require('h5_base'),
      uriBroker = require('uriBroker'),
      loading = require('../ui/loading');

    var header = $('#index_header_tpl').html()
    var feedTemplate = _.template($('#index_feed_tpl').html())

   return Backbone.View.extend({

    el: '#content',
    model : new _model(),
    events:{

    },
    initialize:function () {
      this.params = {
          timestamp:0,//Date.now(),
          curPage:1,
          pageSize :20,
          onlyYou:1,
          direction:0
      }
      this.model.on('change:timeLine', this.renderFeeds, this);

      this.$feedList =  $('#indexPage .feed-list')

    },

		render:function(page){
      this.params.curPage = page
			this.model.getPageData(this.params)

      $('.navbar').html(header)

		},

    renderFeeds: function() {
      var content = feedTemplate(this.model.get('timeLine'))
      this.$feedList.html(content)
    }


  });
});
