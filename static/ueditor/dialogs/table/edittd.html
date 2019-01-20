<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="../internal.js"></script>
    <style type="text/css">
        .section {
            text-align: center;
            margin-top: 10px;
        }
        .section input {
            margin-left: 5px;
            width: 70px;
        }
    </style>
</head>
<body>
<div class="section">
    <span><var id="lang_tdBkColor"></var></span>
    <input type="text" id="J_tone"/>
</div>
<script type="text/javascript">
    var tone = $G("J_tone"),
            colorPiker = new UE.ui.ColorPicker({
                editor:editor
            }),
            colorPop = new UE.ui.Popup({
                editor:editor,
                content:colorPiker
            });
    domUtils.on(tone, "click", function () {
        colorPop.showAnchor(tone);
    });
    domUtils.on(document, 'mousedown', function () {
        colorPop.hide();
    });
    colorPiker.addListener("pickcolor", function () {
        tone.value = arguments[1];
        colorPop.hide();
    });
    colorPiker.addListener("picknocolor", function () {
        tone.value="";
        colorPop.hide();
    });
    dialog.onok=function(){
        editor.execCommand("edittd",tone.value);
    };

    var start = editor.selection.getStart(),
        cell = start && domUtils.findParentByTagName(start, ["td", "th"], true);
    if(cell){
        var color = domUtils.getComputedStyle(cell,'background-color');
        if(/^#/.test(color)){
            tone.value = color
        }

    }

</script>
</body>
</html>