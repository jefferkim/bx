/**
 * User: butai
 * Date: 13-2-22
 * Time: AM11:18
 */
define(function (require, exports, module) {
  var Backbone = require('backbone'),
      $ = require('zepto'),
      _ = require('underscore'),
      _model=require('./favoriteModel'),
      cdn = require('cdn'),
      tbh5 = require('h5_base'),
      h5_comm = require('h5_comm'),
      h5_base = require('h5_base'),
      uriBroker = require('uriBroker');
   
  
   return Backbone.View.extend({

    el: '#content',
    model : new _model(),
    events:{
      
    },
    initialize:function () {     
	  this.testModel();
      this.model.on('change:feedsList', this.renderFeeds, this); 
	  this.model.on('change:favStatus', this.renderFeedFavStatus, this);    

    },
    renderFeedsList: function() {
		var self=this;
		console.log(self.model.get('feedsList'));

    },
	renderFeedFavStatus:function(){
		var self=this;
		console.log(self.model.get('favStatus'));
		var params={
				curPage:1,
				pageSize:24,
				direction:1,//与timestamp 配合使用，0表向前翻，1表示向后翻
				timestamp:0
			};
		self.model.favoriteFeeds(params);
	},
	testModel:function(){
		var self=this;			
		var params={
			feedId:1292001,
			snsId:7000084652
		};
		var params1={
			feedId:'1295003',
			snsId:'7000084652'
		};
		self.model.addFeed(params);	//不存在
		self.model.addFeed(params1);//正确的	
		self.model.removeFeed(params);
		self.model.removeFeed(params1);

	}


  });
});
