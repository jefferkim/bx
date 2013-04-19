seajs.config({
    alias: {
        'backbone': 'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore': 'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto': 'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache': 'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'linkfocus' : '../../../../base/modules/linkfocus/linkfocus',
        'lazyload': '../../../../base/modules/lazyload/js/lazyload',
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
        'aplus': '../../../../base/modules/aplus/aplus',
        'dpi' : '../../../../base/modules/imgtrim/dpi',
        'imgtrim': '../../../../base/modules/imgtrim/trim'
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
        ret = "刚刚";
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
    return v.substring(v.length-4,v.length-3)!='1';
}

function isLongImg(data) {
    return data && (parseFloat(data.picWidth) / parseFloat(data.picHeight) > 1.45)
}

function isSquareImg(data) {
    return data && (parseFloat(data.picWidth) / parseFloat(data.picHeight) <= 1.45)
}

// 判斷螢幕旋轉方向
function setOrientation() {
    var orient;

    if (window.orientation) {
        orient = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
    }
    else if (window.screen) {
        var width = screen.width;
        var height = screen.height;
        orient = (width > height) ? 'landscape' : 'portrait';
    }
    else {
        orient = 'unknow';
    }

    return orient;
}

function feedImageSizeStyle(actualWidth, actualHeight){
    var width = parseInt(actualWidth);
    var height = parseInt(actualHeight);
    var expectWidth ;
    expectWidth= window.innerWidth - 30;
    if(setOrientation()=='portrait'){
        //if(window.innerWidth>)
        expectWidth= window.innerWidth - 30;
    }else{
        expectWidth=(window.innerWidth>window.innerHeight?window.innerWidth:window.innerHeight)-30;
        //expectWidth=window.innerHeight-30;

    }
    var expectHeight = 0;

    if(width<height){
        //高度大于宽度的时候裁剪图像
        if (width < expectWidth) {
            //屏幕宽度大于图像原尺寸进行等比放大
            expectHeight = (expectWidth / width) * height;

            //放大后高度大于屏幕宽度 则 高度为屏幕宽度
            if(expectHeight>expectWidth){
                expectHeight=expectWidth;
            }

        }else{
            expectHeight = expectWidth;
        }

    }else{
        if (width < expectWidth) {
            expectHeight = (expectWidth / width) * height
        } else {
            expectHeight = height / (width / expectWidth)
        }
    }

    if (!expectHeight) return "width: 100%"
    else return "width: " + expectWidth + 'px; ' + 'height: ' + expectHeight + 'px;'


}

function detailImageSizeStyle(actualWidth, actualHeight) {

    var width = parseInt(actualWidth)
    var height = parseInt(actualHeight)

    var expectWidth = window.innerWidth - 30
    var expectHeight = 0;

    if (width < expectWidth) {
        expectHeight = (expectWidth / width) * height
    } else {
        expectHeight = height / (width / expectWidth)
    }

    if (!expectHeight) return "width: 100%"
    else return "width: " + expectWidth + 'px; ' + 'height: ' + expectHeight + 'px;'
}

/**
 * 格式化关注数
 * @param fansCount
 */
function formatFans(fansCount)
{
    if(typeof fansCount == 'string')
    {
        fansCount = parseInt(fansCount);
    }
    if(fansCount > 99999999)
    {
        fansCount = fansCount.toString();
        return fansCount.substr(0,fansCount.length-8)+'亿';
    }
   else if(fansCount > 999999)
    {
        fansCount = fansCount.toString();
        return fansCount.substr(0,fansCount.length-4)+'万';
    }
    else if(fansCount  > 9999)
    {
        fansCount = fansCount.toString();
        var dian = fansCount.charAt(fansCount.length-4);
         return fansCount.substr(0,fansCount.length-4)+(dian =='0' ? '':'.'+dian)+'万';
    }
    return fansCount.toString();
}


define(function(require, exports){
    require('./router').start();

})