<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script type="text/javascript" src="../internal.js"></script>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=1.1&services=true"></script>
    <style type="text/css">
        .content{width:530px; height: 350px;margin: 10px auto;}
        .content table{width: 100%}
        .content table td{vertical-align: middle;}
        #city,#address{height:21px;background: #FFF;border:1px solid #d7d7d7; line-height: 21px;}
        #city{width:60px}
        #address{width:130px}
        #is_dynamic_label span{vertical-align:middle;margin: 3px 0px 3px 3px;}
        #is_dynamic_label input{vertical-align:middle;margin: 3px 3px 3px 50px;}
    </style>
</head>
<body>
<div class="content">
    <table>
        <tr>
            <td><var id="lang_city"></var>:</td>
            <td><input id="city" type="text" /></td>
            <td><var id="lang_address"></var>:</td>
            <td><input id="address" type="text" value="" /></td>
            <td><a href="javascript:doSearch()" class="button"><var id="lang_search"></var></a></td>
            <td><label id="is_dynamic_label" for="is_dynamic"><input id="is_dynamic" type="checkbox" name="is_dynamic" /><span><var id="lang_dynamicmap"></var></span></label></td>
        </tr>
    </table>
    <div style="width:100%;height:340px;margin:5px auto;border:1px solid gray" id="container"></div>

</div>
<script type="text/javascript">
    var map = new BMap.Map("container"),marker,point,styleStr;
    map.enableScrollWheelZoom();
    map.enableContinuousZoom();
    function doSearch(){
        if (!document.getElementById('city').value) {
            alert(lang.cityMsg);
            return;
        }
        var search = new BMap.LocalSearch(document.getElementById('city').value, {
            onSearchComplete: function (results){
                if (results && results.getNumPois()) {
                    var points = [];
                    for (var i=0; i<results.getCurrentNumPois(); i++) {
                        points.push(results.getPoi(i).point);
                    }
                    if (points.length > 1) {
                        map.setViewport(points);
                    } else {
                        map.centerAndZoom(points[0], 13);
                    }
                    point = map.getCenter();
                    marker.setPoint(point);
                } else {
                    alert(lang.errorMsg);
                }
            }
        });
        search.search(document.getElementById('address').value || document.getElementById('city').value);
    }
    //获得参数
    function getPars(str,par){
        var reg = new RegExp(par+"=((\\d+|[.,])*)","g");
        return reg.exec(str)[1];
    }
    function init(){
        var mapNode = editor.selection.getRange().getClosedNode(),
            isMapImg = mapNode && /api[.]map[.]baidu[.]com/ig.test(mapNode.getAttribute("src")),
            isMapIframe = mapNode && domUtils.hasClass(mapNode, 'ueditor_baidumap');
        if(isMapImg || isMapIframe){
            var url, centerPos, markerPos;
            if(isMapIframe) {
                url = decodeURIComponent(mapNode.getAttribute("src"));
                $G('is_dynamic').checked = true;
                styleStr = mapNode.style.cssText;
            } else {
                url = mapNode.getAttribute("src");
                styleStr = mapNode.style.cssText;
            }

            centerPos = getPars(url,"center").split(",");
            markerPos = getPars(url, "markers").split(",");
            point = new BMap.Point(Number(centerPos[0]),Number(centerPos[1]));
            marker = new BMap.Marker(new BMap.Point(Number(markerPos[0]), Number(markerPos[1])));
            map.addControl(new BMap.NavigationControl());
            map.centerAndZoom(point, Number(getPars(url,"zoom")));
        }else{
            point = new BMap.Point(116.404, 39.915);    // 创建点坐标
            marker = new BMap.Marker(point);
            map.addControl(new BMap.NavigationControl());
            map.centerAndZoom(point, 10);                     // 初始化地图,设置中心点坐标和地图级别。
        }
        marker.enableDragging();
        map.addOverlay(marker);
    }
    init();
    document.getElementById('address').onkeydown = function (evt){
        evt = evt || event;
        if (evt.keyCode == 13) {
            doSearch();
        }
    };
    dialog.onok = function (){
        var center = map.getCenter();
        var zoom = map.zoomLevel;
        var size = map.getSize();
        var mapWidth = size.width;
        var mapHeight = size.height;
        var point = marker.getPoint();

        if($G('is_dynamic').checked) {
            var URL = editor.options.UEDITOR_HOME_URL,
                url = [URL + (/\/$/.test(URL) ? '':'/') + "dialogs/map/show.html" +
                    '#center=' + center.lng + ',' + center.lat,
                    '&zoom=' + zoom,
                    '&width=' + mapWidth,
                    '&height=' + mapHeight,
                    '&markers=' + point.lng + ',' + point.lat,
                    '&markerStyles=' + 'l,A'].join('');
            editor.execCommand('inserthtml', '<iframe class="ueditor_baidumap" src="' + url + '"' + (styleStr ? ' style="' + styleStr + '"' :'') + ' frameborder="0" width="' + (mapWidth+4) + '" height="' + (mapHeight+4) + '"></iframe>');
        } else {
            var url = "http://api.map.baidu.com/staticimage?center=" + center.lng + ',' + center.lat +
                    "&zoom=" + zoom + "&width=" + size.width + '&height=' + size.height + "&markers=" + point.lng + ',' + point.lat;
            editor.execCommand('inserthtml', '<img width="'+ size.width +'"height="'+ size.height +'" src="' + url + '"' + (styleStr ? ' style="' + styleStr + '"' :'') + '/>');
        }
    };
    document.getElementById("address").focus();
</script>


</body>
</html>
