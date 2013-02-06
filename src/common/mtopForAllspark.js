define(function (require, exports, module) {
    var h5_mtop = require('h5_mtop'),
        h5_comm = require("h5_comm");

    /**
     * motp api简单的封装
     * @param apiName
     * @param param
     * @param successF
     * @param failF
     */
    var getData = exports.getData = function (apiName, param, successF, failF) {
        //调用mtop 接口
        h5_mtop.getApi(apiName, '2.0', param, {},
            function (result) {
                //处理正常的返回
                h5_comm.dealResponse(result, function (result) {
                        successF.call(this, result);
                    }, function (result) {
                        failF.call(this, result);
                    },
                    "allspark"
                );
            }, function (result) {
                failF.call(this, result);
            });
    };

    function convertIds(ids){
        if(ids.join){
            return {snsIds: ids.join(":")};
        }
        return {snsIds:ids};
    }

    /**
     * mtop.sns.follow.pubAccount.add 关注账号
     需用户登录
     入参：
     sid
     snsIds: string snsId:snsId
     出参：
     BatOperationResult
     业务异常：sid不存在对应的snsAccount，snsId不存在，snsId已经被关注
     mtop.sns.follow.pubAccount.remove 取消关注账号
     需用户登录
     入参：
     sid
     snsIds:long[]
     出参：
     BatOperationResult
     业务异常：sid不存在对应的snsAccount，snsId不存在，snsId未被关注
     */
    /**
     *
     * @param ids 可以为数字，字符串，或者数组
     * @param successF
     * @param failF
     */
    exports.addAccount = function(ids, successF, failF){
        this.getData("mtop.sns.follow.pubAccount.add",convertIds(ids), successF, failF)
    }
    exports.removeAccount = function(ids, successF, failF){
        this.getData("mtop.sns.follow.pubAccount.remove",convertIds(ids), successF, failF)
    }
});