define(function (require, exports, module) {
    var h5_mtop = require('h5_mtop'),
        h5_comm = require("h5_comm"),
        //base64 = require('base64'),
        h5_cache = require('h5_cache'),
        uriBroker = require('uriBroker'),
        $ = require('zepto'),
//        _ = require('underscore'),
        tbh5 = require('h5_base'),
        cookie = require('cookie');

    /**
     * motp api简单的封装
     * @param apiName
     * @param param
     * @param successF
     * @param failF
     */
    var getData = exports.getData = function (apiName, param, successF, failF) {
        //调用mtop 接口
        h5_mtop.getApi(apiName, '2.0', param, {},
            function (result) {
                //处理正常的返回
                h5_comm.dealResponse(result, function (result) {
                        successF.call(this, result);
                    }, function (result) {
                        failF.call(this, result);
                    },
                    "h5_allspark"
                );
            }, function (result) {
                failF.call(this, result);
            });
    };


    function convertIds(ids) {
        if (ids.join) {
            return {snsIds:ids.join(":")};
        }
        return {snsIds:ids};
    }

    /**
     * mtop.sns.follow.pubAccount.add 关注账号
     需用户登录
     入参：
     sid
     snsIds: string snsId:snsId
     出参：
     BatOperationResult
     业务异常：sid不存在对应的snsAccount，snsId不存在，snsId已经被关注
     mtop.sns.follow.pubAccount.remove 取消关注账号
     需用户登录
     入参：
     sid
     snsIds:long[]
     出参：
     BatOperationResult
     业务异常：sid不存在对应的snsAccount，snsId不存在，snsId未被关注
     */
    /**
     *
     * @param ids 可以为数字，字符串，或者数组
     * @param successF
     * @param failF
     */
    exports.addAccount = function (ids, successF, failF) {
        this.getData("mtop.sns.follow.pubAccount.add", convertIds(ids), successF, failF)
    }
    exports.removeAccount = function (ids, successF, failF) {
        this.getData("mtop.sns.follow.pubAccount.remove", convertIds(ids), successF, failF)
    }

    //TODO get form cookie
    exports.userNick =h5_comm.getNickFromHidden();
    exports.pageParam = {
        curPage:1,
        pageSize:3,
        isIndex:function () {
            return  1 == this.curPage;
        }
    };

    function invokeApi(apiName, param, fun) {
        getData(apiName, param || {}, function (result) {
            fun && fun.call(arguments.callee, result.data);
        }, function (result) {
            fun && fun.call(arguments.callee, {fail:result});
        });
    }

    exports.recommends = function (param, fun) {
        invokeApi("mtop.transformer.pubAccount.recommends", param, fun);
    };

    exports.my = function (param, fun) {
        invokeApi("mtop.sns.follow.pubAccount.my", param, fun);
    };

    exports.listWithFirstFeed = function (param, fun) {
        invokeApi("mtop.sns.pubAccount.listWithFirstFeed", param, fun);
    };


    /**----------------------评论相关---------------------------------------*/
    exports.commentCount  = function (param, fun) {
        invokeApi("mtop.sns.comment.count", param, fun);
    };

    exports.addComment = function (param, fun) {
        invokeApi("mtop.sns.comment.new", param, fun);
    };

    exports.commentList  = function (param, fun) {
        invokeApi("mtop.sns.comment.list", param, fun);
    };


    var priceCache = {};
    uriBroker.URL_CONSTANTS.path['s_price'] || (uriBroker.URL_CONSTANTS.path['s_price'] = 'search_turn_page_iphone.htm');
    /**
     * @param ids
     *   eg: [1],[1,2]
     */
    exports.getPrices = function (ids, fun) {
        var result = [];
        var uncachedIds = [];
        ids.forEach(function (id) {
            if (priceCache[id]) {
                result.push({id:id, price:priceCache[id]});
            } else {
                uncachedIds.push(id);
            }
        });
        if (uncachedIds.length) {
            $.ajax({
                type:'GET',
                dataType:'json',
                url:uriBroker.getUrl("s_price", {nid:uncachedIds.join(",")}) + "&callback=?",
                success:function (sret) {
                    if (sret.result && "true" == sret.result && sret.listItem) {
                        sret.listItem.forEach(function (item) {
                            priceCache[item.itemNumId] = item.price;
                            result.push({id:item.itemNumId, price:item.price});
                        })
                    }
                    fun && fun.call(arguments.callee, result);
                },
                error:function (error) {
                    console.log(error);
                    fun && fun.call(arguments.callee, result);
                }
            });
        } else {
            fun && fun.call(arguments.callee, result);
        }
    }

})
;