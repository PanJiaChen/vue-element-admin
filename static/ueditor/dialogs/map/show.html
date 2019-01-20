<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8"/>
    <meta name="keywords" content="百度地图,百度地图API，百度地图自定义工具，百度地图所见即所得工具"/>
    <meta name="description" content="百度地图API自定义地图，帮助用户在可视化操作下生成百度地图"/>
    <title>百度地图API自定义地图</title>
    <!--引用百度地图API-->
    <style type="text/css">
        html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
    </style>
    <script type="text/javascript" src="http://api.map.baidu.com/api?key=&v=1.1&services=true"></script>
</head>

<body onload="initMap();">
<!--百度地图容器-->
<div style="width:697px;height:550px;border:#ccc solid 1px;" id="dituContent"></div>
</body>
<script type="text/javascript">
    function getParam(name) {
        return location.href.match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';
    }
    var map, marker;
    var centerParam = getParam('center');
    var zoomParam = getParam('zoom');
    var widthParam = getParam('width');
    var heightParam = getParam('height');
    var markersParam = getParam('markers');
    var markerStylesParam = getParam('markerStyles');

    //创建和初始化地图函数：
    function initMap() {
        // [FF]切换模式后报错
        if (!window.BMap) {
            return;
        }
        var dituContent = document.getElementById('dituContent');
        dituContent.style.width = widthParam + 'px';
        dituContent.style.height = heightParam + 'px';

        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件

        // 创建标注
        var markersArr = markersParam.split(',');
        var point = new BMap.Point(markersArr[0], markersArr[1]);
        marker = new BMap.Marker(point);
        marker.enableDragging();
        map.addOverlay(marker); // 将标注添加到地图中

        if(parent.editor && parent.document.body.contentEditable=="true") { //在编辑状态下
            setMapListener();//地图改变修改外层的iframe标签src属性
        }
    }

    //创建地图函数：
    function createMap() {
        map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
        var centerArr = centerParam.split(',');
        var point = new BMap.Point(parseFloat(centerArr[0]), parseFloat(centerArr[1]));//定义一个中心点坐标
        map.centerAndZoom(point, parseInt(zoomParam));//设定地图的中心点和坐标并将地图显示在地图容器中
    }

    //地图事件设置函数：
    function setMapEvent() {
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
    }

    //地图控件添加函数：
    function addMapControl() {
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE});
        map.addControl(ctrl_nav);
        //向地图中添加缩略图控件
        var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1});
        map.addControl(ctrl_ove);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
        map.addControl(ctrl_sca);
    }

    function setMapListener() {
        var editor = parent.editor, containerIframe,
            iframes = parent.document.getElementsByTagName('iframe');
        for (var key in iframes) {
            if (iframes[key].contentWindow == window) {
                containerIframe = iframes[key];
                break;
            }
        }
        if (containerIframe) {
            map.addEventListener('moveend', mapListenerHandler);
            map.addEventListener('zoomend', mapListenerHandler);
            marker.addEventListener('dragend', mapListenerHandler);
        }

        function mapListenerHandler() {
            var zoom = map.getZoom(),
                center = map.getCenter(),
                marker = window.marker.getPoint();
            containerIframe.src = containerIframe.src.
                replace(new RegExp('([?#&])center=([^?#&]+)', 'i'), '$1center=' + center.lng + ',' + center.lat).
                replace(new RegExp('([?#&])markers=([^?#&]+)', 'i'), '$1markers=' + marker.lng + ',' + marker.lat).
                replace(new RegExp('([?#&])zoom=([^?#&]+)', 'i'), '$1zoom=' + zoom);
            editor.fireEvent('saveScene');
        }
    }
</script>
</html>