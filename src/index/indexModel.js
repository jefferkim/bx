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
    var IndexModel = Backbone.Model.extend({
		  getPageData: function(param){
		  	 var self = this;
			  function getTimeLine(param) {
                mtop.timeLine(param, function (recResult) {
                  console.log(recResult);
                    if(recResult.fail){
                        self.set("timeLine",recResult);
                        return;
                    }
                    recResult.t=new Date().getTime();
                    self.set("timeLine", recResult);

                    //self.set("loaded","1");
                })
            }
			getTimeLine(param);
		  },
		
    });

    return IndexModel;
});