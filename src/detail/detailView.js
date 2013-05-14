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
        favUtils = require('../common/favUtils.js'),
        notification = require('../ui/notification.js');

    var headerTemplate  = _.template($('#detail_header_tpl').html());
    var accinfoTemplate = _.template($('#detail_accinfo_tpl').html());
    var contentTemplate = _.template($('#detail_content_tpl').html());

    getBetterImg = cdn.getBetterImg // make it global for convenience use in templates
    getItemDetailUrl = uriBroker.getUrl

   var detailView = Backbone.View.extend({

        el: '#content',
        model : new _model(),
        events:{
          'click  .to-comment-list': 'commentList',
          'click  .more-content': 'more',
          'click #detailPage .brand': 'toAccountPage',
          'click #detailPage .favbtn':'favbtn'
        },
        initialize:function () {

            this.$container = $('#detailPage');

            this.model.on('change:feed', this.renderDetail, this);

            this.model.on('change:accInfo', this.renderAccInfo, this);

            this.model.on('change:prices', this.renderPrices, this)

//            if (!h5_base.isClient()) {
//              this.commentModel = new CommentModel()
//              this.commentModel.on('change:commentCount', this.renderComentCount, this)
//            }
        },
       favbtn:function(e){
           var that=this;
           favUtils.favbtn($(e.currentTarget),that.feedId,that.snsId);
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
           if(h5_base.isClient() || h5_base.isAndroidClient()) {
               //loading.hide();
               _detailPage.removeClass(' iR iL');

           }


//           if(_show.length==0){
//
//           }

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
            var _follow=this.$container.find('.account .follow');
            //账号信息没渲染,或不是自己，则重新渲染
            if(_follow.length < 1 || _follow.attr('snsid') !=this.snsId ){
                var infodata=$.extend(this.model.get('accInfo'),{ snsId: this.snsId });
                var accInfo = accinfoTemplate(infodata);
                this.$container.find('.account').html(accInfo);
            }

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
                var errMsg = feed.errMsg || '加载失败，稍后重试！'  ;
               // notification.message(errMsg);
                this.$container.find('.main').html('<br /><center style="color:#999">'+errMsg+'</center>');
                return
              }


          var content = contentTemplate(feed);
          this.$container.find('.main').html(content);
            //客户端 去掉动画
            if(h5_base.isClient() || h5_base.isAndroidClient()) {
                $('div.favbtn').hide();
                $('#detailPage .main h1').css('padding-right','0');
            }

            var count =parseInt(feed.commentCount);
            if (count > 99) count = '99+'

            $('.comment .btn span').text(count);

            //是否已经收藏样式
            feed.isLiked == '1' ? $('.favs').addClass('faved') : $('.favs').removeClass('faved');


          window.lazyload.reload();

          // this is for Android
          $('#content')[0].style.minHeight = '360px'
          $('#detailPage')[0].style.minHeight = '500px'

        },

       renderComentCount: function() {
        var count = this.commentModel.get('commentCount').count
        if (count > 99) count = '99+'

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
          if (!prices) return

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
        },

        commentList: function() {
            location.hash ='comment/' + this.snsId + '/' + this.feedId + '/1';
        }

    });
    return detailView;
}
);
