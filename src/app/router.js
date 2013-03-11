define(function(require, exports, module) {
  var $ = require('zepto'),
      _ = require('underscore'),
      global = require('../common/global'),
      tbh5 = require('h5_base'),
      Backbone = require('backbone'),
      //view class import
      indexView =  require('../dynIndex/dynIndexView'),
      accountView = require('../account/accountView'),
      detailView = require('../detail/detailView'),
      accountListView = require('../accountList/accountListView'),
      commentView = require('../comment/commentListView'),
      newCommentView = require('../comment/newCommentView'),
      back = require('./../common/back'),
      //缓存实例变量view
      _indexView,_accountView,_detailView,_accountListView,_commentView,_newCommentView ;

  var Router = Backbone.Router.extend({

      routes: {   },

      initialize : function() {
          //test
          //   localStorage.clear();
          //去首次加载动画
          window.MH5slogan && window.MH5slogan.hideFunc && window.MH5slogan.hideFunc();
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

          //
         back.add(divName);

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
         console.log('index'+page);
        _indexView.render(page);
    },
    account:function(snsId,page){
        console.log('account:snsId'+snsId+"|page:"+page);
        page = page || 1;
        _accountView.render(snsId,page);
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
      console.log('route into commentList')
    },

    newComment: function(snsId, feedId, page) {
        page=page||1;
        _newCommentView.goNewComment(snsId, feedId, page);
      console.log('route into newComment')
    },

    start: function() {
      Backbone.history.start();
      console.log('start routing.')
    }

  });

  App = window.App || new Router();
  return App;

});