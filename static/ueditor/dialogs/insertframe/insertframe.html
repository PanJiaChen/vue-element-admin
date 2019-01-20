<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script type="text/javascript" src="../internal.js"></script>
    <style type="text/css">
        .warp {width: 320px;height: 153px;margin-left:5px;padding: 20px 0 0 15px;position: relative;}
        #url {width: 290px; margin-bottom: 2px; margin-left: -6px; margin-left: -2px\9;*margin-left:0;_margin-left:0; }
        .format span{display: inline-block; width: 58px;text-align: center; zoom:1;}
        table td{padding:5px 0;}
        #align{width: 65px;height: 23px;line-height: 22px;}
    </style>
</head>
<body>
<div class="warp">
        <table width="300" cellpadding="0" cellspacing="0">
            <tr>
                <td colspan="2" class="format">
                    <span><var id="lang_input_address"></var></span>
                    <input style="width:200px" id="url" type="text" value=""/>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="format"><span><var id="lang_input_width"></var></span><input style="width:200px" type="text" id="width"/> px</td>

            </tr>
            <tr>
                <td colspan="2" class="format"><span><var id="lang_input_height"></var></span><input style="width:200px" type="text" id="height"/> px</td>
            </tr>
            <tr>
                <td><span><var id="lang_input_isScroll"></var></span><input type="checkbox" id="scroll"/> </td>
                <td><span><var id="lang_input_frameborder"></var></span><input type="checkbox" id="frameborder"/> </td>
            </tr>

            <tr>
                <td colspan="2"><span><var id="lang_input_alignMode"></var></span>
                    <select id="align">
                        <option value=""></option>
                        <option value="left"></option>
                        <option value="right"></option>
                    </select>
                </td>
            </tr>
        </table>
</div>
<script type="text/javascript">
    var iframe = editor._iframe;
    if(iframe){
        $G("url").value = iframe.getAttribute("src")||"";
        $G("width").value = iframe.getAttribute("width")||iframe.style.width.replace("px","")||"";
        $G("height").value = iframe.getAttribute("height") || iframe.style.height.replace("px","") ||"";
        $G("scroll").checked = (iframe.getAttribute("scrolling") == "yes") ? true : false;
        $G("frameborder").checked = (iframe.getAttribute("frameborder") == "1") ? true : false;
        $G("align").value = iframe.align ? iframe.align : "";
    }
    function queding(){
        var  url = $G("url").value.replace(/^\s*|\s*$/ig,""),
                width = $G("width").value,
                height = $G("height").value,
                scroll = $G("scroll"),
                frameborder = $G("frameborder"),
                float = $G("align").value,
                newIframe = editor.document.createElement("iframe"),
                div;
        if(!url){
            alert(lang.enterAddress);
            return false;
        }
        newIframe.setAttribute("src",/http:\/\/|https:\/\//ig.test(url) ? url : "http://"+url);
        /^[1-9]+[.]?\d*$/g.test( width ) ? newIframe.setAttribute("width",width) : "";
        /^[1-9]+[.]?\d*$/g.test( height ) ? newIframe.setAttribute("height",height) : "";
        scroll.checked ?  newIframe.setAttribute("scrolling","yes") : newIframe.setAttribute("scrolling","no");
        frameborder.checked ?  newIframe.setAttribute("frameborder","1",0) : newIframe.setAttribute("frameborder","0",0);
        float ? newIframe.setAttribute("align",float) :  newIframe.setAttribute("align","");
        if(iframe){
            iframe.parentNode.insertBefore(newIframe,iframe);
            domUtils.remove(iframe);
        }else{
            div = editor.document.createElement("div");
            div.appendChild(newIframe);
            editor.execCommand("inserthtml",div.innerHTML);
        }
        editor._iframe = null;
        dialog.close();
    }
    dialog.onok = queding;
    $G("url").onkeydown = function(evt){
        evt = evt || event;
        if(evt.keyCode == 13){
            queding();
        }
    };
    $focus($G( "url" ));

</script>
</body>
</html>