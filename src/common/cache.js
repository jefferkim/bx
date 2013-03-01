/**
 * 变形项目缓存接口目前包含以下接口（以base/utils/server/h5_cache 为基础）：
 * 1、详情缓存接口
 * 2、判断是否需要创建sns账号，并缓存到cache中 （先缓存到localStorage中，如果不支持则缓存在cookie中）
 * 
 */
define(function(require, exports, module){
  //存储数量10条
  var maxCount = 10,
      
	itemCacheKey = 'allspark_item_key',
	
	snsFlagCacheKey = 'allspark_sns_flag_key',

     indexTmsCacheKey = 'allspark_index_tms_key',
	
	 h5_base = require('h5_base'),

      cookie = require('cookie'),
	
     h5_cache = require('h5_cache');


    /***
     * 首页tms缓存，save TmsData
     * 加上时间参数,缓存10分钟
     * value - String
     */
    exports.saveIndexTms = function(value)
    {
        h5_cache.putExpireValue(indexTmsCacheKey,value,600000)
    }
    /***
     * 获取tms缓存数据
     * 无数据或超时返回null
     */
    exports.getIndexTms = function()
    {
       return h5_cache.getExpireValue(indexTmsCacheKey);
    }
   /**
   *在自动创建sns账号成功后调用该接口，
   *失败时不要调用
   *
   */
   exports.saveSnsFlag = function(nick)
   {
      if(h5_base.isSuppLocalStorage())
      {
	   h5_cache.pushValue(snsFlagCacheKey,nick,'1',maxCount);
      }
      else
      {
       cookie.setCookie(snsFlagCacheKey+"_"+nick,'1');
      }
   }
    /**
   * 判断是否创建了Sns账号
   * 返回 true or false
   *
   */
   exports.isCreateSns = function(nick)
   {
      if(nick && nick.length > 1)
      {
          if(h5_base.isSuppLocalStorage())
          {
          return h5_cache.getValue(snsFlagCacheKey,nick) == '1';
          }
          else
          {
           return cookie.getCookie(snsFlagCacheKey+"_"+nick) =='1';
          }
      }
      return false;
   }
   /***
   * 通过id从cache获取item数据
   * 目前只对客户端缓存，非客户端直接返回null
   * 如果不存在返回 null
   **/   
   exports.getItemById = function (id)
   {
	   if(!h5_base.isClient())  
	   {
	   return null;
	   }
	  return  h5_cache.getValue(itemCacheKey,id);	   
   }
   /***
   * 缓存详情数据
   * 目前只缓存客户端的请求
   * id - 详情id
   * jsondata - 详情的json数据
   *  返回true or false
   **/ 
    exports.saveItem = function (id,jsonData)
   {
	   if(!h5_base.isClient())  
	   {
	   return false;
	   }
	  return  h5_cache.pushValue(itemCacheKey,id,jsonData,maxCount);   
   }
	  
});