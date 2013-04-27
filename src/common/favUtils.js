define(function (require, exports, module) {
    var  h5_comm = require("h5_comm"),
         notification = require('../ui/notification.js'),
         mtopAllspark =  require("./mtopForAllspark");

    exports.favbtn = function(_curTar,feedId,snsId){

        //判断是否登录
        if(!h5_comm.isLogin())
        {
            h5_comm.goLogin({rediUrl:'h5_allSpark',hideType:'close'});
            return ;
        }

        if(_curTar.hasClass('faved')){
            mtopAllspark.favoriteRemoveFeed({feedId:feedId,snsId:snsId},function(d){
                if(d.fail){
                    notification.message('服务器在偷懒，再试试吧！');
                }else{
                    _curTar.removeClass('faved');
                    notification.message('已取消收藏！');
                }
            });
        }else{
            mtopAllspark.favoriteAddFeed({feedId:feedId,snsId:snsId},function(d){
                if(d.fail){
                    notification.message('服务器在偷懒，再试试吧！');
                  }else{
                    _curTar.addClass('faved');
                    notification.message('收藏成功，可以在微淘收藏列表中找到！');
                }
            });
        }
    }
} );