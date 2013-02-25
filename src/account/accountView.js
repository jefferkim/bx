/**
 * User: 晓田(tancy)
 * Date: 13-2-21
 * Time: PM4:44
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./accountModel'),
        pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');

    var accountView = Backbone.View.extend({
        el:'#content',
        events:{
            'touchend .tb-feed-items li':'goToDetail'
        },
        initialize:function (snsid) {
            this.snsid=snsid;
            this.render();
        },
        render:function(){
            var that=this;
            var _pageSize=4;
            $('body').unbind();
            //$('.tb-h5').html('');
            $('.view-page.show').removeClass('show').addClass('iL');
            $('#accountPage').addClass('show iC');
            $('header.navbar').html($('#navBack_tpl').html()+$('#accountTitle_tpl').html());
            var accountModel = new _model();
            accountModel.on("change:accInfo",function(model,result){
                console.log('accInfo');
                console.log(result);
                if(result){
                    $('#accountPage .J_info').html(_.template($('#accountinfo_tpl').html(),that.reconAccInfoData(result)));
                }
            });
            accountModel.on("change:accFeeds",function(model,result){
                if(result.list&&result.list.length>0){
                    console.log('accFeeds');
                    console.log(result);
                    $('#accountPage .J_feed').html(_.template($('#tbfeed_tpl').html(),that.reconFeedListData(result)));

                    var pageCount=Math.ceil(result.totalCount/_pageSize);

                    new pageNav({'id':'#feedPageNav','pageCount':pageCount,'pageSize':_pageSize});
                }
            });
            accountModel.on("change:prices",function(model,result){
                if(result.list&&result.list.length>0){
                    console.log('prices');
                    console.log(result);
                    //<div class="price">￥102.00</div>
                }
            });
//            * @param param.curPage  页码
//            * @param param.pageSize
//            * @param param.snsId
//            * @param param.afterTimestamp
            accountModel.getPageData({'snsId':that.snsid,'curPage':1,'pageSize':_pageSize,'afterTimestamp':''});
        },
        goToDetail:function(e){
            var cur=$(e.currentTarget);
            window.location.hash='#detail/'+$('.tb-profile').attr('snsid')+'/'+cur.attr('feedid');
        },
        /**
         * 重构数据集
         * @param data
         * @returns {*}
         */
        reconAccInfoData:function(data){
            var d=data;
            console.log(!!d.logoUrl);
            if(!d.logoUrl){d.logoUrl='imgs/avatar.png'}
            if(!d.description){d.description='亲，欢迎光临！'}
            if(!d.backgroundImg){d.backgroundImg='imgs/cover.png'}
            return d;
        },
        reconFeedListData:function(data){
            var that=this;
            var d=data;
            for(var i=0;i< d.list.length;i++){
                if(!d.list[i].commentCount){d.list[i].commentCount=0}
            }
            return d;
            //commentCount
        }

    });
    return accountView;
});