/**
 * User: 金建峰（jefferkim）
 * Date: 13-5-29
 * desc: 单个person的view
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        h5_comm = require('h5_comm'),
        mtop = require('../common/mtopForAllspark.js');


    var personItemView = Backbone.View.extend({

        tagName: "li",

        template: $("#J-personTpl").html(),

        events: {
            "click .followbtn": "toggleFollow"
        },

        initialize: function () {
            //model的follow状态更改时触发重新渲染
            this.model.on("change:followed", this.render, this);

        },


        toggleFollow: function (e) { //只能关注，要取消关注进入详情页

            e.stopPropagation();

            var _model = this.model;
            var cur = $(e.currentTarget);

            if (h5_comm.isLogin()) { //已登录

                if (!cur.hasClass('followed')) {
                    cur.html('关注中...');
                    cur.addClass('min');
                    mtop.addAccount(_model.get('id'), function (resp) {
                        var result = resp.data.result;
                        if (result) {

                            for (var i = 0; i < result.length; i++) {
                                if (_model.get('id') == result[i].id && result[i].isSuccess == 'true') {
                                    _model.set({
                                        followed: "true",
                                        fansCount: parseInt(_model.get('fansCount')) + 1
                                    });

                                } else {
                                    notification.message('关注失败！');
                                    cur.removeClass('min');
                                    cur.html('关注');
                                }

                            }
                        }
                    }, function () {
                        notification.message('关注失败！');
                        cur.html('关注');
                        cur.removeClass('min');
                    });
                }
            } else {
                h5_comm.goLogin({rediUrl: 'h5_allSpark', hideType: 'close'});
            }

        },

        render: function () {
            return this.$el.html(_.template(this.template, this.model.getPersonInfo()));
        }

    });

    return personItemView;

});