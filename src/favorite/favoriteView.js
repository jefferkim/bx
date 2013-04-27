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
      notification = require('../ui/notification.js'),
      mtop = require('../common/mtopForAllspark.js'),
      pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js'),
      uriBroker = require('uriBroker');

    var header = $('#favorite_header_tpl').html()
    var feedTemplate = _.template($('#index_feed_tpl').html())
   return Backbone.View.extend({

    el: '#content',
    model : new _model(),
    events:{
      
    },
    initialize:function () {     
        var that=this;
        that.params={
            curPage:1,
            pageSize:24,
            direction:1,//与timestamp 配合使用，0表向前翻，1表示向后翻
            timestamp:0
        };
        this.$feedList =  $('#favoritePage .feed-list')
        this.model.on('change:feedsList', this.renderFeedsList, this);
	    this.model.on('change:favStatus', this.renderFeedFavStatus, this);
        that.render();
    },
    render:function(page){
        var that=this;
        that.params.curPage=page;

        this.params.curPage = page;
        if(this.$feedList.html()==''){
            this.$feedList.html('<div class="loading"><span class="spinner"></span></div>');
        }
        //判断是否显示footer
        if(h5_comm.isLogin()){
            $('.navbar').html(header);
            $('footer .nick').html(mtop.userNick);
            var logoutUrl =  uriBroker.getUrl('login_out');
            $('footer .loginStatus a.logout').attr('href',logoutUrl);
            $('footer .loginStatus a.logout').css('display','inline-block');
            $('footer .loginStatus a.login').css('display','none');
            $('footer .loginStatus a.reg').css('display','none');

            that.model.favoriteFeeds();
        }else{

        }

        var _navbar=$('header.navbar');
        var _favoritePage=$('#favoritePage');
        var _show=$('.view-page.show');


        _navbar.html(header);
        if($('#detailPage').hasClass('show')){
            _favoritePage.removeClass(' iR iL').addClass('iL');
            _show.removeClass('show iC').addClass('iR').wAE(function(){
                _show.addClass('hide');
            });
        }else{
            if(!_favoritePage.hasClass('show')){
                _show.removeClass('show iC').addClass('iL').wAE(function(){
                    _show.addClass('hide');
                });
            }
        }
        _favoritePage.removeClass('hide');
        setTimeout(function(){
            _favoritePage.removeClass(' iR iL').addClass('show iC');
        },0);



    },
    renderFeedsList: function() {
		var that=this;
        var d=that.model.get('feedsList');
        if(d.fail){
            notification.message(d.errMsg);
            return;
        }

        if(d.list.length>0){
            var content = feedTemplate(d);
            this.$feedList.html(content);
        }else{
            this.$feedList.html('<li class="nofavs">还有没收藏哦！</li>');
        }
		console.log(that.model.get('feedsList'));

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
