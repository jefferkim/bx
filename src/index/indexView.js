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
//        'click #indexPage .myfeed li':'goToAccount',
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
      this.params.curPage = page
			this.model.getPageData(this.params)

      $('.navbar').html(header)

    },
    goTop:function(){
        window.scrollTo(0,1);
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
