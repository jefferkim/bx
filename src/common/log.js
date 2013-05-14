define(function (require, exports, module) {

    var aplus = require('aplus'),
        ap = {
          enter:2001,
          click:2101,
          data:{
              index: '_index',
              login: '_login',
              accountList: '_accountlist',
              account : '_account',
              detail : '_detail',
              comment : '_comment',
              recComment:'_recComment',
              fav:'_fav'
          },
          uri:{
              index:'_index',
              login:'_login'
          }
        };

    exports.logEnter = function (data,uri) {
        var data = ap.data[data];
        if (data) {
            var param = {aplus:true};
            param.apdata  = "allspark" + data + "_" + ap.enter;
            ap.uri[uri] && (param.apuri = "allspark" + ap.uri[uri]);
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
            param.apdata  = "allspark_" + data + "_" + ap.click;
            ap.data[uri] && (param.apuri = "allspark" + ap.data[uri]);
            aplus.ajax(param);
        }
    }

    exports.logToLogin = function(){

    }


});