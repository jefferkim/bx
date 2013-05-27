define(function (require, exports, module) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        cache = require('../common/cache.js'),
        refine = require('../common/refine.js');

    /**
     * 公共帐号信息页面
     */
    return Backbone.Model.extend({
        //snsId:long
        _biz:{

        },



        searchAccount:function(params){
            mtop.searchAccount({keyword:params.keyword,paging:params.paging},function(result){
                console.log(result);

                refine.refinePubAccount(result);

                self.set({"DATA_SearchList":result,silent:true});
                self.trigger('change:searchList');

               // cache.saveAccount(param.snsId,result);

                //self.set("loaded","1");
            });
        },
        /**
         * 获取帐号数据
         *
         * @param param.curPage  页码
         * @param param.pageSize
         * @param param.snsId
         * @param param.afterTimestamp  进入首页的时侯或者刷新的时侯取当前时间点,翻页时可以不传
         * @param param.before  下一页的时侯置为true,上一页不用传递
         */
        getPageData:function (param) {
            var self = this;

            param.exCludInfo||self._biz.info({snsId:param.snsId,sid:param.sid},function(result){
                refine.refinePubAccount(result);
                //FIXME 这这应该写错了吧. wuzhong
                self.set({"accInfo":result,silent:true});
                self.trigger('change:accInfo');

                cache.saveAccount(param.snsId,result);

                self.set("loaded","1");
            });

            param || (param = {});
            var pageParam = _.clone(mtop.pageParam);
            _.extend(pageParam, param);

            //判断是否第一页
            pageParam.isIndex() && (pageParam.before = false);

            self._biz.feeds(pageParam,function(result){
                result.totalCount && result.list && result.list.forEach(function(feed){
                    //feed.coverTile.item={'id':'1500020722928'};
                    //fcache.saveItem(param.snsId+"_"+feed.id,feed);
                });
                refine.refineFeed(result);
                //手动改变数据集，以达到出发change事件

                if(result.fail){
                    self.set("accFeeds",result);
                    return;
                }
                result.a=new Date().getTime();
                self.set("accFeeds",result);

                //获取价格参数
                var ids = [];
                result.totalCount && result.list && result.list.forEach(function(feed){
                    feed.coverTile && feed.coverTile.item && feed.coverTile.item.id&& ids.push(feed.coverTile.item.id);
//                    s.forEach(function(item){
//                        item.id&&ids.push(item.id)
//                    });
                });
                mtop.getPrices(_.uniq(ids),function(prices){
                    prices.length && self.set('prices',{'prices':prices,'t':new Date().getTime()});
                })
                self.set("loaded","1");
            })
        }

    });
});