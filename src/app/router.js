define(function(require, exports, module) {
  var $ = require('zepto'),
      _ = require('underscore'),
      global = require('../common/global'),
      tbh5 = require('h5_base'),
      Backbone = require('backbone'),
      //view class import
      indexView =  require('../index/indexView'),
      accountView = require('../account/accountView'),
      detailView = require('../detail/detailView'),
      accountListView = require('../accountList/accountListView'),
      commentView = require('../comment/commentListView'),
      newCommentView = require('../comment/newCommentView'),
      background = require('./../common/background.js'),
      cdn = require('cdn'),
      log = require("./../common/log.js"),
      mtop = require('../common/mtopForAllspark.js'),
      //缓存实例变量view
      _indexView,_accountView,_detailView,_accountListView,_commentView,_newCommentView ;

  var Router = Backbone.Router.extend({

      routes: {   },

      initialize : function() {
          //test
          //   localStorage.clear();
          //cdn 获取最佳图片尺寸
          globalCDN=cdn;
          if(tbh5.get('hdButton')!=null){
              globalCDN.setDefaultDpi(parseInt(tbh5.get('hdButton')));
              if(tbh5.get('hdButton')>1){
                  $('.hdButton').html('<span>流畅模式</span>');
              }else{
                  $('.hdButton').html('<span>高清模式</span>');
              }
          }else{
              if(globalCDN.calDpi()==1){
                  $('.hdButton').html('<span>流畅模式</span>');
              }
          }
          //tbh5.set('hdButton',0);
          if(globalCDN.calDpi()>1){
              $('.hdButton').html('<span>流畅模式</span>');
          }

          getBetterImg = globalCDN.getBetterImg; // make it global for convenience use in templates
          resizeImg=globalCDN.resizeImg;

          changeHash=function(hash,refer){
              log&&log.logEnter(refer);
              console.log('sdfsdfsdf');
              window.location.hash=hash;
          }

          //去首次加载动画
          window.MH5slogan && window.MH5slogan.hideFunc && window.MH5slogan.hideFunc();

          //autocreate
          mtop.autoCreate();

          var self = this;
          //#index
          self.route('', 'index', self.filter);
          self.route(/^(index)\/?(\d*)?$/, 'index', self.filter);
          //#account/snsid/page  snsid - sns账号Id  page - 页码
          self.route(/^(account)\/(\d*)\/?(\d*)?$/, 'account', self.filter);
          //#detail/snsId/feedId snsid - sns账号Id  feedId - 消息Id
          self.route(/^(detail)\/(\d*)\/(\d*)\/?(\d*)?$/, 'detail', self.filter);
          //#comment/snsId/feedId/page snsid - sns账号Id  feedId - 消息Id page - 页码
          self.route(/^(comment)\/(\d*)\/(\d*)\/?(\d*)?$/, 'commentList', self.filter);
          //#accountList/status/page  status - 0 - 未关注列表 1 - 以关注列表 默认 未关注列表  page - 页码
          self.route(/^(accountList)\/?(\d*)?\/?(\d*)?$/, 'accountList', self.filter);
          //#newcomment/snsId/feedId/page snsid - sns账号Id  feedId - 消息Id page - 页码
          self.route(/^(newComment)\/(\d*)\/(\d*)\/?(\d*)?$/, 'newComment', self.filter);
          // 全局初始化
          global.init();
      },

      /**
       * 统一入口
       *
       */
      filter : function(divName, arg0, arg1, arg2) {
          var self = this;
          //如果使用cache中的hash，下面逻辑就不需要执行了，放在最上面
          if (tbh5.userCacheHash('allSpark')) {
              return;
          }
//          console.log('divName=' + divName + "|arg0=" + arg0 + "|arg1=" + arg1 + "|arg2=" + arg2);
          //默认divName
          divName = divName || 'index';
          background.enter(divName);

          switch (divName) {
              case 'index':
                  _indexView= _indexView || new indexView();
                  self.index(arg0);
                  break;
              case 'account':
                  _accountView= _accountView || new accountView();
                  self.account(arg0,arg1);
                  break;
              case 'detail':
                  _detailView= _detailView || new detailView();
                  self.detail(arg0,arg1,arg2);
                  break;
              case 'comment':
                  _commentView= _commentView || new commentView();
                  self.commentList(arg0,arg1,arg2);
                  break;
              case 'accountList':
                  _accountListView= _accountListView || new accountListView();
                  self.accountList(arg0,arg1);
                  break;
              case 'newComment':
                  _newCommentView= _newCommentView || new newCommentView();
                  self.newComment(arg0,arg1,arg2);
                  break;
              default :
                  _indexView= _indexView || new indexView();
                  self.index(arg0);

          }
      },

    index: function(page) {
        page = page || 1;
        _indexView.render(page);
        var b = "onorientationchange" in window, c = b ? "orientationchange" : "resize";
        $(window).bind(c, function() {
            var _img=$('#indexPage .feed-item .js_feed img');
            for(var i= 0,len=_img.length;i<len;i++){
                if(!_img.eq(i).parent().hasClass('feed-box')){
                    _img.eq(i).attr('style',feedImageSizeStyle(parseInt(_img.eq(i).attr('picWidth')), parseInt(_img.eq(i).attr('picHeight'))));
                }
            }
        });
    },
    account:function(snsId,page){
        page = page || 1;
        _accountView.render(snsId,page);
        var b = "onorientationchange" in window, c = b ? "orientationchange" : "resize";
        $(window).bind(c, function() {
            var _img=$('#accountPage .J_feed .tb-feed-items .media img');
            for(var i= 0,len=_img.length;i<len;i++){
                _img.eq(i).attr('style',feedImageSizeStyle(parseInt(_img.eq(i).attr('picWidth')), parseInt(_img.eq(i).attr('picHeight'))));
            }
        });
    },
    accountList:function(status,page){
        status=status||1;
        page=page||1;
        _accountListView.render(status,page);
    },
    detail: function(snsId, feedId,page) {

      page = page || 1
        //详情需要置顶
        window.scrollTo(0,0);
        _detailView.goDetail(snsId,feedId,page);
    },

    commentList: function(snsId, feedId, page) {
        page=page|| _commentView.page || 1;
        _commentView.goComment(snsId, feedId, page);
    },

    newComment: function(snsId, feedId, page) {
        page=page||1;
        _newCommentView.goNewComment(snsId, feedId, page);
    },

    start: function() {
      Backbone.history.start();
    }

  });

  App = window.App || new Router();
  return App;

});