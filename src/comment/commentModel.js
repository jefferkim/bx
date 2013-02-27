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
            if (h5_comm.isLogin()) {
                //设置登录状态
                self.set("loginStatus",true);

                mtop.commentList(
                    param, function (accResult) {
                        self.set("commentList", accResult);
                    })
            } else {
                self.set("loginStatus",false);
            }
        },


        /**
         * 获取评论数
         * @param param.snsId
         * @param param.feedId
         */
        getCommentCount:function(param) {
            var self = this;
            if (h5_comm.isLogin()) {
                //设置登录状态
                self.set("loginStatus",true);

                mtop.commentCount(param, function (recResult) {
                self.set("commentCount", recResult);
            })}else{
                self.set("loginStatus",false);
            }
        },

        /**
         * 评论
         *
         * @param param.feedId
         * @param param.snsId
         * @param param.content
         */
        addComment:function(param) {

            function addComment(fun, param) {
                mtop.addComment(param, function (accResult) {
                        fun && fun.call(arguments.callee, {succ:true});
                    },function(){
                        fun && fun.call(arguments.callee, {fail:result});
                    })
            }

            var self = this;
            if (h5_comm.isLogin()){
                //设置登录状态
                self.set("loginStatus",true);
                self.addComment(param, function (recResult) {
                },function(recResult){
                })
            } else {
                self.set("loginStatus",false);
            }
        }
    });
});