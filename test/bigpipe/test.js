
var jsonpID = 0,
    isObject = $.isObject,
    document = window.document,
    key,
    name,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    scriptTypeRE = /^(?:text|application)\/javascript/i,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = 'application/json',
    htmlType = 'text/html',
    blankRE = /^\s*$/

function jsonp(url){
    var callbackName = 'jsonp' + (++jsonpID),
        script = document.createElement('script');

    script.src = url.replace(/=\?/, '=' + callbackName);

    script.onchange =

    $('head').append(script);


}


jsonp("http://localhost:8080/tomcat/test.jsp?callback=?")

//asyncTest( "hello test", function() {
//        $.ajax({
//            type: 'GET',
//            url: 'http://localhost:8080/tomcat/test.jsp?callback=?',
//            // data to be added to query string:
//            // type of data we are expecting in return:
//            timeout: 2300,
//            success: function(data){
//               ok(data);
//               console.log(data);
//            },
//            error: function(xhr, type){
//                alert('Ajax error!')
//            }
//        });
//
//    setTimeout(function(){
//        start();
//    },3000)
//
//});






