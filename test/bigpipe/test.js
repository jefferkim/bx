seajs.config({
    alias:{
        'backbone':'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore':'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto':'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache':'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'linkfocus':'../../../../../base/modules/linkfocus/linkfocus',
        'uriBroker':'../../../../../base/utils/server/uriBroker',
        'h5_mtop':'../../../../../base/utils/server/mtop_h5_test',
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

    var mtopchunk = require("mtop_h5_chunk");

    asyncTest("1.没有token,直接abort", 1, function () {
        mtopchunk.chunkAjax({
            url: 'http://localhost:8080/tomcat/test.jsp',
            // data to be added to query string:
            data: { name: 'chunktest' },
            // type of data we are expecting in return:
            // response type to expect from the server (“json”, “jsonp”, “xml”, “html”, or “text”)
            timeout: 30000,
            success: function(data){
                console.log(data)
            },
            error: function(data){
                console.log(data);
                ok(0 == data.indexOf("ERRCODE_AUTH_REJECT"));
                start();
            }
        })
    });

    asyncTest("2. 跨域请求", 0, function () {
        try{
        mtopchunk.chunkAjax({
            url: 'http://api.waptest.taobao.com/rest/api2.do?api=mtop.transformer.account.autoCreate&v=2.0',
            // data to be added to query string:
            data: { name: 'chunktest' },
            // type of data we are expecting in return:
            // response type to expect from the server (“json”, “jsonp”, “xml”, “html”, or “text”)
            timeout: 30000,
            success: function(data){
                console.log(data)
            },
            error: function(data){
                console.log(data);
                ok(0 == data.indexOf("ERRCODE_AUTH_REJECT"));
                start();
            }
        })
        }catch(e){
            console.log(e);
        }
    });





});


