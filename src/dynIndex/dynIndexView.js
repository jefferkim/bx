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
        cache = require('../common/cache'),
        slider= require('../../../../base/styles/component/slider/js/slider.js'),
        pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js');


    var dynIndexView = Backbone.View.extend({
        events:{
            'click .pagenav .c-p-pre':'',
            'click .pagenav .c-p-next':''
        },
        initialize:function () {
            //判断是否登录
            var _pageSize=1;
            var dynIndexModel = new _model();
            dynIndexModel.on("change:banner",function(model,result){
                console.log('banner');
                var d=result;
                d.width=result.list.length*320;

                $('.tb-h5').append(_.template($('#slider_tpl').html(),d));

                new slider(".in-slider", {wrap: ".in-slider-cont",trigger: ".in-slider-status",useTransform: !0,interval: 3e3,play: !0,loop: !0});

                console.log(result);
                //equal(3, result.list.length, "We expect banner not empty");
            });
            dynIndexModel.on("change:accWithFeed",function(model,result){
                console.log('accWithFeed');
                console.log(result);
                //ok(result.totalCount > 0, "total count == 0")
            },this);
            dynIndexModel.on("change:recommands",function(model,result){
                //推荐列表
                console.log('recommands');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                    var pageCount=Math.ceil(result.totalCount/_pageSize);
                    new pageNav({'id':'#personListPageNav','pageCount':pageCount});
                }
                //ok(result.totalCount > 0, "total count > 0")
            },this);
            dynIndexModel.on("change:loginStatus",function(model,result){
                if(result){
                    //已登录
                }else{
                    //未登录
                    $($('#loginBar_tpl').html()).insertAfter('div.in-slider');
                }
            },this);
            dynIndexModel.getPageData({'curPage':1,'pageSize':_pageSize});
        }
    });
    return dynIndexView;
});