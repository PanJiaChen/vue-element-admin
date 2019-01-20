// CodeMirror version 2.2
//
// All functions that need access to the editor's state live inside
// the CodeMirror function. Below that, at the bottom of the file,
// some utilities are defined.

// CodeMirror is the only global var we claim
var CodeMirror = (function() {
    // This is the function that produces an editor instance. It's
    // closure is used to store the editor state.
    function CodeMirror(place, givenOptions) {
        // Determine effective options based on given values and defaults.
        var options = {}, defaults = CodeMirror.defaults;
        for (var opt in defaults)
            if (defaults.hasOwnProperty(opt))
                options[opt] = (givenOptions && givenOptions.hasOwnProperty(opt) ? givenOptions : defaults)[opt];

        var targetDocument = options["document"];
        // The element in which the editor lives.
        var wrapper = targetDocument.createElement("div");
        wrapper.className = "CodeMirror" + (options.lineWrapping ? " CodeMirror-wrap" : "");
        // This mess creates the base DOM structure for the editor.
        wrapper.innerHTML =
            '<div style="overflow: hidden; position: relative; width: 3px; height: 0px;">' + // Wraps and hides input textarea
                '<textarea style="position: absolute; padding: 0; width: 1px;" wrap="off" ' +
                'autocorrect="off" autocapitalize="off"></textarea></div>' +
                '<div class="CodeMirror-scroll" tabindex="-1">' +
                '<div style="position: relative">' + // Set to the height of the text, causes scrolling
                '<div style="position: relative">' + // Moved around its parent to cover visible view
                '<div class="CodeMirror-gutter"><div class="CodeMirror-gutter-text"></div></div>' +
                // Provides positioning relative to (visible) text origin
                '<div class="CodeMirror-lines"><div style="position: relative">' +
                '<div style="position: absolute; width: 100%; height: 0; overflow: hidden; visibility: hidden"></div>' +
                '<pre class="CodeMirror-cursor">&#160;</pre>' + // Absolutely positioned blinky cursor
                '<div></div>' + // This DIV contains the actual code
                '</div></div></div></div></div>';
        if (place.appendChild) place.appendChild(wrapper); else place(wrapper);
        // I've never seen more elegant code in my life.
        var inputDiv = wrapper.firstChild, input = inputDiv.firstChild,
            scroller = wrapper.lastChild, code = scroller.firstChild,
            mover = code.firstChild, gutter = mover.firstChild, gutterText = gutter.firstChild,
            lineSpace = gutter.nextSibling.firstChild, measure = lineSpace.firstChild,
            cursor = measure.nextSibling, lineDiv = cursor.nextSibling;
        themeChanged();
        // Needed to hide big blue blinking cursor on Mobile Safari
        if (/AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent)) input.style.width = "0px";
        if (!webkit) lineSpace.draggable = true;
        if (options.tabindex != null) input.tabIndex = options.tabindex;
        if (!options.gutter && !options.lineNumbers) gutter.style.display = "none";

        // Check for problem with IE innerHTML not working when we have a
        // P (or similar) parent node.
        try { stringWidth("x"); }
        catch (e) {
            if (e.message.match(/runtime/i))
                e = new Error("A CodeMirror inside a P-style element does not work in Internet Explorer. (innerHTML bug)");
            throw e;
        }

        // Delayed object wrap timeouts, making sure only one is active. blinker holds an interval.
        var poll = new Delayed(), highlight = new Delayed(), blinker;

        // mode holds a mode API object. doc is the tree of Line objects,
        // work an array of lines that should be parsed, and history the
        // undo history (instance of History constructor).
        var mode, doc = new BranchChunk([new LeafChunk([new Line("")])]), work, focused;
        loadMode();
        // The selection. These are always maintained to point at valid
        // positions. Inverted is used to remember that the user is
        // selecting bottom-to-top.
        var sel = {from: {line: 0, ch: 0}, to: {line: 0, ch: 0}, inverted: false};
        // Selection-related flags. shiftSelecting obviously tracks
        // whether the user is holding shift.
        var shiftSelecting, lastClick, lastDoubleClick, draggingText, overwrite = false;
        // Variables used by startOperation/endOperation to track what
        // happened during the operation.
        var updateInput, userSelChange, changes, textChanged, selectionChanged, leaveInputAlone,
            gutterDirty, callbacks;
        // Current visible range (may be bigger than the view window).
        var displayOffset = 0, showingFrom = 0, showingTo = 0, lastSizeC = 0;
        // bracketHighlighted is used to remember that a backet has been
        // marked.
        var bracketHighlighted;
        // Tracks the maximum line length so that the horizontal scrollbar
        // can be kept static when scrolling.
        var maxLine = "", maxWidth, tabText = computeTabText();

        // Initialize the content.
        operation(function(){setValue(options.value || ""); updateInput = false;})();
        var history = new History();

        // Register our event handlers.
        connect(scroller, "mousedown", operation(onMouseDown));
        connect(scroller, "dblclick", operation(onDoubleClick));
        connect(lineSpace, "dragstart", onDragStart);
        connect(lineSpace, "selectstart", e_preventDefault);
        // Gecko browsers fire contextmenu *after* opening the menu, at
        // which point we can't mess with it anymore. Context menu is
        // handled in onMouseDown for Gecko.
        if (!gecko) connect(scroller, "contextmenu", onContextMenu);
        connect(scroller, "scroll", function() {
            updateDisplay([]);
            if (options.fixedGutter) gutter.style.left = scroller.scrollLeft + "px";
            if (options.onScroll) options.onScroll(instance);
        });
        connect(window, "resize", function() {updateDisplay(true);});
        connect(input, "keyup", operation(onKeyUp));
        connect(input, "input", fastPoll);
        connect(input, "keydown", operation(onKeyDown));
        connect(input, "keypress", operation(onKeyPress));
        connect(input, "focus", onFocus);
        connect(input, "blur", onBlur);

        connect(scroller, "dragenter", e_stop);
        connect(scroller, "dragover", e_stop);
        connect(scroller, "drop", operation(onDrop));
        connect(scroller, "paste", function(){focusInput(); fastPoll();});
        connect(input, "paste", fastPoll);
        connect(input, "cut", operation(function(){replaceSelection("");}));

        // IE throws unspecified error in certain cases, when
        // trying to access activeElement before onload
        var hasFocus; try { hasFocus = (targetDocument.activeElement == input); } catch(e) { }
        if (hasFocus) setTimeout(onFocus, 20);
        else onBlur();

        function isLine(l) {return l >= 0 && l < doc.size;}
        // The instance object that we'll return. Mostly calls out to
        // local functions in the CodeMirror function. Some do some extra
        // range checking and/or clipping. operation is used to wrap the
        // call so that changes it makes are tracked, and the display is
        // updated afterwards.
        var instance = wrapper.CodeMirror = {
            getValue: getValue,
            setValue: operation(setValue),
            getSelection: getSelection,
            replaceSelection: operation(replaceSelection),
            focus: function(){focusInput(); onFocus(); fastPoll();},
            setOption: function(option, value) {
                var oldVal = options[option];
                options[option] = value;
                if (option == "mode" || option == "indentUnit") loadMode();
                else if (option == "readOnly" && value) {onBlur(); input.blur();}
                else if (option == "theme") themeChanged();
                else if (option == "lineWrapping" && oldVal != value) operation(wrappingChanged)();
                else if (option == "tabSize") operation(tabsChanged)();
                if (option == "lineNumbers" || option == "gutter" || option == "firstLineNumber" || option == "theme")
                    operation(gutterChanged)();
            },
            getOption: function(option) {return options[option];},
            undo: operation(undo),
            redo: operation(redo),
            indentLine: operation(function(n, dir) {
                if (isLine(n)) indentLine(n, dir == null ? "smart" : dir ? "add" : "subtract");
            }),
            indentSelection: operation(indentSelected),
            historySize: function() {return {undo: history.done.length, redo: history.undone.length};},
            clearHistory: function() {history = new History();},
            matchBrackets: operation(function(){matchBrackets(true);}),
            getTokenAt: operation(function(pos) {
                pos = clipPos(pos);
                return getLine(pos.line).getTokenAt(mode, getStateBefore(pos.line), pos.ch);
            }),
            getStateAfter: function(line) {
                line = clipLine(line == null ? doc.size - 1: line);
                return getStateBefore(line + 1);
            },
            cursorCoords: function(start){
                if (start == null) start = sel.inverted;
                return pageCoords(start ? sel.from : sel.to);
            },
            charCoords: function(pos){return pageCoords(clipPos(pos));},
            coordsChar: function(coords) {
                var off = eltOffset(lineSpace);
                return coordsChar(coords.x - off.left, coords.y - off.top);
            },
            markText: operation(markText),
            setBookmark: setBookmark,
            setMarker: operation(addGutterMarker),
            clearMarker: operation(removeGutterMarker),
            setLineClass: operation(setLineClass),
            hideLine: operation(function(h) {return setLineHidden(h, true);}),
            showLine: operation(function(h) {return setLineHidden(h, false);}),
            onDeleteLine: function(line, f) {
                if (typeof line == "number") {
                    if (!isLine(line)) return null;
                    line = getLine(line);
                }
                (line.handlers || (line.handlers = [])).push(f);
                return line;
            },
            lineInfo: lineInfo,
            addWidget: function(pos, node, scroll, vert, horiz) {
                pos = localCoords(clipPos(pos));
                var top = pos.yBot, left = pos.x;
                node.style.position = "absolute";
                code.appendChild(node);
                if (vert == "over") top = pos.y;
                else if (vert == "near") {
                    var vspace = Math.max(scroller.offsetHeight, doc.height * textHeight()),
                        hspace = Math.max(code.clientWidth, lineSpace.clientWidth) - paddingLeft();
                    if (pos.yBot + node.offsetHeight > vspace && pos.y > node.offsetHeight)
                        top = pos.y - node.offsetHeight;
                    if (left + node.offsetWidth > hspace)
                        left = hspace - node.offsetWidth;
                }
                node.style.top = (top + paddingTop()) + "px";
                node.style.left = node.style.right = "";
                if (horiz == "right") {
                    left = code.clientWidth - node.offsetWidth;
                    node.style.right = "0px";
                } else {
                    if (horiz == "left") left = 0;
                    else if (horiz == "middle") left = (code.clientWidth - node.offsetWidth) / 2;
                    node.style.left = (left + paddingLeft()) + "px";
                }
                if (scroll)
                    scrollIntoView(left, top, left + node.offsetWidth, top + node.offsetHeight);
            },

            lineCount: function() {return doc.size;},
            clipPos: clipPos,
            getCursor: function(start) {
                if (start == null) start = sel.inverted;
                return copyPos(start ? sel.from : sel.to);
            },
            somethingSelected: function() {return !posEq(sel.from, sel.to);},
            setCursor: operation(function(line, ch, user) {
                if (ch == null && typeof line.line == "number") setCursor(line.line, line.ch, user);
                else setCursor(line, ch, user);
            }),
            setSelection: operation(function(from, to, user) {
                (user ? setSelectionUser : setSelection)(clipPos(from), clipPos(to || from));
            }),
            getLine: function(line) {if (isLine(line)) return getLine(line).text;},
            getLineHandle: function(line) {if (isLine(line)) return getLine(line);},
            setLine: operation(function(line, text) {
                if (isLine(line)) replaceRange(text, {line: line, ch: 0}, {line: line, ch: getLine(line).text.length});
            }),
            removeLine: operation(function(line) {
                if (isLine(line)) replaceRange("", {line: line, ch: 0}, clipPos({line: line+1, ch: 0}));
            }),
            replaceRange: operation(replaceRange),
            getRange: function(from, to) {return getRange(clipPos(from), clipPos(to));},

            execCommand: function(cmd) {return commands[cmd](instance);},
            // Stuff used by commands, probably not much use to outside code.
            moveH: operation(moveH),
            deleteH: operation(deleteH),
            moveV: operation(moveV),
            toggleOverwrite: function() {overwrite = !overwrite;},

            posFromIndex: function(off) {
                var lineNo = 0, ch;
                doc.iter(0, doc.size, function(line) {
                    var sz = line.text.length + 1;
                    if (sz > off) { ch = off; return true; }
                    off -= sz;
                    ++lineNo;
                });
                return clipPos({line: lineNo, ch: ch});
            },
            indexFromPos: function (coords) {
                if (coords.line < 0 || coords.ch < 0) return 0;
                var index = coords.ch;
                doc.iter(0, coords.line, function (line) {
                    index += line.text.length + 1;
                });
                return index;
            },

            operation: function(f){return operation(f)();},
            refresh: function(){updateDisplay(true);},
            getInputField: function(){return input;},
            getWrapperElement: function(){return wrapper;},
            getScrollerElement: function(){return scroller;},
            getGutterElement: function(){return gutter;}
        };

        function getLine(n) { return getLineAt(doc, n); }
        function updateLineHeight(line, height) {
            gutterDirty = true;
            var diff = height - line.height;
            for (var n = line; n; n = n.parent) n.height += diff;
        }

        function setValue(code) {
            var top = {line: 0, ch: 0};
            updateLines(top, {line: doc.size - 1, ch: getLine(doc.size-1).text.length},
                splitLines(code), top, top);
            updateInput = true;
        }
        function getValue(code) {
            var text = [];
            doc.iter(0, doc.size, function(line) { text.push(line.text); });
            return text.join("\n");
        }

        function onMouseDown(e) {
            setShift(e.shiftKey);
            // Check whether this is a click in a widget
            for (var n = e_target(e); n != wrapper; n = n.parentNode)
                if (n.parentNode == code && n != mover) return;

            // See if this is a click in the gutter
            for (var n = e_target(e); n != wrapper; n = n.parentNode)
                if (n.parentNode == gutterText) {
                    if (options.onGutterClick)
                        options.onGutterClick(instance, indexOf(gutterText.childNodes, n) + showingFrom, e);
                    return e_preventDefault(e);
                }

            var start = posFromMouse(e);

            switch (e_button(e)) {
                case 3:
                    if (gecko && !mac) onContextMenu(e);
                    return;
                case 2:
                    if (start) setCursor(start.line, start.ch, true);
                    return;
            }
            // For button 1, if it was clicked inside the editor
            // (posFromMouse returning non-null), we have to adjust the
            // selection.
            if (!start) {if (e_target(e) == scroller) e_preventDefault(e); return;}

            if (!focused) onFocus();

            var now = +new Date;
            if (lastDoubleClick && lastDoubleClick.time > now - 400 && posEq(lastDoubleClick.pos, start)) {
                e_preventDefault(e);
                setTimeout(focusInput, 20);
                return selectLine(start.line);
            } else if (lastClick && lastClick.time > now - 400 && posEq(lastClick.pos, start)) {
                lastDoubleClick = {time: now, pos: start};
                e_preventDefault(e);
                return selectWordAt(start);
            } else { lastClick = {time: now, pos: start}; }

            var last = start, going;
            if (dragAndDrop && !posEq(sel.from, sel.to) &&
                !posLess(start, sel.from) && !posLess(sel.to, start)) {
                // Let the drag handler handle this.
                if (webkit) lineSpace.draggable = true;
                var up = connect(targetDocument, "mouseup", operation(function(e2) {
                    if (webkit) lineSpace.draggable = false;
                    draggingText = false;
                    up();
                    if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
                        e_preventDefault(e2);
                        setCursor(start.line, start.ch, true);
                        focusInput();
                    }
                }), true);
                draggingText = true;
                return;
            }
            e_preventDefault(e);
            setCursor(start.line, start.ch, true);

            function extend(e) {
                var cur = posFromMouse(e, true);
                if (cur && !posEq(cur, last)) {
                    if (!focused) onFocus();
                    last = cur;
                    setSelectionUser(start, cur);
                    updateInput = false;
                    var visible = visibleLines();
                    if (cur.line >= visible.to || cur.line < visible.from)
                        going = setTimeout(operation(function(){extend(e);}), 150);
                }
            }

            var move = connect(targetDocument, "mousemove", operation(function(e) {
                clearTimeout(going);
                e_preventDefault(e);
                extend(e);
            }), true);
            var up = connect(targetDocument, "mouseup", operation(function(e) {
                clearTimeout(going);
                var cur = posFromMouse(e);
                if (cur) setSelectionUser(start, cur);
                e_preventDefault(e);
                focusInput();
                updateInput = true;
                move(); up();
            }), true);
        }
        function onDoubleClick(e) {
            for (var n = e_target(e); n != wrapper; n = n.parentNode)
                if (n.parentNode == gutterText) return e_preventDefault(e);
            var start = posFromMouse(e);
            if (!start) return;
            lastDoubleClick = {time: +new Date, pos: start};
            e_preventDefault(e);
            selectWordAt(start);
        }
        function onDrop(e) {
            e.preventDefault();
            var pos = posFromMouse(e, true), files = e.dataTransfer.files;
            if (!pos || options.readOnly) return;
            if (files && files.length && window.FileReader && window.File) {
                function loadFile(file, i) {
                    var reader = new FileReader;
                    reader.onload = function() {
                        text[i] = reader.result;
                        if (++read == n) {
                            pos = clipPos(pos);
                            operation(function() {
                                var end = replaceRange(text.join(""), pos, pos);
                                setSelectionUser(pos, end);
                            })();
                        }
                    };
                    reader.readAsText(file);
                }
                var n = files.length, text = Array(n), read = 0;
                for (var i = 0; i < n; ++i) loadFile(files[i], i);
            }
            else {
                try {
                    var text = e.dataTransfer.getData("Text");
                    if (text) {
                        var end = replaceRange(text, pos, pos);
                        var curFrom = sel.from, curTo = sel.to;
                        setSelectionUser(pos, end);
                        if (draggingText) replaceRange("", curFrom, curTo);
                        focusInput();
                    }
                }
                catch(e){}
            }
        }
        function onDragStart(e) {
            var txt = getSelection();
            // This will reset escapeElement
            htmlEscape(txt);
            e.dataTransfer.setDragImage(escapeElement, 0, 0);
            e.dataTransfer.setData("Text", txt);
        }
        function handleKeyBinding(e) {
            var name = keyNames[e.keyCode], next = keyMap[options.keyMap].auto, bound, dropShift;
            if (name == null || e.altGraphKey) {
                if (next) options.keyMap = next;
                return null;
            }
            if (e.altKey) name = "Alt-" + name;
            if (e.ctrlKey) name = "Ctrl-" + name;
            if (e.metaKey) name = "Cmd-" + name;
            if (e.shiftKey && (bound = lookupKey("Shift-" + name, options.extraKeys, options.keyMap))) {
                dropShift = true;
            } else {
                bound = lookupKey(name, options.extraKeys, options.keyMap);
            }
            if (typeof bound == "string") {
                if (commands.propertyIsEnumerable(bound)) bound = commands[bound];
                else bound = null;
            }
            if (next && (bound || !isModifierKey(e))) options.keyMap = next;
            if (!bound) return false;
            if (dropShift) {
                var prevShift = shiftSelecting;
                shiftSelecting = null;
                bound(instance);
                shiftSelecting = prevShift;
            } else bound(instance);
            e_preventDefault(e);
            return true;
        }
        var lastStoppedKey = null;
        function onKeyDown(e) {
            if (!focused) onFocus();
            var code = e.keyCode;
            // IE does strange things with escape.
            if (ie && code == 27) { e.returnValue = false; }
            setShift(code == 16 || e.shiftKey);
            // First give onKeyEvent option a chance to handle this.
            if (options.onKeyEvent && options.onKeyEvent(instance, addStop(e))) return;
            var handled = handleKeyBinding(e);
            if (window.opera) {
                lastStoppedKey = handled ? e.keyCode : null;
                // Opera has no cut event... we try to at least catch the key combo
                if (!handled && (mac ? e.metaKey : e.ctrlKey) && e.keyCode == 88)
                    replaceSelection("");
            }
        }
        function onKeyPress(e) {
            if (window.opera && e.keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
            if (options.onKeyEvent && options.onKeyEvent(instance, addStop(e))) return;
            if (window.opera && !e.which && handleKeyBinding(e)) return;
            if (options.electricChars && mode.electricChars) {
                var ch = String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode);
                if (mode.electricChars.indexOf(ch) > -1)
                    setTimeout(operation(function() {indentLine(sel.to.line, "smart");}), 75);
            }
            fastPoll();
        }
        function onKeyUp(e) {
            if (options.onKeyEvent && options.onKeyEvent(instance, addStop(e))) return;
            if (e.keyCode == 16) shiftSelecting = null;
        }

        function onFocus() {
            if (options.readOnly) return;
            if (!focused) {
                if (options.onFocus) options.onFocus(instance);
                focused = true;
                if (wrapper.className.search(/\bCodeMirror-focused\b/) == -1)
                    wrapper.className += " CodeMirror-focused";
                if (!leaveInputAlone) resetInput(true);
            }
            slowPoll();
            restartBlink();
        }
        function onBlur() {
            if (focused) {
                if (options.onBlur) options.onBlur(instance);
                focused = false;
                wrapper.className = wrapper.className.replace(" CodeMirror-focused", "");
            }
            clearInterval(blinker);
            setTimeout(function() {if (!focused) shiftSelecting = null;}, 150);
        }

        // Replace the range from from to to by the strings in newText.
        // Afterwards, set the selection to selFrom, selTo.
        function updateLines(from, to, newText, selFrom, selTo) {
            if (history) {
                var old = [];
                doc.iter(from.line, to.line + 1, function(line) { old.push(line.text); });
                history.addChange(from.line, newText.length, old);
                while (history.done.length > options.undoDepth) history.done.shift();
            }
            updateLinesNoUndo(from, to, newText, selFrom, selTo);
        }
        function unredoHelper(from, to) {
            var change = from.pop();
            if (change) {
                var replaced = [], end = change.start + change.added;
                doc.iter(change.start, end, function(line) { replaced.push(line.text); });
                to.push({start: change.start, added: change.old.length, old: replaced});
                var pos = clipPos({line: change.start + change.old.length - 1,
                    ch: editEnd(replaced[replaced.length-1], change.old[change.old.length-1])});
                updateLinesNoUndo({line: change.start, ch: 0}, {line: end - 1, ch: getLine(end-1).text.length}, change.old, pos, pos);
                updateInput = true;
            }
        }
        function undo() {unredoHelper(history.done, history.undone);}
        function redo() {unredoHelper(history.undone, history.done);}

        function updateLinesNoUndo(from, to, newText, selFrom, selTo) {
            var recomputeMaxLength = false, maxLineLength = maxLine.length;
            if (!options.lineWrapping)
                doc.iter(from.line, to.line, function(line) {
                    if (line.text.length == maxLineLength) {recomputeMaxLength = true; return true;}
                });
            if (from.line != to.line || newText.length > 1) gutterDirty = true;

            var nlines = to.line - from.line, firstLine = getLine(from.line), lastLine = getLine(to.line);
            // First adjust the line structure, taking some care to leave highlighting intact.
            if (from.ch == 0 && to.ch == 0 && newText[newText.length - 1] == "") {
                // This is a whole-line replace. Treated specially to make
                // sure line objects move the way they are supposed to.
                var added = [], prevLine = null;
                if (from.line) {
                    prevLine = getLine(from.line - 1);
                    prevLine.fixMarkEnds(lastLine);
                } else lastLine.fixMarkStarts();
                for (var i = 0, e = newText.length - 1; i < e; ++i)
                    added.push(Line.inheritMarks(newText[i], prevLine));
                if (nlines) doc.remove(from.line, nlines, callbacks);
                if (added.length) doc.insert(from.line, added);
            } else if (firstLine == lastLine) {
                if (newText.length == 1)
                    firstLine.replace(from.ch, to.ch, newText[0]);
                else {
                    lastLine = firstLine.split(to.ch, newText[newText.length-1]);
                    firstLine.replace(from.ch, null, newText[0]);
                    firstLine.fixMarkEnds(lastLine);
                    var added = [];
                    for (var i = 1, e = newText.length - 1; i < e; ++i)
                        added.push(Line.inheritMarks(newText[i], firstLine));
                    added.push(lastLine);
                    doc.insert(from.line + 1, added);
                }
            } else if (newText.length == 1) {
                firstLine.replace(from.ch, null, newText[0]);
                lastLine.replace(null, to.ch, "");
                firstLine.append(lastLine);
                doc.remove(from.line + 1, nlines, callbacks);
            } else {
                var added = [];
                firstLine.replace(from.ch, null, newText[0]);
                lastLine.replace(null, to.ch, newText[newText.length-1]);
                firstLine.fixMarkEnds(lastLine);
                for (var i = 1, e = newText.length - 1; i < e; ++i)
                    added.push(Line.inheritMarks(newText[i], firstLine));
                if (nlines > 1) doc.remove(from.line + 1, nlines - 1, callbacks);
                doc.insert(from.line + 1, added);
            }
            if (options.lineWrapping) {
                var perLine = scroller.clientWidth / charWidth() - 3;
                doc.iter(from.line, from.line + newText.length, function(line) {
                    if (line.hidden) return;
                    var guess = Math.ceil(line.text.length / perLine) || 1;
                    if (guess != line.height) updateLineHeight(line, guess);
                });
            } else {
                doc.iter(from.line, i + newText.length, function(line) {
                    var l = line.text;
                    if (l.length > maxLineLength) {
                        maxLine = l; maxLineLength = l.length; maxWidth = null;
                        recomputeMaxLength = false;
                    }
                });
                if (recomputeMaxLength) {
                    maxLineLength = 0; maxLine = ""; maxWidth = null;
                    doc.iter(0, doc.size, function(line) {
                        var l = line.text;
                        if (l.length > maxLineLength) {
                            maxLineLength = l.length; maxLine = l;
                        }
                    });
                }
            }

            // Add these lines to the work array, so that they will be
            // highlighted. Adjust work lines if lines were added/removed.
            var newWork = [], lendiff = newText.length - nlines - 1;
            for (var i = 0, l = work.length; i < l; ++i) {
                var task = work[i];
                if (task < from.line) newWork.push(task);
                else if (task > to.line) newWork.push(task + lendiff);
            }
            var hlEnd = from.line + Math.min(newText.length, 500);
            highlightLines(from.line, hlEnd);
            newWork.push(hlEnd);
            work = newWork;
            startWorker(100);
            // Remember that these lines changed, for updating the display
            changes.push({from: from.line, to: to.line + 1, diff: lendiff});
            var changeObj = {from: from, to: to, text: newText};
            if (textChanged) {
                for (var cur = textChanged; cur.next; cur = cur.next) {}
                cur.next = changeObj;
            } else textChanged = changeObj;

            // Update the selection
            function updateLine(n) {return n <= Math.min(to.line, to.line + lendiff) ? n : n + lendiff;}
            setSelection(selFrom, selTo, updateLine(sel.from.line), updateLine(sel.to.line));

            // Make sure the scroll-size div has the correct height.
            code.style.height = (doc.height * textHeight() + 2 * paddingTop()) + "px";
        }

        function replaceRange(code, from, to) {
            from = clipPos(from);
            if (!to) to = from; else to = clipPos(to);
            code = splitLines(code);
            function adjustPos(pos) {
                if (posLess(pos, from)) return pos;
                if (!posLess(to, pos)) return end;
                var line = pos.line + code.length - (to.line - from.line) - 1;
                var ch = pos.ch;
                if (pos.line == to.line)
                    ch += code[code.length-1].length - (to.ch - (to.line == from.line ? from.ch : 0));
                return {line: line, ch: ch};
            }
            var end;
            replaceRange1(code, from, to, function(end1) {
                end = end1;
                return {from: adjustPos(sel.from), to: adjustPos(sel.to)};
            });
            return end;
        }
        function replaceSelection(code, collapse) {
            replaceRange1(splitLines(code), sel.from, sel.to, function(end) {
                if (collapse == "end") return {from: end, to: end};
                else if (collapse == "start") return {from: sel.from, to: sel.from};
                else return {from: sel.from, to: end};
            });
        }
        function replaceRange1(code, from, to, computeSel) {
            var endch = code.length == 1 ? code[0].length + from.ch : code[code.length-1].length;
            var newSel = computeSel({line: from.line + code.length - 1, ch: endch});
            updateLines(from, to, code, newSel.from, newSel.to);
        }

        function getRange(from, to) {
            var l1 = from.line, l2 = to.line;
            if (l1 == l2) return getLine(l1).text.slice(from.ch, to.ch);
            var code = [getLine(l1).text.slice(from.ch)];
            doc.iter(l1 + 1, l2, function(line) { code.push(line.text); });
            code.push(getLine(l2).text.slice(0, to.ch));
            return code.join("\n");
        }
        function getSelection() {
            return getRange(sel.from, sel.to);
        }

        var pollingFast = false; // Ensures slowPoll doesn't cancel fastPoll
        function slowPoll() {
            if (pollingFast) return;
            poll.set(options.pollInterval, function() {
                startOperation();
                readInput();
                if (focused) slowPoll();
                endOperation();
            });
        }
        function fastPoll() {
            var missed = false;
            pollingFast = true;
            function p() {
                startOperation();
                var changed = readInput();
                if (!changed && !missed) {missed = true; poll.set(60, p);}
                else {pollingFast = false; slowPoll();}
                endOperation();
            }
            poll.set(20, p);
        }

        // Previnput is a hack to work with IME. If we reset the textarea
        // on every change, that breaks IME. So we look for changes
        // compared to the previous content instead. (Modern browsers have
        // events that indicate IME taking place, but these are not widely
        // supported or compatible enough yet to rely on.)
        var prevInput = "";
        function readInput() {
            if (leaveInputAlone || !focused || hasSelection(input)) return false;
            var text = input.value;
            if (text == prevInput) return false;
            shiftSelecting = null;
            var same = 0, l = Math.min(prevInput.length, text.length);
            while (same < l && prevInput[same] == text[same]) ++same;
            if (same < prevInput.length)
                sel.from = {line: sel.from.line, ch: sel.from.ch - (prevInput.length - same)};
            else if (overwrite && posEq(sel.from, sel.to))
                sel.to = {line: sel.to.line, ch: Math.min(getLine(sel.to.line).text.length, sel.to.ch + (text.length - same))};
            replaceSelection(text.slice(same), "end");
            prevInput = text;
            return true;
        }
        function resetInput(user) {
            if (!posEq(sel.from, sel.to)) {
                prevInput = "";
                input.value = getSelection();
                input.select();
            } else if (user) prevInput = input.value = "";
        }

        function focusInput() {
            if (!options.readOnly) input.focus();
        }

        function scrollEditorIntoView() {
            if (!cursor.getBoundingClientRect) return;
            var rect = cursor.getBoundingClientRect();
            // IE returns bogus coordinates when the instance sits inside of an iframe and the cursor is hidden
            if (ie && rect.top == rect.bottom) return;
            var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
            if (rect.top < 0 || rect.bottom > winH) cursor.scrollIntoView();
        }
        function scrollCursorIntoView() {
            var cursor = localCoords(sel.inverted ? sel.from : sel.to);
            var x = options.lineWrapping ? Math.min(cursor.x, lineSpace.offsetWidth) : cursor.x;
            return scrollIntoView(x, cursor.y, x, cursor.yBot);
        }
        function scrollIntoView(x1, y1, x2, y2) {
            var pl = paddingLeft(), pt = paddingTop(), lh = textHeight();
            y1 += pt; y2 += pt; x1 += pl; x2 += pl;
            var screen = scroller.clientHeight, screentop = scroller.scrollTop, scrolled = false, result = true;
            if (y1 < screentop) {scroller.scrollTop = Math.max(0, y1 - 2*lh); scrolled = true;}
            else if (y2 > screentop + screen) {scroller.scrollTop = y2 + lh - screen; scrolled = true;}

            var screenw = scroller.clientWidth, screenleft = scroller.scrollLeft;
            var gutterw = options.fixedGutter ? gutter.clientWidth : 0;
            if (x1 < screenleft + gutterw) {
                if (x1 < 50) x1 = 0;
                scroller.scrollLeft = Math.max(0, x1 - 10 - gutterw);
                scrolled = true;
            }
            else if (x2 > screenw + screenleft - 3) {
                scroller.scrollLeft = x2 + 10 - screenw;
                scrolled = true;
                if (x2 > code.clientWidth) result = false;
            }
            if (scrolled && options.onScroll) options.onScroll(instance);
            return result;
        }

        function visibleLines() {
            var lh = textHeight(), top = scroller.scrollTop - paddingTop();
            var from_height = Math.max(0, Math.floor(top / lh));
            var to_height = Math.ceil((top + scroller.clientHeight) / lh);
            return {from: lineAtHeight(doc, from_height),
                to: lineAtHeight(doc, to_height)};
        }
        // Uses a set of changes plus the current scroll position to
        // determine which DOM updates have to be made, and makes the
        // updates.
        function updateDisplay(changes, suppressCallback) {
            if (!scroller.clientWidth) {
                showingFrom = showingTo = displayOffset = 0;
                return;
            }
            // Compute the new visible window
            var visible = visibleLines();
            // Bail out if the visible area is already rendered and nothing changed.
            if (changes !== true && changes.length == 0 && visible.from >= showingFrom && visible.to <= showingTo) return;
            var from = Math.max(visible.from - 100, 0), to = Math.min(doc.size, visible.to + 100);
            if (showingFrom < from && from - showingFrom < 20) from = showingFrom;
            if (showingTo > to && showingTo - to < 20) to = Math.min(doc.size, showingTo);

            // Create a range of theoretically intact lines, and punch holes
            // in that using the change info.
            var intact = changes === true ? [] :
                computeIntact([{from: showingFrom, to: showingTo, domStart: 0}], changes);
            // Clip off the parts that won't be visible
            var intactLines = 0;
            for (var i = 0; i < intact.length; ++i) {
                var range = intact[i];
                if (range.from < from) {range.domStart += (from - range.from); range.from = from;}
                if (range.to > to) range.to = to;
                if (range.from >= range.to) intact.splice(i--, 1);
                else intactLines += range.to - range.from;
            }
            if (intactLines == to - from) return;
            intact.sort(function(a, b) {return a.domStart - b.domStart;});

            var th = textHeight(), gutterDisplay = gutter.style.display;
            lineDiv.style.display = gutter.style.display = "none";
            patchDisplay(from, to, intact);
            lineDiv.style.display = "";

            // Position the mover div to align with the lines it's supposed
            // to be showing (which will cover the visible display)
            var different = from != showingFrom || to != showingTo || lastSizeC != scroller.clientHeight + th;
            // This is just a bogus formula that detects when the editor is
            // resized or the font size changes.
            if (different) lastSizeC = scroller.clientHeight + th;
            showingFrom = from; showingTo = to;
            displayOffset = heightAtLine(doc, from);
            mover.style.top = (displayOffset * th) + "px";
            code.style.height = (doc.height * th + 2 * paddingTop()) + "px";

            // Since this is all rather error prone, it is honoured with the
            // only assertion in the whole file.
            if (lineDiv.childNodes.length != showingTo - showingFrom)
                throw new Error("BAD PATCH! " + JSON.stringify(intact) + " size=" + (showingTo - showingFrom) +
                    " nodes=" + lineDiv.childNodes.length);

            if (options.lineWrapping) {
                maxWidth = scroller.clientWidth;
                var curNode = lineDiv.firstChild;
                doc.iter(showingFrom, showingTo, function(line) {
                    if (!line.hidden) {
                        var height = Math.round(curNode.offsetHeight / th) || 1;
                        if (line.height != height) {updateLineHeight(line, height); gutterDirty = true;}
                    }
                    curNode = curNode.nextSibling;
                });
            } else {
                if (maxWidth == null) maxWidth = stringWidth(maxLine);
                if (maxWidth > scroller.clientWidth) {
                    lineSpace.style.width = maxWidth + "px";
                    // Needed to prevent odd wrapping/hiding of widgets placed in here.
                    code.style.width = "";
                    code.style.width = scroller.scrollWidth + "px";
                } else {
                    lineSpace.style.width = code.style.width = "";
                }
            }
            gutter.style.display = gutterDisplay;
            if (different || gutterDirty) updateGutter();
            updateCursor();
            if (!suppressCallback && options.onUpdate) options.onUpdate(instance);
            return true;
        }

        function computeIntact(intact, changes) {
            for (var i = 0, l = changes.length || 0; i < l; ++i) {
                var change = changes[i], intact2 = [], diff = change.diff || 0;
                for (var j = 0, l2 = intact.length; j < l2; ++j) {
                    var range = intact[j];
                    if (change.to <= range.from && change.diff)
                        intact2.push({from: range.from + diff, to: range.to + diff,
                            domStart: range.domStart});
                    else if (change.to <= range.from || change.from >= range.to)
                        intact2.push(range);
                    else {
                        if (change.from > range.from)
                            intact2.push({from: range.from, to: change.from, domStart: range.domStart});
                        if (change.to < range.to)
                            intact2.push({from: change.to + diff, to: range.to + diff,
                                domStart: range.domStart + (change.to - range.from)});
                    }
                }
                intact = intact2;
            }
            return intact;
        }

        function patchDisplay(from, to, intact) {
            // The first pass removes the DOM nodes that aren't intact.
            if (!intact.length) lineDiv.innerHTML = "";
            else {
                function killNode(node) {
                    var tmp = node.nextSibling;
                    node.parentNode.removeChild(node);
                    return tmp;
                }
                var domPos = 0, curNode = lineDiv.firstChild, n;
                for (var i = 0; i < intact.length; ++i) {
                    var cur = intact[i];
                    while (cur.domStart > domPos) {curNode = killNode(curNode); domPos++;}
                    for (var j = 0, e = cur.to - cur.from; j < e; ++j) {curNode = curNode.nextSibling; domPos++;}
                }
                while (curNode) curNode = killNode(curNode);
            }
            // This pass fills in the lines that actually changed.
            var nextIntact = intact.shift(), curNode = lineDiv.firstChild, j = from;
            var sfrom = sel.from.line, sto = sel.to.line, inSel = sfrom < from && sto >= from;
            var scratch = targetDocument.createElement("div"), newElt;
            doc.iter(from, to, function(line) {
                var ch1 = null, ch2 = null;
                if (inSel) {
                    ch1 = 0;
                    if (sto == j) {inSel = false; ch2 = sel.to.ch;}
                } else if (sfrom == j) {
                    if (sto == j) {ch1 = sel.from.ch; ch2 = sel.to.ch;}
                    else {inSel = true; ch1 = sel.from.ch;}
                }
                if (nextIntact && nextIntact.to == j) nextIntact = intact.shift();
                if (!nextIntact || nextIntact.from > j) {
                    if (line.hidden) scratch.innerHTML = "<pre></pre>";
                    else scratch.innerHTML = line.getHTML(ch1, ch2, true, tabText);
                    lineDiv.insertBefore(scratch.firstChild, curNode);
                } else {
                    curNode = curNode.nextSibling;
                }
                ++j;
            });
        }

        function updateGutter() {
            if (!options.gutter && !options.lineNumbers) return;
            var hText = mover.offsetHeight, hEditor = scroller.clientHeight;
            gutter.style.height = (hText - hEditor < 2 ? hEditor : hText) + "px";
            var html = [], i = showingFrom;
            doc.iter(showingFrom, Math.max(showingTo, showingFrom + 1), function(line) {
                if (line.hidden) {
                    html.push("<pre></pre>");
                } else {
                    var marker = line.gutterMarker;
                    var text = options.lineNumbers ? i + options.firstLineNumber : null;
                    if (marker && marker.text)
                        text = marker.text.replace("%N%", text != null ? text : "");
                    else if (text == null)
                        text = "\u00a0";
                    html.push((marker && marker.style ? '<pre class="' + marker.style + '">' : "<pre>"), text);
                    for (var j = 1; j < line.height; ++j) html.push("<br/>&#160;");
                    html.push("</pre>");
                }
                ++i;
            });
            gutter.style.display = "none";
            gutterText.innerHTML = html.join("");
            var minwidth = String(doc.size).length, firstNode = gutterText.firstChild, val = eltText(firstNode), pad = "";
            while (val.length + pad.length < minwidth) pad += "\u00a0";
            if (pad) firstNode.insertBefore(targetDocument.createTextNode(pad), firstNode.firstChild);
            gutter.style.display = "";
            lineSpace.style.marginLeft = gutter.offsetWidth + "px";
            gutterDirty = false;
        }
        function updateCursor() {
            var head = sel.inverted ? sel.from : sel.to, lh = textHeight();
            var pos = localCoords(head, true);
            var wrapOff = eltOffset(wrapper), lineOff = eltOffset(lineDiv);
            inputDiv.style.top = (pos.y + lineOff.top - wrapOff.top) + "px";
            inputDiv.style.left = (pos.x + lineOff.left - wrapOff.left) + "px";
            if (posEq(sel.from, sel.to)) {
                cursor.style.top = pos.y + "px";
                cursor.style.left = (options.lineWrapping ? Math.min(pos.x, lineSpace.offsetWidth) : pos.x) + "px";
                cursor.style.display = "";
            }
            else cursor.style.display = "none";
        }

        function setShift(val) {
            if (val) shiftSelecting = shiftSelecting || (sel.inverted ? sel.to : sel.from);
            else shiftSelecting = null;
        }
        function setSelectionUser(from, to) {
            var sh = shiftSelecting && clipPos(shiftSelecting);
            if (sh) {
                if (posLess(sh, from)) from = sh;
                else if (posLess(to, sh)) to = sh;
            }
            setSelection(from, to);
            userSelChange = true;
        }
        // Update the selection. Last two args are only used by
        // updateLines, since they have to be expressed in the line
        // numbers before the update.
        function setSelection(from, to, oldFrom, oldTo) {
            goalColumn = null;
            if (oldFrom == null) {oldFrom = sel.from.line; oldTo = sel.to.line;}
            if (posEq(sel.from, from) && posEq(sel.to, to)) return;
            if (posLess(to, from)) {var tmp = to; to = from; from = tmp;}

            // Skip over hidden lines.
            if (from.line != oldFrom) from = skipHidden(from, oldFrom, sel.from.ch);
            if (to.line != oldTo) to = skipHidden(to, oldTo, sel.to.ch);

            if (posEq(from, to)) sel.inverted = false;
            else if (posEq(from, sel.to)) sel.inverted = false;
            else if (posEq(to, sel.from)) sel.inverted = true;

            // Some ugly logic used to only mark the lines that actually did
            // see a change in selection as changed, rather than the whole
            // selected range.
            if (posEq(from, to)) {
                if (!posEq(sel.from, sel.to))
                    changes.push({from: oldFrom, to: oldTo + 1});
            }
            else if (posEq(sel.from, sel.to)) {
                changes.push({from: from.line, to: to.line + 1});
            }
            else {
                if (!posEq(from, sel.from)) {
                    if (from.line < oldFrom)
                        changes.push({from: from.line, to: Math.min(to.line, oldFrom) + 1});
                    else
                        changes.push({from: oldFrom, to: Math.min(oldTo, from.line) + 1});
                }
                if (!posEq(to, sel.to)) {
                    if (to.line < oldTo)
                        changes.push({from: Math.max(oldFrom, from.line), to: oldTo + 1});
                    else
                        changes.push({from: Math.max(from.line, oldTo), to: to.line + 1});
                }
            }
            sel.from = from; sel.to = to;
            selectionChanged = true;
        }
        function skipHidden(pos, oldLine, oldCh) {
            function getNonHidden(dir) {
                var lNo = pos.line + dir, end = dir == 1 ? doc.size : -1;
                while (lNo != end) {
                    var line = getLine(lNo);
                    if (!line.hidden) {
                        var ch = pos.ch;
                        if (ch > oldCh || ch > line.text.length) ch = line.text.length;
                        return {line: lNo, ch: ch};
                    }
                    lNo += dir;
                }
            }
            var line = getLine(pos.line);
            if (!line.hidden) return pos;
            if (pos.line >= oldLine) return getNonHidden(1) || getNonHidden(-1);
            else return getNonHidden(-1) || getNonHidden(1);
        }
        function setCursor(line, ch, user) {
            var pos = clipPos({line: line, ch: ch || 0});
            (user ? setSelectionUser : setSelection)(pos, pos);
        }

        function clipLine(n) {return Math.max(0, Math.min(n, doc.size-1));}
        function clipPos(pos) {
            if (pos.line < 0) return {line: 0, ch: 0};
            if (pos.line >= doc.size) return {line: doc.size-1, ch: getLine(doc.size-1).text.length};
            var ch = pos.ch, linelen = getLine(pos.line).text.length;
            if (ch == null || ch > linelen) return {line: pos.line, ch: linelen};
            else if (ch < 0) return {line: pos.line, ch: 0};
            else return pos;
        }

        function findPosH(dir, unit) {
            var end = sel.inverted ? sel.from : sel.to, line = end.line, ch = end.ch;
            var lineObj = getLine(line);
            function findNextLine() {
                for (var l = line + dir, e = dir < 0 ? -1 : doc.size; l != e; l += dir) {
                    var lo = getLine(l);
                    if (!lo.hidden) { line = l; lineObj = lo; return true; }
                }
            }
            function moveOnce(boundToLine) {
                if (ch == (dir < 0 ? 0 : lineObj.text.length)) {
                    if (!boundToLine && findNextLine()) ch = dir < 0 ? lineObj.text.length : 0;
                    else return false;
                } else ch += dir;
                return true;
            }
            if (unit == "char") moveOnce();
            else if (unit == "column") moveOnce(true);
            else if (unit == "word") {
                var sawWord = false;
                for (;;) {
                    if (dir < 0) if (!moveOnce()) break;
                    if (isWordChar(lineObj.text.charAt(ch))) sawWord = true;
                    else if (sawWord) {if (dir < 0) {dir = 1; moveOnce();} break;}
                    if (dir > 0) if (!moveOnce()) break;
                }
            }
            return {line: line, ch: ch};
        }
        function moveH(dir, unit) {
            var pos = dir < 0 ? sel.from : sel.to;
            if (shiftSelecting || posEq(sel.from, sel.to)) pos = findPosH(dir, unit);
            setCursor(pos.line, pos.ch, true);
        }
        function deleteH(dir, unit) {
            if (!posEq(sel.from, sel.to)) replaceRange("", sel.from, sel.to);
            else if (dir < 0) replaceRange("", findPosH(dir, unit), sel.to);
            else replaceRange("", sel.from, findPosH(dir, unit));
            userSelChange = true;
        }
        var goalColumn = null;
        function moveV(dir, unit) {
            var dist = 0, pos = localCoords(sel.inverted ? sel.from : sel.to, true);
            if (goalColumn != null) pos.x = goalColumn;
            if (unit == "page") dist = scroller.clientHeight;
            else if (unit == "line") dist = textHeight();
            var target = coordsChar(pos.x, pos.y + dist * dir + 2);
            setCursor(target.line, target.ch, true);
            goalColumn = pos.x;
        }

        function selectWordAt(pos) {
            var line = getLine(pos.line).text;
            var start = pos.ch, end = pos.ch;
            while (start > 0 && isWordChar(line.charAt(start - 1))) --start;
            while (end < line.length && isWordChar(line.charAt(end))) ++end;
            setSelectionUser({line: pos.line, ch: start}, {line: pos.line, ch: end});
        }
        function selectLine(line) {
            setSelectionUser({line: line, ch: 0}, {line: line, ch: getLine(line).text.length});
        }
        function indentSelected(mode) {
            if (posEq(sel.from, sel.to)) return indentLine(sel.from.line, mode);
            var e = sel.to.line - (sel.to.ch ? 0 : 1);
            for (var i = sel.from.line; i <= e; ++i) indentLine(i, mode);
        }

        function indentLine(n, how) {
            if (!how) how = "add";
            if (how == "smart") {
                if (!mode.indent) how = "prev";
                else var state = getStateBefore(n);
            }

            var line = getLine(n), curSpace = line.indentation(options.tabSize),
                curSpaceString = line.text.match(/^\s*/)[0], indentation;
            if (how == "prev") {
                if (n) indentation = getLine(n-1).indentation(options.tabSize);
                else indentation = 0;
            }
            else if (how == "smart") indentation = mode.indent(state, line.text.slice(curSpaceString.length), line.text);
            else if (how == "add") indentation = curSpace + options.indentUnit;
            else if (how == "subtract") indentation = curSpace - options.indentUnit;
            indentation = Math.max(0, indentation);
            var diff = indentation - curSpace;

            if (!diff) {
                if (sel.from.line != n && sel.to.line != n) return;
                var indentString = curSpaceString;
            }
            else {
                var indentString = "", pos = 0;
                if (options.indentWithTabs)
                    for (var i = Math.floor(indentation / options.tabSize); i; --i) {pos += options.tabSize; indentString += "\t";}
                while (pos < indentation) {++pos; indentString += " ";}
            }

            replaceRange(indentString, {line: n, ch: 0}, {line: n, ch: curSpaceString.length});
        }

        function loadMode() {
            mode = CodeMirror.getMode(options, options.mode);
            doc.iter(0, doc.size, function(line) { line.stateAfter = null; });
            work = [0];
            startWorker();
        }
        function gutterChanged() {
            var visible = options.gutter || options.lineNumbers;
            gutter.style.display = visible ? "" : "none";
            if (visible) gutterDirty = true;
            else lineDiv.parentNode.style.marginLeft = 0;
        }
        function wrappingChanged(from, to) {
            if (options.lineWrapping) {
                wrapper.className += " CodeMirror-wrap";
                var perLine = scroller.clientWidth / charWidth() - 3;
                doc.iter(0, doc.size, function(line) {
                    if (line.hidden) return;
                    var guess = Math.ceil(line.text.length / perLine) || 1;
                    if (guess != 1) updateLineHeight(line, guess);
                });
                lineSpace.style.width = code.style.width = "";
            } else {
                wrapper.className = wrapper.className.replace(" CodeMirror-wrap", "");
                maxWidth = null; maxLine = "";
                doc.iter(0, doc.size, function(line) {
                    if (line.height != 1 && !line.hidden) updateLineHeight(line, 1);
                    if (line.text.length > maxLine.length) maxLine = line.text;
                });
            }
            changes.push({from: 0, to: doc.size});
        }
        function computeTabText() {
            for (var str = '<span class="cm-tab">', i = 0; i < options.tabSize; ++i) str += " ";
            return str + "</span>";
        }
        function tabsChanged() {
            tabText = computeTabText();
            updateDisplay(true);
        }
        function themeChanged() {
            scroller.className = scroller.className.replace(/\s*cm-s-\w+/g, "") +
                options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        }

        function TextMarker() { this.set = []; }
        TextMarker.prototype.clear = operation(function() {
            var min = Infinity, max = -Infinity;
            for (var i = 0, e = this.set.length; i < e; ++i) {
                var line = this.set[i], mk = line.marked;
                if (!mk || !line.parent) continue;
                var lineN = lineNo(line);
                min = Math.min(min, lineN); max = Math.max(max, lineN);
                for (var j = 0; j < mk.length; ++j)
                    if (mk[j].set == this.set) mk.splice(j--, 1);
            }
            if (min != Infinity)
                changes.push({from: min, to: max + 1});
        });
        TextMarker.prototype.find = function() {
            var from, to;
            for (var i = 0, e = this.set.length; i < e; ++i) {
                var line = this.set[i], mk = line.marked;
                for (var j = 0; j < mk.length; ++j) {
                    var mark = mk[j];
                    if (mark.set == this.set) {
                        if (mark.from != null || mark.to != null) {
                            var found = lineNo(line);
                            if (found != null) {
                                if (mark.from != null) from = {line: found, ch: mark.from};
                                if (mark.to != null) to = {line: found, ch: mark.to};
                            }
                        }
                    }
                }
            }
            return {from: from, to: to};
        };

        function markText(from, to, className) {
            from = clipPos(from); to = clipPos(to);
            var tm = new TextMarker();
            function add(line, from, to, className) {
                getLine(line).addMark(new MarkedText(from, to, className, tm.set));
            }
            if (from.line == to.line) add(from.line, from.ch, to.ch, className);
            else {
                add(from.line, from.ch, null, className);
                for (var i = from.line + 1, e = to.line; i < e; ++i)
                    add(i, null, null, className);
                add(to.line, null, to.ch, className);
            }
            changes.push({from: from.line, to: to.line + 1});
            return tm;
        }

        function setBookmark(pos) {
            pos = clipPos(pos);
            var bm = new Bookmark(pos.ch);
            getLine(pos.line).addMark(bm);
            return bm;
        }

        function addGutterMarker(line, text, className) {
            if (typeof line == "number") line = getLine(clipLine(line));
            line.gutterMarker = {text: text, style: className};
            gutterDirty = true;
            return line;
        }
        function removeGutterMarker(line) {
            if (typeof line == "number") line = getLine(clipLine(line));
            line.gutterMarker = null;
            gutterDirty = true;
        }

        function changeLine(handle, op) {
            var no = handle, line = handle;
            if (typeof handle == "number") line = getLine(clipLine(handle));
            else no = lineNo(handle);
            if (no == null) return null;
            if (op(line, no)) changes.push({from: no, to: no + 1});
            else return null;
            return line;
        }
        function setLineClass(handle, className) {
            return changeLine(handle, function(line) {
                if (line.className != className) {
                    line.className = className;
                    return true;
                }
            });
        }
        function setLineHidden(handle, hidden) {
            return changeLine(handle, function(line, no) {
                if (line.hidden != hidden) {
                    line.hidden = hidden;
                    updateLineHeight(line, hidden ? 0 : 1);
                    if (hidden && (sel.from.line == no || sel.to.line == no))
                        setSelection(skipHidden(sel.from, sel.from.line, sel.from.ch),
                            skipHidden(sel.to, sel.to.line, sel.to.ch));
                    return (gutterDirty = true);
                }
            });
        }

        function lineInfo(line) {
            if (typeof line == "number") {
                if (!isLine(line)) return null;
                var n = line;
                line = getLine(line);
                if (!line) return null;
            }
            else {
                var n = lineNo(line);
                if (n == null) return null;
            }
            var marker = line.gutterMarker;
            return {line: n, handle: line, text: line.text, markerText: marker && marker.text,
                markerClass: marker && marker.style, lineClass: line.className};
        }

        function stringWidth(str) {
            measure.innerHTML = "<pre><span>x</span></pre>";
            measure.firstChild.firstChild.firstChild.nodeValue = str;
            return measure.firstChild.firstChild.offsetWidth || 10;
        }
        // These are used to go from pixel positions to character
        // positions, taking varying character widths into account.
        function charFromX(line, x) {
            if (x <= 0) return 0;
            var lineObj = getLine(line), text = lineObj.text;
            function getX(len) {
                measure.innerHTML = "<pre><span>" + lineObj.getHTML(null, null, false, tabText, len) + "</span></pre>";
                return measure.firstChild.firstChild.offsetWidth;
            }
            var from = 0, fromX = 0, to = text.length, toX;
            // Guess a suitable upper bound for our search.
            var estimated = Math.min(to, Math.ceil(x / charWidth()));
            for (;;) {
                var estX = getX(estimated);
                if (estX <= x && estimated < to) estimated = Math.min(to, Math.ceil(estimated * 1.2));
                else {toX = estX; to = estimated; break;}
            }
            if (x > toX) return to;
            // Try to guess a suitable lower bound as well.
            estimated = Math.floor(to * 0.8); estX = getX(estimated);
            if (estX < x) {from = estimated; fromX = estX;}
            // Do a binary search between these bounds.
            for (;;) {
                if (to - from <= 1) return (toX - x > x - fromX) ? from : to;
                var middle = Math.ceil((from + to) / 2), middleX = getX(middle);
                if (middleX > x) {to = middle; toX = middleX;}
                else {from = middle; fromX = middleX;}
            }
        }

        var tempId = Math.floor(Math.random() * 0xffffff).toString(16);
        function measureLine(line, ch) {
            var extra = "";
            // Include extra text at the end to make sure the measured line is wrapped in the right way.
            if (options.lineWrapping) {
                var end = line.text.indexOf(" ", ch + 2);
                extra = htmlEscape(line.text.slice(ch + 1, end < 0 ? line.text.length : end + (ie ? 5 : 0)));
            }
            measure.innerHTML = "<pre>" + line.getHTML(null, null, false, tabText, ch) +
                '<span id="CodeMirror-temp-' + tempId + '">' + htmlEscape(line.text.charAt(ch) || " ") + "</span>" +
                extra + "</pre>";
            var elt = document.getElementById("CodeMirror-temp-" + tempId);
            var top = elt.offsetTop, left = elt.offsetLeft;
            // Older IEs report zero offsets for spans directly after a wrap
            if (ie && ch && top == 0 && left == 0) {
                var backup = document.createElement("span");
                backup.innerHTML = "x";
                elt.parentNode.insertBefore(backup, elt.nextSibling);
                top = backup.offsetTop;
            }
            return {top: top, left: left};
        }
        function localCoords(pos, inLineWrap) {
            var x, lh = textHeight(), y = lh * (heightAtLine(doc, pos.line) - (inLineWrap ? displayOffset : 0));
            if (pos.ch == 0) x = 0;
            else {
                var sp = measureLine(getLine(pos.line), pos.ch);
                x = sp.left;
                if (options.lineWrapping) y += Math.max(0, sp.top);
            }
            return {x: x, y: y, yBot: y + lh};
        }
        // Coords must be lineSpace-local
        function coordsChar(x, y) {
            if (y < 0) y = 0;
            var th = textHeight(), cw = charWidth(), heightPos = displayOffset + Math.floor(y / th);
            var lineNo = lineAtHeight(doc, heightPos);
            if (lineNo >= doc.size) return {line: doc.size - 1, ch: getLine(doc.size - 1).text.length};
            var lineObj = getLine(lineNo), text = lineObj.text;
            var tw = options.lineWrapping, innerOff = tw ? heightPos - heightAtLine(doc, lineNo) : 0;
            if (x <= 0 && innerOff == 0) return {line: lineNo, ch: 0};
            function getX(len) {
                var sp = measureLine(lineObj, len);
                if (tw) {
                    var off = Math.round(sp.top / th);
                    return Math.max(0, sp.left + (off - innerOff) * scroller.clientWidth);
                }
                return sp.left;
            }
            var from = 0, fromX = 0, to = text.length, toX;
            // Guess a suitable upper bound for our search.
            var estimated = Math.min(to, Math.ceil((x + innerOff * scroller.clientWidth * .9) / cw));
            for (;;) {
                var estX = getX(estimated);
                if (estX <= x && estimated < to) estimated = Math.min(to, Math.ceil(estimated * 1.2));
                else {toX = estX; to = estimated; break;}
            }
            if (x > toX) return {line: lineNo, ch: to};
            // Try to guess a suitable lower bound as well.
            estimated = Math.floor(to * 0.8); estX = getX(estimated);
            if (estX < x) {from = estimated; fromX = estX;}
            // Do a binary search between these bounds.
            for (;;) {
                if (to - from <= 1) return {line: lineNo, ch: (toX - x > x - fromX) ? from : to};
                var middle = Math.ceil((from + to) / 2), middleX = getX(middle);
                if (middleX > x) {to = middle; toX = middleX;}
                else {from = middle; fromX = middleX;}
            }
        }
        function pageCoords(pos) {
            var local = localCoords(pos, true), off = eltOffset(lineSpace);
            return {x: off.left + local.x, y: off.top + local.y, yBot: off.top + local.yBot};
        }

        var cachedHeight, cachedHeightFor, measureText;
        function textHeight() {
            if (measureText == null) {
                measureText = "<pre>";
                for (var i = 0; i < 49; ++i) measureText += "x<br/>";
                measureText += "x</pre>";
            }
            var offsetHeight = lineDiv.clientHeight;
            if (offsetHeight == cachedHeightFor) return cachedHeight;
            cachedHeightFor = offsetHeight;
            measure.innerHTML = measureText;
            cachedHeight = measure.firstChild.offsetHeight / 50 || 1;
            measure.innerHTML = "";
            return cachedHeight;
        }
        var cachedWidth, cachedWidthFor = 0;
        function charWidth() {
            if (scroller.clientWidth == cachedWidthFor) return cachedWidth;
            cachedWidthFor = scroller.clientWidth;
            return (cachedWidth = stringWidth("x"));
        }
        function paddingTop() {return lineSpace.offsetTop;}
        function paddingLeft() {return lineSpace.offsetLeft;}

        function posFromMouse(e, liberal) {
            var offW = eltOffset(scroller, true), x, y;
            // Fails unpredictably on IE[67] when mouse is dragged around quickly.
            try { x = e.clientX; y = e.clientY; } catch (e) { return null; }
            // This is a mess of a heuristic to try and determine whether a
            // scroll-bar was clicked or not, and to return null if one was
            // (and !liberal).
            if (!liberal && (x - offW.left > scroller.clientWidth || y - offW.top > scroller.clientHeight))
                return null;
            var offL = eltOffset(lineSpace, true);
            return coordsChar(x - offL.left, y - offL.top);
        }
        function onContextMenu(e) {
            var pos = posFromMouse(e);
            if (!pos || window.opera) return; // Opera is difficult.
            if (posEq(sel.from, sel.to) || posLess(pos, sel.from) || !posLess(pos, sel.to))
                operation(setCursor)(pos.line, pos.ch);

            var oldCSS = input.style.cssText;
            inputDiv.style.position = "absolute";
            input.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +
                "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: white; " +
                "border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
            leaveInputAlone = true;
            var val = input.value = getSelection();
            focusInput();
            input.select();
            function rehide() {
                var newVal = splitLines(input.value).join("\n");
                if (newVal != val) operation(replaceSelection)(newVal, "end");
                inputDiv.style.position = "relative";
                input.style.cssText = oldCSS;
                leaveInputAlone = false;
                resetInput(true);
                slowPoll();
            }

            if (gecko) {
                e_stop(e);
                var mouseup = connect(window, "mouseup", function() {
                    mouseup();
                    setTimeout(rehide, 20);
                }, true);
            }
            else {
                setTimeout(rehide, 50);
            }
        }

        // Cursor-blinking
        function restartBlink() {
            clearInterval(blinker);
            var on = true;
            cursor.style.visibility = "";
            blinker = setInterval(function() {
                cursor.style.visibility = (on = !on) ? "" : "hidden";
            }, 650);
        }

        var matching = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<"};
        function matchBrackets(autoclear) {
            var head = sel.inverted ? sel.from : sel.to, line = getLine(head.line), pos = head.ch - 1;
            var match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
            if (!match) return;
            var ch = match.charAt(0), forward = match.charAt(1) == ">", d = forward ? 1 : -1, st = line.styles;
            for (var off = pos + 1, i = 0, e = st.length; i < e; i+=2)
                if ((off -= st[i].length) <= 0) {var style = st[i+1]; break;}

            var stack = [line.text.charAt(pos)], re = /[(){}[\]]/;
            function scan(line, from, to) {
                if (!line.text) return;
                var st = line.styles, pos = forward ? 0 : line.text.length - 1, cur;
                for (var i = forward ? 0 : st.length - 2, e = forward ? st.length : -2; i != e; i += 2*d) {
                    var text = st[i];
                    if (st[i+1] != null && st[i+1] != style) {pos += d * text.length; continue;}
                    for (var j = forward ? 0 : text.length - 1, te = forward ? text.length : -1; j != te; j += d, pos+=d) {
                        if (pos >= from && pos < to && re.test(cur = text.charAt(j))) {
                            var match = matching[cur];
                            if (match.charAt(1) == ">" == forward) stack.push(cur);
                            else if (stack.pop() != match.charAt(0)) return {pos: pos, match: false};
                            else if (!stack.length) return {pos: pos, match: true};
                        }
                    }
                }
            }
            for (var i = head.line, e = forward ? Math.min(i + 100, doc.size) : Math.max(-1, i - 100); i != e; i+=d) {
                var line = getLine(i), first = i == head.line;
                var found = scan(line, first && forward ? pos + 1 : 0, first && !forward ? pos : line.text.length);
                if (found) break;
            }
            if (!found) found = {pos: null, match: false};
            var style = found.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
            var one = markText({line: head.line, ch: pos}, {line: head.line, ch: pos+1}, style),
                two = found.pos != null && markText({line: i, ch: found.pos}, {line: i, ch: found.pos + 1}, style);
            var clear = operation(function(){one.clear(); two && two.clear();});
            if (autoclear) setTimeout(clear, 800);
            else bracketHighlighted = clear;
        }

        // Finds the line to start with when starting a parse. Tries to
        // find a line with a stateAfter, so that it can start with a
        // valid state. If that fails, it returns the line with the
        // smallest indentation, which tends to need the least context to
        // parse correctly.
        function findStartLine(n) {
            var minindent, minline;
            for (var search = n, lim = n - 40; search > lim; --search) {
                if (search == 0) return 0;
                var line = getLine(search-1);
                if (line.stateAfter) return search;
                var indented = line.indentation(options.tabSize);
                if (minline == null || minindent > indented) {
                    minline = search - 1;
                    minindent = indented;
                }
            }
            return minline;
        }
        function getStateBefore(n) {
            var start = findStartLine(n), state = start && getLine(start-1).stateAfter;
            if (!state) state = startState(mode);
            else state = copyState(mode, state);
            doc.iter(start, n, function(line) {
                line.highlight(mode, state, options.tabSize);
                line.stateAfter = copyState(mode, state);
            });
            if (start < n) changes.push({from: start, to: n});
            if (n < doc.size && !getLine(n).stateAfter) work.push(n);
            return state;
        }
        function highlightLines(start, end) {
            var state = getStateBefore(start);
            doc.iter(start, end, function(line) {
                line.highlight(mode, state, options.tabSize);
                line.stateAfter = copyState(mode, state);
            });
        }
        function highlightWorker() {
            var end = +new Date + options.workTime;
            var foundWork = work.length;
            while (work.length) {
                if (!getLine(showingFrom).stateAfter) var task = showingFrom;
                else var task = work.pop();
                if (task >= doc.size) continue;
                var start = findStartLine(task), state = start && getLine(start-1).stateAfter;
                if (state) state = copyState(mode, state);
                else state = startState(mode);

                var unchanged = 0, compare = mode.compareStates, realChange = false,
                    i = start, bail = false;
                doc.iter(i, doc.size, function(line) {
                    var hadState = line.stateAfter;
                    if (+new Date > end) {
                        work.push(i);
                        startWorker(options.workDelay);
                        if (realChange) changes.push({from: task, to: i + 1});
                        return (bail = true);
                    }
                    var changed = line.highlight(mode, state, options.tabSize);
                    if (changed) realChange = true;
                    line.stateAfter = copyState(mode, state);
                    if (compare) {
                        if (hadState && compare(hadState, state)) return true;
                    } else {
                        if (changed !== false || !hadState) unchanged = 0;
                        else if (++unchanged > 3 && (!mode.indent || mode.indent(hadState, "") == mode.indent(state, "")))
                            return true;
                    }
                    ++i;
                });
                if (bail) return;
                if (realChange) changes.push({from: task, to: i + 1});
            }
            if (foundWork && options.onHighlightComplete)
                options.onHighlightComplete(instance);
        }
        function startWorker(time) {
            if (!work.length) return;
            highlight.set(time, operation(highlightWorker));
        }

        // Operations are used to wrap changes in such a way that each
        // change won't have to update the cursor and display (which would
        // be awkward, slow, and error-prone), but instead updates are
        // batched and then all combined and executed at once.
        function startOperation() {
            updateInput = userSelChange = textChanged = null;
            changes = []; selectionChanged = false; callbacks = [];
        }
        function endOperation() {
            var reScroll = false, updated;
            if (selectionChanged) reScroll = !scrollCursorIntoView();
            if (changes.length) updated = updateDisplay(changes, true);
            else {
                if (selectionChanged) updateCursor();
                if (gutterDirty) updateGutter();
            }
            if (reScroll) scrollCursorIntoView();
            if (selectionChanged) {scrollEditorIntoView(); restartBlink();}

            if (focused && !leaveInputAlone &&
                (updateInput === true || (updateInput !== false && selectionChanged)))
                resetInput(userSelChange);

            if (selectionChanged && options.matchBrackets)
                setTimeout(operation(function() {
                    if (bracketHighlighted) {bracketHighlighted(); bracketHighlighted = null;}
                    if (posEq(sel.from, sel.to)) matchBrackets(false);
                }), 20);
            var tc = textChanged, cbs = callbacks; // these can be reset by callbacks
            if (selectionChanged && options.onCursorActivity)
                options.onCursorActivity(instance);
            if (tc && options.onChange && instance)
                options.onChange(instance, tc);
            for (var i = 0; i < cbs.length; ++i) cbs[i](instance);
            if (updated && options.onUpdate) options.onUpdate(instance);
        }
        var nestedOperation = 0;
        function operation(f) {
            return function() {
                if (!nestedOperation++) startOperation();
                try {var result = f.apply(this, arguments);}
                finally {if (!--nestedOperation) endOperation();}
                return result;
            };
        }

        for (var ext in extensions)
            if (extensions.propertyIsEnumerable(ext) &&
                !instance.propertyIsEnumerable(ext))
                instance[ext] = extensions[ext];
        return instance;
    } // (end of function CodeMirror)

    // The default configuration options.
    CodeMirror.defaults = {
        value: "",
        mode: null,
        theme: "default",
        indentUnit: 2,
        indentWithTabs: false,
        tabSize: 4,
        keyMap: "default",
        extraKeys: null,
        electricChars: true,
        onKeyEvent: null,
        lineWrapping: false,
        lineNumbers: false,
        gutter: false,
        fixedGutter: false,
        firstLineNumber: 1,
        readOnly: false,
        onChange: null,
        onCursorActivity: null,
        onGutterClick: null,
        onHighlightComplete: null,
        onUpdate: null,
        onFocus: null, onBlur: null, onScroll: null,
        matchBrackets: false,
        workTime: 100,
        workDelay: 200,
        pollInterval: 100,
        undoDepth: 40,
        tabindex: null,
        document: window.document
    };

    var mac = /Mac/.test(navigator.platform);
    var win = /Win/.test(navigator.platform);

    // Known modes, by name and by MIME
    var modes = {}, mimeModes = {};
    CodeMirror.defineMode = function(name, mode) {
        if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
        modes[name] = mode;
    };
    CodeMirror.defineMIME = function(mime, spec) {
        mimeModes[mime] = spec;
    };
    CodeMirror.getMode = function(options, spec) {
        if (typeof spec == "string" && mimeModes.hasOwnProperty(spec))
            spec = mimeModes[spec];
        if (typeof spec == "string")
            var mname = spec, config = {};
        else if (spec != null)
            var mname = spec.name, config = spec;
        var mfactory = modes[mname];
        if (!mfactory) {
            if (window.console) console.warn("No mode " + mname + " found, falling back to plain text.");
            return CodeMirror.getMode(options, "text/plain");
        }
        return mfactory(options, config || {});
    };
    CodeMirror.listModes = function() {
        var list = [];
        for (var m in modes)
            if (modes.propertyIsEnumerable(m)) list.push(m);
        return list;
    };
    CodeMirror.listMIMEs = function() {
        var list = [];
        for (var m in mimeModes)
            if (mimeModes.propertyIsEnumerable(m)) list.push({mime: m, mode: mimeModes[m]});
        return list;
    };

    var extensions = CodeMirror.extensions = {};
    CodeMirror.defineExtension = function(name, func) {
        extensions[name] = func;
    };

    var commands = CodeMirror.commands = {
        selectAll: function(cm) {cm.setSelection({line: 0, ch: 0}, {line: cm.lineCount() - 1});},
        killLine: function(cm) {
            var from = cm.getCursor(true), to = cm.getCursor(false), sel = !posEq(from, to);
            if (!sel && cm.getLine(from.line).length == from.ch) cm.replaceRange("", from, {line: from.line + 1, ch: 0});
            else cm.replaceRange("", from, sel ? to : {line: from.line});
        },
        deleteLine: function(cm) {var l = cm.getCursor().line; cm.replaceRange("", {line: l, ch: 0}, {line: l});},
        undo: function(cm) {cm.undo();},
        redo: function(cm) {cm.redo();},
        goDocStart: function(cm) {cm.setCursor(0, 0, true);},
        goDocEnd: function(cm) {cm.setSelection({line: cm.lineCount() - 1}, null, true);},
        goLineStart: function(cm) {cm.setCursor(cm.getCursor().line, 0, true);},
        goLineStartSmart: function(cm) {
            var cur = cm.getCursor();
            var text = cm.getLine(cur.line), firstNonWS = Math.max(0, text.search(/\S/));
            cm.setCursor(cur.line, cur.ch <= firstNonWS && cur.ch ? 0 : firstNonWS, true);
        },
        goLineEnd: function(cm) {cm.setSelection({line: cm.getCursor().line}, null, true);},
        goLineUp: function(cm) {cm.moveV(-1, "line");},
        goLineDown: function(cm) {cm.moveV(1, "line");},
        goPageUp: function(cm) {cm.moveV(-1, "page");},
        goPageDown: function(cm) {cm.moveV(1, "page");},
        goCharLeft: function(cm) {cm.moveH(-1, "char");},
        goCharRight: function(cm) {cm.moveH(1, "char");},
        goColumnLeft: function(cm) {cm.moveH(-1, "column");},
        goColumnRight: function(cm) {cm.moveH(1, "column");},
        goWordLeft: function(cm) {cm.moveH(-1, "word");},
        goWordRight: function(cm) {cm.moveH(1, "word");},
        delCharLeft: function(cm) {cm.deleteH(-1, "char");},
        delCharRight: function(cm) {cm.deleteH(1, "char");},
        delWordLeft: function(cm) {cm.deleteH(-1, "word");},
        delWordRight: function(cm) {cm.deleteH(1, "word");},
        indentAuto: function(cm) {cm.indentSelection("smart");},
        indentMore: function(cm) {cm.indentSelection("add");},
        indentLess: function(cm) {cm.indentSelection("subtract");},
        insertTab: function(cm) {cm.replaceSelection("\t", "end");},
        transposeChars: function(cm) {
            var cur = cm.getCursor(), line = cm.getLine(cur.line);
            if (cur.ch > 0 && cur.ch < line.length - 1)
                cm.replaceRange(line.charAt(cur.ch) + line.charAt(cur.ch - 1),
                    {line: cur.line, ch: cur.ch - 1}, {line: cur.line, ch: cur.ch + 1});
        },
        newlineAndIndent: function(cm) {
            cm.replaceSelection("\n", "end");
            cm.indentLine(cm.getCursor().line);
        },
        toggleOverwrite: function(cm) {cm.toggleOverwrite();}
    };

    var keyMap = CodeMirror.keyMap = {};
    keyMap.basic = {
        "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
        "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
        "Delete": "delCharRight", "Backspace": "delCharLeft", "Tab": "indentMore", "Shift-Tab": "indentLess",
        "Enter": "newlineAndIndent", "Insert": "toggleOverwrite"
    };
    // Note that the save and find-related commands aren't defined by
    // default. Unknown commands are simply ignored.
    keyMap.pcDefault = {
        "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart", "Alt-Up": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Down": "goDocEnd",
        "Ctrl-Left": "goWordLeft", "Ctrl-Right": "goWordRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delWordLeft", "Ctrl-Delete": "delWordRight", "Ctrl-S": "save", "Ctrl-F": "find",
        "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
        fallthrough: "basic"
    };
    keyMap.macDefault = {
        "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
        "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goWordLeft",
        "Alt-Right": "goWordRight", "Cmd-Left": "goLineStart", "Cmd-Right": "goLineEnd", "Alt-Backspace": "delWordLeft",
        "Ctrl-Alt-Backspace": "delWordRight", "Alt-Delete": "delWordRight", "Cmd-S": "save", "Cmd-F": "find",
        "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
        fallthrough: ["basic", "emacsy"]
    };
    keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
    keyMap.emacsy = {
        "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
        "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageUp", "Shift-Ctrl-V": "goPageDown", "Ctrl-D": "delCharRight", "Ctrl-H": "delCharLeft",
        "Alt-D": "delWordRight", "Alt-Backspace": "delWordLeft", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
    };

    function lookupKey(name, extraMap, map) {
        function lookup(name, map, ft) {
            var found = map[name];
            if (found != null) return found;
            if (ft == null) ft = map.fallthrough;
            if (ft == null) return map.catchall;
            if (typeof ft == "string") return lookup(name, keyMap[ft]);
            for (var i = 0, e = ft.length; i < e; ++i) {
                found = lookup(name, keyMap[ft[i]]);
                if (found != null) return found;
            }
            return null;
        }
        return extraMap ? lookup(name, extraMap, map) : lookup(name, keyMap[map]);
    }
    function isModifierKey(event) {
        var name = keyNames[event.keyCode];
        return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
    }

    CodeMirror.fromTextArea = function(textarea, options) {
        if (!options) options = {};
        options.value = textarea.value;
        if (!options.tabindex && textarea.tabindex)
            options.tabindex = textarea.tabindex;

        function save() {textarea.value = instance.getValue();}
        if (textarea.form) {
            // Deplorable hack to make the submit method do the right thing.
            var rmSubmit = connect(textarea.form, "submit", save, true);
            if (typeof textarea.form.submit == "function") {
                var realSubmit = textarea.form.submit;
                function wrappedSubmit() {
                    save();
                    textarea.form.submit = realSubmit;
                    textarea.form.submit();
                    textarea.form.submit = wrappedSubmit;
                }
                textarea.form.submit = wrappedSubmit;
            }
        }

        textarea.style.display = "none";
        var instance = CodeMirror(function(node) {
            textarea.parentNode.insertBefore(node, textarea.nextSibling);
        }, options);
        instance.save = save;
        instance.getTextArea = function() { return textarea; };
        instance.toTextArea = function() {
            save();
            textarea.parentNode.removeChild(instance.getWrapperElement());
            textarea.style.display = "";
            if (textarea.form) {
                rmSubmit();
                if (typeof textarea.form.submit == "function")
                    textarea.form.submit = realSubmit;
            }
        };
        return instance;
    };

    // Utility functions for working with state. Exported because modes
    // sometimes need to do this.
    function copyState(mode, state) {
        if (state === true) return state;
        if (mode.copyState) return mode.copyState(state);
        var nstate = {};
        for (var n in state) {
            var val = state[n];
            if (val instanceof Array) val = val.concat([]);
            nstate[n] = val;
        }
        return nstate;
    }
    CodeMirror.copyState = copyState;
    function startState(mode, a1, a2) {
        return mode.startState ? mode.startState(a1, a2) : true;
    }
    CodeMirror.startState = startState;

    // The character stream used by a mode's parser.
    function StringStream(string, tabSize) {
        this.pos = this.start = 0;
        this.string = string;
        this.tabSize = tabSize || 8;
    }
    StringStream.prototype = {
        eol: function() {return this.pos >= this.string.length;},
        sol: function() {return this.pos == 0;},
        peek: function() {return this.string.charAt(this.pos);},
        next: function() {
            if (this.pos < this.string.length)
                return this.string.charAt(this.pos++);
        },
        eat: function(match) {
            var ch = this.string.charAt(this.pos);
            if (typeof match == "string") var ok = ch == match;
            else var ok = ch && (match.test ? match.test(ch) : match(ch));
            if (ok) {++this.pos; return ch;}
        },
        eatWhile: function(match) {
            var start = this.pos;
            while (this.eat(match)){}
            return this.pos > start;
        },
        eatSpace: function() {
            var start = this.pos;
            while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
            return this.pos > start;
        },
        skipToEnd: function() {this.pos = this.string.length;},
        skipTo: function(ch) {
            var found = this.string.indexOf(ch, this.pos);
            if (found > -1) {this.pos = found; return true;}
        },
        backUp: function(n) {this.pos -= n;},
        column: function() {return countColumn(this.string, this.start, this.tabSize);},
        indentation: function() {return countColumn(this.string, null, this.tabSize);},
        match: function(pattern, consume, caseInsensitive) {
            if (typeof pattern == "string") {
                function cased(str) {return caseInsensitive ? str.toLowerCase() : str;}
                if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {
                    if (consume !== false) this.pos += pattern.length;
                    return true;
                }
            }
            else {
                var match = this.string.slice(this.pos).match(pattern);
                if (match && consume !== false) this.pos += match[0].length;
                return match;
            }
        },
        current: function(){return this.string.slice(this.start, this.pos);}
    };
    CodeMirror.StringStream = StringStream;

    function MarkedText(from, to, className, set) {
        this.from = from; this.to = to; this.style = className; this.set = set;
    }
    MarkedText.prototype = {
        attach: function(line) { this.set.push(line); },
        detach: function(line) {
            var ix = indexOf(this.set, line);
            if (ix > -1) this.set.splice(ix, 1);
        },
        split: function(pos, lenBefore) {
            if (this.to <= pos && this.to != null) return null;
            var from = this.from < pos || this.from == null ? null : this.from - pos + lenBefore;
            var to = this.to == null ? null : this.to - pos + lenBefore;
            return new MarkedText(from, to, this.style, this.set);
        },
        dup: function() { return new MarkedText(null, null, this.style, this.set); },
        clipTo: function(fromOpen, from, toOpen, to, diff) {
            if (this.from != null && this.from >= from)
                this.from = Math.max(to, this.from) + diff;
            if (this.to != null && this.to > from)
                this.to = to < this.to ? this.to + diff : from;
            if (fromOpen && to > this.from && (to < this.to || this.to == null))
                this.from = null;
            if (toOpen && (from < this.to || this.to == null) && (from > this.from || this.from == null))
                this.to = null;
        },
        isDead: function() { return this.from != null && this.to != null && this.from >= this.to; },
        sameSet: function(x) { return this.set == x.set; }
    };

    function Bookmark(pos) {
        this.from = pos; this.to = pos; this.line = null;
    }
    Bookmark.prototype = {
        attach: function(line) { this.line = line; },
        detach: function(line) { if (this.line == line) this.line = null; },
        split: function(pos, lenBefore) {
            if (pos < this.from) {
                this.from = this.to = (this.from - pos) + lenBefore;
                return this;
            }
        },
        isDead: function() { return this.from > this.to; },
        clipTo: function(fromOpen, from, toOpen, to, diff) {
            if ((fromOpen || from < this.from) && (toOpen || to > this.to)) {
                this.from = 0; this.to = -1;
            } else if (this.from > from) {
                this.from = this.to = Math.max(to, this.from) + diff;
            }
        },
        sameSet: function(x) { return false; },
        find: function() {
            if (!this.line || !this.line.parent) return null;
            return {line: lineNo(this.line), ch: this.from};
        },
        clear: function() {
            if (this.line) {
                var found = indexOf(this.line.marked, this);
                if (found != -1) this.line.marked.splice(found, 1);
                this.line = null;
            }
        }
    };

    // Line objects. These hold state related to a line, including
    // highlighting info (the styles array).
    function Line(text, styles) {
        this.styles = styles || [text, null];
        this.text = text;
        this.height = 1;
        this.marked = this.gutterMarker = this.className = this.handlers = null;
        this.stateAfter = this.parent = this.hidden = null;
    }
    Line.inheritMarks = function(text, orig) {
        var ln = new Line(text), mk = orig && orig.marked;
        if (mk) {
            for (var i = 0; i < mk.length; ++i) {
                if (mk[i].to == null && mk[i].style) {
                    var newmk = ln.marked || (ln.marked = []), mark = mk[i];
                    var nmark = mark.dup(); newmk.push(nmark); nmark.attach(ln);
                }
            }
        }
        return ln;
    }
    Line.prototype = {
        // Replace a piece of a line, keeping the styles around it intact.
        replace: function(from, to_, text) {
            var st = [], mk = this.marked, to = to_ == null ? this.text.length : to_;
            copyStyles(0, from, this.styles, st);
            if (text) st.push(text, null);
            copyStyles(to, this.text.length, this.styles, st);
            this.styles = st;
            this.text = this.text.slice(0, from) + text + this.text.slice(to);
            this.stateAfter = null;
            if (mk) {
                var diff = text.length - (to - from);
                for (var i = 0, mark = mk[i]; i < mk.length; ++i) {
                    mark.clipTo(from == null, from || 0, to_ == null, to, diff);
                    if (mark.isDead()) {mark.detach(this); mk.splice(i--, 1);}
                }
            }
        },
        // Split a part off a line, keeping styles and markers intact.
        split: function(pos, textBefore) {
            var st = [textBefore, null], mk = this.marked;
            copyStyles(pos, this.text.length, this.styles, st);
            var taken = new Line(textBefore + this.text.slice(pos), st);
            if (mk) {
                for (var i = 0; i < mk.length; ++i) {
                    var mark = mk[i];
                    var newmark = mark.split(pos, textBefore.length);
                    if (newmark) {
                        if (!taken.marked) taken.marked = [];
                        taken.marked.push(newmark); newmark.attach(taken);
                    }
                }
            }
            return taken;
        },
        append: function(line) {
            var mylen = this.text.length, mk = line.marked, mymk = this.marked;
            this.text += line.text;
            copyStyles(0, line.text.length, line.styles, this.styles);
            if (mymk) {
                for (var i = 0; i < mymk.length; ++i)
                    if (mymk[i].to == null) mymk[i].to = mylen;
            }
            if (mk && mk.length) {
                if (!mymk) this.marked = mymk = [];
                outer: for (var i = 0; i < mk.length; ++i) {
                    var mark = mk[i];
                    if (!mark.from) {
                        for (var j = 0; j < mymk.length; ++j) {
                            var mymark = mymk[j];
                            if (mymark.to == mylen && mymark.sameSet(mark)) {
                                mymark.to = mark.to == null ? null : mark.to + mylen;
                                if (mymark.isDead()) {
                                    mymark.detach(this);
                                    mk.splice(i--, 1);
                                }
                                continue outer;
                            }
                        }
                    }
                    mymk.push(mark);
                    mark.attach(this);
                    mark.from += mylen;
                    if (mark.to != null) mark.to += mylen;
                }
            }
        },
        fixMarkEnds: function(other) {
            var mk = this.marked, omk = other.marked;
            if (!mk) return;
            for (var i = 0; i < mk.length; ++i) {
                var mark = mk[i], close = mark.to == null;
                if (close && omk) {
                    for (var j = 0; j < omk.length; ++j)
                        if (omk[j].sameSet(mark)) {close = false; break;}
                }
                if (close) mark.to = this.text.length;
            }
        },
        fixMarkStarts: function() {
            var mk = this.marked;
            if (!mk) return;
            for (var i = 0; i < mk.length; ++i)
                if (mk[i].from == null) mk[i].from = 0;
        },
        addMark: function(mark) {
            mark.attach(this);
            if (this.marked == null) this.marked = [];
            this.marked.push(mark);
            this.marked.sort(function(a, b){return (a.from || 0) - (b.from || 0);});
        },
        // Run the given mode's parser over a line, update the styles
        // array, which contains alternating fragments of text and CSS
        // classes.
        highlight: function(mode, state, tabSize) {
            var stream = new StringStream(this.text, tabSize), st = this.styles, pos = 0;
            var changed = false, curWord = st[0], prevWord;
            if (this.text == "" && mode.blankLine) mode.blankLine(state);
            while (!stream.eol()) {
                var style = mode.token(stream, state);
                var substr = this.text.slice(stream.start, stream.pos);
                stream.start = stream.pos;
                if (pos && st[pos-1] == style)
                    st[pos-2] += substr;
                else if (substr) {
                    if (!changed && (st[pos+1] != style || (pos && st[pos-2] != prevWord))) changed = true;
                    st[pos++] = substr; st[pos++] = style;
                    prevWord = curWord; curWord = st[pos];
                }
                // Give up when line is ridiculously long
                if (stream.pos > 5000) {
                    st[pos++] = this.text.slice(stream.pos); st[pos++] = null;
                    break;
                }
            }
            if (st.length != pos) {st.length = pos; changed = true;}
            if (pos && st[pos-2] != prevWord) changed = true;
            // Short lines with simple highlights return null, and are
            // counted as changed by the driver because they are likely to
            // highlight the same way in various contexts.
            return changed || (st.length < 5 && this.text.length < 10 ? null : false);
        },
        // Fetch the parser token for a given character. Useful for hacks
        // that want to inspect the mode state (say, for completion).
        getTokenAt: function(mode, state, ch) {
            var txt = this.text, stream = new StringStream(txt);
            while (stream.pos < ch && !stream.eol()) {
                stream.start = stream.pos;
                var style = mode.token(stream, state);
            }
            return {start: stream.start,
                end: stream.pos,
                string: stream.current(),
                className: style || null,
                state: state};
        },
        indentation: function(tabSize) {return countColumn(this.text, null, tabSize);},
        // Produces an HTML fragment for the line, taking selection,
        // marking, and highlighting into account.
        getHTML: function(sfrom, sto, includePre, tabText, endAt) {
            var html = [], first = true;
            if (includePre)
                html.push(this.className ? '<pre class="' + this.className + '">': "<pre>");
            function span(text, style) {
                if (!text) return;
                // Work around a bug where, in some compat modes, IE ignores leading spaces
                if (first && ie && text.charAt(0) == " ") text = "\u00a0" + text.slice(1);
                first = false;
                if (style) html.push('<span class="', style, '">', htmlEscape(text).replace(/\t/g, tabText), "</span>");
                else html.push(htmlEscape(text).replace(/\t/g, tabText));
            }
            var st = this.styles, allText = this.text, marked = this.marked;
            if (sfrom == sto) sfrom = null;
            var len = allText.length;
            if (endAt != null) len = Math.min(endAt, len);

            if (!allText && endAt == null)
                span(" ", sfrom != null && sto == null ? "CodeMirror-selected" : null);
            else if (!marked && sfrom == null)
                for (var i = 0, ch = 0; ch < len; i+=2) {
                    var str = st[i], style = st[i+1], l = str.length;
                    if (ch + l > len) str = str.slice(0, len - ch);
                    ch += l;
                    span(str, style && "cm-" + style);
                }
            else {
                var pos = 0, i = 0, text = "", style, sg = 0;
                var markpos = -1, mark = null;
                function nextMark() {
                    if (marked) {
                        markpos += 1;
                        mark = (markpos < marked.length) ? marked[markpos] : null;
                    }
                }
                nextMark();
                while (pos < len) {
                    var upto = len;
                    var extraStyle = "";
                    if (sfrom != null) {
                        if (sfrom > pos) upto = sfrom;
                        else if (sto == null || sto > pos) {
                            extraStyle = " CodeMirror-selected";
                            if (sto != null) upto = Math.min(upto, sto);
                        }
                    }
                    while (mark && mark.to != null && mark.to <= pos) nextMark();
                    if (mark) {
                        if (mark.from > pos) upto = Math.min(upto, mark.from);
                        else {
                            extraStyle += " " + mark.style;
                            if (mark.to != null) upto = Math.min(upto, mark.to);
                        }
                    }
                    for (;;) {
                        var end = pos + text.length;
                        var appliedStyle = style;
                        if (extraStyle) appliedStyle = style ? style + extraStyle : extraStyle;
                        span(end > upto ? text.slice(0, upto - pos) : text, appliedStyle);
                        if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
                        pos = end;
                        text = st[i++]; style = "cm-" + st[i++];
                    }
                }
                if (sfrom != null && sto == null) span(" ", "CodeMirror-selected");
            }
            if (includePre) html.push("</pre>");
            return html.join("");
        },
        cleanUp: function() {
            this.parent = null;
            if (this.marked)
                for (var i = 0, e = this.marked.length; i < e; ++i) this.marked[i].detach(this);
        }
    };
    // Utility used by replace and split above
    function copyStyles(from, to, source, dest) {
        for (var i = 0, pos = 0, state = 0; pos < to; i+=2) {
            var part = source[i], end = pos + part.length;
            if (state == 0) {
                if (end > from) dest.push(part.slice(from - pos, Math.min(part.length, to - pos)), source[i+1]);
                if (end >= from) state = 1;
            }
            else if (state == 1) {
                if (end > to) dest.push(part.slice(0, to - pos), source[i+1]);
                else dest.push(part, source[i+1]);
            }
            pos = end;
        }
    }

    // Data structure that holds the sequence of lines.
    function LeafChunk(lines) {
        this.lines = lines;
        this.parent = null;
        for (var i = 0, e = lines.length, height = 0; i < e; ++i) {
            lines[i].parent = this;
            height += lines[i].height;
        }
        this.height = height;
    }
    LeafChunk.prototype = {
        chunkSize: function() { return this.lines.length; },
        remove: function(at, n, callbacks) {
            for (var i = at, e = at + n; i < e; ++i) {
                var line = this.lines[i];
                this.height -= line.height;
                line.cleanUp();
                if (line.handlers)
                    for (var j = 0; j < line.handlers.length; ++j) callbacks.push(line.handlers[j]);
            }
            this.lines.splice(at, n);
        },
        collapse: function(lines) {
            lines.splice.apply(lines, [lines.length, 0].concat(this.lines));
        },
        insertHeight: function(at, lines, height) {
            this.height += height;
            this.lines.splice.apply(this.lines, [at, 0].concat(lines));
            for (var i = 0, e = lines.length; i < e; ++i) lines[i].parent = this;
        },
        iterN: function(at, n, op) {
            for (var e = at + n; at < e; ++at)
                if (op(this.lines[at])) return true;
        }
    };
    function BranchChunk(children) {
        this.children = children;
        var size = 0, height = 0;
        for (var i = 0, e = children.length; i < e; ++i) {
            var ch = children[i];
            size += ch.chunkSize(); height += ch.height;
            ch.parent = this;
        }
        this.size = size;
        this.height = height;
        this.parent = null;
    }
    BranchChunk.prototype = {
        chunkSize: function() { return this.size; },
        remove: function(at, n, callbacks) {
            this.size -= n;
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    var rm = Math.min(n, sz - at), oldHeight = child.height;
                    child.remove(at, rm, callbacks);
                    this.height -= oldHeight - child.height;
                    if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
                    if ((n -= rm) == 0) break;
                    at = 0;
                } else at -= sz;
            }
            if (this.size - n < 25) {
                var lines = [];
                this.collapse(lines);
                this.children = [new LeafChunk(lines)];
            }
        },
        collapse: function(lines) {
            for (var i = 0, e = this.children.length; i < e; ++i) this.children[i].collapse(lines);
        },
        insert: function(at, lines) {
            var height = 0;
            for (var i = 0, e = lines.length; i < e; ++i) height += lines[i].height;
            this.insertHeight(at, lines, height);
        },
        insertHeight: function(at, lines, height) {
            this.size += lines.length;
            this.height += height;
            for (var i = 0, e = this.children.length; i < e; ++i) {
                var child = this.children[i], sz = child.chunkSize();
                if (at <= sz) {
                    child.insertHeight(at, lines, height);
                    if (child.lines && child.lines.length > 50) {
                        while (child.lines.length > 50) {
                            var spilled = child.lines.splice(child.lines.length - 25, 25);
                            var newleaf = new LeafChunk(spilled);
                            child.height -= newleaf.height;
                            this.children.splice(i + 1, 0, newleaf);
                            newleaf.parent = this;
                        }
                        this.maybeSpill();
                    }
                    break;
                }
                at -= sz;
            }
        },
        maybeSpill: function() {
            if (this.children.length <= 10) return;
            var me = this;
            do {
                var spilled = me.children.splice(me.children.length - 5, 5);
                var sibling = new BranchChunk(spilled);
                if (!me.parent) { // Become the parent node
                    var copy = new BranchChunk(me.children);
                    copy.parent = me;
                    me.children = [copy, sibling];
                    me = copy;
                } else {
                    me.size -= sibling.size;
                    me.height -= sibling.height;
                    var myIndex = indexOf(me.parent.children, me);
                    me.parent.children.splice(myIndex + 1, 0, sibling);
                }
                sibling.parent = me.parent;
            } while (me.children.length > 10);
            me.parent.maybeSpill();
        },
        iter: function(from, to, op) { this.iterN(from, to - from, op); },
        iterN: function(at, n, op) {
            for (var i = 0, e = this.children.length; i < e; ++i) {
                var child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    var used = Math.min(n, sz - at);
                    if (child.iterN(at, used, op)) return true;
                    if ((n -= used) == 0) break;
                    at = 0;
                } else at -= sz;
            }
        }
    };

    function getLineAt(chunk, n) {
        while (!chunk.lines) {
            for (var i = 0;; ++i) {
                var child = chunk.children[i], sz = child.chunkSize();
                if (n < sz) { chunk = child; break; }
                n -= sz;
            }
        }
        return chunk.lines[n];
    }
    function lineNo(line) {
        if (line.parent == null) return null;
        var cur = line.parent, no = indexOf(cur.lines, line);
        for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
            for (var i = 0, e = chunk.children.length; ; ++i) {
                if (chunk.children[i] == cur) break;
                no += chunk.children[i].chunkSize();
            }
        }
        return no;
    }
    function lineAtHeight(chunk, h) {
        var n = 0;
        outer: do {
            for (var i = 0, e = chunk.children.length; i < e; ++i) {
                var child = chunk.children[i], ch = child.height;
                if (h < ch) { chunk = child; continue outer; }
                h -= ch;
                n += child.chunkSize();
            }
            return n;
        } while (!chunk.lines);
        for (var i = 0, e = chunk.lines.length; i < e; ++i) {
            var line = chunk.lines[i], lh = line.height;
            if (h < lh) break;
            h -= lh;
        }
        return n + i;
    }
    function heightAtLine(chunk, n) {
        var h = 0;
        outer: do {
            for (var i = 0, e = chunk.children.length; i < e; ++i) {
                var child = chunk.children[i], sz = child.chunkSize();
                if (n < sz) { chunk = child; continue outer; }
                n -= sz;
                h += child.height;
            }
            return h;
        } while (!chunk.lines);
        for (var i = 0; i < n; ++i) h += chunk.lines[i].height;
        return h;
    }

    // The history object 'chunks' changes that are made close together
    // and at almost the same time into bigger undoable units.
    function History() {
        this.time = 0;
        this.done = []; this.undone = [];
    }
    History.prototype = {
        addChange: function(start, added, old) {
            this.undone.length = 0;
            var time = +new Date, last = this.done[this.done.length - 1];
            if (time - this.time > 400 || !last ||
                last.start > start + added || last.start + last.added < start - last.added + last.old.length)
                this.done.push({start: start, added: added, old: old});
            else {
                var oldoff = 0;
                if (start < last.start) {
                    for (var i = last.start - start - 1; i >= 0; --i)
                        last.old.unshift(old[i]);
                    last.added += last.start - start;
                    last.start = start;
                }
                else if (last.start < start) {
                    oldoff = start - last.start;
                    added += oldoff;
                }
                for (var i = last.added - oldoff, e = old.length; i < e; ++i)
                    last.old.push(old[i]);
                if (last.added < added) last.added = added;
            }
            this.time = time;
        }
    };

    function stopMethod() {e_stop(this);}
    // Ensure an event has a stop method.
    function addStop(event) {
        if (!event.stop) event.stop = stopMethod;
        return event;
    }

    function e_preventDefault(e) {
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }
    function e_stopPropagation(e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
    }
    function e_stop(e) {e_preventDefault(e); e_stopPropagation(e);}
    CodeMirror.e_stop = e_stop;
    CodeMirror.e_preventDefault = e_preventDefault;
    CodeMirror.e_stopPropagation = e_stopPropagation;

    function e_target(e) {return e.target || e.srcElement;}
    function e_button(e) {
        if (e.which) return e.which;
        else if (e.button & 1) return 1;
        else if (e.button & 2) return 3;
        else if (e.button & 4) return 2;
    }

    // Event handler registration. If disconnect is true, it'll return a
    // function that unregisters the handler.
    function connect(node, type, handler, disconnect) {
        if (typeof node.addEventListener == "function") {
            node.addEventListener(type, handler, false);
            if (disconnect) return function() {node.removeEventListener(type, handler, false);};
        }
        else {
            var wrapHandler = function(event) {handler(event || window.event);};
            node.attachEvent("on" + type, wrapHandler);
            if (disconnect) return function() {node.detachEvent("on" + type, wrapHandler);};
        }
    }
    CodeMirror.connect = connect;

    function Delayed() {this.id = null;}
    Delayed.prototype = {set: function(ms, f) {clearTimeout(this.id); this.id = setTimeout(f, ms);}};

    // Detect drag-and-drop
    var dragAndDrop = function() {
        // IE8 has ondragstart and ondrop properties, but doesn't seem to
        // actually support ondragstart the way it's supposed to work.
        if (/MSIE [1-8]\b/.test(navigator.userAgent)) return false;
        var div = document.createElement('div');
        return "draggable" in div;
    }();

    var gecko = /gecko\/\d{7}/i.test(navigator.userAgent);
    var ie = /MSIE \d/.test(navigator.userAgent);
    var webkit = /WebKit\//.test(navigator.userAgent);

    var lineSep = "\n";
    // Feature-detect whether newlines in textareas are converted to \r\n
    (function () {
        var te = document.createElement("textarea");
        te.value = "foo\nbar";
        if (te.value.indexOf("\r") > -1) lineSep = "\r\n";
    }());

    // Counts the column offset in a string, taking tabs into account.
    // Used mostly to find indentation.
    function countColumn(string, end, tabSize) {
        if (end == null) {
            end = string.search(/[^\s\u00a0]/);
            if (end == -1) end = string.length;
        }
        for (var i = 0, n = 0; i < end; ++i) {
            if (string.charAt(i) == "\t") n += tabSize - (n % tabSize);
            else ++n;
        }
        return n;
    }

    function computedStyle(elt) {
        if (elt.currentStyle) return elt.currentStyle;
        return window.getComputedStyle(elt, null);
    }

    // Find the position of an element by following the offsetParent chain.
    // If screen==true, it returns screen (rather than page) coordinates.
    function eltOffset(node, screen) {
        var bod = node.ownerDocument.body;
        var x = 0, y = 0, skipBody = false;
        for (var n = node; n; n = n.offsetParent) {
            var ol = n.offsetLeft, ot = n.offsetTop;
            // Firefox reports weird inverted offsets when the body has a border.
            if (n == bod) { x += Math.abs(ol); y += Math.abs(ot); }
            else { x += ol, y += ot; }
            if (screen && computedStyle(n).position == "fixed")
                skipBody = true;
        }
        var e = screen && !skipBody ? null : bod;
        for (var n = node.parentNode; n != e; n = n.parentNode)
            if (n.scrollLeft != null) { x -= n.scrollLeft; y -= n.scrollTop;}
        return {left: x, top: y};
    }
    // Use the faster and saner getBoundingClientRect method when possible.
    if (document.documentElement.getBoundingClientRect != null) eltOffset = function(node, screen) {
        // Take the parts of bounding client rect that we are interested in so we are able to edit if need be,
        // since the returned value cannot be changed externally (they are kept in sync as the element moves within the page)
        try { var box = node.getBoundingClientRect(); box = { top: box.top, left: box.left }; }
        catch(e) { box = {top: 0, left: 0}; }
        if (!screen) {
            // Get the toplevel scroll, working around browser differences.
            if (window.pageYOffset == null) {
                var t = document.documentElement || document.body.parentNode;
                if (t.scrollTop == null) t = document.body;
                box.top += t.scrollTop; box.left += t.scrollLeft;
            } else {
                box.top += window.pageYOffset; box.left += window.pageXOffset;
            }
        }
        return box;
    };

    // Get a node's text content.
    function eltText(node) {
        return node.textContent || node.innerText || node.nodeValue || "";
    }

    // Operations on {line, ch} objects.
    function posEq(a, b) {return a.line == b.line && a.ch == b.ch;}
    function posLess(a, b) {return a.line < b.line || (a.line == b.line && a.ch < b.ch);}
    function copyPos(x) {return {line: x.line, ch: x.ch};}

    var escapeElement = document.createElement("pre");
    function htmlEscape(str) {
        escapeElement.textContent = str;
        return escapeElement.innerHTML;
    }
    // Recent (late 2011) Opera betas insert bogus newlines at the start
    // of the textContent, so we strip those.
    if (htmlEscape("a") == "\na")
        htmlEscape = function(str) {
            escapeElement.textContent = str;
            return escapeElement.innerHTML.slice(1);
        };
    // Some IEs don't preserve tabs through innerHTML
    else if (htmlEscape("\t") != "\t")
        htmlEscape = function(str) {
            escapeElement.innerHTML = "";
            escapeElement.appendChild(document.createTextNode(str));
            return escapeElement.innerHTML;
        };
    CodeMirror.htmlEscape = htmlEscape;

    // Used to position the cursor after an undo/redo by finding the
    // last edited character.
    function editEnd(from, to) {
        if (!to) return from ? from.length : 0;
        if (!from) return to.length;
        for (var i = from.length, j = to.length; i >= 0 && j >= 0; --i, --j)
            if (from.charAt(i) != to.charAt(j)) break;
        return j + 1;
    }

    function indexOf(collection, elt) {
        if (collection.indexOf) return collection.indexOf(elt);
        for (var i = 0, e = collection.length; i < e; ++i)
            if (collection[i] == elt) return i;
        return -1;
    }
    function isWordChar(ch) {
        return /\w/.test(ch) || ch.toUpperCase() != ch.toLowerCase();
    }

    // See if "".split is the broken IE version, if so, provide an
    // alternative way to split lines.
    var splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
        var pos = 0, nl, result = [];
        while ((nl = string.indexOf("\n", pos)) > -1) {
            result.push(string.slice(pos, string.charAt(nl-1) == "\r" ? nl - 1 : nl));
            pos = nl + 1;
        }
        result.push(string.slice(pos));
        return result;
    } : function(string){return string.split(/\r?\n/);};
    CodeMirror.splitLines = splitLines;

    var hasSelection = window.getSelection ? function(te) {
        try { return te.selectionStart != te.selectionEnd; }
        catch(e) { return false; }
    } : function(te) {
        try {var range = te.ownerDocument.selection.createRange();}
        catch(e) {}
        if (!range || range.parentElement() != te) return false;
        return range.compareEndPoints("StartToEnd", range) != 0;
    };

    CodeMirror.defineMode("null", function() {
        return {token: function(stream) {stream.skipToEnd();}};
    });
    CodeMirror.defineMIME("text/plain", "null");

    var keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
        19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
        36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
        46: "Delete", 59: ";", 91: "Mod", 92: "Mod", 93: "Mod", 186: ";", 187: "=", 188: ",",
        189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 63276: "PageUp",
        63277: "PageDown", 63275: "End", 63273: "Home", 63234: "Left", 63232: "Up", 63235: "Right",
        63233: "Down", 63302: "Insert", 63272: "Delete"};
    CodeMirror.keyNames = keyNames;
    (function() {
        // Number keys
        for (var i = 0; i < 10; i++) keyNames[i + 48] = String(i);
        // Alphabetic keys
        for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
        // Function keys
        for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
    })();

    return CodeMirror;
})();
CodeMirror.defineMode("xml", function(config, parserConfig) {
    var indentUnit = config.indentUnit;
    var Kludges = parserConfig.htmlMode ? {
        autoSelfClosers: {"br": true, "img": true, "hr": true, "link": true, "input": true,
            "meta": true, "col": true, "frame": true, "base": true, "area": true},
        doNotIndent: {"pre": true},
        allowUnquoted: true
    } : {autoSelfClosers: {}, doNotIndent: {}, allowUnquoted: false};
    var alignCDATA = parserConfig.alignCDATA;

    // Return variables for tokenizers
    var tagName, type;

    function inText(stream, state) {
        function chain(parser) {
            state.tokenize = parser;
            return parser(stream, state);
        }

        var ch = stream.next();
        if (ch == "<") {
            if (stream.eat("!")) {
                if (stream.eat("[")) {
                    if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
                    else return null;
                }
                else if (stream.match("--")) return chain(inBlock("comment", "-->"));
                else if (stream.match("DOCTYPE", true, true)) {
                    stream.eatWhile(/[\w\._\-]/);
                    return chain(doctype(1));
                }
                else return null;
            }
            else if (stream.eat("?")) {
                stream.eatWhile(/[\w\._\-]/);
                state.tokenize = inBlock("meta", "?>");
                return "meta";
            }
            else {
                type = stream.eat("/") ? "closeTag" : "openTag";
                stream.eatSpace();
                tagName = "";
                var c;
                while ((c = stream.eat(/[^\s\u00a0=<>\"\'\/?]/))) tagName += c;
                state.tokenize = inTag;
                return "tag";
            }
        }
        else if (ch == "&") {
            stream.eatWhile(/[^;]/);
            stream.eat(";");
            return "atom";
        }
        else {
            stream.eatWhile(/[^&<]/);
            return null;
        }
    }

    function inTag(stream, state) {
        var ch = stream.next();
        if (ch == ">" || (ch == "/" && stream.eat(">"))) {
            state.tokenize = inText;
            type = ch == ">" ? "endTag" : "selfcloseTag";
            return "tag";
        }
        else if (ch == "=") {
            type = "equals";
            return null;
        }
        else if (/[\'\"]/.test(ch)) {
            state.tokenize = inAttribute(ch);
            return state.tokenize(stream, state);
        }
        else {
            stream.eatWhile(/[^\s\u00a0=<>\"\'\/?]/);
            return "word";
        }
    }

    function inAttribute(quote) {
        return function(stream, state) {
            while (!stream.eol()) {
                if (stream.next() == quote) {
                    state.tokenize = inTag;
                    break;
                }
            }
            return "string";
        };
    }

    function inBlock(style, terminator) {
        return function(stream, state) {
            while (!stream.eol()) {
                if (stream.match(terminator)) {
                    state.tokenize = inText;
                    break;
                }
                stream.next();
            }
            return style;
        };
    }
    function doctype(depth) {
        return function(stream, state) {
            var ch;
            while ((ch = stream.next()) != null) {
                if (ch == "<") {
                    state.tokenize = doctype(depth + 1);
                    return state.tokenize(stream, state);
                } else if (ch == ">") {
                    if (depth == 1) {
                        state.tokenize = inText;
                        break;
                    } else {
                        state.tokenize = doctype(depth - 1);
                        return state.tokenize(stream, state);
                    }
                }
            }
            return "meta";
        };
    }

    var curState, setStyle;
    function pass() {
        for (var i = arguments.length - 1; i >= 0; i--) curState.cc.push(arguments[i]);
    }
    function cont() {
        pass.apply(null, arguments);
        return true;
    }

    function pushContext(tagName, startOfLine) {
        var noIndent = Kludges.doNotIndent.hasOwnProperty(tagName) || (curState.context && curState.context.noIndent);
        curState.context = {
            prev: curState.context,
            tagName: tagName,
            indent: curState.indented,
            startOfLine: startOfLine,
            noIndent: noIndent
        };
    }
    function popContext() {
        if (curState.context) curState.context = curState.context.prev;
    }

    function element(type) {
        if (type == "openTag") {
            curState.tagName = tagName;
            return cont(attributes, endtag(curState.startOfLine));
        } else if (type == "closeTag") {
            var err = false;
            if (curState.context) {
                err = curState.context.tagName != tagName;
            } else {
                err = true;
            }
            if (err) setStyle = "error";
            return cont(endclosetag(err));
        }
        return cont();
    }
    function endtag(startOfLine) {
        return function(type) {
            if (type == "selfcloseTag" ||
                (type == "endTag" && Kludges.autoSelfClosers.hasOwnProperty(curState.tagName.toLowerCase())))
                return cont();
            if (type == "endTag") {pushContext(curState.tagName, startOfLine); return cont();}
            return cont();
        };
    }
    function endclosetag(err) {
        return function(type) {
            if (err) setStyle = "error";
            if (type == "endTag") { popContext(); return cont(); }
            setStyle = "error";
            return cont(arguments.callee);
        }
    }

    function attributes(type) {
        if (type == "word") {setStyle = "attribute"; return cont(attributes);}
        if (type == "equals") return cont(attvalue, attributes);
        if (type == "string") {setStyle = "error"; return cont(attributes);}
        return pass();
    }
    function attvalue(type) {
        if (type == "word" && Kludges.allowUnquoted) {setStyle = "string"; return cont();}
        if (type == "string") return cont(attvaluemaybe);
        return pass();
    }
    function attvaluemaybe(type) {
        if (type == "string") return cont(attvaluemaybe);
        else return pass();
    }

    return {
        startState: function() {
            return {tokenize: inText, cc: [], indented: 0, startOfLine: true, tagName: null, context: null};
        },

        token: function(stream, state) {
            if (stream.sol()) {
                state.startOfLine = true;
                state.indented = stream.indentation();
            }
            if (stream.eatSpace()) return null;

            setStyle = type = tagName = null;
            var style = state.tokenize(stream, state);
            state.type = type;
            if ((style || type) && style != "comment") {
                curState = state;
                while (true) {
                    var comb = state.cc.pop() || element;
                    if (comb(type || style)) break;
                }
            }
            state.startOfLine = false;
            return setStyle || style;
        },

        indent: function(state, textAfter, fullLine) {
            var context = state.context;
            if ((state.tokenize != inTag && state.tokenize != inText) ||
                context && context.noIndent)
                return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
            if (alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
            if (context && /^<\//.test(textAfter))
                context = context.prev;
            while (context && !context.startOfLine)
                context = context.prev;
            if (context) return context.indent + indentUnit;
            else return 0;
        },

        compareStates: function(a, b) {
            if (a.indented != b.indented || a.tokenize != b.tokenize) return false;
            for (var ca = a.context, cb = b.context; ; ca = ca.prev, cb = cb.prev) {
                if (!ca || !cb) return ca == cb;
                if (ca.tagName != cb.tagName) return false;
            }
        },

        electricChars: "/"
    };
});

CodeMirror.defineMIME("application/xml", "xml");
CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});
CodeMirror.defineMode("javascript", function(config, parserConfig) {
    var indentUnit = config.indentUnit;
    var jsonMode = parserConfig.json;

    // Tokenizer

    var keywords = function(){
        function kw(type) {return {type: type, style: "keyword"};}
        var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
        var operator = kw("operator"), atom = {type: "atom", style: "atom"};
        return {
            "if": A, "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
            "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C,
            "var": kw("var"), "const": kw("var"), "let": kw("var"),
            "function": kw("function"), "catch": kw("catch"),
            "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
            "in": operator, "typeof": operator, "instanceof": operator,
            "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom
        };
    }();

    var isOperatorChar = /[+\-*&%=<>!?|]/;

    function chain(stream, state, f) {
        state.tokenize = f;
        return f(stream, state);
    }

    function nextUntilUnescaped(stream, end) {
        var escaped = false, next;
        while ((next = stream.next()) != null) {
            if (next == end && !escaped)
                return false;
            escaped = !escaped && next == "\\";
        }
        return escaped;
    }

    // Used as scratch variables to communicate multiple values without
    // consing up tons of objects.
    var type, content;
    function ret(tp, style, cont) {
        type = tp; content = cont;
        return style;
    }

    function jsTokenBase(stream, state) {
        var ch = stream.next();
        if (ch == '"' || ch == "'")
            return chain(stream, state, jsTokenString(ch));
        else if (/[\[\]{}\(\),;\:\.]/.test(ch))
            return ret(ch);
        else if (ch == "0" && stream.eat(/x/i)) {
            stream.eatWhile(/[\da-f]/i);
            return ret("number", "number");
        }
        else if (/\d/.test(ch)) {
            stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
            return ret("number", "number");
        }
        else if (ch == "/") {
            if (stream.eat("*")) {
                return chain(stream, state, jsTokenComment);
            }
            else if (stream.eat("/")) {
                stream.skipToEnd();
                return ret("comment", "comment");
            }
            else if (state.reAllowed) {
                nextUntilUnescaped(stream, "/");
                stream.eatWhile(/[gimy]/); // 'y' is "sticky" option in Mozilla
                return ret("regexp", "string");
            }
            else {
                stream.eatWhile(isOperatorChar);
                return ret("operator", null, stream.current());
            }
        }
        else if (ch == "#") {
            stream.skipToEnd();
            return ret("error", "error");
        }
        else if (isOperatorChar.test(ch)) {
            stream.eatWhile(isOperatorChar);
            return ret("operator", null, stream.current());
        }
        else {
            stream.eatWhile(/[\w\$_]/);
            var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
            return (known && state.kwAllowed) ? ret(known.type, known.style, word) :
                ret("variable", "variable", word);
        }
    }

    function jsTokenString(quote) {
        return function(stream, state) {
            if (!nextUntilUnescaped(stream, quote))
                state.tokenize = jsTokenBase;
            return ret("string", "string");
        };
    }

    function jsTokenComment(stream, state) {
        var maybeEnd = false, ch;
        while (ch = stream.next()) {
            if (ch == "/" && maybeEnd) {
                state.tokenize = jsTokenBase;
                break;
            }
            maybeEnd = (ch == "*");
        }
        return ret("comment", "comment");
    }

    // Parser

    var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true};

    function JSLexical(indented, column, type, align, prev, info) {
        this.indented = indented;
        this.column = column;
        this.type = type;
        this.prev = prev;
        this.info = info;
        if (align != null) this.align = align;
    }

    function inScope(state, varname) {
        for (var v = state.localVars; v; v = v.next)
            if (v.name == varname) return true;
    }

    function parseJS(state, style, type, content, stream) {
        var cc = state.cc;
        // Communicate our context to the combinators.
        // (Less wasteful than consing up a hundred closures on every call.)
        cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc;

        if (!state.lexical.hasOwnProperty("align"))
            state.lexical.align = true;

        while(true) {
            var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
            if (combinator(type, content)) {
                while(cc.length && cc[cc.length - 1].lex)
                    cc.pop()();
                if (cx.marked) return cx.marked;
                if (type == "variable" && inScope(state, content)) return "variable-2";
                return style;
            }
        }
    }

    // Combinator utils

    var cx = {state: null, column: null, marked: null, cc: null};
    function pass() {
        for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
    }
    function cont() {
        pass.apply(null, arguments);
        return true;
    }
    function register(varname) {
        var state = cx.state;
        if (state.context) {
            cx.marked = "def";
            for (var v = state.localVars; v; v = v.next)
                if (v.name == varname) return;
            state.localVars = {name: varname, next: state.localVars};
        }
    }

    // Combinators

    var defaultVars = {name: "this", next: {name: "arguments"}};
    function pushcontext() {
        if (!cx.state.context) cx.state.localVars = defaultVars;
        cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    }
    function popcontext() {
        cx.state.localVars = cx.state.context.vars;
        cx.state.context = cx.state.context.prev;
    }
    function pushlex(type, info) {
        var result = function() {
            var state = cx.state;
            state.lexical = new JSLexical(state.indented, cx.stream.column(), type, null, state.lexical, info)
        };
        result.lex = true;
        return result;
    }
    function poplex() {
        var state = cx.state;
        if (state.lexical.prev) {
            if (state.lexical.type == ")")
                state.indented = state.lexical.indented;
            state.lexical = state.lexical.prev;
        }
    }
    poplex.lex = true;

    function expect(wanted) {
        return function expecting(type) {
            if (type == wanted) return cont();
            else if (wanted == ";") return pass();
            else return cont(arguments.callee);
        };
    }

    function statement(type) {
        if (type == "var") return cont(pushlex("vardef"), vardef1, expect(";"), poplex);
        if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
        if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
        if (type == "{") return cont(pushlex("}"), block, poplex);
        if (type == ";") return cont();
        if (type == "function") return cont(functiondef);
        if (type == "for") return cont(pushlex("form"), expect("("), pushlex(")"), forspec1, expect(")"),
            poplex, statement, poplex);
        if (type == "variable") return cont(pushlex("stat"), maybelabel);
        if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
            block, poplex, poplex);
        if (type == "case") return cont(expression, expect(":"));
        if (type == "default") return cont(expect(":"));
        if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
            statement, poplex, popcontext);
        return pass(pushlex("stat"), expression, expect(";"), poplex);
    }
    function expression(type) {
        if (atomicTypes.hasOwnProperty(type)) return cont(maybeoperator);
        if (type == "function") return cont(functiondef);
        if (type == "keyword c") return cont(maybeexpression);
        if (type == "(") return cont(pushlex(")"), expression, expect(")"), poplex, maybeoperator);
        if (type == "operator") return cont(expression);
        if (type == "[") return cont(pushlex("]"), commasep(expression, "]"), poplex, maybeoperator);
        if (type == "{") return cont(pushlex("}"), commasep(objprop, "}"), poplex, maybeoperator);
        return cont();
    }
    function maybeexpression(type) {
        if (type.match(/[;\}\)\],]/)) return pass();
        return pass(expression);
    }

    function maybeoperator(type, value) {
        if (type == "operator" && /\+\+|--/.test(value)) return cont(maybeoperator);
        if (type == "operator") return cont(expression);
        if (type == ";") return;
        if (type == "(") return cont(pushlex(")"), commasep(expression, ")"), poplex, maybeoperator);
        if (type == ".") return cont(property, maybeoperator);
        if (type == "[") return cont(pushlex("]"), expression, expect("]"), poplex, maybeoperator);
    }
    function maybelabel(type) {
        if (type == ":") return cont(poplex, statement);
        return pass(maybeoperator, expect(";"), poplex);
    }
    function property(type) {
        if (type == "variable") {cx.marked = "property"; return cont();}
    }
    function objprop(type) {
        if (type == "variable") cx.marked = "property";
        if (atomicTypes.hasOwnProperty(type)) return cont(expect(":"), expression);
    }
    function commasep(what, end) {
        function proceed(type) {
            if (type == ",") return cont(what, proceed);
            if (type == end) return cont();
            return cont(expect(end));
        }
        return function commaSeparated(type) {
            if (type == end) return cont();
            else return pass(what, proceed);
        };
    }
    function block(type) {
        if (type == "}") return cont();
        return pass(statement, block);
    }
    function vardef1(type, value) {
        if (type == "variable"){register(value); return cont(vardef2);}
        return cont();
    }
    function vardef2(type, value) {
        if (value == "=") return cont(expression, vardef2);
        if (type == ",") return cont(vardef1);
    }
    function forspec1(type) {
        if (type == "var") return cont(vardef1, forspec2);
        if (type == ";") return pass(forspec2);
        if (type == "variable") return cont(formaybein);
        return pass(forspec2);
    }
    function formaybein(type, value) {
        if (value == "in") return cont(expression);
        return cont(maybeoperator, forspec2);
    }
    function forspec2(type, value) {
        if (type == ";") return cont(forspec3);
        if (value == "in") return cont(expression);
        return cont(expression, expect(";"), forspec3);
    }
    function forspec3(type) {
        if (type != ")") cont(expression);
    }
    function functiondef(type, value) {
        if (type == "variable") {register(value); return cont(functiondef);}
        if (type == "(") return cont(pushlex(")"), pushcontext, commasep(funarg, ")"), poplex, statement, popcontext);
    }
    function funarg(type, value) {
        if (type == "variable") {register(value); return cont();}
    }

    // Interface

    return {
        startState: function(basecolumn) {
            return {
                tokenize: jsTokenBase,
                reAllowed: true,
                kwAllowed: true,
                cc: [],
                lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
                localVars: null,
                context: null,
                indented: 0
            };
        },

        token: function(stream, state) {
            if (stream.sol()) {
                if (!state.lexical.hasOwnProperty("align"))
                    state.lexical.align = false;
                state.indented = stream.indentation();
            }
            if (stream.eatSpace()) return null;
            var style = state.tokenize(stream, state);
            if (type == "comment") return style;
            state.reAllowed = type == "operator" || type == "keyword c" || type.match(/^[\[{}\(,;:]$/);
            state.kwAllowed = type != '.';
            return parseJS(state, style, type, content, stream);
        },

        indent: function(state, textAfter) {
            if (state.tokenize != jsTokenBase) return 0;
            var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical,
                type = lexical.type, closing = firstChar == type;
            if (type == "vardef") return lexical.indented + 4;
            else if (type == "form" && firstChar == "{") return lexical.indented;
            else if (type == "stat" || type == "form") return lexical.indented + indentUnit;
            else if (lexical.info == "switch" && !closing)
                return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
            else if (lexical.align) return lexical.column + (closing ? 0 : 1);
            else return lexical.indented + (closing ? 0 : indentUnit);
        },

        electricChars: ":{}"
    };
});

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});

CodeMirror.defineMode("css", function(config) {
    var indentUnit = config.indentUnit, type;
    function ret(style, tp) {type = tp; return style;}

    function tokenBase(stream, state) {
        var ch = stream.next();
        if (ch == "@") {stream.eatWhile(/[\w\\\-]/); return ret("meta", stream.current());}
        else if (ch == "/" && stream.eat("*")) {
            state.tokenize = tokenCComment;
            return tokenCComment(stream, state);
        }
        else if (ch == "<" && stream.eat("!")) {
            state.tokenize = tokenSGMLComment;
            return tokenSGMLComment(stream, state);
        }
        else if (ch == "=") ret(null, "compare");
        else if ((ch == "~" || ch == "|") && stream.eat("=")) return ret(null, "compare");
        else if (ch == "\"" || ch == "'") {
            state.tokenize = tokenString(ch);
            return state.tokenize(stream, state);
        }
        else if (ch == "#") {
            stream.eatWhile(/[\w\\\-]/);
            return ret("atom", "hash");
        }
        else if (ch == "!") {
            stream.match(/^\s*\w*/);
            return ret("keyword", "important");
        }
        else if (/\d/.test(ch)) {
            stream.eatWhile(/[\w.%]/);
            return ret("number", "unit");
        }
        else if (/[,.+>*\/]/.test(ch)) {
            return ret(null, "select-op");
        }
        else if (/[;{}:\[\]]/.test(ch)) {
            return ret(null, ch);
        }
        else {
            stream.eatWhile(/[\w\\\-]/);
            return ret("variable", "variable");
        }
    }

    function tokenCComment(stream, state) {
        var maybeEnd = false, ch;
        while ((ch = stream.next()) != null) {
            if (maybeEnd && ch == "/") {
                state.tokenize = tokenBase;
                break;
            }
            maybeEnd = (ch == "*");
        }
        return ret("comment", "comment");
    }

    function tokenSGMLComment(stream, state) {
        var dashes = 0, ch;
        while ((ch = stream.next()) != null) {
            if (dashes >= 2 && ch == ">") {
                state.tokenize = tokenBase;
                break;
            }
            dashes = (ch == "-") ? dashes + 1 : 0;
        }
        return ret("comment", "comment");
    }

    function tokenString(quote) {
        return function(stream, state) {
            var escaped = false, ch;
            while ((ch = stream.next()) != null) {
                if (ch == quote && !escaped)
                    break;
                escaped = !escaped && ch == "\\";
            }
            if (!escaped) state.tokenize = tokenBase;
            return ret("string", "string");
        };
    }

    return {
        startState: function(base) {
            return {tokenize: tokenBase,
                baseIndent: base || 0,
                stack: []};
        },

        token: function(stream, state) {
            if (stream.eatSpace()) return null;
            var style = state.tokenize(stream, state);

            var context = state.stack[state.stack.length-1];
            if (type == "hash" && context == "rule") style = "atom";
            else if (style == "variable") {
                if (context == "rule") style = "number";
                else if (!context || context == "@media{") style = "tag";
            }

            if (context == "rule" && /^[\{\};]$/.test(type))
                state.stack.pop();
            if (type == "{") {
                if (context == "@media") state.stack[state.stack.length-1] = "@media{";
                else state.stack.push("{");
            }
            else if (type == "}") state.stack.pop();
            else if (type == "@media") state.stack.push("@media");
            else if (context == "{" && type != "comment") state.stack.push("rule");
            return style;
        },

        indent: function(state, textAfter) {
            var n = state.stack.length;
            if (/^\}/.test(textAfter))
                n -= state.stack[state.stack.length-1] == "rule" ? 2 : 1;
            return state.baseIndent + n * indentUnit;
        },

        electricChars: "}"
    };
});

