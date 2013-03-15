define(function (require, exports, module) {

    var log = require("./log.js"),
        Backbone = require('backbone'),
        hashStack = [],
        times = 0,
        BackgroundView = Backbone.View.extend({
            el: '#content',
            events: {
                'click header .back': function (e) {
                    return exports.exec();
                },
                'click .log[data-log]': function (e, r) {
                    //TODO
                }
            }
        });

    exports.backgroundView = new BackgroundView;


    exports.add = function (hash) {
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
        var prevHash = null;
        if (hashStack.length > 1) {
            prevHash = hashStack[hashStack.length - 2];
        }

        window.location.href = (prevHash ? prevHash.orignHash : "#index");
    }

});