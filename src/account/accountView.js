/**
 * User: 晓田(tancy)
 * Date: 13-2-21
 * Time: PM4:44
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./accountModel');
    var accountView = Backbone.View.extend({
        el:'#content',
        events:{
        },
        initialize:function (snsid) {
            this.snsid=snsid;
            this.render();
        },
        render:function(){
            var that=this;
            var _pageSize=3;
            $('body').unbind();
            $('.tb-h5').html('');

            $('header.navbar').html($('#navBack_tpl').html()+$('#accountTitle_tpl').html());


            var accountModel = new _model();
            accountModel.on("change:accInfo",function(model,result){
                console.log('accInfo');
                console.log(result);
                if(result){

                    $('.tb-h5').append(_.template($('#accountinfo_tpl').html(),that.reconAccInfoData(result)));
                }
            });
            accountModel.on("change:accFeeds",function(model,result){
                if(result.list&&result.list.length>0){
                    console.log('accFeeds');
                    console.log(result);
                    $('.tb-h5').append(_.template($('#tbfeed_tpl').html(),that.reconFeedListData(result)));


                }
            });
            accountModel.on("change:prices",function(model,result){
                if(result.list&&result.list.length>0){
                    console.log('prices');
                    console.log(result);
                }
            });
//            * @param param.curPage  页码
//            * @param param.pageSize
//            * @param param.snsId
//            * @param param.afterTimestamp
            accountModel.getPageData({'snsId':that.snsid,'curPage':1,'pageSize':_pageSize,'afterTimestamp':''});
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