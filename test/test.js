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
        h5_cache = require("../../../base/utils/server/h5_cache.js");

    require("./framework/qunit-1.11.0.js");

    var dynIndexModel = new DynIndexModel();
    var biz = dynIndexModel._biz;
    //cart_test
    var sid = '9d668ff1952b0dcae47bda047f0cc718';
    //bmwtui32/taobao1234
    var snsSid = 'aa758062c1acaf6eab436b13f69a0339';

    module("banner");
    asyncTest("1. get banner api test", 1, function () {
        h5_cache.pushValue("allspark", "banner", {});
        biz.banner(function (value) {
            equal(3, value.length, "We expect banner not empty");
            start();
        });
    });
    asyncTest("2. get banner api test with cache", 1, function () {
        biz.banner(function (value) {
            equal(3, value.length, "We expect banner not empty");
            start();
        });
    });

    module("autocreate");
    asyncTest("1. auto create account not logined", 2, function () {
        biz.autocreate(function (value) {
            console.log(value)
            ok(!value.succ, "not logined");
            ok(value.fail.indexOf("ERRCODE_NOT_LOGINED") == 0);
            start();
        }, {sid:'56c7735d02b6cf9cee8c613867ec4594'});
    });

    asyncTest("2. auto create account  logined", 1, function () {
        biz.autocreate(function (value) {
            console.log(value)
            ok(value.succ, "succ")
            start();
        }, {sid:sid});
    });

    module("recommands");
    asyncTest(" get recommands list", 2, function () {
        biz.recommands(
            {
                "curPage":"1",
                "pageSize":"3",
                "order":"fans"
            }, function (value) {
                console.log(value)
                ok(value.totalCount > 0, "total count > 0")
                ok(value.list.length == 3, "list size is 3")
                start();
            });
    });

    module("listwithfirstfee");
    asyncTest("list with first feed no login", 1, function () {
        biz.listWithFirstFeed(
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
    asyncTest("list with first feed login", 1, function () {
        biz.listWithFirstFeed(
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

    module("getAppData");
    asyncTest("dynIndexModel's main api not logined",2,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
        },this);
        dynIndexModel.on("change:recommands",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);

        dynIndexModel.getAppData();
        setTimeout(function(){
            start();
        },1000)

    });
    asyncTest("dynIndexModel's main api logined",3,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
            ok(result.totalCount == 0, "total count == 0")
        },this);
        dynIndexModel.on("change:recommands",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        dynIndexModel.getAppData({sid:sid});
        setTimeout(function(){
            start();
        },1000)

    });
    asyncTest("dynIndexModel's get second page data",1,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:recommands",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count > 0")
        },this);
        dynIndexModel.getAppData({sid:sid,curPage:2,type:"rec"});
        setTimeout(function(){
            start();
        },1000)

    });
    asyncTest("dynIndexModel's get second page data",1,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
            ok(result.totalCount == 0, "total count == 0")
        },this);
        dynIndexModel.getAppData({sid:sid,curPage:2,type:"acc"});
        setTimeout(function(){
            start();
        },1000)
    });

    module("getAppDataWithAccount");
    asyncTest("1.有关注用户查询账号列表",2,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count == 0")
        },this);
        dynIndexModel.getAppData({sid:snsSid,curPage:1,type:"acc"});
        setTimeout(function(){
            start();
        },1000)
    });
    asyncTest("2.有关注用户查询账号列表 第二页",1,function () {
        var dynIndexModel = new DynIndexModel();
        dynIndexModel.on("change:banner",function(model,result){
            console.log(result);
            equal(3, result.length, "We expect banner not empty");
        },this);
        dynIndexModel.on("change:accWithFeed",function(model,result){
            console.log(result);
            ok(result.totalCount > 0, "total count == 0")
        },this);
        dynIndexModel.getAppData({sid:snsSid,curPage:2,type:"acc"});
        setTimeout(function(){
            start();
        },1000)
    });


});