CodeMirror.defineMIME("text/css", "css");
CodeMirror.defineMode("htmlmixed", function(config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {name: "xml", htmlMode: true});
    var jsMode = CodeMirror.getMode(config, "javascript");
    var cssMode = CodeMirror.getMode(config, "css");

    function html(stream, state) {
        var style = htmlMode.token(stream, state.htmlState);
        if (style == "tag" && stream.current() == ">" && state.htmlState.context) {
            if (/^script$/i.test(state.htmlState.context.tagName)) {
                state.token = javascript;
                state.localState = jsMode.startState(htmlMode.indent(state.htmlState, ""));
                state.mode = "javascript";
            }
            else if (/^style$/i.test(state.htmlState.context.tagName)) {
                state.token = css;
                state.localState = cssMode.startState(htmlMode.indent(state.htmlState, ""));
                state.mode = "css";
            }
        }
        return style;
    }
    function maybeBackup(stream, pat, style) {
        var cur = stream.current();
        var close = cur.search(pat);
        if (close > -1) stream.backUp(cur.length - close);
        return style;
    }
    function javascript(stream, state) {
        if (stream.match(/^<\/\s*script\s*>/i, false)) {
            state.token = html;
            state.curState = null;
            state.mode = "html";
            return html(stream, state);
        }
        return maybeBackup(stream, /<\/\s*script\s*>/,
            jsMode.token(stream, state.localState));
    }
    function css(stream, state) {
        if (stream.match(/^<\/\s*style\s*>/i, false)) {
            state.token = html;
            state.localState = null;
            state.mode = "html";
            return html(stream, state);
        }
        return maybeBackup(stream, /<\/\s*style\s*>/,
            cssMode.token(stream, state.localState));
    }

    return {
        startState: function() {
            var state = htmlMode.startState();
            return {token: html, localState: null, mode: "html", htmlState: state};
        },

        copyState: function(state) {
            if (state.localState)
                var local = CodeMirror.copyState(state.token == css ? cssMode : jsMode, state.localState);
            return {token: state.token, localState: local, mode: state.mode,
                htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
        },

        token: function(stream, state) {
            return state.token(stream, state);
        },

        indent: function(state, textAfter) {
            if (state.token == html || /^\s*<\//.test(textAfter))
                return htmlMode.indent(state.htmlState, textAfter);
            else if (state.token == javascript)
                return jsMode.indent(state.localState, textAfter);
            else
                return cssMode.indent(state.localState, textAfter);
        },

        compareStates: function(a, b) {
            return htmlMode.compareStates(a.htmlState, b.htmlState);
        },

        electricChars: "/{}:"
    }
});

CodeMirror.defineMIME("text/html", "htmlmixed");
