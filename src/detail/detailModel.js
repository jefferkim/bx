define(function (require, exports, module) {
        var Backbone = require('backbone'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        cache = require('../common/cache.js'),
        h5_comm = require('h5_comm'),
        CommentModel = require('../comment/commentModel.js'),
        AccountModel = require('../account/accountModel.js');

        var refine = require('../common/refine.js')

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
            var self = this;
            function getPrices(result) {
                  //获取价格参数
                var ids = [];

                result.tiles &&  result.tiles.forEach(function(tile){tile.items   && tile.items.length &&
                        tile.items.forEach(function(item){
                              ids.push(item.id); }
                        )
                  });
                  mtop.getPrices(_.uniq(ids),function(prices){
                      prices.length && self.set("prices",prices);
                  })
             }

            function setPageData(result,param) {
                //获取实时优惠价格
                getPrices(result);

                //获取评论数
                var commentModel = new CommentModel();
                commentModel.getCommentCount(param);

                //获取卖家信息
                var accountModel = new AccountModel();
                var pageParam = _.clone(mtop.pageParam);
                _.extend(pageParam, param);
                pageParam.snsId = result.creatorId;
                delete pageParam.feedId;
                accountModel._biz.info(pageParam,function(result){
                    refine.refinePubAccount(result)
                    self.set("accInfo",result);
                });

               //保存详情信息
                self.set({ "feed": result});
            }

            function detail(param, fun) {
                mtop.getData("mtop.sns.feed.detail", param || {}, function (result) {
                    fun && fun.call(arguments.callee, result.data);
                }, function (result) {
                    fun && fun.call(arguments.callee, {fail:result});
                });
            }

            var cacheKey = param.snsId+"_" +param.feedId;
            var cacheFeed = cache.getItemById(cacheKey);
            if (cacheFeed) {
                setPageData(cacheFeed,param);
                 return;
            }
            else {
                 detail(param || {},function(result){
                     console.log('refine detail');
                     refine.refineDetail(result);
                     console.log(result);
                     self.set("feed",result);
                     cache.saveItem(cacheKey,result);
                     setPageData(result,param);
                });
            }
    }
});
});