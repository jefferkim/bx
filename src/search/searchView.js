/**
 * User: 金建峰
 * Date: 13-5-30
 * Time:
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
            "click .content":"goToAccount", //不考虑放入到personItemView中，预防后期跳转链接不同
            "click #J-searchBtn":"searchPerson",
            "click .add-public-account":"goToRecommend"
        },


        attrs: {
            PAGESIZE: 15,
            totalPage: 1,
            curPage:1,
            backURL: '',
            afterTimestamp: '',
            before: false
        },


        template: $("#J-personTpl").html(),

        initialize: function () {

            var self = this;

            this.Collection = new personCollection;
            this.Model = new Person();

            this.getAttr = function (key) {
                return self.attrs[key];
            };
            this.setAttr = function(key,val){
                self.attrs[key] = val;
            };

            this.Collection.on("reset",this.render,this);
        },

        searchPerson:function(e){
            e.stopPropagation();
            var target = $(e.currentTarget);
            console.log(target);
            var nick = $("#J-keyword").val();
            console.log(nick);

            this.queryPersonList(nick,1);

        },

        goToRecommend:function(e){
            e.stopPropagation();
            changeHash('#recommendAccount/1','account');


        },

        //motp queryPersonList
        queryPersonList: function (nick, page) {
            var self = this;
            var pageSize = this.getAttr('PAGESIZE');
            var params = {keywords: nick, curPage: page, pageSize: this.getAttr('PAGESIZE')};
            this.setAttr('curPage',page);

            mtop.searchAccount(params, function (result) {
                self.Collection.reset(result.list);

                //pageNav
                self.setAttr('totalPage',Math.ceil(result.totalCount/pageSize));

                if(!self.pageNav && self.getAttr('pageCount')>1){
                    self.pageNav=new pageNav({'id':'#accountListPageNav','index':self.curPage, 'pageCount':2,'pageSize':self.getAttr('totalPage'),'disableHash': 'true'});

                    self.pageNav.pContainer().on('P:switchPage', function(e,goPage){

                        window.location.hash = '#searchAccount/' + nick + '/' + goPage.index;
                        //判断是否为分页，如果是分页返回还是账号列表
                        self.backURL = $('.navbar .back a').attr('href');
                    });
                }

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

            var _accountListPage=$('#searchPersonPage');


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







           // render
            _accountListPage.html($("#J-searchItemTpl").html());
            this.Collection.each(function (person) {
                self.addItem(person);
            });





            window.scrollTo(0, 1);
            window.lazyload.reload();



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
        },


        goToAccount:function(e){
            var that=this;
            e.stopPropagation();
            var cur=$(e.currentTarget);
            window.AccountList={'hash':'#accountList/'+that.status+'/'+that.curPage,'flag':true};
            changeHash('#account/'+cur.attr('snsid')+'/1','account');
        },

        //====以下是以前的逻辑

        goBackHome: function () {
            if (typeof window.AccountList != 'undefined') {
                window.AccountList.flag = false;
                window.location.hash = window.AccountList.hash;
            } else {
                window.history.back();
            }
        }




    });
    return searchView;
});