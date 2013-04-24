define(function (require, exports, module) {
    var h5_mtop = require('h5_mtop'),
        h5_comm = require("h5_comm"),
        //base64 = require('base64'),
        h5_cache = require('h5_cache'),
        uriBroker = require('uriBroker'),
        $ = require('zepto'),
        cookie = require('cookie'),
        cache = require('../common/cache.js');

    /**
     * motp api简单的封装
     * @param apiName
     * @param param
     * @param successF
     * @param failF
     */
    var getData = exports.getData = function (apiName, param, successF, failF) {
        //调用mtop 接口
        h5_mtop.getApi(apiName, '2.0', param, {'ap_ref':window.location.hash},
            function (result) {
                //处理正常的返回
                h5_comm.dealResponse(result, function (result) {
                        successF && successF.call(this, result);
                    }, function (result) {
                        failF &&  failF.call(this, result);
                    },
                    "h5_allspark"
                );
            }, function (result) {
                failF.call(this, result);
            });
    };

    function invokeApi(apiName, param, fun) {
        getData(apiName, param || {}, function (result) {
            fun && fun.call(arguments.callee, result.data);
        }, function (result) {
            fun && fun.call(arguments.callee, {fail:result});
        });
    }

    function convertIds(ids) {
        if (ids.join) {
            return {snsIds:ids.join(":")};
        }
        return {snsIds:ids};
    }

    //TODO get form cookie
    var userNick = exports.userNick = (h5_comm.getNickFromCookie() || h5_comm.getNickFromHidden() || (h5_comm.isLogin() ? "欢迎您":"")) ;
    exports.pageParam = {
        curPage:1,
        pageSize:3,
        isIndex:function () {
            return  1 == this.curPage;
        }
    };

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
        this.getData("mtop.sns.follow.pubAccount.add", convertIds(ids), successF, failF);
    }
    exports.removeAccount = function (ids, successF, failF) {
        this.getData("mtop.sns.follow.pubAccount.remove", convertIds(ids), successF, failF)
    }

    exports.info = function (param, fun) {
      //  var cacheAccount = cache.getAccountById(param.snsId);
        //cacheAccount=false;
        // if (cacheAccount) {
        //  fun && fun.call(arguments.callee, cacheAccount);
        //} else {
            invokeApi("mtop.sns.pubAccount.info", param, function (result) {
                result.fail || cache.saveAccount(param.snsId, result);
                fun && fun.call(arguments.callee, result);
            });
        //}
    };

    /**
     * mtop.sns.pubAccount.allFeedCount 我订阅的公共账号所有消息数
        需用户登录
        出参：所有消息数:long
     * @param param
     * @param fun
     */
    exports.allFeedCount = function(successF, failF){
        this.getData("mtop.sns.pubAccount.allFeedCount", {}, successF, failF)
    };

    exports.listBefore = function (param, fun) {
        invokeApi("mtop.sns.feed.listBefore", param, fun);
    };

    exports.readAndListAfter = function (param, fun) {
        invokeApi("mtop.sns.feed.readAndListAfter", param, fun);
    };

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
    /**
    exports.commentCount = function (param, fun) {
        var key =param.snsId+"_"+ param.feedId ;
        var count = cache.getCommCountById(key);
        if(count)
        {
         fun && fun.call(arguments.callee, count) ;
        }
        else
        {
        invokeApi("mtop.sns.comment.count", param,
            function (result) {
                result.fail || cache.saveCommCount(key, result);
                fun && fun.call(arguments.callee, result)
            }
        );
    }
    };
     **/
    exports.addComment = function (param, fun) {
        invokeApi("mtop.sns.comment.new", param, fun);
    };

    exports.commentList = function (param, fun) {
        invokeApi("mtop.sns.comment.list", param,
            function (result) {
                if(!result.fail)
                {
                    //将评论数更新到详情的缓存中
                    var key = param.snsId+"_"+param.feedId;
                    var feed = cache.getItemById(key) ;
                    if(feed)
                    {
                        if( typeof (feed) == "string") {
                            feed = JSON.parse(feed);
                        }
                        feed['commentCount'] = result.totalCount || 0;

                        cache.saveItem( key,feed);
                    }
                }
                fun && fun.call(arguments.callee, result)
            }
        );
    };

    /**----------------------详情相关---------------------------------------*/
    exports.detail = function (param, fun) {
        invokeApi("mtop.sns.feed.detail", param, fun);
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

    exports.autoCreate = function(){
//        this.userNick = "test";
        var nick = this.userNick;
        if(this.userNick && !cache.isCreateSns(this.userNick)){
            h5_mtop.getApi("mtop.transformer.account.autoCreate", '2.0', {}, {},
                function (result) {
                    //处理正常的返回
                    var ret = result.ret.toString().toUpperCase();
                    if(ret.indexOf('SUCCESS::') > -1)
                    {
                    cache.saveSnsFlag(nick);
                    }
                }, function (result) {

                });
        }
    },
	/* -----------------feed相关----------------------  */
	exports.timeLine=function(param, fun){
		 invokeApi("mtop.sns.pubAccount.getTimeLine", param, fun);
	},
	exports.hotFeeds=function(param, fun){
		 invokeApi("mtop.sns.pubAccount.hotFeeds", param, fun);
	},
	exports.favoriteFeeds  =function(param, fun){
		 invokeApi("mtop.sns.favorite.feeds", param, fun);
	},
	exports.favoriteAddFeed =function(param, fun){
		 invokeApi("mtop.sns.favorite.addFeed", param, fun);
	},
	exports.favoriteRemoveFeed  =function(param, fun){
		 invokeApi("mtop.sns.favorite.removeFeed", param, fun);
	}
})
;