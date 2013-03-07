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

     accountCacheKey= 'allspark_account_key',

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
    //内存缓存介质
    var baseCache = {};
    var defaultMaxCount = 30;

    exports.pushValue = function(key,jsonkey,jsonvalue,maxCount)
    {
        try
        {
            if(!key || !jsonkey || !jsonvalue) return false;

            maxCount = maxCount ||  defaultMaxCount ;
            if(maxCount <1) return false;
            //获取cache中的value
            var cacheValue = baseCache[key];
            var jsonObj={} ;
            jsonObj[jsonkey]=jsonvalue;
            if(!cacheValue)
            {
                baseCache[key] = "["+JSON.stringify(jsonObj)+"]";
                return true;
            }
            cacheValue = JSON.parse(cacheValue);
            var cacheValueLen =  cacheValue.length;
            var isReplaced =false;
            //先执行替换操作
            for(var i=0; i<cacheValueLen ;i++)
            {
                var temp= cacheValue[i][jsonkey] ;
                if(temp)
                {
                    cacheValue[i]= jsonObj;
                    isReplaced =true;
                    break;
                }
            }
            if(!isReplaced)
            {
                //如果没的替换则在尾部增加
                var start = cacheValueLen - maxCount +1;
                //如果超长了截取
                if(start > 0)
                {
                    cacheValue = cacheValue.slice(start,cacheValueLen);
                }
                cacheValue.push(jsonObj);
            }
            baseCache[key] = JSON.stringify(cacheValue);
        }
        catch(e)
        {
            return false;
        }
        return true;
    }
    /**
     * 获取存储数组对象中的json元素的value
     *
     *
     */
    exports.getValue = function(key,jsonkey)
    {
        try
        {
            var  cacheValue = baseCache[key];
            if(!cacheValue) return null;

            cacheValue = JSON.parse(cacheValue);
            var cacheValueLen =  cacheValue.length;
            //先执行替换操作
            for(var i=0; i<cacheValueLen ;i++)
            {
                var temp= cacheValue[i][jsonkey] ;
                if(temp)
                {
                    return  temp;
                }
            }

        }
        catch(e)
        {
            return null;
        }
        return null;
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
       return this.getValue(itemCacheKey,id);
       }
       else
       {
        return h5_cache.getValue(itemCacheKey,id);
       }
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
       return this.pushValue(itemCacheKey,id,jsonData,maxCount);
       }
       else
       {
       return h5_cache.pushValue(itemCacheKey,id,jsonData,maxCount);
       }
   }

    /**
     *从缓存中获取账号信息
     * @param id
     * @return {*}
     */
    exports.getAccountById = function (id)
    {
        if(!h5_base.isClient())
        {
       return this.getValue(accountCacheKey,id);
        }else
        {
       return h5_cache.getValue(accountCacheKey,id);
        }
    }



    /**
     *保存账号信息至缓存
     * @param id
     * @param jsonData
     * @return {*}
     */
    exports.saveAccount = function (id,jsonData)
    {
        if(!h5_base.isClient())
        {
        return this.pushValue(accountCacheKey,id,jsonData,maxCount);
        }
        else
        {
        return h5_cache.pushValue(accountCacheKey,id,jsonData,maxCount);
        }
    }

	  
});