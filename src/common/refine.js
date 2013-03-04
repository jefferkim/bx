define(function(require){
    var uriBroker = require('uriBroker'),
        cdn = require('cdn');
    /**
     * 重构数据集
     * @type {{refinePubAccount: Function, refineFeed: Function, refineFeedListItem: Function, refineFeedTile: Function, refineFeedItem: Function, refineComment: Function, refineAccountFeed: Function, refinePagination: Function, refinePaginationResult: Function, refineOperationResult: Function, refineBatOperationResult: Function}}
     */
    return {
        refinePubAccount:function (data){
            data.id = data.id===undefined?0:data.id;
            data.logoUrl = cdn.getImg(data.logoUrl,60,60) || "";
            data.nick = data.nick || "";
            data.description = data.description || "";
            data.url = data.url || "";
            data.urlTitle = data.urlTitle || "";
            data.wangwang = data.wangwang || "";
            data.backgroundImg = data.backgroundImg || "";
            data.fansCount = data.fansCount===undefined?0:data.fansCount;
            //data.followed = !!data.followed;
            data.accountType = data.accountType===undefined?0:data.accountType;

        },
        refineRecommend:function(data){
            var that=this;
            data.list&&data.list.forEach(function(d){
                that.refinePubAccount(d);
            });

        },
        refineFeed:function (data){
            var that=this;
            data.list&&data.list.forEach(function(d){
                that.refineFeedListItem(d)
            });
        },
        refineFeedListItem:function(data){
            var that=this;
            data.coverTile&&that.refineFeedTile(data.coverTile);
//            data.tiles&&data.tiles.forEach(function(d){
//                that.refineFeedTile(d);
//            });
            data.id = data.id===undefined?0:data.id;
            data.layout = data.layout || "";
            data.title = data.title || "";

            data.linkTitle = data.linkTitle || "";
            data.linkUrl = data.linkUrl || "";
            data.commentCount = data.commentCount===undefined?0:data.commentCount;
            data.time = data.time===undefined?0:data.time;
        },
        refineFeedTile:function (data){
            var that=this;
            if(typeof  data.type=='undefined'){
                data.type='';
            }
            //data.type =data.type===undefined?"":data.type;
            data.text = data.text || "";
            data.path = data.path || "";
            data.item&&that.refineFeedItem(data.item);
        },
        refineFeedItem:function (data){
            data.id = data.id===undefined?0:data.id;
            //refinedouble(data.price);
        },
        refineComment:function (data){
            data.id = data.id===undefined?0:data.id;
            data.content = data.content || "";
            data.createrId = data.createrId===undefined?0:data.createrId;
            data.createrName = data.createrName || "";
            data.createrPic = data.createrPic || "";
            data.time = data.time===undefined?0:data.time;
        },
        refineAccountFeed:function (data){
            this.refinePubAccount(data.account);
            this.refineFeed(data.firstFeed);
            data.unreadCount = data.unreadCount===undefined?0:data.unreadCount;
        },
        refinePagination:function (data){
            data.curPage = data.curPage===undefined?0:data.curPage;
            data.pageSize = data.pageSize===undefined?0:data.pageSize;
            data.direction = data.direction===undefined?0:data.direction;
            data.timestamp = data.timestamp===undefined?0:data.timestamp;
        },
        refinePaginationResult:function (data,refineT){
            data.totalCount = data.totalCount===undefined?0:data.totalCount;
            data.list.forEach(refineT);
            data.timestamp = data.timestamp===undefined?0:data.timestamp;
        },
        refineOperationResult:function (data){
            data.id = data.id===undefined?0:data.id;
            data.isSuccess = !!data.isSuccess;
            data.errorCode = data.errorCode || "";
        },
        refineBatOperationResult:function (data){
                data.isAllSuccess = !!data.isAllSuccess;
                data.list.forEach(this.refineOperationResult);
        },
        refineDetail: function(data) {
            data.title = data.title || ''
            data.linkUrl = data.linkUrl || ''
            data.tiles = data.tiles || []
        }
    };
});