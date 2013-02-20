define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        base64 = require('base64'),
        h5_comm = require('h5_comm'),
        h5_cache = require('h5_cache'),
        cookie = require('cookie');

    /**
     * 个人信息页面
     */
    return Backbone.Model.extend({

        /**
         * 获取首页数据：
         *
         * @param param.curPage  页码
         * @param param.type 列表类型
         *             1. 关注列表 acc
         *             2. 推荐 rec
         */
        getPageData:function (param) {

            var self = this;

            param || (param = {});
            var type = param.type || 1;

            var pageParam = _.clone(mtop.pageParam);
            _.extend(pageParam, param);

            delete pageParam.type;

            console.log(pageParam);

            if (1 == type) {
                mtop.listWithFirstFeed(
                    pageParam, function (accResult) {
                        self.set("accWithFeed", accResult);
                    });

            } else {
                mtop.recommands(pageParam, function (recResult) {
                    self.set("recommands", recResult);
                })

            }

        }

    });
});