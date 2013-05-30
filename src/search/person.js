/**
 * User: 金建峰（jefferkim）
 * Date: 13-5-29
 * desc: person的model，对数据的管理
 */

define(function (require, exports, module) {
    var Backbone = require('backbone'),
        _ = require('underscore'),
        cache = require('../common/cache.js');

    return Backbone.Model.extend({

        defaults:{
           // isMyList:false //个人关注列表时，此时不渲染关注按钮
        },

        validate:function(attrs, options){



        },

        getPersonInfo: function () {
            return {
                id: this.get('id') === undefined ? 0 : this.get('id'),
                logoUrl: this.get('logoUrl') ? getImgUrl(this.get('logoUrl'),100,60) : "",
                nick: this.get('nick') || "",
                description: this.get('description') || "",
                linkUrlIsExt: this.get('linkUrlIsExt') == "true",
                url: this.get('url') || "",
                urlTitle: this.get('urlTitle') || "",
                wangwang: this.get('wangwang') || "",
                backgroundImg: this.get('backgroundImg') || "",
                followed: this.get('followed') == "true",
                followInfo: this.get('followed') == "true" ? {cls:'followed',txt:'已关注',log:'cancelattention'} : {cls:'unfollowed',txt:'关注',log:'attention'},
                fansCount: this.get('fansCount') ? formatFans(this.get('fansCount')) : 0,
                accountType: this.get('accountType') || 0
            }
        }



    });
});