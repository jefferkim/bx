function calSizeRatio(){
    var style = document.createElement("style");
    style.type = "text/css";
    style.textContent = "@media screen and (-webkit-device-pixel-ratio:1) {#ratio{height:1px;}}"
        +"@media screen and (-webkit-device-pixel-ratio:1.5) {#ratio{height:1.5px;}}"
        + "@media screen and (-webkit-device-pixel-ratio:2) {#ratio{height:2px;}}";
    $('head').append(style);

    var ratioTag = $("<div style='display: none' id='ratio'>");
    $(document.body).append(ratioTag);
    var result = ratioTag.css("height");

    ratioTag.remove();
    $(style).remove();
    return result;
}

var input = document.getElementById("log");

var result = '';

result += "window.innerWidth:";
result += window.innerWidth

result += "Screen.width:";
result += window.screen.width;

result += calSizeRatio() + "\n";

input.innerHTML = result;

