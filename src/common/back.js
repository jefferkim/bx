define(function (require, exports, module) {

    var log = require("./log.js"),
        Backbone = require('backbone'),
        hashStack = [],
        times = 0;

    var BackgroudView = Backbone.View.extend({
        el: '#content',
        events:{
            'click header .back' : function(e){
                return exports.exec();
            }
        }
    });

    var bgView;

    exports.add = function (hash) {
        bgView || (bgView = new BackgroudView);
        var tmpStack = [];
        var i = 0;
        while (i < hashStack.length) {
            if (hashStack[i].hash == hash) {
                break;
            } else {
                tmpStack.push(hashStack[i])
            }
            i++;
        }
        hashStack = tmpStack;
        hashStack.push({hash: hash, hisLen: ++times, orignHash: location.hash, isFromBack: function () {
            return  times - this.hisLen != 1;
        }});
        console.log(hashStack);

        if (hashStack.length < 2) {
            return;
        }
        var lastHash = hashStack[hashStack.length - 2], logAction;
        switch (hash) {
            case 'accountList':
                if (('index' == lastHash.hash) && !lastHash.isFromBack()) {
                    logAction = 'AddAccount';
                }
                break;
            case 'account':
                if (('index' == lastHash.hash) && !lastHash.isFromBack()) {
                    logAction = 'AccountList';
                }
                break;
            case 'detail':
                if (('account' == lastHash.hash) && !lastHash.isFromBack()) {
                    logAction = 'DetailList';
                }
                break;
            case 'comment':
                if (('detail' == lastHash.hash) && !lastHash.isFromBack()) {
                    logAction = 'Comment';
                }
                break;
        }
        logAction && log.log(logAction);
    }

    // = window.smartBack
    exports.exec = function () {
        var curHash = location.hash;
        if (!curHash) {
            window.location.href = "#index";
            return;
        }
        if (curHash.indexOf("index") >= 0) {
            return true;
        }
        var part = curHash.split("/")[0];
        if (0 == part.indexOf("#")) {
            part = part.substring(1);
        }
        var hashObj;
        while (hashStack.length) {
            hashObj = hashStack.pop();
            if (part != hashObj.hash) {
                break;
            }
        }
        if (hashObj) {
            console.log(hashObj);
            console.log(JSON.stringify(hashStack));
            if (!hashObj.isFromBack()) {
                history.go(-1);
            } else {
                window.location.href = hashObj.orignHash;
            }
        } else {
            window.location.href = "#index";
        }
        return false;
    }

});