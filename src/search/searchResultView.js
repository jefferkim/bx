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
        personItemView1 = require('./personItemView.js'),
        personCollection = require('./personCollection.js'),
        favUtils = require('../common/favUtils.js');


    var searchResultView = Backbone.View.extend({

        el: '#content',
        events: {
            "click .content": "goToAccount",
            "click #J-searchResult #J-searchBtn": "searchPerson"

        },


        attrs: {
            PAGESIZE: 15,
            curPage: 1,
            isMyListPage: false,
            keywords: '',
            backURL: '',
            afterTimestamp: '',
            before: false
        },


        template: $("#J-personTpl").html(),

        initialize: function () {

            var self = this;


            this.Collection = new personCollection;

            //this.Collection = G_PersonCollection;

            this.Model = new Person();

            this.getAttr = function (key) {
                return self.attrs[key];
            };
            this.setAttr = function (key, val) {
                self.attrs[key] = val;
            };

            this.Collection.on("reset", this.render, this);


            //TODO: 公用
            var _btn = $("#searchResult .close-btn");
            var _input = $("#searchResult #J-searchkeyword");

            _btn.hide();

            var keyupEvent = function (e) {
                _btn.show();
                !_input.val() && (_btn.hide());
            };
            _input.on("input", keyupEvent).focus(function () {
                $(this).val() && _btn.show();
            }).bind('blur', function () {
                    if ($(this).val() == '') {
                        $('#J_searchT').show()
                    }
                });
            _btn.on("click", function (e) {
                e.preventDefault();
                _input.val('');
                _btn.hide();
                $(".search-no-result").hide();
            });

        },


        search: function (keyword, page) {

            var self = this;
            if (page <= 0) {
                window.location.hash = "#search/" + keyword + "/p1";
            }

            var keywords = decodeURI(keyword);

            var params = {keywords: keywords, curPage: page, pageSize: this.getAttr('PAGESIZE')};
            this.setAttr('curPage', page);
            $("#J-searchkeyword").val(keywords);
            if ($("#J-searchkeyword").val() !== "") {
                $("#J-searchResult .close-btn").show();
            }
            this.setAttr('keywords', keywords);

            mtop.searchAccount(params, function (result) {

                self.Collection.reset(result.list);

                if (result && result.totalCount) {
                    var totalPage = Math.ceil(result.totalCount / self.getAttr('PAGESIZE'));
                    if (page > totalPage) {
                        //不设置最小1的话会导致和上方逻辑死循环
                        window.location.hash = '#search/' + keyword + "/p" + Math.max(totalPage, 1);
                    }
                    self._renderPager(totalPage);
                }else{
                    $("#J-searchResultPageNav").html("");
                }

            });
        },


        //跳转到搜索页面
        searchPerson: function (e) {
            e.preventDefault();

            var nick = $.trim($("#J-searchkeyword").val());
            var keyword = nick.replace(/<[^>].*?>/g, "");
            if (keyword) {
                window.location.hash = '#search/' + encodeURI(keyword) + '/p' + 1;
            }
        },


        _renderPager: function (totalPage) {

            var self = this;

            if (totalPage > 1) {

                self.pageNav = new pageNav({'id': '#J-searchResultPageNav', 'index': self.curPage, 'pageCount': totalPage, 'pageSize': this.getAttr('PAGESIZE'), 'objId': 'p'});

                self.pageNav.pContainer().on('P:switchPage', function (e, goPage) {
                    //判断是否为分页，如果是分页返回还是账号列表
                    self.backURL = $('.navbar .back a').attr('href');
                });
            } else {
                self.pageNav = null;
                $("#J-searchResultPageNav").html("");
            }

        },

        addItem: function (person) {
            var personModel = person.set('isMyList', this.getAttr('isMyListPage'));
            var personItemView = new personItemView1({model: personModel});
            $("#J-searchResultList").append(personItemView.render());
        },


        //render person list
        render: function () {

            var self = this;
            var _navbar = $('header.navbar');
            var _accountListPage = $('#searchResult');

            _accountListPage.find("#J-searchResultList").html('<div class="loading"><span class="spinner"></span></div>');


            //TODO: navbar 渲染放到pageLoad时，通过配置参数实现

            _navbar.html(_.template($('#navBack_tpl').html(), {'backUrl': '#index', 'backTitle': '返回'}) + '<div class="title">帐号搜索</div>');


            // render

            if (this.Collection.length) {
                _accountListPage.find("#J-searchResultList").html("");
                this.Collection.each(function (person) {
                    self.addItem(person);
                });
            } else {
                _accountListPage.find("#J-searchResultList").html('<p class="search-no-result">没有找到 "' + self.getAttr('keywords') + '" 相关的微淘帐号</p>');
            }


            if (_navbar.hasClass('iT')) {
                _navbar.removeClass('iT').addClass('iC');
            }

            var _show = $('.view-page.show');
            if (!_accountListPage.hasClass('show')) {
                _show.removeClass('show iC').addClass('iL').wAE(function () {
                    _show.addClass('hide');
                });
            }

            _accountListPage.removeClass('hide');


            setTimeout(function () {
                _accountListPage.removeClass(' iR iL').addClass('show iC');
            }, 0);


            window.scrollTo(0, 1);

            //  window.lazyload.reload();

            // this is for Android
            $('#content')[0].style.minHeight = '360px';


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
    return searchResultView;
});
