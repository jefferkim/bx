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
                if(result.list&&result.list.length>0){
                    console.log('accInfo');
                    console.log(result);
                    $('.tb-h5').append(_.template($('#accountinfo_tpl').html(),result));
                }
            });
            accountModel.on("change:accFeeds",function(model,result){
                if(result.list&&result.list.length>0){
                    console.log('accFeeds');
                    console.log(result);
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
        }
    });
    return accountView;
});