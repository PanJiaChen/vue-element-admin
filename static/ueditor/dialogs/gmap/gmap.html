<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script type="text/javascript" src="../internal.js"></script>
    <style type="text/css">
        .content{width:530px; height: 350px;margin: 10px auto;}
        .content table{width: 100%}
        .content table td{vertical-align: middle;}
        #address{width:220px;height:21px;background: #FFF;border:1px solid #d7d7d7; line-height: 21px;}
    </style>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
</head>
<body>
<div class="content">
    <table>
        <tr>
            <td><label for="address"><var id="lang_input_address"></var></label></td>
            <td><input id="address" type="text" /></td>
            <td><a id="doSearch" href="javascript:void(0)" class="button"><var id="lang_input_search"></var></a></td>
        </tr>
    </table>
    <div id="container" style="width: 100%; height: 340px;margin: 5px auto; border: 1px solid gray;"></div>
</div>
<script type="text/javascript">
    domUtils.on(window,"load",function(){
        var map = new google.maps.Map(document.getElementById('container'), {
                zoom: 3,
                streetViewControl: false,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            var imgcss;
            var marker = new google.maps.Marker({
                map: map,
                draggable: true
            });
            function doSearch(){
                var address = document.getElementById('address').value;
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': address}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var bounds = results[0].geometry.viewport;
                        map.fitBounds(bounds);
                        marker.setPosition(results[0].geometry.location);
                        marker.setTitle(address);
                    } else alert(lang.searchError);
                });
            }
            $G('address').onkeydown = function (evt){
                evt = evt || event;
                if (evt.keyCode == 13) {
                    doSearch();
                }
            };
            $G("doSearch").onclick = doSearch;
            dialog.onok = function (){
                var center = map.getCenter();
                var point = marker.getPosition();
                var url = "http://maps.googleapis.com/maps/api/staticmap?center=" + center.lat() + ',' + center.lng() + "&zoom=" + map.zoom + "&size=520x340&maptype=" + map.getMapTypeId() + "&markers=" + point.lat() + ',' + point.lng() + "&sensor=false";
                editor.execCommand('inserthtml', '<img width="520" height="340" src="' + url + '"' + (imgcss ? ' style="' + imgcss + '"' :'') + '/>');
            };

            function getPars(str,par){
                var reg = new RegExp(par+"=((\\d+|[.,])*)","g");
                return reg.exec(str)[1];
            }
            var img = editor.selection.getRange().getClosedNode();
            if(img && img.src.indexOf("http://maps.googleapis.com/maps/api/staticmap")!=-1){
                var url = img.getAttribute("src");
                var centers = getPars(url,"center").split(",");
                point = new google.maps.LatLng(Number(centers[0]),Number(centers[1]));
                map.setCenter(point);
                map.setZoom(Number(getPars(url,"zoom")));
                centers = getPars(url,"markers").split(",");
                marker.setPosition(new google.maps.LatLng(Number(centers[0]),Number(centers[1])));
                imgcss = img.style.cssText;
            }else{
                setTimeout(function(){
                    doSearch();
                },30)
            }
    });

</script>
</body>
</html>