define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        //base64 = require('base64'),
        h5_comm = require('h5_comm'),
        h5_cache = require('h5_cache'),
        cookie = require('cookie');

    /**
     * 动态首页
     */
    var CommentModel = Backbone.Model.extend({

        /**
         * 获取回复列表：
         *
         * @param param.feedId
         * @param param.snsId
         */
        getPageData:function (param) {
            var self = this;

            function getCommentList(param) {
                mtop.list(
                    param, function (accResult) {
                        self.set("list", accResult);
                    })
            }

            param || (param = {});
              var pageParam = _.clone(mtop.pageParam);
            _.extend(pageParam, param);
            //伪代码
            mtop.userNick = 'tbseed91';
            if (mtop.userNick) {
                //设置登录状态
                self.set("loginStatus",true);

                getCommentList(pageParam);
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
         * 评论详情
         *
         * @param param.feedId
         * @param param.snsId
         */
        addComment:function(param) {
            mtop.addComment(param, function (recResult) {
            self.set("comment", recResult);
        })
    }

    });
    return CommentModel;
});