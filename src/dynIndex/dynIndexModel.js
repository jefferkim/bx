define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js'),
        h5_comm = require('h5_comm'),
        cache = require('../common/cache'),
        refine = require('../common/refine.js');

    /**
     * 动态首页
     */
    var DynIndexModel = Backbone.Model.extend({

        /**
         * 私有对象，封装了简单的业务逻辑
         */
        _biz:{
            bannerUrl:"http://wapa.taobao.com/channel/rgn/mobile/h5-home.html?callback=?",
            banner:function (fun) {
                var banner = cache.getIndexTms();
                //banner有效
                if (banner) {
                    fun && fun.call(arguments.callee, JSON.parse(banner));
                } else {
                    $.ajax({
                        type:'GET',
                        dataType:'json',
                        url:this.bannerUrl,
                        success:function (result) {
                            var _banner = {
                                list:result,
                                lastUpdate:Date.now()
                            }
                            cache.saveIndexTms(JSON.stringify(_banner));
                            fun && fun.call(arguments.callee, _banner);
                        },
                        error:function (error) {
                            console.log(error);
                            fun && fun.call(arguments.callee, null);
                        }
                    });
                }
            },
            autocreate:function (fun, param) {
                if (mtop.userNick && cache.isCreateSns(mtop.userNick)) {
                    fun && fun.call(arguments.callee, {succ:true});
                    return true;
                } else if(h5_comm.isLogin()){
                    mtop.getData("mtop.transformer.account.autoCreate", param || {}, function (result) {
                        cache.saveSnsFlag(mtop.userNick);
                        fun && fun.call(arguments.callee, {succ:true});

                    }, function (result) {
                        fun && fun.call(arguments.callee, {fail:result});
                    });
                }
                else
                {
                       fun && fun.call(arguments.callee, {fail:'未登录'});
                }
            }
        },

        /**
         * 获取首页数据：
         *
         * @param param.order
         * @param param.curPage  页码
         * @param param.type 列表类型
         *             1. 关注列表 acc
         *             2. 推荐 rec
         */
        getPageData:function (param) {

            var biz = this._biz;
            var self = this;



            /**
             * 更新推荐排序规则
             * @param param.order
             * @param param.curPage  页码
             */
            function getrecommends(param) {
                mtop.recommends(param, function (recResult) {
                    refine.refineRecommend(recResult);
                    self.set("recommends", recResult);
                })
            }
            /**
             * 获取公共账号列表
             * @param param
             */
            function getPubAccounts(param, fun) {
                mtop.listWithFirstFeed(
                    param, function (accResult) {

                        self.set("accWithFeed", accResult);
                        fun && fun.call(arguments.callee, accResult);
                    })
            }

            param || (param = {});
            var type = param.type || 1;

            if (param.order) {
                self.order = param.order;
            } else {
                param.order = self.order || "fans";
            }

            var pageParam = _.clone(mtop.pageParam);
            _.extend(pageParam, param);

            delete pageParam.type;

            //首页
            pageParam.isIndex() && biz.banner(function (result) {
                (!self.get("banner") || result.lastUpdate != self.get("banner").lastUpdate ) && self.set("banner", result);
            });



            //自动创建账号
            biz.autocreate(function (result) {
                //设置用户登录状态

                self.set("loginStatus",result.succ);

                //登录状态有关注账号列表或者推荐列表的
                if (result.succ && 1 == type) {

                    getPubAccounts(pageParam, pageParam.isIndex() ? function (accResult) {
                        if (accResult.totalCount || accResult.totalCount <= 1) {
                            getrecommends(pageParam);
                        }
                    } : null);
                } else {
                    //未登录只有推荐列表了
                    getrecommends(pageParam);
                }
                //TODO 处理sid的问题,方便单元测试
            }, pageParam && pageParam.sid ? {sid:pageParam.sid} : null);


        }

    });

    return DynIndexModel;
});