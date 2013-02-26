//var xhr = new XMLHttpRequest();
//xhr.open('GET', 'http://localhost:8080/tomcat/test.jsp',true);
//xhr.onload = function(e) {
//    console.log(e);
//}
//xhr.onprogress = function(e){
//    console.log(xhr);
//    console.log(xhr.getAllResponseHeaders());
//    console.log(xhr.responseText);
//    console.log(xhr.status);
////    xhr.responseText = '';
//}
//
//xhr.onreadystatechange = function(stat){
//    console.log(xhr.readyState);
//}
//xhr.send();

$.chunkAjax({
    url: 'http://localhost:8080/tomcat/test.jsp',
    // data to be added to query string:
    data: { name: 'chunktest' },
    // type of data we are expecting in return:
    // response type to expect from the server (“json”, “jsonp”, “xml”, “html”, or “text”)
//    dataType: 'json',
    timeout: 30000,
    success: function(data){
        // Supposing this JSON payload was received:
        //   {"project": {"id": 42, "html": "<div>..." }}
        // append the HTML to context object.
        console.log(data)
    },
    error: function(xhr, type){
        alert('Ajax error!')
    }
})