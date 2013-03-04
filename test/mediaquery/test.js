var input = document.getElementById("log");

function getStyle(obj, attr)
{
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr];
    }
    else
    {
        return getComputedStyle(obj,false)[attr];
    }
}

var result = '';

result += "window.innerWidth:";
result += window.innerWidth

result += "Screen.width:";
result += window.screen.width;

result += "\n"

a = $("<div style='display: none' id='ratio'>");
$(document.body).append(a);
result += a.css("height");

input.innerHTML = result;
a.remove();