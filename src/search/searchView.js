/**
 * User: 晓田(tancy)
 * Date: 13-2-21
 * Time: PM4:44
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        Person = require('./person'),
        pageNav = require('../../../../base/styles/component/pagenav/js/pagenav.js'),
        h5_comm = require('h5_comm'),
        loading = require('../ui/loading'),
        notification = require('../ui/notification.js'),
        mtop = require('../common/mtopForAllspark.js'),
        personCollection = require('./personCollection.js'),
        personItemView1 = require('./personItemView.js'),
        favUtils = require('../common/favUtils.js');


    var searchView = Backbone.View.extend({
        el: '#content',
        events: {

            "click .content":"goToAccount" //不考虑放入到personItemView中，预防后期跳转链接不同
            /* 'click .tb-feed-items .jsItem':'goToDetail',
             //'click .navbar .back':'goBackHome',
             'click #accountPage .J_info .stats-follow-btn':'follow',
             'click .navbar .refresh.account':'refresh',
             'click #accountPage .favbtn':'favbtn',
             'click #accountPage .wwwIco':'goWWW'*/
        },


        attrs: {
            PAGESIZE: 15,
            backURL: '',
            afterTimestamp: '',
            before: false
        },


        template: $("#J-personTpl").html(),


        initialize: function () {


            var that = this;


            this.Collection = new personCollection;

            this.Model = new Person();


            this.getAttr = function (key) {
                return that.attrs[key]
            };


            that.afterTimestamp = new Date().getTime();


            this.Collection.on("reset",this.render,this);


            //===========================
            //getSearchlist
            /* this.Model.on("change:searchList",function(model,result){
             console.log(result);

             if(result&&result.fail){
             notification.message('服务异常，请稍后再试！');
             return;
             }

             if(result){
             console.log(result);
             if(result.followed=='false'){
             $('#accountPage .stats-follow-btn').html('关注').attr('class','stats-follow-btn log');
             }else{
             $('#accountPage .stats-follow-btn').html('取消关注').attr('class','stats-follow-btn followed log');
             }

             var t='<div class="default">';
             if(result.logoUrl){
             t+='<img class="avatar lazy" dataimg="'+getImgUrl(result.logoUrl, 100, 60);
             t+='src="http://a.tbcdn.cn/mw/webapp/fav/img/grey.gif">';
             }
             t+='</div><p class="name">'+result.nick+'</p>';
             if($('#accountPage li a.account').children.length==0){
             $('#accountPage li a.account').html(t);
             }
             }

             });*/


        },

        //motp queryPersonList
        queryPersonList: function (nick, page) {
            var that = this;

            mtop.searchAccount({keywords: nick, curPage: page, pageSize: this.getAttr('PAGESIZE')}, function (result) {
                console.log(result.list);
                that.Collection.reset(result.list);

            });
        },

        addItem:function (person) {
            var personItemView = new personItemView1({model:person});
            $("#J-personList").append(personItemView.render());
        },

        //render person list
        render: function () {

            var self = this;
            var _navbar=$('header.navbar');
            var _accountListPage=$('#accountListPage');


            var _back={'backUrl':'','backTitle':'返回'};
            if(typeof window.AccountList!='undefined'){
                //window.location.hash=window.AccountList.hash;
                _back={'backUrl':'#'+window.AccountList.hash,'backTitle':'返回'};
                window.AccountList.flag=false;
                delete window.AccountList;
            }else{
                if(self.backURL!=''){
                    _back={'backUrl':self.backURL,'backTitle':'返回'}
                }else{
                    _back={'backUrl':'#index','backTitle':'返回'}
                }
            }




            window.scrollTo(0, 1);


           // render
            $(".person-list").html('<ul id="J-personList"></ul>');
            this.Collection.each(function (person) {
                self.addItem(person);
            });




            _accountListPage.removeClass('hide');

            if(_navbar.hasClass('iT')){
                _navbar.removeClass('iT').addClass('iC');
            }

            var _show=$('.view-page.show');
            if($('#detailPage').hasClass('show')){
                _accountListPage.removeClass(' iR iL').addClass('iL');
                _show.removeClass('show iC').addClass('iR').wAE(function(){
                    _show.addClass('hide');
                });
            }else{
                if(!_accountListPage.hasClass('show')){
                    _show.removeClass('show iC').addClass('iL').wAE(function(){
                        _show.addClass('hide');
                    });
                }
            }

            _accountListPage.removeClass('hide');

            setTimeout(function(){
                _accountListPage.removeClass(' iR iL').addClass('show iC');
            },0);


            // this is for Android
            $('#content')[0].style.minHeight = '360px';




            /*   var that=this;
             if($.trim($('#accountPage .J_feed .tb-feed-items').html()).length==0){
             $('#accountPage .J_feed .tb-feed-items').html('<div class="loading"><span class="spinner"></span></div>');
             }


             that.snsid=snsid;
             that.curPage= parseInt(page);
             if(page==1){
             that.before=false;
             }
             if(snsid!=$('#accountPage').attr('snsid')){
             $('#accountPage').attr('snsid',snsid);
             $('#accountPage .J_info').html('');
             $('#accountPage .J_feed .tb-feed-items').html('<div class="loading"><span class="spinner"></span></div>');
             }
             $('header.navbar').html('');






             if(that.oldTotalCount){
             if(that.oldTotalCount.snsid==that.snsid){
             var pageCount=Math.ceil(that.oldTotalCount.totalCount/that._pageSize);
             if(pageCount>1){
             that.pageNav=new pageNav({'id':'#feedPageNav','index':that.curPage, 'pageCount':pageCount,'pageSize':that._pageSize,'disableHash': 'true'});
             that.pageNav.pContainer().on('P:switchPage', function(e,page){
             that.changePage(page.index);
             });
             }
             }else{
             $('#feedPageNav').html('');
             }
             }


             var _navbar=$('header.navbar');
             var _accountPage=$('#accountPage');

             var _back={'backUrl':'','backTitle':'返回'};
             if(typeof window.AccountList!='undefined'){
             //window.location.hash=window.AccountList.hash;
             _back={'backUrl':'#'+window.AccountList.hash,'backTitle':'返回'};
             window.AccountList.flag=false;
             delete window.AccountList;
             }else{
             if(that.backURL!=''){
             _back={'backUrl':that.backURL,'backTitle':'返回'}
             }else{
             _back={'backUrl':'#index','backTitle':'返回'}
             }
             }




             _navbar.html(_.template($('#navBack_tpl').html(),_back)+$('#accountTitle_tpl').html());

             //            判断导航是否已经载入
             if(_navbar.hasClass('iT')){
             _navbar.removeClass('iT').addClass('iC');
             }

             var _show=$('.view-page.show');
             if($('#detailPage').hasClass('show')){
             _accountPage.removeClass(' iR iL').addClass('iL');
             _show.removeClass('show iC').addClass('iR').wAE(function(){
             _show.addClass('hide');
             });
             }else{
             if(!_accountPage.hasClass('show')){
             _show.removeClass('show iC').addClass('iL').wAE(function(){
             _show.addClass('hide');
             });
             }
             }

             _accountPage.removeClass('hide');
             setTimeout(function(){
             _accountPage.removeClass(' iR iL').addClass('show iC');
             },0);
             */










           /* window.scrollTo(0, 1);
            var that = this;
            that.searchModel.getPageData({'keywords': nick, 'curPage': page, 'pageSize': that._pageSize});

            // this is for Android
            $('#content')[0].style.minHeight = '360px'*/




        },



        goToAccount:function(e){
            var that=this;
            e.stopPropagation();
            var cur=$(e.currentTarget);
            window.AccountList={'hash':'#accountList/'+that.status+'/'+that.curPage,'flag':true}
            changeHash('#account/'+cur.attr('snsid')+'/1','account');
        },






        refresh: function () {
            var that = this;
            var _spinner = $('.navbar .refresh .btn div');
            if (!_spinner.hasClass('spinner')) {
                _spinner.addClass('spinner');
            }
            that.afterTimestamp = new Date().getTime();
            if (that.curPage == '1') {
                that.accountModel.getPageData({'exCludInfo': false, 'snsId': that.snsid, 'curPage': that.curPage, "before": false, 'pageSize': that._pageSize, 'afterTimestamp': new Date().getTime()});
            } else {
                window.location.hash = '#account/' + that.snsid + '/1';
            }
        },



        goBackHome: function () {
            if (typeof window.AccountList != 'undefined') {
                window.AccountList.flag = false;
                window.location.hash = window.AccountList.hash;
            } else {
                window.history.back();
            }
        },

        follow: function (e) {
            var that = this;
            var cur = $(e.currentTarget);
            if (h5_comm.isLogin()) {
                if (cur.hasClass('followed')) {
                    cur.html('取消关注');
                    mtop.removeAccount(cur.attr('pid'), function (d) {
                        if (d.data.result) {
                            for (var len = d.data.result.length, i = 0; i < len; i++) {
                                if (cur.attr('pid') == d.data.result[i].id) {
                                    if (d.data.result[i].isSuccess == 'true') {
                                        cur.html('关注');
                                        cur.removeClass('followed');
                                        cur.attr('data-log', 'attention');
                                        that.showFans(-1);
                                    } else {
                                        notification.message('取消关注失败！');
                                        cur.html('取消关注');
                                    }
                                }

                            }
                        }
                    }, function () {
                        notification.message('取消关注失败！');
                        cur.html('取消关注');
                    });
                } else {
                    cur.html('关注中...');

                    mtop.addAccount(cur.attr('pid'), function (d) {
                        if (d.data.result) {
                            for (var len = d.data.result.length, i = 0; i < len; i++) {
                                if (cur.attr('pid') == d.data.result[i].id) {
                                    if (d.data.result[i].isSuccess == 'true') {

                                        cur.addClass('followed');
                                        cur.attr('data-log', 'cancelattention');
                                        cur.html('取消关注');
                                        that.showFans(1);
                                    } else {
                                        notification.message('关注失败！');
                                        cur.html('关注');
                                    }
                                }
                            }
                        }
                    }, function () {
                        notification.message('关注失败！');
                        cur.html('关注');
                    });
                }
            } else {
                h5_comm.goLogin({rediUrl: 'h5_allSpark', hideType: 'close'});
                //h5_comm.goLogin('h5_allspark');
            }
        },

        showFans: function (n) {
            var fans = $('.stats-count').text();
            if (fans.indexOf('万') == -1 && fans.indexOf('亿') == -1) {
                $('.stats-count').text(parseInt(fans) + n);
            }
        },
        changePage: function (page) {
            var that = this;

            if (parseInt(that.curPage) < parseInt(page)) {
                that.before = true;
            } else {
                that.before = false;
            }
            $('#accountPage .J_feed .tb-feed-items').html('<div class="loading"><span class="spinner"></span></div>');

            window.location.hash = '#account/' + that.snsid + '/' + page;
            //判断是否为分页，如果是分页返回还是账号列表
            that.backURL = $('.navbar .back a').attr('href');

            //that.accountModel.getPageData({'snsId':that.snsid,'curPage':page,'pageSize':that._pageSize,'disableHash': 'true'});
        },
        goToDetail: function (e) {
            var cur = $(e.currentTarget).parent();
            var that = this;
            //window.location.hash='#detail/'+$('.tb-profile').attr('snsid')+'/'+cur.attr('feedid')+'/'+that.curPage;
            changeHash('#detail/' + $('.tb-profile').attr('snsid') + '/' + cur.attr('feedid') + '/' + that.curPage, 'account')
        },
        /**
         * 重构数据集
         * @param data
         * @returns {*}
         */
        reconAccInfoData: function (data) {
            var d = data;
            //if(!d.logoUrl){d.logoUrl='imgs/avatar.png'}
            //if(!d.description){d.description='亲，欢迎光临！'}
            //if(!d.backgroundImg){d.backgroundImg='imgs/cover.png'}
            return d;
        },
        /**
         * 重构feed数据集
         * @param data
         * @returns {*}
         */
        reconFeedListData: function (data) {
            var that = this;
            var d = data;
            for (var i = 0; i < d.list.length; i++) {
                if (!d.list[i].commentCount) {
                    d.list[i].commentCount = 0
                }
            }
            return d;
        }

    });
    return searchView;
});