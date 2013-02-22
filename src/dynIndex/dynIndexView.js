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
        pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js')
        //uriBroker = require('uriBroker'),
        //cdn = require('cdn');

    var dynIndexView = Backbone.View.extend({
        el: '#content',
        events:{
            //绑定登录链接
            'click #J_login_btn' : 'goLogin',
            'click .navbar .add':'add',
            'click .navbar .refresh':'refresh'
        },
        initialize:function () {
            //判断是否登录
            //$('body').unbind();
            $('.tb-h5').html('');
            var _pageSize=1;

            $('header.navbar').html($('#navBack_tpl').html()+$('#homeTitle_tpl').html());




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
                if(result.list&&result.list.length>0){
                    console.log();
                    if(result.list.length==1){
                        $(_.template($('#myfeed_tpl').html()+$('#recommendtip_tpl').html(),result)).insertAfter('div.in-slider');
                    }else{
                        $(_.template($('#myfeed_tpl').html(),result)).insertAfter('div.in-slider');
                    }
                }
                //ok(result.totalCount > 0, "total count == 0")
            },this);
            dynIndexModel.on("change:recommends",function(model,result){
                //推荐列表
                console.log('recommends');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                    var pageCount=Math.ceil(result.totalCount/_pageSize);
                    new pageNav({'id':'#personListPageNav','pageCount':pageCount,'objId':'A'});
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
        },
        add:function(){
            console.log('asdfadsf');
        },
        refresh:function(){

        },
        goLogin : function(){
            h5_comm.goLogin('h5_allspark');
        }
    });
    return dynIndexView;
});