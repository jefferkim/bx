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
                pageSize:3
            },
            bannerUrl:"/w_Wireless/webapp/transformer/test/banner.json",
            banner:function (fun) {
                var banner = h5_cache.getValue("allspark", "banner");
                //banner有效
                if (banner && banner.list && banner.lastUpdate && (Date.now() - banner.lastUpdate) < (1000 * 60 * 10)) {
                    fun && fun.call(arguments.callee, banner.list);
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
                            fun && fun.call(arguments.callee, result);
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
         * @param param.type 列表类型，推荐 rec 或者关注列表 acc
         */
        getAppData:function (param) {

            var biz = this._biz;
            var self = this;

            var pageParam = _.clone(biz.pageParam);
            param || (param = {});
            var type = param.type || "rec";
            delete param.type;
            if (param.order) {
                self.order = param.order;
            } else {
                param.order = self.order || "fans";
            }
            _.extend(pageParam, param);
            console.log(pageParam);

            /**
             * 更新推荐排序规则
             * @param param.order
             * @param param.curPage  页码
             */
            function getRecommands(param) {
                biz.recommands(pageParam, function (recResult) {
                    self.set("recommands", recResult);
                })
            }

            //首页
            if (1 == pageParam.curPage) {
                biz.banner(function (result) {
                    self.set("banner", result);
                });
                //logined user
                biz.autocreate(function (result) {
                    //successful
                    if (result.succ) {
                        biz.listWithFirstFeed(
                            pageParam, function (accResult) {
                                self.set("accWithFeed", accResult);
                                if (accResult.totalCount || accResult.totalCount <= 1) {
                                    getRecommands.call(this, pageParam);
                                }
                            })
                    } else {
                        getRecommands.call(this, pageParam);
                    }
                },pageParam)
                //翻页处理
            } else {
                if (type == "rec") {
                    getRecommands.call(this, pageParam);
                } else if (type == "acc") {
                    biz.listWithFirstFeed(
                        pageParam, function (accResult) {
                            self.set("accWithFeed", accResult);
                        })
                }
            }
        }

    });

    return DynIndexModel;
});