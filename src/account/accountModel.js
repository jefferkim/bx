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
            info:function (param, fun) {
                mtop.info(param,fun);
            },
            /**
             * 入参：sid, snsId, afterTimestamp(可选时传入空值，表示取在该时间之后的Feed)，获取数量（totalCount：int）
             分页信息(起始记录数,每页条数,时间戳(可选)) paging:Pagination
             出参：PaginationResult<Feed> (feed列表，after总数)
             [Feed对象包含字段有  id; title; coverTile; commentCount; long time; 子对象包含所有字段]
             业务异常：sid不存在对应的snsAccount，snsId不存在，sid没有权限，返回特定错误码(FAIL_DOWNGRADED)表示被降级
             * @param param
             * @param fun
             */
            feeds:function(param, fun){
                param.before ? mtop.listBefore(param, fun) : mtop.readAndListAfter(param, fun);
                delete param.before;
            }
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