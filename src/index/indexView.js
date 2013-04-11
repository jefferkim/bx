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
      mtop = require('../common/mtopForAllspark.js'),
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
//        'click #J_login_btn' : 'goLogin',
        'click .navbar .add':'add',
        'click .navbar .refresh.index':'refresh',
        'click #indexPage .js_feed':'goToDetail',
//        'click #indexPage .person-list li .content':'goToAccount',
//        'click #indexPage .person-list .followbtn':'follow',
        'click .gotop':'goTop'
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
        //判断是否显示footer
        if(h5_comm.isLogin()){
            $('footer .nick').html(mtop.userNick);
            $('footer').css('display','block');
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

        this.params.curPage = page
	    this.model.getPageData(this.params)

        $('.navbar').html(header)

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
           window.location.hash='#accountList/1';
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
       that.timestamp=new Date().getTime();
       var _spinner=$('.navbar .refresh .btn div');
       if(!_spinner.hasClass('spinner')){
           _spinner.addClass('spinner');
       }
       if(that.curPage=='1'){
           that.dynIndexModel.getPageData({'curPage':that.curPage,'pageSize':that._pageSize,'timestamp':that.timestamp});
       }else{
           window.location.hash='#index/1';
       }
    },
    renderFeeds: function() {
      var content = feedTemplate(this.model.get('timeLine'))
      this.$feedList.html(content)
    }


  });
});
