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
            var self = this;
            mtop.searchAccount({keywords:params.keywords,curPage:params.curPage,pageSize:params.pageSize},function(result){


                refine.refinePubAccount(result);
                console.log(result);

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

            param || (param = {});
            var type = param.type || 1;

            var pageParam = _.clone(mtop.pageParam);
            _.extend(pageParam, param);



                mtop.searchAccount(param, function (resp) {

                    resp.a=new Date().getTime();
                    refine.refineRecommend(resp);
                    self.set("recommends", resp);

                    self.set("loaded","1");
                })



        }



    });
});