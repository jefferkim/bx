define(function (require, exports, module) {

    var log = require("./log.js"),
        Backbone = require('backbone'),
        h5_comm = require('h5_comm'),
        tbh5 = require('h5_base'),
        History = require('../../../../base/modules/history/history.js'),
        login_refer_flag = localStorage ? localStorage.getItem("f_l") : false;

    login_refer_flag && localStorage.removeItem("f_l");


    History.prototype.extend({
        defaultPage: "http://m.taobao.com",
        defaultHash: "#index",
        defaultSeparator: '/',
        fromBack: function () {
            if (login_refer_flag) {
                delete login_refer_flag;
                return true;
            } else {
                return h5_comm.isLogin() && document.referrer && 0 == document.referrer.indexOf("http://login");
            }
        },
        setItem: function (key, value) {
            tbh5.set(key, value);
        },
        getItem: function (key) {
            return tbh5.get(key);
        },
        validate: function () {
            return location.hash.indexOf("&") == -1;
        },
        filterEntrance: function(entrence){
            return entrence.indexOf(document.pathname) >= 0 ? "" : document.referrer;
        }
    });

    var myHis = new History;
    var BackgroundView = Backbone.View.extend({
        el: '#content',
        events: {
            'click header .back': function () {
                myHis.back();
                return false;
            },
            'click .log[data-log]': function (e) {
                var currentUri = location.hash ? location.hash.split("/")[0].replace("#", "") : "";
                var z = $(e.currentTarget);
                var data = z.data("log")
                if (data) {
                    if ("attention" == data && "account" == currentUri && z.hasClass("followed")) {
                        data = "cancelattention";
                    }
                    log.logClick(data, currentUri);
                }
            }
        }
    });

    new BackgroundView;

});