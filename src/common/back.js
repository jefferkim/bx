define(function(require, exports, module) {

    var hashStack = [];

    exports.add = function(hash){
        if("newComment" == hash){return};
        var tmpStack = [];
        var i = 0;
        while(i<hashStack.length){
            if(hashStack[i].hash == hash){
                break;
            }else{
                tmpStack.push(hashStack[i])
            }
            i++;
        }
        hashStack = tmpStack;
        hashStack.push({hash:hash,hisLen:history.length,orignHash:location.hash});
        console.log(hashStack);
    }

    // = window.smartBack
    exports.exec = function(){
        var curHash = location.hash;
        if(!curHash){
            window.location.href = "#index";
            return;
        }
        if(curHash.indexOf("index")>=0){
            return true;
        }
        var part = curHash.split("/")[0];
        if(0 == part.indexOf("#")){
            part = part.substring(1);
        }
        var hashObj;
        while(hashStack.length){
            hashObj = hashStack.pop();
            if(part != hashObj.hash){
                break;
            }
        }
        if( hashObj){
            console.log(hashObj);
            console.log(JSON.stringify(hashStack));
            if(-1 == (hashObj.hisLen - history.length)){
                history.go(-1);
            }else{
                window.location.href = hashObj.orignHash;
            }
        }else{
            window.location.href = "#index";
        }
        return false;
    }

});