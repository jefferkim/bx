define(function (require, exports, module) {

    var log = require("./log.js"),
        Backbone = require('backbone'),
        h5_comm = require('h5_comm'),
        tbh5 = require('h5_base'),
        History = require('../../../../base/modules/history/history.js');

    var myHis = new History({
        defaultPage:"http://m.taobao.com",
        defaultHash:"#index",
        defaultSeparator:'/',
        fromBack:function () {
            return h5_comm.isLogin() && 0 == document.getRefer().indexOf("http://login");
        },
        setItem:function (key, value) {
            tbh5.set(key, value);
        },
        getItem:function (key) {
            return tbh5.get(key);
        },
        validate:function () {
            return location.hash.indexOf("&") == -1;
        },
        changeHash:function(str){
            console.log('12222');
            window.changeHash(str,location.hash.split('/')[0].replace('#',''));
            //alert(str);
        }
    });
    var BackgroundView = Backbone.View.extend({
        el:'#content',
        events:{

            'click .log[data-log]':function (e) {
                var currentUri = location.hash ? location.hash.split("/")[0].replace("#", "") : "";
                var z = $(e.currentTarget);
                var data = z.data("log")
                if (data) {
//                    if ("attention" == data && "account" == currentUri && z.hasClass("followed")) {
//                        data = "cancelattention";
//                    }
                    log.logClick(data, currentUri);
                }
            },
            'click header .back':function () {
                myHis.back();
                return false;
            }
        }
    });

    new BackgroundView;
    window.G_History = myHis;  //暴露到全局


});