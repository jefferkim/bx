seajs.config({
    alias: {
        'backbone': 'http://a.tbcdn.cn/mw/base/libs/backbone/0.9.2/backbone',
        'underscore': 'http://a.tbcdn.cn/mw/base/libs/underscore/1.3.3/underscore',
        'zepto': 'http://a.tbcdn.cn/mw/base/libs/zepto/1.0.0/zepto',
        'mustache': 'http://a.tbcdn.cn/mw/base/libs/mustache/0.5.0/mustache',
        'linkfocus' : '../../../../base/modules/linkfocus/linkfocus',
        'uriBroker' : '../../../../base/utils/server/uriBroker',
        'h5_mtop': '../../../../base/utils/server/mtop_h5',
        'h5_events' : '../../../../base/utils/server/h5_events',
        'h5_comm' : '../../../../base/utils/server/h5_common',
        'h5_base' : '../../../../base/utils/server/h5_base',
        'h5_utils' : '../../../../base/utils/server/h5_utils',
        'h5_cache' : '../../../../base/utils/server/h5_cache',
        'cookie' : '../../../../base/utils/server/cookie'

    },
    debug: 1
});


define(function(require, exports){
    require('./router').start();
});