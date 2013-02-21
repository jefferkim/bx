/**
 * User: 晓田(tancy)
 * Date: 13-2-21
 * Time: PM4:44
 */
define(function (require, exports, module) {
    var Backbone = require('backbone'),
        $ = require('zepto'),
        _ = require('underscore'),
        _model=require('./accountModel');
    var accountView = Backbone.View.extend({
        events:{
        },
        initialize:function () {
            $('body').unbind();
            $('.tb-h5').html('');
            console.log('al');
            $('.tb-h5').html('accountView');

            var accountModel = new _model();
            accountModel.on("change:accInfo",function(model,result){

            });
            accountModel.on("change:accFeeds",function(model,result){

            });
            accountModel.on("change:prices",function(model,result){

            });
            accountModel.getPageData();
        }
    });
    return accountView;
});