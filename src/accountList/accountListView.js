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
        pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js'),
        mtop = require('../common/mtopForAllspark.js');


    var accountListView = Backbone.View.extend({
        el:'#content',
        events:{
            'click .tab-bar li':'changeTab',
            'click .navbar .back':'goBack',
            'click .followbtn':'follow'
        },
        initialize:function (status) {
            var that=this;
            this.status=status;
            that.accountListModel = new _model();
            that.render();
            //that.accountListModel.on('change',,this);
        },
        render: function() {
            $('body').unbind();
            //$('.tb-h5').html('');
            var _pageSize=5;
            var that=this;
            $('.view-page.show').removeClass('show iC').addClass('iL');
            $('#accountListPage').removeClass('iL').addClass('show iC');
            $('header.navbar').html(_.template($('#navBack_tpl').html(),{'backUrl':'','backTitle':'返回'})+$('#accountListTabBar_tpl').html());
            $('.tab-bar li').eq(that.status-1).addClass('cur');

            that.accountListModel.on("change:myAttention",function(model,result){
                console.log('myAttention');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('#accountListPage .person-list').html(_.template($('#personList_tpl').html(),result));
                    //$('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                    var pageCount=Math.ceil(result.totalCount/_pageSize);
                    new pageNav({'id':'#accountListPageNav','pageCount':pageCount,'pageSize':_pageSize});
                }
            });
            that.accountListModel.on("change:recommends",function(model,result){

                console.log('recommends');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('#accountListPage .person-list').html((_.template($('#personList_tpl').html(),result)));
                    var pageCount=Math.ceil(result.totalCount/_pageSize);
                    new pageNav({'id':'#accountListPageNav','pageCount':pageCount,'pagesize':_pageSize});
                }
            });
            that.accountListModel.getPageData({'type':that.status,'curPage':1,'pageSize':_pageSize,"order":"fans"});
        },
        follow:function(e){
            e.stopPropagation();
            var that=this;
            var cur=$(e.currentTarget);
            if(that.loginFlag){
                //已登录
                console.log('follow');

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
            }else{
                h5_comm.goLogin('h5_allspark');
            }
        },
        goBack:function(){
            history.go(-1);
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