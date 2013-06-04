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


    var accountManageView = Backbone.View.extend({
        el: '#content',
        events: {
            "click .content": "goToAccount",
            "click #J-searchListPage #J-searchBtn": "searchPerson",
            "click .add-public-account": "goToRecommend"
        },


        attrs: {
            PAGESIZE: 15,
            curPage: 1,
            isMyListPage: false,
            backURL: '',
            afterTimestamp: '',
            before: false
        },


        template: $("#J-personTpl").html(),

        initialize: function () {

            var self = this;


            this.Collection = new personCollection;

           // this.Collection = G_PersonCollection;

            this.Model = new Person();

            this.getAttr = function (key) {
                return self.attrs[key];
            };
            this.setAttr = function (key, val) {
                self.attrs[key] = val;
            };

            this.Collection.on("reset", this.render, this);


            //TODO: 公用
            var _btn = $("#J-searchListPage .close-btn");
            var _input = $("#J-searchListPage #J-keyword");
            var keyupEvent = function(e){
                _btn.show();
                !_input.val() && (_btn.hide());
            };

            _input.on("input",keyupEvent).focus(function (){
                $(this).val() && _btn.show();
            }).bind('blur',function(){
                    if($(this).val() == '' ) {
                        $('#J_searchT').show()
                    }
                });
            _btn.on("click",function(e){
                e.preventDefault();
                _input.val('');
                _btn.hide();
            });
        },



        //跳转到搜索页面
        searchPerson: function (e) {
            e.preventDefault();

            var nick = $.trim($("#J-keyword").val());
            var keyword = nick.replace(/<[^>].*?>/g,"");
            if(keyword){
                window.location.hash = '#search/'+encodeURI(nick)+'/p'+1;
            }
        },

        //查询我的列表
        queryMyList: function (page) {

            var self = this;
            var page = page || 1;
            var params = {curPage: page, pageSize: this.getAttr('PAGESIZE')};
            this.setAttr('curPage', page);
            this.setAttr('isMyListPage',true);


            mtop.my(params, function (result) {
                self.Collection.reset(result.list);
                var totalCount = Math.ceil(result.totalCount / self.getAttr('PAGESIZE'));

                if(page > totalCount) {     //如果hash中当前页码大于后台返回，此时显示数据集最大数据
                    window.location.hash = '#accountManage/p'+totalCount;
                }
                $("#J-num").text(result.totalCount);
                self._renderPager(result.totalCount);
            });
        },


        _renderPager: function (totalCount) {

            var self = this;

            var pageTotal = Math.ceil(totalCount / this.getAttr('PAGESIZE'));


            if (pageTotal > 1) {

                self.pageNav = new pageNav({'id': '#J-searchListPageNav', 'index': self.curPage, 'pageCount': pageTotal, 'pageSize': this.getAttr('PAGESIZE'),'objId':'p'});

                self.pageNav.pContainer().on('P:switchPage', function (e, goPage) {
                    //判断是否为分页，如果是分页返回还是账号列表
                    self.backURL = $('.navbar .back a').attr('href');
                });
            }else{
                self.pageNav = null;
                $("#J-searchListPageNav").html("");
            }

        },

        addItem: function (person) {
            var personModel = person.set('isMyList', this.getAttr('isMyListPage'));
            var personItemView = new personItemView1({model: personModel});
            $("#J-personList").append(personItemView.render());
        },


        //render person list
        render: function () {

            var self = this;
            var _navbar = $('header.navbar');
            var _accountManagePage = $('#accountManage');

            $("#accountManage #J-keyword").val('');

            /*var _back = {'backUrl': '', 'backTitle': '返回'};
            if (typeof window.AccountList != 'undefined') {
                //window.location.hash=window.AccountList.hash;
                _back = {'backUrl': '#' + window.AccountList.hash, 'backTitle': '返回'};
                window.AccountList.flag = false;
                delete window.AccountList;
            } else {
                if (self.backURL != '') {
                    _back = {'backUrl': self.backURL, 'backTitle': '返回'}
                } else {
                    _back = {'backUrl': '#index', 'backTitle': '返回'}
                }
            }*/

            //TODO: navbar 渲染放到pageLoad时，通过配置参数实现

            _navbar.html(_.template($('#navBack_tpl').html(),{'backUrl':'#index','backTitle':'微淘'})+'<div class="title">关注管理</div>');





            if(this.Collection.length){
                _accountManagePage.find("#J-personList").html("");
                this.Collection.each(function (person) {
                    self.addItem(person);
                });
            }else{
                _accountManagePage.find("#J-personList").html('<p class="tips">你还没有关注任何微淘帐号</p>');
            }




            //start:动画
            if (_navbar.hasClass('iT')) {
                _navbar.removeClass('iT').addClass('iC');
            }

            var _show = $('.view-page.show');

            if(!_accountManagePage.hasClass('show')){
                _show.removeClass('show iC').addClass('iL').wAE(function(){
                    _show.addClass('hide');
                });
            }

            _accountManagePage.removeClass('hide');

            setTimeout(function () {
                _accountManagePage.removeClass(' iR iL').addClass('show iC');
            }, 0);


            window.scrollTo(0, 1);

            window.lazyload.reload();

            // this is for Android
            $('#content')[0].style.minHeight = '360px';
            //end:动画
            

        },


        //====以下是以前的逻辑
        goToRecommend: function (e) {
            e.stopPropagation();
            changeHash('#recommendAccount/1/p1', 'recommend');
        },

        goToAccount: function (e) {
            var that = this;
            e.stopPropagation();
            var cur = $(e.currentTarget);
            window.AccountList = {'hash': '#accountList/' + that.status + '/' + that.curPage, 'flag': true};

            changeHash('#account/' + cur.attr('snsid') + '/1', 'account');
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
    return accountManageView;
});
