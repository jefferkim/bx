seajs.config({
    alias:{
        'backbone':'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore':'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto':'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache':'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'linkfocus':'../../../../../base/modules/linkfocus/linkfocus',
        'uriBroker':'../../../../../base/utils/server/uriBroker',
        'h5_mtop':'../../../../base/utils/server/mtop_h5api',
        'h5_events':'../../../../../base/utils/server/h5_events',
        'h5_comm':'../../../../../base/utils/server/h5_common',
        'mtop_h5_chunk':'../../../../base/utils/server/mtop_h5_chunk',
        'h5_base':'../../../../../base/utils/server/h5_base',
        'h5_utils':'../../../../../base/utils/server/h5_utils',
        'h5_cache':'../../../../../base/utils/server/h5_cache',
        'base64':'../../../../../base/utils/server/base64_utf-8',
        'cookie':'../../../../../base/utils/server/cookie'
    },
    debug:1
});

define(function (require, exports) {

//    var mtopchunk = require("mtop_h5_chunk");
    var h5mtop = require("h5_mtop");

//    asyncTest("1.没有token,直接abort", 1, function () {
//        mtopchunk.chunkAjax({
//            url: 'http://localhost:8080/tomcat/test.jsp',
//            // data to be added to query string:
//            data: { name: 'chunktest' },
//            // type of data we are expecting in return:
//            // response type to expect from the server (“json”, “jsonp”, “xml”, “html”, or “text”)
//            timeout: 30000,
//            success: function(data){
//                console.log(data)
//            },
//            error: function(data){
//                console.log(data);
//                ok(0 == data.indexOf("ERRCODE_AUTH_REJECT"));
//                start();
//            }
//        })
//    });
//
//    asyncTest("2. 跨域请求", 1, function () {
//        try{
//        mtopchunk.chunkAjax({
//            url: 'http://api.waptest.taobao.com/rest/bigPipe.do?entrance=h5&apis=%20[{%22api%22:%22mtop.wdetail.getItemDetail%22,%22v%22:%222.0%22,%22data%22:%20{%22itemNumId%22:%221500001837979%22},%22sign%22:%2266d31da05a0d0a2dfe8108b33f73a670%22,%22callback%22:%20%22detail%22},{%22api%22:%22com.taobao.client.sys.getAppToken%22,%22v%22:%22*%22,%22data%22:%20{%22key%22:%22tbtest848%22},%22sign%22:%2249b33c21dab8438d3ab99803bc735dfc%22,%22callback%22:%22token%22}]%20&t=20121108151802&ttid=205200@taobao_android_2.4.0&authType=md5&imei=d1d7e6a0a102ad%20ed3aa9c47c65b749c855036094&imsi=0987654321&appKey=4272#',
//            // data to be added to query string:
//            data: { name: 'chunktest' },
//            // type of data we are expecting in return:
//            // response type to expect from the server (“json”, “jsonp”, “xml”, “html”, or “text”)
//            timeout: 30000,
//            success: function(data){
//                console.log(data)
//            },
//            error: function(data){
//                console.log(data);
//                ok(0 == data.indexOf("TOKEN_EXOIRED"));
//                start();
//            }
//        })
//        }catch(e){
//            console.log(e);
//        }
//    });
//
//    asyncTest("3. MTOP h5 chunk request", 1, function () {
//
//
//
//    });

    //调用mtop 接口
//    h5mtop.addApi("com.taobao.wap.rest2.wo123","1.0",
//            {"method":"getItemDetail","itemId":"1500005950525","isvCode":"27","albumId":"0"},
//        {}, function(result){
//            console.log(result);
//        },function(result){
//            console.log(result);
//        }).addApi("com.taobao.wap.rest2.wo4","1.0",
//        {"method":"getItemDetail","itemId":"1500005950515","isvCode":"12","albumId":"0"},
//        {}, function(result){
//            console.log(result);
//        },function(result){
//            console.log(result);
//        }).execute();

    //调用mtop 接口
    h5mtop.addApi("mtop.wdetail.getItemDetail","3.0",
        {'itemNumId':1500018674236},
        {}, function(result){
            console.log(result);
        },function(result){
            console.log(result);
        }).addApi("mtop.wdetail.getItemDetail","3.0",
        {'itemNumId':123456789},
        {}, function(result){
            console.log(result);
        },function(result){
            console.log(result);
        }).execute(true);


    //调用mtop 接口
//    h5mtop.getApi('mtop.transformer.account.autoCreate', '2.0', {}, {},
//        function (result) {
//            //处理正常的返回
//            console.log(result);
//        }, function (result) {
//            console.log(result);
//        });
//    setTimeout(function(){
//        start();
//    },1000);

});


//sets = ['a','b','c','d'];
//i = 0;
//sets.forEach(function(item){
//    console.log(item);
//    delete sets[i++];
//})
//console.log(sets);



