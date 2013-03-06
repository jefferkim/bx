define(function (require, exports, module) {
        var Backbone = require('backbone'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        cache = require('../common/cache.js'),
        h5_comm = require('h5_comm'),
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

                /**
                 * 获取页面其他绑定数据
                 * @param result
                 * @param param
                 */
                function setPageData(result,param) {
                    //获取实时优惠价格
                    getPrices(result);
                    //获取账号信息
                    var cacheAccount = cache.getAccountById(result.creatorId);
                    if (cacheAccount){
                         self.set("accInfo",cacheAccount);
                    }else{
                            //获取卖家信息
                            var pageParam = _.clone(mtop.pageParam);
                            _.extend(pageParam, param);
                            pageParam.snsId = result.creatorId;
                            delete pageParam.feedId;
                            var accountModel = new AccountModel();
                            accountModel._biz.info(pageParam,function(result){
                            refine.refinePubAccount(result);
                            self.set("accInfo",result);
                            cache.saveAccount(pageParam.snsId,result);
                           });
                    }
                }

                //获取详情
                var cacheFeed = cache.getItemById(param.feedId);
                if (cacheFeed) {
                    //保存详情信息
                    self.set( "feed", result);
                    setPageData(cacheFeed,param);
                     return;
                }else {
                    mtop.detail(param || {},function(result){
                         console.log('refine detail');
                         refine.refineDetail(result);
                         console.log(result);
                         self.set("feed",result);
                         cache.saveItem(param.feedId,result);
                         setPageData(result,param);
                    });
                }
        }
});
});