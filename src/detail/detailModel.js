define(function (require, exports, module) {
        var Backbone = require('backbone'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js');
        cache = require('../common/cache.js');
        CommentModel = require('../comment/commentModel.js');
        AccountModel = require('../account/accountModel.js');

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
        getPageData:function (param) {
            var commentModel = new CommentModel();
            var accountModel = new AccountModel();
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

            function afterProcess(result,param) {
                //获取实时优惠价格
                getPrices(result);

                //获取评论数
                commentModel.getCommentCount(param);

                //获取卖家信息
                var pageParam = _.clone(mtop.pageParam);
                _.extend(pageParam, param);
                pageParam.snsId = result.creatorId;
                delete pageParam.feedId;
                accountModel._biz.info(pageParam,function(result){
                    self.set("accInfo",result);
                });

               //保存详情信息
                self.set({ "feed": result});
            }

            var self = this;
            self.set("status",'sucess');
            var cacheKey = param.snsId+"_" +param.feedId
            var cacheFeed = cache.getItemById(cacheKey);
            if (cacheFeed) {
                afterProcess(cacheFeed,param);
                 return;
            }
            else {
                mtop.getData("mtop.sns.feed.detail", param || {}, function (result) {
                    self.set("feed",result.data);
                    cache.saveItem(cacheKey,result.data);
                     afterProcess(result.data,param);
                }, function (result) {
                       self.set("status",'false');
                  }
                );
            }
    }
});
});