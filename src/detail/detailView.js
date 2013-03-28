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
        cdn = require('cdn'),
        h5_base = require('h5_base'),
        uriBroker = require('uriBroker'),
        loading = require('../ui/loading'),
        notification = require('../ui/notification.js'),
        CommentModel = require('../comment/commentModel.js')

    var headerTemplate  = _.template($('#detail_header_tpl').html());
    var accinfoTemplate = _.template($('#detail_accinfo_tpl').html());
    var contentTemplate = _.template($('#detail_content_tpl').html());

    getBetterImg = cdn.getBetterImg // make it global for convenience use in templates
    getItemDetailUrl = uriBroker.getUrl

   var detailView = Backbone.View.extend({

        el: '#content',
        model : new _model(),
        events:{
          'click .to-comment-list': 'commentList',
          'click .more-content': 'more',
          'click #detailPage .brand': 'toAccountPage'
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
       goDetail : function(snsId,feedId,page){

          //this.$container.find('.account').empty()
          this.$container.find('.main').empty()

           if(!h5_base.isClient() || h5_base.isAndroidClient()) {
               //loading.show();
               this.$container.find('.main').html('<div class="loading"><span class="spinner"></span></div>');
           }

           var that = this;
           that.snsId = snsId;
           that.feedId = feedId;
           that.page=page;
           window.scrollTo(0,1);
           var _navbar=$('header.navbar');
           var _detailPage=$('#detailPage');
           _navbar.html(headerTemplate({ href: '#account/' + this.snsId+'/'+this.page }));
           this.commentModel && this.commentModel.get('commentCount') && this.commentModel.trigger('change:commentCount')

           //判断导航是否已经载入
           if(_navbar.hasClass('iT')){
               _navbar.removeClass('iT').addClass('iC');
           }
           var _show=$('.view-page.show');
           //客户端 去掉动画
           if(_show.length==0){
               _detailPage.removeClass(' iR iL');
           }

           //判断先后关系
           var _commentListPage= $('#commentListPage');

           if(_commentListPage.hasClass('show')){
               _detailPage.removeClass(' iR iL').addClass('iL');
               _show.removeClass('show iC').addClass('iR').wAE(function(){
                   _show.addClass('hide');
               });
           }else{
               if(_show.attr('id')!='detailPage'){
                   _show.removeClass('show iC').addClass('iL').wAE(function(){
                       _show.addClass('hide');
                   });
               }
           }


           _detailPage.removeClass('hide');
           setTimeout(function(){
               _detailPage.removeClass(' iR iL').addClass('show iC');
           },0);

           that.model.getPageData({'snsId':snsId,'feedId':feedId})
           this.commentModel &&  this.commentModel.getCommentCount({'snsId':snsId,'feedId':feedId})

       },
        renderAccInfo: function() {
            var infodata=$.extend(this.model.get('accInfo'),{ snsId: this.snsId });
            var accInfo = accinfoTemplate(infodata);
            if(this.$container.find('.account .follow').length>0){
                if(infodata.fansCount==0){
                    this.$container.find('.account .follow').html('还没有人关注');
                }else{
                    this.$container.find('.account .follow').html('<span class="count">'+infodata.fansCount+'</span> 关注者');
                }
            }else{
                this.$container.find('.account').html(accInfo);
            }

          console.log('detail accInfo', JSON.stringify(this.model.get('accInfo')))
        },

        //渲染详情页
        renderDetail: function() {
          var self = this
          var feed = this.model.get('feed');

            if(!h5_base.isClient() || h5_base.isAndroidClient()) {
                //loading.hide();
            }

          if (feed&&feed.fail) {
            this.model.set('feed', {}, { silent: true })
            notification.message("请稍后重试");
            this.$container.find('.main').html('加载失败，稍后重试！');
            return
          }

          // this is for Android
          $('#content')[0].style.minHeight = '360px'

            console.log('render detail! feed='+JSON.stringify(feed));
          var content = contentTemplate(feed);
          this.$container.find('.main').html(content);


        },

       renderComentCount: function() {
        var count = this.commentModel.get('commentCount').count
        if (count > 99) count = '99+'

        console.log('comment count', count)
        $('.comment .btn span').text(count)
       },

       more: function(e) {
        e.preventDefault()

        var feed = this.model.get('feed')
        var url = feed.linkUrl
        var isExternal = feed.linkUrlIsExt

        if (h5_base.isClient()) {
          window.location = url
          return
        }

        if (isExternal == 'true') {
          notification.external(url, function() { window.open(url, '_blank') })
        } else {
          window.location = url
        }
       },

       toAccountPage: function(e) {

        if (h5_base.isClient()) {
          e.preventDefault()
          location.href = location.protocol+'//'+location.hostname + location.pathname + '#account/' + this.snsId + '/' + this.page
        }

        // if (h5_base.isClient() && window.allspark) {
        //   e.preventDefault()
        //   window.allspark.skipToHome && window.allspark.skipToHome(this.snsId, 1)
        // }
       },
        renderPrices: function() {
          var $items = this.$container.find('.media .item')
          var prices = this.model.get('prices')
          for (var i = 0; i < $items.length; i++) {
            var $item = $items.eq(i)
            var id = $item.attr('data-id')
            for (var j = 0; j < prices.length; j++) {
              if (id == prices[j].id) {
                $item.find('.price').text(prices[j].price + '元').show()
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
