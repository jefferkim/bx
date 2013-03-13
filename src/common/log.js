define(function (require, exports, module) {

    var aplus = require('aplus');

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