/**
 * User: butai
 * Date: 13-2-22
 * Time: AM11:18
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./indexModel'),
        cdn = require('cdn'),
        h5_base = require('h5_base'),
        uriBroker = require('uriBroker'),
        loading = require('../ui/loading');
  



   var detailView = Backbone.View.extend({

        el: '#indexPage',
        model : new _model(),
        events:{
          
        },
        initialize:function () {
            this.model.on('change:params', this.queryFeeds, this);
           
        },
		render:function(){
			var params={
				timestamp:0,//Date.now(),
				curPage:1,
				pageSize :20,
				onlyYou:1,
				direction:0
			};
			this.model.getPageData(params);
		},
       queryFeeds : function(par){
	   	
	   	 this.model.getPageData(par);
 		}

    });
    return detailView;
}
);
