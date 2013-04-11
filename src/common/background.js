define(function (require, exports, module) {

    var log = require("./log.js"),
        Backbone = require('backbone'),
        hashStack = [],
        h5_comm = require('h5_comm'),
        times = -1;

    function addHash(hash,origin){
        hashStack.push({hash: hash, hisLen: ++times, orignHash: origin ? origin : location.hash, isFromBack: function () {
            return  times - this.hisLen != 1;
        }});
    }
    addHash("index","#index");

    /**
     * 记录用户进入该页面,同时可以触发相关的log
     * @param hash
     */
    exports.enter = function (hash) {
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
        addHash(hash);

        //记录进入日志
        //logEnter && logEnter(hash);
    }

    function logEnter(hash){
        if(hashStack.length > 1){
            var lastHash = hashStack[hashStack.length - 2];
            lastHash.isFromBack() || log.logEnter(hash, isFromLogin() ? "login":"");
        }else{
            log.logEnter(hash, isFromLogin() ? "login":"");
        }
    }

    function isFromLogin(){
        return h5_comm.isLogin() && 1 == times
            && document.referrer && 0 == document.referrer.indexOf("http://login");
    }

    var BackgroundView = Backbone.View.extend({
        el: '#content',
        events: {
            'click header .back': function (e) {
                if(hashStack.length > 0 && "index" == hashStack[hashStack.length - 1].hash ){
                    return true;
                }
                var prevHash = null;
                if (hashStack.length > 1) {
                    prevHash = hashStack[hashStack.length - 2];
                }
                window.location.href = ((prevHash && prevHash.orignHash) ? prevHash.orignHash : "#index");
                return false;
            },
            'click .log[data-log]': function (e, r) {
                var currentUri = hashStack.length ?  hashStack[hashStack.length - 1].hash : "";
                var z = $(e.currentTarget);
                var data = z.data("log")
                if(data){
                    if( !h5_comm.isLogin() && (data == "addaccount" || data == "attention" || data == "addcomment")){
                        //log to login
                        log.logToLogin(data,currentUri);
                    }
                    if("attention" == data && "account" == currentUri && z.hasClass("followed")){
                        data = "cancelattention";
                    }
                    log.logClick(data,currentUri);
                }

            }
        }
    });

    exports.backgroundView = new BackgroundView;

});