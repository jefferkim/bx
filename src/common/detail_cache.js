/**
 * 以h5_cache为基础存储详情的json数据
 * 默认存储10条详情数据 
 * 
 */
define(function(require, exports, module){
  //存储数量10条
  var maxCount = 10,
      
	itemCacheKey = 'allspark_item_key',
        
   h5_cache = require('h5_cache');
   
   /***
   * 通过id从cache获取item数据
   * 如果不存在返回 null
   **/   
   exports.getItemById = function (id)
   {
	  return  h5_cache.getValue(itemCacheKey,id);	   
   }
   /***
   * 缓存详情数据
   * id - 详情id
   * jsondata - 详情的json数据
   *  返回true or false
   **/ 
    exports.saveItem = function (id,jsonData)
   {
	  return  h5_cache.pushValue(itemCacheKey,id,jsonData,maxCount);   
   }
	  
});