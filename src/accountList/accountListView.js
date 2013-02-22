/**
 * User: 晓田(tancy)
 * Date: 13-2-21
 * Time: PM4:44
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./accountListModel');
    var accountListView = Backbone.View.extend({
        el:'body',
        events:{
            'click .tab-bar li':'changeTab'
        },
        initialize:function (status) {
            this.status=status;
            this.render();
//
        },
        render: function() {
            //$('body').unbind();
            $('.tb-h5').html('');
            var _pageSize=1;
            var that=this;
            $('header.navbar').html($('#navBack_tpl').html()+$('#accountListTabBar_tpl').html());
            $('.tab-bar li').eq(that.status-1).addClass('cur');
            var accountListModel = new _model();
            accountListModel.on("change:myAttention",function(model,result){
                console.log('myAttention');
                console.log(result);
            });
            accountListModel.on("change:recommends",function(model,result){

                console.log('recommends');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                    var pageCount=Math.ceil(result.totalCount/_pageSize);
                    new pageNav({'id':'#personListPageNav','pageCount':pageCount,'objId':'A'});
                }
            });
            accountListModel.getPageData({'type':that.status,'curPage':1,'pageSize':_pageSize,"order":"fans"});
        },
        changeTab:function(){
            var that=this;
            console.log('ok');
            if(that.status==1){

                window.location.hash='accountList/2';
            }else{
                window.location.hash='accountList/1';
            }
        }

    });
    return accountListView;
});