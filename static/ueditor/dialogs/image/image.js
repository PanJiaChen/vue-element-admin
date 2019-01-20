/**
 * User: Jinqn
 * Date: 14-04-08
 * Time: 下午16:34
 * 上传图片对话框逻辑代码,包括tab: 远程图片/上传图片/在线图片/搜索图片
 */

(function () {

    var remoteImage,
        uploadImage,
        onlineImage,
        searchImage;

    window.onload = function () {
        initTabs();
        initAlign();
        initButtons();
    };

    /* 初始化tab标签 */
    function initTabs() {
        var tabs = $G('tabhead').children;
        for (var i = 0; i < tabs.length; i++) {
            domUtils.on(tabs[i], "click", function (e) {
                var target = e.target || e.srcElement;
                setTabFocus(target.getAttribute('data-content-id'));
            });
        }

        var img = editor.selection.getRange().getClosedNode();
        if (img && img.tagName && img.tagName.toLowerCase() == 'img') {
            setTabFocus('remote');
        } else {
            setTabFocus('upload');
        }
    }

    /* 初始化tabbody */
    function setTabFocus(id) {
        if(!id) return;
        var i, bodyId, tabs = $G('tabhead').children;
        for (i = 0; i < tabs.length; i++) {
            bodyId = tabs[i].getAttribute('data-content-id');
            if (bodyId == id) {
                domUtils.addClass(tabs[i], 'focus');
                domUtils.addClass($G(bodyId), 'focus');
            } else {
                domUtils.removeClasses(tabs[i], 'focus');
                domUtils.removeClasses($G(bodyId), 'focus');
            }
        }
        switch (id) {
            case 'remote':
                remoteImage = remoteImage || new RemoteImage();
                break;
            case 'upload':
                setAlign(editor.getOpt('imageInsertAlign'));
                uploadImage = uploadImage || new UploadImage('queueList');
                break;
            case 'online':
                setAlign(editor.getOpt('imageManagerInsertAlign'));
                onlineImage = onlineImage || new OnlineImage('imageList');
                onlineImage.reset();
                break;
            case 'search':
                setAlign(editor.getOpt('imageManagerInsertAlign'));
                searchImage = searchImage || new SearchImage();
                break;
        }
    }

    /* 初始化onok事件 */
    function initButtons() {

        dialog.onok = function () {
            var remote = false, list = [], id, tabs = $G('tabhead').children;
            for (var i = 0; i < tabs.length; i++) {
                if (domUtils.hasClass(tabs[i], 'focus')) {
                    id = tabs[i].getAttribute('data-content-id');
                    break;
                }
            }

            switch (id) {
                case 'remote':
                    list = remoteImage.getInsertList();
                    break;
                case 'upload':
                    list = uploadImage.getInsertList();
                    var count = uploadImage.getQueueCount();
                    if (count) {
                        $('.info', '#queueList').html('<span style="color:red;">' + '还有2个未上传文件'.replace(/[\d]/, count) + '</span>');
                        return false;
                    }
                    break;
                case 'online':
                    list = onlineImage.getInsertList();
                    break;
                case 'search':
                    list = searchImage.getInsertList();
                    remote = true;
                    break;
            }

            if(list) {
                editor.execCommand('insertimage', list);
                remote && editor.fireEvent("catchRemoteImage");
            }
        };
    }


    /* 初始化对其方式的点击事件 */
    function initAlign(){
        /* 点击align图标 */
        domUtils.on($G("alignIcon"), 'click', function(e){
            var target = e.target || e.srcElement;
            if(target.className && target.className.indexOf('-align') != -1) {
                setAlign(target.getAttribute('data-align'));
            }
        });
    }

    /* 设置对齐方式 */
    function setAlign(align){
        align = align || 'none';
        var aligns = $G("alignIcon").children;
        for(i = 0; i < aligns.length; i++){
            if(aligns[i].getAttribute('data-align') == align) {
                domUtils.addClass(aligns[i], 'focus');
                $G("align").value = aligns[i].getAttribute('data-align');
            } else {
                domUtils.removeClasses(aligns[i], 'focus');
            }
        }
    }
    /* 获取对齐方式 */
    function getAlign(){
        var align = $G("align").value || 'none';
        return align == 'none' ? '':align;
    }


    /* 在线图片 */
    function RemoteImage(target) {
        this.container = utils.isString(target) ? document.getElementById(target) : target;
        this.init();
    }
    RemoteImage.prototype = {
        init: function () {
            this.initContainer();
            this.initEvents();
        },
        initContainer: function () {
            this.dom = {
                'url': $G('url'),
                'width': $G('width'),
                'height': $G('height'),
                'border': $G('border'),
                'vhSpace': $G('vhSpace'),
                'title': $G('title'),
                'align': $G('align')
            };
            var img = editor.selection.getRange().getClosedNode();
            if (img) {
                this.setImage(img);
            }
        },
        initEvents: function () {
            var _this = this,
                locker = $G('lock');

            /* 改变url */
            domUtils.on($G("url"), 'keyup', updatePreview);
            domUtils.on($G("border"), 'keyup', updatePreview);
            domUtils.on($G("title"), 'keyup', updatePreview);

            domUtils.on($G("width"), 'keyup', function(){
                updatePreview();
                if(locker.checked) {
                    var proportion =locker.getAttribute('data-proportion');
                    $G('height').value = Math.round(this.value / proportion);
                } else {
                    _this.updateLocker();
                }
            });
            domUtils.on($G("height"), 'keyup', function(){
                updatePreview();
                if(locker.checked) {
                    var proportion =locker.getAttribute('data-proportion');
                    $G('width').value = Math.round(this.value * proportion);
                } else {
                    _this.updateLocker();
                }
            });
            domUtils.on($G("lock"), 'change', function(){
                var proportion = parseInt($G("width").value) /parseInt($G("height").value);
                locker.setAttribute('data-proportion', proportion);
            });

            function updatePreview(){
                _this.setPreview();
            }
        },
        updateLocker: function(){
            var width = $G('width').value,
                height = $G('height').value,
                locker = $G('lock');
            if(width && height && width == parseInt(width) && height == parseInt(height)) {
                locker.disabled = false;
                locker.title = '';
            } else {
                locker.checked = false;
                locker.disabled = 'disabled';
                locker.title = lang.remoteLockError;
            }
        },
        setImage: function(img){
            /* 不是正常的图片 */
            if (!img.tagName || img.tagName.toLowerCase() != 'img' && !img.getAttribute("src") || !img.src) return;

            var wordImgFlag = img.getAttribute("word_img"),
                src = wordImgFlag ? wordImgFlag.replace("&amp;", "&") : (img.getAttribute('_src') || img.getAttribute("src", 2).replace("&amp;", "&")),
                align = editor.queryCommandValue("imageFloat");

            /* 防止onchange事件循环调用 */
            if (src !== $G("url").value) $G("url").value = src;
            if(src) {
                /* 设置表单内容 */
                $G("width").value = img.width || '';
                $G("height").value = img.height || '';
                $G("border").value = img.getAttribute("border") || '0';
                $G("vhSpace").value = img.getAttribute("vspace") || '0';
                $G("title").value = img.title || img.alt || '';
                setAlign(align);
                this.setPreview();
                this.updateLocker();
            }
        },
        getData: function(){
            var data = {};
            for(var k in this.dom){
                data[k] = this.dom[k].value;
            }
            return data;
        },
        setPreview: function(){
            var url = $G('url').value,
                ow = parseInt($G('width').value, 10) || 0,
                oh = parseInt($G('height').value, 10) || 0,
                border = parseInt($G('border').value, 10) || 0,
                title = $G('title').value,
                preview = $G('preview'),
                width,
                height;

            url = utils.unhtmlForUrl(url);
            title = utils.unhtml(title);

            width = ((!ow || !oh) ? preview.offsetWidth:Math.min(ow, preview.offsetWidth));
            width = width+(border*2) > preview.offsetWidth ? width:(preview.offsetWidth - (border*2));
            height = (!ow || !oh) ? '':width*oh/ow;

            if(url) {
                preview.innerHTML = '<img src="' + url + '" width="' + width + '" height="' + height + '" border="' + border + 'px solid #000" title="' + title + '" />';
            }
        },
        getInsertList: function () {
            var data = this.getData();
            if(data['url']) {
                return [{
                    src: data['url'],
                    _src: data['url'],
                    width: data['width'] || '',
                    height: data['height'] || '',
                    border: data['border'] || '',
                    floatStyle: data['align'] || '',
                    vspace: data['vhSpace'] || '',
                    title: data['title'] || '',
                    alt: data['title'] || '',
                    style: "width:" + data['width'] + "px;height:" + data['height'] + "px;"
                }];
            } else {
                return [];
            }
        }
    };



    /* 上传图片 */
    function UploadImage(target) {
        this.$wrap = target.constructor == String ? $('#' + target) : $(target);
        this.init();
    }
    UploadImage.prototype = {
        init: function () {
            this.imageList = [];
            this.initContainer();
            this.initUploader();
        },
        initContainer: function () {
            this.$queue = this.$wrap.find('.filelist');
        },
        /* 初始化容器 */
        initUploader: function () {
            var _this = this,
                $ = jQuery,    // just in case. Make sure it's not an other libaray.
                $wrap = _this.$wrap,
            // 图片容器
                $queue = $wrap.find('.filelist'),
            // 状态栏，包括进度和控制按钮
                $statusBar = $wrap.find('.statusBar'),
            // 文件总体选择信息。
                $info = $statusBar.find('.info'),
            // 上传按钮
                $upload = $wrap.find('.uploadBtn'),
            // 上传按钮
                $filePickerBtn = $wrap.find('.filePickerBtn'),
            // 上传按钮
                $filePickerBlock = $wrap.find('.filePickerBlock'),
            // 没选择文件之前的内容。
                $placeHolder = $wrap.find('.placeholder'),
            // 总体进度条
                $progress = $statusBar.find('.progress').hide(),
            // 添加的文件数量
                fileCount = 0,
            // 添加的文件总大小
                fileSize = 0,
            // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1,
            // 缩略图大小
                thumbnailWidth = 113 * ratio,
                thumbnailHeight = 113 * ratio,
            // 可能有pedding, ready, uploading, confirm, done.
                state = '',
            // 所有文件的进度信息，key为file id
                percentages = {},
                supportTransition = (function () {
                    var s = document.createElement('p').style,
                        r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                    s = null;
                    return r;
                })(),
            // WebUploader实例
                uploader,
                actionUrl = editor.getActionUrl(editor.getOpt('imageActionName')),
                acceptExtensions = (editor.getOpt('imageAllowFiles') || []).join('').replace(/\./g, ',').replace(/^[,]/, ''),
                imageMaxSize = editor.getOpt('imageMaxSize'),
                imageCompressBorder = editor.getOpt('imageCompressBorder');

            if (!WebUploader.Uploader.support()) {
                $('#filePickerReady').after($('<div>').html(lang.errorNotSupport)).hide();
                return;
            } else if (!editor.getOpt('imageActionName')) {
                $('#filePickerReady').after($('<div>').html(lang.errorLoadConfig)).hide();
                return;
            }

            uploader = _this.uploader = WebUploader.create({
                pick: {
                    id: '#filePickerReady',
                    label: lang.uploadSelectFile
                },
                accept: {
                    title: 'Images',
                    extensions: acceptExtensions,
                    mimeTypes: 'image/*'
                },
                swf: '../../third-party/webuploader/Uploader.swf',
                server: actionUrl,
                fileVal: editor.getOpt('imageFieldName'),
                duplicate: true,
                fileSingleSizeLimit: imageMaxSize,    // 默认 2 M
                compress: editor.getOpt('imageCompressEnable') ? {
                    width: imageCompressBorder,
                    height: imageCompressBorder,
                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 90,
                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,
                    // 是否允许裁剪。
                    crop: false,
                    // 是否保留头部meta信息。
                    preserveHeaders: true
                }:false
            });
            uploader.addButton({
                id: '#filePickerBlock'
            });
            uploader.addButton({
                id: '#filePickerBtn',
                label: lang.uploadAddFile
            });

            setState('pedding');

            // 当有文件添加进来时执行，负责view的创建
            function addFile(file) {
                var $li = $('<li id="' + file.id + '">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"></p>' +
                        '<p class="progress"><span></span></p>' +
                        '</li>'),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">' + lang.uploadDelete + '</span>' +
                        '<span class="rotateRight">' + lang.uploadTurnRight + '</span>' +
                        '<span class="rotateLeft">' + lang.uploadTurnLeft + '</span></div>').appendTo($li),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find('p.imgWrap'),
                    $info = $('<p class="error"></p>').hide().appendTo($li),

                    showError = function (code) {
                        switch (code) {
                            case 'exceed_size':
                                text = lang.errorExceedSize;
                                break;
                            case 'interrupt':
                                text = lang.errorInterrupt;
                                break;
                            case 'http':
                                text = lang.errorHttp;
                                break;
                            case 'not_allow_type':
                                text = lang.errorFileType;
                                break;
                            default:
                                text = lang.errorUploadRetry;
                                break;
                        }
                        $info.text(text).show();
                    };

                if (file.getStatus() === 'invalid') {
                    showError(file.statusText);
                } else {
                    $wrap.text(lang.uploadPreview);
                    if (browser.ie && browser.version <= 7) {
                        $wrap.text(lang.uploadNoPreview);
                    } else {
                        uploader.makeThumb(file, function (error, src) {
                            if (error || !src) {
                                $wrap.text(lang.uploadNoPreview);
                            } else {
                                var $img = $('<img src="' + src + '">');
                                $wrap.empty().append($img);
                                $img.on('error', function () {
                                    $wrap.text(lang.uploadNoPreview);
                                });
                            }
                        }, thumbnailWidth, thumbnailHeight);
                    }
                    percentages[ file.id ] = [ file.size, 0 ];
                    file.rotation = 0;

                    /* 检查文件格式 */
                    if (!file.ext || acceptExtensions.indexOf(file.ext.toLowerCase()) == -1) {
                        showError('not_allow_type');
                        uploader.removeFile(file);
                    }
                }

                file.on('statuschange', function (cur, prev) {
                    if (prev === 'progress') {
                        $prgress.hide().width(0);
                    } else if (prev === 'queued') {
                        $li.off('mouseenter mouseleave');
                        $btns.remove();
                    }
                    // 成功
                    if (cur === 'error' || cur === 'invalid') {
                        showError(file.statusText);
                        percentages[ file.id ][ 1 ] = 1;
                    } else if (cur === 'interrupt') {
                        showError('interrupt');
                    } else if (cur === 'queued') {
                        percentages[ file.id ][ 1 ] = 0;
                    } else if (cur === 'progress') {
                        $info.hide();
                        $prgress.css('display', 'block');
                    } else if (cur === 'complete') {
                    }

                    $li.removeClass('state-' + prev).addClass('state-' + cur);
                });

                $li.on('mouseenter', function () {
                    $btns.stop().animate({height: 30});
                });
                $li.on('mouseleave', function () {
                    $btns.stop().animate({height: 0});
                });

                $btns.on('click', 'span', function () {
                    var index = $(this).index(),
                        deg;

                    switch (index) {
                        case 0:
                            uploader.removeFile(file);
                            return;
                        case 1:
                            file.rotation += 90;
                            break;
                        case 2:
                            file.rotation -= 90;
                            break;
                    }

                    if (supportTransition) {
                        deg = 'rotate(' + file.rotation + 'deg)';
                        $wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                    }

                });

                $li.insertBefore($filePickerBlock);
            }

            // 负责view的销毁
            function removeFile(file) {
                var $li = $('#' + file.id);
                delete percentages[ file.id ];
                updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
            }

            function updateTotalProgress() {
                var loaded = 0,
                    total = 0,
                    spans = $progress.children(),
                    percent;

                $.each(percentages, function (k, v) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                });

                percent = total ? loaded / total : 0;

                spans.eq(0).text(Math.round(percent * 100) + '%');
                spans.eq(1).css('width', Math.round(percent * 100) + '%');
                updateStatus();
            }

            function setState(val, files) {

                if (val != state) {

                    var stats = uploader.getStats();

                    $upload.removeClass('state-' + state);
                    $upload.addClass('state-' + val);

                    switch (val) {

                        /* 未选择文件 */
                        case 'pedding':
                            $queue.addClass('element-invisible');
                            $statusBar.addClass('element-invisible');
                            $placeHolder.removeClass('element-invisible');
                            $progress.hide(); $info.hide();
                            uploader.refresh();
                            break;

                        /* 可以开始上传 */
                        case 'ready':
                            $placeHolder.addClass('element-invisible');
                            $queue.removeClass('element-invisible');
                            $statusBar.removeClass('element-invisible');
                            $progress.hide(); $info.show();
                            $upload.text(lang.uploadStart);
                            uploader.refresh();
                            break;

                        /* 上传中 */
                        case 'uploading':
                            $progress.show(); $info.hide();
                            $upload.text(lang.uploadPause);
                            break;

                        /* 暂停上传 */
                        case 'paused':
                            $progress.show(); $info.hide();
                            $upload.text(lang.uploadContinue);
                            break;

                        case 'confirm':
                            $progress.show(); $info.hide();
                            $upload.text(lang.uploadStart);

                            stats = uploader.getStats();
                            if (stats.successNum && !stats.uploadFailNum) {
                                setState('finish');
                                return;
                            }
                            break;

                        case 'finish':
                            $progress.hide(); $info.show();
                            if (stats.uploadFailNum) {
                                $upload.text(lang.uploadRetry);
                            } else {
                                $upload.text(lang.uploadStart);
                            }
                            break;
                    }

                    state = val;
                    updateStatus();

                }

                if (!_this.getQueueCount()) {
                    $upload.addClass('disabled')
                } else {
                    $upload.removeClass('disabled')
                }

            }

            function updateStatus() {
                var text = '', stats;

                if (state === 'ready') {
                    text = lang.updateStatusReady.replace('_', fileCount).replace('_KB', WebUploader.formatSize(fileSize));
                } else if (state === 'confirm') {
                    stats = uploader.getStats();
                    if (stats.uploadFailNum) {
                        text = lang.updateStatusConfirm.replace('_', stats.successNum).replace('_', stats.successNum);
                    }
                } else {
                    stats = uploader.getStats();
                    text = lang.updateStatusFinish.replace('_', fileCount).
                        replace('_KB', WebUploader.formatSize(fileSize)).
                        replace('_', stats.successNum);

                    if (stats.uploadFailNum) {
                        text += lang.updateStatusError.replace('_', stats.uploadFailNum);
                    }
                }

                $info.html(text);
            }

            uploader.on('fileQueued', function (file) {
                fileCount++;
                fileSize += file.size;

                if (fileCount === 1) {
                    $placeHolder.addClass('element-invisible');
                    $statusBar.show();
                }

                addFile(file);
            });

            uploader.on('fileDequeued', function (file) {
                fileCount--;
                fileSize -= file.size;

                removeFile(file);
                updateTotalProgress();
            });

            uploader.on('filesQueued', function (file) {
                if (!uploader.isInProgress() && (state == 'pedding' || state == 'finish' || state == 'confirm' || state == 'ready')) {
                    setState('ready');
                }
                updateTotalProgress();
            });

            uploader.on('all', function (type, files) {
                switch (type) {
                    case 'uploadFinished':
                        setState('confirm', files);
                        break;
                    case 'startUpload':
                        /* 添加额外的GET参数 */
                        var params = utils.serializeParam(editor.queryCommandValue('serverparam')) || '',
                            url = utils.formatUrl(actionUrl + (actionUrl.indexOf('?') == -1 ? '?':'&') + 'encode=utf-8&' + params);
                        uploader.option('server', url);
                        setState('uploading', files);
                        break;
                    case 'stopUpload':
                        setState('paused', files);
                        break;
                }
            });

            uploader.on('uploadBeforeSend', function (file, data, header) {
                //这里可以通过data对象添加POST参数
                header['X_Requested_With'] = 'XMLHttpRequest';
                // HaoChuan9421
                if(editor.options.headers && Object.prototype.toString.apply(editor.options.headers) === "[object Object]"){
                    for(var key in editor.options.headers){
                        header[key] = editor.options.headers[key]
                    }
                }
            });

            uploader.on('uploadProgress', function (file, percentage) {
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress span');

                $percent.css('width', percentage * 100 + '%');
                percentages[ file.id ][ 1 ] = percentage;
                updateTotalProgress();
            });

            uploader.on('uploadSuccess', function (file, ret) {
                var $file = $('#' + file.id);
                try {
                    var responseText = (ret._raw || ret),
                        json = utils.str2json(responseText);
                    if (json.state == 'SUCCESS') {
                        _this.imageList.push(json);
                        $file.append('<span class="success"></span>');
                    } else {
                        $file.find('.error').text(json.state).show();
                    }
                } catch (e) {
                    $file.find('.error').text(lang.errorServerUpload).show();
                }
            });

            uploader.on('uploadError', function (file, code) {
            });
            uploader.on('error', function (code, file) {
                if (code == 'Q_TYPE_DENIED' || code == 'F_EXCEED_SIZE') {
                    addFile(file);
                }
            });
            uploader.on('uploadComplete', function (file, ret) {
            });

            $upload.on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }

                if (state === 'ready') {
                    uploader.upload();
                } else if (state === 'paused') {
                    uploader.upload();
                } else if (state === 'uploading') {
                    uploader.stop();
                }
            });

            $upload.addClass('state-' + state);
            updateTotalProgress();
        },
        getQueueCount: function () {
            var file, i, status, readyFile = 0, files = this.uploader.getFiles();
            for (i = 0; file = files[i++]; ) {
                status = file.getStatus();
                if (status == 'queued' || status == 'uploading' || status == 'progress') readyFile++;
            }
            return readyFile;
        },
        destroy: function () {
            this.$wrap.remove();
        },
        getInsertList: function () {
            var i, data, list = [],
                align = getAlign(),
                prefix = editor.getOpt('imageUrlPrefix');
            for (i = 0; i < this.imageList.length; i++) {
                data = this.imageList[i];
                list.push({
                    src: prefix + data.url,
                    _src: prefix + data.url,
                    title: data.title,
                    alt: data.original,
                    floatStyle: align
                });
            }
            return list;
        }
    };


    /* 在线图片 */
    function OnlineImage(target) {
        this.container = utils.isString(target) ? document.getElementById(target) : target;
        this.init();
    }
    OnlineImage.prototype = {
        init: function () {
            this.reset();
            this.initEvents();
        },
        /* 初始化容器 */
        initContainer: function () {
            this.container.innerHTML = '';
            this.list = document.createElement('ul');
            this.clearFloat = document.createElement('li');

            domUtils.addClass(this.list, 'list');
            domUtils.addClass(this.clearFloat, 'clearFloat');

            this.list.appendChild(this.clearFloat);
            this.container.appendChild(this.list);
        },
        /* 初始化滚动事件,滚动到地步自动拉取数据 */
        initEvents: function () {
            var _this = this;

            /* 滚动拉取图片 */
            domUtils.on($G('imageList'), 'scroll', function(e){
                var panel = this;
                if (panel.scrollHeight - (panel.offsetHeight + panel.scrollTop) < 10) {
                    _this.getImageData();
                }
            });
            /* 选中图片 */
            domUtils.on(this.container, 'click', function (e) {
                var target = e.target || e.srcElement,
                    li = target.parentNode;

                if (li.tagName.toLowerCase() == 'li') {
                    if (domUtils.hasClass(li, 'selected')) {
                        domUtils.removeClasses(li, 'selected');
                    } else {
                        domUtils.addClass(li, 'selected');
                    }
                }
            });
        },
        /* 初始化第一次的数据 */
        initData: function () {

            /* 拉取数据需要使用的值 */
            this.state = 0;
            this.listSize = editor.getOpt('imageManagerListSize');
            this.listIndex = 0;
            this.listEnd = false;

            /* 第一次拉取数据 */
            this.getImageData();
        },
        /* 重置界面 */
        reset: function() {
            this.initContainer();
            this.initData();
        },
        /* 向后台拉取图片列表数据 */
        getImageData: function () {
            var _this = this;

            if(!_this.listEnd && !this.isLoadingData) {
                this.isLoadingData = true;
                var url = editor.getActionUrl(editor.getOpt('imageManagerActionName')),
                    isJsonp = utils.isCrossDomainUrl(url);
                ajax.request(url, {
                    'timeout': 100000,
                    'dataType': isJsonp ? 'jsonp':'',
                    'data': utils.extend({
                            start: this.listIndex,
                            size: this.listSize
                        }, editor.queryCommandValue('serverparam')),
                    'method': 'get',
                    'onsuccess': function (r) {
                        try {
                            var json = isJsonp ? r:eval('(' + r.responseText + ')');
                            if (json.state == 'SUCCESS') {
                                _this.pushData(json.list);
                                _this.listIndex = parseInt(json.start) + parseInt(json.list.length);
                                if(_this.listIndex >= json.total) {
                                    _this.listEnd = true;
                                }
                                _this.isLoadingData = false;
                            }
                        } catch (e) {
                            if(r.responseText.indexOf('ue_separate_ue') != -1) {
                                var list = r.responseText.split(r.responseText);
                                _this.pushData(list);
                                _this.listIndex = parseInt(list.length);
                                _this.listEnd = true;
                                _this.isLoadingData = false;
                            }
                        }
                    },
                    'onerror': function () {
                        _this.isLoadingData = false;
                    }
                });
            }
        },
        /* 添加图片到列表界面上 */
        pushData: function (list) {
            var i, item, img, icon, _this = this,
                urlPrefix = editor.getOpt('imageManagerUrlPrefix');
            for (i = 0; i < list.length; i++) {
                if(list[i] && list[i].url) {
                    item = document.createElement('li');
                    img = document.createElement('img');
                    icon = document.createElement('span');

                    domUtils.on(img, 'load', (function(image){
                        return function(){
                            _this.scale(image, image.parentNode.offsetWidth, image.parentNode.offsetHeight);
                        }
                    })(img));
                    img.width = 113;
                    img.setAttribute('src', urlPrefix + list[i].url + (list[i].url.indexOf('?') == -1 ? '?noCache=':'&noCache=') + (+new Date()).toString(36) );
                    img.setAttribute('_src', urlPrefix + list[i].url);
                    domUtils.addClass(icon, 'icon');

                    item.appendChild(img);
                    item.appendChild(icon);
                    this.list.insertBefore(item, this.clearFloat);
                }
            }
        },
        /* 改变图片大小 */
        scale: function (img, w, h, type) {
            var ow = img.width,
                oh = img.height;

            if (type == 'justify') {
                if (ow >= oh) {
                    img.width = w;
                    img.height = h * oh / ow;
                    img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
                } else {
                    img.width = w * ow / oh;
                    img.height = h;
                    img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
                }
            } else {
                if (ow >= oh) {
                    img.width = w * ow / oh;
                    img.height = h;
                    img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
                } else {
                    img.width = w;
                    img.height = h * oh / ow;
                    img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
                }
            }
        },
        getInsertList: function () {
            var i, lis = this.list.children, list = [], align = getAlign();
            for (i = 0; i < lis.length; i++) {
                if (domUtils.hasClass(lis[i], 'selected')) {
                    var img = lis[i].firstChild,
                        src = img.getAttribute('_src');
                    list.push({
                        src: src,
                        _src: src,
                        alt: src.substr(src.lastIndexOf('/') + 1),
                        floatStyle: align
                    });
                }

            }
            return list;
        }
    };

    /*搜索图片 */
    function SearchImage() {
        this.init();
    }
    SearchImage.prototype = {
        init: function () {
            this.initEvents();
        },
        initEvents: function(){
            var _this = this;

            /* 点击搜索按钮 */
            domUtils.on($G('searchBtn'), 'click', function(){
                var key = $G('searchTxt').value;
                if(key && key != lang.searchRemind) {
                    _this.getImageData();
                }
            });
            /* 点击清除妞 */
            domUtils.on($G('searchReset'), 'click', function(){
                $G('searchTxt').value = lang.searchRemind;
                $G('searchListUl').innerHTML = '';
                $G('searchType').selectedIndex = 0;
            });
            /* 搜索框聚焦 */
            domUtils.on($G('searchTxt'), 'focus', function(){
                var key = $G('searchTxt').value;
                if(key && key == lang.searchRemind) {
                    $G('searchTxt').value = '';
                }
            });
            /* 搜索框回车键搜索 */
            domUtils.on($G('searchTxt'), 'keydown', function(e){
                var keyCode = e.keyCode || e.which;
                if (keyCode == 13) {
                    $G('searchBtn').click();
                }
            });

            /* 选中图片 */
            domUtils.on($G('searchList'), 'click', function(e){
                var target = e.target || e.srcElement,
                    li = target.parentNode.parentNode;

                if (li.tagName.toLowerCase() == 'li') {
                    if (domUtils.hasClass(li, 'selected')) {
                        domUtils.removeClasses(li, 'selected');
                    } else {
                        domUtils.addClass(li, 'selected');
                    }
                }
            });
        },
        encodeToGb2312:function (str){
            if(!str) return '';
            var strOut = "",
                z = 'D2BBB6A18140C6DF814181428143CDF2D5C9C8FDC9CFCFC2D8A2B2BBD3EB8144D8A4B3F38145D7A8C7D2D8A7CAC08146C7F0B1FBD2B5B4D4B6ABCBBFD8A9814781488149B6AA814AC1BDD1CF814BC9A5D8AD814CB8F6D1BEE3DCD6D0814D814EB7E1814FB4AE8150C1D98151D8BC8152CDE8B5A4CEAAD6F78153C0F6BED9D8AF815481558156C4CB8157BEC38158D8B1C3B4D2E58159D6AECEDAD5A7BAF5B7A6C0D6815AC6B9C5D2C7C7815BB9D4815CB3CBD2D2815D815ED8BFBEC5C6F2D2B2CFB0CFE7815F816081618162CAE981638164D8C081658166816781688169816AC2F2C2D2816BC8E9816C816D816E816F817081718172817381748175C7AC8176817781788179817A817B817CC1CB817DD3E8D5F9817ECAC2B6FED8A1D3DABFF78180D4C6BBA5D8C1CEE5BEAE81818182D8A88183D1C7D0A9818481858186D8BDD9EFCDF6BFBA8187BDBBBAA5D2E0B2FABAE0C4B68188CFEDBEA9CDA4C1C18189818A818BC7D7D9F1818CD9F4818D818E818F8190C8CBD8E9819181928193D2DACAB2C8CAD8ECD8EAD8C6BDF6C6CDB3F08194D8EBBDF1BDE98195C8D4B4D381968197C2D88198B2D6D7D0CACBCBFBD5CCB8B6CFC98199819A819BD9DAD8F0C7AA819CD8EE819DB4FAC1EED2D4819E819FD8ED81A0D2C7D8EFC3C781A181A281A3D1F681A4D6D9D8F281A5D8F5BCFEBCDB81A681A781A8C8CE81A9B7DD81AAB7C281ABC6F381AC81AD81AE81AF81B081B181B2D8F8D2C181B381B4CEE9BCBFB7FCB7A5D0DD81B581B681B781B881B9D6DAD3C5BBEFBBE1D8F181BA81BBC9A1CEB0B4AB81BCD8F381BDC9CBD8F6C2D7D8F781BE81BFCEB1D8F981C081C181C2B2AEB9C081C3D9A381C4B0E981C5C1E681C6C9EC81C7CBC581C8CBC6D9A481C981CA81CB81CC81CDB5E881CE81CFB5AB81D081D181D281D381D481D5CEBBB5CDD7A1D7F4D3D381D6CCE581D7BACE81D8D9A2D9DCD3E0D8FDB7F0D7F7D8FED8FAD9A1C4E381D981DAD3B6D8F4D9DD81DBD8FB81DCC5E581DD81DEC0D081DF81E0D1F0B0DB81E181E2BCD1D9A681E3D9A581E481E581E681E7D9ACD9AE81E8D9ABCAB981E981EA81EBD9A9D6B681EC81ED81EEB3DED9A881EFC0FD81F0CACC81F1D9AA81F2D9A781F381F4D9B081F581F6B6B181F781F881F9B9A981FAD2C081FB81FCCFC081FD81FEC2C28240BDC4D5ECB2E0C7C8BFEBD9AD8241D9AF8242CEEABAEE82438244824582468247C7D682488249824A824B824C824D824E824F8250B1E3825182528253B4D9B6EDD9B48254825582568257BFA182588259825AD9DEC7CEC0FED9B8825B825C825D825E825FCBD7B7FD8260D9B58261D9B7B1A3D3E1D9B98262D0C58263D9B682648265D9B18266D9B2C1A9D9B382678268BCF3D0DEB8A98269BEE3826AD9BD826B826C826D826ED9BA826FB0B3827082718272D9C28273827482758276827782788279827A827B827C827D827E8280D9C4B1B68281D9BF82828283B5B98284BEF3828582868287CCC8BAF2D2D08288D9C38289828ABDE8828BB3AB828C828D828ED9C5BEEB828FD9C6D9BBC4DF8290D9BED9C1D9C0829182928293829482958296829782988299829A829BD5AE829CD6B5829DC7E3829E829F82A082A1D9C882A282A382A4BCD9D9CA82A582A682A7D9BC82A8D9CBC6AB82A982AA82AB82AC82ADD9C982AE82AF82B082B1D7F682B2CDA382B382B482B582B682B782B882B982BABDA182BB82BC82BD82BE82BF82C0D9CC82C182C282C382C482C582C682C782C882C9C5BCCDB582CA82CB82CCD9CD82CD82CED9C7B3A5BFFE82CF82D082D182D2B8B582D382D4C0FC82D582D682D782D8B0F882D982DA82DB82DC82DD82DE82DF82E082E182E282E382E482E582E682E782E882E982EA82EB82EC82EDB4F682EED9CE82EFD9CFB4A2D9D082F082F1B4DF82F282F382F482F582F6B0C182F782F882F982FA82FB82FC82FDD9D1C9B582FE8340834183428343834483458346834783488349834A834B834C834D834E834F83508351CFF1835283538354835583568357D9D283588359835AC1C5835B835C835D835E835F836083618362836383648365D9D6C9AE8366836783688369D9D5D9D4D9D7836A836B836C836DCBDB836EBDA9836F8370837183728373C6A7837483758376837783788379837A837B837C837DD9D3D9D8837E83808381D9D9838283838384838583868387C8E583888389838A838B838C838D838E838F839083918392839383948395C0DC8396839783988399839A839B839C839D839E839F83A083A183A283A383A483A583A683A783A883A983AA83AB83AC83AD83AE83AF83B083B183B2B6F9D8A3D4CA83B3D4AAD0D6B3E4D5D783B4CFC8B9E283B5BFCB83B6C3E283B783B883B9B6D283BA83BBCDC3D9EED9F083BC83BD83BEB5B383BFB6B583C083C183C283C383C4BEA483C583C6C8EB83C783C8C8AB83C983CAB0CBB9ABC1F9D9E283CBC0BCB9B283CCB9D8D0CBB1F8C6E4BEDFB5E4D7C883CDD1F8BCE6CADE83CE83CFBCBDD9E6D8E783D083D1C4DA83D283D3B8D4C8BD83D483D5B2E1D4D983D683D783D883D9C3B083DA83DBC3E1DAA2C8DF83DCD0B483DDBEFCC5A983DE83DF83E0B9DA83E1DAA383E2D4A9DAA483E383E483E583E683E7D9FBB6AC83E883E9B7EBB1F9D9FCB3E5BEF683EABFF6D2B1C0E483EB83EC83EDB6B3D9FED9FD83EE83EFBEBB83F083F183F2C6E083F3D7BCDAA183F4C1B983F5B5F2C1E883F683F7BCF583F8B4D583F983FA83FB83FC83FD83FE844084418442C1DD8443C4FD84448445BCB8B7B284468447B7EF84488449844A844B844C844DD9EC844EC6BE844FBFADBBCB84508451B5CA8452DBC9D0D78453CDB9B0BCB3F6BBF7DBCABAAF8454D4E4B5B6B5F3D8D6C8D084558456B7D6C7D0D8D78457BFAF84588459DBBBD8D8845A845BD0CCBBAE845C845D845EEBBEC1D0C1F5D4F2B8D5B4B4845FB3F584608461C9BE846284638464C5D0846584668467C5D9C0FB8468B1F08469D8D9B9CE846AB5BD846B846CD8DA846D846ED6C6CBA2C8AFC9B2B4CCBFCC846FB9F48470D8DBD8DCB6E7BCC1CCEA847184728473847484758476CFF78477D8DDC7B084788479B9D0BDA3847A847BCCDE847CC6CA847D847E848084818482D8E08483D8DE84848485D8DF848684878488B0FE8489BEE7848ACAA3BCF4848B848C848D848EB8B1848F8490B8EE849184928493849484958496849784988499849AD8E2849BBDCB849CD8E4D8E3849D849E849F84A084A1C5FC84A284A384A484A584A684A784A8D8E584A984AAD8E684AB84AC84AD84AE84AF84B084B1C1A684B2C8B0B0ECB9A6BCD3CEF1DBBDC1D384B384B484B584B6B6AFD6FAC5ACBDD9DBBEDBBF84B784B884B9C0F8BEA2C0CD84BA84BB84BC84BD84BE84BF84C084C184C284C3DBC0CAC684C484C584C6B2AA84C784C884C9D3C284CAC3E384CBD1AB84CC84CD84CE84CFDBC284D0C0D584D184D284D3DBC384D4BFB184D584D684D784D884D984DAC4BC84DB84DC84DD84DEC7DA84DF84E084E184E284E384E484E584E684E784E884E9DBC484EA84EB84EC84ED84EE84EF84F084F1D9E8C9D784F284F384F4B9B4CEF0D4C884F584F684F784F8B0FCB4D284F9D0D984FA84FB84FC84FDD9E984FEDECBD9EB8540854185428543D8B0BBAFB1B18544B3D7D8CE85458546D4D185478548BDB3BFEF8549CFBB854A854BD8D0854C854D854EB7CB854F85508551D8D185528553855485558556855785588559855A855BC6A5C7F8D2BD855C855DD8D2C4E4855ECAAE855FC7A78560D8A68561C9FDCEE7BBDCB0EB856285638564BBAAD0AD8565B1B0D7E4D7BF8566B5A5C2F4C4CF85678568B2A98569B2B7856AB1E5DFB2D5BCBFA8C2ACD8D5C2B1856BD8D4CED4856CDAE0856DCEC0856E856FD8B4C3AED3A1CEA38570BCB4C8B4C2D18571BEEDD0B68572DAE18573857485758576C7E485778578B3A78579B6F2CCFCC0FA857A857BC0F7857CD1B9D1E1D8C7857D857E85808581858285838584B2DE85858586C0E58587BAF185888589D8C8858AD4AD858B858CCFE1D8C9858DD8CACFC3858EB3F8BEC7858F859085918592D8CB8593859485958596859785988599DBCC859A859B859C859DC8A5859E859F85A0CFD885A1C8FEB2CE85A285A385A485A585A6D3D6B2E6BCB0D3D1CBABB7B485A785A885A9B7A285AA85ABCAE585ACC8A1CADCB1E4D0F085ADC5D185AE85AF85B0DBC5B5FE85B185B2BFDAB9C5BEE4C1ED85B3DFB6DFB5D6BBBDD0D5D9B0C8B6A3BFC9CCA8DFB3CAB7D3D285B4D8CFD2B6BAC5CBBECCBE85B5DFB7B5F0DFB485B685B785B8D3F585B9B3D4B8F785BADFBA85BBBACFBCAAB5F585BCCDACC3FBBAF3C0F4CDC2CFF2DFB8CFC585BDC2C0DFB9C2F085BE85BF85C0BEFD85C1C1DFCDCCD2F7B7CDDFC185C2DFC485C385C4B7F1B0C9B6D6B7D485C5BAACCCFDBFD4CBB1C6F485C6D6A8DFC585C7CEE2B3B385C885C9CEFCB4B585CACEC7BAF085CBCEE185CCD1BD85CD85CEDFC085CF85D0B4F485D1B3CA85D2B8E6DFBB85D385D485D585D6C4C585D7DFBCDFBDDFBEC5BBDFBFDFC2D4B1DFC385D8C7BACED885D985DA85DB85DC85DDC4D885DEDFCA85DFDFCF85E0D6DC85E185E285E385E485E585E685E785E8DFC9DFDACEB685E9BAC7DFCEDFC8C5DE85EA85EBC9EBBAF4C3FC85EC85EDBED785EEDFC685EFDFCD85F0C5D885F185F285F385F4D5A6BACD85F5BECCD3BDB8C085F6D6E485F7DFC7B9BEBFA785F885F9C1FCDFCBDFCC85FADFD085FB85FC85FD85FE8640DFDBDFE58641DFD7DFD6D7C9DFE3DFE4E5EBD2A7DFD28642BFA98643D4DB8644BFC8DFD4864586468647CFCC86488649DFDD864AD1CA864BDFDEB0A7C6B7DFD3864CBAE5864DB6DFCDDBB9FED4D5864E864FDFDFCFECB0A5DFE7DFD1D1C6DFD5DFD8DFD9DFDC8650BBA98651DFE0DFE18652DFE2DFE6DFE8D3B486538654865586568657B8E7C5B6DFEAC9DAC1A8C4C486588659BFDECFF8865A865B865CD5DCDFEE865D865E865F866086618662B2B88663BADFDFEC8664DBC18665D1E48666866786688669CBF4B4BD866AB0A6866B866C866D866E866FDFF1CCC6DFF286708671DFED867286738674867586768677DFE986788679867A867BDFEB867CDFEFDFF0BBBD867D867EDFF386808681DFF48682BBA38683CADBCEA8E0A7B3AA8684E0A6868586868687E0A186888689868A868BDFFE868CCDD9DFFC868DDFFA868EBFD0D7C4868FC9CC86908691DFF8B0A186928693869486958696DFFD869786988699869ADFFBE0A2869B869C869D869E869FE0A886A086A186A286A3B7C886A486A5C6A1C9B6C0B2DFF586A686A7C5BE86A8D8C4DFF9C4F686A986AA86AB86AC86AD86AEE0A3E0A4E0A5D0A586AF86B0E0B4CCE486B1E0B186B2BFA6E0AFCEB9E0ABC9C686B386B4C0AEE0AEBAEDBAB0E0A986B586B686B7DFF686B8E0B386B986BAE0B886BB86BC86BDB4ADE0B986BE86BFCFB2BAC886C0E0B086C186C286C386C486C586C686C7D0FA86C886C986CA86CB86CC86CD86CE86CF86D0E0AC86D1D4FB86D2DFF786D3C5E786D4E0AD86D5D3F786D6E0B6E0B786D786D886D986DA86DBE0C4D0E186DC86DD86DEE0BC86DF86E0E0C9E0CA86E186E286E3E0BEE0AAC9A4E0C186E4E0B286E586E686E786E886E9CAC8E0C386EAE0B586EBCECB86ECCBC3E0CDE0C6E0C286EDE0CB86EEE0BAE0BFE0C086EF86F0E0C586F186F2E0C7E0C886F3E0CC86F4E0BB86F586F686F786F886F9CBD4E0D586FAE0D6E0D286FB86FC86FD86FE87408741E0D0BCCE87428743E0D18744B8C2D8C587458746874787488749874A874B874CD0EA874D874EC2EF874F8750E0CFE0BD875187528753E0D4E0D387548755E0D78756875787588759E0DCE0D8875A875B875CD6F6B3B0875DD7EC875ECBBB875F8760E0DA8761CEFB876287638764BAD987658766876787688769876A876B876C876D876E876F8770E0E1E0DDD2AD87718772877387748775E0E287768777E0DBE0D9E0DF87788779E0E0877A877B877C877D877EE0DE8780E0E4878187828783C6F7D8ACD4EBE0E6CAC98784878587868787E0E587888789878A878BB8C1878C878D878E878FE0E7E0E887908791879287938794879587968797E0E9E0E387988799879A879B879C879D879EBABFCCE7879F87A087A1E0EA87A287A387A487A587A687A787A887A987AA87AB87AC87AD87AE87AF87B0CFF987B187B287B387B487B587B687B787B887B987BA87BBE0EB87BC87BD87BE87BF87C087C187C2C8C287C387C487C587C6BDC087C787C887C987CA87CB87CC87CD87CE87CF87D087D187D287D3C4D287D487D587D687D787D887D987DA87DB87DCE0EC87DD87DEE0ED87DF87E0C7F4CBC487E1E0EEBBD8D8B6D2F2E0EFCDC587E2B6DA87E387E487E587E687E787E8E0F187E9D4B087EA87EBC0A7B4D187EC87EDCEA7E0F087EE87EF87F0E0F2B9CC87F187F2B9FACDBCE0F387F387F487F5C6D4E0F487F6D4B287F7C8A6E0F6E0F587F887F987FA87FB87FC87FD87FE8840884188428843884488458846884788488849E0F7884A884BCDC1884C884D884ECAA5884F885088518852D4DADBD7DBD98853DBD8B9E7DBDCDBDDB5D888548855DBDA8856885788588859885ADBDBB3A1DBDF885B885CBBF8885DD6B7885EDBE0885F886088618862BEF988638864B7BB8865DBD0CCAEBFB2BBB5D7F8BFD38866886788688869886ABFE9886B886CBCE1CCB3DBDEB0D3CEEBB7D8D7B9C6C2886D886EC0A4886FCCB98870DBE7DBE1C6BADBE38871DBE88872C5F7887388748875DBEA88768877DBE9BFC088788879887ADBE6DBE5887B887C887D887E8880B4B9C0ACC2A2DBE2DBE48881888288838884D0CDDBED88858886888788888889C0DDDBF2888A888B888C888D888E888F8890B6E28891889288938894DBF3DBD2B9B8D4ABDBEC8895BFD1DBF08896DBD18897B5E68898DBEBBFE58899889A889BDBEE889CDBF1889D889E889FDBF988A088A188A288A388A488A588A688A788A8B9A1B0A388A988AA88AB88AC88AD88AE88AFC2F188B088B1B3C7DBEF88B288B3DBF888B4C6D2DBF488B588B6DBF5DBF7DBF688B788B8DBFE88B9D3F2B2BA88BA88BB88BCDBFD88BD88BE88BF88C088C188C288C388C4DCA488C5DBFB88C688C788C888C9DBFA88CA88CB88CCDBFCC5E0BBF988CD88CEDCA388CF88D0DCA588D1CCC388D288D388D4B6D1DDC088D588D688D7DCA188D8DCA288D988DA88DBC7B588DC88DD88DEB6E988DF88E088E1DCA788E288E388E488E5DCA688E6DCA9B1A488E788E8B5CC88E988EA88EB88EC88EDBFB088EE88EF88F088F188F2D1DF88F388F488F588F6B6C288F788F888F988FA88FB88FC88FD88FE894089418942894389448945DCA88946894789488949894A894B894CCBFAEBF3894D894E894FCBDC89508951CBFE895289538954CCC189558956895789588959C8FB895A895B895C895D895E895FDCAA89608961896289638964CCEEDCAB89658966896789688969896A896B896C896D896E896F897089718972897389748975DBD38976DCAFDCAC8977BEB38978CAFB8979897A897BDCAD897C897D897E89808981898289838984C9CAC4B989858986898789888989C7BDDCAE898A898B898CD4F6D0E6898D898E898F89908991899289938994C4ABB6D589958996899789988999899A899B899C899D899E899F89A089A189A289A389A489A589A6DBD489A789A889A989AAB1DA89AB89AC89ADDBD589AE89AF89B089B189B289B389B489B589B689B789B8DBD689B989BA89BBBABE89BC89BD89BE89BF89C089C189C289C389C489C589C689C789C889C9C8C089CA89CB89CC89CD89CE89CFCABFC8C989D0D7B389D1C9F989D289D3BFC789D489D5BAF889D689D7D2BC89D889D989DA89DB89DC89DD89DE89DFE2BA89E0B4A689E189E2B1B889E389E489E589E689E7B8B489E8CFC489E989EA89EB89ECD9E7CFA6CDE289ED89EED9EDB6E089EFD2B989F089F1B9BB89F289F389F489F5E2B9E2B789F6B4F389F7CCECCCABB7F289F8D8B2D1EBBABB89F9CAA789FA89FBCDB789FC89FDD2C4BFE4BCD0B6E189FEDEC58A408A418A428A43DEC6DBBC8A44D1D98A458A46C6E6C4CEB7EE8A47B7DC8A488A49BFFCD7E08A4AC6F58A4B8A4CB1BCDEC8BDB1CCD7DECA8A4DDEC98A4E8A4F8A508A518A52B5EC8A53C9DD8A548A55B0C28A568A578A588A598A5A8A5B8A5C8A5D8A5E8A5F8A608A618A62C5AEC5AB8A63C4CC8A64BCE9CBFD8A658A668A67BAC38A688A698A6AE5F9C8E7E5FACDFD8A6BD7B1B8BEC2E88A6CC8D18A6D8A6EE5FB8A6F8A708A718A72B6CABCCB8A738A74D1FDE6A18A75C3EE8A768A778A788A79E6A48A7A8A7B8A7C8A7DE5FEE6A5CDD78A7E8A80B7C1E5FCE5FDE6A38A818A82C4DDE6A88A838A84E6A78A858A868A878A888A898A8AC3C38A8BC6DE8A8C8A8DE6AA8A8E8A8F8A908A918A928A938A94C4B78A958A968A97E6A2CABC8A988A998A9A8A9BBDE3B9C3E6A6D0D5CEAF8A9C8A9DE6A9E6B08A9ED2A68A9FBDAAE6AD8AA08AA18AA28AA38AA4E6AF8AA5C0D18AA68AA7D2CC8AA88AA98AAABCA78AAB8AAC8AAD8AAE8AAF8AB08AB18AB28AB38AB48AB58AB6E6B18AB7D2F68AB88AB98ABAD7CB8ABBCDFE8ABCCDDEC2A6E6ABE6ACBDBFE6AEE6B38ABD8ABEE6B28ABF8AC08AC18AC2E6B68AC3E6B88AC48AC58AC68AC7C4EF8AC88AC98ACAC4C88ACB8ACCBEEAC9EF8ACD8ACEE6B78ACFB6F08AD08AD18AD2C3E48AD38AD48AD58AD68AD78AD88AD9D3E9E6B48ADAE6B58ADBC8A28ADC8ADD8ADE8ADF8AE0E6BD8AE18AE28AE3E6B98AE48AE58AE68AE78AE8C6C58AE98AEACDF1E6BB8AEB8AEC8AED8AEE8AEF8AF08AF18AF28AF38AF4E6BC8AF58AF68AF78AF8BBE98AF98AFA8AFB8AFC8AFD8AFE8B40E6BE8B418B428B438B44E6BA8B458B46C0B78B478B488B498B4A8B4B8B4C8B4D8B4E8B4FD3A4E6BFC9F4E6C38B508B51E6C48B528B538B548B55D0F68B568B578B588B598B5A8B5B8B5C8B5D8B5E8B5F8B608B618B628B638B648B658B668B67C3BD8B688B698B6A8B6B8B6C8B6D8B6EC3C4E6C28B6F8B708B718B728B738B748B758B768B778B788B798B7A8B7B8B7CE6C18B7D8B7E8B808B818B828B838B84E6C7CFB18B85EBF48B868B87E6CA8B888B898B8A8B8B8B8CE6C58B8D8B8EBCDEC9A98B8F8B908B918B928B938B94BCB58B958B96CFD38B978B988B998B9A8B9BE6C88B9CE6C98B9DE6CE8B9EE6D08B9F8BA08BA1E6D18BA28BA38BA4E6CBB5D58BA5E6CC8BA68BA7E6CF8BA88BA9C4DB8BAAE6C68BAB8BAC8BAD8BAE8BAFE6CD8BB08BB18BB28BB38BB48BB58BB68BB78BB88BB98BBA8BBB8BBC8BBD8BBE8BBF8BC08BC18BC28BC38BC48BC58BC6E6D28BC78BC88BC98BCA8BCB8BCC8BCD8BCE8BCF8BD08BD18BD2E6D4E6D38BD38BD48BD58BD68BD78BD88BD98BDA8BDB8BDC8BDD8BDE8BDF8BE08BE18BE28BE38BE48BE58BE68BE78BE88BE98BEA8BEB8BECE6D58BEDD9F88BEE8BEFE6D68BF08BF18BF28BF38BF48BF58BF68BF7E6D78BF88BF98BFA8BFB8BFC8BFD8BFE8C408C418C428C438C448C458C468C47D7D3E6DD8C48E6DEBFD7D4D08C49D7D6B4E6CBEFE6DAD8C3D7CED0A28C4AC3CF8C4B8C4CE6DFBCBEB9C2E6DBD1A78C4D8C4EBAA2C2CF8C4FD8AB8C508C518C52CAEBE5EE8C53E6DC8C54B7F58C558C568C578C58C8E68C598C5AC4F58C5B8C5CE5B2C4FE8C5DCBFCE5B3D5AC8C5ED3EECAD8B0B28C5FCBCECDEA8C608C61BAEA8C628C638C64E5B58C65E5B48C66D7DAB9D9D6E6B6A8CDF0D2CBB1A6CAB58C67B3E8C9F3BFCDD0FBCAD2E5B6BBC28C688C698C6ACFDCB9AC8C6B8C6C8C6D8C6ED4D78C6F8C70BAA6D1E7CFFCBCD28C71E5B7C8DD8C728C738C74BFEDB1F6CBDE8C758C76BCC58C77BCC4D2FAC3DCBFDC8C788C798C7A8C7BB8BB8C7C8C7D8C7EC3C28C80BAAED4A28C818C828C838C848C858C868C878C888C89C7DEC4AFB2EC8C8AB9D18C8B8C8CE5BBC1C88C8D8C8ED5AF8C8F8C908C918C928C93E5BC8C94E5BE8C958C968C978C988C998C9A8C9BB4E7B6D4CBC2D1B0B5BC8C9C8C9DCAD98C9EB7E28C9F8CA0C9E48CA1BDAB8CA28CA3CEBED7F08CA48CA58CA68CA7D0A18CA8C9D98CA98CAAB6FBE6D8BCE28CABB3BE8CACC9D08CADE6D9B3A28CAE8CAF8CB08CB1DECC8CB2D3C8DECD8CB3D2A28CB48CB58CB68CB7DECE8CB88CB98CBA8CBBBECD8CBC8CBDDECF8CBE8CBF8CC0CAACD2FCB3DFE5EAC4E1BEA1CEB2C4F2BED6C6A8B2E38CC18CC2BED38CC38CC4C7FCCCEBBDECCEDD8CC58CC6CABAC6C1E5ECD0BC8CC78CC88CC9D5B98CCA8CCB8CCCE5ED8CCD8CCE8CCF8CD0CAF48CD1CDC0C2C58CD2E5EF8CD3C2C4E5F08CD48CD58CD68CD78CD88CD98CDAE5F8CDCD8CDBC9BD8CDC8CDD8CDE8CDF8CE08CE18CE2D2D9E1A88CE38CE48CE58CE6D3EC8CE7CBEAC6F18CE88CE98CEA8CEB8CECE1AC8CED8CEE8CEFE1A7E1A98CF08CF1E1AAE1AF8CF28CF3B2ED8CF4E1ABB8DAE1ADE1AEE1B0B5BAE1B18CF58CF68CF78CF88CF9E1B3E1B88CFA8CFB8CFC8CFD8CFED1D28D40E1B6E1B5C1EB8D418D428D43E1B78D44D4C08D45E1B28D46E1BAB0B68D478D488D498D4AE1B48D4BBFF98D4CE1B98D4D8D4EE1BB8D4F8D508D518D528D538D54E1BE8D558D568D578D588D598D5AE1BC8D5B8D5C8D5D8D5E8D5F8D60D6C58D618D628D638D648D658D668D67CFBF8D688D69E1BDE1BFC2CD8D6AB6EB8D6BD3F88D6C8D6DC7CD8D6E8D6FB7E58D708D718D728D738D748D758D768D778D788D79BEFE8D7A8D7B8D7C8D7D8D7E8D80E1C0E1C18D818D82E1C7B3E78D838D848D858D868D878D88C6E98D898D8A8D8B8D8C8D8DB4DE8D8ED1C28D8F8D908D918D92E1C88D938D94E1C68D958D968D978D988D99E1C58D9AE1C3E1C28D9BB1C08D9C8D9D8D9ED5B8E1C48D9F8DA08DA18DA28DA3E1CB8DA48DA58DA68DA78DA88DA98DAA8DABE1CCE1CA8DAC8DAD8DAE8DAF8DB08DB18DB28DB3EFFA8DB48DB5E1D3E1D2C7B68DB68DB78DB88DB98DBA8DBB8DBC8DBD8DBE8DBF8DC0E1C98DC18DC2E1CE8DC3E1D08DC48DC58DC68DC78DC88DC98DCA8DCB8DCC8DCD8DCEE1D48DCFE1D1E1CD8DD08DD1E1CF8DD28DD38DD48DD5E1D58DD68DD78DD88DD98DDA8DDB8DDC8DDD8DDE8DDF8DE08DE18DE2E1D68DE38DE48DE58DE68DE78DE88DE98DEA8DEB8DEC8DED8DEE8DEF8DF08DF18DF28DF38DF48DF58DF68DF78DF8E1D78DF98DFA8DFBE1D88DFC8DFD8DFE8E408E418E428E438E448E458E468E478E488E498E4A8E4B8E4C8E4D8E4E8E4F8E508E518E528E538E548E55E1DA8E568E578E588E598E5A8E5B8E5C8E5D8E5E8E5F8E608E618E62E1DB8E638E648E658E668E678E688E69CEA18E6A8E6B8E6C8E6D8E6E8E6F8E708E718E728E738E748E758E76E7DD8E77B4A8D6DD8E788E79D1B2B3B28E7A8E7BB9A4D7F3C7C9BEDEB9AE8E7CCED78E7D8E7EB2EEDBCF8E80BCBAD2D1CBC8B0CD8E818E82CFEF8E838E848E858E868E87D9E3BDED8E888E89B1D2CAD0B2BC8E8ACBA7B7AB8E8BCAA68E8C8E8D8E8ECFA38E8F8E90E0F8D5CAE0FB8E918E92E0FAC5C1CCFB8E93C1B1E0F9D6E3B2AFD6C4B5DB8E948E958E968E978E988E998E9A8E9BB4F8D6A18E9C8E9D8E9E8E9F8EA0CFAFB0EF8EA18EA2E0FC8EA38EA48EA58EA68EA7E1A1B3A38EA88EA9E0FDE0FEC3B18EAA8EAB8EAC8EADC3DD8EAEE1A2B7F98EAF8EB08EB18EB28EB38EB4BBCF8EB58EB68EB78EB88EB98EBA8EBBE1A3C4BB8EBC8EBD8EBE8EBF8EC0E1A48EC18EC2E1A58EC38EC4E1A6B4B18EC58EC68EC78EC88EC98ECA8ECB8ECC8ECD8ECE8ECF8ED08ED18ED28ED3B8C9C6BDC4EA8ED4B2A28ED5D0D28ED6E7DBBBC3D3D7D3C48ED7B9E3E2CF8ED88ED98EDAD7AF8EDBC7ECB1D38EDC8EDDB4B2E2D18EDE8EDF8EE0D0F2C2AEE2D08EE1BFE2D3A6B5D7E2D2B5EA8EE2C3EDB8FD8EE3B8AE8EE4C5D3B7CFE2D48EE58EE68EE78EE8E2D3B6C8D7F98EE98EEA8EEB8EEC8EEDCDA58EEE8EEF8EF08EF18EF2E2D88EF3E2D6CAFCBFB5D3B9E2D58EF48EF58EF68EF7E2D78EF88EF98EFA8EFB8EFC8EFD8EFE8F408F418F42C1AEC0C88F438F448F458F468F478F48E2DBE2DAC0AA8F498F4AC1CE8F4B8F4C8F4D8F4EE2DC8F4F8F508F518F528F538F548F558F568F578F588F598F5AE2DD8F5BE2DE8F5C8F5D8F5E8F5F8F608F618F628F638F64DBC88F65D1D3CDA28F668F67BDA88F688F698F6ADEC3D8A5BFAADBCDD2ECC6FAC5AA8F6B8F6C8F6DDEC48F6EB1D7DFAE8F6F8F708F71CABD8F72DFB18F73B9AD8F74D2FD8F75B8A5BAEB8F768F77B3DA8F788F798F7AB5DCD5C58F7B8F7C8F7D8F7EC3D6CFD2BBA18F80E5F3E5F28F818F82E5F48F83CDE48F84C8F58F858F868F878F888F898F8A8F8BB5AFC7BF8F8CE5F68F8D8F8E8F8FECB08F908F918F928F938F948F958F968F978F988F998F9A8F9B8F9C8F9D8F9EE5E68F9FB9E9B5B18FA0C2BCE5E8E5E7E5E98FA18FA28FA38FA4D2CD8FA58FA68FA7E1EAD0CE8FA8CDAE8FA9D1E58FAA8FABB2CAB1EB8FACB1F2C5ED8FAD8FAED5C3D3B08FAFE1DC8FB08FB18FB2E1DD8FB3D2DB8FB4B3B9B1CB8FB58FB68FB7CDF9D5F7E1DE8FB8BEB6B4FD8FB9E1DFBADCE1E0BBB2C2C9E1E18FBA8FBB8FBCD0EC8FBDCDBD8FBE8FBFE1E28FC0B5C3C5C7E1E38FC18FC2E1E48FC38FC48FC58FC6D3F98FC78FC88FC98FCA8FCB8FCCE1E58FCDD1AD8FCE8FCFE1E6CEA28FD08FD18FD28FD38FD48FD5E1E78FD6B5C28FD78FD88FD98FDAE1E8BBD58FDB8FDC8FDD8FDE8FDFD0C4E2E0B1D8D2E48FE08FE1E2E18FE28FE3BCC9C8CC8FE4E2E3ECFEECFDDFAF8FE58FE68FE7E2E2D6BECDFCC3A68FE88FE98FEAE3C38FEB8FECD6D2E2E78FED8FEEE2E88FEF8FF0D3C78FF18FF2E2ECBFEC8FF3E2EDE2E58FF48FF5B3C08FF68FF78FF8C4EE8FF98FFAE2EE8FFB8FFCD0C38FFDBAF6E2E9B7DEBBB3CCACCBCBE2E4E2E6E2EAE2EB8FFE90409041E2F790429043E2F4D4F5E2F390449045C5AD9046D5FAC5C2B2C090479048E2EF9049E2F2C1AFCBBC904A904BB5A1E2F9904C904D904EBCB1E2F1D0D4D4B9E2F5B9D6E2F6904F90509051C7D390529053905490559056E2F0905790589059905A905BD7DCEDA1905C905DE2F8905EEDA5E2FECAD1905F906090619062906390649065C1B59066BBD090679068BFD69069BAE3906A906BCBA1906C906D906EEDA6EDA3906F9070EDA29071907290739074BBD6EDA7D0F490759076EDA4BADEB6F7E3A1B6B2CCF1B9A79077CFA2C7A190789079BFD2907A907BB6F1907CE2FAE2FBE2FDE2FCC4D5E3A2907DD3C1907E90809081E3A7C7C49082908390849085CFA490869087E3A9BAB790889089908A908BE3A8908CBBDA908DE3A3908E908F9090E3A4E3AA9091E3A69092CEF2D3C690939094BBBC90959096D4C39097C4FA90989099EDA8D0FCE3A5909AC3F5909BE3ADB1AF909CE3B2909D909E909FBCC290A090A1E3ACB5BF90A290A390A490A590A690A790A890A9C7E9E3B090AA90AB90ACBEAACDEF90AD90AE90AF90B090B1BBF390B290B390B4CCE890B590B6E3AF90B7E3B190B8CFA7E3AE90B9CEA9BBDD90BA90BB90BC90BD90BEB5EBBEE5B2D2B3CD90BFB1B9E3ABB2D1B5ACB9DFB6E890C090C1CFEBE3B790C2BBCC90C390C4C8C7D0CA90C590C690C790C890C9E3B8B3EE90CA90CB90CC90CDEDA990CED3FAD3E490CF90D090D1EDAAE3B9D2E290D290D390D490D590D6E3B590D790D890D990DAD3DE90DB90DC90DD90DEB8D0E3B390DF90E0E3B6B7DF90E1E3B4C0A290E290E390E4E3BA90E590E690E790E890E990EA90EB90EC90ED90EE90EF90F090F190F290F390F490F590F690F7D4B890F890F990FA90FB90FC90FD90FE9140B4C89141E3BB9142BBC59143C9F791449145C9E5914691479148C4BD9149914A914B914C914D914E914FEDAB9150915191529153C2FD9154915591569157BBDBBFAE91589159915A915B915C915D915ECEBF915F916091619162E3BC9163BFB6916491659166916791689169916A916B916C916D916E916F9170917191729173917491759176B1EF91779178D4F79179917A917B917C917DE3BE917E9180918191829183918491859186EDAD918791889189918A918B918C918D918E918FE3BFBAA9EDAC91909191E3BD91929193919491959196919791989199919A919BE3C0919C919D919E919F91A091A1BAB691A291A391A4B6AE91A591A691A791A891A9D0B891AAB0C3EDAE91AB91AC91AD91AE91AFEDAFC0C191B0E3C191B191B291B391B491B591B691B791B891B991BA91BB91BC91BD91BE91BF91C091C1C5B391C291C391C491C591C691C791C891C991CA91CB91CC91CD91CE91CFE3C291D091D191D291D391D491D591D691D791D8DCB291D991DA91DB91DC91DD91DEEDB091DFB8EA91E0CEECEAA7D0E7CAF9C8D6CFB7B3C9CED2BDE491E191E2E3DEBBF2EAA8D5BD91E3C6DDEAA991E491E591E6EAAA91E7EAACEAAB91E8EAAEEAAD91E991EA91EB91ECBDD891EDEAAF91EEC2BE91EF91F091F191F2B4C1B4F791F391F4BBA791F591F691F791F891F9ECE6ECE5B7BFCBF9B1E291FAECE791FB91FC91FDC9C8ECE8ECE991FECAD6DED0B2C5D4FA92409241C6CBB0C7B4F2C8D3924292439244CDD092459246BFB8924792489249924A924B924C924DBFDB924E924FC7A4D6B49250C0A9DED1C9A8D1EFC5A4B0E7B3B6C8C592519252B0E292539254B7F692559256C5FA92579258B6F39259D5D2B3D0BCBC925A925B925CB3AD925D925E925F9260BEF1B0D1926192629263926492659266D2D6CAE3D7A59267CDB6B6B6BFB9D5DB9268B8A7C5D79269926A926BDED2BFD9C2D5C7C0926CBBA4B1A8926D926EC5EA926F9270C5FBCCA79271927292739274B1A7927592769277B5D692789279927AC4A8927BDED3D1BAB3E9927CC3F2927D927EB7F79280D6F4B5A3B2F0C4B4C4E9C0ADDED49281B0E8C5C4C1E09282B9D59283BEDCCDD8B0CE9284CDCFDED6BED0D7BEDED5D5D0B0DD92859286C4E292879288C2A3BCF09289D3B5C0B9C5A1B2A6D4F1928A928BC0A8CAC3DED7D5FC928CB9B0928DC8ADCBA9928EDED9BFBD928F929092919292C6B4D7A7CAB0C4C39293B3D6B9D29294929592969297D6B8EAFCB0B492989299929A929BBFE6929C929DCCF4929E929F92A092A1CDDA92A292A392A4D6BFC2CE92A5CECECCA2D0AEC4D3B5B2DED8D5F5BCB7BBD392A692A7B0A492A8C5B2B4EC92A992AA92ABD5F192AC92ADEAFD92AE92AF92B092B192B292B3DEDACDA692B492B5CDEC92B692B792B892B9CEE6DEDC92BACDB1C0A692BB92BCD7BD92BDDEDBB0C6BAB4C9D3C4F3BEE892BE92BF92C092C1B2B692C292C392C492C592C692C792C892C9C0CCCBF092CABCF1BBBBB5B792CB92CC92CDC5F592CEDEE692CF92D092D1DEE3BEDD92D292D3DEDF92D492D592D692D7B4B7BDDD92D892D9DEE0C4ED92DA92DB92DC92DDCFC692DEB5E092DF92E092E192E2B6DECADAB5F4DEE592E3D5C692E4DEE1CCCDC6FE92E5C5C592E692E792E8D2B492E9BEF292EA92EB92EC92ED92EE92EF92F0C2D392F1CCBDB3B892F2BDD392F3BFD8CDC6D1DAB4EB92F4DEE4DEDDDEE792F5EAFE92F692F7C2B0DEE292F892F9D6C0B5A792FAB2F492FBDEE892FCDEF292FD92FE934093419342DEED9343DEF193449345C8E0934693479348D7E1DEEFC3E8CCE19349B2E5934A934B934CD2BE934D934E934F9350935193529353DEEE9354DEEBCED59355B4A79356935793589359935ABFABBEBE935B935CBDD2935D935E935F9360DEE99361D4AE9362DEDE9363DEEA9364936593669367C0BF9368DEECB2F3B8E9C2A79369936ABDC1936B936C936D936E936FDEF5DEF893709371B2ABB4A493729373B4EAC9A6937493759376937793789379DEF6CBD1937AB8E3937BDEF7DEFA937C937D937E9380DEF9938193829383CCC29384B0E1B4EE93859386938793889389938AE5BA938B938C938D938E938FD0AF93909391B2EB9392EBA19393DEF493949395C9E3DEF3B0DAD2A1B1F79396CCAF939793989399939A939B939C939DDEF0939ECBA4939F93A093A1D5AA93A293A393A493A593A6DEFB93A793A893A993AA93AB93AC93AD93AEB4DD93AFC4A693B093B193B2DEFD93B393B493B593B693B793B893B993BA93BB93BCC3FEC4A1DFA193BD93BE93BF93C093C193C293C3C1CC93C4DEFCBEEF93C5C6B293C693C793C893C993CA93CB93CC93CD93CEB3C5C8F693CF93D0CBBADEFE93D193D2DFA493D393D493D593D6D7B293D793D893D993DA93DBB3B793DC93DD93DE93DFC1C393E093E1C7CBB2A5B4E993E2D7AB93E393E493E593E6C4EC93E7DFA2DFA393E8DFA593E9BAB393EA93EB93ECDFA693EDC0DE93EE93EFC9C393F093F193F293F393F493F593F6B2D9C7E693F7DFA793F8C7DC93F993FA93FB93FCDFA8EBA293FD93FE944094419442CBD3944394449445DFAA9446DFA99447B2C194489449944A944B944C944D944E944F9450945194529453945494559456945794589459945A945B945C945D945E945F9460C5CA94619462946394649465946694679468DFAB9469946A946B946C946D946E946F9470D4DC94719472947394749475C8C19476947794789479947A947B947C947D947E948094819482DFAC94839484948594869487BEF094889489DFADD6A7948A948B948C948DEAB7EBB6CAD5948ED8FCB8C4948FB9A594909491B7C5D5FE94929493949494959496B9CA94979498D0A7F4CD9499949AB5D0949B949CC3F4949DBEC8949E949F94A0EBB7B0BD94A194A2BDCC94A3C1B294A4B1D6B3A894A594A694A7B8D2C9A294A894A9B6D894AA94AB94AC94ADEBB8BEB494AE94AF94B0CAFD94B1C7C394B2D5FB94B394B4B7F394B594B694B794B894B994BA94BB94BC94BD94BE94BF94C094C194C294C3CEC494C494C594C6D5ABB1F394C794C894C9ECB3B0DF94CAECB594CB94CC94CDB6B794CEC1CF94CFF5FAD0B194D094D1D5E594D2CED394D394D4BDEFB3E294D5B8AB94D6D5B694D7EDBD94D8B6CF94D9CBB9D0C294DA94DB94DC94DD94DE94DF94E094E1B7BD94E294E3ECB6CAA994E494E594E6C5D494E7ECB9ECB8C2C3ECB794E894E994EA94EBD0FDECBA94ECECBBD7E594ED94EEECBC94EF94F094F1ECBDC6EC94F294F394F494F594F694F794F894F9CEDE94FABCC894FB94FCC8D5B5A9BEC9D6BCD4E794FD94FED1AED0F1EAB8EAB9EABABAB59540954195429543CAB1BFF595449545CDFA9546954795489549954AEAC0954BB0BAEABE954C954DC0A5954E954F9550EABB9551B2FD9552C3F7BBE8955395549555D2D7CEF4EABF955695579558EABC9559955A955BEAC3955CD0C7D3B3955D955E955F9560B4BA9561C3C1D7F29562956395649565D5D19566CAC79567EAC595689569EAC4EAC7EAC6956A956B956C956D956ED6E7956FCFD495709571EACB9572BBCE9573957495759576957795789579BDFAC9CE957A957BEACC957C957DC9B9CFFEEACAD4CEEACDEACF957E9580CDED9581958295839584EAC99585EACE95869587CEEE9588BBDE9589B3BF958A958B958C958D958EC6D5BEB0CEFA958F95909591C7E79592BEA7EAD095939594D6C7959595969597C1C095989599959AD4DD959BEAD1959C959DCFBE959E959F95A095A1EAD295A295A395A495A5CAEE95A695A795A895A9C5AFB0B595AA95AB95AC95AD95AEEAD495AF95B095B195B295B395B495B595B695B7EAD3F4DF95B895B995BA95BB95BCC4BA95BD95BE95BF95C095C1B1A995C295C395C495C5E5DF95C695C795C895C9EAD595CA95CB95CC95CD95CE95CF95D095D195D295D395D495D595D695D795D895D995DA95DB95DC95DD95DE95DF95E095E195E295E3CAEF95E4EAD6EAD7C6D895E595E695E795E895E995EA95EB95ECEAD895ED95EEEAD995EF95F095F195F295F395F4D4BB95F5C7FAD2B7B8FC95F695F7EAC295F8B2DC95F995FAC2FC95FBD4F8CCE6D7EE95FC95FD95FE9640964196429643D4C2D3D0EBC3C5F39644B7FE96459646EBD4964796489649CBB7EBDE964AC0CA964B964C964DCDFB964EB3AF964FC6DA965096519652965396549655EBFC9656C4BE9657CEB4C4A9B1BED4FD9658CAF59659D6EC965A965BC6D3B6E4965C965D965E965FBBFA96609661D0E096629663C9B19664D4D3C8A896659666B8CB9667E8BEC9BC96689669E8BB966AC0EED0D3B2C4B4E5966BE8BC966C966DD5C8966E966F967096719672B6C59673E8BDCAF8B8DCCCF5967496759676C0B496779678D1EEE8BFE8C29679967ABABC967BB1ADBDDC967CEABDE8C3967DE8C6967EE8CB9680968196829683E8CC9684CBC9B0E59685BCAB96869687B9B996889689E8C1968ACDF7968BE8CA968C968D968E968FCEF69690969196929693D5ED9694C1D6E8C49695C3B69696B9FBD6A6E8C8969796989699CAE0D4E6969AE8C0969BE8C5E8C7969CC7B9B7E3969DE8C9969EBFDDE8D2969F96A0E8D796A1E8D5BCDCBCCFE8DB96A296A396A496A596A696A796A896A9E8DE96AAE8DAB1FA96AB96AC96AD96AE96AF96B096B196B296B396B4B0D8C4B3B8CCC6E2C8BEC8E196B596B696B7E8CFE8D4E8D696B8B9F1E8D8D7F596B9C4FB96BAE8DC96BB96BCB2E996BD96BE96BFE8D196C096C1BCED96C296C3BFC2E8CDD6F996C4C1F8B2F196C596C696C796C896C996CA96CB96CCE8DF96CDCAC1E8D996CE96CF96D096D1D5A496D2B1EAD5BBE8CEE8D0B6B0E8D396D3E8DDC0B896D4CAF796D5CBA896D696D7C6DCC0F596D896D996DA96DB96DCE8E996DD96DE96DFD0A396E096E196E296E396E496E596E6E8F2D6EA96E796E896E996EA96EB96EC96EDE8E0E8E196EE96EF96F0D1F9BACBB8F996F196F2B8F1D4D4E8EF96F3E8EEE8ECB9F0CCD2E8E6CEA6BFF296F4B0B8E8F1E8F096F5D7C096F6E8E496F7CDA9C9A396F8BBB8BDDBE8EA96F996FA96FB96FC96FD96FE9740974197429743E8E2E8E3E8E5B5B5E8E7C7C5E8EBE8EDBDB0D7AE9744E8F897459746974797489749974A974B974CE8F5974DCDB0E8F6974E974F9750975197529753975497559756C1BA9757E8E89758C3B7B0F09759975A975B975C975D975E975F9760E8F4976197629763E8F7976497659766B9A3976797689769976A976B976C976D976E976F9770C9D2977197729773C3CECEE0C0E69774977597769777CBF39778CCDDD0B59779977ACAE1977BE8F3977C977D977E9780978197829783978497859786BCEC9787E8F997889789978A978B978C978DC3DE978EC6E5978FB9F79790979197929793B0F497949795D7D897969797BCAC9798C5EF9799979A979B979C979DCCC4979E979FE9A697A097A197A297A397A497A597A697A797A897A9C9AD97AAE9A2C0E297AB97AC97ADBFC397AE97AF97B0E8FEB9D797B1E8FB97B297B397B497B5E9A497B697B797B8D2CE97B997BA97BB97BC97BDE9A397BED6B2D7B597BFE9A797C0BDB797C197C297C397C497C597C697C797C897C997CA97CB97CCE8FCE8FD97CD97CE97CFE9A197D097D197D297D397D497D597D697D7CDD697D897D9D2AC97DA97DB97DCE9B297DD97DE97DF97E0E9A997E197E297E3B4AA97E4B4BB97E597E6E9AB97E797E897E997EA97EB97EC97ED97EE97EF97F097F197F297F397F497F597F697F7D0A897F897F9E9A597FA97FBB3FE97FC97FDE9ACC0E397FEE9AA98409841E9B998429843E9B89844984598469847E9AE98489849E8FA984A984BE9A8984C984D984E984F9850BFACE9B1E9BA98519852C2A5985398549855E9AF9856B8C59857E9AD9858D3DCE9B4E9B5E9B79859985A985BE9C7985C985D985E985F98609861C0C6E9C598629863E9B098649865E9BBB0F19866986798689869986A986B986C986D986E986FE9BCD5A598709871E9BE9872E9BF987398749875E9C198769877C1F198789879C8B6987A987B987CE9BD987D987E988098819882E9C29883988498859886988798889889988AE9C3988BE9B3988CE9B6988DBBB1988E988F9890E9C0989198929893989498959896BCF7989798989899E9C4E9C6989A989B989C989D989E989F98A098A198A298A398A498A5E9CA98A698A798A898A9E9CE98AA98AB98AC98AD98AE98AF98B098B198B298B3B2DB98B4E9C898B598B698B798B898B998BA98BB98BC98BD98BEB7AE98BF98C098C198C298C398C498C598C698C798C898C998CAE9CBE9CC98CB98CC98CD98CE98CF98D0D5C198D1C4A398D298D398D498D598D698D7E9D898D8BAE198D998DA98DB98DCE9C998DDD3A398DE98DF98E0E9D498E198E298E398E498E598E698E7E9D7E9D098E898E998EA98EB98ECE9CF98ED98EEC7C198EF98F098F198F298F398F498F598F6E9D298F798F898F998FA98FB98FC98FDE9D9B3C898FEE9D399409941994299439944CFF0994599469947E9CD99489949994A994B994C994D994E994F995099519952B3F79953995499559956995799589959E9D6995A995BE9DA995C995D995ECCB4995F99609961CFAD99629963996499659966996799689969996AE9D5996BE9DCE9DB996C996D996E996F9970E9DE99719972997399749975997699779978E9D19979997A997B997C997D997E99809981E9DD9982E9DFC3CA9983998499859986998799889989998A998B998C998D998E998F9990999199929993999499959996999799989999999A999B999C999D999E999F99A099A199A299A399A499A599A699A799A899A999AA99AB99AC99AD99AE99AF99B099B199B299B399B499B599B699B799B899B999BA99BB99BC99BD99BE99BF99C099C199C299C399C499C599C699C799C899C999CA99CB99CC99CD99CE99CF99D099D199D299D399D499D599D699D799D899D999DA99DB99DC99DD99DE99DF99E099E199E299E399E499E599E699E799E899E999EA99EB99EC99ED99EE99EF99F099F199F299F399F499F5C7B7B4CEBBB6D0C0ECA399F699F7C5B799F899F999FA99FB99FC99FD99FE9A409A419A42D3FB9A439A449A459A46ECA49A47ECA5C6DB9A489A499A4ABFEE9A4B9A4C9A4D9A4EECA69A4F9A50ECA7D0AA9A51C7B89A529A53B8E89A549A559A569A579A589A599A5A9A5B9A5C9A5D9A5E9A5FECA89A609A619A629A639A649A659A669A67D6B9D5FDB4CBB2BDCEE4C6E79A689A69CDE19A6A9A6B9A6C9A6D9A6E9A6F9A709A719A729A739A749A759A769A77B4F59A78CBC0BCDF9A799A7A9A7B9A7CE9E2E9E3D1EAE9E59A7DB4F9E9E49A7ED1B3CAE2B2D09A80E9E89A819A829A839A84E9E6E9E79A859A86D6B39A879A889A89E9E9E9EA9A8A9A8B9A8C9A8D9A8EE9EB9A8F9A909A919A929A939A949A959A96E9EC9A979A989A999A9A9A9B9A9C9A9D9A9EECAFC5B9B6CE9A9FD2F39AA09AA19AA29AA39AA49AA59AA6B5EE9AA7BBD9ECB19AA89AA9D2E39AAA9AAB9AAC9AAD9AAECEE39AAFC4B89AB0C3BF9AB19AB2B6BED8B9B1C8B1CFB1D1C5FE9AB3B1D09AB4C3AB9AB59AB69AB79AB89AB9D5B19ABA9ABB9ABC9ABD9ABE9ABF9AC09AC1EBA4BAC19AC29AC39AC4CCBA9AC59AC69AC7EBA59AC8EBA79AC99ACA9ACBEBA89ACC9ACD9ACEEBA69ACF9AD09AD19AD29AD39AD49AD5EBA9EBABEBAA9AD69AD79AD89AD99ADAEBAC9ADBCACFD8B5C3F19ADCC3A5C6F8EBADC4CA9ADDEBAEEBAFEBB0B7D59ADE9ADF9AE0B7FA9AE1EBB1C7E29AE2EBB39AE3BAA4D1F5B0B1EBB2EBB49AE49AE59AE6B5AAC2C8C7E89AE7EBB59AE8CBAEE3DF9AE99AEAD3C09AEB9AEC9AED9AEED9DB9AEF9AF0CDA1D6ADC7F39AF19AF29AF3D9E0BBE39AF4BABAE3E29AF59AF69AF79AF89AF9CFAB9AFA9AFB9AFCE3E0C9C79AFDBAB99AFE9B409B41D1B4E3E1C8EAB9AFBDADB3D8CEDB9B429B43CCC09B449B459B46E3E8E3E9CDF49B479B489B499B4A9B4BCCAD9B4CBCB39B4DE3EA9B4EE3EB9B4F9B50D0DA9B519B529B53C6FBB7DA9B549B55C7DFD2CACED69B56E3E4E3EC9B57C9F2B3C19B589B59E3E79B5A9B5BC6E3E3E59B5C9B5DEDB3E3E69B5E9B5F9B609B61C9B39B62C5E69B639B649B65B9B59B66C3BB9B67E3E3C5BDC1A4C2D9B2D79B68E3EDBBA6C4AD9B69E3F0BEDA9B6A9B6BE3FBE3F5BAD39B6C9B6D9B6E9B6FB7D0D3CD9B70D6CED5D3B9C1D5B4D1D89B719B729B739B74D0B9C7F69B759B769B77C8AAB2B49B78C3DA9B799B7A9B7BE3EE9B7C9B7DE3FCE3EFB7A8E3F7E3F49B7E9B809B81B7BA9B829B83C5A29B84E3F6C5DDB2A8C6FC9B85C4E09B869B87D7A29B88C0E1E3F99B899B8AE3FAE3FDCCA9E3F39B8BD3BE9B8CB1C3EDB4E3F1E3F29B8DE3F8D0BAC6C3D4F3E3FE9B8E9B8FBDE09B909B91E4A79B929B93E4A69B949B959B96D1F3E4A39B97E4A99B989B999B9AC8F79B9B9B9C9B9D9B9ECFB49B9FE4A8E4AEC2E59BA09BA1B6B49BA29BA39BA49BA59BA69BA7BDF29BA8E4A29BA99BAABAE9E4AA9BAB9BACE4AC9BAD9BAEB6FDD6DEE4B29BAFE4AD9BB09BB19BB2E4A19BB3BBEECDDDC7A2C5C99BB49BB5C1F79BB6E4A49BB7C7B3BDACBDBDE4A59BB8D7C7B2E29BB9E4ABBCC3E4AF9BBABBEBE4B0C5A8E4B19BBB9BBC9BBD9BBED5E3BFA39BBFE4BA9BC0E4B79BC1E4BB9BC29BC3E4BD9BC49BC5C6D69BC69BC7BAC6C0CB9BC89BC99BCAB8A1E4B49BCB9BCC9BCD9BCED4A19BCF9BD0BAA3BDFE9BD19BD29BD3E4BC9BD49BD59BD69BD79BD8CDBF9BD99BDAC4F99BDB9BDCCFFBC9E69BDD9BDED3BF9BDFCFD19BE09BE1E4B39BE2E4B8E4B9CCE99BE39BE49BE59BE69BE7CCCE9BE8C0D4E4B5C1B0E4B6CED09BE9BBC1B5D39BEAC8F3BDA7D5C7C9ACB8A2E4CA9BEB9BECE4CCD1C49BED9BEED2BA9BEF9BF0BAAD9BF19BF2BAD49BF39BF49BF59BF69BF79BF8E4C3B5ED9BF99BFA9BFBD7CDE4C0CFFDE4BF9BFC9BFD9BFEC1DCCCCA9C409C419C429C43CAE79C449C459C469C47C4D79C48CCD4E4C89C499C4A9C4BE4C7E4C19C4CE4C4B5AD9C4D9C4ED3D99C4FE4C69C509C519C529C53D2F9B4E39C54BBB49C559C56C9EE9C57B4BE9C589C599C5ABBEC9C5BD1CD9C5CCCEDEDB59C5D9C5E9C5F9C609C619C629C639C64C7E59C659C669C679C68D4A89C69E4CBD7D5E4C29C6ABDA5E4C59C6B9C6CD3E69C6DE4C9C9F89C6E9C6FE4BE9C709C71D3E59C729C73C7FEB6C99C74D4FCB2B3E4D79C759C769C77CEC29C78E4CD9C79CEBC9C7AB8DB9C7B9C7CE4D69C7DBFCA9C7E9C809C81D3CE9C82C3EC9C839C849C859C869C879C889C899C8AC5C8E4D89C8B9C8C9C8D9C8E9C8F9C909C919C92CDC4E4CF9C939C949C959C96E4D4E4D59C97BAFE9C98CFE69C999C9AD5BF9C9B9C9C9C9DE4D29C9E9C9F9CA09CA19CA29CA39CA49CA59CA69CA79CA8E4D09CA99CAAE4CE9CAB9CAC9CAD9CAE9CAF9CB09CB19CB29CB39CB49CB59CB69CB79CB89CB9CDE5CAAA9CBA9CBB9CBCC0A39CBDBDA6E4D39CBE9CBFB8C89CC09CC19CC29CC39CC4E4E7D4B49CC59CC69CC79CC89CC99CCA9CCBE4DB9CCC9CCD9CCEC1EF9CCF9CD0E4E99CD19CD2D2E79CD39CD4E4DF9CD5E4E09CD69CD7CFAA9CD89CD99CDA9CDBCBDD9CDCE4DAE4D19CDDE4E59CDEC8DCE4E39CDF9CE0C4E7E4E29CE1E4E19CE29CE39CE4B3FCE4E89CE59CE69CE79CE8B5E19CE99CEA9CEBD7CC9CEC9CED9CEEE4E69CEFBBAC9CF0D7D2CCCFEBF89CF1E4E49CF29CF3B9F69CF49CF59CF6D6CDE4D9E4DCC2FAE4DE9CF7C2CBC0C4C2D09CF8B1F5CCB29CF99CFA9CFB9CFC9CFD9CFE9D409D419D429D43B5CE9D449D459D469D47E4EF9D489D499D4A9D4B9D4C9D4D9D4E9D4FC6AF9D509D519D52C6E19D539D54E4F59D559D569D579D589D59C2A99D5A9D5B9D5CC0ECD1DDE4EE9D5D9D5E9D5F9D609D619D629D639D649D659D66C4AE9D679D689D69E4ED9D6A9D6B9D6C9D6DE4F6E4F4C2FE9D6EE4DD9D6FE4F09D70CAFE9D71D5C49D729D73E4F19D749D759D769D779D789D799D7AD1FA9D7B9D7C9D7D9D7E9D809D819D82E4EBE4EC9D839D849D85E4F29D86CEAB9D879D889D899D8A9D8B9D8C9D8D9D8E9D8F9D90C5CB9D919D929D93C7B19D94C2BA9D959D969D97E4EA9D989D999D9AC1CA9D9B9D9C9D9D9D9E9D9F9DA0CCB6B3B19DA19DA29DA3E4FB9DA4E4F39DA59DA69DA7E4FA9DA8E4FD9DA9E4FC9DAA9DAB9DAC9DAD9DAE9DAF9DB0B3CE9DB19DB29DB3B3BAE4F79DB49DB5E4F9E4F8C5EC9DB69DB79DB89DB99DBA9DBB9DBC9DBD9DBE9DBF9DC09DC19DC2C0BD9DC39DC49DC59DC6D4E89DC79DC89DC99DCA9DCBE5A29DCC9DCD9DCE9DCF9DD09DD19DD29DD39DD49DD59DD6B0C49DD79DD8E5A49DD99DDAE5A39DDB9DDC9DDD9DDE9DDF9DE0BCA49DE1E5A59DE29DE39DE49DE59DE69DE7E5A19DE89DE99DEA9DEB9DEC9DED9DEEE4FEB1F49DEF9DF09DF19DF29DF39DF49DF59DF69DF79DF89DF9E5A89DFAE5A9E5A69DFB9DFC9DFD9DFE9E409E419E429E439E449E459E469E47E5A7E5AA9E489E499E4A9E4B9E4C9E4D9E4E9E4F9E509E519E529E539E549E559E569E579E589E599E5A9E5B9E5C9E5D9E5E9E5F9E609E619E629E639E649E659E669E679E68C6D99E699E6A9E6B9E6C9E6D9E6E9E6F9E70E5ABE5AD9E719E729E739E749E759E769E77E5AC9E789E799E7A9E7B9E7C9E7D9E7E9E809E819E829E839E849E859E869E879E889E89E5AF9E8A9E8B9E8CE5AE9E8D9E8E9E8F9E909E919E929E939E949E959E969E979E989E999E9A9E9B9E9C9E9D9E9EB9E09E9F9EA0E5B09EA19EA29EA39EA49EA59EA69EA79EA89EA99EAA9EAB9EAC9EAD9EAEE5B19EAF9EB09EB19EB29EB39EB49EB59EB69EB79EB89EB99EBABBF0ECE1C3F09EBBB5C6BBD29EBC9EBD9EBE9EBFC1E9D4EE9EC0BEC49EC19EC29EC3D7C69EC4D4D6B2D3ECBE9EC59EC69EC79EC8EAC19EC99ECA9ECBC2AFB4B69ECC9ECD9ECED1D79ECF9ED09ED1B3B49ED2C8B2BFBBECC09ED39ED4D6CB9ED59ED6ECBFECC19ED79ED89ED99EDA9EDB9EDC9EDD9EDE9EDF9EE09EE19EE29EE3ECC5BEE6CCBFC5DABEBC9EE4ECC69EE5B1FE9EE69EE79EE8ECC4D5A8B5E39EE9ECC2C1B6B3E39EEA9EEBECC3CBB8C0C3CCFE9EEC9EED9EEE9EEFC1D29EF0ECC89EF19EF29EF39EF49EF59EF69EF79EF89EF99EFA9EFB9EFC9EFDBAE6C0D39EFED6F29F409F419F42D1CC9F439F449F459F46BFBE9F47B7B3C9D5ECC7BBE29F48CCCCBDFDC8C89F49CFA99F4A9F4B9F4C9F4D9F4E9F4F9F50CDE99F51C5EB9F529F539F54B7E99F559F569F579F589F599F5A9F5B9F5C9F5D9F5E9F5FD1C9BAB89F609F619F629F639F64ECC99F659F66ECCA9F67BBC0ECCB9F68ECE2B1BAB7D99F699F6A9F6B9F6C9F6D9F6E9F6F9F709F719F729F73BDB99F749F759F769F779F789F799F7A9F7BECCCD1E6ECCD9F7C9F7D9F7E9F80C8BB9F819F829F839F849F859F869F879F889F899F8A9F8B9F8C9F8D9F8EECD19F8F9F909F919F92ECD39F93BBCD9F94BCE59F959F969F979F989F999F9A9F9B9F9C9F9D9F9E9F9F9FA09FA1ECCF9FA2C9B79FA39FA49FA59FA69FA7C3BA9FA8ECE3D5D5ECD09FA99FAA9FAB9FAC9FADD6F39FAE9FAF9FB0ECD2ECCE9FB19FB29FB39FB4ECD49FB5ECD59FB69FB7C9BF9FB89FB99FBA9FBB9FBC9FBDCFA89FBE9FBF9FC09FC19FC2D0DC9FC39FC49FC59FC6D1AC9FC79FC89FC99FCAC8DB9FCB9FCC9FCDECD6CEF59FCE9FCF9FD09FD19FD2CAECECDA9FD39FD49FD59FD69FD79FD89FD9ECD99FDA9FDB9FDCB0BE9FDD9FDE9FDF9FE09FE19FE2ECD79FE3ECD89FE49FE59FE6ECE49FE79FE89FE99FEA9FEB9FEC9FED9FEE9FEFC8BC9FF09FF19FF29FF39FF49FF59FF69FF79FF89FF9C1C79FFA9FFB9FFC9FFD9FFEECDCD1E0A040A041A042A043A044A045A046A047A048A049ECDBA04AA04BA04CA04DD4EFA04EECDDA04FA050A051A052A053A054DBC6A055A056A057A058A059A05AA05BA05CA05DA05EECDEA05FA060A061A062A063A064A065A066A067A068A069A06AB1ACA06BA06CA06DA06EA06FA070A071A072A073A074A075A076A077A078A079A07AA07BA07CA07DA07EA080A081ECDFA082A083A084A085A086A087A088A089A08AA08BECE0A08CD7A6A08DC5C0A08EA08FA090EBBCB0AEA091A092A093BEF4B8B8D2AFB0D6B5F9A094D8B3A095CBACA096E3DDA097A098A099A09AA09BA09CA09DC6ACB0E6A09EA09FA0A0C5C6EBB9A0A1A0A2A0A3A0A4EBBAA0A5A0A6A0A7EBBBA0A8A0A9D1C0A0AAC5A3A0ABEAF2A0ACC4B2A0ADC4B5C0CEA0AEA0AFA0B0EAF3C4C1A0B1CEEFA0B2A0B3A0B4A0B5EAF0EAF4A0B6A0B7C9FCA0B8A0B9C7A3A0BAA0BBA0BCCCD8CEFEA0BDA0BEA0BFEAF5EAF6CFACC0E7A0C0A0C1EAF7A0C2A0C3A0C4A0C5A0C6B6BFEAF8A0C7EAF9A0C8EAFAA0C9A0CAEAFBA0CBA0CCA0CDA0CEA0CFA0D0A0D1A0D2A0D3A0D4A0D5A0D6EAF1A0D7A0D8A0D9A0DAA0DBA0DCA0DDA0DEA0DFA0E0A0E1A0E2C8AEE1EBA0E3B7B8E1ECA0E4A0E5A0E6E1EDA0E7D7B4E1EEE1EFD3CCA0E8A0E9A0EAA0EBA0ECA0EDA0EEE1F1BFF1E1F0B5D2A0EFA0F0A0F1B1B7A0F2A0F3A0F4A0F5E1F3E1F2A0F6BAFCA0F7E1F4A0F8A0F9A0FAA0FBB9B7A0FCBED1A0FDA0FEAA40AA41C4FCAA42BADDBDC6AA43AA44AA45AA46AA47AA48E1F5E1F7AA49AA4AB6C0CFC1CAA8E1F6D5F8D3FCE1F8E1FCE1F9AA4BAA4CE1FAC0EAAA4DE1FEE2A1C0C7AA4EAA4FAA50AA51E1FBAA52E1FDAA53AA54AA55AA56AA57AA58E2A5AA59AA5AAA5BC1D4AA5CAA5DAA5EAA5FE2A3AA60E2A8B2FEE2A2AA61AA62AA63C3CDB2C2E2A7E2A6AA64AA65E2A4E2A9AA66AA67E2ABAA68AA69AA6AD0C9D6EDC3A8E2ACAA6BCFD7AA6CAA6DE2AEAA6EAA6FBAEFAA70AA71E9E0E2ADE2AAAA72AA73AA74AA75BBABD4B3AA76AA77AA78AA79AA7AAA7BAA7CAA7DAA7EAA80AA81AA82AA83E2B0AA84AA85E2AFAA86E9E1AA87AA88AA89AA8AE2B1AA8BAA8CAA8DAA8EAA8FAA90AA91AA92E2B2AA93AA94AA95AA96AA97AA98AA99AA9AAA9BAA9CAA9DE2B3CCA1AA9EE2B4AA9FAAA0AB40AB41AB42AB43AB44AB45AB46AB47AB48AB49AB4AAB4BE2B5AB4CAB4DAB4EAB4FAB50D0FEAB51AB52C2CAAB53D3F1AB54CDF5AB55AB56E7E0AB57AB58E7E1AB59AB5AAB5BAB5CBEC1AB5DAB5EAB5FAB60C2EAAB61AB62AB63E7E4AB64AB65E7E3AB66AB67AB68AB69AB6AAB6BCDE6AB6CC3B5AB6DAB6EE7E2BBB7CFD6AB6FC1E1E7E9AB70AB71AB72E7E8AB73AB74E7F4B2A3AB75AB76AB77AB78E7EAAB79E7E6AB7AAB7BAB7CAB7DAB7EE7ECE7EBC9BAAB80AB81D5E4AB82E7E5B7A9E7E7AB83AB84AB85AB86AB87AB88AB89E7EEAB8AAB8BAB8CAB8DE7F3AB8ED6E9AB8FAB90AB91AB92E7EDAB93E7F2AB94E7F1AB95AB96AB97B0E0AB98AB99AB9AAB9BE7F5AB9CAB9DAB9EAB9FABA0AC40AC41AC42AC43AC44AC45AC46AC47AC48AC49AC4AC7F2AC4BC0C5C0EDAC4CAC4DC1F0E7F0AC4EAC4FAC50AC51E7F6CBF6AC52AC53AC54AC55AC56AC57AC58AC59AC5AE8A2E8A1AC5BAC5CAC5DAC5EAC5FAC60D7C1AC61AC62E7FAE7F9AC63E7FBAC64E7F7AC65E7FEAC66E7FDAC67E7FCAC68AC69C1D5C7D9C5FDC5C3AC6AAC6BAC6CAC6DAC6EC7EDAC6FAC70AC71AC72E8A3AC73AC74AC75AC76AC77AC78AC79AC7AAC7BAC7CAC7DAC7EAC80AC81AC82AC83AC84AC85AC86E8A6AC87E8A5AC88E8A7BAF7E7F8E8A4AC89C8F0C9AAAC8AAC8BAC8CAC8DAC8EAC8FAC90AC91AC92AC93AC94AC95AC96E8A9AC97AC98B9E5AC99AC9AAC9BAC9CAC9DD1FEE8A8AC9EAC9FACA0AD40AD41AD42E8AAAD43E8ADE8AEAD44C1A7AD45AD46AD47E8AFAD48AD49AD4AE8B0AD4BAD4CE8ACAD4DE8B4AD4EAD4FAD50AD51AD52AD53AD54AD55AD56AD57AD58E8ABAD59E8B1AD5AAD5BAD5CAD5DAD5EAD5FAD60AD61E8B5E8B2E8B3AD62AD63AD64AD65AD66AD67AD68AD69AD6AAD6BAD6CAD6DAD6EAD6FAD70AD71E8B7AD72AD73AD74AD75AD76AD77AD78AD79AD7AAD7BAD7CAD7DAD7EAD80AD81AD82AD83AD84AD85AD86AD87AD88AD89E8B6AD8AAD8BAD8CAD8DAD8EAD8FAD90AD91AD92B9CFAD93F0ACAD94F0ADAD95C6B0B0EAC8BFAD96CDDFAD97AD98AD99AD9AAD9BAD9CAD9DCECDEAB1AD9EAD9FADA0AE40EAB2AE41C6BFB4C9AE42AE43AE44AE45AE46AE47AE48EAB3AE49AE4AAE4BAE4CD5E7AE4DAE4EAE4FAE50AE51AE52AE53AE54DDF9AE55EAB4AE56EAB5AE57EAB6AE58AE59AE5AAE5BB8CADFB0C9F5AE5CCCF0AE5DAE5EC9FAAE5FAE60AE61AE62AE63C9FBAE64AE65D3C3CBA6AE66B8A6F0AEB1C2AE67E5B8CCEFD3C9BCD7C9EAAE68B5E7AE69C4D0B5E9AE6AEEAEBBADAE6BAE6CE7DEAE6DEEAFAE6EAE6FAE70AE71B3A9AE72AE73EEB2AE74AE75EEB1BDE7AE76EEB0CEB7AE77AE78AE79AE7AC5CFAE7BAE7CAE7DAE7EC1F4DBCEEEB3D0F3AE80AE81AE82AE83AE84AE85AE86AE87C2D4C6E8AE88AE89AE8AB7ACAE8BAE8CAE8DAE8EAE8FAE90AE91EEB4AE92B3EBAE93AE94AE95BBFBEEB5AE96AE97AE98AE99AE9AE7DCAE9BAE9CAE9DEEB6AE9EAE9FBDAEAEA0AF40AF41AF42F1E2AF43AF44AF45CAE8AF46D2C9F0DAAF47F0DBAF48F0DCC1C6AF49B8EDBECEAF4AAF4BF0DEAF4CC5B1F0DDD1F1AF4DF0E0B0CCBDEAAF4EAF4FAF50AF51AF52D2DFF0DFAF53B4AFB7E8F0E6F0E5C6A3F0E1F0E2B4C3AF54AF55F0E3D5EEAF56AF57CCDBBED2BCB2AF58AF59AF5AF0E8F0E7F0E4B2A1AF5BD6A2D3B8BEB7C8ACAF5CAF5DF0EAAF5EAF5FAF60AF61D1F7AF62D6CCBADBF0E9AF63B6BBAF64AF65CDB4AF66AF67C6A6AF68AF69AF6AC1A1F0EBF0EEAF6BF0EDF0F0F0ECAF6CBBBEF0EFAF6DAF6EAF6FAF70CCB5F0F2AF71AF72B3D5AF73AF74AF75AF76B1D4AF77AF78F0F3AF79AF7AF0F4F0F6B4E1AF7BF0F1AF7CF0F7AF7DAF7EAF80AF81F0FAAF82F0F8AF83AF84AF85F0F5AF86AF87AF88AF89F0FDAF8AF0F9F0FCF0FEAF8BF1A1AF8CAF8DAF8ECEC1F1A4AF8FF1A3AF90C1F6F0FBCADDAF91AF92B4F1B1F1CCB1AF93F1A6AF94AF95F1A7AF96AF97F1ACD5CEF1A9AF98AF99C8B3AF9AAF9BAF9CF1A2AF9DF1ABF1A8F1A5AF9EAF9FF1AAAFA0B040B041B042B043B044B045B046B0A9F1ADB047B048B049B04AB04BB04CF1AFB04DF1B1B04EB04FB050B051B052F1B0B053F1AEB054B055B056B057D1A2B058B059B05AB05BB05CB05DB05EF1B2B05FB060B061F1B3B062B063B064B065B066B067B068B069B9EFB06AB06BB5C7B06CB0D7B0D9B06DB06EB06FD4EDB070B5C4B071BDD4BBCAF0A7B072B073B8DEB074B075F0A8B076B077B0A8B078F0A9B079B07ACDEEB07BB07CF0AAB07DB07EB080B081B082B083B084B085B086B087F0ABB088B089B08AB08BB08CB08DB08EB08FB090C6A4B091B092D6E5F1E4B093F1E5B094B095B096B097B098B099B09AB09BB09CB09DC3F3B09EB09FD3DBB0A0B140D6D1C5E8B141D3AFB142D2E6B143B144EEC1B0BBD5B5D1CEBCE0BAD0B145BFF8B146B8C7B5C1C5CCB147B148CAA2B149B14AB14BC3CBB14CB14DB14EB14FB150EEC2B151B152B153B154B155B156B157B158C4BFB6A2B159EDECC3A4B15AD6B1B15BB15CB15DCFE0EDEFB15EB15FC5CEB160B6DCB161B162CAA1B163B164EDEDB165B166EDF0EDF1C3BCB167BFB4B168EDEEB169B16AB16BB16CB16DB16EB16FB170B171B172B173EDF4EDF2B174B175B176B177D5E6C3DFB178EDF3B179B17AB17BEDF6B17CD5A3D1A3B17DB17EB180EDF5B181C3D0B182B183B184B185B186EDF7BFF4BEECEDF8B187CCF7B188D1DBB189B18AB18BD7C5D5F6B18CEDFCB18DB18EB18FEDFBB190B191B192B193B194B195B196B197EDF9EDFAB198B199B19AB19BB19CB19DB19EB19FEDFDBEA6B1A0B240B241B242B243CBAFEEA1B6BDB244EEA2C4C0B245EDFEB246B247BDDEB2C7B248B249B24AB24BB24CB24DB24EB24FB250B251B252B253B6C3B254B255B256EEA5D8BAEEA3EEA6B257B258B259C3E9B3F2B25AB25BB25CB25DB25EB25FEEA7EEA4CFB9B260B261EEA8C2F7B262B263B264B265B266B267B268B269B26AB26BB26CB26DEEA9EEAAB26EDEABB26FB270C6B3B271C7C6B272D6F5B5C9B273CBB2B274B275B276EEABB277B278CDABB279EEACB27AB27BB27CB27DB27ED5B0B280EEADB281F6C4B282B283B284B285B286B287B288B289B28AB28BB28CB28DB28EDBC7B28FB290B291B292B293B294B295B296B297B4A3B298B299B29AC3ACF1E6B29BB29CB29DB29EB29FCAB8D2D3B2A0D6AAB340EFF2B341BED8B342BDC3EFF3B6CCB0ABB343B344B345B346CAAFB347B348EDB6B349EDB7B34AB34BB34CB34DCEF9B7AFBFF3EDB8C2EBC9B0B34EB34FB350B351B352B353EDB9B354B355C6F6BFB3B356B357B358EDBCC5F8B359D1D0B35AD7A9EDBAEDBBB35BD1E2B35CEDBFEDC0B35DEDC4B35EB35FB360EDC8B361EDC6EDCED5E8B362EDC9B363B364EDC7EDBEB365B366C5E9B367B368B369C6C6B36AB36BC9E9D4D2EDC1EDC2EDC3EDC5B36CC0F9B36DB4A1B36EB36FB370B371B9E8B372EDD0B373B374B375B376EDD1B377EDCAB378EDCFB379CEF8B37AB37BCBB6EDCCEDCDB37CB37DB37EB380B381CFF5B382B383B384B385B386B387B388B389B38AB38BB38CB38DEDD2C1F2D3B2EDCBC8B7B38EB38FB390B391B392B393B394B395BCEFB396B397B398B399C5F0B39AB39BB39CB39DB39EB39FB3A0B440B441B442EDD6B443B5EFB444B445C2B5B0ADCBE9B446B447B1AEB448EDD4B449B44AB44BCDEBB5E2B44CEDD5EDD3EDD7B44DB44EB5FAB44FEDD8B450EDD9B451EDDCB452B1CCB453B454B455B456B457B458B459B45AC5F6BCEEEDDACCBCB2EAB45BB45CB45DB45EEDDBB45FB460B461B462C4EBB463B464B4C5B465B466B467B0F5B468B469B46AEDDFC0DAB4E8B46BB46CB46DB46EC5CDB46FB470B471EDDDBFC4B472B473B474EDDEB475B476B477B478B479B47AB47BB47CB47DB47EB480B481B482B483C4A5B484B485B486EDE0B487B488B489B48AB48BEDE1B48CEDE3B48DB48EC1D7B48FB490BBC7B491B492B493B494B495B496BDB8B497B498B499EDE2B49AB49BB49CB49DB49EB49FB4A0B540B541B542B543B544B545EDE4B546B547B548B549B54AB54BB54CB54DB54EB54FEDE6B550B551B552B553B554EDE5B555B556B557B558B559B55AB55BB55CB55DB55EB55FB560B561B562B563EDE7B564B565B566B567B568CABEECEAC0F1B569C9E7B56AECEBC6EEB56BB56CB56DB56EECECB56FC6EDECEDB570B571B572B573B574B575B576B577B578ECF0B579B57AD7E6ECF3B57BB57CECF1ECEEECEFD7A3C9F1CBEEECF4B57DECF2B57EB580CFE9B581ECF6C6B1B582B583B584B585BCC0B586ECF5B587B588B589B58AB58BB58CB58DB5BBBBF6B58EECF7B58FB590B591B592B593D9F7BDFBB594B595C2BBECF8B596B597B598B599ECF9B59AB59BB59CB59DB8A3B59EB59FB5A0B640B641B642B643B644B645B646ECFAB647B648B649B64AB64BB64CB64DB64EB64FB650B651B652ECFBB653B654B655B656B657B658B659B65AB65BB65CB65DECFCB65EB65FB660B661B662D3EDD8AEC0EBB663C7DDBACCB664D0E3CBBDB665CDBAB666B667B8D1B668B669B1FCB66AC7EFB66BD6D6B66CB66DB66EBFC6C3EBB66FB670EFF5B671B672C3D8B673B674B675B676B677B678D7E2B679B67AB67BEFF7B3D3B67CC7D8D1EDB67DD6C8B67EEFF8B680EFF6B681BBFDB3C6B682B683B684B685B686B687B688BDD5B689B68AD2C6B68BBBE0B68CB68DCFA1B68EEFFCEFFBB68FB690EFF9B691B692B693B694B3CCB695C9D4CBB0B696B697B698B699B69AEFFEB69BB69CB0DEB69DB69ED6C9B69FB6A0B740EFFDB741B3EDB742B743F6D5B744B745B746B747B748B749B74AB74BB74CB74DB74EB74FB750B751B752CEC8B753B754B755F0A2B756F0A1B757B5BEBCDABBFCB758B8E5B759B75AB75BB75CB75DB75EC4C2B75FB760B761B762B763B764B765B766B767B768F0A3B769B76AB76BB76CB76DCBEBB76EB76FB770B771B772B773B774B775B776B777B778B779B77AB77BB77CB77DB77EB780B781B782B783B784B785B786F0A6B787B788B789D1A8B78ABEBFC7EEF1B6F1B7BFD5B78BB78CB78DB78EB4A9F1B8CDBBB78FC7D4D5ADB790F1B9B791F1BAB792B793B794B795C7CFB796B797B798D2A4D6CFB799B79AF1BBBDD1B4B0BEBDB79BB79CB79DB4DCCED1B79EBFDFF1BDB79FB7A0B840B841BFFAF1BCB842F1BFB843B844B845F1BEF1C0B846B847B848B849B84AF1C1B84BB84CB84DB84EB84FB850B851B852B853B854B855C1FEB856B857B858B859B85AB85BB85CB85DB85EB85FB860C1A2B861B862B863B864B865B866B867B868B869B86ACAFAB86BB86CD5BEB86DB86EB86FB870BEBABEB9D5C2B871B872BFA2B873CDAFF1B5B874B875B876B877B878B879BDDFB87AB6CBB87BB87CB87DB87EB880B881B882B883B884D6F1F3C3B885B886F3C4B887B8CDB888B889B88AF3C6F3C7B88BB0CAB88CF3C5B88DF3C9CBF1B88EB88FB890F3CBB891D0A6B892B893B1CAF3C8B894B895B896F3CFB897B5D1B898B899F3D7B89AF3D2B89BB89CB89DF3D4F3D3B7FBB89EB1BFB89FF3CEF3CAB5DAB8A0F3D0B940B941F3D1B942F3D5B943B944B945B946F3CDB947BCE3B948C1FDB949F3D6B94AB94BB94CB94DB94EB94FF3DAB950F3CCB951B5C8B952BDEEF3DCB953B954B7A4BFF0D6FECDB2B955B4F0B956B2DFB957F3D8B958F3D9C9B8B959F3DDB95AB95BF3DEB95CF3E1B95DB95EB95FB960B961B962B963B964B965B966B967F3DFB968B969F3E3F3E2B96AB96BF3DBB96CBFEAB96DB3EFB96EF3E0B96FB970C7A9B971BCF2B972B973B974B975F3EBB976B977B978B979B97AB97BB97CB9BFB97DB97EF3E4B980B981B982B2ADBBFEB983CBE3B984B985B986B987F3EDF3E9B988B989B98AB9DCF3EEB98BB98CB98DF3E5F3E6F3EAC2E1F3ECF3EFF3E8BCFDB98EB98FB990CFE4B991B992F3F0B993B994B995F3E7B996B997B998B999B99AB99BB99CB99DF3F2B99EB99FB9A0BA40D7ADC6AABA41BA42BA43BA44F3F3BA45BA46BA47BA48F3F1BA49C2A8BA4ABA4BBA4CBA4DBA4EB8DDF3F5BA4FBA50F3F4BA51BA52BA53B4DBBA54BA55BA56F3F6F3F7BA57BA58BA59F3F8BA5ABA5BBA5CC0BABA5DBA5EC0E9BA5FBA60BA61BA62BA63C5F1BA64BA65BA66BA67F3FBBA68F3FABA69BA6ABA6BBA6CBA6DBA6EBA6FBA70B4D8BA71BA72BA73F3FEF3F9BA74BA75F3FCBA76BA77BA78BA79BA7ABA7BF3FDBA7CBA7DBA7EBA80BA81BA82BA83BA84F4A1BA85BA86BA87BA88BA89BA8AF4A3BBC9BA8BBA8CF4A2BA8DBA8EBA8FBA90BA91BA92BA93BA94BA95BA96BA97BA98BA99F4A4BA9ABA9BBA9CBA9DBA9EBA9FB2BEF4A6F4A5BAA0BB40BB41BB42BB43BB44BB45BB46BB47BB48BB49BCAEBB4ABB4BBB4CBB4DBB4EBB4FBB50BB51BB52BB53BB54BB55BB56BB57BB58BB59BB5ABB5BBB5CBB5DBB5EBB5FBB60BB61BB62BB63BB64BB65BB66BB67BB68BB69BB6ABB6BBB6CBB6DBB6EC3D7D9E1BB6FBB70BB71BB72BB73BB74C0E0F4CCD7D1BB75BB76BB77BB78BB79BB7ABB7BBB7CBB7DBB7EBB80B7DBBB81BB82BB83BB84BB85BB86BB87F4CEC1A3BB88BB89C6C9BB8AB4D6D5B3BB8BBB8CBB8DF4D0F4CFF4D1CBDABB8EBB8FF4D2BB90D4C1D6E0BB91BB92BB93BB94B7E0BB95BB96BB97C1B8BB98BB99C1BBF4D3BEACBB9ABB9BBB9CBB9DBB9EB4E2BB9FBBA0F4D4F4D5BEABBC40BC41F4D6BC42BC43BC44F4DBBC45F4D7F4DABC46BAFDBC47F4D8F4D9BC48BC49BC4ABC4BBC4CBC4DBC4EB8E2CCC7F4DCBC4FB2DABC50BC51C3D3BC52BC53D4E3BFB7BC54BC55BC56BC57BC58BC59BC5AF4DDBC5BBC5CBC5DBC5EBC5FBC60C5B4BC61BC62BC63BC64BC65BC66BC67BC68F4E9BC69BC6ACFB5BC6BBC6CBC6DBC6EBC6FBC70BC71BC72BC73BC74BC75BC76BC77BC78CEC9BC79BC7ABC7BBC7CBC7DBC7EBC80BC81BC82BC83BC84BC85BC86BC87BC88BC89BC8ABC8BBC8CBC8DBC8ECBD8BC8FCBF7BC90BC91BC92BC93BDF4BC94BC95BC96D7CFBC97BC98BC99C0DBBC9ABC9BBC9CBC9DBC9EBC9FBCA0BD40BD41BD42BD43BD44BD45BD46BD47BD48BD49BD4ABD4BBD4CBD4DBD4EBD4FBD50BD51BD52BD53BD54BD55BD56BD57BD58BD59BD5ABD5BBD5CBD5DBD5EBD5FBD60BD61BD62BD63BD64BD65BD66BD67BD68BD69BD6ABD6BBD6CBD6DBD6EBD6FBD70BD71BD72BD73BD74BD75BD76D0F5BD77BD78BD79BD7ABD7BBD7CBD7DBD7EF4EABD80BD81BD82BD83BD84BD85BD86BD87BD88BD89BD8ABD8BBD8CBD8DBD8EBD8FBD90BD91BD92BD93BD94BD95BD96BD97BD98BD99BD9ABD9BBD9CBD9DBD9EBD9FBDA0BE40BE41BE42BE43BE44BE45BE46BE47BE48BE49BE4ABE4BBE4CF4EBBE4DBE4EBE4FBE50BE51BE52BE53F4ECBE54BE55BE56BE57BE58BE59BE5ABE5BBE5CBE5DBE5EBE5FBE60BE61BE62BE63BE64BE65BE66BE67BE68BE69BE6ABE6BBE6CBE6DBE6EBE6FBE70BE71BE72BE73BE74BE75BE76BE77BE78BE79BE7ABE7BBE7CBE7DBE7EBE80BE81BE82BE83BE84BE85BE86BE87BE88BE89BE8ABE8BBE8CBE8DBE8EBE8FBE90BE91BE92BE93BE94BE95BE96BE97BE98BE99BE9ABE9BBE9CBE9DBE9EBE9FBEA0BF40BF41BF42BF43BF44BF45BF46BF47BF48BF49BF4ABF4BBF4CBF4DBF4EBF4FBF50BF51BF52BF53BF54BF55BF56BF57BF58BF59BF5ABF5BBF5CBF5DBF5EBF5FBF60BF61BF62BF63BF64BF65BF66BF67BF68BF69BF6ABF6BBF6CBF6DBF6EBF6FBF70BF71BF72BF73BF74BF75BF76BF77BF78BF79BF7ABF7BBF7CBF7DBF7EBF80F7E3BF81BF82BF83BF84BF85B7B1BF86BF87BF88BF89BF8AF4EDBF8BBF8CBF8DBF8EBF8FBF90BF91BF92BF93BF94BF95BF96BF97BF98BF99BF9ABF9BBF9CBF9DBF9EBF9FBFA0C040C041C042C043C044C045C046C047C048C049C04AC04BC04CC04DC04EC04FC050C051C052C053C054C055C056C057C058C059C05AC05BC05CC05DC05EC05FC060C061C062C063D7EBC064C065C066C067C068C069C06AC06BC06CC06DC06EC06FC070C071C072C073C074C075C076C077C078C079C07AC07BF4EEC07CC07DC07EE6F9BEC0E6FABAECE6FBCFCBE6FCD4BCBCB6E6FDE6FEBCCDC8D2CEB3E7A1C080B4BFE7A2C9B4B8D9C4C9C081D7DDC2DAB7D7D6BDCEC6B7C4C082C083C5A6E7A3CFDFE7A4E7A5E7A6C1B7D7E9C9F0CFB8D6AFD6D5E7A7B0EDE7A8E7A9C9DCD2EFBEADE7AAB0F3C8DEBDE1E7ABC8C6C084E7ACBBE6B8F8D1A4E7ADC2E7BEF8BDCACDB3E7AEE7AFBEEED0E5C085CBE7CCD0BCCCE7B0BCA8D0F7E7B1C086D0F8E7B2E7B3B4C2E7B4E7B5C9FECEACC3E0E7B7B1C1B3F1C087E7B8E7B9D7DBD5C0E7BAC2CCD7BAE7BBE7BCE7BDBCEAC3E5C0C2E7BEE7BFBCA9C088E7C0E7C1E7B6B6D0E7C2C089E7C3E7C4BBBAB5DEC2C6B1E0E7C5D4B5E7C6B8BFE7C8E7C7B7ECC08AE7C9B2F8E7CAE7CBE7CCE7CDE7CEE7CFE7D0D3A7CBF5E7D1E7D2E7D3E7D4C9C9E7D5E7D6E7D7E7D8E7D9BDC9E7DAF3BEC08BB8D7C08CC8B1C08DC08EC08FC090C091C092C093F3BFC094F3C0F3C1C095C096C097C098C099C09AC09BC09CC09DC09EB9DECDF8C09FC0A0D8E8BAB1C140C2DEEEB7C141B7A3C142C143C144C145EEB9C146EEB8B0D5C147C148C149C14AC14BEEBBD5D6D7EFC14CC14DC14ED6C3C14FC150EEBDCAF0C151EEBCC152C153C154C155EEBEC156C157C158C159EEC0C15AC15BEEBFC15CC15DC15EC15FC160C161C162C163D1F2C164C7BCC165C3C0C166C167C168C169C16AB8E1C16BC16CC16DC16EC16FC1E7C170C171F4C6D0DFF4C7C172CFDBC173C174C8BAC175C176F4C8C177C178C179C17AC17BC17CC17DF4C9F4CAC17EF4CBC180C181C182C183C184D9FAB8FEC185C186E5F1D3F0C187F4E0C188CECCC189C18AC18BB3E1C18CC18DC18EC18FF1B4C190D2EEC191F4E1C192C193C194C195C196CFE8F4E2C197C198C7CCC199C19AC19BC19CC19DC19EB5D4B4E4F4E4C19FC1A0C240F4E3F4E5C241C242F4E6C243C244C245C246F4E7C247BAB2B0BFC248F4E8C249C24AC24BC24CC24DC24EC24FB7ADD2EDC250C251C252D2ABC0CFC253BFBCEBA3D5DFEAC8C254C255C256C257F1F3B6F8CBA3C258C259C4CDC25AF1E7C25BF1E8B8FBF1E9BAC4D4C5B0D2C25CC25DF1EAC25EC25FC260F1EBC261F1ECC262C263F1EDF1EEF1EFF1F1F1F0C5D5C264C265C266C267C268C269F1F2C26AB6FAC26BF1F4D2AEDEC7CBCAC26CC26DB3DCC26EB5A2C26FB9A2C270C271C4F4F1F5C272C273F1F6C274C275C276C1C4C1FBD6B0F1F7C277C278C279C27AF1F8C27BC1AAC27CC27DC27EC6B8C280BEDBC281C282C283C284C285C286C287C288C289C28AC28BC28CC28DC28EF1F9B4CFC28FC290C291C292C293C294F1FAC295C296C297C298C299C29AC29BC29CC29DC29EC29FC2A0C340EDB2EDB1C341C342CBE0D2DEC343CBC1D5D8C344C8E2C345C0DFBCA1C346C347C348C349C34AC34BEBC1C34CC34DD0A4C34ED6E2C34FB6C7B8D8EBC0B8CEC350EBBFB3A6B9C9D6ABC351B7F4B7CAC352C353C354BCE7B7BEEBC6C355EBC7B0B9BFCFC356EBC5D3FDC357EBC8C358C359EBC9C35AC35BB7CEC35CEBC2EBC4C9F6D6D7D5CDD0B2EBCFCEB8EBD0C35DB5A8C35EC35FC360C361C362B1B3EBD2CCA5C363C364C365C366C367C368C369C5D6EBD3C36AEBD1C5DFEBCECAA4EBD5B0FBC36BC36CBAFAC36DC36ED8B7F1E3C36FEBCAEBCBEBCCEBCDEBD6E6C0EBD9C370BFE8D2C8EBD7EBDCB8ECEBD8C371BDBAC372D0D8C373B0B7C374EBDDC4DCC375C376C377C378D6ACC379C37AC37BB4E0C37CC37DC2F6BCB9C37EC380EBDAEBDBD4E0C6EAC4D4EBDFC5A7D9F5C381B2B1C382EBE4C383BDC5C384C385C386EBE2C387C388C389C38AC38BC38CC38DC38EC38FC390C391C392C393EBE3C394C395B8ACC396CDD1EBE5C397C398C399EBE1C39AC1B3C39BC39CC39DC39EC39FC6A2C3A0C440C441C442C443C444C445CCF3C446EBE6C447C0B0D2B8EBE7C448C449C44AB8AFB8ADC44BEBE8C7BBCDF3C44CC44DC44EEBEAEBEBC44FC450C451C452C453EBEDC454C455C456C457D0C8C458EBF2C459EBEEC45AC45BC45CEBF1C8F9C45DD1FCEBECC45EC45FEBE9C460C461C462C463B8B9CFD9C4E5EBEFEBF0CCDACDC8B0F2C464EBF6C465C466C467C468C469EBF5C46AB2B2C46BC46CC46DC46EB8E0C46FEBF7C470C471C472C473C474C475B1ECC476C477CCC5C4A4CFA5C478C479C47AC47BC47CEBF9C47DC47EECA2C480C5F2C481EBFAC482C483C484C485C486C487C488C489C9C5C48AC48BC48CC48DC48EC48FE2DFEBFEC490C491C492C493CDCEECA1B1DBD3B7C494C495D2DCC496C497C498EBFDC499EBFBC49AC49BC49CC49DC49EC49FC4A0C540C541C542C543C544C545C546C547C548C549C54AC54BC54CC54DC54EB3BCC54FC550C551EAB0C552C553D7D4C554F4ABB3F4C555C556C557C558C559D6C1D6C2C55AC55BC55CC55DC55EC55FD5E9BECAC560F4A7C561D2A8F4A8F4A9C562F4AABECBD3DFC563C564C565C566C567C9E0C9E1C568C569F3C2C56ACAE6C56BCCF2C56CC56DC56EC56FC570C571E2B6CBB4C572CEE8D6DBC573F4ADF4AEF4AFC574C575C576C577F4B2C578BABDF4B3B0E3F4B0C579F4B1BDA2B2D5C57AF4B6F4B7B6E6B2B0CFCFF4B4B4ACC57BF4B5C57CC57DF4B8C57EC580C581C582C583F4B9C584C585CDA7C586F4BAC587F4BBC588C589C58AF4BCC58BC58CC58DC58EC58FC590C591C592CBD2C593F4BDC594C595C596C597F4BEC598C599C59AC59BC59CC59DC59EC59FF4BFC5A0C640C641C642C643F4DEC1BCBCE8C644C9ABD1DEE5F5C645C646C647C648DCB3D2D5C649C64ADCB4B0ACDCB5C64BC64CBDDAC64DDCB9C64EC64FC650D8C2C651DCB7D3F3C652C9D6DCBADCB6C653DCBBC3A2C654C655C656C657DCBCDCC5DCBDC658C659CEDFD6A5C65ADCCFC65BDCCDC65CC65DDCD2BDE6C2ABC65EDCB8DCCBDCCEDCBEB7D2B0C5DCC7D0BEDCC1BBA8C65FB7BCDCCCC660C661DCC6DCBFC7DBC662C663C664D1BFDCC0C665C666DCCAC667C668DCD0C669C66ACEADDCC2C66BDCC3DCC8DCC9B2D4DCD1CBD5C66CD4B7DCDBDCDFCCA6DCE6C66DC3E7DCDCC66EC66FBFC1DCD9C670B0FAB9B6DCE5DCD3C671DCC4DCD6C8F4BFE0C672C673C674C675C9BBC676C677C678B1BDC679D3A2C67AC67BDCDAC67CC67DDCD5C67EC6BBC680DCDEC681C682C683C684C685D7C2C3AFB7B6C7D1C3A9DCE2DCD8DCEBDCD4C686C687DCDDC688BEA5DCD7C689DCE0C68AC68BDCE3DCE4C68CDCF8C68DC68EDCE1DDA2DCE7C68FC690C691C692C693C694C695C696C697C698BCEBB4C4C699C69AC3A3B2E7DCFAC69BDCF2C69CDCEFC69DDCFCDCEED2F0B2E8C69EC8D7C8E3DCFBC69FDCEDC6A0C740C741DCF7C742C743DCF5C744C745BEA3DCF4C746B2DDC747C748C749C74AC74BDCF3BCF6DCE8BBC4C74CC0F3C74DC74EC74FC750C751BCD4DCE9DCEAC752DCF1DCF6DCF9B5B4C753C8D9BBE7DCFEDCFDD3ABDDA1DDA3DDA5D2F1DDA4DDA6DDA7D2A9C754C755C756C757C758C759C75ABAC9DDA9C75BC75CDDB6DDB1DDB4C75DC75EC75FC760C761C762C763DDB0C6CEC764C765C0F2C766C767C768C769C9AFC76AC76BC76CDCECDDAEC76DC76EC76FC770DDB7C771C772DCF0DDAFC773DDB8C774DDACC775C776C777C778C779C77AC77BDDB9DDB3DDADC4AAC77CC77DC77EC780DDA8C0B3C1ABDDAADDABC781DDB2BBF1DDB5D3A8DDBAC782DDBBC3A7C783C784DDD2DDBCC785C786C787DDD1C788B9BDC789C78ABED5C78BBEFAC78CC78DBACAC78EC78FC790C791DDCAC792DDC5C793DDBFC794C795C796B2CBDDC3C797DDCBB2A4DDD5C798C799C79ADDBEC79BC79CC79DC6D0DDD0C79EC79FC7A0C840C841DDD4C1E2B7C6C842C843C844C845C846DDCEDDCFC847C848C849DDC4C84AC84BC84CDDBDC84DDDCDCCD1C84EDDC9C84FC850C851C852DDC2C3C8C6BCCEAEDDCCC853DDC8C854C855C856C857C858C859DDC1C85AC85BC85CDDC6C2DCC85DC85EC85FC860C861C862D3A9D3AADDD3CFF4C8F8C863C864C865C866C867C868C869C86ADDE6C86BC86CC86DC86EC86FC870DDC7C871C872C873DDE0C2E4C874C875C876C877C878C879C87AC87BDDE1C87CC87DC87EC880C881C882C883C884C885C886DDD7C887C888C889C88AC88BD6F8C88CDDD9DDD8B8F0DDD6C88DC88EC88FC890C6CFC891B6ADC892C893C894C895C896DDE2C897BAF9D4E1DDE7C898C899C89AB4D0C89BDDDAC89CBFFBDDE3C89DDDDFC89EDDDDC89FC8A0C940C941C942C943C944B5D9C945C946C947C948DDDBDDDCDDDEC949BDAFDDE4C94ADDE5C94BC94CC94DC94EC94FC950C951C952DDF5C953C3C9C954C955CBE2C956C957C958C959DDF2C95AC95BC95CC95DC95EC95FC960C961C962C963C964C965C966D8E1C967C968C6D1C969DDF4C96AC96BC96CD5F4DDF3DDF0C96DC96EDDECC96FDDEFC970DDE8C971C972D0EEC973C974C975C976C8D8DDEEC977C978DDE9C979C97ADDEACBF2C97BDDEDC97CC97DB1CDC97EC980C981C982C983C984C0B6C985BCBBDDF1C986C987DDF7C988DDF6DDEBC989C98AC98BC98CC98DC5EEC98EC98FC990DDFBC991C992C993C994C995C996C997C998C999C99AC99BDEA4C99CC99DDEA3C99EC99FC9A0CA40CA41CA42CA43CA44CA45CA46CA47CA48DDF8CA49CA4ACA4BCA4CC3EFCA4DC2FBCA4ECA4FCA50D5E1CA51CA52CEB5CA53CA54CA55CA56DDFDCA57B2CCCA58CA59CA5ACA5BCA5CCA5DCA5ECA5FCA60C4E8CADFCA61CA62CA63CA64CA65CA66CA67CA68CA69CA6AC7BEDDFADDFCDDFEDEA2B0AAB1CECA6BCA6CCA6DCA6ECA6FDEACCA70CA71CA72CA73DEA6BDB6C8EFCA74CA75CA76CA77CA78CA79CA7ACA7BCA7CCA7DCA7EDEA1CA80CA81DEA5CA82CA83CA84CA85DEA9CA86CA87CA88CA89CA8ADEA8CA8BCA8CCA8DDEA7CA8ECA8FCA90CA91CA92CA93CA94CA95CA96DEADCA97D4CCCA98CA99CA9ACA9BDEB3DEAADEAECA9CCA9DC0D9CA9ECA9FCAA0CB40CB41B1A1DEB6CB42DEB1CB43CB44CB45CB46CB47CB48CB49DEB2CB4ACB4BCB4CCB4DCB4ECB4FCB50CB51CB52CB53CB54D1A6DEB5CB55CB56CB57CB58CB59CB5ACB5BDEAFCB5CCB5DCB5EDEB0CB5FD0BDCB60CB61CB62DEB4CAEDDEB9CB63CB64CB65CB66CB67CB68DEB8CB69DEB7CB6ACB6BCB6CCB6DCB6ECB6FCB70DEBBCB71CB72CB73CB74CB75CB76CB77BDE5CB78CB79CB7ACB7BCB7CB2D8C3EACB7DCB7EDEBACB80C5BACB81CB82CB83CB84CB85CB86DEBCCB87CB88CB89CB8ACB8BCB8CCB8DCCD9CB8ECB8FCB90CB91B7AACB92CB93CB94CB95CB96CB97CB98CB99CB9ACB9BCB9CCB9DCB9ECB9FCBA0CC40CC41D4E5CC42CC43CC44DEBDCC45CC46CC47CC48CC49DEBFCC4ACC4BCC4CCC4DCC4ECC4FCC50CC51CC52CC53CC54C4A2CC55CC56CC57CC58DEC1CC59CC5ACC5BCC5CCC5DCC5ECC5FCC60CC61CC62CC63CC64CC65CC66CC67CC68DEBECC69DEC0CC6ACC6BCC6CCC6DCC6ECC6FCC70CC71CC72CC73CC74CC75CC76CC77D5BACC78CC79CC7ADEC2CC7BCC7CCC7DCC7ECC80CC81CC82CC83CC84CC85CC86CC87CC88CC89CC8ACC8BF2AEBBA2C2B2C5B0C2C7CC8CCC8DF2AFCC8ECC8FCC90CC91CC92D0E9CC93CC94CC95D3DDCC96CC97CC98EBBDCC99CC9ACC9BCC9CCC9DCC9ECC9FCCA0B3E6F2B0CD40F2B1CD41CD42CAADCD43CD44CD45CD46CD47CD48CD49BAE7F2B3F2B5F2B4CBE4CFBAF2B2CAB4D2CFC2ECCD4ACD4BCD4CCD4DCD4ECD4FCD50CEC3F2B8B0F6F2B7CD51CD52CD53CD54CD55F2BECD56B2CFCD57CD58CD59CD5ACD5BCD5CD1C1F2BACD5DCD5ECD5FCD60CD61F2BCD4E9CD62CD63F2BBF2B6F2BFF2BDCD64F2B9CD65CD66F2C7F2C4F2C6CD67CD68F2CAF2C2F2C0CD69CD6ACD6BF2C5CD6CCD6DCD6ECD6FCD70D6FBCD71CD72CD73F2C1CD74C7F9C9DFCD75F2C8B9C6B5B0CD76CD77F2C3F2C9F2D0F2D6CD78CD79BBD7CD7ACD7BCD7CF2D5CDDCCD7DD6EBCD7ECD80F2D2F2D4CD81CD82CD83CD84B8F2CD85CD86CD87CD88F2CBCD89CD8ACD8BF2CEC2F9CD8CD5DDF2CCF2CDF2CFF2D3CD8DCD8ECD8FF2D9D3BCCD90CD91CD92CD93B6EACD94CAF1CD95B7E4F2D7CD96CD97CD98F2D8F2DAF2DDF2DBCD99CD9AF2DCCD9BCD9CCD9DCD9ED1D1F2D1CD9FCDC9CDA0CECFD6A9CE40F2E3CE41C3DBCE42F2E0CE43CE44C0AFF2ECF2DECE45F2E1CE46CE47CE48F2E8CE49CE4ACE4BCE4CF2E2CE4DCE4EF2E7CE4FCE50F2E6CE51CE52F2E9CE53CE54CE55F2DFCE56CE57F2E4F2EACE58CE59CE5ACE5BCE5CCE5DCE5ED3ACF2E5B2F5CE5FCE60F2F2CE61D0ABCE62CE63CE64CE65F2F5CE66CE67CE68BBC8CE69F2F9CE6ACE6BCE6CCE6DCE6ECE6FF2F0CE70CE71F2F6F2F8F2FACE72CE73CE74CE75CE76CE77CE78CE79F2F3CE7AF2F1CE7BCE7CCE7DBAFBCE7EB5FBCE80CE81CE82CE83F2EFF2F7F2EDF2EECE84CE85CE86F2EBF3A6CE87F3A3CE88CE89F3A2CE8ACE8BF2F4CE8CC8DACE8DCE8ECE8FCE90CE91F2FBCE92CE93CE94F3A5CE95CE96CE97CE98CE99CE9ACE9BC3F8CE9CCE9DCE9ECE9FCEA0CF40CF41CF42F2FDCF43CF44F3A7F3A9F3A4CF45F2FCCF46CF47CF48F3ABCF49F3AACF4ACF4BCF4CCF4DC2DDCF4ECF4FF3AECF50CF51F3B0CF52CF53CF54CF55CF56F3A1CF57CF58CF59F3B1F3ACCF5ACF5BCF5CCF5DCF5EF3AFF2FEF3ADCF5FCF60CF61CF62CF63CF64CF65F3B2CF66CF67CF68CF69F3B4CF6ACF6BCF6CCF6DF3A8CF6ECF6FCF70CF71F3B3CF72CF73CF74F3B5CF75CF76CF77CF78CF79CF7ACF7BCF7CCF7DCF7ED0B7CF80CF81CF82CF83F3B8CF84CF85CF86CF87D9F9CF88CF89CF8ACF8BCF8CCF8DF3B9CF8ECF8FCF90CF91CF92CF93CF94CF95F3B7CF96C8E4F3B6CF97CF98CF99CF9AF3BACF9BCF9CCF9DCF9ECF9FF3BBB4C0CFA0D040D041D042D043D044D045D046D047D048D049D04AD04BD04CD04DEEC3D04ED04FD050D051D052D053F3BCD054D055F3BDD056D057D058D1AAD059D05AD05BF4ACD0C6D05CD05DD05ED05FD060D061D0D0D1DCD062D063D064D065D066D067CFCED068D069BDD6D06AD1C3D06BD06CD06DD06ED06FD070D071BAE2E1E9D2C2F1C2B2B9D072D073B1EDF1C3D074C9C0B3C4D075D9F2D076CBA5D077F1C4D078D079D07AD07BD6D4D07CD07DD07ED080D081F1C5F4C0F1C6D082D4ACF1C7D083B0C0F4C1D084D085F4C2D086D087B4FCD088C5DBD089D08AD08BD08CCCBBD08DD08ED08FD0E4D090D091D092D093D094CDE0D095D096D097D098D099F1C8D09AD9F3D09BD09CD09DD09ED09FD0A0B1BBD140CFAED141D142D143B8A4D144D145D146D147D148F1CAD149D14AD14BD14CF1CBD14DD14ED14FD150B2C3C1D1D151D152D7B0F1C9D153D154F1CCD155D156D157D158F1CED159D15AD15BD9F6D15CD2E1D4A3D15DD15EF4C3C8B9D15FD160D161D162D163F4C4D164D165F1CDF1CFBFE3F1D0D166D167F1D4D168D169D16AD16BD16CD16DD16EF1D6F1D1D16FC9D1C5E1D170D171D172C2E3B9FCD173D174F1D3D175F1D5D176D177D178B9D3D179D17AD17BD17CD17DD17ED180F1DBD181D182D183D184D185BAD6D186B0FDF1D9D187D188D189D18AD18BF1D8F1D2F1DAD18CD18DD18ED18FD190F1D7D191D192D193C8ECD194D195D196D197CDCAF1DDD198D199D19AD19BE5BDD19CD19DD19EF1DCD19FF1DED1A0D240D241D242D243D244D245D246D247D248F1DFD249D24ACFE5D24BD24CD24DD24ED24FD250D251D252D253D254D255D256D257D258D259D25AD25BD25CD25DD25ED25FD260D261D262D263F4C5BDF3D264D265D266D267D268D269F1E0D26AD26BD26CD26DD26ED26FD270D271D272D273D274D275D276D277D278D279D27AD27BD27CD27DF1E1D27ED280D281CEF7D282D2AAD283F1FBD284D285B8B2D286D287D288D289D28AD28BD28CD28DD28ED28FD290D291D292D293D294D295D296D297D298D299D29AD29BD29CD29DD29ED29FD2A0D340D341D342D343D344D345D346D347D348D349D34AD34BD34CD34DD34ED34FD350D351D352D353D354D355D356D357D358D359D35AD35BD35CD35DD35EBCFBB9DBD35FB9E6C3D9CAD3EAE8C0C0BEF5EAE9EAEAEAEBD360EAECEAEDEAEEEAEFBDC7D361D362D363F5FBD364D365D366F5FDD367F5FED368F5FCD369D36AD36BD36CBDE2D36DF6A1B4A5D36ED36FD370D371F6A2D372D373D374F6A3D375D376D377ECB2D378D379D37AD37BD37CD37DD37ED380D381D382D383D384D1D4D385D386D387D388D389D38AD9EAD38BD38CD38DD38ED38FD390D391D392D393D394D395D396D397D398D399D39AD39BD39CD39DD39ED39FD3A0D440D441D442D443D444D445D446D447D448D449D44AD44BD44CD44DD44ED44FD450D451D452D453D454D455D456D457D458D459D45AD45BD45CD45DD45ED45FF6A4D460D461D462D463D464D465D466D467D468EEBAD469D46AD46BD46CD46DD46ED46FD470D471D472D473D474D475D476D477D478D479D47AD47BD47CD47DD47ED480D481D482D483D484D485D486D487D488D489D48AD48BD48CD48DD48ED48FD490D491D492D493D494D495D496D497D498D499D5B2D49AD49BD49CD49DD49ED49FD4A0D540D541D542D543D544D545D546D547D3FECCDCD548D549D54AD54BD54CD54DD54ED54FCAC4D550D551D552D553D554D555D556D557D558D559D55AD55BD55CD55DD55ED55FD560D561D562D563D564D565D566D567D568D569D56AD56BD56CD56DD56ED56FD570D571D572D573D574D575D576D577D578D579D57AD57BD57CD57DD57ED580D581D582D583D584D585D586D587D588D589D58AD58BD58CD58DD58ED58FD590D591D592D593D594D595D596D597D598D599D59AD59BD59CD59DD59ED59FD5A0D640D641D642D643D644D645D646D647D648D649D64AD64BD64CD64DD64ED64FD650D651D652D653D654D655D656D657D658D659D65AD65BD65CD65DD65ED65FD660D661D662E5C0D663D664D665D666D667D668D669D66AD66BD66CD66DD66ED66FD670D671D672D673D674D675D676D677D678D679D67AD67BD67CD67DD67ED680D681F6A5D682D683D684D685D686D687D688D689D68AD68BD68CD68DD68ED68FD690D691D692D693D694D695D696D697D698D699D69AD69BD69CD69DD69ED69FD6A0D740D741D742D743D744D745D746D747D748D749D74AD74BD74CD74DD74ED74FD750D751D752D753D754D755D756D757D758D759D75AD75BD75CD75DD75ED75FBEAFD760D761D762D763D764C6A9D765D766D767D768D769D76AD76BD76CD76DD76ED76FD770D771D772D773D774D775D776D777D778D779D77AD77BD77CD77DD77ED780D781D782D783D784D785D786D787D788D789D78AD78BD78CD78DD78ED78FD790D791D792D793D794D795D796D797D798DAA5BCC6B6A9B8BCC8CFBCA5DAA6DAA7CCD6C8C3DAA8C6FDD799D1B5D2E9D1B6BCC7D79ABDB2BBE4DAA9DAAAD1C8DAABD0EDB6EFC2DBD79BCBCFB7EDC9E8B7C3BEF7D6A4DAACDAADC6C0D7E7CAB6D79CD5A9CBDFD5EFDAAED6DFB4CADAB0DAAFD79DD2EBDAB1DAB2DAB3CAD4DAB4CAABDAB5DAB6B3CFD6EFDAB7BBB0B5AEDAB8DAB9B9EED1AFD2E8DABAB8C3CFEAB2EFDABBDABCD79EBDEBCEDCD3EFDABDCEF3DABED3D5BBE5DABFCBB5CBD0DAC0C7EBD6EEDAC1C5B5B6C1DAC2B7CCBFCEDAC3DAC4CBADDAC5B5F7DAC6C1C2D7BBDAC7CCB8D79FD2EAC4B1DAC8B5FDBBD1DAC9D0B3DACADACBCEBDDACCDACDDACEB2F7DAD1DACFD1E8DAD0C3D5DAD2D7A0DAD3DAD4DAD5D0BBD2A5B0F9DAD6C7ABDAD7BDF7C3A1DAD8DAD9C3FDCCB7DADADADBC0BEC6D7DADCDADDC7B4DADEDADFB9C8D840D841D842D843D844D845D846D847D848BBEDD849D84AD84BD84CB6B9F4F8D84DF4F9D84ED84FCDE3D850D851D852D853D854D855D856D857F5B9D858D859D85AD85BEBE0D85CD85DD85ED85FD860D861CFF3BBBFD862D863D864D865D866D867D868BAC0D4A5D869D86AD86BD86CD86DD86ED86FE1D9D870D871D872D873F5F4B1AAB2F2D874D875D876D877D878D879D87AF5F5D87BD87CF5F7D87DD87ED880BAD1F5F6D881C3B2D882D883D884D885D886D887D888F5F9D889D88AD88BF5F8D88CD88DD88ED88FD890D891D892D893D894D895D896D897D898D899D89AD89BD89CD89DD89ED89FD8A0D940D941D942D943D944D945D946D947D948D949D94AD94BD94CD94DD94ED94FD950D951D952D953D954D955D956D957D958D959D95AD95BD95CD95DD95ED95FD960D961D962D963D964D965D966D967D968D969D96AD96BD96CD96DD96ED96FD970D971D972D973D974D975D976D977D978D979D97AD97BD97CD97DD97ED980D981D982D983D984D985D986D987D988D989D98AD98BD98CD98DD98ED98FD990D991D992D993D994D995D996D997D998D999D99AD99BD99CD99DD99ED99FD9A0DA40DA41DA42DA43DA44DA45DA46DA47DA48DA49DA4ADA4BDA4CDA4DDA4EB1B4D5EAB8BADA4FB9B1B2C6D4F0CFCDB0DCD5CBBBF5D6CAB7B7CCB0C6B6B1E1B9BAD6FCB9E1B7A1BCFAEADAEADBCCF9B9F3EADCB4FBC3B3B7D1BAD8EADDD4F4EADEBCD6BBDFEADFC1DEC2B8D4DFD7CAEAE0EAE1EAE4EAE2EAE3C9DEB8B3B6C4EAE5CAEAC9CDB4CDDA50DA51E2D9C5E2EAE6C0B5DA52D7B8EAE7D7ACC8FCD8D3D8CDD4DEDA53D4F9C9C4D3AEB8D3B3E0DA54C9E2F4F6DA55DA56DA57BAD5DA58F4F7DA59DA5AD7DFDA5BDA5CF4F1B8B0D5D4B8CFC6F0DA5DDA5EDA5FDA60DA61DA62DA63DA64DA65B3C3DA66DA67F4F2B3ACDA68DA69DA6ADA6BD4BDC7F7DA6CDA6DDA6EDA6FDA70F4F4DA71DA72F4F3DA73DA74DA75DA76DA77DA78DA79DA7ADA7BDA7CCCCBDA7DDA7EDA80C8A4DA81DA82DA83DA84DA85DA86DA87DA88DA89DA8ADA8BDA8CDA8DF4F5DA8ED7E3C5BFF5C0DA8FDA90F5BBDA91F5C3DA92F5C2DA93D6BAF5C1DA94DA95DA96D4BEF5C4DA97F5CCDA98DA99DA9ADA9BB0CFB5F8DA9CF5C9F5CADA9DC5DCDA9EDA9FDAA0DB40F5C5F5C6DB41DB42F5C7F5CBDB43BEE0F5C8B8FADB44DB45DB46F5D0F5D3DB47DB48DB49BFE7DB4AB9F2F5BCF5CDDB4BDB4CC2B7DB4DDB4EDB4FCCF8DB50BCF9DB51F5CEF5CFF5D1B6E5F5D2DB52F5D5DB53DB54DB55DB56DB57DB58DB59F5BDDB5ADB5BDB5CF5D4D3BBDB5DB3ECDB5EDB5FCCA4DB60DB61DB62DB63F5D6DB64DB65DB66DB67DB68DB69DB6ADB6BF5D7BEE1F5D8DB6CDB6DCCDFF5DBDB6EDB6FDB70DB71DB72B2C8D7D9DB73F5D9DB74F5DAF5DCDB75F5E2DB76DB77DB78F5E0DB79DB7ADB7BF5DFF5DDDB7CDB7DF5E1DB7EDB80F5DEF5E4F5E5DB81CCE3DB82DB83E5BFB5B8F5E3F5E8CCA3DB84DB85DB86DB87DB88F5E6F5E7DB89DB8ADB8BDB8CDB8DDB8EF5BEDB8FDB90DB91DB92DB93DB94DB95DB96DB97DB98DB99DB9AB1C4DB9BDB9CF5BFDB9DDB9EB5C5B2E4DB9FF5ECF5E9DBA0B6D7DC40F5EDDC41F5EADC42DC43DC44DC45DC46F5EBDC47DC48B4DADC49D4EADC4ADC4BDC4CF5EEDC4DB3F9DC4EDC4FDC50DC51DC52DC53DC54F5EFF5F1DC55DC56DC57F5F0DC58DC59DC5ADC5BDC5CDC5DDC5EF5F2DC5FF5F3DC60DC61DC62DC63DC64DC65DC66DC67DC68DC69DC6ADC6BC9EDB9AADC6CDC6DC7FBDC6EDC6FB6E3DC70DC71DC72DC73DC74DC75DC76CCC9DC77DC78DC79DC7ADC7BDC7CDC7DDC7EDC80DC81DC82DC83DC84DC85DC86DC87DC88DC89DC8AEAA6DC8BDC8CDC8DDC8EDC8FDC90DC91DC92DC93DC94DC95DC96DC97DC98DC99DC9ADC9BDC9CDC9DDC9EDC9FDCA0DD40DD41DD42DD43DD44DD45DD46DD47DD48DD49DD4ADD4BDD4CDD4DDD4EDD4FDD50DD51DD52DD53DD54DD55DD56DD57DD58DD59DD5ADD5BDD5CDD5DDD5EDD5FDD60DD61DD62DD63DD64DD65DD66DD67DD68DD69DD6ADD6BDD6CDD6DDD6EDD6FDD70DD71DD72DD73DD74DD75DD76DD77DD78DD79DD7ADD7BDD7CDD7DDD7EDD80DD81DD82DD83DD84DD85DD86DD87DD88DD89DD8ADD8BDD8CDD8DDD8EDD8FDD90DD91DD92DD93DD94DD95DD96DD97DD98DD99DD9ADD9BDD9CDD9DDD9EDD9FDDA0DE40DE41DE42DE43DE44DE45DE46DE47DE48DE49DE4ADE4BDE4CDE4DDE4EDE4FDE50DE51DE52DE53DE54DE55DE56DE57DE58DE59DE5ADE5BDE5CDE5DDE5EDE5FDE60B3B5D4FEB9ECD0F9DE61E9EDD7AAE9EEC2D6C8EDBAE4E9EFE9F0E9F1D6E1E9F2E9F3E9F5E9F4E9F6E9F7C7E1E9F8D4D8E9F9BDCEDE62E9FAE9FBBDCFE9FCB8A8C1BEE9FDB1B2BBD4B9F5E9FEDE63EAA1EAA2EAA3B7F8BCADDE64CAE4E0CED4AFCFBDD5B7EAA4D5DEEAA5D0C1B9BCDE65B4C7B1D9DE66DE67DE68C0B1DE69DE6ADE6BDE6CB1E6B1E7DE6DB1E8DE6EDE6FDE70DE71B3BDC8E8DE72DE73DE74DE75E5C1DE76DE77B1DFDE78DE79DE7AC1C9B4EFDE7BDE7CC7A8D3D8DE7DC6F9D1B8DE7EB9FDC2F5DE80DE81DE82DE83DE84D3ADDE85D4CBBDFCDE86E5C2B7B5E5C3DE87DE88BBB9D5E2DE89BDF8D4B6CEA5C1ACB3D9DE8ADE8BCCF6DE8CE5C6E5C4E5C8DE8DE5CAE5C7B5CFC6C8DE8EB5FCE5C5DE8FCAF6DE90DE91E5C9DE92DE93DE94C3D4B1C5BCA3DE95DE96DE97D7B7DE98DE99CDCBCBCDCACACCD3E5CCE5CBC4E6DE9ADE9BD1A1D1B7E5CDDE9CE5D0DE9DCDB8D6F0E5CFB5DDDE9ECDBEDE9FE5D1B6BADEA0DF40CDA8B9E4DF41CAC5B3D1CBD9D4ECE5D2B7EADF42DF43DF44E5CEDF45DF46DF47DF48DF49DF4AE5D5B4FEE5D6DF4BDF4CDF4DDF4EDF4FE5D3E5D4DF50D2DDDF51DF52C2DFB1C6DF53D3E2DF54DF55B6DDCBECDF56E5D7DF57DF58D3F6DF59DF5ADF5BDF5CDF5DB1E9DF5EB6F4E5DAE5D8E5D9B5C0DF5FDF60DF61D2C5E5DCDF62DF63E5DEDF64DF65DF66DF67DF68DF69E5DDC7B2DF6AD2A3DF6BDF6CE5DBDF6DDF6EDF6FDF70D4E2D5DADF71DF72DF73DF74DF75E5E0D7F1DF76DF77DF78DF79DF7ADF7BDF7CE5E1DF7DB1DCD1FBDF7EE5E2E5E4DF80DF81DF82DF83E5E3DF84DF85E5E5DF86DF87DF88DF89DF8AD2D8DF8BB5CBDF8CE7DFDF8DDAF5DF8EDAF8DF8FDAF6DF90DAF7DF91DF92DF93DAFAD0CFC4C7DF94DF95B0EEDF96DF97DF98D0B0DF99DAF9DF9AD3CABAAADBA2C7F1DF9BDAFCDAFBC9DBDAFDDF9CDBA1D7DEDAFEC1DADF9DDF9EDBA5DF9FDFA0D3F4E040E041DBA7DBA4E042DBA8E043E044BDBCE045E046E047C0C9DBA3DBA6D6A3E048DBA9E049E04AE04BDBADE04CE04DE04EDBAEDBACBAC2E04FE050E051BFA4DBABE052E053E054DBAAD4C7B2BFE055E056DBAFE057B9F9E058DBB0E059E05AE05BE05CB3BBE05DE05EE05FB5A6E060E061E062E063B6BCDBB1E064E065E066B6F5E067DBB2E068E069E06AE06BE06CE06DE06EE06FE070E071E072E073E074E075E076E077E078E079E07AE07BB1C9E07CE07DE07EE080DBB4E081E082E083DBB3DBB5E084E085E086E087E088E089E08AE08BE08CE08DE08EDBB7E08FDBB6E090E091E092E093E094E095E096DBB8E097E098E099E09AE09BE09CE09DE09EE09FDBB9E0A0E140DBBAE141E142D3CFF4FAC7F5D7C3C5E4F4FCF4FDF4FBE143BEC6E144E145E146E147D0EFE148E149B7D3E14AE14BD4CDCCAAE14CE14DF5A2F5A1BAA8F4FECBD6E14EE14FE150F5A4C0D2E151B3EAE152CDAAF5A5F5A3BDB4F5A8E153F5A9BDCDC3B8BFE1CBE1F5AAE154E155E156F5A6F5A7C4F0E157E158E159E15AE15BF5ACE15CB4BCE15DD7EDE15EB4D7F5ABF5AEE15FE160F5ADF5AFD0D1E161E162E163E164E165E166E167C3D1C8A9E168E169E16AE16BE16CE16DF5B0F5B1E16EE16FE170E171E172E173F5B2E174E175F5B3F5B4F5B5E176E177E178E179F5B7F5B6E17AE17BE17CE17DF5B8E17EE180E181E182E183E184E185E186E187E188E189E18AB2C9E18BD3D4CACDE18CC0EFD6D8D2B0C1BFE18DBDF0E18EE18FE190E191E192E193E194E195E196E197B8AAE198E199E19AE19BE19CE19DE19EE19FE1A0E240E241E242E243E244E245E246E247E248E249E24AE24BE24CE24DE24EE24FE250E251E252E253E254E255E256E257E258E259E25AE25BE25CE25DE25EE25FE260E261E262E263E264E265E266E267E268E269E26AE26BE26CE26DE26EE26FE270E271E272E273E274E275E276E277E278E279E27AE27BE27CE27DE27EE280E281E282E283E284E285E286E287E288E289E28AE28BE28CE28DE28EE28FE290E291E292E293E294E295E296E297E298E299E29AE29BE29CE29DE29EE29FE2A0E340E341E342E343E344E345E346E347E348E349E34AE34BE34CE34DE34EE34FE350E351E352E353E354E355E356E357E358E359E35AE35BE35CE35DE35EE35FE360E361E362E363E364E365E366E367E368E369E36AE36BE36CE36DBCF8E36EE36FE370E371E372E373E374E375E376E377E378E379E37AE37BE37CE37DE37EE380E381E382E383E384E385E386E387F6C6E388E389E38AE38BE38CE38DE38EE38FE390E391E392E393E394E395E396E397E398E399E39AE39BE39CE39DE39EE39FE3A0E440E441E442E443E444E445F6C7E446E447E448E449E44AE44BE44CE44DE44EE44FE450E451E452E453E454E455E456E457E458E459E45AE45BE45CE45DE45EF6C8E45FE460E461E462E463E464E465E466E467E468E469E46AE46BE46CE46DE46EE46FE470E471E472E473E474E475E476E477E478E479E47AE47BE47CE47DE47EE480E481E482E483E484E485E486E487E488E489E48AE48BE48CE48DE48EE48FE490E491E492E493E494E495E496E497E498E499E49AE49BE49CE49DE49EE49FE4A0E540E541E542E543E544E545E546E547E548E549E54AE54BE54CE54DE54EE54FE550E551E552E553E554E555E556E557E558E559E55AE55BE55CE55DE55EE55FE560E561E562E563E564E565E566E567E568E569E56AE56BE56CE56DE56EE56FE570E571E572E573F6C9E574E575E576E577E578E579E57AE57BE57CE57DE57EE580E581E582E583E584E585E586E587E588E589E58AE58BE58CE58DE58EE58FE590E591E592E593E594E595E596E597E598E599E59AE59BE59CE59DE59EE59FF6CAE5A0E640E641E642E643E644E645E646E647E648E649E64AE64BE64CE64DE64EE64FE650E651E652E653E654E655E656E657E658E659E65AE65BE65CE65DE65EE65FE660E661E662F6CCE663E664E665E666E667E668E669E66AE66BE66CE66DE66EE66FE670E671E672E673E674E675E676E677E678E679E67AE67BE67CE67DE67EE680E681E682E683E684E685E686E687E688E689E68AE68BE68CE68DE68EE68FE690E691E692E693E694E695E696E697E698E699E69AE69BE69CE69DF6CBE69EE69FE6A0E740E741E742E743E744E745E746E747F7E9E748E749E74AE74BE74CE74DE74EE74FE750E751E752E753E754E755E756E757E758E759E75AE75BE75CE75DE75EE75FE760E761E762E763E764E765E766E767E768E769E76AE76BE76CE76DE76EE76FE770E771E772E773E774E775E776E777E778E779E77AE77BE77CE77DE77EE780E781E782E783E784E785E786E787E788E789E78AE78BE78CE78DE78EE78FE790E791E792E793E794E795E796E797E798E799E79AE79BE79CE79DE79EE79FE7A0E840E841E842E843E844E845E846E847E848E849E84AE84BE84CE84DE84EF6CDE84FE850E851E852E853E854E855E856E857E858E859E85AE85BE85CE85DE85EE85FE860E861E862E863E864E865E866E867E868E869E86AE86BE86CE86DE86EE86FE870E871E872E873E874E875E876E877E878E879E87AF6CEE87BE87CE87DE87EE880E881E882E883E884E885E886E887E888E889E88AE88BE88CE88DE88EE88FE890E891E892E893E894EEC4EEC5EEC6D5EBB6A4EEC8EEC7EEC9EECAC7A5EECBEECCE895B7B0B5F6EECDEECFE896EECEE897B8C6EED0EED1EED2B6DBB3AED6D3C4C6B1B5B8D6EED3EED4D4BFC7D5BEFBCED9B9B3EED6EED5EED8EED7C5A5EED9EEDAC7AEEEDBC7AFEEDCB2A7EEDDEEDEEEDFEEE0EEE1D7EAEEE2EEE3BCD8EEE4D3CBCCFAB2ACC1E5EEE5C7A6C3ADE898EEE6EEE7EEE8EEE9EEEAEEEBEEECE899EEEDEEEEEEEFE89AE89BEEF0EEF1EEF2EEF4EEF3E89CEEF5CDADC2C1EEF6EEF7EEF8D5A1EEF9CFB3EEFAEEFBE89DEEFCEEFDEFA1EEFEEFA2B8F5C3FAEFA3EFA4BDC2D2BFB2F9EFA5EFA6EFA7D2F8EFA8D6FDEFA9C6CCE89EEFAAEFABC1B4EFACCFFACBF8EFAEEFADB3FAB9F8EFAFEFB0D0E2EFB1EFB2B7E6D0BFEFB3EFB4EFB5C8F1CCE0EFB6EFB7EFB8EFB9EFBAD5E0EFBBB4EDC3AAEFBCE89FEFBDEFBEEFBFE8A0CEFDEFC0C2E0B4B8D7B6BDF5E940CFC7EFC3EFC1EFC2EFC4B6A7BCFCBEE2C3CCEFC5EFC6E941EFC7EFCFEFC8EFC9EFCAC7C2EFF1B6CDEFCBE942EFCCEFCDB6C6C3BEEFCEE943EFD0EFD1EFD2D5F2E944EFD3C4F7E945EFD4C4F8EFD5EFD6B8E4B0F7EFD7EFD8EFD9E946EFDAEFDBEFDCEFDDE947EFDEBEB5EFE1EFDFEFE0E948EFE2EFE3C1CDEFE4EFE5EFE6EFE7EFE8EFE9EFEAEFEBEFECC0D8E949EFEDC1ADEFEEEFEFEFF0E94AE94BCFE2E94CE94DE94EE94FE950E951E952E953B3A4E954E955E956E957E958E959E95AE95BE95CE95DE95EE95FE960E961E962E963E964E965E966E967E968E969E96AE96BE96CE96DE96EE96FE970E971E972E973E974E975E976E977E978E979E97AE97BE97CE97DE97EE980E981E982E983E984E985E986E987E988E989E98AE98BE98CE98DE98EE98FE990E991E992E993E994E995E996E997E998E999E99AE99BE99CE99DE99EE99FE9A0EA40EA41EA42EA43EA44EA45EA46EA47EA48EA49EA4AEA4BEA4CEA4DEA4EEA4FEA50EA51EA52EA53EA54EA55EA56EA57EA58EA59EA5AEA5BC3C5E3C5C9C1E3C6EA5CB1D5CECAB4B3C8F2E3C7CFD0E3C8BCE4E3C9E3CAC3C6D5A2C4D6B9EBCEC5E3CBC3F6E3CCEA5DB7A7B8F3BAD2E3CDE3CED4C4E3CFEA5EE3D0D1CBE3D1E3D2E3D3E3D4D1D6E3D5B2FBC0BBE3D6EA5FC0ABE3D7E3D8E3D9EA60E3DAE3DBEA61B8B7DAE2EA62B6D3EA63DAE4DAE3EA64EA65EA66EA67EA68EA69EA6ADAE6EA6BEA6CEA6DC8EEEA6EEA6FDAE5B7C0D1F4D2F5D5F3BDD7EA70EA71EA72EA73D7E8DAE8DAE7EA74B0A2CDD3EA75DAE9EA76B8BDBCCAC2BDC2A4B3C2DAEAEA77C2AAC4B0BDB5EA78EA79CFDEEA7AEA7BEA7CDAEBC9C2EA7DEA7EEA80EA81EA82B1DDEA83EA84EA85DAECEA86B6B8D4BAEA87B3FDEA88EA89DAEDD4C9CFD5C5E3EA8ADAEEEA8BEA8CEA8DEA8EEA8FDAEFEA90DAF0C1EACCD5CFDDEA91EA92EA93EA94EA95EA96EA97EA98EA99EA9AEA9BEA9CEA9DD3E7C2A1EA9EDAF1EA9FEAA0CBE5EB40DAF2EB41CBE6D2FEEB42EB43EB44B8F4EB45EB46DAF3B0AFCFB6EB47EB48D5CFEB49EB4AEB4BEB4CEB4DEB4EEB4FEB50EB51EB52CBEDEB53EB54EB55EB56EB57EB58EB59EB5ADAF4EB5BEB5CE3C4EB5DEB5EC1A5EB5FEB60F6BFEB61EB62F6C0F6C1C4D1EB63C8B8D1E3EB64EB65D0DBD1C5BCAFB9CDEB66EFF4EB67EB68B4C6D3BAF6C2B3FBEB69EB6AF6C3EB6BEB6CB5F1EB6DEB6EEB6FEB70EB71EB72EB73EB74EB75EB76F6C5EB77EB78EB79EB7AEB7BEB7CEB7DD3EAF6A7D1A9EB7EEB80EB81EB82F6A9EB83EB84EB85F6A8EB86EB87C1E3C0D7EB88B1A2EB89EB8AEB8BEB8CCEEDEB8DD0E8F6ABEB8EEB8FCFF6EB90F6AAD5F0F6ACC3B9EB91EB92EB93BBF4F6AEF6ADEB94EB95EB96C4DEEB97EB98C1D8EB99EB9AEB9BEB9CEB9DCBAAEB9ECFBCEB9FEBA0EC40EC41EC42EC43EC44EC45EC46EC47EC48F6AFEC49EC4AF6B0EC4BEC4CF6B1EC4DC2B6EC4EEC4FEC50EC51EC52B0D4C5F9EC53EC54EC55EC56F6B2EC57EC58EC59EC5AEC5BEC5CEC5DEC5EEC5FEC60EC61EC62EC63EC64EC65EC66EC67EC68EC69C7E0F6A6EC6AEC6BBEB8EC6CEC6DBEB2EC6EB5E5EC6FEC70B7C7EC71BFBFC3D2C3E6EC72EC73D8CCEC74EC75EC76B8EFEC77EC78EC79EC7AEC7BEC7CEC7DEC7EEC80BDF9D1A5EC81B0D0EC82EC83EC84EC85EC86F7B0EC87EC88EC89EC8AEC8BEC8CEC8DEC8EF7B1EC8FEC90EC91EC92EC93D0ACEC94B0B0EC95EC96EC97F7B2F7B3EC98F7B4EC99EC9AEC9BC7CAEC9CEC9DEC9EEC9FECA0ED40ED41BECFED42ED43F7B7ED44ED45ED46ED47ED48ED49ED4AF7B6ED4BB1DEED4CF7B5ED4DED4EF7B8ED4FF7B9ED50ED51ED52ED53ED54ED55ED56ED57ED58ED59ED5AED5BED5CED5DED5EED5FED60ED61ED62ED63ED64ED65ED66ED67ED68ED69ED6AED6BED6CED6DED6EED6FED70ED71ED72ED73ED74ED75ED76ED77ED78ED79ED7AED7BED7CED7DED7EED80ED81CEA4C8CDED82BAABE8B8E8B9E8BABEC2ED83ED84ED85ED86ED87D2F4ED88D4CFC9D8ED89ED8AED8BED8CED8DED8EED8FED90ED91ED92ED93ED94ED95ED96ED97ED98ED99ED9AED9BED9CED9DED9EED9FEDA0EE40EE41EE42EE43EE44EE45EE46EE47EE48EE49EE4AEE4BEE4CEE4DEE4EEE4FEE50EE51EE52EE53EE54EE55EE56EE57EE58EE59EE5AEE5BEE5CEE5DEE5EEE5FEE60EE61EE62EE63EE64EE65EE66EE67EE68EE69EE6AEE6BEE6CEE6DEE6EEE6FEE70EE71EE72EE73EE74EE75EE76EE77EE78EE79EE7AEE7BEE7CEE7DEE7EEE80EE81EE82EE83EE84EE85EE86EE87EE88EE89EE8AEE8BEE8CEE8DEE8EEE8FEE90EE91EE92EE93EE94EE95EE96EE97EE98EE99EE9AEE9BEE9CEE9DEE9EEE9FEEA0EF40EF41EF42EF43EF44EF45D2B3B6A5C7EAF1FCCFEECBB3D0EBE7EFCDE7B9CBB6D9F1FDB0E4CBCCF1FED4A4C2ADC1ECC6C4BEB1F2A1BCD5EF46F2A2F2A3EF47F2A4D2C3C6B5EF48CDC7F2A5EF49D3B1BFC5CCE2EF4AF2A6F2A7D1D5B6EEF2A8F2A9B5DFF2AAF2ABEF4BB2FCF2ACF2ADC8A7EF4CEF4DEF4EEF4FEF50EF51EF52EF53EF54EF55EF56EF57EF58EF59EF5AEF5BEF5CEF5DEF5EEF5FEF60EF61EF62EF63EF64EF65EF66EF67EF68EF69EF6AEF6BEF6CEF6DEF6EEF6FEF70EF71B7E7EF72EF73ECA9ECAAECABEF74ECACEF75EF76C6AEECADECAEEF77EF78EF79B7C9CAB3EF7AEF7BEF7CEF7DEF7EEF80EF81E2B8F7CFEF82EF83EF84EF85EF86EF87EF88EF89EF8AEF8BEF8CEF8DEF8EEF8FEF90EF91EF92EF93EF94EF95EF96EF97EF98EF99EF9AEF9BEF9CEF9DEF9EEF9FEFA0F040F041F042F043F044F7D0F045F046B2CDF047F048F049F04AF04BF04CF04DF04EF04FF050F051F052F053F054F055F056F057F058F059F05AF05BF05CF05DF05EF05FF060F061F062F063F7D1F064F065F066F067F068F069F06AF06BF06CF06DF06EF06FF070F071F072F073F074F075F076F077F078F079F07AF07BF07CF07DF07EF080F081F082F083F084F085F086F087F088F089F7D3F7D2F08AF08BF08CF08DF08EF08FF090F091F092F093F094F095F096E2BBF097BCA2F098E2BCE2BDE2BEE2BFE2C0E2C1B7B9D2FBBDA4CACEB1A5CBC7F099E2C2B6FCC8C4E2C3F09AF09BBDC8F09CB1FDE2C4F09DB6F6E2C5C4D9F09EF09FE2C6CFDAB9DDE2C7C0A1F0A0E2C8B2F6F140E2C9F141C1F3E2CAE2CBC2F8E2CCE2CDE2CECAD7D8B8D9E5CFE3F142F143F144F145F146F147F148F149F14AF14BF14CF0A5F14DF14EDCB0F14FF150F151F152F153F154F155F156F157F158F159F15AF15BF15CF15DF15EF15FF160F161F162F163F164F165F166F167F168F169F16AF16BF16CF16DF16EF16FF170F171F172F173F174F175F176F177F178F179F17AF17BF17CF17DF17EF180F181F182F183F184F185F186F187F188F189F18AF18BF18CF18DF18EF18FF190F191F192F193F194F195F196F197F198F199F19AF19BF19CF19DF19EF19FF1A0F240F241F242F243F244F245F246F247F248F249F24AF24BF24CF24DF24EF24FF250F251F252F253F254F255F256F257F258F259F25AF25BF25CF25DF25EF25FF260F261F262F263F264F265F266F267F268F269F26AF26BF26CF26DF26EF26FF270F271F272F273F274F275F276F277F278F279F27AF27BF27CF27DF27EF280F281F282F283F284F285F286F287F288F289F28AF28BF28CF28DF28EF28FF290F291F292F293F294F295F296F297F298F299F29AF29BF29CF29DF29EF29FF2A0F340F341F342F343F344F345F346F347F348F349F34AF34BF34CF34DF34EF34FF350F351C2EDD4A6CDD4D1B1B3DBC7FDF352B2B5C2BFE6E0CABBE6E1E6E2BED4E6E3D7A4CDD5E6E5BCDDE6E4E6E6E6E7C2EEF353BDBEE6E8C2E6BAA7E6E9F354E6EAB3D2D1E9F355F356BFA5E6EBC6EFE6ECE6EDF357F358E6EEC6ADE6EFF359C9A7E6F0E6F1E6F2E5B9E6F3E6F4C2E2E6F5E6F6D6E8E6F7F35AE6F8B9C7F35BF35CF35DF35EF35FF360F361F7BBF7BAF362F363F364F365F7BEF7BCBAA1F366F7BFF367F7C0F368F369F36AF7C2F7C1F7C4F36BF36CF7C3F36DF36EF36FF370F371F7C5F7C6F372F373F374F375F7C7F376CBE8F377F378F379F37AB8DFF37BF37CF37DF37EF380F381F7D4F382F7D5F383F384F385F386F7D6F387F388F389F38AF7D8F38BF7DAF38CF7D7F38DF38EF38FF390F391F392F393F394F395F7DBF396F7D9F397F398F399F39AF39BF39CF39DD7D7F39EF39FF3A0F440F7DCF441F442F443F444F445F446F7DDF447F448F449F7DEF44AF44BF44CF44DF44EF44FF450F451F452F453F454F7DFF455F456F457F7E0F458F459F45AF45BF45CF45DF45EF45FF460F461F462DBCBF463F464D8AAF465F466F467F468F469F46AF46BF46CE5F7B9EDF46DF46EF46FF470BFFDBBEAF7C9C6C7F7C8F471F7CAF7CCF7CBF472F473F474F7CDF475CEBAF476F7CEF477F478C4A7F479F47AF47BF47CF47DF47EF480F481F482F483F484F485F486F487F488F489F48AF48BF48CF48DF48EF48FF490F491F492F493F494F495F496F497F498F499F49AF49BF49CF49DF49EF49FF4A0F540F541F542F543F544F545F546F547F548F549F54AF54BF54CF54DF54EF54FF550F551F552F553F554F555F556F557F558F559F55AF55BF55CF55DF55EF55FF560F561F562F563F564F565F566F567F568F569F56AF56BF56CF56DF56EF56FF570F571F572F573F574F575F576F577F578F579F57AF57BF57CF57DF57EF580F581F582F583F584F585F586F587F588F589F58AF58BF58CF58DF58EF58FF590F591F592F593F594F595F596F597F598F599F59AF59BF59CF59DF59EF59FF5A0F640F641F642F643F644F645F646F647F648F649F64AF64BF64CF64DF64EF64FF650F651F652F653F654F655F656F657F658F659F65AF65BF65CF65DF65EF65FF660F661F662F663F664F665F666F667F668F669F66AF66BF66CF66DF66EF66FF670F671F672F673F674F675F676F677F678F679F67AF67BF67CF67DF67EF680F681F682F683F684F685F686F687F688F689F68AF68BF68CF68DF68EF68FF690F691F692F693F694F695F696F697F698F699F69AF69BF69CF69DF69EF69FF6A0F740F741F742F743F744F745F746F747F748F749F74AF74BF74CF74DF74EF74FF750F751F752F753F754F755F756F757F758F759F75AF75BF75CF75DF75EF75FF760F761F762F763F764F765F766F767F768F769F76AF76BF76CF76DF76EF76FF770F771F772F773F774F775F776F777F778F779F77AF77BF77CF77DF77EF780D3E3F781F782F6CFF783C2B3F6D0F784F785F6D1F6D2F6D3F6D4F786F787F6D6F788B1ABF6D7F789F6D8F6D9F6DAF78AF6DBF6DCF78BF78CF78DF78EF6DDF6DECFCAF78FF6DFF6E0F6E1F6E2F6E3F6E4C0F0F6E5F6E6F6E7F6E8F6E9F790F6EAF791F6EBF6ECF792F6EDF6EEF6EFF6F0F6F1F6F2F6F3F6F4BEA8F793F6F5F6F6F6F7F6F8F794F795F796F797F798C8FAF6F9F6FAF6FBF6FCF799F79AF6FDF6FEF7A1F7A2F7A3F7A4F7A5F79BF79CF7A6F7A7F7A8B1EEF7A9F7AAF7ABF79DF79EF7ACF7ADC1DBF7AEF79FF7A0F7AFF840F841F842F843F844F845F846F847F848F849F84AF84BF84CF84DF84EF84FF850F851F852F853F854F855F856F857F858F859F85AF85BF85CF85DF85EF85FF860F861F862F863F864F865F866F867F868F869F86AF86BF86CF86DF86EF86FF870F871F872F873F874F875F876F877F878F879F87AF87BF87CF87DF87EF880F881F882F883F884F885F886F887F888F889F88AF88BF88CF88DF88EF88FF890F891F892F893F894F895F896F897F898F899F89AF89BF89CF89DF89EF89FF8A0F940F941F942F943F944F945F946F947F948F949F94AF94BF94CF94DF94EF94FF950F951F952F953F954F955F956F957F958F959F95AF95BF95CF95DF95EF95FF960F961F962F963F964F965F966F967F968F969F96AF96BF96CF96DF96EF96FF970F971F972F973F974F975F976F977F978F979F97AF97BF97CF97DF97EF980F981F982F983F984F985F986F987F988F989F98AF98BF98CF98DF98EF98FF990F991F992F993F994F995F996F997F998F999F99AF99BF99CF99DF99EF99FF9A0FA40FA41FA42FA43FA44FA45FA46FA47FA48FA49FA4AFA4BFA4CFA4DFA4EFA4FFA50FA51FA52FA53FA54FA55FA56FA57FA58FA59FA5AFA5BFA5CFA5DFA5EFA5FFA60FA61FA62FA63FA64FA65FA66FA67FA68FA69FA6AFA6BFA6CFA6DFA6EFA6FFA70FA71FA72FA73FA74FA75FA76FA77FA78FA79FA7AFA7BFA7CFA7DFA7EFA80FA81FA82FA83FA84FA85FA86FA87FA88FA89FA8AFA8BFA8CFA8DFA8EFA8FFA90FA91FA92FA93FA94FA95FA96FA97FA98FA99FA9AFA9BFA9CFA9DFA9EFA9FFAA0FB40FB41FB42FB43FB44FB45FB46FB47FB48FB49FB4AFB4BFB4CFB4DFB4EFB4FFB50FB51FB52FB53FB54FB55FB56FB57FB58FB59FB5AFB5BC4F1F0AFBCA6F0B0C3F9FB5CC5B8D1BBFB5DF0B1F0B2F0B3F0B4F0B5D1BCFB5ED1ECFB5FF0B7F0B6D4A7FB60CDD2F0B8F0BAF0B9F0BBF0BCFB61FB62B8EBF0BDBAE8FB63F0BEF0BFBEE9F0C0B6ECF0C1F0C2F0C3F0C4C8B5F0C5F0C6FB64F0C7C5F4FB65F0C8FB66FB67FB68F0C9FB69F0CAF7BDFB6AF0CBF0CCF0CDFB6BF0CEFB6CFB6DFB6EFB6FF0CFBAD7FB70F0D0F0D1F0D2F0D3F0D4F0D5F0D6F0D8FB71FB72D3A5F0D7FB73F0D9FB74FB75FB76FB77FB78FB79FB7AFB7BFB7CFB7DF5BAC2B9FB7EFB80F7E4FB81FB82FB83FB84F7E5F7E6FB85FB86F7E7FB87FB88FB89FB8AFB8BFB8CF7E8C2B4FB8DFB8EFB8FFB90FB91FB92FB93FB94FB95F7EAFB96F7EBFB97FB98FB99FB9AFB9BFB9CC2F3FB9DFB9EFB9FFBA0FC40FC41FC42FC43FC44FC45FC46FC47FC48F4F0FC49FC4AFC4BF4EFFC4CFC4DC2E9FC4EF7E1F7E2FC4FFC50FC51FC52FC53BBC6FC54FC55FC56FC57D9E4FC58FC59FC5ACAF2C0E8F0A4FC5BBADAFC5CFC5DC7ADFC5EFC5FFC60C4ACFC61FC62F7ECF7EDF7EEFC63F7F0F7EFFC64F7F1FC65FC66F7F4FC67F7F3FC68F7F2F7F5FC69FC6AFC6BFC6CF7F6FC6DFC6EFC6FFC70FC71FC72FC73FC74FC75EDE9FC76EDEAEDEBFC77F6BCFC78FC79FC7AFC7BFC7CFC7DFC7EFC80FC81FC82FC83FC84F6BDFC85F6BEB6A6FC86D8BEFC87FC88B9C4FC89FC8AFC8BD8BBFC8CDCB1FC8DFC8EFC8FFC90FC91FC92CAF3FC93F7F7FC94FC95FC96FC97FC98FC99FC9AFC9BFC9CF7F8FC9DFC9EF7F9FC9FFCA0FD40FD41FD42FD43FD44F7FBFD45F7FAFD46B1C7FD47F7FCF7FDFD48FD49FD4AFD4BFD4CF7FEFD4DFD4EFD4FFD50FD51FD52FD53FD54FD55FD56FD57C6EBECB4FD58FD59FD5AFD5BFD5CFD5DFD5EFD5FFD60FD61FD62FD63FD64FD65FD66FD67FD68FD69FD6AFD6BFD6CFD6DFD6EFD6FFD70FD71FD72FD73FD74FD75FD76FD77FD78FD79FD7AFD7BFD7CFD7DFD7EFD80FD81FD82FD83FD84FD85B3DDF6B3FD86FD87F6B4C1E4F6B5F6B6F6B7F6B8F6B9F6BAC8A3F6BBFD88FD89FD8AFD8BFD8CFD8DFD8EFD8FFD90FD91FD92FD93C1FAB9A8EDE8FD94FD95FD96B9EAD9DFFD97FD98FD99FD9AFD9';

            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i),
                    code = str.charCodeAt(i);
                if (c == " ") strOut += "+";
                else if (code >= 19968 && code <= 40869) {
                    var index = code - 19968;
                    strOut += "%" + z.substr(index * 4, 2) + "%" + z.substr(index * 4 + 2, 2);
                } else {
                    strOut += "%" + str.charCodeAt(i).toString(16);
                }
            }
            return strOut;
        },
        /* 改变图片大小 */
        scale: function (img, w, h) {
            var ow = img.width,
                oh = img.height;

            if (ow >= oh) {
                img.width = w * ow / oh;
                img.height = h;
                img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
            } else {
                img.width = w;
                img.height = h * oh / ow;
                img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
            }
        },
        getImageData: function(){
            var _this = this,
                key = $G('searchTxt').value,
                type = $G('searchType').value,
                keepOriginName = editor.options.keepOriginName ? "1" : "0",
                url = "http://image.baidu.com/i?ct=201326592&cl=2&lm=-1&st=-1&tn=baiduimagejson&istype=2&rn=32&fm=index&pv=&word=" + _this.encodeToGb2312(key) + type + "&keeporiginname=" + keepOriginName + "&" + +new Date;

            $G('searchListUl').innerHTML = lang.searchLoading;
            ajax.request(url, {
                'dataType': 'jsonp',
                'charset': 'GB18030',
                'onsuccess':function(json){
                    var list = [];
                    if(json && json.data) {
                        for(var i = 0; i < json.data.length; i++) {
                            if(json.data[i].objURL) {
                                list.push({
                                    title: json.data[i].fromPageTitleEnc,
                                    src: json.data[i].objURL,
                                    url: json.data[i].fromURL
                                });
                            }
                        }
                    }
                    _this.setList(list);
                },
                'onerror':function(){
                    $G('searchListUl').innerHTML = lang.searchRetry;
                }
            });
        },
        /* 添加图片到列表界面上 */
        setList: function (list) {
            var i, item, p, img, link, _this = this,
                listUl = $G('searchListUl');

            listUl.innerHTML = '';
            if(list.length) {
                for (i = 0; i < list.length; i++) {
                    item = document.createElement('li');
                    p = document.createElement('p');
                    img = document.createElement('img');
                    link = document.createElement('a');

                    img.onload = function () {
                        _this.scale(this, 113, 113);
                    };
                    img.width = 113;
                    img.setAttribute('src', list[i].src);

                    link.href = list[i].url;
                    link.target = '_blank';
                    link.title = list[i].title;
                    link.innerHTML = list[i].title;

                    p.appendChild(img);
                    item.appendChild(p);
                    item.appendChild(link);
                    listUl.appendChild(item);
                }
            } else {
                listUl.innerHTML = lang.searchRetry;
            }
        },
        getInsertList: function () {
            var child,
                src,
                align = getAlign(),
                list = [],
                items = $G('searchListUl').children;
            for(var i = 0; i < items.length; i++) {
                child = items[i].firstChild && items[i].firstChild.firstChild;
                if(child.tagName && child.tagName.toLowerCase() == 'img' && domUtils.hasClass(items[i], 'selected')) {
                    src = child.src;
                    list.push({
                        src: src,
                        _src: src,
                        alt: src.substr(src.lastIndexOf('/') + 1),
                        floatStyle: align
                    });
                }
            }
            return list;
        }
    };

})();
