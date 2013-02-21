seajs.config({
    alias:{
        'backbone':'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore':'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto':'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache':'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'linkfocus':'../../../../base/modules/linkfocus/linkfocus',
        'uriBroker':'../../../../base/utils/server/uriBroker',
        'h5_mtop':'../../../../base/utils/server/mtop_h5_test',
        'h5_events':'../../../../base/utils/server/h5_events',
        'h5_comm':'../../../../base/utils/server/h5_common',
        'h5_base':'../../../../base/utils/server/h5_base',
        'h5_utils':'../../../../base/utils/server/h5_utils',
        'h5_cache':'../../../../base/utils/server/h5_cache',
        'base64':'../../../../base/utils/server/base64_utf-8',
        'cookie':'../../../../base/utils/server/cookie'

    },
    debug:1
});

define(function (require, exports) {

    var DynIndexModel = require("../src/dynIndex/dynIndexModel.js"),
        mtop = require('../src/common/mtopForAllspark.js'),
        h5_cache = require("../../../base/utils/server/h5_cache.js");

    require("./framework/qunit-1.11.0.js");

    var dynIndexModel = new DynIndexModel();
    var biz = dynIndexModel._biz;
    //cart_test
    var sid = '209748772cdc638a00c9ace4d9c9c4b0';
    //tbwuzhong000/taobao1234
    var snsSid = '2e1e0cd1112a52d7e29b1af7e8d52d74';

    module("首页banner图片");
    asyncTest("1.远程调用tms接口", 1, function () {
        h5_cache.pushValue("allspark", "banner", {});
        biz.banner(function (value) {
            equal(3, value.list.length, "We expect banner not empty");
            start();
        });
    });
    asyncTest("2.从cache中获取banner", 1, function () {
        biz.banner(function (value) {
            equal(3, value.list.length, "We expect banner not empty");
            start();
        });
    });

    module("自动创建账号");
    asyncTest("1.未登录用户", 2, function () {
        biz.autocreate(function (value) {
            console.log(value)
            ok(!value.succ, "not logined");
            ok(value.fail.indexOf("ERRCODE_NOT_LOGINED") == 0);
            start();
        }, {sid:'56c7735d02b6cf9cee8c613867ec4594'});
    });

    asyncTest("2.登录用户", 1, function () {
        biz.autocreate(function (value) {
            console.log(value)
            ok(value.succ, "succ")
            start();
        }, {sid:snsSid});
    });

    module("推荐账号列表");
    asyncTest("1.获取推荐账号列表", 2, function () {
        mtop.recommands(
            {
                "curPage":"1",
                "pageSize":"3",
                "order":"fans"
            }, function (value) {
                console.log(value)
                ok(value.totalCount > 0, "total count > 0")
                ok(value.list && value.list.length > 0, "list size is > 0")
                start();
            });
    });

    module("关注账号列表");
    asyncTest("1.未登录用户获取关注列表", 1, function () {
        mtop.listWithFirstFeed(
            {
                 sid:'',
                "curPage":"1",
                "pageSize":"3"
            }, function (value) {
                console.log(value)
                ok(value.fail, "query failed not logined");
                start();
            });
    });
    asyncTest("2.登录用户获取关注列表", 1, function () {
        mtop.listWithFirstFeed(
            {
                sid: snsSid,
                "curPage":"1",
                "pageSize":"3"
            }, function (value) {
                console.log(value)
                ok(value.totalCount >= 0, "query succ");
                start();
            });
    });

    module("获取动态页面数据");
    asyncTest("1.未登录",2,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.list.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
        },this);
        dynIndexModel.on("change:recommands",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        dynIndexModel.getPageData();
        setTimeout(function(){
            start();
        },1000)

    });
    asyncTest("2.未有关注账号登录首页",function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.list.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
            ok(result.totalCount == 0, "total count == 0")
        },this);
        dynIndexModel.on("change:recommands",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        dynIndexModel.getPageData({sid:sid});
        setTimeout(function(){
            start();
        },1000)

    });
    asyncTest("3.登录用户推荐列表第二页",1,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:recommands",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        dynIndexModel.getPageData({sid:sid,curPage:2,type:2});
        setTimeout(function(){
            start();
        },1000)

    });
    asyncTest("4.有关注账号登录首页",3,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.list.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        dynIndexModel.on("change:recommands",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        dynIndexModel.getPageData({sid:snsSid,curPage:1,type:1});
        setTimeout(function(){
            start();
        },1000)
    });

    module("价格查询");
    asyncTest("1.查询2个商品价格",3,function () {
        mtop.getPrices([2533082807,1500014021509],function(data){
            console.log(data);
            ok(data ,"data is not null");
            ok( 2 == data.length ,"data length is 2");
            ok( data[1].price && data[1].id ,"has price and id");
        })
        setTimeout(function(){
            start();
        },1000)
    });

    var AccInfoModel = require("./accInfoModel.js");
    module("帐号首页");
    asyncTest("1.查询2个商品价格",function () {
        var accInfo = new AccInfoModel();
        accInfo.on("change:accInfo",function(model,result){
            console.log(result);
            ok(result.followed);
        },this);
        accInfo.on("change:accFeeds",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        accInfo.on("change:prices",function(model,result){
            console.log(result);
            ok(result.length >= 0, "i'm not sure the prices")
        },this);
        accInfo.getPageData({snsId:"7000084652",sid:snsSid});
        setTimeout(function(){
            start();
        },1000)
    });




});


