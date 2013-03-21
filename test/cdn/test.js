seajs.config({
    alias: {
        'backbone': 'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore': 'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto': 'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache': 'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'cdn': '../../../../base/utils/server/cdn'
    },
    debug: 1
});


define(function (require, exports) {

    var cdn = require("cdn");

//    var url = cdn.getBetterImg("http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg", 100, 100);
//
//    console.log(url);
//
//    console.log(cdn.getBetterImg("http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg", 100, 80));
//
//    cdn.setDefaultDpi(2)
//    console.log(cdn.getBetterImg("http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg", 100, 990));
//
//    cdn.setDefaultDpi(3)
//    console.log(cdn.getBetterImg("http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg", 100, 990));
//
//    cdn.setDefaultDpi(1.5)
//    console.log(cdn.getBetterImg("http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg", 100, 990));
//
//    console.log(cdn.getBetterImg("http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg", 100, 140));



    cdn.setDefaultDpi(2);
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 480,
//        rHeight: 990,
//        expWidth: 320 }));
//    cdn.setDefaultDpi(2);
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 480,
//        rHeight: 990,
//        expWidth: 320 }));
//    cdn.setDefaultDpi(2);
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 580,
//        rHeight: 990,
//        expWidth: 320,
//        isXz : true}));


    console.log(cdn.resizeImg({
        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
        rWidth: 580,
        rHeight: 990,
        expWidth: 1000
    }));

//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 990,
//        rHeight: 990,
//        expWidth: 320,
//        isXz: true}));
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 990,
//        rHeight: 1500,
//        expWidth: 320,
//        isXz: true}));
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 990,
//        rHeight: 1500,
//        expWidth: 320}));
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 990,
//        rHeight: 400,
//        expWidth: 320,
//        isXz: true}));
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 990,
//        rHeight: 400,
//        expWidth: 320}));
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 480,
//        rHeight: 400,
//        expWidth: 320,
//        isXz: true}));
//    console.log(cdn.resizeImg({
//        url: "http://img02.taobaocdn.com/tps/i2/T1b9JqXshaXXcebizh-990-200.jpg",
//        rWidth: 480,
//        rHeight: 900,
//        expWidth: 320}));

});



