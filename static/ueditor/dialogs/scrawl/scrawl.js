/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-5-22
 * Time: 上午11:38
 * To change this template use File | Settings | File Templates.
 */
var scrawl = function (options) {
    options && this.initOptions(options);
};
(function () {
    var canvas = $G("J_brushBoard"),
        context = canvas.getContext('2d'),
        drawStep = [], //undo redo存储
        drawStepIndex = 0; //undo redo指针

    scrawl.prototype = {
        isScrawl:false, //是否涂鸦
        brushWidth:-1, //画笔粗细
        brushColor:"", //画笔颜色

        initOptions:function (options) {
            var me = this;
            me.originalState(options);//初始页面状态
            me._buildToolbarColor(options.colorList);//动态生成颜色选择集合

            me._addBoardListener(options.saveNum);//添加画板处理
            me._addOPerateListener(options.saveNum);//添加undo redo clearBoard处理
            me._addColorBarListener();//添加颜色选择处理
            me._addBrushBarListener();//添加画笔大小处理
            me._addEraserBarListener();//添加橡皮大小处理
            me._addAddImgListener();//添加增添背景图片处理
            me._addRemoveImgListenter();//删除背景图片处理
            me._addScalePicListenter();//添加缩放处理
            me._addClearSelectionListenter();//添加清楚选中状态处理

            me._originalColorSelect(options.drawBrushColor);//初始化颜色选中
            me._originalBrushSelect(options.drawBrushSize);//初始化画笔选中
            me._clearSelection();//清楚选中状态
        },

        originalState:function (options) {
            var me = this;

            me.brushWidth = options.drawBrushSize;//同步画笔粗细
            me.brushColor = options.drawBrushColor;//同步画笔颜色

            context.lineWidth = me.brushWidth;//初始画笔大小
            context.strokeStyle = me.brushColor;//初始画笔颜色
            context.fillStyle = "transparent";//初始画布背景颜色
            context.lineCap = "round";//去除锯齿
            context.fill();
        },
        _buildToolbarColor:function (colorList) {
            var tmp = null, arr = [];
            arr.push("<table id='J_colorList'>");
            for (var i = 0, color; color = colorList[i++];) {
                if ((i - 1) % 5 == 0) {
                    if (i != 1) {
                        arr.push("</tr>");
                    }
                    arr.push("<tr>");
                }
                tmp = '#' + color;
                arr.push("<td><a title='" + tmp + "' href='javascript:void(0)' style='background-color:" + tmp + "'></a></td>");
            }
            arr.push("</tr></table>");
            $G("J_colorBar").innerHTML = arr.join("");
        },

        _addBoardListener:function (saveNum) {
            var me = this,
                margin = 0,
                startX = -1,
                startY = -1,
                isMouseDown = false,
                isMouseMove = false,
                isMouseUp = false,
                buttonPress = 0, button, flag = '';

            margin = parseInt(domUtils.getComputedStyle($G("J_wrap"), "margin-left"));
            drawStep.push(context.getImageData(0, 0, context.canvas.width, context.canvas.height));
            drawStepIndex += 1;

            domUtils.on(canvas, ["mousedown", "mousemove", "mouseup", "mouseout"], function (e) {
                button = browser.webkit ? e.which : buttonPress;
                switch (e.type) {
                    case 'mousedown':
                        buttonPress = 1;
                        flag = 1;
                        isMouseDown = true;
                        isMouseUp = false;
                        isMouseMove = false;
                        me.isScrawl = true;
                        startX = e.clientX - margin;//10为外边距总和
                        startY = e.clientY - margin;
                        context.beginPath();
                        break;
                    case 'mousemove' :
                        if (!flag && button == 0) {
                            return;
                        }
                        if (!flag && button) {
                            startX = e.clientX - margin;//10为外边距总和
                            startY = e.clientY - margin;
                            context.beginPath();
                            flag = 1;
                        }
                        if (isMouseUp || !isMouseDown) {
                            return;
                        }
                        var endX = e.clientX - margin,
                            endY = e.clientY - margin;

                        context.moveTo(startX, startY);
                        context.lineTo(endX, endY);
                        context.stroke();
                        startX = endX;
                        startY = endY;
                        isMouseMove = true;
                        break;
                    case 'mouseup':
                        buttonPress = 0;
                        if (!isMouseDown)return;
                        if (!isMouseMove) {
                            context.arc(startX, startY, context.lineWidth, 0, Math.PI * 2, false);
                            context.fillStyle = context.strokeStyle;
                            context.fill();
                        }
                        context.closePath();
                        me._saveOPerate(saveNum);
                        isMouseDown = false;
                        isMouseMove = false;
                        isMouseUp = true;
                        startX = -1;
                        startY = -1;
                        break;
                    case 'mouseout':
                        flag = '';
                        buttonPress = 0;
                        if (button == 1) return;
                        context.closePath();
                        break;
                }
            });
        },
        _addOPerateListener:function (saveNum) {
            var me = this;
            domUtils.on($G("J_previousStep"), "click", function () {
                if (drawStepIndex > 1) {
                    drawStepIndex -= 1;
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    context.putImageData(drawStep[drawStepIndex - 1], 0, 0);
                    me.btn2Highlight("J_nextStep");
                    drawStepIndex == 1 && me.btn2disable("J_previousStep");
                }
            });
            domUtils.on($G("J_nextStep"), "click", function () {
                if (drawStepIndex > 0 && drawStepIndex < drawStep.length) {
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    context.putImageData(drawStep[drawStepIndex], 0, 0);
                    drawStepIndex += 1;
                    me.btn2Highlight("J_previousStep");
                    drawStepIndex == drawStep.length && me.btn2disable("J_nextStep");
                }
            });
            domUtils.on($G("J_clearBoard"), "click", function () {
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                drawStep = [];
                me._saveOPerate(saveNum);
                drawStepIndex = 1;
                me.isScrawl = false;
                me.btn2disable("J_previousStep");
                me.btn2disable("J_nextStep");
                me.btn2disable("J_clearBoard");
            });
        },
        _addColorBarListener:function () {
            var me = this;
            domUtils.on($G("J_colorBar"), "click", function (e) {
                var target = me.getTarget(e),
                    color = target.title;
                if (!!color) {
                    me._addColorSelect(target);

                    me.brushColor = color;
                    context.globalCompositeOperation = "source-over";
                    context.lineWidth = me.brushWidth;
                    context.strokeStyle = color;
                }
            });
        },
        _addBrushBarListener:function () {
            var me = this;
            domUtils.on($G("J_brushBar"), "click", function (e) {
                var target = me.getTarget(e),
                    size = browser.ie ? target.innerText : target.text;
                if (!!size) {
                    me._addBESelect(target);

                    context.globalCompositeOperation = "source-over";
                    context.lineWidth = parseInt(size);
                    context.strokeStyle = me.brushColor;
                    me.brushWidth = context.lineWidth;
                }
            });
        },
        _addEraserBarListener:function () {
            var me = this;
            domUtils.on($G("J_eraserBar"), "click", function (e) {
                var target = me.getTarget(e),
                    size = browser.ie ? target.innerText : target.text;
                if (!!size) {
                    me._addBESelect(target);

                    context.lineWidth = parseInt(size);
                    context.globalCompositeOperation = "destination-out";
                    context.strokeStyle = "#FFF";
                }
            });
        },
        _addAddImgListener:function () {
            var file = $G("J_imgTxt");
            if (!window.FileReader) {
                $G("J_addImg").style.display = 'none';
                $G("J_removeImg").style.display = 'none';
                $G("J_sacleBoard").style.display = 'none';
            }
            domUtils.on(file, "change", function (e) {
                var frm = file.parentNode;
                addMaskLayer(lang.backgroundUploading);

                var target = e.target || e.srcElement,
                    reader = new FileReader();
                reader.onload = function(evt){
                    var target = evt.target || evt.srcElement;
                    ue_callback(target.result, 'SUCCESS');
                };
                reader.readAsDataURL(target.files[0]);
                frm.reset();
            });
        },
        _addRemoveImgListenter:function () {
            var me = this;
            domUtils.on($G("J_removeImg"), "click", function () {
                $G("J_picBoard").innerHTML = "";
                me.btn2disable("J_removeImg");
                me.btn2disable("J_sacleBoard");
            });
        },
        _addScalePicListenter:function () {
            domUtils.on($G("J_sacleBoard"), "click", function () {
                var picBoard = $G("J_picBoard"),
                    scaleCon = $G("J_scaleCon"),
                    img = picBoard.children[0];

                if (img) {
                    if (!scaleCon) {
                        picBoard.style.cssText = "position:relative;z-index:999;"+picBoard.style.cssText;
                        img.style.cssText = "position: absolute;top:" + (canvas.height - img.height) / 2 + "px;left:" + (canvas.width - img.width) / 2 + "px;";
                        var scale = new ScaleBoy();
                        picBoard.appendChild(scale.init());
                        scale.startScale(img);
                    } else {
                        if (scaleCon.style.visibility == "visible") {
                            scaleCon.style.visibility = "hidden";
                            picBoard.style.position = "";
                            picBoard.style.zIndex = "";
                        } else {
                            scaleCon.style.visibility = "visible";
                            picBoard.style.cssText += "position:relative;z-index:999";
                        }
                    }
                }
            });
        },
        _addClearSelectionListenter:function () {
            var doc = document;
            domUtils.on(doc, 'mousemove', function (e) {
                if (browser.ie && browser.version < 11)
                    doc.selection.clear();
                else
                    window.getSelection().removeAllRanges();
            });
        },
        _clearSelection:function () {
            var list = ["J_operateBar", "J_colorBar", "J_brushBar", "J_eraserBar", "J_picBoard"];
            for (var i = 0, group; group = list[i++];) {
                domUtils.unSelectable($G(group));
            }
        },

        _saveOPerate:function (saveNum) {
            var me = this;
            if (drawStep.length <= saveNum) {
                if(drawStepIndex<drawStep.length){
                    me.btn2disable("J_nextStep");
                    drawStep.splice(drawStepIndex);
                }
                drawStep.push(context.getImageData(0, 0, context.canvas.width, context.canvas.height));
                drawStepIndex = drawStep.length;
            } else {
                drawStep.shift();
                drawStep.push(context.getImageData(0, 0, context.canvas.width, context.canvas.height));
                drawStepIndex = drawStep.length;
            }
            me.btn2Highlight("J_previousStep");
            me.btn2Highlight("J_clearBoard");
        },

        _originalColorSelect:function (title) {
            var colorList = $G("J_colorList").getElementsByTagName("td");
            for (var j = 0, cell; cell = colorList[j++];) {
                if (cell.children[0].title.toLowerCase() == title) {
                    cell.children[0].style.opacity = 1;
                }
            }
        },
        _originalBrushSelect:function (text) {
            var brushList = $G("J_brushBar").children;
            for (var i = 0, ele; ele = brushList[i++];) {
                if (ele.tagName.toLowerCase() == "a") {
                    var size = browser.ie ? ele.innerText : ele.text;
                    if (size.toLowerCase() == text) {
                        ele.style.opacity = 1;
                    }
                }
            }
        },
        _addColorSelect:function (target) {
            var me = this,
                colorList = $G("J_colorList").getElementsByTagName("td"),
                eraserList = $G("J_eraserBar").children,
                brushList = $G("J_brushBar").children;

            for (var i = 0, cell; cell = colorList[i++];) {
                cell.children[0].style.opacity = 0.3;
            }
            for (var k = 0, ele; ele = brushList[k++];) {
                if (ele.tagName.toLowerCase() == "a") {
                    ele.style.opacity = 0.3;
                    var size = browser.ie ? ele.innerText : ele.text;
                    if (size.toLowerCase() == this.brushWidth) {
                        ele.style.opacity = 1;
                    }
                }
            }
            for (var j = 0, node; node = eraserList[j++];) {
                if (node.tagName.toLowerCase() == "a") {
                    node.style.opacity = 0.3;
                }
            }

            target.style.opacity = 1;
            target.blur();
        },
        _addBESelect:function (target) {
            var brushList = $G("J_brushBar").children;
            var eraserList = $G("J_eraserBar").children;

            for (var i = 0, ele; ele = brushList[i++];) {
                if (ele.tagName.toLowerCase() == "a") {
                    ele.style.opacity = 0.3;
                }
            }
            for (var j = 0, node; node = eraserList[j++];) {
                if (node.tagName.toLowerCase() == "a") {
                    node.style.opacity = 0.3;
                }
            }

            target.style.opacity = 1;
            target.blur();
        },
        getCanvasData:function () {
            var picContainer = $G("J_picBoard"),
                img = picContainer.children[0];
            if (img) {
                var x, y;
                if (img.style.position == "absolute") {
                    x = parseInt(img.style.left);
                    y = parseInt(img.style.top);
                } else {
                    x = (picContainer.offsetWidth - img.width) / 2;
                    y = (picContainer.offsetHeight - img.height) / 2;
                }
                context.globalCompositeOperation = "destination-over";
                context.drawImage(img, x, y, img.width, img.height);
            } else {
                context.globalCompositeOperation = "destination-atop";
                context.fillStyle = "#fff";//重置画布背景白色
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            try {
                return canvas.toDataURL("image/png").substring(22);
            } catch (e) {
                return "";
            }
        },
        btn2Highlight:function (id) {
            var cur = $G(id);
            cur.className.indexOf("H") == -1 && (cur.className += "H");
        },
        btn2disable:function (id) {
            var cur = $G(id);
            cur.className.indexOf("H") != -1 && (cur.className = cur.className.replace("H", ""));
        },
        getTarget:function (evt) {
            return evt.target || evt.srcElement;
        }
    };
})();

var ScaleBoy = function () {
    this.dom = null;
    this.scalingElement = null;
};
(function () {
    function _appendStyle() {
        var doc = document,
            head = doc.getElementsByTagName('head')[0],
            style = doc.createElement('style'),
            cssText = '.scale{visibility:hidden;cursor:move;position:absolute;left:0;top:0;width:100px;height:50px;background-color:#fff;font-size:0;line-height:0;opacity:.4;filter:Alpha(opacity=40);}'
                + '.scale span{position:absolute;left:0;top:0;width:6px;height:6px;background-color:#006DAE;}'
                + '.scale .hand0, .scale .hand7{cursor:nw-resize;}'
                + '.scale .hand1, .scale .hand6{left:50%;margin-left:-3px;cursor:n-resize;}'
                + '.scale .hand2, .scale .hand4, .scale .hand7{left:100%;margin-left:-6px;}'
                + '.scale .hand3, .scale .hand4{top:50%;margin-top:-3px;cursor:w-resize;}'
                + '.scale .hand5, .scale .hand6, .scale .hand7{margin-top:-6px;top:100%;}'
                + '.scale .hand2, .scale .hand5{cursor:ne-resize;}';
        style.type = 'text/css';

        try {
            style.appendChild(doc.createTextNode(cssText));
        } catch (e) {
            style.styleSheet.cssText = cssText;
        }
        head.appendChild(style);
    }

    function _getDom() {
        var doc = document,
            hand,
            arr = [],
            scale = doc.createElement('div');

        scale.id = 'J_scaleCon';
        scale.className = 'scale';
        for (var i = 0; i < 8; i++) {
            arr.push("<span class='hand" + i + "'></span>");
        }
        scale.innerHTML = arr.join("");
        return scale;
    }

    var rect = [
        //[left, top, width, height]
        [1, 1, -1, -1],
        [0, 1, 0, -1],
        [0, 1, 1, -1],
        [1, 0, -1, 0],
        [0, 0, 1, 0],
        [1, 0, -1, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 1]
    ];
    ScaleBoy.prototype = {
        init:function () {
            _appendStyle();
            var me = this,
                scale = me.dom = _getDom();

            me.scaleMousemove.fp = me;
            domUtils.on(scale, 'mousedown', function (e) {
                var target = e.target || e.srcElement;
                me.start = {x:e.clientX, y:e.clientY};
                if (target.className.indexOf('hand') != -1) {
                    me.dir = target.className.replace('hand', '');
                }
                domUtils.on(document.body, 'mousemove', me.scaleMousemove);
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            });
            domUtils.on(document.body, 'mouseup', function (e) {
                if (me.start) {
                    domUtils.un(document.body, 'mousemove', me.scaleMousemove);
                    if (me.moved) {
                        me.updateScaledElement({position:{x:scale.style.left, y:scale.style.top}, size:{w:scale.style.width, h:scale.style.height}});
                    }
                    delete me.start;
                    delete me.moved;
                    delete me.dir;
                }
            });
            return scale;
        },
        startScale:function (objElement) {
            var me = this, Idom = me.dom;

            Idom.style.cssText = 'visibility:visible;top:' + objElement.style.top + ';left:' + objElement.style.left + ';width:' + objElement.offsetWidth + 'px;height:' + objElement.offsetHeight + 'px;';
            me.scalingElement = objElement;
        },
        updateScaledElement:function (objStyle) {
            var cur = this.scalingElement,
                pos = objStyle.position,
                size = objStyle.size;
            if (pos) {
                typeof pos.x != 'undefined' && (cur.style.left = pos.x);
                typeof pos.y != 'undefined' && (cur.style.top = pos.y);
            }
            if (size) {
                size.w && (cur.style.width = size.w);
                size.h && (cur.style.height = size.h);
            }
        },
        updateStyleByDir:function (dir, offset) {
            var me = this,
                dom = me.dom, tmp;

            rect['def'] = [1, 1, 0, 0];
            if (rect[dir][0] != 0) {
                tmp = parseInt(dom.style.left) + offset.x;
                dom.style.left = me._validScaledProp('left', tmp) + 'px';
            }
            if (rect[dir][1] != 0) {
                tmp = parseInt(dom.style.top) + offset.y;
                dom.style.top = me._validScaledProp('top', tmp) + 'px';
            }
            if (rect[dir][2] != 0) {
                tmp = dom.clientWidth + rect[dir][2] * offset.x;
                dom.style.width = me._validScaledProp('width', tmp) + 'px';
            }
            if (rect[dir][3] != 0) {
                tmp = dom.clientHeight + rect[dir][3] * offset.y;
                dom.style.height = me._validScaledProp('height', tmp) + 'px';
            }
            if (dir === 'def') {
                me.updateScaledElement({position:{x:dom.style.left, y:dom.style.top}});
            }
        },
        scaleMousemove:function (e) {
            var me = arguments.callee.fp,
                start = me.start,
                dir = me.dir || 'def',
                offset = {x:e.clientX - start.x, y:e.clientY - start.y};

            me.updateStyleByDir(dir, offset);
            arguments.callee.fp.start = {x:e.clientX, y:e.clientY};
            arguments.callee.fp.moved = 1;
        },
        _validScaledProp:function (prop, value) {
            var ele = this.dom,
                wrap = $G("J_picBoard");

            value = isNaN(value) ? 0 : value;
            switch (prop) {
                case 'left':
                    return value < 0 ? 0 : (value + ele.clientWidth) > wrap.clientWidth ? wrap.clientWidth - ele.clientWidth : value;
                case 'top':
                    return value < 0 ? 0 : (value + ele.clientHeight) > wrap.clientHeight ? wrap.clientHeight - ele.clientHeight : value;
                case 'width':
                    return value <= 0 ? 1 : (value + ele.offsetLeft) > wrap.clientWidth ? wrap.clientWidth - ele.offsetLeft : value;
                case 'height':
                    return value <= 0 ? 1 : (value + ele.offsetTop) > wrap.clientHeight ? wrap.clientHeight - ele.offsetTop : value;
            }
        }
    };
})();

//后台回调
function ue_callback(url, state) {
    var doc = document,
        picBorard = $G("J_picBoard"),
        img = doc.createElement("img");

    //图片缩放
    function scale(img, max, oWidth, oHeight) {
        var width = 0, height = 0, percent, ow = img.width || oWidth, oh = img.height || oHeight;
        if (ow > max || oh > max) {
            if (ow >= oh) {
                if (width = ow - max) {
                    percent = (width / ow).toFixed(2);
                    img.height = oh - oh * percent;
                    img.width = max;
                }
            } else {
                if (height = oh - max) {
                    percent = (height / oh).toFixed(2);
                    img.width = ow - ow * percent;
                    img.height = max;
                }
            }
        }
    }

    //移除遮罩层
    removeMaskLayer();
    //状态响应
    if (state == "SUCCESS") {
        picBorard.innerHTML = "";
        img.onload = function () {
            scale(this, 300);
            picBorard.appendChild(img);

            var obj = new scrawl();
            obj.btn2Highlight("J_removeImg");
            //trace 2457
            obj.btn2Highlight("J_sacleBoard");
        };
        img.src = url;
    } else {
        alert(state);
    }
}
//去掉遮罩层
function removeMaskLayer() {
    var maskLayer = $G("J_maskLayer");
    maskLayer.className = "maskLayerNull";
    maskLayer.innerHTML = "";
    dialog.buttons[0].setDisabled(false);
}
//添加遮罩层
function addMaskLayer(html) {
    var maskLayer = $G("J_maskLayer");
    dialog.buttons[0].setDisabled(true);
    maskLayer.className = "maskLayer";
    maskLayer.innerHTML = html;
}
//执行确认按钮方法
function exec(scrawlObj) {
    if (scrawlObj.isScrawl) {
        addMaskLayer(lang.scrawlUpLoading);
        var base64 = scrawlObj.getCanvasData();
        if (!!base64) {
            var options = {
                timeout:100000,
                onsuccess:function (xhr) {
                    if (!scrawlObj.isCancelScrawl) {
                        var responseObj;
                        responseObj = eval("(" + xhr.responseText + ")");
                        if (responseObj.state == "SUCCESS") {
                            var imgObj = {},
                                url = editor.options.scrawlUrlPrefix + responseObj.url;
                            imgObj.src = url;
                            imgObj._src = url;
                            imgObj.alt = responseObj.original || '';
                            imgObj.title = responseObj.title || '';
                            editor.execCommand("insertImage", imgObj);
                            dialog.close();
                        } else {
                            alert(responseObj.state);
                        }

                    }
                },
                onerror:function () {
                    alert(lang.imageError);
                    dialog.close();
                }
            };
            options[editor.getOpt('scrawlFieldName')] = base64;

            var actionUrl = editor.getActionUrl(editor.getOpt('scrawlActionName')),
                params = utils.serializeParam(editor.queryCommandValue('serverparam')) || '',
                url = utils.formatUrl(actionUrl + (actionUrl.indexOf('?') == -1 ? '?':'&') + params);
            ajax.request(url, options);
        }
    } else {
        addMaskLayer(lang.noScarwl + "&nbsp;&nbsp;&nbsp;<input type='button' value='" + lang.continueBtn + "'  onclick='removeMaskLayer()'/>");
    }
}

