define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js')

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

            function getCommentList(param) {
                mtop.commentList(
                    param, function (accResult) {
                        self.set("commentList", accResult);
                        self.set("status",true);
                    },function(){
                        self.set("status",false);
                    })
            }
            //伪代码
            mtop.userNick = 'tbseed91';
            if (mtop.userNick) {
                //设置登录状态
                self.set("loginStatus",true);
                getCommentList(param);
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
            mtop.userNick = 'tbseed91';
            if (mtop.userNick) {
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
            var self = this;
            if (mtop.userNick){
                //设置登录状态
                self.set("loginStatus",true);
                mtop.addComment(param, function (recResult) {
                    self.set("status",'sucess');
                },function(recResult){
                    self.set("status",'fail');
                })
            } else {
                self.set("loginStatus",false);
            }
        }
    });
});