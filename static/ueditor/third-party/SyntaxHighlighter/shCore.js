// XRegExp 1.5.1
// (c) 2007-2012 Steven Levithan
// MIT License
// <http://xregexp.com>
// Provides an augmented, extensible, cross-browser implementation of regular expressions,
// including support for additional syntax, flags, and methods

var XRegExp;

if (XRegExp) {
    // Avoid running twice, since that would break references to native globals
    throw Error("can't load XRegExp twice in the same frame");
}

// Run within an anonymous function to protect variables and avoid new globals
(function (undefined) {

    //---------------------------------
    //  Constructor
    //---------------------------------

    // Accepts a pattern and flags; returns a new, extended `RegExp` object. Differs from a native
    // regular expression in that additional syntax and flags are supported and cross-browser
    // syntax inconsistencies are ameliorated. `XRegExp(/regex/)` clones an existing regex and
    // converts to type XRegExp
    XRegExp = function (pattern, flags) {
        var output = [],
            currScope = XRegExp.OUTSIDE_CLASS,
            pos = 0,
            context, tokenResult, match, chr, regex;

        if (XRegExp.isRegExp(pattern)) {
            if (flags !== undefined)
                throw TypeError("can't supply flags when constructing one RegExp from another");
            return clone(pattern);
        }
        // Tokens become part of the regex construction process, so protect against infinite
        // recursion when an XRegExp is constructed within a token handler or trigger
        if (isInsideConstructor)
            throw Error("can't call the XRegExp constructor within token definition functions");

        flags = flags || "";
        context = { // `this` object for custom tokens
            hasNamedCapture: false,
            captureNames: [],
            hasFlag: function (flag) {return flags.indexOf(flag) > -1;},
            setFlag: function (flag) {flags += flag;}
        };

        while (pos < pattern.length) {
            // Check for custom tokens at the current position
            tokenResult = runTokens(pattern, pos, currScope, context);

            if (tokenResult) {
                output.push(tokenResult.output);
                pos += (tokenResult.match[0].length || 1);
            } else {
                // Check for native multicharacter metasequences (excluding character classes) at
                // the current position
                if (match = nativ.exec.call(nativeTokens[currScope], pattern.slice(pos))) {
                    output.push(match[0]);
                    pos += match[0].length;
                } else {
                    chr = pattern.charAt(pos);
                    if (chr === "[")
                        currScope = XRegExp.INSIDE_CLASS;
                    else if (chr === "]")
                        currScope = XRegExp.OUTSIDE_CLASS;
                    // Advance position one character
                    output.push(chr);
                    pos++;
                }
            }
        }

        regex = RegExp(output.join(""), nativ.replace.call(flags, flagClip, ""));
        regex._xregexp = {
            source: pattern,
            captureNames: context.hasNamedCapture ? context.captureNames : null
        };
        return regex;
    };


    //---------------------------------
    //  Public properties
    //---------------------------------

    XRegExp.version = "1.5.1";

    // Token scope bitflags
    XRegExp.INSIDE_CLASS = 1;
    XRegExp.OUTSIDE_CLASS = 2;


    //---------------------------------
    //  Private variables
    //---------------------------------

    var replacementToken = /\$(?:(\d\d?|[$&`'])|{([$\w]+)})/g,
        flagClip = /[^gimy]+|([\s\S])(?=[\s\S]*\1)/g, // Nonnative and duplicate flags
        quantifier = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,
        isInsideConstructor = false,
        tokens = [],
    // Copy native globals for reference ("native" is an ES3 reserved keyword)
        nativ = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        compliantExecNpcg = nativ.exec.call(/()??/, "")[1] === undefined, // check `exec` handling of nonparticipating capturing groups
        compliantLastIndexIncrement = function () {
            var x = /^/g;
            nativ.test.call(x, "");
            return !x.lastIndex;
        }(),
        hasNativeY = RegExp.prototype.sticky !== undefined,
        nativeTokens = {};

    // `nativeTokens` match native multicharacter metasequences only (including deprecated octals,
    // excluding character classes)
    nativeTokens[XRegExp.INSIDE_CLASS] = /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/;
    nativeTokens[XRegExp.OUTSIDE_CLASS] = /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/;


    //---------------------------------
    //  Public methods
    //---------------------------------

    // Lets you extend or change XRegExp syntax and create custom flags. This is used internally by
    // the XRegExp library and can be used to create XRegExp plugins. This function is intended for
    // users with advanced knowledge of JavaScript's regular expression syntax and behavior. It can
    // be disabled by `XRegExp.freezeTokens`
    XRegExp.addToken = function (regex, handler, scope, trigger) {
        tokens.push({
            pattern: clone(regex, "g" + (hasNativeY ? "y" : "")),
            handler: handler,
            scope: scope || XRegExp.OUTSIDE_CLASS,
            trigger: trigger || null
        });
    };

    // Accepts a pattern and flags; returns an extended `RegExp` object. If the pattern and flag
    // combination has previously been cached, the cached copy is returned; otherwise the newly
    // created regex is cached
    XRegExp.cache = function (pattern, flags) {
        var key = pattern + "/" + (flags || "");
        return XRegExp.cache[key] || (XRegExp.cache[key] = XRegExp(pattern, flags));
    };

    // Accepts a `RegExp` instance; returns a copy with the `/g` flag set. The copy has a fresh
    // `lastIndex` (set to zero). If you want to copy a regex without forcing the `global`
    // property, use `XRegExp(regex)`. Do not use `RegExp(regex)` because it will not preserve
    // special properties required for named capture
    XRegExp.copyAsGlobal = function (regex) {
        return clone(regex, "g");
    };

    // Accepts a string; returns the string with regex metacharacters escaped. The returned string
    // can safely be used at any point within a regex to match the provided literal string. Escaped
    // characters are [ ] { } ( ) * + ? - . , \ ^ $ | # and whitespace
    XRegExp.escape = function (str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // Accepts a string to search, regex to search with, position to start the search within the
    // string (default: 0), and an optional Boolean indicating whether matches must start at-or-
    // after the position or at the specified position only. This function ignores the `lastIndex`
    // of the provided regex in its own handling, but updates the property for compatibility
    XRegExp.execAt = function (str, regex, pos, anchored) {
        var r2 = clone(regex, "g" + ((anchored && hasNativeY) ? "y" : "")),
            match;
        r2.lastIndex = pos = pos || 0;
        match = r2.exec(str); // Run the altered `exec` (required for `lastIndex` fix, etc.)
        if (anchored && match && match.index !== pos)
            match = null;
        if (regex.global)
            regex.lastIndex = match ? r2.lastIndex : 0;
        return match;
    };

    // Breaks the unrestorable link to XRegExp's private list of tokens, thereby preventing
    // syntax and flag changes. Should be run after XRegExp and any plugins are loaded
    XRegExp.freezeTokens = function () {
        XRegExp.addToken = function () {
            throw Error("can't run addToken after freezeTokens");
        };
    };

    // Accepts any value; returns a Boolean indicating whether the argument is a `RegExp` object.
    // Note that this is also `true` for regex literals and regexes created by the `XRegExp`
    // constructor. This works correctly for variables created in another frame, when `instanceof`
    // and `constructor` checks would fail to work as intended
    XRegExp.isRegExp = function (o) {
        return Object.prototype.toString.call(o) === "[object RegExp]";
    };

    // Executes `callback` once per match within `str`. Provides a simpler and cleaner way to
    // iterate over regex matches compared to the traditional approaches of subverting
    // `String.prototype.replace` or repeatedly calling `exec` within a `while` loop
    XRegExp.iterate = function (str, regex, callback, context) {
        var r2 = clone(regex, "g"),
            i = -1, match;
        while (match = r2.exec(str)) { // Run the altered `exec` (required for `lastIndex` fix, etc.)
            if (regex.global)
                regex.lastIndex = r2.lastIndex; // Doing this to follow expectations if `lastIndex` is checked within `callback`
            callback.call(context, match, ++i, str, regex);
            if (r2.lastIndex === match.index)
                r2.lastIndex++;
        }
        if (regex.global)
            regex.lastIndex = 0;
    };

    // Accepts a string and an array of regexes; returns the result of using each successive regex
    // to search within the matches of the previous regex. The array of regexes can also contain
    // objects with `regex` and `backref` properties, in which case the named or numbered back-
    // references specified are passed forward to the next regex or returned. E.g.:
    // var xregexpImgFileNames = XRegExp.matchChain(html, [
    //     {regex: /<img\b([^>]+)>/i, backref: 1}, // <img> tag attributes
    //     {regex: XRegExp('(?ix) \\s src=" (?<src> [^"]+ )'), backref: "src"}, // src attribute values
    //     {regex: XRegExp("^http://xregexp\\.com(/[^#?]+)", "i"), backref: 1}, // xregexp.com paths
    //     /[^\/]+$/ // filenames (strip directory paths)
    // ]);
    XRegExp.matchChain = function (str, chain) {
        return function recurseChain (values, level) {
            var item = chain[level].regex ? chain[level] : {regex: chain[level]},
                regex = clone(item.regex, "g"),
                matches = [], i;
            for (i = 0; i < values.length; i++) {
                XRegExp.iterate(values[i], regex, function (match) {
                    matches.push(item.backref ? (match[item.backref] || "") : match[0]);
                });
            }
            return ((level === chain.length - 1) || !matches.length) ?
                matches : recurseChain(matches, level + 1);
        }([str], 0);
    };


    //---------------------------------
    //  New RegExp prototype methods
    //---------------------------------

    // Accepts a context object and arguments array; returns the result of calling `exec` with the
    // first value in the arguments array. the context is ignored but is accepted for congruity
    // with `Function.prototype.apply`
    RegExp.prototype.apply = function (context, args) {
        return this.exec(args[0]);
    };

    // Accepts a context object and string; returns the result of calling `exec` with the provided
    // string. the context is ignored but is accepted for congruity with `Function.prototype.call`
    RegExp.prototype.call = function (context, str) {
        return this.exec(str);
    };


    //---------------------------------
    //  Overriden native methods
    //---------------------------------

    // Adds named capture support (with backreferences returned as `result.name`), and fixes two
    // cross-browser issues per ES3:
    // - Captured values for nonparticipating capturing groups should be returned as `undefined`,
    //   rather than the empty string.
    // - `lastIndex` should not be incremented after zero-length matches.
    RegExp.prototype.exec = function (str) {
        var match, name, r2, origLastIndex;
        if (!this.global)
            origLastIndex = this.lastIndex;
        match = nativ.exec.apply(this, arguments);
        if (match) {
            // Fix browsers whose `exec` methods don't consistently return `undefined` for
            // nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
                r2 = RegExp(this.source, nativ.replace.call(getNativeFlags(this), "g", ""));
                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
                // matching due to characters outside the match
                nativ.replace.call((str + "").slice(match.index), r2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined)
                            match[i] = undefined;
                    }
                });
            }
            // Attach named capture properties
            if (this._xregexp && this._xregexp.captureNames) {
                for (var i = 1; i < match.length; i++) {
                    name = this._xregexp.captureNames[i - 1];
                    if (name)
                        match[name] = match[i];
                }
            }
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (!compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
        }
        if (!this.global)
            this.lastIndex = origLastIndex; // Fix IE, Opera bug (last tested IE 9.0.5, Opera 11.61 on Windows)
        return match;
    };

    // Fix browser bugs in native method
    RegExp.prototype.test = function (str) {
        // Use the native `exec` to skip some processing overhead, even though the altered
        // `exec` would take care of the `lastIndex` fixes
        var match, origLastIndex;
        if (!this.global)
            origLastIndex = this.lastIndex;
        match = nativ.exec.call(this, str);
        // Fix browsers that increment `lastIndex` after zero-length matches
        if (match && !compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
            this.lastIndex--;
        if (!this.global)
            this.lastIndex = origLastIndex; // Fix IE, Opera bug (last tested IE 9.0.5, Opera 11.61 on Windows)
        return !!match;
    };

    // Adds named capture support and fixes browser bugs in native method
    String.prototype.match = function (regex) {
        if (!XRegExp.isRegExp(regex))
            regex = RegExp(regex); // Native `RegExp`
        if (regex.global) {
            var result = nativ.match.apply(this, arguments);
            regex.lastIndex = 0; // Fix IE bug
            return result;
        }
        return regex.exec(this); // Run the altered `exec`
    };

    // Adds support for `${n}` tokens for named and numbered backreferences in replacement text,
    // and provides named backreferences to replacement functions as `arguments[0].name`. Also
    // fixes cross-browser differences in replacement text syntax when performing a replacement
    // using a nonregex search value, and the value of replacement regexes' `lastIndex` property
    // during replacement iterations. Note that this doesn't support SpiderMonkey's proprietary
    // third (`flags`) parameter
    String.prototype.replace = function (search, replacement) {
        var isRegex = XRegExp.isRegExp(search),
            captureNames, result, str, origLastIndex;

        // There are too many combinations of search/replacement types/values and browser bugs that
        // preclude passing to native `replace`, so don't try
        //if (...)
        //    return nativ.replace.apply(this, arguments);

        if (isRegex) {
            if (search._xregexp)
                captureNames = search._xregexp.captureNames; // Array or `null`
            if (!search.global)
                origLastIndex = search.lastIndex;
        } else {
            search = search + ""; // Type conversion
        }

        if (Object.prototype.toString.call(replacement) === "[object Function]") {
            result = nativ.replace.call(this + "", search, function () {
                if (captureNames) {
                    // Change the `arguments[0]` string primitive to a String object which can store properties
                    arguments[0] = new String(arguments[0]);
                    // Store named backreferences on `arguments[0]`
                    for (var i = 0; i < captureNames.length; i++) {
                        if (captureNames[i])
                            arguments[0][captureNames[i]] = arguments[i + 1];
                    }
                }
                // Update `lastIndex` before calling `replacement` (fix browsers)
                if (isRegex && search.global)
                    search.lastIndex = arguments[arguments.length - 2] + arguments[0].length;
                return replacement.apply(null, arguments);
            });
        } else {
            str = this + ""; // Type conversion, so `args[args.length - 1]` will be a string (given nonstring `this`)
            result = nativ.replace.call(str, search, function () {
                var args = arguments; // Keep this function's `arguments` available through closure
                return nativ.replace.call(replacement + "", replacementToken, function ($0, $1, $2) {
                    // Numbered backreference (without delimiters) or special variable
                    if ($1) {
                        switch ($1) {
                            case "$": return "$";
                            case "&": return args[0];
                            case "`": return args[args.length - 1].slice(0, args[args.length - 2]);
                            case "'": return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
                            // Numbered backreference
                            default:
                                // What does "$10" mean?
                                // - Backreference 10, if 10 or more capturing groups exist
                                // - Backreference 1 followed by "0", if 1-9 capturing groups exist
                                // - Otherwise, it's the string "$10"
                                // Also note:
                                // - Backreferences cannot be more than two digits (enforced by `replacementToken`)
                                // - "$01" is equivalent to "$1" if a capturing group exists, otherwise it's the string "$01"
                                // - There is no "$0" token ("$&" is the entire match)
                                var literalNumbers = "";
                                $1 = +$1; // Type conversion; drop leading zero
                                if (!$1) // `$1` was "0" or "00"
                                    return $0;
                                while ($1 > args.length - 3) {
                                    literalNumbers = String.prototype.slice.call($1, -1) + literalNumbers;
                                    $1 = Math.floor($1 / 10); // Drop the last digit
                                }
                                return ($1 ? args[$1] || "" : "$") + literalNumbers;
                        }
                        // Named backreference or delimited numbered backreference
                    } else {
                        // What does "${n}" mean?
                        // - Backreference to numbered capture n. Two differences from "$n":
                        //   - n can be more than two digits
                        //   - Backreference 0 is allowed, and is the entire match
                        // - Backreference to named capture n, if it exists and is not a number overridden by numbered capture
                        // - Otherwise, it's the string "${n}"
                        var n = +$2; // Type conversion; drop leading zeros
                        if (n <= args.length - 3)
                            return args[n];
                        n = captureNames ? indexOf(captureNames, $2) : -1;
                        return n > -1 ? args[n + 1] : $0;
                    }
                });
            });
        }

        if (isRegex) {
            if (search.global)
                search.lastIndex = 0; // Fix IE, Safari bug (last tested IE 9.0.5, Safari 5.1.2 on Windows)
            else
                search.lastIndex = origLastIndex; // Fix IE, Opera bug (last tested IE 9.0.5, Opera 11.61 on Windows)
        }

        return result;
    };

    // A consistent cross-browser, ES3 compliant `split`
    String.prototype.split = function (s /* separator */, limit) {
        // If separator `s` is not a regex, use the native `split`
        if (!XRegExp.isRegExp(s))
            return nativ.split.apply(this, arguments);

        var str = this + "", // Type conversion
            output = [],
            lastLastIndex = 0,
            match, lastLength;

        // Behavior for `limit`: if it's...
        // - `undefined`: No limit
        // - `NaN` or zero: Return an empty array
        // - A positive number: Use `Math.floor(limit)`
        // - A negative number: No limit
        // - Other: Type-convert, then use the above rules
        if (limit === undefined || +limit < 0) {
            limit = Infinity;
        } else {
            limit = Math.floor(+limit);
            if (!limit)
                return [];
        }

        // This is required if not `s.global`, and it avoids needing to set `s.lastIndex` to zero
        // and restore it to its original value when we're done using the regex
        s = XRegExp.copyAsGlobal(s);

        while (match = s.exec(str)) { // Run the altered `exec` (required for `lastIndex` fix, etc.)
            if (s.lastIndex > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));

                if (match.length > 1 && match.index < str.length)
                    Array.prototype.push.apply(output, match.slice(1));

                lastLength = match[0].length;
                lastLastIndex = s.lastIndex;

                if (output.length >= limit)
                    break;
            }

            if (s.lastIndex === match.index)
                s.lastIndex++;
        }

        if (lastLastIndex === str.length) {
            if (!nativ.test.call(s, "") || lastLength)
                output.push("");
        } else {
            output.push(str.slice(lastLastIndex));
        }

        return output.length > limit ? output.slice(0, limit) : output;
    };


    //---------------------------------
    //  Private helper functions
    //---------------------------------

    // Supporting function for `XRegExp`, `XRegExp.copyAsGlobal`, etc. Returns a copy of a `RegExp`
    // instance with a fresh `lastIndex` (set to zero), preserving properties required for named
    // capture. Also allows adding new flags in the process of copying the regex
    function clone (regex, additionalFlags) {
        if (!XRegExp.isRegExp(regex))
            throw TypeError("type RegExp expected");
        var x = regex._xregexp;
        regex = XRegExp(regex.source, getNativeFlags(regex) + (additionalFlags || ""));
        if (x) {
            regex._xregexp = {
                source: x.source,
                captureNames: x.captureNames ? x.captureNames.slice(0) : null
            };
        }
        return regex;
    }

    function getNativeFlags (regex) {
        return (regex.global     ? "g" : "") +
            (regex.ignoreCase ? "i" : "") +
            (regex.multiline  ? "m" : "") +
            (regex.extended   ? "x" : "") + // Proposed for ES4; included in AS3
            (regex.sticky     ? "y" : "");
    }

    function runTokens (pattern, index, scope, context) {
        var i = tokens.length,
            result, match, t;
        // Protect against constructing XRegExps within token handler and trigger functions
        isInsideConstructor = true;
        // Must reset `isInsideConstructor`, even if a `trigger` or `handler` throws
        try {
            while (i--) { // Run in reverse order
                t = tokens[i];
                if ((scope & t.scope) && (!t.trigger || t.trigger.call(context))) {
                    t.pattern.lastIndex = index;
                    match = t.pattern.exec(pattern); // Running the altered `exec` here allows use of named backreferences, etc.
                    if (match && match.index === index) {
                        result = {
                            output: t.handler.call(context, match, scope),
                            match: match
                        };
                        break;
                    }
                }
            }
        } catch (err) {
            throw err;
        } finally {
            isInsideConstructor = false;
        }
        return result;
    }

    function indexOf (array, item, from) {
        if (Array.prototype.indexOf) // Use the native array method if available
            return array.indexOf(item, from);
        for (var i = from || 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    }


    //---------------------------------
    //  Built-in tokens
    //---------------------------------

    // Augment XRegExp's regular expression syntax and flags. Note that when adding tokens, the
    // third (`scope`) argument defaults to `XRegExp.OUTSIDE_CLASS`

    // Comment pattern: (?# )
    XRegExp.addToken(
        /\(\?#[^)]*\)/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        }
    );

    // Capturing group (match the opening parenthesis only).
    // Required for support of named capturing groups
    XRegExp.addToken(
        /\((?!\?)/,
        function () {
            this.captureNames.push(null);
            return "(";
        }
    );

    // Named capturing group (match the opening delimiter only): (?<name>
    XRegExp.addToken(
        /\(\?<([$\w]+)>/,
        function (match) {
            this.captureNames.push(match[1]);
            this.hasNamedCapture = true;
            return "(";
        }
    );

    // Named backreference: \k<name>
    XRegExp.addToken(
        /\\k<([\w$]+)>/,
        function (match) {
            var index = indexOf(this.captureNames, match[1]);
            // Keep backreferences separate from subsequent literal numbers. Preserve back-
            // references to named groups that are undefined at this point as literal strings
            return index > -1 ?
                "\\" + (index + 1) + (isNaN(match.input.charAt(match.index + match[0].length)) ? "" : "(?:)") :
                match[0];
        }
    );

    // Empty character class: [] or [^]
    XRegExp.addToken(
        /\[\^?]/,
        function (match) {
            // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
            // (?!) should work like \b\B, but is unreliable in Firefox
            return match[0] === "[]" ? "\\b\\B" : "[\\s\\S]";
        }
    );

    // Mode modifier at the start of the pattern only, with any combination of flags imsx: (?imsx)
    // Does not support x(?i), (?-i), (?i-m), (?i: ), (?i)(?m), etc.
    XRegExp.addToken(
        /^\(\?([imsx]+)\)/,
        function (match) {
            this.setFlag(match[1]);
            return "";
        }
    );

    // Whitespace and comments, in free-spacing (aka extended) mode only
    XRegExp.addToken(
        /(?:\s+|#.*)+/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        },
        XRegExp.OUTSIDE_CLASS,
        function () {return this.hasFlag("x");}
    );

    // Dot, in dotall (aka singleline) mode only
    XRegExp.addToken(
        /\./,
        function () {return "[\\s\\S]";},
        XRegExp.OUTSIDE_CLASS,
        function () {return this.hasFlag("s");}
    );


    //---------------------------------
    //  Backward compatibility
    //---------------------------------

    // Uncomment the following block for compatibility with XRegExp 1.0-1.2:
    /*
     XRegExp.matchWithinChain = XRegExp.matchChain;
     RegExp.prototype.addFlags = function (s) {return clone(this, s);};
     RegExp.prototype.execAll = function (s) {var r = []; XRegExp.iterate(s, this, function (m) {r.push(m);}); return r;};
     RegExp.prototype.forEachExec = function (s, f, c) {return XRegExp.iterate(s, this, f, c);};
     RegExp.prototype.validate = function (s) {var r = RegExp("^(?:" + this.source + ")$(?!\\s)", getNativeFlags(this)); if (this.global) this.lastIndex = 0; return s.search(r) === 0;};
     */

})();

//
// Begin anonymous function. This is used to contain local scope variables without polutting global scope.
//
if (typeof(SyntaxHighlighter) == 'undefined') var SyntaxHighlighter = function() {

// CommonJS
    if (typeof(require) != 'undefined' && typeof(XRegExp) == 'undefined')
    {
        XRegExp = require('XRegExp').XRegExp;
    }

// Shortcut object which will be assigned to the SyntaxHighlighter variable.
// This is a shorthand for local reference in order to avoid long namespace
// references to SyntaxHighlighter.whatever...
    var sh = {
        defaults : {
            /** Additional CSS class names to be added to highlighter elements. */
            'class-name' : '',

            /** First line number. */
            'first-line' : 1,

            /**
             * Pads line numbers. Possible values are:
             *
             *   false - don't pad line numbers.
             *   true  - automaticaly pad numbers with minimum required number of leading zeroes.
             *   [int] - length up to which pad line numbers.
             */
            'pad-line-numbers' : false,

            /** Lines to highlight. */
            'highlight' : false,

            /** Title to be displayed above the code block. */
            'title' : null,

            /** Enables or disables smart tabs. */
            'smart-tabs' : true,

            /** Gets or sets tab size. */
            'tab-size' : 4,

            /** Enables or disables gutter. */
            'gutter' : true,

            /** Enables or disables toolbar. */
            'toolbar' : true,

            /** Enables quick code copy and paste from double click. */
            'quick-code' : true,

            /** Forces code view to be collapsed. */
            'collapse' : false,

            /** Enables or disables automatic links. */
            'auto-links' : false,

            /** Gets or sets light mode. Equavalent to turning off gutter and toolbar. */
            'light' : false,

            'unindent' : true,

            'html-script' : false
        },

        config : {
            space : '&nbsp;',

            /** Enables use of <SCRIPT type="syntaxhighlighter" /> tags. */
            useScriptTags : true,

            /** Blogger mode flag. */
            bloggerMode : false,

            stripBrs : false,

            /** Name of the tag that SyntaxHighlighter will automatically look for. */
            tagName : 'pre',

            strings : {
                expandSource : 'expand source',
                help : '?',
                alert: 'SyntaxHighlighter\n\n',
                noBrush : 'Can\'t find brush for: ',
                brushNotHtmlScript : 'Brush wasn\'t configured for html-script option: ',

                // this is populated by the build script
                aboutDialog : '@ABOUT@'
            }
        },

        /** Internal 'global' variables. */
        vars : {
            discoveredBrushes : null,
            highlighters : {}
        },

        /** This object is populated by user included external brush files. */
        brushes : {},

        /** Common regular expressions. */
        regexLib : {
            multiLineCComments			: /\/\*[\s\S]*?\*\//gm,
            singleLineCComments			: /\/\/.*$/gm,
            singleLinePerlComments		: /#.*$/gm,
            doubleQuotedString			: /"([^\\"\n]|\\.)*"/g,
            singleQuotedString			: /'([^\\'\n]|\\.)*'/g,
            multiLineDoubleQuotedString	: new XRegExp('"([^\\\\"]|\\\\.)*"', 'gs'),
            multiLineSingleQuotedString	: new XRegExp("'([^\\\\']|\\\\.)*'", 'gs'),
            xmlComments					: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
            url							: /\w+:\/\/[\w-.\/?%&=:@;#]*/g,

            /** <?= ?> tags. */
            phpScriptTags 				: { left: /(&lt;|<)\?(?:=|php)?/g, right: /\?(&gt;|>)/g, 'eof' : true },

            /** <%= %> tags. */
            aspScriptTags				: { left: /(&lt;|<)%=?/g, right: /%(&gt;|>)/g },

            /** <script> tags. */
            scriptScriptTags			: { left: /(&lt;|<)\s*script.*?(&gt;|>)/gi, right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi }
        },

        toolbar: {
            /**
             * Generates HTML markup for the toolbar.
             * @param {Highlighter} highlighter Highlighter instance.
             * @return {String} Returns HTML markup.
             */
            getHtml: function(highlighter)
            {
                var html = '<div class="toolbar">',
                    items = sh.toolbar.items,
                    list = items.list
                    ;

                function defaultGetHtml(highlighter, name)
                {
                    return sh.toolbar.getButtonHtml(highlighter, name, sh.config.strings[name]);
                };

                for (var i = 0; i < list.length; i++)
                    html += (items[list[i]].getHtml || defaultGetHtml)(highlighter, list[i]);

                html += '</div>';

                return html;
            },

            /**
             * Generates HTML markup for a regular button in the toolbar.
             * @param {Highlighter} highlighter Highlighter instance.
             * @param {String} commandName		Command name that would be executed.
             * @param {String} label			Label text to display.
             * @return {String}					Returns HTML markup.
             */
            getButtonHtml: function(highlighter, commandName, label)
            {
                return '<span><a href="#" class="toolbar_item'
                    + ' command_' + commandName
                    + ' ' + commandName
                    + '">' + label + '</a></span>'
                    ;
            },

            /**
             * Event handler for a toolbar anchor.
             */
            handler: function(e)
            {
                var target = e.target,
                    className = target.className || ''
                    ;

                function getValue(name)
                {
                    var r = new RegExp(name + '_(\\w+)'),
                        match = r.exec(className)
                        ;

                    return match ? match[1] : null;
                };

                var highlighter = getHighlighterById(findParentElement(target, '.syntaxhighlighter').id),
                    commandName = getValue('command')
                    ;

                // execute the toolbar command
                if (highlighter && commandName)
                    sh.toolbar.items[commandName].execute(highlighter);

                // disable default A click behaviour
                e.preventDefault();
            },

            /** Collection of toolbar items. */
            items : {
                // Ordered lis of items in the toolbar. Can't expect `for (var n in items)` to be consistent.
                list: ['expandSource', 'help'],

                expandSource: {
                    getHtml: function(highlighter)
                    {
                        if (highlighter.getParam('collapse') != true)
                            return '';

                        var title = highlighter.getParam('title');
                        return sh.toolbar.getButtonHtml(highlighter, 'expandSource', title ? title : sh.config.strings.expandSource);
                    },

                    execute: function(highlighter)
                    {
                        var div = getHighlighterDivById(highlighter.id);
                        removeClass(div, 'collapsed');
                    }
                },

                /** Command to display the about dialog window. */
                help: {
                    execute: function(highlighter)
                    {
                        var wnd = popup('', '_blank', 500, 250, 'scrollbars=0'),
                            doc = wnd.document
                            ;

                        doc.write(sh.config.strings.aboutDialog);
                        doc.close();
                        wnd.focus();
                    }
                }
            }
        },

        /**
         * Finds all elements on the page which should be processes by SyntaxHighlighter.
         *
         * @param {Object} globalParams		Optional parameters which override element's
         * 									parameters. Only used if element is specified.
         *
         * @param {Object} element	Optional element to highlight. If none is
         * 							provided, all elements in the current document
         * 							are returned which qualify.
         *
         * @return {Array}	Returns list of <code>{ target: DOMElement, params: Object }</code> objects.
         */
        findElements: function(globalParams, element)
        {
            var elements = element ? [element] : toArray(document.getElementsByTagName(sh.config.tagName)),
                conf = sh.config,
                result = []
                ;

            // support for <SCRIPT TYPE="syntaxhighlighter" /> feature
            if (conf.useScriptTags)
                elements = elements.concat(getSyntaxHighlighterScriptTags());

            if (elements.length === 0)
                return result;

            for (var i = 0; i < elements.length; i++)
            {
                var item = {
                    target: elements[i],
                    // local params take precedence over globals
                    params: merge(globalParams, parseParams(elements[i].className))
                };

                if (item.params['brush'] == null)
                    continue;

                result.push(item);
            }

            return result;
        },

        /**
         * Shorthand to highlight all elements on the page that are marked as
         * SyntaxHighlighter source code.
         *
         * @param {Object} globalParams		Optional parameters which override element's
         * 									parameters. Only used if element is specified.
         *
         * @param {Object} element	Optional element to highlight. If none is
         * 							provided, all elements in the current document
         * 							are highlighted.
         */
        highlight: function(globalParams, element)
        {
            var elements = this.findElements(globalParams, element),
                propertyName = 'innerHTML',
                highlighter = null,
                conf = sh.config
                ;

            if (elements.length === 0)
                return;

            for (var i = 0; i < elements.length; i++)
            {
                var element = elements[i],
                    target = element.target,
                    params = element.params,
                    brushName = params.brush,
                    code
                    ;

                if (brushName == null)
                    continue;

                // Instantiate a brush
                if (params['html-script'] == 'true' || sh.defaults['html-script'] == true)
                {
                    highlighter = new sh.HtmlScript(brushName);
                    brushName = 'htmlscript';
                }
                else
                {
                    var brush = findBrush(brushName);

                    if (brush)
                        highlighter = new brush();
                    else
                        continue;
                }

                code = target[propertyName];

                // remove CDATA from <SCRIPT/> tags if it's present
                if (conf.useScriptTags)
                    code = stripCData(code);

                // Inject title if the attribute is present
                if ((target.title || '') != '')
                    params.title = target.title;

                params['brush'] = brushName;
                highlighter.init(params);
                element = highlighter.getDiv(code);

                // carry over ID
                if ((target.id || '') != '')
                    element.id = target.id;
                //by zhanyi 去掉多余的外围div
                var tmp = element.firstChild.firstChild;
                tmp.className = element.firstChild.className;

                target.parentNode.replaceChild(tmp, target);
            }
        },

        /**
         * Main entry point for the SyntaxHighlighter.
         * @param {Object} params Optional params to apply to all highlighted elements.
         */
        all: function(params)
        {
            attachEvent(
                window,
                'load',
                function() { sh.highlight(params); }
            );
        }
    }; // end of sh

    /**
     * Checks if target DOM elements has specified CSS class.
     * @param {DOMElement} target Target DOM element to check.
     * @param {String} className Name of the CSS class to check for.
     * @return {Boolean} Returns true if class name is present, false otherwise.
     */
    function hasClass(target, className)
    {
        return target.className.indexOf(className) != -1;
    };

    /**
     * Adds CSS class name to the target DOM element.
     * @param {DOMElement} target Target DOM element.
     * @param {String} className New CSS class to add.
     */
    function addClass(target, className)
    {
        if (!hasClass(target, className))
            target.className += ' ' + className;
    };

    /**
     * Removes CSS class name from the target DOM element.
     * @param {DOMElement} target Target DOM element.
     * @param {String} className CSS class to remove.
     */
    function removeClass(target, className)
    {
        target.className = target.className.replace(className, '');
    };

    /**
     * Converts the source to array object. Mostly used for function arguments and
     * lists returned by getElementsByTagName() which aren't Array objects.
     * @param {List} source Source list.
     * @return {Array} Returns array.
     */
    function toArray(source)
    {
        var result = [];

        for (var i = 0; i < source.length; i++)
            result.push(source[i]);

        return result;
    };

    /**
     * Splits block of text into lines.
     * @param {String} block Block of text.
     * @return {Array} Returns array of lines.
     */
    function splitLines(block)
    {
        return block.split(/\r?\n/);
    }

    /**
     * Generates HTML ID for the highlighter.
     * @param {String} highlighterId Highlighter ID.
     * @return {String} Returns HTML ID.
     */
    function getHighlighterId(id)
    {
        var prefix = 'highlighter_';
        return id.indexOf(prefix) == 0 ? id : prefix + id;
    };

    /**
     * Finds Highlighter instance by ID.
     * @param {String} highlighterId Highlighter ID.
     * @return {Highlighter} Returns instance of the highlighter.
     */
    function getHighlighterById(id)
    {
        return sh.vars.highlighters[getHighlighterId(id)];
    };

    /**
     * Finds highlighter's DIV container.
     * @param {String} highlighterId Highlighter ID.
     * @return {Element} Returns highlighter's DIV element.
     */
    function getHighlighterDivById(id)
    {
        return document.getElementById(getHighlighterId(id));
    };

    /**
     * Stores highlighter so that getHighlighterById() can do its thing. Each
     * highlighter must call this method to preserve itself.
     * @param {Highilghter} highlighter Highlighter instance.
     */
    function storeHighlighter(highlighter)
    {
        sh.vars.highlighters[getHighlighterId(highlighter.id)] = highlighter;
    };

    /**
     * Looks for a child or parent node which has specified classname.
     * Equivalent to jQuery's $(container).find(".className")
     * @param {Element} target Target element.
     * @param {String} search Class name or node name to look for.
     * @param {Boolean} reverse If set to true, will go up the node tree instead of down.
     * @return {Element} Returns found child or parent element on null.
     */
    function findElement(target, search, reverse /* optional */)
    {
        if (target == null)
            return null;

        var nodes			= reverse != true ? target.childNodes : [ target.parentNode ],
            propertyToFind	= { '#' : 'id', '.' : 'className' }[search.substr(0, 1)] || 'nodeName',
            expectedValue,
            found
            ;

        expectedValue = propertyToFind != 'nodeName'
            ? search.substr(1)
            : search.toUpperCase()
        ;

        // main return of the found node
        if ((target[propertyToFind] || '').indexOf(expectedValue) != -1)
            return target;

        for (var i = 0; nodes && i < nodes.length && found == null; i++)
            found = findElement(nodes[i], search, reverse);

        return found;
    };

    /**
     * Looks for a parent node which has specified classname.
     * This is an alias to <code>findElement(container, className, true)</code>.
     * @param {Element} target Target element.
     * @param {String} className Class name to look for.
     * @return {Element} Returns found parent element on null.
     */
    function findParentElement(target, className)
    {
        return findElement(target, className, true);
    };

    /**
     * Finds an index of element in the array.
     * @ignore
     * @param {Object} searchElement
     * @param {Number} fromIndex
     * @return {Number} Returns index of element if found; -1 otherwise.
     */
    function indexOf(array, searchElement, fromIndex)
    {
        fromIndex = Math.max(fromIndex || 0, 0);

        for (var i = fromIndex; i < array.length; i++)
            if(array[i] == searchElement)
                return i;

        return -1;
    };

    /**
     * Generates a unique element ID.
     */
    function guid(prefix)
    {
        return (prefix || '') + Math.round(Math.random() * 1000000).toString();
    };

    /**
     * Merges two objects. Values from obj2 override values in obj1.
     * Function is NOT recursive and works only for one dimensional objects.
     * @param {Object} obj1 First object.
     * @param {Object} obj2 Second object.
     * @return {Object} Returns combination of both objects.
     */
    function merge(obj1, obj2)
    {
        var result = {}, name;

        for (name in obj1)
            result[name] = obj1[name];

        for (name in obj2)
            result[name] = obj2[name];

        return result;
    };

    /**
     * Attempts to convert string to boolean.
     * @param {String} value Input string.
     * @return {Boolean} Returns true if input was "true", false if input was "false" and value otherwise.
     */
    function toBoolean(value)
    {
        var result = { "true" : true, "false" : false }[value];
        return result == null ? value : result;
    };

    /**
     * Opens up a centered popup window.
     * @param {String} url		URL to open in the window.
     * @param {String} name		Popup name.
     * @param {int} width		Popup width.
     * @param {int} height		Popup height.
     * @param {String} options	window.open() options.
     * @return {Window}			Returns window instance.
     */
    function popup(url, name, width, height, options)
    {
        var x = (screen.width - width) / 2,
            y = (screen.height - height) / 2
            ;

        options +=	', left=' + x +
            ', top=' + y +
            ', width=' + width +
            ', height=' + height
        ;
        options = options.replace(/^,/, '');

        var win = window.open(url, name, options);
        win.focus();
        return win;
    };

    /**
     * Adds event handler to the target object.
     * @param {Object} obj		Target object.
     * @param {String} type		Name of the event.
     * @param {Function} func	Handling function.
     */
    function attachEvent(obj, type, func, scope)
    {
        function handler(e)
        {
            e = e || window.event;

            if (!e.target)
            {
                e.target = e.srcElement;
                e.preventDefault = function()
                {
                    this.returnValue = false;
                };
            }

            func.call(scope || window, e);
        };

        if (obj.attachEvent)
        {
            obj.attachEvent('on' + type, handler);
        }
        else
        {
            obj.addEventListener(type, handler, false);
        }
    };

    /**
     * Displays an alert.
     * @param {String} str String to display.
     */
    function alert(str)
    {
        window.alert(sh.config.strings.alert + str);
    };

    /**
     * Finds a brush by its alias.
     *
     * @param {String} alias		Brush alias.
     * @param {Boolean} showAlert	Suppresses the alert if false.
     * @return {Brush}				Returns bursh constructor if found, null otherwise.
     */
    function findBrush(alias, showAlert)
    {
        var brushes = sh.vars.discoveredBrushes,
            result = null
            ;

        if (brushes == null)
        {
            brushes = {};

            // Find all brushes
            for (var brush in sh.brushes)
            {
                var info = sh.brushes[brush],
                    aliases = info.aliases
                    ;

                if (aliases == null)
                    continue;

                // keep the brush name
                info.brushName = brush.toLowerCase();

                for (var i = 0; i < aliases.length; i++)
                    brushes[aliases[i]] = brush;
            }

            sh.vars.discoveredBrushes = brushes;
        }

        result = sh.brushes[brushes[alias]];

        if (result == null && showAlert)
            alert(sh.config.strings.noBrush + alias);

        return result;
    };

    /**
     * Executes a callback on each line and replaces each line with result from the callback.
     * @param {Object} str			Input string.
     * @param {Object} callback		Callback function taking one string argument and returning a string.
     */
    function eachLine(str, callback)
    {
        var lines = splitLines(str);

        for (var i = 0; i < lines.length; i++)
            lines[i] = callback(lines[i], i);

        // include \r to enable copy-paste on windows (ie8) without getting everything on one line
        return lines.join('\r\n');
    };

    /**
     * This is a special trim which only removes first and last empty lines
     * and doesn't affect valid leading space on the first line.
     *
     * @param {String} str   Input string
     * @return {String}      Returns string without empty first and last lines.
     */
    function trimFirstAndLastLines(str)
    {
        return str.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, '');
    };

    /**
     * Parses key/value pairs into hash object.
     *
     * Understands the following formats:
     * - name: word;
     * - name: [word, word];
     * - name: "string";
     * - name: 'string';
     *
     * For example:
     *   name1: value; name2: [value, value]; name3: 'value'
     *
     * @param {String} str    Input string.
     * @return {Object}       Returns deserialized object.
     */
    function parseParams(str)
    {
        var match,
            result = {},
            arrayRegex = new XRegExp("^\\[(?<values>(.*?))\\]$"),
            regex = new XRegExp(
                "(?<name>[\\w-]+)" +
                    "\\s*:\\s*" +
                    "(?<value>" +
                    "[\\w-%#]+|" +		// word
                    "\\[.*?\\]|" +		// [] array
                    '".*?"|' +			// "" string
                    "'.*?'" +			// '' string
                    ")\\s*;?",
                "g"
            )
            ;

        while ((match = regex.exec(str)) != null)
        {
            var value = match.value
                    .replace(/^['"]|['"]$/g, '') // strip quotes from end of strings
                ;

            // try to parse array value
            if (value != null && arrayRegex.test(value))
            {
                var m = arrayRegex.exec(value);
                value = m.values.length > 0 ? m.values.split(/\s*,\s*/) : [];
            }

            result[match.name] = value;
        }

        return result;
    };

    /**
     * Wraps each line of the string into <code/> tag with given style applied to it.
     *
     * @param {String} str   Input string.
     * @param {String} css   Style name to apply to the string.
     * @return {String}      Returns input string with each line surrounded by <span/> tag.
     */
    function wrapLinesWithCode(str, css)
    {
        if (str == null || str.length == 0 || str == '\n')
            return str;

        str = str.replace(/</g, '&lt;');

        // Replace two or more sequential spaces with &nbsp; leaving last space untouched.
        str = str.replace(/ {2,}/g, function(m)
        {
            var spaces = '';

            for (var i = 0; i < m.length - 1; i++)
                spaces += sh.config.space;

            return spaces + ' ';
        });

        // Split each line and apply <span class="...">...</span> to them so that
        // leading spaces aren't included.
        if (css != null)
            str = eachLine(str, function(line)
            {
                if (line.length == 0)
                    return '';

                var spaces = '';

                line = line.replace(/^(&nbsp;| )+/, function(s)
                {
                    spaces = s;
                    return '';
                });

                if (line.length == 0)
                    return spaces;

                return spaces + '<code class="' + css + '">' + line + '</code>';
            });

        return str;
    };

    /**
     * Pads number with zeros until it's length is the same as given length.
     *
     * @param {Number} number	Number to pad.
     * @param {Number} length	Max string length with.
     * @return {String}			Returns a string padded with proper amount of '0'.
     */
    function padNumber(number, length)
    {
        var result = number.toString();

        while (result.length < length)
            result = '0' + result;

        return result;
    };

    /**
     * Replaces tabs with spaces.
     *
     * @param {String} code		Source code.
     * @param {Number} tabSize	Size of the tab.
     * @return {String}			Returns code with all tabs replaces by spaces.
     */
    function processTabs(code, tabSize)
    {
        var tab = '';

        for (var i = 0; i < tabSize; i++)
            tab += ' ';

        return code.replace(/\t/g, tab);
    };

    /**
     * Replaces tabs with smart spaces.
     *
     * @param {String} code    Code to fix the tabs in.
     * @param {Number} tabSize Number of spaces in a column.
     * @return {String}        Returns code with all tabs replaces with roper amount of spaces.
     */
    function processSmartTabs(code, tabSize)
    {
        var lines = splitLines(code),
            tab = '\t',
            spaces = ''
            ;

        // Create a string with 1000 spaces to copy spaces from...
        // It's assumed that there would be no indentation longer than that.
        for (var i = 0; i < 50; i++)
            spaces += '                    '; // 20 spaces * 50

        // This function inserts specified amount of spaces in the string
        // where a tab is while removing that given tab.
        function insertSpaces(line, pos, count)
        {
            return line.substr(0, pos)
                + spaces.substr(0, count)
                + line.substr(pos + 1, line.length) // pos + 1 will get rid of the tab
                ;
        };

        // Go through all the lines and do the 'smart tabs' magic.
        code = eachLine(code, function(line)
        {
            if (line.indexOf(tab) == -1)
                return line;

            var pos = 0;

            while ((pos = line.indexOf(tab)) != -1)
            {
                // This is pretty much all there is to the 'smart tabs' logic.
                // Based on the position within the line and size of a tab,
                // calculate the amount of spaces we need to insert.
                var spaces = tabSize - pos % tabSize;
                line = insertSpaces(line, pos, spaces);
            }

            return line;
        });

        return code;
    };

    /**
     * Performs various string fixes based on configuration.
     */
    function fixInputString(str)
    {
        var br = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;

        if (sh.config.bloggerMode == true)
            str = str.replace(br, '\n');

        if (sh.config.stripBrs == true)
            str = str.replace(br, '');

        return str;
    };

    /**
     * Removes all white space at the begining and end of a string.
     *
     * @param {String} str   String to trim.
     * @return {String}      Returns string without leading and following white space characters.
     */
    function trim(str)
    {
        return str.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Unindents a block of text by the lowest common indent amount.
     * @param {String} str   Text to unindent.
     * @return {String}      Returns unindented text block.
     */
    function unindent(str)
    {
        var lines = splitLines(fixInputString(str)),
            indents = new Array(),
            regex = /^\s*/,
            min = 1000
            ;

        // go through every line and check for common number of indents
        for (var i = 0; i < lines.length && min > 0; i++)
        {
            var line = lines[i];

            if (trim(line).length == 0)
                continue;

            var matches = regex.exec(line);

            // In the event that just one line doesn't have leading white space
            // we can't unindent anything, so bail completely.
            if (matches == null)
                return str;

            min = Math.min(matches[0].length, min);
        }

        // trim minimum common number of white space from the begining of every line
        if (min > 0)
            for (var i = 0; i < lines.length; i++)
                lines[i] = lines[i].substr(min);

        return lines.join('\n');
    };

    /**
     * Callback method for Array.sort() which sorts matches by
     * index position and then by length.
     *
     * @param {Match} m1	Left object.
     * @param {Match} m2    Right object.
     * @return {Number}     Returns -1, 0 or -1 as a comparison result.
     */
    function matchesSortCallback(m1, m2)
    {
        // sort matches by index first
        if(m1.index < m2.index)
            return -1;
        else if(m1.index > m2.index)
            return 1;
        else
        {
            // if index is the same, sort by length
            if(m1.length < m2.length)
                return -1;
            else if(m1.length > m2.length)
                return 1;
        }

        return 0;
    };

    /**
     * Executes given regular expression on provided code and returns all
     * matches that are found.
     *
     * @param {String} code    Code to execute regular expression on.
     * @param {Object} regex   Regular expression item info from <code>regexList</code> collection.
     * @return {Array}         Returns a list of Match objects.
     */
    function getMatches(code, regexInfo)
    {
        function defaultAdd(match, regexInfo)
        {
            return match[0];
        };

        var index = 0,
            match = null,
            matches = [],
            func = regexInfo.func ? regexInfo.func : defaultAdd
            ;

        while((match = regexInfo.regex.exec(code)) != null)
        {
            var resultMatch = func(match, regexInfo);

            if (typeof(resultMatch) == 'string')
                resultMatch = [new sh.Match(resultMatch, match.index, regexInfo.css)];

            matches = matches.concat(resultMatch);
        }

        return matches;
    };

    /**
     * Turns all URLs in the code into <a/> tags.
     * @param {String} code Input code.
     * @return {String} Returns code with </a> tags.
     */
    function processUrls(code)
    {
        var gt = /(.*)((&gt;|&lt;).*)/;

        return code.replace(sh.regexLib.url, function(m)
        {
            var suffix = '',
                match = null
                ;

            // We include &lt; and &gt; in the URL for the common cases like <http://google.com>
            // The problem is that they get transformed into &lt;http://google.com&gt;
            // Where as &gt; easily looks like part of the URL string.

            if (match = gt.exec(m))
            {
                m = match[1];
                suffix = match[2];
            }

            return '<a href="' + m + '">' + m + '</a>' + suffix;
        });
    };

    /**
     * Finds all <SCRIPT TYPE="syntaxhighlighter" /> elementss.
     * @return {Array} Returns array of all found SyntaxHighlighter tags.
     */
    function getSyntaxHighlighterScriptTags()
    {
        var tags = document.getElementsByTagName('script'),
            result = []
            ;

        for (var i = 0; i < tags.length; i++)
            if (tags[i].type == 'syntaxhighlighter')
                result.push(tags[i]);

        return result;
    };

    /**
     * Strips <![CDATA[]]> from <SCRIPT /> content because it should be used
     * there in most cases for XHTML compliance.
     * @param {String} original	Input code.
     * @return {String} Returns code without leading <![CDATA[]]> tags.
     */
    function stripCData(original)
    {
        var left = '<![CDATA[',
            right = ']]>',
        // for some reason IE inserts some leading blanks here
            copy = trim(original),
            changed = false,
            leftLength = left.length,
            rightLength = right.length
            ;

        if (copy.indexOf(left) == 0)
        {
            copy = copy.substring(leftLength);
            changed = true;
        }

        var copyLength = copy.length;

        if (copy.indexOf(right) == copyLength - rightLength)
        {
            copy = copy.substring(0, copyLength - rightLength);
            changed = true;
        }

        return changed ? copy : original;
    };


    /**
     * Quick code mouse double click handler.
     */
    function quickCodeHandler(e)
    {
        var target = e.target,
            highlighterDiv = findParentElement(target, '.syntaxhighlighter'),
            container = findParentElement(target, '.container'),
            textarea = document.createElement('textarea'),
            highlighter
            ;

        if (!container || !highlighterDiv || findElement(container, 'textarea'))
            return;

        highlighter = getHighlighterById(highlighterDiv.id);

        // add source class name
        addClass(highlighterDiv, 'source');

        // Have to go over each line and grab it's text, can't just do it on the
        // container because Firefox loses all \n where as Webkit doesn't.
        var lines = container.childNodes,
            code = []
            ;

        for (var i = 0; i < lines.length; i++)
            code.push(lines[i].innerText || lines[i].textContent);

        // using \r instead of \r or \r\n makes this work equally well on IE, FF and Webkit
        code = code.join('\r');

        // For Webkit browsers, replace nbsp with a breaking space
        code = code.replace(/\u00a0/g, " ");

        // inject <textarea/> tag
        textarea.appendChild(document.createTextNode(code));
        container.appendChild(textarea);

        // preselect all text
        textarea.focus();
        textarea.select();

        // set up handler for lost focus
        attachEvent(textarea, 'blur', function(e)
        {
            textarea.parentNode.removeChild(textarea);
            removeClass(highlighterDiv, 'source');
        });
    };

    /**
     * Match object.
     */
    sh.Match = function(value, index, css)
    {
        this.value = value;
        this.index = index;
        this.length = value.length;
        this.css = css;
        this.brushName = null;
    };

    sh.Match.prototype.toString = function()
    {
        return this.value;
    };

    /**
     * Simulates HTML code with a scripting language embedded.
     *
     * @param {String} scriptBrushName Brush name of the scripting language.
     */
    sh.HtmlScript = function(scriptBrushName)
    {
        var brushClass = findBrush(scriptBrushName),
            scriptBrush,
            xmlBrush = new sh.brushes.Xml(),
            bracketsRegex = null,
            ref = this,
            methodsToExpose = 'getDiv getHtml init'.split(' ')
            ;

        if (brushClass == null)
            return;

        scriptBrush = new brushClass();

        for(var i = 0; i < methodsToExpose.length; i++)
            // make a closure so we don't lose the name after i changes
            (function() {
                var name = methodsToExpose[i];

                ref[name] = function()
                {
                    return xmlBrush[name].apply(xmlBrush, arguments);
                };
            })();

        if (scriptBrush.htmlScript == null)
        {
            alert(sh.config.strings.brushNotHtmlScript + scriptBrushName);
            return;
        }

        xmlBrush.regexList.push(
            { regex: scriptBrush.htmlScript.code, func: process }
        );

        function offsetMatches(matches, offset)
        {
            for (var j = 0; j < matches.length; j++)
                matches[j].index += offset;
        }

        function process(match, info)
        {
            var code = match.code,
                matches = [],
                regexList = scriptBrush.regexList,
                offset = match.index + match.left.length,
                htmlScript = scriptBrush.htmlScript,
                result
                ;

            // add all matches from the code
            for (var i = 0; i < regexList.length; i++)
            {
                result = getMatches(code, regexList[i]);
                offsetMatches(result, offset);
                matches = matches.concat(result);
            }

            // add left script bracket
            if (htmlScript.left != null && match.left != null)
            {
                result = getMatches(match.left, htmlScript.left);
                offsetMatches(result, match.index);
                matches = matches.concat(result);
            }

            // add right script bracket
            if (htmlScript.right != null && match.right != null)
            {
                result = getMatches(match.right, htmlScript.right);
                offsetMatches(result, match.index + match[0].lastIndexOf(match.right));
                matches = matches.concat(result);
            }

            for (var j = 0; j < matches.length; j++)
                matches[j].brushName = brushClass.brushName;

            return matches;
        }
    };

    /**
     * Main Highlither class.
     * @constructor
     */
    sh.Highlighter = function()
    {
        // not putting any code in here because of the prototype inheritance
    };

    sh.Highlighter.prototype = {
        /**
         * Returns value of the parameter passed to the highlighter.
         * @param {String} name				Name of the parameter.
         * @param {Object} defaultValue		Default value.
         * @return {Object}					Returns found value or default value otherwise.
         */
        getParam: function(name, defaultValue)
        {
            var result = this.params[name];
            return toBoolean(result == null ? defaultValue : result);
        },

        /**
         * Shortcut to document.createElement().
         * @param {String} name		Name of the element to create (DIV, A, etc).
         * @return {HTMLElement}	Returns new HTML element.
         */
        create: function(name)
        {
            return document.createElement(name);
        },

        /**
         * Applies all regular expression to the code and stores all found
         * matches in the `this.matches` array.
         * @param {Array} regexList		List of regular expressions.
         * @param {String} code			Source code.
         * @return {Array}				Returns list of matches.
         */
        findMatches: function(regexList, code)
        {
            var result = [];

            if (regexList != null)
                for (var i = 0; i < regexList.length; i++)
                    // BUG: length returns len+1 for array if methods added to prototype chain (oising@gmail.com)
                    if (typeof (regexList[i]) == "object")
                        result = result.concat(getMatches(code, regexList[i]));

            // sort and remove nested the matches
            return this.removeNestedMatches(result.sort(matchesSortCallback));
        },

        /**
         * Checks to see if any of the matches are inside of other matches.
         * This process would get rid of highligted strings inside comments,
         * keywords inside strings and so on.
         */
        removeNestedMatches: function(matches)
        {
            // Optimized by Jose Prado (http://joseprado.com)
            for (var i = 0; i < matches.length; i++)
            {
                if (matches[i] === null)
                    continue;

                var itemI = matches[i],
                    itemIEndPos = itemI.index + itemI.length
                    ;

                for (var j = i + 1; j < matches.length && matches[i] !== null; j++)
                {
                    var itemJ = matches[j];

                    if (itemJ === null)
                        continue;
                    else if (itemJ.index > itemIEndPos)
                        break;
                    else if (itemJ.index == itemI.index && itemJ.length > itemI.length)
                        matches[i] = null;
                    else if (itemJ.index >= itemI.index && itemJ.index < itemIEndPos)
                        matches[j] = null;
                }
            }

            return matches;
        },

        /**
         * Creates an array containing integer line numbers starting from the 'first-line' param.
         * @return {Array} Returns array of integers.
         */
        figureOutLineNumbers: function(code)
        {
            var lines = [],
                firstLine = parseInt(this.getParam('first-line'))
                ;

            eachLine(code, function(line, index)
            {
                lines.push(index + firstLine);
            });

            return lines;
        },

        /**
         * Determines if specified line number is in the highlighted list.
         */
        isLineHighlighted: function(lineNumber)
        {
            var list = this.getParam('highlight', []);

            if (typeof(list) != 'object' && list.push == null)
                list = [ list ];

            return indexOf(list, lineNumber.toString()) != -1;
        },

        /**
         * Generates HTML markup for a single line of code while determining alternating line style.
         * @param {Integer} lineNumber	Line number.
         * @param {String} code Line	HTML markup.
         * @return {String}				Returns HTML markup.
         */
        getLineHtml: function(lineIndex, lineNumber, code)
        {
            var classes = [
                'line',
                'number' + lineNumber,
                'index' + lineIndex,
                'alt' + (lineNumber % 2 == 0 ? 1 : 2).toString()
            ];

            if (this.isLineHighlighted(lineNumber))
                classes.push('highlighted');

            if (lineNumber == 0)
                classes.push('break');

            return '<div class="' + classes.join(' ') + '">' + code + '</div>';
        },

        /**
         * Generates HTML markup for line number column.
         * @param {String} code			Complete code HTML markup.
         * @param {Array} lineNumbers	Calculated line numbers.
         * @return {String}				Returns HTML markup.
         */
        getLineNumbersHtml: function(code, lineNumbers)
        {
            var html = '',
                count = splitLines(code).length,
                firstLine = parseInt(this.getParam('first-line')),
                pad = this.getParam('pad-line-numbers')
                ;

            if (pad == true)
                pad = (firstLine + count - 1).toString().length;
            else if (isNaN(pad) == true)
                pad = 0;

            for (var i = 0; i < count; i++)
            {
                var lineNumber = lineNumbers ? lineNumbers[i] : firstLine + i,
                    code = lineNumber == 0 ? sh.config.space : padNumber(lineNumber, pad)
                    ;

                html += this.getLineHtml(i, lineNumber, code);
            }

            return html;
        },

        /**
         * Splits block of text into individual DIV lines.
         * @param {String} code			Code to highlight.
         * @param {Array} lineNumbers	Calculated line numbers.
         * @return {String}				Returns highlighted code in HTML form.
         */
        getCodeLinesHtml: function(html, lineNumbers)
        {
            html = trim(html);

            var lines = splitLines(html),
                padLength = this.getParam('pad-line-numbers'),
                firstLine = parseInt(this.getParam('first-line')),
                html = '',
                brushName = this.getParam('brush')
                ;

            for (var i = 0; i < lines.length; i++)
            {
                var line = lines[i],
                    indent = /^(&nbsp;|\s)+/.exec(line),
                    spaces = null,
                    lineNumber = lineNumbers ? lineNumbers[i] : firstLine + i;
                ;

                if (indent != null)
                {
                    spaces = indent[0].toString();
                    line = line.substr(spaces.length);
                    spaces = spaces.replace(' ', sh.config.space);
                }

                line = trim(line);

                if (line.length == 0)
                    line = sh.config.space;

                html += this.getLineHtml(
                    i,
                    lineNumber,
                    (spaces != null ? '<code class="' + brushName + ' spaces">' + spaces + '</code>' : '') + line
                );
            }

            return html;
        },

        /**
         * Returns HTML for the table title or empty string if title is null.
         */
        getTitleHtml: function(title)
        {
            return title ? '<caption>' + title + '</caption>' : '';
        },

        /**
         * Finds all matches in the source code.
         * @param {String} code		Source code to process matches in.
         * @param {Array} matches	Discovered regex matches.
         * @return {String} Returns formatted HTML with processed mathes.
         */
        getMatchesHtml: function(code, matches)
        {
            var pos = 0,
                result = '',
                brushName = this.getParam('brush', '')
                ;

            function getBrushNameCss(match)
            {
                var result = match ? (match.brushName || brushName) : brushName;
                return result ? result + ' ' : '';
            };

            // Finally, go through the final list of matches and pull the all
            // together adding everything in between that isn't a match.
            for (var i = 0; i < matches.length; i++)
            {
                var match = matches[i],
                    matchBrushName
                    ;

                if (match === null || match.length === 0)
                    continue;

                matchBrushName = getBrushNameCss(match);

                result += wrapLinesWithCode(code.substr(pos, match.index - pos), matchBrushName + 'plain')
                    + wrapLinesWithCode(match.value, matchBrushName + match.css)
                ;

                pos = match.index + match.length + (match.offset || 0);
            }

            // don't forget to add whatever's remaining in the string
            result += wrapLinesWithCode(code.substr(pos), getBrushNameCss() + 'plain');

            return result;
        },

        /**
         * Generates HTML markup for the whole syntax highlighter.
         * @param {String} code Source code.
         * @return {String} Returns HTML markup.
         */
        getHtml: function(code)
        {
            var html = '',
                classes = [ 'syntaxhighlighter' ],
                tabSize,
                matches,
                lineNumbers
                ;

            // process light mode
            if (this.getParam('light') == true)
                this.params.toolbar = this.params.gutter = false;

            className = 'syntaxhighlighter';

            if (this.getParam('collapse') == true)
                classes.push('collapsed');

            if ((gutter = this.getParam('gutter')) == false)
                classes.push('nogutter');

            // add custom user style name
            classes.push(this.getParam('class-name'));

            // add brush alias to the class name for custom CSS
            classes.push(this.getParam('brush'));

            code = trimFirstAndLastLines(code)
                .replace(/\r/g, ' ') // IE lets these buggers through
            ;

            tabSize = this.getParam('tab-size');

            // replace tabs with spaces
            code = this.getParam('smart-tabs') == true
                ? processSmartTabs(code, tabSize)
                : processTabs(code, tabSize)
            ;

            // unindent code by the common indentation
            if (this.getParam('unindent'))
                code = unindent(code);

            if (gutter)
                lineNumbers = this.figureOutLineNumbers(code);

            // find matches in the code using brushes regex list
            matches = this.findMatches(this.regexList, code);
            // processes found matches into the html
            html = this.getMatchesHtml(code, matches);
            // finally, split all lines so that they wrap well
            html = this.getCodeLinesHtml(html, lineNumbers);

            // finally, process the links
            if (this.getParam('auto-links'))
                html = processUrls(html);

            if (typeof(navigator) != 'undefined' && navigator.userAgent && navigator.userAgent.match(/MSIE/))
                classes.push('ie');

            html =
                '<div id="' + getHighlighterId(this.id) + '" class="' + classes.join(' ') + '">'
                    + (this.getParam('toolbar') ? sh.toolbar.getHtml(this) : '')
                    + '<table border="0" cellpadding="0" cellspacing="0">'
                    + this.getTitleHtml(this.getParam('title'))
                    + '<tbody>'
                    + '<tr>'
                    + (gutter ? '<td class="gutter">' + this.getLineNumbersHtml(code) + '</td>' : '')
                    + '<td class="code">'
                    + '<div class="container">'
                    + html
                    + '</div>'
                    + '</td>'
                    + '</tr>'
                    + '</tbody>'
                    + '</table>'
                    + '</div>'
            ;

            return html;
        },

        /**
         * Highlights the code and returns complete HTML.
         * @param {String} code     Code to highlight.
         * @return {Element}        Returns container DIV element with all markup.
         */
        getDiv: function(code)
        {
            if (code === null)
                code = '';

            this.code = code;

            var div = this.create('div');

            // create main HTML
            div.innerHTML = this.getHtml(code);

            // set up click handlers
            if (this.getParam('toolbar'))
                attachEvent(findElement(div, '.toolbar'), 'click', sh.toolbar.handler);

            if (this.getParam('quick-code'))
                attachEvent(findElement(div, '.code'), 'dblclick', quickCodeHandler);

            return div;
        },

        /**
         * Initializes the highlighter/brush.
         *
         * Constructor isn't used for initialization so that nothing executes during necessary
         * `new SyntaxHighlighter.Highlighter()` call when setting up brush inheritence.
         *
         * @param {Hash} params Highlighter parameters.
         */
        init: function(params)
        {
            this.id = guid();

            // register this instance in the highlighters list
            storeHighlighter(this);

            // local params take precedence over defaults
            this.params = merge(sh.defaults, params || {})

            // process light mode
            if (this.getParam('light') == true)
                this.params.toolbar = this.params.gutter = false;
        },

        /**
         * Converts space separated list of keywords into a regular expression string.
         * @param {String} str    Space separated keywords.
         * @return {String}       Returns regular expression string.
         */
        getKeywords: function(str)
        {
            str = str
                .replace(/^\s+|\s+$/g, '')
                .replace(/\s+/g, '|')
            ;

            return '\\b(?:' + str + ')\\b';
        },

        /**
         * Makes a brush compatible with the `html-script` functionality.
         * @param {Object} regexGroup Object containing `left` and `right` regular expressions.
         */
        forHtmlScript: function(regexGroup)
        {
            var regex = { 'end' : regexGroup.right.source };

            if(regexGroup.eof)
                regex.end = "(?:(?:" + regex.end + ")|$)";

            this.htmlScript = {
                left : { regex: regexGroup.left, css: 'script' },
                right : { regex: regexGroup.right, css: 'script' },
                code : new XRegExp(
                    "(?<left>" + regexGroup.left.source + ")" +
                        "(?<code>.*?)" +
                        "(?<right>" + regex.end + ")",
                    "sgi"
                )
            };
        }
    }; // end of Highlighter

    return sh;
}(); // end of anonymous function

// CommonJS
typeof(exports) != 'undefined' ? exports.SyntaxHighlighter = SyntaxHighlighter : null;

;(function()
{
    // CommonJS
    SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

    function Brush()
    {
        // Created by Peter Atoria @ http://iAtoria.com

        var inits 	 =  'class interface function package';

        var keywords =	'-Infinity ...rest Array as AS3 Boolean break case catch const continue Date decodeURI ' +
                'decodeURIComponent default delete do dynamic each else encodeURI encodeURIComponent escape ' +
                'extends false final finally flash_proxy for get if implements import in include Infinity ' +
                'instanceof int internal is isFinite isNaN isXMLName label namespace NaN native new null ' +
                'Null Number Object object_proxy override parseFloat parseInt private protected public ' +
                'return set static String super switch this throw true try typeof uint undefined unescape ' +
                'use void while with'
            ;

        this.regexList = [
            { regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },		// one line comments
            { regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },		// multiline comments
            { regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },		// double quoted strings
            { regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// single quoted strings
            { regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,				css: 'value' },			// numbers
            { regex: new RegExp(this.getKeywords(inits), 'gm'),			css: 'color3' },		// initializations
            { regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },		// keywords
            { regex: new RegExp('var', 'gm'),							css: 'variable' },		// variable
            { regex: new RegExp('trace', 'gm'),							css: 'color1' }			// trace
        ];

        this.forHtmlScript(SyntaxHighlighter.regexLib.scriptScriptTags);
    };

    Brush.prototype	= new SyntaxHighlighter.Highlighter();
    Brush.aliases	= ['actionscript3', 'as3'];

    SyntaxHighlighter.brushes.AS3 = Brush;

    // CommonJS
    typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

;(function()
{
    // CommonJS
    SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

    function Brush()
    {
        // AppleScript brush by David Chambers
        // http://davidchambersdesign.com/
        var keywords   = 'after before beginning continue copy each end every from return get global in local named of set some that the then times to where whose with without';
        var ordinals   = 'first second third fourth fifth sixth seventh eighth ninth tenth last front back middle';
        var specials   = 'activate add alias AppleScript ask attachment boolean class constant delete duplicate empty exists false id integer list make message modal modified new no paragraph pi properties quit real record remove rest result reveal reverse run running save string true word yes';

        this.regexList = [

            { regex: /(--|#).*$/gm,
                css: 'comments' },

            { regex: /\(\*(?:[\s\S]*?\(\*[\s\S]*?\*\))*[\s\S]*?\*\)/gm, // support nested comments
                css: 'comments' },

            { regex: /"[\s\S]*?"/gm,
                css: 'string' },

            { regex: /(?:,|:|¬|'s\b|\(|\)|\{|\}|«|\b\w*»)/g,
                css: 'color1' },

            { regex: /(-)?(\d)+(\.(\d)?)?(E\+(\d)+)?/g, // numbers
                css: 'color1' },

            { regex: /(?:&(amp;|gt;|lt;)?|=|� |>|<|≥|>=|≤|<=|\*|\+|-|\/|÷|\^)/g,
                css: 'color2' },

            { regex: /\b(?:and|as|div|mod|not|or|return(?!\s&)(ing)?|equals|(is(n't| not)? )?equal( to)?|does(n't| not) equal|(is(n't| not)? )?(greater|less) than( or equal( to)?)?|(comes|does(n't| not) come) (after|before)|is(n't| not)?( in)? (back|front) of|is(n't| not)? behind|is(n't| not)?( (in|contained by))?|does(n't| not) contain|contain(s)?|(start|begin|end)(s)? with|((but|end) )?(consider|ignor)ing|prop(erty)?|(a )?ref(erence)?( to)?|repeat (until|while|with)|((end|exit) )?repeat|((else|end) )?if|else|(end )?(script|tell|try)|(on )?error|(put )?into|(of )?(it|me)|its|my|with (timeout( of)?|transaction)|end (timeout|transaction))\b/g,
                css: 'keyword' },

            { regex: /\b\d+(st|nd|rd|th)\b/g, // ordinals
                css: 'keyword' },

            { regex: /\b(?:about|above|against|around|at|below|beneath|beside|between|by|(apart|aside) from|(instead|out) of|into|on(to)?|over|since|thr(ough|u)|under)\b/g,
                css: 'color3' },

            { regex: /\b(?:adding folder items to|after receiving|choose( ((remote )?application|color|folder|from list|URL))?|clipboard info|set the clipboard to|(the )?clipboard|entire contents|display(ing| (alert|dialog|mode))?|document( (edited|file|nib name))?|file( (name|type))?|(info )?for|giving up after|(name )?extension|quoted form|return(ed)?|second(?! item)(s)?|list (disks|folder)|text item(s| delimiters)?|(Unicode )?text|(disk )?item(s)?|((current|list) )?view|((container|key) )?window|with (data|icon( (caution|note|stop))?|parameter(s)?|prompt|properties|seed|title)|case|diacriticals|hyphens|numeric strings|punctuation|white space|folder creation|application(s( folder)?| (processes|scripts position|support))?|((desktop )?(pictures )?|(documents|downloads|favorites|home|keychain|library|movies|music|public|scripts|sites|system|users|utilities|workflows) )folder|desktop|Folder Action scripts|font(s| panel)?|help|internet plugins|modem scripts|(system )?preferences|printer descriptions|scripting (additions|components)|shared (documents|libraries)|startup (disk|items)|temporary items|trash|on server|in AppleTalk zone|((as|long|short) )?user name|user (ID|locale)|(with )?password|in (bundle( with identifier)?|directory)|(close|open for) access|read|write( permission)?|(g|s)et eof|using( delimiters)?|starting at|default (answer|button|color|country code|entr(y|ies)|identifiers|items|name|location|script editor)|hidden( answer)?|open(ed| (location|untitled))?|error (handling|reporting)|(do( shell)?|load|run|store) script|administrator privileges|altering line endings|get volume settings|(alert|boot|input|mount|output|set) volume|output muted|(fax|random )?number|round(ing)?|up|down|toward zero|to nearest|as taught in school|system (attribute|info)|((AppleScript( Studio)?|system) )?version|(home )?directory|(IPv4|primary Ethernet) address|CPU (type|speed)|physical memory|time (stamp|to GMT)|replacing|ASCII (character|number)|localized string|from table|offset|summarize|beep|delay|say|(empty|multiple) selections allowed|(of|preferred) type|invisibles|showing( package contents)?|editable URL|(File|FTP|News|Media|Web) [Ss]ervers|Telnet hosts|Directory services|Remote applications|waiting until completion|saving( (in|to))?|path (for|to( (((current|frontmost) )?application|resource))?)|POSIX (file|path)|(background|RGB) color|(OK|cancel) button name|cancel button|button(s)?|cubic ((centi)?met(re|er)s|yards|feet|inches)|square ((kilo)?met(re|er)s|miles|yards|feet)|(centi|kilo)?met(re|er)s|miles|yards|feet|inches|lit(re|er)s|gallons|quarts|(kilo)?grams|ounces|pounds|degrees (Celsius|Fahrenheit|Kelvin)|print( (dialog|settings))?|clos(e(able)?|ing)|(de)?miniaturized|miniaturizable|zoom(ed|able)|attribute run|action (method|property|title)|phone|email|((start|end)ing|home) page|((birth|creation|current|custom|modification) )?date|((((phonetic )?(first|last|middle))|computer|host|maiden|related) |nick)?name|aim|icq|jabber|msn|yahoo|address(es)?|save addressbook|should enable action|city|country( code)?|formatte(r|d address)|(palette )?label|state|street|zip|AIM [Hh]andle(s)?|my card|select(ion| all)?|unsaved|(alpha )?value|entr(y|ies)|group|(ICQ|Jabber|MSN) handle|person|people|company|department|icon image|job title|note|organization|suffix|vcard|url|copies|collating|pages (across|down)|request print time|target( printer)?|((GUI Scripting|Script menu) )?enabled|show Computer scripts|(de)?activated|awake from nib|became (key|main)|call method|of (class|object)|center|clicked toolbar item|closed|for document|exposed|(can )?hide|idle|keyboard (down|up)|event( (number|type))?|launch(ed)?|load (image|movie|nib|sound)|owner|log|mouse (down|dragged|entered|exited|moved|up)|move|column|localization|resource|script|register|drag (info|types)|resigned (active|key|main)|resiz(e(d)?|able)|right mouse (down|dragged|up)|scroll wheel|(at )?index|should (close|open( untitled)?|quit( after last window closed)?|zoom)|((proposed|screen) )?bounds|show(n)?|behind|in front of|size (mode|to fit)|update(d| toolbar item)?|was (hidden|miniaturized)|will (become active|close|finish launching|hide|miniaturize|move|open|quit|(resign )?active|((maximum|minimum|proposed) )?size|show|zoom)|bundle|data source|movie|pasteboard|sound|tool(bar| tip)|(color|open|save) panel|coordinate system|frontmost|main( (bundle|menu|window))?|((services|(excluded from )?windows) )?menu|((executable|frameworks|resource|scripts|shared (frameworks|support)) )?path|(selected item )?identifier|data|content(s| view)?|character(s)?|click count|(command|control|option|shift) key down|context|delta (x|y|z)|key( code)?|location|pressure|unmodified characters|types|(first )?responder|playing|(allowed|selectable) identifiers|allows customization|(auto saves )?configuration|visible|image( name)?|menu form representation|tag|user(-| )defaults|associated file name|(auto|needs) display|current field editor|floating|has (resize indicator|shadow)|hides when deactivated|level|minimized (image|title)|opaque|position|release when closed|sheet|title(d)?)\b/g,
                css: 'color3' },

            { regex: new RegExp(this.getKeywords(specials), 'gm'), css: 'color3' },
            { regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' },
            { regex: new RegExp(this.getKeywords(ordinals), 'gm'), css: 'keyword' }
        ];
    };

    Brush.prototype = new SyntaxHighlighter.Highlighter();
    Brush.aliases = ['applescript'];

    SyntaxHighlighter.brushes.AppleScript = Brush;

    // CommonJS
    typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var keywords =	'if fi then elif else for do done until while break continue case esac function return in eq ne ge le';
		var commands =  'alias apropos awk basename bash bc bg builtin bzip2 cal cat cd cfdisk chgrp chmod chown chroot' +
						'cksum clear cmp comm command cp cron crontab csplit cut date dc dd ddrescue declare df ' +
						'diff diff3 dig dir dircolors dirname dirs du echo egrep eject enable env ethtool eval ' +
						'exec exit expand export expr false fdformat fdisk fg fgrep file find fmt fold format ' +
						'free fsck ftp gawk getopts grep groups gzip hash head history hostname id ifconfig ' +
						'import install join kill less let ln local locate logname logout look lpc lpr lprint ' +
						'lprintd lprintq lprm ls lsof make man mkdir mkfifo mkisofs mknod more mount mtools ' +
						'mv netstat nice nl nohup nslookup open op passwd paste pathchk ping popd pr printcap ' +
						'printenv printf ps pushd pwd quota quotacheck quotactl ram rcp read readonly renice ' +
						'remsync rm rmdir rsync screen scp sdiff sed select seq set sftp shift shopt shutdown ' +
						'sleep sort source split ssh strace su sudo sum symlink sync tail tar tee test time ' +
						'times touch top traceroute trap tr true tsort tty type ulimit umask umount unalias ' +
						'uname unexpand uniq units unset unshar useradd usermod users uuencode uudecode v vdir ' +
						'vi watch wc whereis which who whoami Wget xargs yes'
						;

		this.regexList = [
			{ regex: /^#!.*$/gm,											css: 'preprocessor bold' },
			{ regex: /\/[\w-\/]+/gm,										css: 'plain' },
			{ regex: SyntaxHighlighter.regexLib.singleLinePerlComments,		css: 'comments' },		// one line comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,			css: 'string' },		// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,			css: 'string' },		// single quoted strings
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),			css: 'keyword' },		// keywords
			{ regex: new RegExp(this.getKeywords(commands), 'gm'),			css: 'functions' }		// commands
			];
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['bash', 'shell', 'sh'];

	SyntaxHighlighter.brushes.Bash = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Jen
		// http://www.jensbits.com/2009/05/14/coldfusion-brush-for-syntaxhighlighter-plus
	
		var funcs	=	'Abs ACos AddSOAPRequestHeader AddSOAPResponseHeader AjaxLink AjaxOnLoad ArrayAppend ArrayAvg ArrayClear ArrayDeleteAt ' + 
						'ArrayInsertAt ArrayIsDefined ArrayIsEmpty ArrayLen ArrayMax ArrayMin ArraySet ArraySort ArraySum ArraySwap ArrayToList ' + 
						'Asc ASin Atn BinaryDecode BinaryEncode BitAnd BitMaskClear BitMaskRead BitMaskSet BitNot BitOr BitSHLN BitSHRN BitXor ' + 
						'Ceiling CharsetDecode CharsetEncode Chr CJustify Compare CompareNoCase Cos CreateDate CreateDateTime CreateObject ' + 
						'CreateODBCDate CreateODBCDateTime CreateODBCTime CreateTime CreateTimeSpan CreateUUID DateAdd DateCompare DateConvert ' + 
						'DateDiff DateFormat DatePart Day DayOfWeek DayOfWeekAsString DayOfYear DaysInMonth DaysInYear DE DecimalFormat DecrementValue ' + 
						'Decrypt DecryptBinary DeleteClientVariable DeserializeJSON DirectoryExists DollarFormat DotNetToCFType Duplicate Encrypt ' + 
						'EncryptBinary Evaluate Exp ExpandPath FileClose FileCopy FileDelete FileExists FileIsEOF FileMove FileOpen FileRead ' + 
						'FileReadBinary FileReadLine FileSetAccessMode FileSetAttribute FileSetLastModified FileWrite Find FindNoCase FindOneOf ' + 
						'FirstDayOfMonth Fix FormatBaseN GenerateSecretKey GetAuthUser GetBaseTagData GetBaseTagList GetBaseTemplatePath ' + 
						'GetClientVariablesList GetComponentMetaData GetContextRoot GetCurrentTemplatePath GetDirectoryFromPath GetEncoding ' + 
						'GetException GetFileFromPath GetFileInfo GetFunctionList GetGatewayHelper GetHttpRequestData GetHttpTimeString ' + 
						'GetK2ServerDocCount GetK2ServerDocCountLimit GetLocale GetLocaleDisplayName GetLocalHostIP GetMetaData GetMetricData ' + 
						'GetPageContext GetPrinterInfo GetProfileSections GetProfileString GetReadableImageFormats GetSOAPRequest GetSOAPRequestHeader ' + 
						'GetSOAPResponse GetSOAPResponseHeader GetTempDirectory GetTempFile GetTemplatePath GetTickCount GetTimeZoneInfo GetToken ' + 
						'GetUserRoles GetWriteableImageFormats Hash Hour HTMLCodeFormat HTMLEditFormat IIf ImageAddBorder ImageBlur ImageClearRect ' + 
						'ImageCopy ImageCrop ImageDrawArc ImageDrawBeveledRect ImageDrawCubicCurve ImageDrawLine ImageDrawLines ImageDrawOval ' + 
						'ImageDrawPoint ImageDrawQuadraticCurve ImageDrawRect ImageDrawRoundRect ImageDrawText ImageFlip ImageGetBlob ImageGetBufferedImage ' + 
						'ImageGetEXIFTag ImageGetHeight ImageGetIPTCTag ImageGetWidth ImageGrayscale ImageInfo ImageNegative ImageNew ImageOverlay ImagePaste ' + 
						'ImageRead ImageReadBase64 ImageResize ImageRotate ImageRotateDrawingAxis ImageScaleToFit ImageSetAntialiasing ImageSetBackgroundColor ' + 
						'ImageSetDrawingColor ImageSetDrawingStroke ImageSetDrawingTransparency ImageSharpen ImageShear ImageShearDrawingAxis ImageTranslate ' + 
						'ImageTranslateDrawingAxis ImageWrite ImageWriteBase64 ImageXORDrawingMode IncrementValue InputBaseN Insert Int IsArray IsBinary ' + 
						'IsBoolean IsCustomFunction IsDate IsDDX IsDebugMode IsDefined IsImage IsImageFile IsInstanceOf IsJSON IsLeapYear IsLocalHost ' + 
						'IsNumeric IsNumericDate IsObject IsPDFFile IsPDFObject IsQuery IsSimpleValue IsSOAPRequest IsStruct IsUserInAnyRole IsUserInRole ' + 
						'IsUserLoggedIn IsValid IsWDDX IsXML IsXmlAttribute IsXmlDoc IsXmlElem IsXmlNode IsXmlRoot JavaCast JSStringFormat LCase Left Len ' + 
						'ListAppend ListChangeDelims ListContains ListContainsNoCase ListDeleteAt ListFind ListFindNoCase ListFirst ListGetAt ListInsertAt ' + 
						'ListLast ListLen ListPrepend ListQualify ListRest ListSetAt ListSort ListToArray ListValueCount ListValueCountNoCase LJustify Log ' + 
						'Log10 LSCurrencyFormat LSDateFormat LSEuroCurrencyFormat LSIsCurrency LSIsDate LSIsNumeric LSNumberFormat LSParseCurrency LSParseDateTime ' + 
						'LSParseEuroCurrency LSParseNumber LSTimeFormat LTrim Max Mid Min Minute Month MonthAsString Now NumberFormat ParagraphFormat ParseDateTime ' + 
						'Pi PrecisionEvaluate PreserveSingleQuotes Quarter QueryAddColumn QueryAddRow QueryConvertForGrid QueryNew QuerySetCell QuotedValueList Rand ' + 
						'Randomize RandRange REFind REFindNoCase ReleaseComObject REMatch REMatchNoCase RemoveChars RepeatString Replace ReplaceList ReplaceNoCase ' + 
						'REReplace REReplaceNoCase Reverse Right RJustify Round RTrim Second SendGatewayMessage SerializeJSON SetEncoding SetLocale SetProfileString ' + 
						'SetVariable Sgn Sin Sleep SpanExcluding SpanIncluding Sqr StripCR StructAppend StructClear StructCopy StructCount StructDelete StructFind ' + 
						'StructFindKey StructFindValue StructGet StructInsert StructIsEmpty StructKeyArray StructKeyExists StructKeyList StructKeyList StructNew ' + 
						'StructSort StructUpdate Tan TimeFormat ToBase64 ToBinary ToScript ToString Trim UCase URLDecode URLEncodedFormat URLSessionFormat Val ' + 
						'ValueList VerifyClient Week Wrap Wrap WriteOutput XmlChildPos XmlElemNew XmlFormat XmlGetNodeType XmlNew XmlParse XmlSearch XmlTransform ' + 
						'XmlValidate Year YesNoFormat';

		var keywords =	'cfabort cfajaximport cfajaxproxy cfapplet cfapplication cfargument cfassociate cfbreak cfcache cfcalendar ' + 
						'cfcase cfcatch cfchart cfchartdata cfchartseries cfcol cfcollection cfcomponent cfcontent cfcookie cfdbinfo ' + 
						'cfdefaultcase cfdirectory cfdiv cfdocument cfdocumentitem cfdocumentsection cfdump cfelse cfelseif cferror ' + 
						'cfexchangecalendar cfexchangeconnection cfexchangecontact cfexchangefilter cfexchangemail cfexchangetask ' + 
						'cfexecute cfexit cffeed cffile cfflush cfform cfformgroup cfformitem cfftp cffunction cfgrid cfgridcolumn ' + 
						'cfgridrow cfgridupdate cfheader cfhtmlhead cfhttp cfhttpparam cfif cfimage cfimport cfinclude cfindex ' + 
						'cfinput cfinsert cfinterface cfinvoke cfinvokeargument cflayout cflayoutarea cfldap cflocation cflock cflog ' + 
						'cflogin cfloginuser cflogout cfloop cfmail cfmailparam cfmailpart cfmenu cfmenuitem cfmodule cfNTauthenticate ' + 
						'cfobject cfobjectcache cfoutput cfparam cfpdf cfpdfform cfpdfformparam cfpdfparam cfpdfsubform cfpod cfpop ' + 
						'cfpresentation cfpresentationslide cfpresenter cfprint cfprocessingdirective cfprocparam cfprocresult ' + 
						'cfproperty cfquery cfqueryparam cfregistry cfreport cfreportparam cfrethrow cfreturn cfsavecontent cfschedule ' + 
						'cfscript cfsearch cfselect cfset cfsetting cfsilent cfslider cfsprydataset cfstoredproc cfswitch cftable ' + 
						'cftextarea cfthread cfthrow cftimer cftooltip cftrace cftransaction cftree cftreeitem cftry cfupdate cfwddx ' + 
						'cfwindow cfxml cfzip cfzipparam';

		var operators =	'all and any between cross in join like not null or outer some';

		this.regexList = [
			{ regex: new RegExp('--(.*)$', 'gm'),						css: 'comments' },  // one line and multiline comments
			{ regex: SyntaxHighlighter.regexLib.xmlComments,			css: 'comments' },    // single quoted strings
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },    // double quoted strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },    // single quoted strings
			{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),		css: 'functions' }, // functions
			{ regex: new RegExp(this.getKeywords(operators), 'gmi'),	css: 'color1' },    // operators and such
			{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),		css: 'keyword' }    // keyword
			];
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['coldfusion','cf'];
	
	SyntaxHighlighter.brushes.ColdFusion = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Copyright 2006 Shin, YoungJin
	
		var datatypes =	'ATOM BOOL BOOLEAN BYTE CHAR COLORREF DWORD DWORDLONG DWORD_PTR ' +
						'DWORD32 DWORD64 FLOAT HACCEL HALF_PTR HANDLE HBITMAP HBRUSH ' +
						'HCOLORSPACE HCONV HCONVLIST HCURSOR HDC HDDEDATA HDESK HDROP HDWP ' +
						'HENHMETAFILE HFILE HFONT HGDIOBJ HGLOBAL HHOOK HICON HINSTANCE HKEY ' +
						'HKL HLOCAL HMENU HMETAFILE HMODULE HMONITOR HPALETTE HPEN HRESULT ' +
						'HRGN HRSRC HSZ HWINSTA HWND INT INT_PTR INT32 INT64 LANGID LCID LCTYPE ' +
						'LGRPID LONG LONGLONG LONG_PTR LONG32 LONG64 LPARAM LPBOOL LPBYTE LPCOLORREF ' +
						'LPCSTR LPCTSTR LPCVOID LPCWSTR LPDWORD LPHANDLE LPINT LPLONG LPSTR LPTSTR ' +
						'LPVOID LPWORD LPWSTR LRESULT PBOOL PBOOLEAN PBYTE PCHAR PCSTR PCTSTR PCWSTR ' +
						'PDWORDLONG PDWORD_PTR PDWORD32 PDWORD64 PFLOAT PHALF_PTR PHANDLE PHKEY PINT ' +
						'PINT_PTR PINT32 PINT64 PLCID PLONG PLONGLONG PLONG_PTR PLONG32 PLONG64 POINTER_32 ' +
						'POINTER_64 PSHORT PSIZE_T PSSIZE_T PSTR PTBYTE PTCHAR PTSTR PUCHAR PUHALF_PTR ' +
						'PUINT PUINT_PTR PUINT32 PUINT64 PULONG PULONGLONG PULONG_PTR PULONG32 PULONG64 ' +
						'PUSHORT PVOID PWCHAR PWORD PWSTR SC_HANDLE SC_LOCK SERVICE_STATUS_HANDLE SHORT ' +
						'SIZE_T SSIZE_T TBYTE TCHAR UCHAR UHALF_PTR UINT UINT_PTR UINT32 UINT64 ULONG ' +
						'ULONGLONG ULONG_PTR ULONG32 ULONG64 USHORT USN VOID WCHAR WORD WPARAM WPARAM WPARAM ' +
						'char bool short int __int32 __int64 __int8 __int16 long float double __wchar_t ' +
						'clock_t _complex _dev_t _diskfree_t div_t ldiv_t _exception _EXCEPTION_POINTERS ' +
						'FILE _finddata_t _finddatai64_t _wfinddata_t _wfinddatai64_t __finddata64_t ' +
						'__wfinddata64_t _FPIEEE_RECORD fpos_t _HEAPINFO _HFILE lconv intptr_t ' +
						'jmp_buf mbstate_t _off_t _onexit_t _PNH ptrdiff_t _purecall_handler ' +
						'sig_atomic_t size_t _stat __stat64 _stati64 terminate_function ' +
						'time_t __time64_t _timeb __timeb64 tm uintptr_t _utimbuf ' +
						'va_list wchar_t wctrans_t wctype_t wint_t signed';

		var keywords =	'auto break case catch class const decltype __finally __exception __try ' +
						'const_cast continue private public protected __declspec ' +
						'default delete deprecated dllexport dllimport do dynamic_cast ' +
						'else enum explicit extern if for friend goto inline ' +
						'mutable naked namespace new noinline noreturn nothrow ' +
						'register reinterpret_cast return selectany ' +
						'sizeof static static_cast struct switch template this ' +
						'thread throw true false try typedef typeid typename union ' +
						'using uuid virtual void volatile whcar_t while';
					
		var functions =	'assert isalnum isalpha iscntrl isdigit isgraph islower isprint' +
						'ispunct isspace isupper isxdigit tolower toupper errno localeconv ' +
						'setlocale acos asin atan atan2 ceil cos cosh exp fabs floor fmod ' +
						'frexp ldexp log log10 modf pow sin sinh sqrt tan tanh jmp_buf ' +
						'longjmp setjmp raise signal sig_atomic_t va_arg va_end va_start ' +
						'clearerr fclose feof ferror fflush fgetc fgetpos fgets fopen ' +
						'fprintf fputc fputs fread freopen fscanf fseek fsetpos ftell ' +
						'fwrite getc getchar gets perror printf putc putchar puts remove ' +
						'rename rewind scanf setbuf setvbuf sprintf sscanf tmpfile tmpnam ' +
						'ungetc vfprintf vprintf vsprintf abort abs atexit atof atoi atol ' +
						'bsearch calloc div exit free getenv labs ldiv malloc mblen mbstowcs ' +
						'mbtowc qsort rand realloc srand strtod strtol strtoul system ' +
						'wcstombs wctomb memchr memcmp memcpy memmove memset strcat strchr ' +
						'strcmp strcoll strcpy strcspn strerror strlen strncat strncmp ' +
						'strncpy strpbrk strrchr strspn strstr strtok strxfrm asctime ' +
						'clock ctime difftime gmtime localtime mktime strftime time';

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },			// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// strings
			{ regex: /^ *#.*/gm,										css: 'preprocessor' },
			{ regex: new RegExp(this.getKeywords(datatypes), 'gm'),		css: 'color1 bold' },
			{ regex: new RegExp(this.getKeywords(functions), 'gm'),		css: 'functions bold' },
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword bold' }
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['cpp', 'c'];

	SyntaxHighlighter.brushes.Cpp = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var keywords =	'abstract as base bool break byte case catch char checked class const ' +
						'continue decimal default delegate do double else enum event explicit volatile ' +
						'extern false finally fixed float for foreach get goto if implicit in int ' +
						'interface internal is lock long namespace new null object operator out ' +
						'override params private protected public readonly ref return sbyte sealed set ' +
						'short sizeof stackalloc static string struct switch this throw true try ' +
						'typeof uint ulong unchecked unsafe ushort using virtual void while var ' +
						'from group by into select let where orderby join on equals ascending descending';

		function fixComments(match, regexInfo)
		{
			var css = (match[0].indexOf("///") == 0)
				? 'color1'
				: 'comments'
				;
			
			return [new SyntaxHighlighter.Match(match[0], match.index, css)];
		}

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	func : fixComments },		// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
			{ regex: /@"(?:[^"]|"")*"/g,								css: 'string' },			// @-quoted strings
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// strings
			{ regex: /^\s*#.*/gm,										css: 'preprocessor' },		// preprocessor tags like #region and #endregion
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },			// c# keyword
			{ regex: /\bpartial(?=\s+(?:class|interface|struct)\b)/g,	css: 'keyword' },			// contextual keyword: 'partial'
			{ regex: /\byield(?=\s+(?:return|break)\b)/g,				css: 'keyword' }			// contextual keyword: 'yield'
			];
		
		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['c#', 'c-sharp', 'csharp'];

	SyntaxHighlighter.brushes.CSharp = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		function getKeywordsCSS(str)
		{
			return '\\b([a-z_]|)' + str.replace(/ /g, '(?=:)\\b|\\b([a-z_\\*]|\\*|)') + '(?=:)\\b';
		};
	
		function getValuesCSS(str)
		{
			return '\\b' + str.replace(/ /g, '(?!-)(?!:)\\b|\\b()') + '\:\\b';
		};

		var keywords =	'ascent azimuth background-attachment background-color background-image background-position ' +
						'background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top ' +
						'border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color ' +
						'border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width ' +
						'border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color ' +
						'content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display ' +
						'elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font ' +
						'height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top ' +
						'margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans ' +
						'outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page ' +
						'page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position ' +
						'quotes right richness size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress ' +
						'table-layout text-align top text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em ' +
						'vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index';

		var values =	'above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder '+
						'both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed '+
						'continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero default digits disc dotted double '+
						'embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia '+
						'gray green groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic '+
						'justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha '+
						'lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower '+
						'navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset '+
						'outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side '+
						'rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow '+
						'small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize '+
						'table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal '+
						'text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin '+
						'upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow';

		var fonts =		'[mM]onospace [tT]ahoma [vV]erdana [aA]rial [hH]elvetica [sS]ans-serif [sS]erif [cC]ourier mono sans serif';
	
		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },	// multiline comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },	// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },	// single quoted strings
			{ regex: /\#[a-fA-F0-9]{3,6}/g,								css: 'value' },		// html colors
			{ regex: /(-?\d+)(\.\d+)?(px|em|pt|\:|\%|)/g,				css: 'value' },		// sizes
			{ regex: /!important/g,										css: 'color3' },	// !important
			{ regex: new RegExp(getKeywordsCSS(keywords), 'gm'),		css: 'keyword' },	// keywords
			{ regex: new RegExp(getValuesCSS(values), 'g'),				css: 'value' },		// values
			{ regex: new RegExp(this.getKeywords(fonts), 'g'),			css: 'color1' }		// fonts
			];

		this.forHtmlScript({ 
			left: /(&lt;|<)\s*style.*?(&gt;|>)/gi, 
			right: /(&lt;|<)\/\s*style\s*(&gt;|>)/gi 
			});
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['css'];

	SyntaxHighlighter.brushes.CSS = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var keywords =	'abs addr and ansichar ansistring array as asm begin boolean byte cardinal ' +
						'case char class comp const constructor currency destructor div do double ' +
						'downto else end except exports extended false file finalization finally ' +
						'for function goto if implementation in inherited int64 initialization ' +
						'integer interface is label library longint longword mod nil not object ' +
						'of on or packed pansichar pansistring pchar pcurrency pdatetime pextended ' +
						'pint64 pointer private procedure program property pshortstring pstring ' +
						'pvariant pwidechar pwidestring protected public published raise real real48 ' +
						'record repeat set shl shortint shortstring shr single smallint string then ' +
						'threadvar to true try type unit until uses val var varirnt while widechar ' +
						'widestring with word write writeln xor';

		this.regexList = [
			{ regex: /\(\*[\s\S]*?\*\)/gm,								css: 'comments' },  	// multiline comments (* *)
			{ regex: /{(?!\$)[\s\S]*?}/gm,								css: 'comments' },  	// multiline comments { }
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },  	// one line
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// strings
			{ regex: /\{\$[a-zA-Z]+ .+\}/g,								css: 'color1' },		// compiler Directives and Region tags
			{ regex: /\b[\d\.]+\b/g,									css: 'value' },			// numbers 12345
			{ regex: /\$[a-zA-Z0-9]+\b/g,								css: 'value' },			// numbers $F5D3
			{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),		css: 'keyword' }		// keyword
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['delphi', 'pascal', 'pas'];

	SyntaxHighlighter.brushes.Delphi = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		this.regexList = [
			{ regex: /^\+\+\+ .*$/gm,	css: 'color2' },	// new file
			{ regex: /^\-\-\- .*$/gm,	css: 'color2' },	// old file
			{ regex: /^\s.*$/gm,		css: 'color1' },	// unchanged
			{ regex: /^@@.*@@.*$/gm,	css: 'variable' },	// location
			{ regex: /^\+.*$/gm,		css: 'string' },	// additions
			{ regex: /^\-.*$/gm,		css: 'color3' }		// deletions
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['diff', 'patch'];

	SyntaxHighlighter.brushes.Diff = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Jean-Lou Dupont
		// http://jldupont.blogspot.com/2009/06/erlang-syntax-highlighter.html  

		// According to: http://erlang.org/doc/reference_manual/introduction.html#1.5
		var keywords = 'after and andalso band begin bnot bor bsl bsr bxor '+
			'case catch cond div end fun if let not of or orelse '+
			'query receive rem try when xor'+
			// additional
			' module export import define';

		this.regexList = [
			{ regex: new RegExp("[A-Z][A-Za-z0-9_]+", 'g'), 			css: 'constants' },
			{ regex: new RegExp("\\%.+", 'gm'), 						css: 'comments' },
			{ regex: new RegExp("\\?[A-Za-z0-9_]+", 'g'), 				css: 'preprocessor' },
			{ regex: new RegExp("[a-z0-9_]+:[a-z0-9_]+", 'g'), 			css: 'functions' },
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },
			{ regex: new RegExp(this.getKeywords(keywords),	'gm'),		css: 'keyword' }
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['erl', 'erlang'];

	SyntaxHighlighter.brushes.Erland = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Andres Almiray
		// http://jroller.com/aalmiray/entry/nice_source_code_syntax_highlighter

		var keywords =	'as assert break case catch class continue def default do else extends finally ' +
						'if in implements import instanceof interface new package property return switch ' +
						'throw throws try while public protected private static';
		var types    =  'void boolean byte char short int long float double';
		var constants = 'null';
		var methods   = 'allProperties count get size '+
						'collect each eachProperty eachPropertyName eachWithIndex find findAll ' +
						'findIndexOf grep inject max min reverseEach sort ' +
						'asImmutable asSynchronized flatten intersect join pop reverse subMap toList ' +
						'padRight padLeft contains eachMatch toCharacter toLong toUrl tokenize ' +
						'eachFile eachFileRecurse eachB yte eachLine readBytes readLine getText ' +
						'splitEachLine withReader append encodeBase64 decodeBase64 filterLine ' +
						'transformChar transformLine withOutputStream withPrintWriter withStream ' +
						'withStreams withWriter withWriterAppend write writeLine '+
						'dump inspect invokeMethod print println step times upto use waitForOrKill '+
						'getText';

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,				css: 'comments' },		// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,					css: 'comments' },		// multiline comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,					css: 'string' },		// strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,					css: 'string' },		// strings
			{ regex: /""".*"""/g,													css: 'string' },		// GStrings
			{ regex: new RegExp('\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b', 'gi'),	css: 'value' },			// numbers
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),					css: 'keyword' },		// goovy keyword
			{ regex: new RegExp(this.getKeywords(types), 'gm'),						css: 'color1' },		// goovy/java type
			{ regex: new RegExp(this.getKeywords(constants), 'gm'),					css: 'constants' },		// constants
			{ regex: new RegExp(this.getKeywords(methods), 'gm'),					css: 'functions' }		// methods
			];

		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['groovy'];

	SyntaxHighlighter.brushes.Groovy = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var keywords =	'abstract assert boolean break byte case catch char class const ' +
						'continue default do double else enum extends ' +
						'false final finally float for goto if implements import ' +
						'instanceof int interface long native new null ' +
						'package private protected public return ' +
						'short static strictfp super switch synchronized this throw throws true ' +
						'transient try void volatile while';

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },		// one line comments
			{ regex: /\/\*([^\*][\s\S]*)?\*\//gm,						css: 'comments' },	 	// multiline comments
			{ regex: /\/\*(?!\*\/)\*[\s\S]*?\*\//gm,					css: 'preprocessor' },	// documentation comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },		// strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// strings
			{ regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,				css: 'value' },			// numbers
			{ regex: /(?!\@interface\b)\@[\$\w]+\b/g,					css: 'color1' },		// annotation @anno
			{ regex: /\@interface\b/g,									css: 'color2' },		// @interface keyword
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }		// java keyword
			];

		this.forHtmlScript({
			left	: /(&lt;|<)%[@!=]?/g, 
			right	: /%(&gt;|>)/g 
		});
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['java'];

	SyntaxHighlighter.brushes.Java = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Patrick Webster
		// http://patrickwebster.blogspot.com/2009/04/javafx-brush-for-syntaxhighlighter.html
		var datatypes =	'Boolean Byte Character Double Duration '
						+ 'Float Integer Long Number Short String Void'
						;

		var keywords = 'abstract after and as assert at before bind bound break catch class '
						+ 'continue def delete else exclusive extends false finally first for from '
						+ 'function if import in indexof init insert instanceof into inverse last '
						+ 'lazy mixin mod nativearray new not null on or override package postinit '
						+ 'protected public public-init public-read replace return reverse sizeof '
						+ 'step super then this throw true try tween typeof var where while with '
						+ 'attribute let private readonly static trigger'
						;

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },
			{ regex: /(-?\.?)(\b(\d*\.?\d+|\d+\.?\d*)(e[+-]?\d+)?|0x[a-f\d]+)\b\.?/gi, css: 'color2' },	// numbers
			{ regex: new RegExp(this.getKeywords(datatypes), 'gm'),		css: 'variable' },	// datatypes
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }
		];
		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['jfx', 'javafx'];

	SyntaxHighlighter.brushes.JavaFX = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var keywords =	'break case catch continue ' +
						'default delete do else false  ' +
						'for function if in instanceof ' +
						'new null return super switch ' +
						'this throw true try typeof var while with'
						;

		var r = SyntaxHighlighter.regexLib;
		
		this.regexList = [
			{ regex: r.multiLineDoubleQuotedString,					css: 'string' },			// double quoted strings
			{ regex: r.multiLineSingleQuotedString,					css: 'string' },			// single quoted strings
			{ regex: r.singleLineCComments,							css: 'comments' },			// one line comments
			{ regex: r.multiLineCComments,							css: 'comments' },			// multiline comments
			{ regex: /\s*#.*/gm,									css: 'preprocessor' },		// preprocessor tags like #region and #endregion
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' }			// keywords
			];
	
		this.forHtmlScript(r.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['js', 'jscript', 'javascript'];

	SyntaxHighlighter.brushes.JScript = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by David Simmons-Duffin and Marty Kube
	
		var funcs = 
			'abs accept alarm atan2 bind binmode chdir chmod chomp chop chown chr ' + 
			'chroot close closedir connect cos crypt defined delete each endgrent ' + 
			'endhostent endnetent endprotoent endpwent endservent eof exec exists ' + 
			'exp fcntl fileno flock fork format formline getc getgrent getgrgid ' + 
			'getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr ' + 
			'getnetbyname getnetent getpeername getpgrp getppid getpriority ' + 
			'getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid ' + 
			'getservbyname getservbyport getservent getsockname getsockopt glob ' + 
			'gmtime grep hex index int ioctl join keys kill lc lcfirst length link ' + 
			'listen localtime lock log lstat map mkdir msgctl msgget msgrcv msgsnd ' + 
			'oct open opendir ord pack pipe pop pos print printf prototype push ' + 
			'quotemeta rand read readdir readline readlink readpipe recv rename ' + 
			'reset reverse rewinddir rindex rmdir scalar seek seekdir select semctl ' + 
			'semget semop send setgrent sethostent setnetent setpgrp setpriority ' + 
			'setprotoent setpwent setservent setsockopt shift shmctl shmget shmread ' + 
			'shmwrite shutdown sin sleep socket socketpair sort splice split sprintf ' + 
			'sqrt srand stat study substr symlink syscall sysopen sysread sysseek ' + 
			'system syswrite tell telldir time times tr truncate uc ucfirst umask ' + 
			'undef unlink unpack unshift utime values vec wait waitpid warn write ' +
			// feature
			'say';
    
		var keywords =  
			'bless caller continue dbmclose dbmopen die do dump else elsif eval exit ' +
			'for foreach goto if import last local my next no our package redo ref ' + 
			'require return sub tie tied unless untie until use wantarray while ' +
			// feature
			'given when default ' +
			// Try::Tiny
			'try catch finally ' +
			// Moose
			'has extends with before after around override augment';
    
		this.regexList = [
			{ regex: /(<<|&lt;&lt;)((\w+)|(['"])(.+?)\4)[\s\S]+?\n\3\5\n/g,	css: 'string' },	// here doc (maybe html encoded)
			{ regex: /#.*$/gm,										css: 'comments' },
			{ regex: /^#!.*\n/g,									css: 'preprocessor' },	// shebang
			{ regex: /-?\w+(?=\s*=(>|&gt;))/g,	css: 'string' }, // fat comma

			// is this too much?
			{ regex: /\bq[qwxr]?\([\s\S]*?\)/g,	css: 'string' }, // quote-like operators ()
			{ regex: /\bq[qwxr]?\{[\s\S]*?\}/g,	css: 'string' }, // quote-like operators {}
			{ regex: /\bq[qwxr]?\[[\s\S]*?\]/g,	css: 'string' }, // quote-like operators []
			{ regex: /\bq[qwxr]?(<|&lt;)[\s\S]*?(>|&gt;)/g,	css: 'string' }, // quote-like operators <>
			{ regex: /\bq[qwxr]?([^\w({<[])[\s\S]*?\1/g,	css: 'string' }, // quote-like operators non-paired

			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,	css: 'string' },
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,	css: 'string' },
			// currently ignoring single quote package separator and utf8 names
			{ regex: /(?:&amp;|[$@%*]|\$#)[a-zA-Z_](\w+|::)*/g,   		css: 'variable' },
			{ regex: /\b__(?:END|DATA)__\b[\s\S]*$/g,				css: 'comments' },
			{ regex: /(^|\n)=\w[\s\S]*?(\n=cut\s*\n|$)/g,				css: 'comments' },		// pod
			{ regex: new RegExp(this.getKeywords(funcs), 'gm'),		css: 'functions' },
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' }
		];

		this.forHtmlScript(SyntaxHighlighter.regexLib.phpScriptTags);
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases		= ['perl', 'Perl', 'pl'];

	SyntaxHighlighter.brushes.Perl = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var funcs	=	'abs acos acosh addcslashes addslashes ' +
						'array_change_key_case array_chunk array_combine array_count_values array_diff '+
						'array_diff_assoc array_diff_key array_diff_uassoc array_diff_ukey array_fill '+
						'array_filter array_flip array_intersect array_intersect_assoc array_intersect_key '+
						'array_intersect_uassoc array_intersect_ukey array_key_exists array_keys array_map '+
						'array_merge array_merge_recursive array_multisort array_pad array_pop array_product '+
						'array_push array_rand array_reduce array_reverse array_search array_shift '+
						'array_slice array_splice array_sum array_udiff array_udiff_assoc '+
						'array_udiff_uassoc array_uintersect array_uintersect_assoc '+
						'array_uintersect_uassoc array_unique array_unshift array_values array_walk '+
						'array_walk_recursive atan atan2 atanh base64_decode base64_encode base_convert '+
						'basename bcadd bccomp bcdiv bcmod bcmul bindec bindtextdomain bzclose bzcompress '+
						'bzdecompress bzerrno bzerror bzerrstr bzflush bzopen bzread bzwrite ceil chdir '+
						'checkdate checkdnsrr chgrp chmod chop chown chr chroot chunk_split class_exists '+
						'closedir closelog copy cos cosh count count_chars date decbin dechex decoct '+
						'deg2rad delete ebcdic2ascii echo empty end ereg ereg_replace eregi eregi_replace error_log '+
						'error_reporting escapeshellarg escapeshellcmd eval exec exit exp explode extension_loaded '+
						'feof fflush fgetc fgetcsv fgets fgetss file_exists file_get_contents file_put_contents '+
						'fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype '+
						'floatval flock floor flush fmod fnmatch fopen fpassthru fprintf fputcsv fputs fread fscanf '+
						'fseek fsockopen fstat ftell ftok getallheaders getcwd getdate getenv gethostbyaddr gethostbyname '+
						'gethostbynamel getimagesize getlastmod getmxrr getmygid getmyinode getmypid getmyuid getopt '+
						'getprotobyname getprotobynumber getrandmax getrusage getservbyname getservbyport gettext '+
						'gettimeofday gettype glob gmdate gmmktime ini_alter ini_get ini_get_all ini_restore ini_set '+
						'interface_exists intval ip2long is_a is_array is_bool is_callable is_dir is_double '+
						'is_executable is_file is_finite is_float is_infinite is_int is_integer is_link is_long '+
						'is_nan is_null is_numeric is_object is_readable is_real is_resource is_scalar is_soap_fault '+
						'is_string is_subclass_of is_uploaded_file is_writable is_writeable mkdir mktime nl2br '+
						'parse_ini_file parse_str parse_url passthru pathinfo print readlink realpath rewind rewinddir rmdir '+
						'round str_ireplace str_pad str_repeat str_replace str_rot13 str_shuffle str_split '+
						'str_word_count strcasecmp strchr strcmp strcoll strcspn strftime strip_tags stripcslashes '+
						'stripos stripslashes stristr strlen strnatcasecmp strnatcmp strncasecmp strncmp strpbrk '+
						'strpos strptime strrchr strrev strripos strrpos strspn strstr strtok strtolower strtotime '+
						'strtoupper strtr strval substr substr_compare';

		var keywords =	'abstract and array as break case catch cfunction class clone const continue declare default die do ' +
						'else elseif enddeclare endfor endforeach endif endswitch endwhile extends final for foreach ' +
						'function global goto if implements include include_once interface instanceof insteadof namespace new ' +
						'old_function or private protected public return require require_once static switch ' +
						'trait throw try use var while xor ';
		
		var constants	= '__FILE__ __LINE__ __METHOD__ __FUNCTION__ __CLASS__';

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },			// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// single quoted strings
			{ regex: /\$\w+/g,											css: 'variable' },			// variables
			{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),		css: 'functions' },			// common functions
			{ regex: new RegExp(this.getKeywords(constants), 'gmi'),	css: 'constants' },			// constants
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }			// keyword
			];

		this.forHtmlScript(SyntaxHighlighter.regexLib.phpScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['php'];

	SyntaxHighlighter.brushes.Php = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['text', 'plain'];

	SyntaxHighlighter.brushes.Plain = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Joel 'Jaykul' Bennett, http://PoshCode.org | http://HuddledMasses.org
		var keywords =	'while validateset validaterange validatepattern validatelength validatecount ' +
						'until trap switch return ref process param parameter in if global: '+
						'function foreach for finally filter end elseif else dynamicparam do default ' +
						'continue cmdletbinding break begin alias \\? % #script #private #local #global '+
						'mandatory parametersetname position valuefrompipeline ' +
						'valuefrompipelinebypropertyname valuefromremainingarguments helpmessage ';

		var operators =	' and as band bnot bor bxor casesensitive ccontains ceq cge cgt cle ' +
						'clike clt cmatch cne cnotcontains cnotlike cnotmatch contains ' +
						'creplace eq exact f file ge gt icontains ieq ige igt ile ilike ilt ' +
						'imatch ine inotcontains inotlike inotmatch ireplace is isnot le like ' +
						'lt match ne not notcontains notlike notmatch or regex replace wildcard';
						
		var verbs =		'write where wait use update unregister undo trace test tee take suspend ' +
						'stop start split sort skip show set send select scroll resume restore ' +
						'restart resolve resize reset rename remove register receive read push ' +
						'pop ping out new move measure limit join invoke import group get format ' +
						'foreach export expand exit enter enable disconnect disable debug cxnew ' +
						'copy convertto convertfrom convert connect complete compare clear ' +
						'checkpoint aggregate add';

		// I can't find a way to match the comment based help in multi-line comments, because SH won't highlight in highlights, and javascript doesn't support lookbehind
		var commenthelp = ' component description example externalhelp forwardhelpcategory forwardhelptargetname forwardhelptargetname functionality inputs link notes outputs parameter remotehelprunspace role synopsis';

		this.regexList = [
			{ regex: new RegExp('^\\s*#[#\\s]*\\.('+this.getKeywords(commenthelp)+').*$', 'gim'),			css: 'preprocessor help bold' },		// comment-based help
			{ regex: SyntaxHighlighter.regexLib.singleLinePerlComments,										css: 'comments' },						// one line comments
			{ regex: /(&lt;|<)#[\s\S]*?#(&gt;|>)/gm,														css: 'comments here' },					// multi-line comments
			
			{ regex: new RegExp('@"\\n[\\s\\S]*?\\n"@', 'gm'),												css: 'script string here' },			// double quoted here-strings
			{ regex: new RegExp("@'\\n[\\s\\S]*?\\n'@", 'gm'),												css: 'script string single here' },		// single quoted here-strings
			{ regex: new RegExp('"(?:\\$\\([^\\)]*\\)|[^"]|`"|"")*[^`]"','g'),								css: 'string' },						// double quoted strings
			{ regex: new RegExp("'(?:[^']|'')*'", 'g'),														css: 'string single' },					// single quoted strings
			
			{ regex: new RegExp('[\\$|@|@@](?:(?:global|script|private|env):)?[A-Z0-9_]+', 'gi'),			css: 'variable' },						// $variables
			{ regex: new RegExp('(?:\\b'+verbs.replace(/ /g, '\\b|\\b')+')-[a-zA-Z_][a-zA-Z0-9_]*', 'gmi'),	css: 'functions' },						// functions and cmdlets
			{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),											css: 'keyword' },						// keywords
			{ regex: new RegExp('-'+this.getKeywords(operators), 'gmi'),									css: 'operator value' },				// operators
			{ regex: new RegExp('\\[[A-Z_\\[][A-Z0-9_. `,\\[\\]]*\\]', 'gi'),								css: 'constants' },						// .Net [Type]s
			{ regex: new RegExp('\\s+-(?!'+this.getKeywords(operators)+')[a-zA-Z_][a-zA-Z0-9_]*', 'gmi'),	css: 'color1' },						// parameters	  
		];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['powershell', 'ps', 'posh'];

	SyntaxHighlighter.brushes.PowerShell = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Gheorghe Milas and Ahmad Sherif
	
		var keywords =  'and assert break class continue def del elif else ' +
						'except exec finally for from global if import in is ' +
						'lambda not or pass print raise return try yield while';

		var funcs = '__import__ abs all any apply basestring bin bool buffer callable ' +
					'chr classmethod cmp coerce compile complex delattr dict dir ' +
					'divmod enumerate eval execfile file filter float format frozenset ' +
					'getattr globals hasattr hash help hex id input int intern ' +
					'isinstance issubclass iter len list locals long map max min next ' +
					'object oct open ord pow print property range raw_input reduce ' +
					'reload repr reversed round set setattr slice sorted staticmethod ' +
					'str sum super tuple type type unichr unicode vars xrange zip';

		var special =  'None True False self cls class_';

		this.regexList = [
				{ regex: SyntaxHighlighter.regexLib.singleLinePerlComments, css: 'comments' },
				{ regex: /^\s*@\w+/gm, 										css: 'decorator' },
				{ regex: /(['\"]{3})([^\1])*?\1/gm, 						css: 'comments' },
				{ regex: /"(?!")(?:\.|\\\"|[^\""\n])*"/gm, 					css: 'string' },
				{ regex: /'(?!')(?:\.|(\\\')|[^\''\n])*'/gm, 				css: 'string' },
				{ regex: /\+|\-|\*|\/|\%|=|==/gm, 							css: 'keyword' },
				{ regex: /\b\d+\.?\w*/g, 									css: 'value' },
				{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),		css: 'functions' },
				{ regex: new RegExp(this.getKeywords(keywords), 'gm'), 		css: 'keyword' },
				{ regex: new RegExp(this.getKeywords(special), 'gm'), 		css: 'color1' }
				];
			
		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['py', 'python'];

	SyntaxHighlighter.brushes.Python = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Erik Peterson.
	
		var keywords =	'alias and BEGIN begin break case class def define_method defined do each else elsif ' +
						'END end ensure false for if in module new next nil not or raise redo rescue retry return ' +
						'self super then throw true undef unless until when while yield';

		var builtins =	'Array Bignum Binding Class Continuation Dir Exception FalseClass File::Stat File Fixnum Fload ' +
						'Hash Integer IO MatchData Method Module NilClass Numeric Object Proc Range Regexp String Struct::TMS Symbol ' +
						'ThreadGroup Thread Time TrueClass';

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLinePerlComments,	css: 'comments' },		// one line comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },		// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// single quoted strings
			{ regex: /\b[A-Z0-9_]+\b/g,									css: 'constants' },		// constants
			{ regex: /:[a-z][A-Za-z0-9_]*/g,							css: 'color2' },		// symbols
			{ regex: /(\$|@@|@)\w+/g,									css: 'variable bold' },	// $global, @instance, and @@class variables
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },		// keywords
			{ regex: new RegExp(this.getKeywords(builtins), 'gm'),		css: 'color1' }			// builtins
			];

		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['ruby', 'rails', 'ror', 'rb'];

	SyntaxHighlighter.brushes.Ruby = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		function getKeywordsCSS(str)
		{
			return '\\b([a-z_]|)' + str.replace(/ /g, '(?=:)\\b|\\b([a-z_\\*]|\\*|)') + '(?=:)\\b';
		};
	
		function getValuesCSS(str)
		{
			return '\\b' + str.replace(/ /g, '(?!-)(?!:)\\b|\\b()') + '\:\\b';
		};

		var keywords =	'ascent azimuth background-attachment background-color background-image background-position ' +
						'background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top ' +
						'border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color ' +
						'border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width ' +
						'border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color ' +
						'content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display ' +
						'elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font ' +
						'height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top ' +
						'margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans ' +
						'outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page ' +
						'page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position ' +
						'quotes right richness size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress ' +
						'table-layout text-align top text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em ' +
						'vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index';
		
		var values =	'above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder '+
						'both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed '+
						'continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero digits disc dotted double '+
						'embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia '+
						'gray green groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic '+
						'justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha '+
						'lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower '+
						'navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset '+
						'outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side '+
						'rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow '+
						'small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize '+
						'table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal '+
						'text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin '+
						'upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow';
		
		var fonts =		'[mM]onospace [tT]ahoma [vV]erdana [aA]rial [hH]elvetica [sS]ans-serif [sS]erif [cC]ourier mono sans serif';
		
		var statements		= '!important !default';
		var preprocessor	= '@import @extend @debug @warn @if @for @while @mixin @include';
		
		var r = SyntaxHighlighter.regexLib;
		
		this.regexList = [
			{ regex: r.multiLineCComments,								css: 'comments' },		// multiline comments
			{ regex: r.singleLineCComments,								css: 'comments' },		// singleline comments
			{ regex: r.doubleQuotedString,								css: 'string' },		// double quoted strings
			{ regex: r.singleQuotedString,								css: 'string' },		// single quoted strings
			{ regex: /\#[a-fA-F0-9]{3,6}/g,								css: 'value' },			// html colors
			{ regex: /\b(-?\d+)(\.\d+)?(px|em|pt|\:|\%|)\b/g,			css: 'value' },			// sizes
			{ regex: /\$\w+/g,											css: 'variable' },		// variables
			{ regex: new RegExp(this.getKeywords(statements), 'g'),		css: 'color3' },		// statements
			{ regex: new RegExp(this.getKeywords(preprocessor), 'g'),	css: 'preprocessor' },	// preprocessor
			{ regex: new RegExp(getKeywordsCSS(keywords), 'gm'),		css: 'keyword' },		// keywords
			{ regex: new RegExp(getValuesCSS(values), 'g'),				css: 'value' },			// values
			{ regex: new RegExp(this.getKeywords(fonts), 'g'),			css: 'color1' }			// fonts
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['sass', 'scss'];

	SyntaxHighlighter.brushes.Sass = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		// Contributed by Yegor Jbanov and David Bernard.
	
		var keywords =	'val sealed case def true trait implicit forSome import match object null finally super ' +
						'override try lazy for var catch throw type extends class while with new final yield abstract ' +
						'else do if return protected private this package false';

		var keyops =	'[_:=><%#@]+';

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,			css: 'comments' },	// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,				css: 'comments' },	// multiline comments
			{ regex: SyntaxHighlighter.regexLib.multiLineSingleQuotedString,	css: 'string' },	// multi-line strings
			{ regex: SyntaxHighlighter.regexLib.multiLineDoubleQuotedString,    css: 'string' },	// double-quoted string
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,				css: 'string' },	// strings
			{ regex: /0x[a-f0-9]+|\d+(\.\d+)?/gi,								css: 'value' },		// numbers
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),				css: 'keyword' },	// keywords
			{ regex: new RegExp(keyops, 'gm'),									css: 'keyword' }	// scala keyword
			];
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['scala'];

	SyntaxHighlighter.brushes.Scala = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var funcs	=	'abs avg case cast coalesce convert count current_timestamp ' +
						'current_user day isnull left lower month nullif replace right ' +
						'session_user space substring sum system_user upper user year';

		var keywords =	'absolute action add after alter as asc at authorization begin bigint ' +
						'binary bit by cascade char character check checkpoint close collate ' +
						'column commit committed connect connection constraint contains continue ' +
						'create cube current current_date current_time cursor database date ' +
						'deallocate dec decimal declare default delete desc distinct double drop ' +
						'dynamic else end end-exec escape except exec execute false fetch first ' +
						'float for force foreign forward free from full function global goto grant ' +
						'group grouping having hour ignore index inner insensitive insert instead ' +
						'int integer intersect into is isolation key last level load local max min ' +
						'minute modify move name national nchar next no numeric of off on only ' +
						'open option order out output partial password precision prepare primary ' +
						'prior privileges procedure public read real references relative repeatable ' +
						'restrict return returns revoke rollback rollup rows rule schema scroll ' +
						'second section select sequence serializable set size smallint static ' +
						'statistics table temp temporary then time timestamp to top transaction ' +
						'translation trigger true truncate uncommitted union unique update values ' +
						'varchar varying view when where with work';

		var operators =	'all and any between cross in join like not null or outer some';

		this.regexList = [
			{ regex: /--(.*)$/gm,												css: 'comments' },			// one line and multiline comments
			{ regex: SyntaxHighlighter.regexLib.multiLineDoubleQuotedString,	css: 'string' },			// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.multiLineSingleQuotedString,	css: 'string' },			// single quoted strings
			{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),				css: 'color2' },			// functions
			{ regex: new RegExp(this.getKeywords(operators), 'gmi'),			css: 'color1' },			// operators and such
			{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),				css: 'keyword' }			// keyword
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['sql'];

	SyntaxHighlighter.brushes.Sql = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		var keywords =	'AddHandler AddressOf AndAlso Alias And Ansi As Assembly Auto ' +
						'Boolean ByRef Byte ByVal Call Case Catch CBool CByte CChar CDate ' +
						'CDec CDbl Char CInt Class CLng CObj Const CShort CSng CStr CType ' +
						'Date Decimal Declare Default Delegate Dim DirectCast Do Double Each ' +
						'Else ElseIf End Enum Erase Error Event Exit False Finally For Friend ' +
						'Function Get GetType GoSub GoTo Handles If Implements Imports In ' +
						'Inherits Integer Interface Is Let Lib Like Long Loop Me Mod Module ' +
						'MustInherit MustOverride MyBase MyClass Namespace New Next Not Nothing ' +
						'NotInheritable NotOverridable Object On Option Optional Or OrElse ' +
						'Overloads Overridable Overrides ParamArray Preserve Private Property ' +
						'Protected Public RaiseEvent ReadOnly ReDim REM RemoveHandler Resume ' +
						'Return Select Set Shadows Shared Short Single Static Step Stop String ' +
						'Structure Sub SyncLock Then Throw To True Try TypeOf Unicode Until ' +
						'Variant When While With WithEvents WriteOnly Xor';

		this.regexList = [
			{ regex: /'.*$/gm,										css: 'comments' },			// one line comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,	css: 'string' },			// strings
			{ regex: /^\s*#.*$/gm,									css: 'preprocessor' },		// preprocessor tags like #region and #endregion
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' }			// vb keyword
			];

		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['vb', 'vbnet'];

	SyntaxHighlighter.brushes.Vb = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		function process(match, regexInfo)
		{
			var constructor = SyntaxHighlighter.Match,
				code = match[0],
				tag = new XRegExp('(&lt;|<)[\\s\\/\\?]*(?<name>[:\\w-\\.]+)', 'xg').exec(code),
				result = []
				;
		
			if (match.attributes != null) 
			{
				var attributes,
					regex = new XRegExp('(?<name> [\\w:\\-\\.]+)' +
										'\\s*=\\s*' +
										'(?<value> ".*?"|\'.*?\'|\\w+)',
										'xg');

				while ((attributes = regex.exec(code)) != null) 
				{
					result.push(new constructor(attributes.name, match.index + attributes.index, 'color1'));
					result.push(new constructor(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
				}
			}

			if (tag != null)
				result.push(
					new constructor(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword')
				);

			return result;
		}
	
		this.regexList = [
			{ regex: new XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),			css: 'color2' },	// <![ ... [ ... ]]>
			{ regex: SyntaxHighlighter.regexLib.xmlComments,												css: 'comments' },	// <!-- ... -->
			{ regex: new XRegExp('(&lt;|<)[\\s\\/\\?]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'), func: process }
		];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['xml', 'xhtml', 'xslt', 'html'];

	SyntaxHighlighter.brushes.Xml = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
