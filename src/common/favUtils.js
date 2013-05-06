define(function (require, exports, module) {
    var  h5_comm = require("h5_comm"),
         notification = require('../ui/notification.js'),
         cache = require('../common/cache.js'),
         mtopAllspark =  require("./mtopForAllspark");


    var updateCache = function(cacheKey,isLiked)
    {
        //更新cache
        var cacheFeed = cache.getItemById(cacheKey);
        if(cacheFeed && cacheFeed.isLiked)
        {
            cacheFeed.isLiked = isLiked;
            cache.saveItem(cacheKey ,cacheFeed);
        }
    } ;

    exports.favbtn = function(_curTar,feedId,snsId){

        //判断是否登录
        if(!h5_comm.isLogin())
        {
            h5_comm.goLogin({rediUrl:'h5_allSpark',hideType:'close'});
            return ;
        }

        var cacheKey = snsId+"_"+feedId;

        if(_curTar.hasClass('faved')){
            mtopAllspark.favoriteRemoveFeed({feedId:feedId,snsId:snsId},function(d){
                if(d.fail){
                    notification.message('服务器在偷懒，再试试吧！');
                }else{
                    _curTar.removeClass('faved');
                    notification.message('已取消收藏！');
                    updateCache(cacheKey,"0");
                }
            });
        }else{
            mtopAllspark.favoriteAddFeed({feedId:feedId,snsId:snsId},function(d){
                if(d.fail){
                    if(d.fail.split('::').length >1)
                    {
                        notification.message(d.fail.split('::')[1]);
                    }
                    else
                    {
                    notification.message('服务器在偷懒，再试试吧！');
                    }
                  }else{
                    _curTar.addClass('faved');
                    notification.message('收藏成功，可以在微淘收藏列表中找到！');
                    updateCache(cacheKey,"1");
                }
            });
        }
    }

} );