seajs.config({
    "alias":{
    "backbone": "backbone/0.9.2/backbone",
    "underscore": "underscore/1.2.2/underscore",
    "mu": "mustache/0.4.0/mu",
    "zepto": "zepto/1.0.0/zepto"
    }
});


define(function(require, exports){
    var _ = require('underscore'),
        $ = require('zepto'),
        Backbone = require('backbone');

    var Router = Backbone.Router.extend({
        routes:{
            "":"home",
            "home":"home",
            "list":"list"
            
        },
        home:function(){
            console.log('home');
        },
        list:function(){
            console.log('list');
        }
    });
    // 初始化Router
    // var Start = function(){
    //     var app_router = new Router;
    //     // 开启Backbone的历史功能
    //     Backbone.history.start();
    // };
   
    return {init:function(){
        console.log('init');
        var app_router = new Router;

        Backbone.history.start();
    }};
});