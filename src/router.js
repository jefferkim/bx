define(function(require, exports, module) {
  var $ = require('zepto'),
      _ = require('underscore'),
      Backbone = require('backbone');

  var Router = Backbone.Router.extend({

    routes: {
      '': 'index',
      'home/(:page)': 'index',
      'detail/:snsId/:feedId': 'detail',
      'commentList/:snsId/:feedId/:page': 'commentList',
      'newComment': 'newComment',
      'account/:snsId/:page':'account',
      'accountList/:status':'accountList'

//      // self.route('', 'index', self.filter);
//          self.route(/^(index)$/, 'index', self.filter);
//        //#account/snsid/page  snsid - sns账号Id  page - 页码
//        self.route(/^(account)\/(\d*)(\/(\d*))?$/, 'account', self.filter);
//        //#detail/snsId/feedId snsid - sns账号Id  feedId - 消息Id
//        self.route(/^(detail)\/(\d*)\/(\d*)$/, 'detail', self.filter);
//        //#comment/snsId/feedId/page snsid - sns账号Id  feedId - 消息Id page - 页码
//        self.route(/^(comment)\/(\d*)\/(\d*)(\/(\d*))?$/, 'comment', self.filter);
//        //#accountList/status  status - 0 - 未关注列表 1 - 以关注列表 默认 未关注列表
//        self.route(/^(accountList)\/(\d*)(\/(\d*))?$/, 'accountList', self.filter);



    },

    index: function() {

        seajs.use('./src/dynIndex/dynIndexView',function(view){
            new view();
        });
    },
    account:function(snsId,page){
        console.log('account:snsId'+snsId+"|page:"+page);

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

  App = window.App || new Router()
  return App;

});