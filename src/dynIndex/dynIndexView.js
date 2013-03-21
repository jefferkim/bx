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
        notification = require('../ui/notification.js'),
        loading = require('../ui/loading'),
        mtop = require('../common/mtopForAllspark.js');

    $.extend($.fn, {
        // 扩展动画结束事件
        wAE: function (c,n) {
            var that = this;
            var flag = true;
            var listener = function(e){
                if (n && e.propertyName != n ) { return };
                if (typeof c == 'function' && flag) {
                    c();
                    flag = false;
                }
            }
            that.unbind('webkitAnimationEnd').bind('webkitAnimationEnd', listener)
            that.unbind('webkitTransitionEnd').bind('webkitTransitionEnd', listener)
        }
    });

    var dynIndexView = Backbone.View.extend({
        el: '#content',
        events:{
            //绑定登录链接
            'click #J_login_btn' : 'goLogin',
            'click .navbar .add':'add',
            'click .navbar .refresh.index':'refresh',
            'click #indexPage .myfeed li':'goToAccount',
            'click #indexPage .person-list li .content':'goToAccount',
            'click #indexPage .person-list .followbtn':'follow',
            'click .gotop':'goTop'
        },
        initialize:function (page) {
            //判断是否登录
            var that=this;
            that._pageSize=15;
            that.loginFlag=false;
            that.timestamp=new Date().getTime();

            that.dynIndexModel = new _model();
            that.dynIndexModel.on("change:newFeedCounts",function(model,result){
                //提醒更新记录数
                if(result.count>0){
                    notification.message('更新了 '+result.count+' 条广播');
                }
            });
            that.dynIndexModel.on("change:banner",function(model,result){
                console.log('banner');
                console.log(result);
                var d=result;
                d.width=result.list.length*320;

                $('#indexPage .J_slider').html(_.template($('#slider_tpl').html(),d));

                new slider(".in-slider", {wrap: ".in-slider-cont",trigger: ".in-slider-status",useTransform: !0,interval: 5000,play: !0,loop: !0});


                //equal(3, result.list.length, "We expect banner not empty");
            });
            that.dynIndexModel.on("change:accWithFeed",function(model,result){
                console.log('accWithFeed');
                console.log(result);


                //取消刷新按钮动画
                setTimeout(function(){
                    $('.navbar .refresh div').removeClass('spinner');
                },2000);

                if(result.list&&result.list.length>0){
                    if((result.list.length==1)&&(that.curPage==1)){
                        $('#indexPage .J_status').html(_.template($('#myfeed_tpl').html()+$('#recommendtip_tpl').html(),result));
                        //$(_.template($('#myfeed_tpl').html()+$('#recommendtip_tpl').html(),result)).insertAfter('div.in-slider');
                    }else{
                        //当关注了多个账号 删除推荐列表
                        $('#indexPage .J_list .person-list').html('');
                        $('#personListPageNav').html('');
                        $('#indexPage .J_status').html('<div class="account-title"><span>账号动态</span></div>'+_.template($('#myfeed_tpl').html(),result));
                        var pageCount=Math.ceil(result.totalCount/that._pageSize);
                        //页数大于1的时候显示分页组件
                        if(pageCount>1){
                            that.myfeedPage=new pageNav({'id':'#personListPageNav','index':that.curPage,'pageCount':pageCount,'pageSize':that._pageSize,'disableHash': 'true'});
                            that.myfeedPage.pContainer().on('P:switchPage', function(e,page){
                                that.changePage(page.index);
                            });
                        }
                        //$(_.template($('#myfeed_tpl').html(),result)).insertAfter('div.in-slider');
                    }
                }else{
                    $('#indexPage .J_status').html('');
                }
                //ok(result.totalCount > 0, "total count == 0")
            },this);
            that.dynIndexModel.on("change:recommends",function(model,result){
                //推荐列表
                console.log('recommends');
                console.log(result);
                //取消刷新按钮动画
                setTimeout(function(){
                    $('.navbar .refresh div').removeClass('spinner');
                },2000);

                if(result.list&&result.list.length>0){
                    $('#indexPage .J_list .person-list').html(_.template($('#personList_tpl').html(),result));

                    //$('.tb-h5').append(_.template($('#personList_tpl').html(),result));
                    //if(!that.recommentPage){
                        var pageCount=Math.ceil(result.totalCount/that._pageSize);
                        //页数大于1的时候显示分页组件
                        if(pageCount>1){
                            that.recommentPage=new pageNav({'id':'#personListPageNav','index':that.curPage,'pageCount':pageCount,'pageSize':that._pageSize,'disableHash': 'true'});
                            that.recommentPage.pContainer().on('P:switchPage', function(e,page){
                                that.changePage(page.index);
                            });
                        }
                    //}
                }
                //ok(result.totalCount > 0, "total count > 0")
            },this);

            //监听数据加载是否完毕
            that.dynIndexModel.on("change:loaded",function(model,result){
                loading.hide();
                model.set("loaded","0");
            })

//            that.dynIndexModel.getPageData({'curPage':page,'pageSize':that._pageSize});
//
//            that.dynIndexModel.on('change',this.render,this);

        },
        goTop:function(){
            window.scrollTo(0,1);
        },
        render:function(page){
            //$('.tb-h5').html($('#indexPage_tpl').html());
            console.log('homePage render');
            //判断是否登录
            var that=this;
            that.curPage=parseInt(page);

            $('#indexPage .J_list .person-list').html('');
            $('#personListPageNav').html('');
            window.scrollTo(0,1);
            //loading.show();

            var param = {'curPage':that.curPage,'pageSize':that._pageSize};
            h5_comm.isLogin() && that.dynIndexModel.get("recommends") &&  (param.type = 2);

            that.dynIndexModel.getPageData(param);

            var _navbar=$('header.navbar');

            _navbar.html(_.template($('#navBack_tpl').html(),{'backUrl':'http://m.taobao.com','backTitle':'首页'})+$('#homeTitle_tpl').html());


            if(_navbar.hasClass('iT')){
                _navbar.removeClass('iT').addClass('iC');
            }

            if(!h5_comm.isLogin()){
                //未登录
                $('#indexPage .J_status').html($('#loginBar_tpl').html());
                //$($('#loginBar_tpl').html()).insertAfter('div.in-slider');
            }else{
                $('footer .nick').html(mtop.userNick);
                $('footer').css('display','block');
            }

            if($('#indexPage').hasClass('show')){
                //判断是否分页
            }else{
                var _show=$('.view-page.show');
                var _index=$('#indexPage');
                if(_show.length>0){
                    if(_index.hasClass('iB')){
                        _index.removeClass('iB').addClass('iL');
                    }
                    _show.removeClass('show iC').addClass('iR').wAE(function(){
                        _show.addClass('hide');
                    });
                    _index.removeClass('hide iL').addClass('show iC');
                }else{
                    //页面第一次加载的时候动画
                    _index.removeClass('hide');
                    setTimeout(function(){
                        _index.removeClass('iB').addClass('show iC');
                    },0);
                    //当不是从首页进入,返回首页
                }
            }

            if(!h5_comm.isLogin()){
                //未登录
                $('#indexPage .J_status').html($('#loginBar_tpl').html());
                //$($('#loginBar_tpl').html()).insertAfter('div.in-slider');
            }
        },
        PageNavRender:function(){

        },
        changePage:function(page){
            var that=this;
            if(!h5_comm.isLogin()){
                //未登录
                $('.J_list .person-list').html('<div class="loading"><span class="spinner"></span></div>');
            }else{
                $('.indexPage .J_status').html('<div class="loading"><span class="spinner"></span></div>');
            }

            window.location.hash='#index/'+page;
            //that.dynIndexModel.getPageData({'curPage':page,'pageSize':that._pageSize});
        },
        add:function(){
            var that=this;
            if(h5_comm.isLogin()){
                window.location.hash='#accountList/1';
            }else{
                //allSpark_hash
                that.goLogin();
                //h5_comm.goLogin('h5_allspark');
            }
        },
        refresh:function(){
            var that=this;
            that.timestamp=new Date().getTime();
            var _spinner=$('.navbar .refresh div');
            if(!_spinner.hasClass('spinner')){
                _spinner.addClass('spinner');
            }
            if(that.curPage=='1'){
                that.dynIndexModel.getPageData({'curPage':that.curPage,'pageSize':that._pageSize,'timestamp':that.timestamp});
            }else{
                window.location.hash='#index/1';
            }
        },
        follow:function(e){
            e.stopPropagation();
            var that=this;
            var cur=$(e.currentTarget);
            if(h5_comm.isLogin()){
                //已登录
                if(!cur.hasClass('followed')){
                    cur.html('关注中...');
                    cur.addClass('min');
                    mtop.addAccount(cur.attr('pid'),function(d){
                        if(d.data.result){
                            for(var len=d.data.result.length,i=0;i<len;i++){
                                if(cur.attr('pid')==d.data.result[i].id){
                                    if(d.data.result[i].isSuccess=='true'){
                                        cur.addClass('followed');
                                        cur.removeClass('min');
                                        cur.html('已关注');
                                    }else{
                                        notification.message('关注失败！');
                                        cur.html('关注');
                                        cur.removeClass('min');
                                    }
                                }
                            }
                        }
                    },function(){
                        notification.message('关注失败！');
                        cur.html('关注');
                        cur.removeClass('min');
                    });
                }



//                if(cur.hasClass('followed')){
//                    cur.html('取消关注...');
//                    mtop.removeAccount(cur.attr('pid'),function(d){
//                        if(d.data.result){
//                            for(var len=d.data.result.length,i=0;i<len;i++){
//                                if(cur.attr('pid')==d.data.result[i].id){
//                                    if(d.data.result[i].isSuccess=='true'){
//                                        cur.html('关注');
//                                        cur.removeClass('followed');
//                                    }else{
//                                        cur.html('取消关注');
//                                    }
//                                }
//                            }
//                        }
//                    },function(){
//                        cur.html('取消关注');
//                    });
//                }else{
//                    cur.html('关注中...');
//                    cur.addClass('followed');
//                    mtop.addAccount(cur.attr('pid'),function(){
//                        if(d.data.result){
//                            for(var len=d.data.result.length,i=0;i<len;i++){
//                                if(cur.attr('pid')==d.data.result[i].id){
//                                    if(d.data.result[i].isSuccess=='true'){
//                                        cur.html('取消关注');
//                                    }else{
//                                        cur.html('关注');
//                                        cur.removeClass('followed');
//                                    }
//                                }
//                            }
//                        }
//                    },function(){
//                        cur.html('关注');
//                        cur.removeClass('followed');
//                    });
//
//                }
            }else{
                that.goLogin();
                //h5_comm.goLogin('h5_allspark');
            }
        },
        goLogin : function(){
            tbh5.removeValue('allSpark_hash');
            tbh5.removeValue('allSpark_lastHash')
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