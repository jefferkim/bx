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
        router = require('../app/routerNew');

    var CommentListView = require('../comment/commentListView')

    var headerTemplate  = _.template($('#detail_header_tpl').html());
    var accinfoTemplate = _.template($('#detail_accinfo_tpl').html());
    var contentTemplate = _.template($('#detail_content_tpl').html());

   var detailView = Backbone.View.extend({

        el: '#content',
        model : new _model(),
        events:{
          'click .comment-list.btn': 'commentList'
        },
        initialize:function (snsId,feedId) {

          this.snsId = snsId
          this.feedId = feedId

          $('header.navbar').html(headerTemplate({}))

          $('.view-page.show').removeClass('show iC').addClass('iL');
          $('#detailPage').removeClass('iL').addClass('show iC');

          this.$container = $('#detailPage')

          this.model.on('change:feed', this.renderDetail, this)
          this.model.on('change:accInfo', this.renderAccInfo, this)

          this.model.getPageData({'snsId':snsId,'feedId':feedId});
        },

        renderAccInfo: function() {
          var accInfo = accinfoTemplate(this.model.get('accInfo'));
          this.$container.prepend(accInfo)

          console.log('detail accInfo', JSON.stringify(this.model.get('accInfo')))
        },

        //渲染详情页
        renderDetail: function() {
          var content = contentTemplate(this.model.get('feed'));
          this.$container.append(content);

          var feed = this.model.get('feed');
          console.log('render detail! feed='+JSON.stringify(feed));
        },

        commentList: function() {
          router.navigate('commentList/' + this.snsId + '/' + this.feedId + '/1', { trigger: true })
        }

    });
    return detailView;
}
);
