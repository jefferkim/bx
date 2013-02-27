define(function(require, exports, module) {
  var $ = require('zepto'),
      _ = require('underscore'),
      global = require('../common/global'),
      tbh5 = require('h5_base'),
      h5_comm = require('h5_comm'),
      Backbone = require('backbone');

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
          self.route(/^(index)(\/(\d*))?$/, 'index', self.filter);
          //#account/snsid/page  snsid - sns账号Id  page - 页码
          self.route(/^(account)\/(\d*)(\/(\d*))?$/, 'account', self.filter);
          //#detail/snsId/feedId snsid - sns账号Id  feedId - 消息Id
          self.route(/^(detail)\/(\d*)\/(\d*)$/, 'detail', self.filter);
          //#comment/snsId/feedId/page snsid - sns账号Id  feedId - 消息Id page - 页码
          self.route(/^(comment)\/(\d*)\/(\d*)(\/(\d*))?$/, 'comment', self.filter);
          //#accountList/status  status - 0 - 未关注列表 1 - 以关注列表 默认 未关注列表
          self.route(/^(accountList)\/(\d*)(\/(\d*))?$/, 'accountList', self.filter);
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
          console.log('divName=' + divName + "|arg0=" + arg0 + "|arg1=" + arg1 + "|arg2=" + arg2);
          //默认divName
          divName = divName || 'index';
          switch (divName) {
              case 'index':
                  self.index();
                  break;
              case 'account':
                  self.account(arg0,arg1);
                  break;
              case 'detail':
                  self.detail(arg0,arg1);
                  break;
              case 'comment':
                  self.comment(arg0,arg1,arg2);
                  break;
              case 'accountList':
                  self.accountList(arg0);
                  break;
              case 'newComment':
                  self.newComment(arg0,arg1,arg2);
                  break;
              default :
                  self.index();

          }
      },

    index: function(page) {
        page = page || 1;
        seajs.use('./src/dynIndex/dynIndexView',function(view){
            new view(page);
        });
    },
    account:function(snsId,page){
        console.log('account:snsId'+snsId+"|page:"+page);
        page = page || 1;

        seajs.use('./src/account/accountView',function(view){
            new view(snsId,page);
        });
    },
    accountList:function(status){
        seajs.use('./src/accountList/accountListView',function(view){
            new view(status);
        });
    },
    detail: function(snsId, feedId) {
        seajs.use('./src/detail/detailView',function(view){
            new view(snsId,feedId);
        });
    },

    commentList: function(snsId, feedId, page) {
      seajs.use('./src/comment/commentListView', function(CommentListView) {
        new CommentListView(snsId, feedId, page)
      })
      console.log('route into commentList')
    },

    newComment: function() {
      seajs.use('./src/comment/newCommentView', function(NewCommentView) {
        new NewCommentView()
      })
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