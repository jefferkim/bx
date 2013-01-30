/**
 * 变形项目缓存接口目前包含以下接口（以base/utils/server/h5_cache 为基础）：
 * 1、详情缓存接口，
 * 2、是否缓存创建sns账号接口
 * 
 */
define(function(require, exports, module){
  //存储数量10条
  var maxCount = 10,
      
	itemCacheKey = 'allspark_item_key',
	
	snsFlagCacheKey = 'allspark_sns_flag_key',
	
	 h5_base = require('h5_base'),
	
    h5_cache = require('h5_cache');
   
   /**
   *在自动创建sns账号成功后调用该接口，
   *失败时不要调用,返回结果可以忽略
   *
   */
   exports.saveSnsFlag = function(nick)
   {
	return  h5_cache.pushValue(snsFlagCacheKey,nick,'1',maxCount);     
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
          return h5_cache.getValue(snsFlagCacheKey,nick) == '1';
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