define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        mtop = require('../common/mtopForAllspark.js');

    /**
     * 动态首页
     */
    var IndexModel = Backbone.Model.extend({
		  getTimeLine:function (param) {
		  	var self=this;
                mtop.timeLine(param, function (recResult) {
                  console.log(recResult);
                    if(recResult.fail){                       
						recResult.errMsg='服务器繁忙，请稍后再试！';
						 self.set("timeLine",recResult);
                        return;
                    }
                    recResult.t=new Date().getTime();
                    self.set("timeLine", recResult);
                    //self.set("loaded","1");
                })
            },
			hotFeeds:function (param) {
				var self=this;
                mtop.hotFeeds(param, function (recResult) { 
                    if(recResult.fail){						
						recResult.errMsg='服务器繁忙，请稍后再试！';
                        self.set("hotFeeds",recResult);
                        return;
                    }
                    recResult.t=new Date().getTime();
                    self.set("hotFeeds", recResult);
                    //self.set("loaded","1");
                })
            },
			getReplyCount:function (param) {
				var self=this;
                mtop.recommendsReplyCount(param, function (recResult) {
					//console.log(recResult); 
                    if(recResult.fail){						
						recResult.errMsg='服务器繁忙，请稍后再试！';
						recResult.t=new Date().getTime();
                        self.set("replyCount",recResult);
                        return;
                    }
                    recResult.t=new Date().getTime();
                    self.set("replyCount", recResult);
                    //self.set("loaded","1");
                })
            }
		
    });

    return IndexModel;
});