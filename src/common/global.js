define(function(require){
	var _ = require('underscore'),
		$ = require('zepto'),
		linkfocus = require('linkfocus'),
		h5_utils = require('h5_utils'),
		cookie = require('cookie'),
		currentView;
	
	var E_wrap,
		isAdjustFullscreen = isAdjustLandscape = false;
	
	return h5_utils.wrapColsure({		
		init : function() {
		    //判断是否支持cookie

		   if(!cookie.isCookieEnable())
		   {
		    alert('您的浏览器不支持cookie，请开启cookie!');
		    return ;   
		    }		    
			E_wrap = $('#tbh5v0 .screen-wrap');	
		//	this.goTop();			
		 //   document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);	
			this.doCommonUI();	
			this.hashCheck();	
		},		
		setCurrentView : function(view){
		  currentView = view;
		  },
		/**
		 * 去地址栏
		 */
		goTop : function()
		{
             scrollTo(0,0);
		},
		refreshHeight:function(){
            setTimeout(function(){
               currentView &&  $('#J_Content').css({
                    'height': ($('#J_' + currentView)[0].clientHeight )
                });
            }, 10);
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
		,
		/**
		 * 全局UI动画
		 */
		doCommonUI : function() {			
			var self = this;
			
			// 计算屏幕是否为横屏
			var cw = document.documentElement.clientWidth;
			var ch = document.documentElement.clientHeight;
			
			if (cw < ch) {
				//E_wrap.removeClass('landscape');
				E_wrap.toggleClass('fullscreen');
			} else {
				//E_wrap.removeClass('fullscreen');
				E_wrap.toggleClass('landscape')
			}
			
			// 随着屏幕改变wrap的大小
			this.adjustScreen();
			this.orientation(function() {
				E_wrap.toggleClass('fullscreen').toggleClass('landscape');
			//	alert(E_wrap[0].className);
				//去地址栏				
  			    self.refreshHeight();
				self.goTop();
				setTimeout(self.adjustScreen, 500);
			});			
		
			// android模拟焦点框
			//linkfocus('*[liveclick]');
			linkfocus('a, button');
		},
	
		
		/**
		 * 适应屏幕
		 */
		adjustScreen : function() {
			E_wrap.hasClass('landscape') ? 
						this.adjustLandscape() : 
							this.adjustFullscreen();
		},
		
		adjustFullscreen : function() {
			if (!isAdjustFullscreen) {
				isAdjustFullscreen = true;
				var w = E_wrap.width();
				var cw = document.documentElement.clientWidth;
				var left = (cw - w) / 2;
				var sheet = document.styleSheets[0];
                sheet && sheet.addRule('.fullscreen .abs-pos', 'left:' + left + 'px;');
			}
		},
		
		adjustLandscape : function() {
			if (!isAdjustLandscape) {
				isAdjustLandscape = true;
				var w = E_wrap.width();
				var cw = document.documentElement.clientWidth;
				var left = (cw - w) / 2;
				var sheet = document.styleSheets[0];
                sheet && sheet.addRule('.landscape .abs-pos', 'left:' + left + 'px;');
			}
		},
		
		/**
		 * 屏幕转向事件
		 */
	    orientation : function(callback){
			var support = "onorientationchange" in window,
				event = support ? "orientationchange" : "resize";
			$(window).on(event, callback);
		}		
		
	});
});