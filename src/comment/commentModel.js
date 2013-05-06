define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        h5_comm = require('h5_comm')

    /**
     * 动态首页
     */
    return Backbone.Model.extend({
        /**
         * 获取回复列表：
         *
         * @param param.feedId
         * @param param.snsId
         */
        getPageData:function (param) {
            var self = this;
            mtop.commentList(param, function (accResult) {
                    self.set("commentList", accResult);
             })
        },


        /**
         * 获取评论数
         * @param param.snsId
         * @param param.feedId
         */
        /**
        getCommentCount:function(param) {
            var self = this;
             mtop.commentCount(param, function (recResult) {
             self.set("commentCount", recResult);
            })
        },

         **/

        /**
         * 评论
         *
         * @param param.feedId
         * @param param.snsId
         * @param param.content
         */
        addComment:function(param,fun) {
            var self = this;
            if (h5_comm.isLogin()){
                //设置登录状态
                self.set("loginStatus",true);
                mtop.addComment(param, function (result) {
                    fun && fun(true,result.fail && result.fail.split("::")[1]);
                },function(){
                    fun && fun(false);
                })
            } else {
               self.set("loginStatus",false);
            }
        },
		getReplyList:function(param,fun) {
            var self = this;
            if (h5_comm.isLogin()){
                //设置登录状态
                self.set("loginStatus",true);
                mtop.recommendsReplyList(param, function (result) {
					//console.log(result);
					 if(result.fail){	
						result.errMsg='服务器繁忙，请稍后再试！';
                        self.set("replyList",result);
                        return;
                    }
                    result.t=new Date().getTime();
                    self.set("replyList", result);
					});
            } else {
               self.set("loginStatus",false);
            }
        },
    });
});