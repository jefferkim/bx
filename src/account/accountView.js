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
        pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js'),
        mtop = require('../common/mtopForAllspark.js');


    var accountView = Backbone.View.extend({
        el:'#content',
        events:{
            'touchend .tb-feed-items li':'goToDetail',
            'click .navbar .back':'goBack',
            'click .J_info .stats-follow-btn':'follow'


        },
        initialize:function (snsid) {
            var that=this;
            that.snsid=snsid;
            that._pageSize=4;
            that.accountModel = new _model();
            //that.accountModel.on('change',that.render,this);
            this.render();
        },
        goBack:function(){
            history.go(-1);
        },
        render:function(){
            var that=this;

            $('body').unbind();
            //$('.tb-h5').html('');
            $('.view-page.show').removeClass('show iC').addClass('iL');
            $('#accountPage').removeClass('iL').addClass('show iC');
            var _back={'backUrl':'','backTitle':'返回'};
//            if(document.referrer==''){
//                _back={'backUrl':'#','backTitle':'首页'}
//            }
            $('header.navbar').html(_.template($('#navBack_tpl').html(),_back)+$('#accountTitle_tpl').html());

            that.accountModel.on("change:accInfo",function(model,result){
                console.log('accInfo');
                console.log(result);
                if(result){
                    $('#accountPage .J_info').html(_.template($('#accountinfo_tpl').html(),that.reconAccInfoData(result)));
                }
            });
            that.accountModel.on("change:accFeeds",function(model,result){
                if(result.list&&result.list.length>0){
                    console.log('accFeeds');
                    console.log(result);
                    $('#accountPage .J_feed .tb-feed-items').html(_.template($('#tbfeed_tpl').html(),that.reconFeedListData(result)));

                    if(!that.pageNav){
                        var pageCount=Math.ceil(result.totalCount/that._pageSize);
                        that.pageNav=new pageNav({'id':'#feedPageNav','pageCount':pageCount,'pageSize':that._pageSize});
                        that.pageNav.pContainer().on('P:switchPage', function(e,page){
                            that.changePage(page.index);
                        });
                    }
                }
            });
            that.accountModel.on("change:prices",function(model,result){
                console.log('prices');
                console.log(result);
                if(result.list&&result.list.length>0){

                    //<div class="price">￥102.00</div>
                }
                //测试插入效果
                setTimeout(function(){
                    var _item=$('.media .item');
                    for(var i=0;i<_item.length;i++){
                        _item.eq(i).append('<div class="price">￥102.00</div>');
                    }
                },5000);

            });
//            * @param param.curPage  页码
//            * @param param.pageSize
//            * @param param.snsId
//            * @param param.afterTimestamp
            that.accountModel.getPageData({'snsId':that.snsid,'curPage':1,'pageSize':that._pageSize,'timestamp':''});
        },
        follow:function(e){
            var that=this;
            console.log('adddddd');
            var cur=$(e.currentTarget);
            if(cur.hasClass('followed')){
                cur.html('取消关注...');
                mtop.removeAccount(cur.attr('pid'),function(){
                    cur.html('关注');
                    cur.removeClass('followed');
                },function(){
                    cur.html('已关注');
                });
            }else{
                cur.html('关注中...');
                cur.addClass('followed');
                mtop.addAccount(cur.attr('pid'),function(){
                    cur.html('已关注');
                },function(){
                    cur.html('关注');
                    cur.removeClass('followed');
                });

            }
        },
        changePage:function(page){
            var that=this;
            console.log('page:'+page);
            that.accountModel.getPageData({'snsId':that.snsid,'curPage':page,'pageSize':that._pageSize,'disableHash': 'true'});
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
        /**
         * 重构feed数据集
         * @param data
         * @returns {*}
         */
        reconFeedListData:function(data){
            var that=this;
            var d=data;
            for(var i=0;i< d.list.length;i++){
                if(!d.list[i].commentCount){d.list[i].commentCount=0}
            }
            return d;
        }

    });
    return accountView;
});