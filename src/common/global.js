define(function(require){
	var $ = require('zepto'),
		h5_utils = require('h5_utils'),
        h5_base = require('h5_base'),
        dpi = require('dpi'),
        imgTrim = require('imgtrim'),
        tbh5 = require('h5_base'),
        log = require("./../common/log.js"),
        cdn = require('cdn'),
  		cookie = require('cookie');



    //全局函数
    /**
     * hash改变
     * @param hash
     * @param refer
     */
    changeHash = function (hash, refer) {
        log && log.logEnter(hash.split('/')[0].replace('#',''),refer);
        window.location.hash = hash;
    };


	return h5_utils.wrapColsure({
		init : function() {
            //如果是客户端隐藏bar
            if (h5_base.isClient()) {
                $('header.navbar').hide();
                $('body').addClass('webview');            }
            else
            {
                $('header.navbar').show();
                $('body').removeClass('webview');
            }
		    //判断是否支持cookie
		   // if(!cookie.isCookieEnable())
		   // {
		   //  alert('您的浏览器不支持cookie，请开启cookie!');
		   //  return ;
		   //  }
           //hash check
			this.hashCheck();
            //set dif time
        //    h5_mtop.saveBetTieme();
		},
		/**
		 * 检测hash
		 */
		hashCheck : function(){
		  var hash = location.hash ;
		  if(hash && hash != '#index'&&hash.indexOf('#fav') ==-1 && hash.indexOf('#account') ==-1&& hash.indexOf('#detail') ==-1 && hash.indexOf('#comment') ==-1 &&  hash.indexOf('#newComment') ==-1  &&  hash.indexOf('#recComment') ==-1 && hash.indexOf('#accountList') ==-1)
		  {
		   location.hash='#index';
		  }
		}
	});
});