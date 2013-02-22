define(function (require, exports, module) {
        var Backbone = require('backbone'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js');
        cache = require('../common/cache.js')

    /**
     * 详情页面
     */
    return Backbone.Model.extend({
        /**
         * mtop.sns.feed.detail Feed详情
         用户登录可选
         入参：
         snsId: string
         feedId:string
         出参：
         BatOperationResult feed详情
         业务异常：sid不存在对应的snsAccount，feed不存在，sid没有权限，
         返回特定错误码(FAIL_DOWNGRADED)表示被降级
           */
        getData:function (param) {

            function getPrices(result) {
                  //获取价格参数
                  var ids = [];
                  result.tiles.forEach(function(tile){tile.items   && tile.items.length &&
                        tile.items.forEach(function(item){
                              ids.push(item.id); }
                        )
                  });
                  mtop.getPrices(_.uniq(ids),function(prices){
                      prices.length && self.set("prices",prices);
                  })
             }

            /**
             * 获取评论数
             * @param param.snsId
             * @param param.feedId
             */
            function getCommentCount(param) {
                mtop.commentCount(param, function (recResult) {
                    self.set("commentCount", recResult);
                })
            }

            var self = this;
            self.set("status",'sucess');
            var cacheKey = param.snsId+"_" +param.feedId
            var cacheFeed = cache.getItemById(cacheKey);
            if (cacheFeed) {
                self.set({
                        "feed": cacheFeed
                    });
                    //获取实时优惠价格
                    getPrices(cacheFeed);
                   //获取评论数
                     getCommentCount(param);
                    return;
            }
            else {
                mtop.getData("mtop.sns.feed.detail", param || {}, function (result) {
                    self.set("feed",result.data);
                    cache.saveItem(cacheKey,result.data);
                    //获取实时优惠价格
                    getPrices(result.data);
                     //获取评论数
                    getCommentCount(param);
                }, function (result) {
                       self.set("status",'false');
                  }
                );
            }
    }
});
});