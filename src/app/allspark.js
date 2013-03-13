seajs.config({
    alias: {
        'backbone': 'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore': 'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto': 'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache': 'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'linkfocus' : '../../../../base/modules/linkfocus/linkfocus',
        'uriBroker' : '../../../../base/utils/server/uriBroker',
        'h5_mtop': '../../../../base/utils/server/mtop_h5api',
        'h5_events' : '../../../../base/utils/server/h5_events',
        'h5_comm' : '../../../../base/utils/server/h5_common',
        'h5_base' : '../../../../base/utils/server/h5_base',
        'h5_utils' : '../../../../base/utils/server/h5_utils',
        'h5_cache' : '../../../../base/utils/server/h5_cache',
        'h5_token' : '../../../../base/utils/server/h5_token',
        'cookie' : '../../../../base/utils/server/cookie',
        'cdn' : '../../../../base/utils/server/cdn',
        'aplus': '../../../../base/modules/aplus/aplus'
    },
    debug: 1
});

function timestamps(time){

    if(typeof time == 'string'){
        time = parseInt(time);
    }

    var ONE_SECOND = 1000,
        ONE_MINUTE = ONE_SECOND * 60,
        ONE_HOUR   = ONE_MINUTE * 60,
        ONE_DAY    = ONE_HOUR   * 24;

    var iTrueTime = null,
        dNow = new Date(),
        iNow = dNow.getTime(),
        ret = "";

    if(typeof time == 'number'){

        iTrueTime = time;
    } else if(typeof time == 'object'){

        if(time.getTime){// an object of Date
            iTrueTime = time.getTime();
        }
    }

    if( iTrueTime != NaN){
        var dTrueTime = new Date();
        dTrueTime.setTime(iTrueTime);
    }
    var minutes=dTrueTime.getMinutes();
    if(minutes<10){
        minutes='0'+minutes;
    }

    if(iTrueTime == NaN){
        ret = "-";
    }else if(iTrueTime > iNow){
        ret = "您穿越了";
    } else if( iTrueTime > iNow - ONE_SECOND * 10){
        ret = "刚刚";
    } else if( iTrueTime > iNow - ONE_MINUTE){
        // e.g. 30秒前
        ret = parseInt((iNow - iTrueTime) / ONE_SECOND / 10).toString() + "0秒前";
    } else if( iTrueTime > iNow - ONE_HOUR){
        // e.g. 3分钟前
        ret = parseInt((iNow - iTrueTime) / ONE_MINUTE) + "分钟前";
    } else if( dTrueTime.getDate() ==dNow.getDate()){
        // e.g. 今天11:39
        ret = "今天" + dTrueTime.getHours() + ":" + minutes;
    } else if(dNow.getDate()-dTrueTime.getDate()==1){
        ret = "昨天" + dTrueTime.getHours() + ":" + minutes;
    } else{
        if(dTrueTime.getYear() == dNow.getYear()){
            // e.g. 9月10日 07:50
            ret = (dTrueTime.getMonth()+1) + "月" + dTrueTime.getDate() + "日 " + dTrueTime.getHours() + ":" + minutes;
        }else{
            // e.g. 2011年2月3日 12:39
            ret = dTrueTime.getFullYear() + "年" + (dTrueTime.getMonth()+1) + "月" + dTrueTime.getDate() + "日 " + dTrueTime.getHours() + ":" + minutes;
        }
    }
    return ret;
}
function numToBinary(num){
    var str = "";
    var next = num;
    var result ;
    do{
        result = next % 2;
        str = result + str ;
        next = Math.floor(next / 2)
    }while(next != 0)
    return str;
}
function noHelper(type){
    var v=numToBinary(type),r=false;
    v='0000'+v;
    return v.substring(v.length-4,1)!='1';
}

define(function(require, exports){
    require('./router').start();

})