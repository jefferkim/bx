/**
 * 变形项目缓存接口目前包含以下接口（以base/utils/server/h5_cache 为基础）：
 * 1、详情缓存接口
 * 2、判断是否需要创建sns账号，并缓存到cache中 （先缓存到localStorage中，如果不支持则缓存在cookie中）
 *
 */
define(function (require, exports, module) {
    //存储数量10条
    var maxCount = 10,
        _=require('underscore'),
        keys =
        {
            'itemCacheKey': 'allspark_item_key',
            'accountCacheKey': 'allspark_account_key',
            'snsFlagCacheKey': 'allspark_sns_flag_key',
            'indexTmsCacheKey': 'allspark_index_tms_key',
            'feedCountsKey': 'allspark_feed_counts_key' ,
            'commentCountsKey': 'allspark_comment_counts_key'
        },
        h5_base = require('h5_base'),
        cookie = require('cookie'),
        H5Cache = require('h5_cache'),
        local_cache =new H5Cache('local'),
        mem_cache =new H5Cache('mem');

    /***
     * 首页tms缓存，save TmsData
     * 加上时间参数,缓存10分钟
     * value - String
     */
    exports.saveIndexTms = function (value) {
        local_cache.putExpireValue(keys['indexTmsCacheKey'], value, 600000)
    }
    /***
     * 获取tms缓存数据
     * 无数据或超时返回null
     */
    exports.getIndexTms = function () {
        return local_cache.getExpireValue(keys['indexTmsCacheKey']);
    }

    exports.savePersistent = function(_key,id,value){
        var key = keys[_key];
        if(!key){return null};
        h5_base.isSuppLocalStorage() ?
            local_cache.pushValue(key, id, value, maxCount)
            :cookie.setCookie(key + "_" + id, value);
    }

    exports.getPersistent = function(_key,id){
        var key = keys[_key];
        if(!key){return null};
        return h5_base.isSuppLocalStorage()?
            local_cache.popValue(key, id)
            : cookie.getCookie(key + "_" + id);
    }

    /**
     *在自动创建sns账号成功后调用该接口，
     *失败时不要调用
     *
     */
    exports.saveSnsFlag = function (nick) {
        exports.savePersistent('snsFlagCacheKey',nick,'1');
    }

    /**
     * 判断是否创建了Sns账号
     * 返回 true or false
     *
     */
    exports.isCreateSns = function (nick) {
        if (nick && nick.length > 1) {
            return '1' == exports.getPersistent('snsFlagCacheKey',nick);
        }
        return false;
    }

    /**
     * 比较通用的get 和 set方法
     * @param key
     * @param id
     * @param data
     * @returns {*}
     */
    exports.saveMemData = function (_key, id, data) {
        var key = keys[_key];
        if(!key){return null};
           return h5_base.isClient() ?
            local_cache.pushValue(key, id, data, maxCount)
            : mem_cache.pushValue(key, id, data, maxCount);
    }
    exports.getMemData = function(_key,id){
        var key = keys[_key];
        if(!key){return null};
        return h5_base.isClient()?
            local_cache.popValue(key, id)
            : mem_cache.popValue(key, id);
    }

    /**
     * 比较通用的get 和 set方法--有效期cache
     * @param key
     * @param id
     * @param data
     * @returns {*}
     */
    exports.saveExpireMemData = function (key,value,expireTime) {
        return h5_base.isClient() ?
            local_cache.putExpireValue(key,value,expireTime)
            : mem_cache.putExpireValue(key,value,expireTime);
    }
    exports.getExpireMemData = function(key){
       return h5_base.isClient()?
            local_cache.getExpireValue(key)
            : mem_cache.getExpireValue(key);
    }

    /**
     *从缓存中获取账号信息
     * @param id
     * @return {*}
     */
    exports.getAccountById = function (id) {
        return h5_base.isClient() ? exports.getExpireMemData('accCaKey_'+id) : exports.getMemData('accountCacheKey',id);
    }


    /**
     *保存账号信息至缓存
     * @param id
     * @param jsonData
     * @return {*}
     */
    exports.saveAccount = function (id, jsonData) {
        //Slimming info ,reduce cache size
        jsonData = _.pick(jsonData,'id','nick','logoUrl','fansCount','accountType');
        return h5_base.isClient() ? exports.saveExpireMemData('accCaKey_'+id,jsonData,900000) : exports.saveMemData('accountCacheKey',id,jsonData);
    }

    /***
     * 通过id从cache获取item数据
     * 目前只对客户端缓存，非客户端直接返回null
     * 如果不存在返回 null
     **/
    exports.getItemById = function (id) {
        return exports.getMemData('itemCacheKey',id);
    }
    /***
     * 缓存详情数据
     * 目前只缓存客户端的请求
     * id - 详情id
     * jsondata - 详情的json数据
     *  返回true or false
     **/
    exports.saveItem = function (id, jsonData) {
        //Slimming info ,reduce cache size
       // jsonData = _.pick(jsonData,'id','title','tiles','linkUrlIsExt','time','linkUrl');
        return exports.saveMemData('itemCacheKey',id,jsonData);
    }

    /***
     * 通过id从cache获取评论数据
     * 目前只对客户端缓存，非客户端直接返回null
     * 如果不存在返回 null
     **/
    exports.getCommCountById = function (id) {
        return exports.getMemData('commentCountsKey',id);
    }
    /***
     * 缓存评论数据
     * 目前只缓存客户端的请求
     * id - 详情id
     * jsondata - 详情的json数据
     *  返回true or false
     **/
    exports.saveCommCount = function (id, jsonData) {
       return exports.saveMemData('commentCountsKey',id,jsonData);
    }


});