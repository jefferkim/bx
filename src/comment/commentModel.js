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
         * 获取评论数据：
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

            if (mtop.userNick && h5_cache.getValue("allspark", this.userNick + "_hasSns")) {
                //设置登录状态
                self.set("loginStatus",!!result.succ);
                getCommentList(pageParam);

                delete pageParam.sid;

                getCommentCount(pageParam);

                return true;
            } else {

            }
        },


        /**
         * 获取评论数
         * @param param.snsId
         * @param param.feedId
         */
        getCommentCount:function(param) {
         var self = this;
        mtop.commentCount(param, function (recResult) {
            self.set("commentCount", recResult);
        })
        },

        /**
         * 获取评论数据：
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