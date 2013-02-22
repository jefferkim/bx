/**
 * User: 晓田(tancy)
 * Date: 13-2-21
 * Time: PM4:44
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./accountListModel'),
        _router=require('../router');
    var accountListView = Backbone.View.extend({
        el:'body',
        events:{
            'click header.navbar .tab-bar li':'changeTab'
        },
        initialize:function (status) {
            $('body').unbind();
            $('.tb-h5').html('');
            var that=this;
            that.status=status;
            console.log('al');

            $('.tb-h5').html('accountListView');

            $('header.navbar').html($('#navBack_tpl').html()+$('#accountListTabBar_tpl').html());
            $('.tab-bar li').eq(status-1).addClass('cur');
            var accountListModel = new _model();
            accountListModel.on("change:myAttention",function(model,result){

            });
            accountListModel.on("change:recommands",function(model,result){
                $('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                var pageCount=Math.ceil(result.totalCount/_pageSize);
                new pageNav({'id':'#personListPageNav','pageCount':pageCount,'objId':'A'});
            });
            accountListModel.getPageData();
        },
        changeTab:function(){
            var that=this;
            console.log(Backbone.navigate)
            if(that.status==1){

                _router.navigate('accountList/2');
            }else{
                _router.navigate('accountList/1');
            }
        }

    });
    return accountListView;
});