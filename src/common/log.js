define(function (require, exports, module) {

    var aplus = require('aplus');

    exports.logEnter = function (data,uri) {
        console.log(data);
        if (data) {
            var param = {aplus:true};
            var ap_uri='';
//            param.apdata  = "allspark" + data + "_" + ap.enter;
//            ap.uri[uri] && (param.apuri = "allspark" + ap.uri[uri]);
            if(window.location.search==''){
                ap_uri=location.protocol+'//'+location.hostname + location.pathname+'?log=page_'+data.split('/')[0].replace('#','')+data;
            }else{
                ap_uri=location.protocol+'//'+location.hostname + location.pathname+window.location.search+'&log=page_'+data.split('/')[0].replace('#','')+data;
            }
            param.apuri=ap_uri;
            try{
                aplus.ajax(param);
            }catch(e) {
                console.log(e);
            }
        }
    }

    exports.logClick = function(data,uri){
        if (data) {
            var param = {aplus:true};
            var ap_uri='',ap_ref='';
            //param.apdata  = "allspark_" + data + "_" + ap.click;
            //ap.data[uri] && (param.apuri = "allspark" + ap.data[uri]);
            if(window.location.search==''){
                ap_uri=location.protocol+'//'+location.hostname + location.pathname+'?log=click_'+data;
                ap_ref=location.protocol+'//'+location.hostname + location.pathname+location.hash;
            }else{
                ap_uri=location.protocol+'//'+location.hostname + location.pathname+window.location.search+'&log=click_'+data+location.hash;
                ap_ref=location.protocol+'//'+location.hostname + location.pathname+window.location.search+location.hash;
            }
            param.apref=ap_ref;
            param.apuri=ap_uri;
            aplus.ajax(param);
        }
    }

    exports.logToLogin = function(){

    }


});