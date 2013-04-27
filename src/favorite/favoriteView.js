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
    var feedTemplate = _.template($('#favorite_feed_tpl').html())
   return Backbone.View.extend({

    el: '#content',
    model : new _model(),
    events:{
        'click #favoritePage .feed-list .favbtn':'favbtn',
        'click #favoritePage .js_feed':'goToDetail',
        'click .navbar .refresh.favorite':'refresh'

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
    favbtn:function(e){
        var that=this;
        var _cur=$(e.currentTarget);
        var _jsfeed=_cur.parent().find('.js_feed');
        if(_cur.hasClass('faved')){
            mtop.favoriteRemoveFeed({feedId:_jsfeed.attr('feedid'),snsId:_jsfeed.attr('snsid')},function(d){
                if(d.fail){
                    notification.message('服务器在偷懒，再试试吧！');
                }else{
                    _cur.parent().parent().remove();
                    notification.message('已取消收藏！');
                }
            });
        }
    },
   goToDetail:function(e){
       var cur=$(e.currentTarget);
       var that=this;
       //window.location.hash='#detail/'+$('.tb-profile').attr('snsid')+'/'+cur.attr('feedid')+'/'+that.curPage;
       changeHash('#detail/'+cur.attr('snsid')+'/'+cur.attr('feedid')+'/'+that.params.curPage,'detail');
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
            that.$feedList.html(content);
        }else{
            that.$feedList.html('<li class="nofavs">还没有抽到任何广播！</li>');
        }
        //页数大于1的时候显示分页组件
        var pageCount=Math.ceil(parseInt(d.totalCount)/that.params.pageSize);
        if(pageCount>1){
            that.recommentPage=new pageNav({'id':'#favoritePageNav','index':that.params.curPage,'pageCount':pageCount,'pageSize':that.params.pageSize,'disableHash': 'true'});
            that.recommentPage.pContainer().on('P:switchPage', function(e,page){
                that.changePage(page.index);
            });
        }
        window.lazyload.reload();

    },
    changePage:function(page){
        var that=this;
        that.$feedList.html('<div class="loading"><span class="spinner"></span></div>');
        if(that.params.curPage>page){
            that.params.direction=0;
        }else{
            that.params.direction=1;
        }
        that.isChangePage=true;
        window.scrollTo(0,1);
        window.location.hash='#fav/'+page;
    },
    refresh:function(){
       var that=this;
       that.allFeedCount=parseInt(that.model.get('feedsList').totalCount);
       that.isRefresh=true;
       var _spinner=$('.navbar .refresh .btn div');
       if(!_spinner.hasClass('spinner')){
           _spinner.addClass('spinner');
       }
       if(that.params.curPage=='1'){
           that.model.favoriteFeeds(that.params);
       }else{
           window.location.hash='#fav/1';
       }
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
