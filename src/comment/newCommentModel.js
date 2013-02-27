define(function (require, exports, module) {
    var Backbone = require('backbone'),
       mtop = require('../common/mtopForAllspark.js')

    /**
     * 动态首页
     */
    return  Backbone.Model.extend({
        /**
         * 评论详情
         *
         * @param param.feedId
         * @param param.snsId
         */
        addComment:function(param) {
            var self = this;
            if (mtop.userNick){
                //设置登录状态
                self.set("loginStatus",true);
                mtop.addComment(param, function (recResult) {
                self.set("status",'sucess');
                },function(recResult){
                    self.set("status",'fail');
                })
        } else {
            self.set("loginStatus",false);
        }
    }
    });
});