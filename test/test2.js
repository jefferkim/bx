seajs.config({
    alias:{
        'backbone':'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore':'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto':'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache':'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'linkfocus':'../../../../base/modules/linkfocus/linkfocus',
        'uriBroker':'../../../../base/utils/server/uriBroker',
        'h5_mtop':'../../../../base/utils/server/mtop_h5_test',
        'h5_events':'../../../../base/utils/server/h5_events',
        'h5_comm':'../../../../base/utils/server/h5_common',
        'h5_base':'../../../../base/utils/server/h5_base',
        'h5_utils':'../../../../base/utils/server/h5_utils',
        'h5_cache':'../../../../base/utils/server/h5_cache',
        'base64':'../../../../base/utils/server/base64_utf-8',
        'cookie':'../../../../base/utils/server/cookie'

    },
    debug:1
});

define(function (require, exports) {

    var DetailModel = require("../src/detail/detailModel.js"),
        h5_cache = require("../../../base/utils/server/h5_cache.js");

    require("./framework/qunit-1.11.0.js");

    var detailModel = new DetailModel();
    //cart_test
    var sid = '209748772cdc638a00c9ace4d9c9c4b0';
    //bmwtui32/taobao1234
    var snsSid = '5fcfcd5e55cfc5f4a41766f3b9a3d03e';

    module(" Feed详情");
    asyncTest("1.获取 Feed详情信息", 1, function () {
        detailModel.getPageData({'sid':sid,'snsId':7000084652,'feedId':1138027});
    });

    var CommentModel = require("../src/comment/commentModel.js");
    var commentModel = new CommentModel();

    module(" 评论列表");
    asyncTest("1.获取评论列表信息", 1, function () {
        commentModel.getPageData({'sid':sid,'snsId':7000084652,'feedId':1138027});
    });
});


