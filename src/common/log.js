define(function (require, exports, module) {

    var aplus = require('aplus'),
        ap = {
          enter:2001,
          click:2101,
          data:{
              index: '_index_',
              login: '_login_',
              accountlist: '_accountlist_',
              addaccount: '_addaccount'
          },
          uri:{
              index:'_index'
          }

        };



    var params = {
        'AddAccount': {
            apuri: 'Allspark',
            apdata: 'AddAccount'
        },
        'AccountList': {
            apuri: 'Allspark',
            apdata: 'AccountList'
        },
        'DetailList': {
            apuri: 'AllsparkAccount',
            apdata: 'DetailList'
        },
        'Comment': {
            apuri: 'AllsparkDetail',
            apdata: 'Comment'
        },
        'Attention': {
            apuri: 'AllsparkList',
            apdata: 'Attention'
        }
    }

    exports.log = function (logAction) {
        var param = params[logAction];
        if (param) {
            param.aplus = true;
            //set apuri & apdata
            aplus.ajax(param);
        }
    }


});