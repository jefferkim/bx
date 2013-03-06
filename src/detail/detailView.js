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
        h5_base = require('h5_base'),
        router = require('../app/routerNew.js'),
        notification = require('../ui/notification.js')
        CommentModel = require('../comment/commentModel.js')

    var CommentListView = require('../comment/commentListView');

    var headerTemplate  = _.template($('#detail_header_tpl').html());
    var accinfoTemplate = _.template($('#detail_accinfo_tpl').html());
    var contentTemplate = _.template($('#detail_content_tpl').html());

   var detailView = Backbone.View.extend({

        el: '#content',
        model : new _model(),
        events:{
          'click .comment.btn': 'commentList',
          'click .more-content': 'more',
          'click #detailPage .brand': 'naviForAndroid'
        },
        initialize:function () {

            this.$container = $('#detailPage');

            this.model.on('change:feed', this.renderDetail, this);

            this.model.on('change:accInfo', this.renderAccInfo, this);

            this.model.on('change:prices', this.renderPrices, this)

            if (!h5_base.isClient()) {
              this.commentModel = new CommentModel()
              this.commentModel.on('change:commentCount', this.renderComentCount, this)
            }
        },
       goDetail : function(snsId,feedId){

           var that = this;
           that.snsId = snsId;
           that.feedId = feedId;

           var _navbar=$('header.navbar');
           var _detailPage=$('#detailPage');
           _navbar.html(headerTemplate({ href: '#account/' + this.snsId }));
           this.commentModel && this.commentModel.get('commentCount') && this.commentModel.trigger('change:commentCount')

           //判断导航是否已经载入
           if(_navbar.hasClass('iT')){
               _navbar.removeClass('iT').addClass('iC');
           }
           var _show=$('.view-page.show');

           //判断先后关系
           var _commentListPage= $('#commentListPage');

           if(_commentListPage.hasClass('show')){
               _detailPage.removeClass(' iR iL').addClass('iL');
               _show.removeClass('show iC').addClass('iR').wAE(function(){
                   _show.addClass('hide');
               });
           }else{
               _show.removeClass('show iC').addClass('iL').wAE(function(){
                   _show.addClass('hide');
               });
           }


           _detailPage.removeClass('hide');
           setTimeout(function(){
               _detailPage.removeClass(' iR iL').addClass('show iC');
           },0);


           that.model.getPageData({'snsId':snsId,'feedId':feedId})
           this.commentModel.getCommentCount({'snsId':snsId,'feedId':feedId})
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

       renderComentCount: function() {
        var count = this.commentModel.get('commentCount').count
        if (count > 99) count = '99+'

        console.log('comment count', count)
        $('.comment.btn span').text(count)
       },

       more: function(e) {
        e.preventDefault()
        if (h5_base.isClient()) return;

        var feed = this.model.get('feed')
        var url = feed.linkUrl
        var isExternal = feed.linkUrlIsExt
        if (isExternal == 'true') {
          notification.external(url, function() { window.location = url })
        } else {
          window.location = url
        }
       },

       naviForAndroid: function() {
        window.allspark && window.allspark.skipToHome && window.allspark.skipToHome(this.snsId, 1)
       },

        renderPrices: function() {
          var $items = this.$container.find('.media .item')
          var prices = this.model.get('prices')
          for (var i = 0; i < $items.length; i++) {
            var $item = $items.eq(i)
            var id = $item.attr('data-id')
            for (var j = 0; j < prices.length; j++) {
              if (id == prices[j].id) {
                $item.find('.price').text('￥' + prices[j].price).show()
                break;
              }
            }
          }
          console.log('prices', this.model.get('prices'))
        },

        commentList: function() {
            location.hash ='comment/' + this.snsId + '/' + this.feedId + '/1';
        }

    });
    return detailView;
}
);
