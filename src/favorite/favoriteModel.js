define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js');
     
    /**
     * 动态首页
     */
    var FavoriteModel = Backbone.Model.extend({
		  favoriteFeeds:function (param) {
		  	var self=this;
             mtop.favoriteFeeds(param, function (recResult) {
                  console.log(recResult);
                    if(recResult.fail){                       
						recResult.errMsg='服务器繁忙，请稍后再试！';
						 self.set("feedsList",recResult);
                        return;
                    }
                    recResult.t=new Date().getTime();
                    self.set("feedsList", recResult);                   
                })
            },
			addFeed:function (param) {
				var self=this;
                mtop.favoriteAddFeed(param, function (recResult) { 
                    if(recResult.fail){						
						if(recResult.fail.indexOf('FAIL_BIZ_SNS_FAVORITE_ALREADY_FAVORITE')>-1)	{
						recResult.errMsg="对不起，该广播您已经收藏过！";
					}else if(recResult.fail.indexOf('FAIL_BIZ_SNS_FAVORITE_NOT_EXSIT')> -1){
						recResult.errMsg="对不起，该广播不存在！";
					}else{
						recResult.errMsg='服务器繁忙，请稍后再试！';
					}	
                        self.set("favStatus",recResult);
                        return;
                    }
                    recResult.t=new Date().getTime();
                    self.set("favStatus", recResult);                   
                })
            },
			removeFeed:function (param) {
				var self=this;
                mtop.favoriteRemoveFeed(param, function (recResult) { 
                    if(recResult.fail){	
						recResult.errMsg='服务器繁忙，请稍后再试！';
                        self.set("favStatus",recResult);
                        return;
                    }
                    recResult.t=new Date().getTime();
                    self.set("favStatus", recResult);
                })
            }
		
    });

    return FavoriteModel;
});