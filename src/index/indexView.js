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
      tbh5 = require('h5_base'),
      h5_comm = require('h5_comm'),
      h5_base = require('h5_base'),
      uriBroker = require('uriBroker'),
      slider= require('../../../../base/styles/component/slider/js/slider.js'),
      mtop = require('../common/mtopForAllspark.js'),
      pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js'),
      notification = require('../ui/notification.js'),
      loading = require('../ui/loading');

    var header = $('#index_header_tpl').html()
    var feedTemplate = _.template($('#index_feed_tpl').html())
    $.extend($.fn, {
        // 扩展动画结束事件
        wAE: function (c,n) {
            var that = this;
            var flag = true;
            var listener = function(e){
                if (n && e.propertyName != n ) { return };
                if (typeof c == 'function' && flag) {
                    c();
                    flag = false;
                }
            }
            that.unbind('webkitAnimationEnd').bind('webkitAnimationEnd', listener)
            that.unbind('webkitTransitionEnd').bind('webkitTransitionEnd', listener)
        }
    });
   return Backbone.View.extend({

    el: '#content',
    model : new _model(),
    events:{
        'click .loginbtn' : 'goLogin',
        'click .navbar .add':'add',
        'click .navbar .refresh.index':'refresh',
        'click #indexPage .js_feed':'goToDetail',
        'click .goFollowbtn':'add',
//        'click #indexPage .person-list .followbtn':'follow',
        'click .gotop':'goTop',
        'click .hdButton':'changeHD'
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
      this.model.on('change:hotFeeds', this.renderFeeds, this);

      this.$feedList =  $('#indexPage .feed-list')

    },
    hotFeedFlag:false,
	render:function(page){
        var loginHtml='<div class="login-bar">一起玩转微淘？<button class="loginbtn log" data-log="attention">登录</button></div>';


        this.params.curPage = page;
        if(this.$feedList.html()==''){
            this.$feedList.html('<div class="loading"><span class="spinner"></span></div>');
        }
        //判断是否显示footer
        if(h5_comm.isLogin()){
            $('.navbar').html(header);
            $('footer .nick').html(mtop.userNick);
            $('footer .loginStatus').css('display','block');
            this.model.getTimeLine(this.params);
        }else{
            $('.navbar').html(header+loginHtml);
            if($('.J_slider').length==0){
                $('#indexPage .J_status').html('<div class="J_slider"></div><div class="hotfeedhd"><hr/><span>热门广播</span></div>');
                this.showBanner();
            }
            if(!this.hotFeedFlag){
                this.model.hotFeeds(this.params);
                this.hotFeedFlag=true;
            }
        }

        if($('#indexPage').hasClass('show')){
            //判断是否分页
        }else{
            var _show=$('.view-page.show');
            var _index=$('#indexPage');
            if(_show.length>0){
                if(_index.hasClass('iB')){
                    _index.removeClass('iB').addClass('iL');
                }
                _show.removeClass('show iC').addClass('iR').wAE(function(){
                    _show.addClass('hide');
                });
                _index.removeClass('hide iL').addClass('show iC');
            }else{
                //页面第一次加载的时候动画
                _index.removeClass('hide');
                setTimeout(function(){
                    _index.removeClass('iB').addClass('show iC');
                },0);
                //当不是从首页进入,返回首页
            }
        }

    },
       changeHD:function(e){
           var that=this,cur=$(e.currentTarget);
           if(cur.text()=='高清模式'){
               cur.html('<span>流畅模式</span>');
               tbh5.set('hdButton',2);
               globalCDN.setDefaultDpi(2);
           }else{
               cur.html('<span>高清模式</span>');
               tbh5.set('hdButton',1);
               globalCDN.setDefaultDpi(1);
           }

       },
   changePage:function(page){
       var that=this;

       this.$feedList.html('<div class="loading"><span class="spinner"></span></div>');
       //changeHash('#index/'+page,
       //that.params.timestamp=new Date().getTime();
       if(that.params.curPage>page){
           that.params.direction=0;
       }else{
           that.params.direction=1;
       }
       that.isChangePage=true;
       window.scrollTo(0,1);
       window.location.hash='#index/'+page;

       //that.dynIndexModel.getPageData({'curPage':page,'pageSize':that._pageSize});
   },
    goTop:function(){
        window.scrollTo(0,1);
    },
    goToDetail:function(e){
        var cur=$(e.currentTarget);
        var that=this;
        //window.location.hash='#detail/'+$('.tb-profile').attr('snsid')+'/'+cur.attr('feedid')+'/'+that.curPage;
        changeHash('#detail/'+cur.attr('snsid')+'/'+cur.attr('feedid')+'/'+that.params.curPage,'detail');
    },
    add:function(){
       var that=this;
       if(h5_comm.isLogin()){
           changeHash('#accountList/1','accountList');
           //window.location.hash='#accountList/1';
       }else{
           //allSpark_hash
           that.goLogin();
           //h5_comm.goLogin('h5_allspark');
       }
    },
    goLogin:function(){
        tbh5.removeValue('allSpark_hash');
        tbh5.removeValue('allSpark_lastHash')
        h5_comm.goLogin('h5_allspark');
    },
    refresh:function(){
       var that=this;
       that.allFeedCount=parseInt(this.model.get('timeLine').allFeedCount);
//       that.params.timestamp=new Date().getTime();
//       that.params.direction=1;
       that.isRefresh=true;
       var _spinner=$('.navbar .refresh .btn div');
       if(!_spinner.hasClass('spinner')){
           _spinner.addClass('spinner');
       }
       if(this.params.curPage=='1'){
           this.model.getTimeLine(this.params);
           //that.dynIndexModel.getPageData({'curPage':that.curPage,'pageSize':that._pageSize,'timestamp':that.timestamp});
       }else{
           window.location.hash='#index/1';
       }
    },
    showBanner:function(){
        var d={'list':[{'url':'','picture':'http://a.tbcdn.cn/mw/webapp/allspark/01.jpg'},{'url':'','picture':'http://a.tbcdn.cn/mw/webapp/allspark/02.jpg'},{'url':'','picture':'http://a.tbcdn.cn/mw/webapp/allspark/03.jpg'}]};
        d.width=d.list.length*document.getElementById('content').offsetWidth;
        d.swidth=document.getElementById('content').offsetWidth;

        $('#indexPage .J_slider').html(_.template($('#slider_tpl').html(),d));

        new slider(".in-slider", {wrap: ".in-slider-cont",trigger: ".in-slider-status",useTransform: !0,interval: 5000,play: !0,loop: !0});


    },
    renderFeeds: function() {

        var d;
        var that=this;
        //取消刷新按钮动画
        setTimeout(function(){
            $('.navbar .refresh div').removeClass('spinner');
        },2000);
        if(h5_comm.isLogin()){
            d=this.model.get('timeLine');
            if(typeof that.allFeedCount!='undefined'){
                var newcount=parseInt(d.allFeedCount)-that.allFeedCount;
                if(newcount>0||this.$feedList.html()==''){
                    notification.message('更新了 '+newcount+' 条广播');
                    var content = feedTemplate(d);
                    this.$feedList.html(content);
                }
            }else{
                var content = feedTemplate(d);
                this.$feedList.html(content);
            }
            if(that.isChangePage||that.isRefresh){
                var content = feedTemplate(d);
                this.$feedList.html(content);
                that.isChangePage=false;
                that.isRefresh=false;
            }

            that.allFeedCount=parseInt(d.allFeedCount);

            //页数大于1的时候显示分页组件
            var pageCount=Math.ceil(parseInt(d.allFeedCount)/this.params.pageSize);
            if(pageCount>1){
                this.recommentPage=new pageNav({'id':'#timeLinePageNav','index':this.params.curPage,'pageCount':pageCount,'pageSize':this.params.pageSize,'disableHash': 'true'});
                this.recommentPage.pContainer().on('P:switchPage', function(e,page){
                    that.changePage(page.index);
                });
            }
        }else{

            d=this.model.get('hotFeeds');
            var content = feedTemplate(d);
            this.$feedList.html(content);
        }
        if(d.onlyYou=='1'){
          var followHtml='<div class="login-bar">一步玩转微淘？<button class="goFollowbtn log" data-log="attention">去关注</button></div>'
          $('.navbar').append(followHtml);
        }

        window.lazyload.reload()

    }


  });
});
