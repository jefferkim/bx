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

    var brandTemplate = _.template($('#detail_brand_tpl').html());
    var contentTemplate = _.template($('#detail_content_tpl').html());

   var detailView = Backbone.View.extend({
        className: 'detail',
        model : new _model(),
        events:{

        },
        initialize:function (snsId,feedId) {
          var self = this;
            self.model.bind('change:feed', function(model, s) {
                self.renderDetail();
            }, self);
            self.model.getPageData({'snsId':snsId,'feedId':feedId});
        },
        //渲染详情页
        renderDetail : function(){
          var brand = brandTemplate({});
          var content = contentTemplate({});

          $('.tb-h5').html(this.el);
          this.$el.append(brand);
          this.$el.append(content);

          console.log('render detail!');

          var self = this;
          var feed = self.model.get('feed');
          console.log('render detail! feed='+JSON.stringify(feed));

        }
    });
    return detailView;
}
);
