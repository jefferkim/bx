define(function(require, exports, module) {

    var _ = require('underscore'),
        $ = require('zepto'),
        Backbone = require('backbone'),
        tbh5 = require('h5_base'),
        h5_comm = require('h5_comm'),
        global = require('../common/global'),
        cookie = require('cookie'),
        cache = require('../common/cache');
	    ROUTER = {};


    ROUTER.Class = Backbone.Router.extend({

        initialize : function() {
            //test
            //   localStorage.clear();
            //去首次加载动画
            window.MH5slogan && window.MH5slogan.hideFunc && window.MH5slogan.hideFunc();
            var self = this;
            //#index
            self.route('', 'index', self.filter);
            self.route('index', 'index', self.filter);
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
              if (tbh5.userCacheHash()) {
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
                 default :
                     self.index();

            }
        },
        /**
         * 首页入口
         */
        index :function()
        {
            console.log('是否登录:'+h5_comm.isLogin());
            //mock nick to cookie
            cookie.setCookie('_w_tb_nick','mickshu');
            var nick = h5_comm.getNickFromCookie();
            console.log('nick='+nick);
            console.log('是否需要创建sns账号:'+cache.isCreateSns(nick));
            //save sns flag
            cache.saveSnsFlag(nick);

        }
        ,
        /**
         * 账号主页入口
         */
        account :function(snsId,page)
        {
            page = page || 1;
            console.log('账号主页:'+snsId+"|page="+page);
        }
        ,
        /**
         * 消息详情页
         */
        detail:function(snsId,feedId)
        {
            console.log('消息详情页:'+snsId+"|feedId="+feedId);
            /*** 以下为测试示例 ---start ***/
            //save item
            cache.saveItem(feedId,'{"nick":"mickshu","age":"30"}');
            //get item
            console.log('缓存中数据：'+cache.getItemById(feedId));
            /*** 以下为测试示例 --- end ***/
        }
        ,
        /**
         * 评论页入口
         */
        comment :function(snsId,feedId,page)
        {
            page = page || 1;
            console.log('评论页:'+snsId+"|"+feedId+"|page="+page);
        }
        ,
        /**
         * 关注、未关注列表
         */
        accountList :function(status)
        {
            status = status || 0;
            console.log("关注、未关注列表:|status="+status);
        }
    });
    ROUTER.Instance = new ROUTER.Class;
    ROUTER.RUN = function() {
        ROUTER.Instance
        Backbone.history.start();
    }
    return ROUTER;

});
