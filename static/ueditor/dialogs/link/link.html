<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <script type="text/javascript" src="../internal.js"></script>
    <style type="text/css">
        *{margin:0;padding:0;color: #838383;}
        table{font-size: 12px;margin: 10px;line-height: 30px}
        .txt{width:300px;height:21px;line-height:21px;border:1px solid #d7d7d7;}
    </style>
</head>
<body>
    <table>
        <tr>
            <td><label for="text"> <var id="lang_input_text"></var></label></td>
            <td><input class="txt" id="text" type="text" disabled="true"/></td>
        </tr>
        <tr>
            <td><label for="href"> <var id="lang_input_url"></var></label></td>
            <td><input class="txt" id="href" type="text" /></td>
        </tr>
        <tr>
            <td><label for="title"> <var id="lang_input_title"></var></label></td>
            <td><input class="txt" id="title" type="text"/></td>
        </tr>
        <tr>
             <td colspan="2">
                 <label for="target"><var id="lang_input_target"></var></label>
                 <input id="target" type="checkbox"/>
             </td>
        </tr>
        <tr>
            <td colspan="2" id="msg"></td>
        </tr>
    </table>
<script type="text/javascript">
    var range = editor.selection.getRange(),
        link = range.collapsed ? editor.queryCommandValue( "link" ) : editor.selection.getStart(),
        url,
        text = $G('text'),
        rangeLink = domUtils.findParentByTagName(range.getCommonAncestor(),'a',true),
        orgText;
    link = domUtils.findParentByTagName( link, "a", true );
    if(link){
        url = utils.html(link.getAttribute( '_href' ) || link.getAttribute( 'href', 2 ));

        if(rangeLink === link && !link.getElementsByTagName('img').length){
            text.removeAttribute('disabled');
            orgText = text.value = link[browser.ie ? 'innerText':'textContent'];
        }else{
            text.setAttribute('disabled','true');
            text.value = lang.validLink;
        }

    }else{
        if(range.collapsed){
            text.removeAttribute('disabled');
            text.value = '';
        }else{
            text.setAttribute('disabled','true');
            text.value = lang.validLink;
        }

    }
    $G("title").value = url ? link.title : "";
    $G("href").value = url ? url: '';
    $G("target").checked = url && link.target == "_blank" ? true :  false;
    $focus($G("href"));

    function handleDialogOk(){
        var href =$G('href').value.replace(/^\s+|\s+$/g, '');
        if(href){
            if(!hrefStartWith(href,["http","/","ftp://",'#'])) {
                href  = "http://" + href;
            }
            var obj = {
                'href' : href,
                'target' : $G("target").checked ? "_blank" : '_self',
                'title' : $G("title").value.replace(/^\s+|\s+$/g, ''),
                '_href':href
            };
            //修改链接内容的情况太特殊了，所以先做到这里了
            //todo:情况多的时候，做到command里
            if(orgText && text.value != orgText){
                link[browser.ie ? 'innerText' : 'textContent'] =  obj.textValue = text.value;
                range.selectNode(link).select()
            }
            if(range.collapsed){
                obj.textValue = text.value;
            }
            editor.execCommand('link',utils.clearEmptyAttrs(obj) );
            dialog.close();
        }
    }
    dialog.onok = handleDialogOk;
    $G('href').onkeydown = $G('title').onkeydown = function(evt){
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            handleDialogOk();
            return false;
        }
    };
    $G('href').onblur = function(){
        if(!hrefStartWith(this.value,["http","/","ftp://",'#'])){
            $G("msg").innerHTML = "<span style='color: red'>"+lang.httpPrompt+"</span>";
        }else{
            $G("msg").innerHTML = "";
        }
    };

    function hrefStartWith(href,arr){
        href = href.replace(/^\s+|\s+$/g, '');
        for(var i=0,ai;ai=arr[i++];){
            if(href.indexOf(ai)==0){
                return true;
            }
        }
        return false;
    }


</script>
</body>
</html>
