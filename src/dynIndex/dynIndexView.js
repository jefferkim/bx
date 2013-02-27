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
        pageNav=require('../../../../base/styles/component/pagenav/js/pagenav.js'),
        mtop = require('../common/mtopForAllspark.js');


    var dynIndexView = Backbone.View.extend({
        el: '#content',
        events:{
            //绑定登录链接
            'click #J_login_btn' : 'goLogin',
            'click .navbar .add':'add',
            'click .navbar .refresh':'refresh',
            'click .myfeed li':'goToAccount',
            'click .person-list li .content':'goToAccount',
            'click .person-list .followbtn':'follow'
        },
        initialize:function (page) {
            //判断是否登录
            var that=this;
            that._pageSize=30;
            that.loginFlag=false;
            $('body').unbind();
            $('.view-page.show').removeClass('show iL');
            $('#indexPage').removeClass('iL').addClass('show iC');

            that.dynIndexModel = new _model();
            that.dynIndexModel.on("change:banner",function(model,result){
                console.log('banner');
                console.log(result);
                var d=result;
                d.width=result.list.length*320;

                $('#indexPage .J_slider').html(_.template($('#slider_tpl').html(),d));

                new slider(".in-slider", {wrap: ".in-slider-cont",trigger: ".in-slider-status",useTransform: !0,interval: 3e3,play: !0,loop: !0});


                //equal(3, result.list.length, "We expect banner not empty");
            });
            that.dynIndexModel.on("change:accWithFeed",function(model,result){
                console.log('accWithFeed');
                console.log(result);
                if(result.list&&result.list.length>0){
                    console.log();
                    if(result.list.length==1){
                        $('#indexPage .J_status').html(_.template($('#myfeed_tpl').html()+$('#recommendtip_tpl').html(),result));
                        //$(_.template($('#myfeed_tpl').html()+$('#recommendtip_tpl').html(),result)).insertAfter('div.in-slider');
                    }else{
                        $('#indexPage .J_status').html(_.template($('#myfeed_tpl').html(),result));
                        //$(_.template($('#myfeed_tpl').html(),result)).insertAfter('div.in-slider');
                    }
                }
                //ok(result.totalCount > 0, "total count == 0")
            },this);
            that.dynIndexModel.on("change:recommends",function(model,result){
                //推荐列表
                console.log('recommends');
                console.log(result);
                if(result.list&&result.list.length>0){
                    $('#indexPage .J_list .person-list').html(_.template($('#personList_tpl').html(),result));

                    //$('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                    if(!that.recommentPage){
                        var pageCount=Math.ceil(result.totalCount/that._pageSize);
                        that.recommentPage=new pageNav({'id':'#personListPageNav','pageCount':pageCount,'pageSize':that._pageSize,'disableHash': 'true'});
                        that.recommentPage.pContainer().on('P:switchPage', function(e,page){
                            that.changePage(page.index);
                        });
                    }
                }
                //ok(result.totalCount > 0, "total count > 0")
            },this);
            that.dynIndexModel.on("change:loginStatus",function(model,result){
                if(result){
                    //已登录
                    that.loginFlag=true;
                }else{
                    //未登录
                    that.loginFlag=false;
                    $('#indexPage .J_status').html($('#loginBar_tpl').html());
                    //$($('#loginBar_tpl').html()).insertAfter('div.in-slider');
                }
            },this);

            that.dynIndexModel.getPageData({'curPage':1,'pageSize':that._pageSize});

            that.dynIndexModel.on('change',this.render,this);

        },
        goIndex:function (page) {
            //判断是否登录
            var that=this;
            that._pageSize=5;
            that.loginFlag=false;
            $('body').unbind();
            $('.view-page.show').removeClass('show iL');
            $('#indexPage').removeClass('iL').addClass('show iC');
            that.dynIndexModel.getPageData({'curPage':1,'pageSize':that._pageSize});
        },
        render:function(){

            //$('.tb-h5').html($('#indexPage_tpl').html());
            console.log('homePage render');

            $('header.navbar').html(_.template($('#navBack_tpl').html(),{'backUrl':'http://m.taobao.com','backTitle':'首页'})+$('#homeTitle_tpl').html());


        },
        PageNavRender:function(){

        },
        changePage:function(page){
            var that=this;
            that.dynIndexModel.getPageData({'curPage':page,'pageSize':that._pageSize});
        },
        add:function(){
            var that=this;
            if(that.loginFlag){
                window.location.hash='#accountList/1';
            }else{
                h5_comm.goLogin('h5_allspark');
            }
        },
        refresh:function(){
            console.log('refresh');
        },
        follow:function(e){
            e.stopPropagation();
            var that=this;
            var cur=$(e.currentTarget);
            if(that.loginFlag){
                //已登录
                console.log('follow');

                if(cur.hasClass('followed')){
                    cur.html('取消关注...');
                    mtop.removeAccount(cur.attr('pid'),function(){
                        cur.html('关注');
                        cur.removeClass('followed');
                    },function(){
                        cur.html('已关注');
                    });
                }else{
                    cur.html('关注中...');
                    cur.addClass('followed');
                    mtop.addAccount(cur.attr('pid'),function(){
                        cur.html('已关注');
                    },function(){
                        cur.html('关注');
                        cur.removeClass('followed');
                    });

                }
            }else{
                h5_comm.goLogin('h5_allspark');
            }
        },
        goLogin : function(){
            h5_comm.goLogin('h5_allspark');
        },
        goToAccount:function(e){
            e.stopPropagation();
            console.log('goToAccount');
            var cur=$(e.currentTarget);
            window.location.hash='#account/'+cur.attr('snsid')+'/1';

        }
    });
    return dynIndexView;
});