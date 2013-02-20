/**
 * User: 晓田(tancy)
 * Date: 13-2-19
 * Time: AM11:18
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./dynIndexModel'),
        tbh5 = require('h5_base'),
        h5_comm = require('h5_comm'),
        global = require('../common/global'),
        cookie = require('cookie'),
        cache = require('../common/cache');


    var dynIndexView = Backbone.View.extend({
        events:{

        },
        initialize:function () {
            //判断是否登录

            var dynIndexModel = new _model();
            dynIndexModel.on("change:banner",function(model,result){
                console.log('banner');
                console.log(result);
                //equal(3, result.list.length, "We expect banner not empty");
            },this);
            dynIndexModel.on("change:accWithFeed",function(model,result){
                console.log('accWithFeed');
                console.log(result);
                //ok(result.totalCount > 0, "total count == 0")
            },this);
            dynIndexModel.on("change:recommands",function(model,result){
                console.log('recommands');
                console.log(result);
                //ok(result.totalCount > 0, "total count > 0")
            },this);
            dynIndexModel.getPageData({curPage:1,order:'fans'});




            if(h5_comm.isLogin()){
                console.log('已登录');

                //无SNS账号
                //有SNS账号 无关注账号
                //有关注账号

            }else{
                console.log('未登录');
            }


        }
    });
    return dynIndexView;
});