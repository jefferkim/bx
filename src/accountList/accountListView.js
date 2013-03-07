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
        h5_comm = require('h5_comm'),
        pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js'),
        mtop = require('../common/mtopForAllspark.js');


    var accountListView = Backbone.View.extend({
        el:'#content',
        events:{
            'click .tab-bar li':'changeTab',
            //'click .navbar .back':'goBack',
            'click #accountListPage .person-list li .content':'goToAccount',
            'click #accountListPage .followbtn':'follow'
        },
        initialize:function () {
            var that=this;
            that.pageSize = 5;
            that.accountListModel = new _model();
            that.accountListModel.on("change:myAttention",function(model,result){
                console.log('myAttention');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('#accountListPage .person-list').html(_.template($('#myList_tpl').html(),result));
                    //$('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                    var pageCount=Math.ceil(result.totalCount/that.pageSize);
                    that.myPageNav=new pageNav({'id':'#accountListPageNav','index':that.curPage,'pageCount':pageCount,'pageSize':that.pageSize,'disableHash': 'true'});
                    that.myPageNav.pContainer().on('P:switchPage', function(e,page){
                        that.changePage(page.index);
                    });
                }
            });
            that.accountListModel.on("change:recommends",function(model,result){

                console.log('recommends');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('#accountListPage .person-list').html((_.template($('#personList_tpl').html(),result)));
                    $('#accountListPageNav').html('');
                    var pageCount=Math.ceil(result.totalCount/that.pageSize);
                    that.recPageNav=new pageNav({'id':'#accountListPageNav','index':that.curPage,'pageCount':pageCount,'pagesize':that.pageSize,'disableHash': 'true'});
                    that.recPageNav.pContainer().on('P:switchPage', function(e,page){
                        that.changePage(page.index);
                    });
                }
            });
        },
        render: function(status,page) {
            var that=this;
            that.status=status;
            that.curPage=page;
            //$('.tb-h5').html('');
            $('.navbar .back').unbind('click');
            var _navbar=$('header.navbar');
//            $('.view-page.show').removeClass('show iC').addClass('iL');
//            $('#accountListPage').removeClass('iL').addClass('show iC');
            _navbar.html(_.template($('#navBack_tpl').html(),{'backUrl':'#index','backTitle':'微淘'})+$('#accountListTabBar_tpl').html());


            window.scrollTo(0,1);
            $('.tab-bar li.cur').removeClass('cur');
            $('.tab-bar li').eq(that.status-1).addClass('cur');
            $('#accountListPage .person-list').html('');
            $('#accountListPageNav').html('');
            that.accountListModel.getPageData({'type':that.status,'curPage':that.curPage,'pageSize': that.pageSize,"order":"fans"});

            //判断导航是否已经载入
            if(_navbar.hasClass('iT')){
                _navbar.removeClass('iT').addClass('iC');
            }

            var _show=$('.view-page.show');
            var _accountListPage=$('#accountListPage');
            //判断动画先后顺序
            var _indexPage=$('#indexPage');

            if(!_accountListPage.hasClass('show')){
                _show.removeClass('show iC').addClass('iL').wAE(function(){
                    _show.addClass('hide');
                });
            }

            _accountListPage.removeClass('hide');
            setTimeout(function(){
                _accountListPage.removeClass('iR iL').addClass('show iC');
            },0);



        },
        changePage:function(page){
            var that=this;
            window.location.hash='#accountList/'+that.status+'/'+page;
        },
        goToAccount:function(e){
            var that=this;
            e.stopPropagation();
            console.log('goToAccount');
            var cur=$(e.currentTarget);
            window.AccountList={'hash':'#accountList/'+that.status+'/'+that.curPage,'flag':true}
            window.location.hash='#account/'+cur.attr('snsid')+'/1';
        },
        follow:function(e){
            e.stopPropagation();
            var that=this;
            var cur=$(e.currentTarget);
            if(h5_comm.isLogin()){
                //已登录
                console.log('follow');
                if(cur.hasClass('followed')){
                    cur.html('取消关注...');
                    mtop.removeAccount(cur.attr('pid'),function(){
                        cur.html('关注');
                        cur.removeClass('followed');
                    },function(){
                        cur.html('取消关注');
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
            //history.back();
            console.log('go index');
            window.location.hash='index/';
        },
        changeTab:function(e){
            var that=this;
            var cur=$(e.currentTarget);
            $('.tab-bar li.cur').removeClass('cur');
            cur.addClass('cur');
            console.log('ok');
            if(that.status==1){
                window.location.hash='accountList/2/1';
            }else{
                window.location.hash='accountList/1/1';
            }
        }

    });
    return accountListView;
});