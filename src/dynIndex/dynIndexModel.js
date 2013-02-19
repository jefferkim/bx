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
     * 动态首页
     */
    var DynIndexModel = Backbone.Model.extend({

        /**
         * 私有对象，封装了简单的业务逻辑
         */
        _biz:{
            //TODO get form cookie
            userNick:cookie.getCookie('usernick'),
            pageParam:{
                curPage:1,
                pageSize:3,
                isIndex:function(){
                    return  1 ==  this.curPage;
                }
            },
            bannerUrl:"/w_Wireless/webapp/transformer/test/banner.json",
            banner:function (fun) {
                var banner = h5_cache.getValue("allspark", "banner");
                //banner有效
                if (banner && banner.list && banner.lastUpdate && (Date.now() - banner.lastUpdate) < (1000 * 60 * 10)) {
                    fun && fun.call(arguments.callee, banner);
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
                            h5_cache.pushValue("allspark", "banner", _banner);
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
                if (this.userNick && h5_cache.getValue("allspark", this.userNick + "_hasSns")) {
                    fun && fun.call(arguments.callee, {succ:true});
                    return true;
                } else {
                    mtop.getData("mtop.transformer.account.autoCreate", param || {}, function (result) {
                        fun && fun.call(arguments.callee, {succ:true});
                    }, function (result) {
                        fun && fun.call(arguments.callee, {fail:result});
                    });

                }
            },

            recommands:function (param, fun) {
                mtop.getData("mtop.transformer.pubAccount.recommands", param || {}, function (result) {
                    fun && fun.call(arguments.callee, result.data);
                }, function (result) {
                    fun && fun.call(arguments.callee, {fail:result});
                });
            },

            listWithFirstFeed:function (param, fun) {
                mtop.getData("mtop.sns.pubAccount.listWithFirstFeed", param || {}, function (result) {
                    fun && fun.call(arguments.callee, result.data);
                }, function (result) {
                    fun && fun.call(arguments.callee, {fail:result});
                });
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
         * @param param.listOnly 只需要列表
         */
        getPageData:function (param) {

            var biz = this._biz;
            var self = this;

            /**
             * 更新推荐排序规则
             * @param param.order
             * @param param.curPage  页码
             */
            function getRecommands(param) {
                biz.recommands(param, function (recResult) {
                    self.set("recommands", recResult);
                })
            }

            /**
             * 获取公共账号列表
             * @param param
             */
            function getPubAccounts(param, fun) {
                biz.listWithFirstFeed(
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

            var pageParam = _.clone(biz.pageParam);
            _.extend(pageParam, param);

            delete pageParam.type;
            delete pageParam.listOnly;

            console.log(pageParam);

            //自动创建账号
            biz.autocreate(function (result) {
                //登录状态有关注账号列表或者推荐列表的
                if (result.succ && 1 == type) {
                    getPubAccounts(pageParam, pageParam.isIndex() ? param.listOnly ? null : function (accResult) {
                        if (accResult.totalCount || accResult.totalCount <= 1) {
                            getRecommands(pageParam);
                        }
                    } : null);
                } else {
                    //未登录只有推荐列表了
                    getRecommands(pageParam);
                }
                //TODO 处理sid的问题,方便单元测试
            }, pageParam && pageParam.sid ? {sid:pageParam.sid} : null);

            //首页
            pageParam.isIndex() && !param.listOnly && biz.banner(function (result) {
                (!self.get("banner") || result.lastUpdate != self.get("banner").lastUpdate ) && self.set("banner", result);
            });
        }

    });

    return DynIndexModel;
});