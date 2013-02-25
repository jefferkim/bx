define(function (require, exports, module) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js');

    /**
     * 公共帐号信息页面
     */
    return Backbone.Model.extend({
        //snsId:long
        _biz:{
            info:function (param, fun) {
                mtop.getData("mtop.sns.pubAccount.info", param || {}, function (result) {
                    fun && fun.call(arguments.callee, result.data);
                }, function (result) {
                    fun && fun.call(arguments.callee, {fail:result});
                });
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
                var apiName = param.before ?  "mtop.sns.feed.listBefor" : "mtop.sns.feed.readAndListAfter";
                delete param.before;
                mtop.getData(apiName, param || {}, function (result) {
                    fun && fun.call(arguments.callee, result.data);
                }, function (result) {
                    fun && fun.call(arguments.callee, {fail:result});
                });
            }
        },

        /**
         * 获取帐号数据
         *
         * @param param.curPage  页码
         * @param param.pageSize
         * @param param.snsId
         * @param param.afterTimestamp  可选时传入空值，表示取在该时间之后的Feed
         */
        getPageData:function (param) {

            var self = this;

            self._biz.info({snsId:param.snsId,sid:param.sid},function(result){
                self.set("accInfo",result);
            });

            param || (param = {});

            var pageParam = _.clone(mtop.pageParam);
            _.extend(pageParam, param);

            console.log(pageParam);
            self._biz.feeds(pageParam,function(result){
                self.set("accFeeds",result);

                //获取价格参数
                var ids = [];
                result.totalCount && result.list && result.list.forEach(function(feed){
                    feed.coverTile && feed.coverTile.item && feed.coverTile.item.id && (ids.push(feed.coverTile.item.id));
                });
                mtop.getPrices(_.uniq(ids),function(prices){
                    prices.length && self.set("prices",prices);
                })
            })
        }

    });
});