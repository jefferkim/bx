/**
 * User: 金建峰
 * Date: 13-5-30
 * Time: PM
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


    var recommendView = Backbone.View.extend({
        el: '#content',
        events: {
            "click .content":"goToAccount" //不考虑放入到personItemView中，预防后期跳转链接不同
        },

        attrs: {
            PAGESIZE: 15,
            curPage:1,
            isMyListPage:true,
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

        //motp queryRecommendList
        queryRecommendList: function (order,page) {

            var self = this;
            var orderMap = {
                0:"fans",
                1:"lastFeedTime"
            };

            var params = {order: orderMap[order], curPage: page, pageSize: this.getAttr('PAGESIZE')};

            this.setAttr('curPage',page);
            if(page <= 0){
                window.location.hash = '#recommendAccount/1/p1';
            }


            mtop.recommends(params, function (result) {

                self.Collection.reset(result.list);

                var totalCount = Math.ceil(result.totalCount / self.getAttr('PAGESIZE'));

                if(page > totalCount) {     //如果hash中当前页码大于后台返回，此时显示数据集最大数据
                    window.location.hash = '#recommendAccount/1/p'+totalCount;
                }

                self._renderPager(result.totalCount);

            });
        },

        addItem:function (person) {
            var personItemView = new personItemView1({model:person});
            $("#recommendResult #J-recommendList").append(personItemView.render());
        },

        _renderPager: function (totalCount) {

            var self = this;

            var pageTotal = Math.ceil(totalCount / this.getAttr('PAGESIZE'));

            if (pageTotal > 1) {

                self.pageNav = new pageNav({'id': '#J-recommendPageNav', 'index': self.curPage, 'pageCount': pageTotal, 'pageSize': this.getAttr('PAGESIZE'), 'objId':'p'});

                self.pageNav.pContainer().on('P:switchPage', function (e, goPage) {

                    ///window.location.hash = '#recommendAccount/' +order+ '/p'+goPage.index;
                    self.backURL = $('.navbar .back a').attr('href');
                });
            }

        },



        //render person list
        render: function () {


            var self = this;
            var _navbar=$('header.navbar');

            var _accountListPage=$('#recommendResult');

            _accountListPage.find("#J-recommendList").html('<div class="loading"><span class="spinner"></span></div>');

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

            _navbar.html(_.template($('#navBack_tpl').html(),_back)+'<div class="title">推荐关注</div>');


            if(this.Collection.length){
                _accountListPage.find("#J-recommendList").html('');
                this.Collection.each(function (person) {
                    self.addItem(person);
                });
            }else{
                _accountListPage.find("#J-recommendList").html('<p class="tips">你已经关注了所有的推荐帐号</p>');
            }


            window.scrollTo(0, 1);
        //   window.lazyload.reload();


            if(_navbar.hasClass('iT')){
                _navbar.removeClass('iT').addClass('iC');
            }

            var _show=$('.view-page.show');
            console.log(_show);

            if(!_accountListPage.hasClass('show')){
                _show.removeClass('show iC').addClass('iL').wAE(function(){
                    _show.addClass('hide');
                });
            }

            _accountListPage.removeClass('hide');


            setTimeout(function(){
                _accountListPage.removeClass(' iR iL').addClass('show iC');
            },0);


            // this is for Android
            $('#content')[0].style.minHeight = '360px';
        },





        //====以下是以前的逻辑 TODO:需要封装下
        goToAccount:function(e){
            var that=this;
            e.stopPropagation();
            var cur=$(e.currentTarget);
            window.AccountList={'hash':'#accountList/'+that.status+'/'+that.curPage,'flag':true};
            changeHash('#account/'+cur.attr('snsid')+'/1','account');
        },

        goBackHome: function () {
            if (typeof window.AccountList != 'undefined') {
                window.AccountList.flag = false;
                window.location.hash = window.AccountList.hash;
            } else {
                window.history.back();
            }
        }




    });
    return recommendView;
});