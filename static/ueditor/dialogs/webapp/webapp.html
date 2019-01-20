<!DOCTYPE>
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <script type="text/javascript" src="../internal.js"></script>
    <style type="text/css">
        .wrapper{width: 540px; margin: 10px auto;}
        #appShow {border: 1px solid #ddd;}
        .errorMsg{font-size: 13px;margin: 10px;color: #dd0000}
    </style>
</head>
<body>
    <div class="wrapper">
        <div id="appShow"></div>
    </div>
    <script type="text/javascript">
        //此处配置您在百度上申请到的appkey。
        var apikey = editor.options.webAppKey;
        if ( apikey && apikey.length == 24 ) {
            var searchConfig = {
                container:'appShow', //容器ID
                tips:"", //该值用于自动清空
                search:1, //是否显示搜索框
                ps:12, //每页显示的条数
                suggest:1, //是否开启搜索自动完成
                limit:0, //搜索结果显示条数，0表示无限制
                searchNow:0, //是否在初始化完成时立即搜索
                apikey:apikey, //每人得
                pager:1,
                cid:7134562,
                outputHTML:1
            },baiduApp;

            function clickCallback() {
                baiduApp.addEventListener( 'getAppHTML', function ( e, data ) {
                    var url = 'http://app.baidu.com/app/enter?appid='+data.data['app_id'] +'&tn=app_canvas&app_spce_id=1&apikey='+apikey+'&api_key=' + apikey;
                    editor.execCommand( "webapp", {url:url,width:data.uniWidth,height:data.uniHeight+60,logo:data.data['app_logo'],title:data.data['app_name']});
                    dialog.close();
                } );
            }

            var script = document.createElement( "script" );
            script.type = "text/javascript";
            script.src = "http://app.baidu.com/appweb/api/search?auto=yes&container=container&apikey=" + apikey + "&instanceName=baiduApp&callback=clickCallback&config=searchConfig";
            document.body.appendChild( script );
        } else {
            $G( "appShow" ).innerHTML = "<p class='errorMsg'>"+lang.tip1+"<a title='"+lang.anthorApi+"' href='http://app.baidu.com/static/cms/getapikey.html' target='_blank'>"+lang.applyFor+"</a></p><p class='errorMsg'>"+lang.tip2+"</p>" ;
        }

    </script>
</body>
</html>