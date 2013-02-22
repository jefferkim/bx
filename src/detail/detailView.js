/**
 * User: butai
 * Date: 13-2-22
 * Time: AM11:18
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./detailModel');

   var detailView = Backbone.View.extend({

        model : new _model(),
        events:{

        },
        initialize:function (snsId,feedId) {
          var self = this;
            self.model.bind('change:feed', function(model, s) {
                self.renderDetail();
            }, self);
            self.model.getData({'snsId':snsId,'feedId':feedId});
        },
        //渲染详情页
        renderDetail : function(){
         console.log('render detail!');
        }
    });
    return detailView;
}
);
