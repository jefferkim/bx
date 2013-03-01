/**
 * User: butai
 * Date: 13-2-22
 * Time: AM11:18
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./detailModel'),
        router = require('../app/routerNew.js')

        console.log('router', router)

    var CommentListView = require('../comment/commentListView');

    var headerTemplate  = _.template($('#detail_header_tpl').html());
    var accinfoTemplate = _.template($('#detail_accinfo_tpl').html());
    var contentTemplate = _.template($('#detail_content_tpl').html());

   var detailView = Backbone.View.extend({

        el: '#content',
        model : new _model(),
        events:{
          'click .comment-list.btn': 'commentList'
        },
        initialize:function () {

            var that = this;
            that.$container = $('#detailPage');

            that.model.on('change:feed', this.renderDetail, this);

            that.model.on('change:accInfo', this.renderAccInfo, this);


        },
       goDetail : function(snsId,feedId){

           var that = this;
           that.snsId = snsId;
           that.feedId = feedId;
           $('header.navbar').html(headerTemplate({}));

           $('.view-page.show').removeClass('show iC').addClass('iL');
           $('#detailPage').removeClass('iL').addClass('show iC');

           that.model.getPageData({'snsId':snsId,'feedId':feedId});

       },
        renderAccInfo: function() {
          var accInfo = accinfoTemplate($.extend(this.model.get('accInfo'), { snsId: this.snsId }))
          this.$container.find('.account').html(accInfo);

          console.log('detail accInfo', JSON.stringify(this.model.get('accInfo')))
        },

        //渲染详情页
        renderDetail: function() {
          var content = contentTemplate(this.model.get('feed'));
          this.$container.find('.main').html(content);

          var feed = this.model.get('feed');
          console.log('render detail! feed='+JSON.stringify(feed));
        },

        commentList: function() {
            location.hash ='comment/' + this.snsId + '/' + this.feedId + '/1';
        }

    });
    return detailView;
}
);
