define(function(require){
	var $ = require('zepto'),
		h5_utils = require('h5_utils'),
        h5_base = require('h5_base'),
		cookie = require('cookie'),
        h5_mtop = require('h5_mtop');

	
	return h5_utils.wrapColsure({		
		init : function() {
            //如果是客户端隐藏bar
            if (h5_base.isClient()) {
                $('header.navbar').hide();
            }
		    //判断是否支持cookie
		   if(!cookie.isCookieEnable())
		   {
		    alert('您的浏览器不支持cookie，请开启cookie!');
		    return ;   
		    }
           //hash check
			this.hashCheck();
            //set dif time
            h5_mtop.saveBetTieme();
		},		
		/**
		 * 检测hash
		 */
		hashCheck : function(){
		   var hash = location.hash ;
		  if(hash && hash != '#index' && hash.indexOf('#account') ==-1&& hash.indexOf('#detail') ==-1 && hash.indexOf('#comment') ==-1 &&  hash.indexOf('#newComment') ==-1 && hash.indexOf('#accountList') ==-1)
		  {
		   location.hash='#index';
		  }		    
		}
	});
});