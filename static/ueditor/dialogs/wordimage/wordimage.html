<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <script type="text/javascript" src="../internal.js"></script>
    <style type="text/css">
        .wrapper{width: 600px;padding: 10px;height: 352px;overflow: hidden;position: relative;border-bottom: 1px solid #d7d7d7}
        .localPath input{float: left;width: 350px;line-height: 20px;height: 20px;}
        #clipboard{float:left;width: 70px;height: 30px; }
        .description{ color: #0066cc; margin-top: 2px; width: 450px; height: 45px;float: left;line-height: 22px}
        #upload{width: 100px;height: 30px;float: right; margin:10px 2px 0 0;cursor: pointer;}
        #msg{ width: 140px; height: 30px; line-height:25px;float: left;color: red}
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="localPath">
            <input id="localPath" type="text" readonly />
            <div id="clipboard"></div>
            <div id="msg"></div>
        </div>
        <div id="flashContainer"></div>
        <div>
            <div id="upload" style="display: none" ><img id="uploadBtn"></div>
            <div class="description">
                <span style="color: red"><var id="lang_resave"></var>: </span><var id="lang_step"></var>
            </div>
          </div>
    </div>
    <script type="text/javascript" src="tangram.js"></script>
    <script type="text/javascript" src="wordimage.js"></script>
    <script type="text/javascript">
        editor.setOpt({
            wordImageFieldName:"upfile",
            compressSide:0,
            maxImageSideLength:900
        });

            //全局变量
        var imageUrls = [],          //用于保存从服务器返回的图片信息数组
            selectedImageCount = 0,  //当前已选择的但未上传的图片数量
            optImageUrl = editor.getActionUrl(editor.getOpt('imageActionName')),
            optImageFieldName = editor.getOpt('imageFieldName'),
            optImageCompressBorder = editor.getOpt('imageCompressEnable') ? editor.getOpt('imageCompressBorder'):null,
            maxSize = editor.getOpt('imageMaxSize') / 1024,
            extension = editor.getOpt('imageAllowFiles').join(';').replace(/\./g, '*.');

        /* 添加额外的GET参数 */
        var params = utils.serializeParam(editor.queryCommandValue('serverparam')) || '',
            urlWidthParams = optImageUrl + (optImageUrl.indexOf('?') == -1 ? '?':'&') + params;

        utils.domReady(function(){
            //创建Flash相关的参数集合
            var flashOptions = {
                container:"flashContainer",                                                    //flash容器id
                url:urlWidthParams,                                           // 上传处理页面的url地址
                ext:editor.queryCommandValue('serverParam') || {},                                 //可向服务器提交的自定义参数列表
                fileType:'{"description":"'+lang.fileType+'", "extension":"' + extension + '"}',     //上传文件格式限制
                flashUrl:'imageUploader.swf',                                                  //上传用的flash组件地址
                width:600,          //flash的宽度
                height:272,         //flash的高度
                gridWidth:120,     // 每一个预览图片所占的宽度
                gridHeight:120,    // 每一个预览图片所占的高度
                picWidth:100,      // 单张预览图片的宽度
                picHeight:100,     // 单张预览图片的高度
                uploadDataFieldName: optImageFieldName,    // POST请求中图片数据的key
                picDescFieldName:'pictitle',      // POST请求中图片描述的key
                maxSize: maxSize,                         // 文件的最大体积,单位M
                compressSize:1,                   // 上传前如果图片体积超过该值，会先压缩,单位M
                maxNum:32,                         // 单次最大可上传多少个文件
                compressSide: 0,                 //等比压缩的基准，0为按照最长边，1为按照宽度，2为按照高度
                compressLength: optImageCompressBorder        //能接受的最大边长，超过该值Flash会自动等比压缩
            };
            //回调函数集合，支持传递函数名的字符串、函数句柄以及函数本身三种类型
            var callbacks={
                selectFileCallback: function(selectFiles){                // 选择文件的回调
                    selectedImageCount += selectFiles.length;
                    if(selectedImageCount) baidu.g("upload").style.display = "";
                    dialog.buttons[0].setDisabled(true); //初始化时置灰确定按钮
                },
                deleteFileCallback: function(delFiles){                 // 删除文件的回调
                    selectedImageCount -= delFiles.length;
                    if (!selectedImageCount) {
                        baidu.g("upload").style.display = "none";
                        dialog.buttons[0].setDisabled(false);         //没有选择图片时重新点亮按钮
                    }
                },
                uploadCompleteCallback: function(data){               // 单个文件上传完成的回调
                    try{var info = eval("(" + data.info + ")");
                    info && imageUrls.push(info);
                    selectedImageCount--;
                    }catch(e){}
                },
                uploadErrorCallback: function (data){         // 单个文件上传失败的回调,
                    console && console.log(data);
                },
                allCompleteCallback: function(){              // 全部上传完成时的回调
                    dialog.buttons[0].setDisabled(false);    //上传完毕后点亮按钮
                }
                //exceedFileCallback: 'exceedFileCallback',   // 文件超出限制的最大体积时的回调
                //startUploadCallback: startUploadCallback    // 开始上传某个文件时的回调
            };
            wordImage.init(flashOptions,callbacks);
        });

    </script>

</body>
</html>