define(function (require, exports, module) {
    var $ = require('zepto'),
        _ = require('underscore'),
        global = require('../common/global'),
        tbh5 = require('h5_base'),
        Backbone = require('backbone'),
    //view class import
       	indexView = require('../index/indexView'),
        accountView = require('../account/accountView'),
        detailView = require('../detail/detailView'),
        accountListView = require('../accountList/accountListView'),
        personCollection = require('../search/personCollection'),
        accountManageView = require('../search/accountManageView'),
        searchResultView = require('../search/searchResultView'),
        recommendAccountView = require('../search/recommendView'),
        commentView = require('../comment/commentListView'),
        newCommentView = require('../comment/newCommentView'),
        recCommentView = require('../comment/recCommentView'),
        favView=require('../favorite/favoriteView'),
        background = require('./../common/background.js'),
        cdn = require('cdn'),
        dpi = require('dpi'),
        imgTrim = require('imgtrim'),
        log = require("./../common/log.js"),
        mtop = require('../common/mtopForAllspark.js'),
    //缓存实例变量view
        _indexView, _accountView,_recommendAccountView, _accountManageView,_searchResultView,_detailView, _accountListView, _commentView, _newCommentView,_favView, _recCommentView;

    // image lazyload setup
    window.lazyload = require('lazyload')
    window.lazyload.init({ lazyHeight: 300 })
    window.lazyload.reload = function () {
        window.lazyload.img.trigger()
    }


    var Router = Backbone.Router.extend({

        routes: {   },

        initialize: function () {
            //cdn 获取最佳图片尺寸
            window.globalCDN = imgTrim;

            if(/i(Phone|P(o|a)d)/.test(navigator.userAgent)){
                //判断是否为android 浏览器
                if(!$('body').hasClass('ios')){
                    $('body').addClass('ios');
                }
            }
            if (tbh5.get('hdButton') != null) {
                imgTrim.setRatio(parseInt(tbh5.get('hdButton')));
                if (tbh5.get('hdButton') > 1) {
                    $('.hdButton').html('<span>切换到流畅模式</span>');
                } else {
                    $('.hdButton').html('<span>切换到高清模式</span>');
                }
            } else {
                if (dpi.get() > 1) {
                    tbh5.set('hdButton',2);
                    $('.hdButton').html('<span>切换到流畅模式</span>');
                }
            }

            //export 图片处理，方便模版直接调用
            resizeImg = imgTrim.trim;
            getBetterImg = function (name, expwidth, rwidth, isXz) {
                return imgTrim.trim({url: name, expWidth: expwidth, rWidth: rwidth, isXz: isXz}).url;
            }; // make it global for convenience use in templates
            getImgUrl = function (name, height1, height2, xz) {
                if (window.devicePixelRatio <= 1) {
                    height1 = height2;
                }
                var width = height1 + (xz ? 'xz' : "");
                var name = name + "_" + width + "x" + height1 + ".jpg";
                return cdn.getOriginalImg(name);
            };

            //去首次加载动画
            window.MH5slogan && window.MH5slogan.hideFunc && window.MH5slogan.hideFunc();

            //autocreate
            mtop.autoCreate();

            var self = this;
            //#index

            self.route('', 'index', self.filter);
            self.route(/^(index)\/?(\d*)?$/, 'index', self.filter);
            self.route(/^(fav)\/?(\d*)?$/, 'fav', self.filter);

            //#account/snsid/page  snsid - sns账号Id  page - 页码
            self.route(/^(account)\/(\d*)\/?(\d*)?$/, 'account', self.filter);
            //#detail/snsId/feedId snsid - sns账号Id  feedId - 消息Id
            self.route(/^(detail)\/(\d*)\/(\d*)\/?(\d*)?(.*)?$/, 'detail', self.filter);
            //#comment/snsId/feedId/page snsid - sns账号Id  feedId - 消息Id page - 页码
            self.route(/^(comment)\/(\d*)\/(\d*)\/?(\d*)?$/, 'commentList', self.filter);
            //#accountList/status/page  status - 0 - 未关注列表 1 - 以关注列表 默认 未关注列表  page - 页码
            self.route(/^(accountList)\/?(\d*)?\/?(\d*)?$/, 'accountList', self.filter);
            //#newcomment/snsId/feedId/page snsid - sns账号Id  feedId - 消息Id page - 页码
            self.route(/^(newComment)\/(\d*)\/(\d*)\/?(\d*)?$/, 'newComment', self.filter);

            self.route(/^(recComment)\/?(\d*)?$/, 'recComment', self.filter);

            //推荐关注页面 TODO:精简filter代码  order - 排序 0=fans 1=lastFeedTime page - 页码
            self.route(/^(recommendAccount)\/(\d*)\/?p(\d*)?$/, 'recommend', self.filter);
            //帐号关注页面 - sns帐号  page - 页码
            self.route(/^(accountManage)\/?p(\d*)?$/, 'accountManage', self.filter);
            //搜索结果页面
            self.route(/^(search)\/(.*)\/p(\d*)?$/, 'search', self.filter);

            // 全局初始化
            global.init();
        },

        /**
         * 统一入口
         *
         */
        filter: function (divName, arg0, arg1, arg2) {
            var self = this;

//          console.log('divName=' + divName + "|arg0=" + arg0 + "|arg1=" + arg1 + "|arg2=" + arg2);
            //默认divName
            divName = divName || 'index';

            switch (divName) {
                case 'index':
                    _indexView = _indexView || new indexView();
                    self.index(arg0);
                    break;
                case 'fav':
                    _favView=_favView|| new favView();
                    self.fav(arg0);
                    break;
                case 'account':
                    _accountView = _accountView || new accountView();
                    self.account(arg0, arg1);
                    break;
                case 'detail':
                    _detailView = _detailView || new detailView();
                    self.detail(arg0, arg1, arg2);
                    break;
                case 'comment':
                    _commentView = _commentView || new commentView();
                    self.commentList(arg0, arg1, arg2);
                    break;
                case 'accountList':
                    _accountListView = _accountListView || new accountListView();
                    self.accountList(arg0, arg1);
                    break;
                case 'newComment':
                    _newCommentView = _newCommentView || new newCommentView();
                    self.newComment(arg0, arg1, arg2);
                    break;
                case 'recComment':
                    _recCommentView = _recCommentView ||  new recCommentView();
                    self.recComment(arg0)
                    break;
                case 'accountManage':  //帐号管理
                    _accountManageView = _accountManageView || new accountManageView();
                    self.accountManage(arg0);
                    break;
                case 'search':
                    _searchResultView = _searchResultView || new searchResultView();
                    self.search(arg0,arg1);
                    break;
                case 'recommendAccount':
                    _recommendAccountView = _recommendAccountView || new recommendAccountView();
                    self.recommedAccount(arg0,arg1);
                    break;
                default :
                    _indexView = _indexView || new indexView();
                    self.index(arg0);

            }
        },

        index: function (page) {
            page = page || 1;
            _indexView.render(page);
            var b = "onorientationchange" in window, c = b ? "orientationchange" : "resize";
            $(window).unbind(c).bind(c, function () {

//                if(setOrientation()=='portrait'){
//                    //if(window.innerWidth>)
//                    var _w=$('#content')[0].offsetWidth<$('#content')[0].offsetHeight?$('#content')[0].offsetWidth:$('#content')[0].offsetHeight;
//                    $('.navbar').css('width',_w);
//                    alert($('#content')[0].offsetWidth+'--'+$('#content')[0].offsetHeight);
//                    alert(document.body.clientHeight+'-2-'+document.body.clientWidth);
//                    //expectWidth= window.innerWidth - 30;
//                }else{
//                    var _w=$('#content')[0].offsetWidth>$('#content')[0].offsetHeight?$('#content')[0].offsetWidth:$('#content')[0].offsetHeight;
//                    alert($('#content')[0].offsetWidth+'--'+$('#content')[0].offsetHeight);
//                    alert(document.body.clientHeight+'-1-'+document.body.clientWidth);
//                    $('.navbar').css('width',_w);
//
//                    //expectWidth=window.innerHeight-30;
//
//                }

                //$('.navbar').css('position','absolute');

                var _img = $('#indexPage .feed-item .js_feed img');
                for (var i = 0, len = _img.length; i < len; i++) {
                    if (!_img.eq(i).parent().hasClass('feed-box')) {
                        _img.eq(i).attr('style', feedImageSizeStyle(parseInt(_img.eq(i).attr('picWidth')), parseInt(_img.eq(i).attr('picHeight'))));
                    }
                }
            });
        },
        fav:function(page){
            page = page || 1;
            _favView.render(page);
        },
        account: function (snsId, page) {
            page = page || 1;
            _accountView.render(snsId, page);
            var b = "onorientationchange" in window, c = b ? "orientationchange" : "resize";
            $(window).unbind(c).bind(c, function () {
                $('.navbar').css('width',window.innerWidth);
                var _img = $('#accountPage .J_feed .tb-feed-items .media img');
                for (var i = 0, len = _img.length; i < len; i++) {
                    _img.eq(i).attr('style', feedImageSizeStyle(parseInt(_img.eq(i).attr('picWidth')), parseInt(_img.eq(i).attr('picHeight'))));
                }
            });
        },
        accountList: function (status, page) {
            status = status || 1;
            page = page || 1;
            _accountListView.render(status, page);

        },
        detail: function (snsId, feedId, page) {

            page = page || 1
            //详情需要置顶
            window.scrollTo(0, 0);
            _detailView.goDetail(snsId, feedId, page);
            var b = "onorientationchange" in window, c = b ? "orientationchange" : "resize";
            $(window).unbind(c).bind(c, function () {
                var _img = $('#detailPage .media img');
                for (var i = 0, len = _img.length; i < len; i++) {
                    //if (!_img.eq(i).parent().hasClass('feed-box')) {
                        _img.eq(i).attr('style', feedImageSizeStyle(parseInt(_img.eq(i).attr('picWidth')), parseInt(_img.eq(i).attr('picHeight'))));
                    //}
                }
            });
        },

        commentList: function (snsId, feedId, page) {
            page = page || _commentView.page || 1;
            _commentView.goComment(snsId, feedId, page);
        },

        newComment: function (snsId, feedId, page) {
            page = page || 1;
            _newCommentView.goNewComment(snsId, feedId, page);
        },

        recComment: function(page) {
            page = page || 1
            _recCommentView.goRecComment(page);
        },

        accountManage: function (page) { //进入页面搜索页面默认显示自己关注过的帐号
            console.log("route accountManage");
            page = page || 1;
            _accountManageView.queryMyList(page);

        },

        search: function(keyword,page){
           page = page || 1;
           _searchResultView.search(keyword,page);
        },
        recommedAccount:function(order,page){
            console.log("route recommend");
            page = page || 1;
            _recommendAccountView.queryRecommendList(order,page);
        },

        start: function () {
            Backbone.history.start();
        }



    });

    App = window.App || new Router();
    return App;

});