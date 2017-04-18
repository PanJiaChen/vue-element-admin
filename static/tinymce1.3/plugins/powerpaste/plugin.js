// import '../stable/plugins.min.js'
/* Ephox PowerPaste plugin
 *
 * Copyright 2010-2015 Ephox Corporation.  All rights reserved.
 *
 * Version: 2.1.0.0
 */
(function () {

  if (this.ephox)
    var old = this.ephox.bolt;

var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

var register = function (id) {
  var module = dem(id);
  var fragments = id.split('.');
  var target = Function('return this;')();
  for (var i = 0; i < fragments.length - 1; ++i) {
    if (target[fragments[i]] === undefined)
      target[fragments[i]] = {};
    target = target[fragments[i]];
  }
  target[fragments[fragments.length - 1]] = module;
};

var instantiate = function (id) {
  var dependencies = defs[id].dependencies;
  var definition = defs[id].definition;
  var instances = [];
  for (var i = 0; i < dependencies.length; ++i)
    instances.push(dem(dependencies[i]));
  defs[id].instance = definition.apply(null, instances);
  if (defs[id].instance === undefined)
     throw 'required module [' + id + '] could not be defined (definition function returned undefined)';
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'invalid module definition, module id must be defined and be a string';
  if (dependencies === undefined)
    throw 'invalid module definition, dependencies must be specified';
  if (definition === undefined)
    throw 'invalid module definition, definition function must be specified';
  defs[id] = {
    dependencies: dependencies,
    definition: definition,
    instance: undefined
  };
};

var dem = function (id) {
  if (defs[id] === undefined)
    throw 'required module [' + id + '] is not defined';
  if (defs[id].instance === undefined)
    instantiate(id);
  return defs[id].instance;
};

var req = function (ids, callback) {
  var instances = [];
  for (var i = 0; i < ids.length; ++i)
    instances.push(dem(ids[i]));
  callback.apply(null, callback);
};

var ephox = this.ephox || {};

ephox.bolt = {
  module: {
    api: {
      define: def,
      require: req,
      demand: dem
    }
  }
};


// This is here to give hints to minification
// ephox.bolt.module.api.define
var eeephox_def_eeephox = def;
// ephox.bolt.module.api.require
var eeephox_req_eeephox = req;
// ephox.bolt.module.api.demand
var eeephox_dem_eeephox = dem;

/*jsc
["ephox.powerpaste.util.NodeUtil","ephox.powerpaste.i18n.I18n","ephox.powerpaste.alien.Once","ephox.powerpaste.PowerPastePlugin","ephox.powerpaste.settings.Defaults","ephox.powerpaste.styles.Styles","ephox.powerpaste.legacy.data.tokens.Helper","ephox.powerpaste.legacy.data.tokens.Tokenizer","ephox.powerpaste.legacy.data.tokens.Serializer","ephox.powerpaste.legacy.data.tokens.Filter","ephox.powerpaste.legacy.data.tokens.Attributes","ephox.powerpaste.legacy.data.tokens.Token","ephox.powerpaste.legacy.data.Insert","ephox.powerpaste.legacy.wordimport.WordOnlyFilters","ephox.powerpaste.legacy.wordimport.WordImport","ephox.powerpaste.legacy.wordimport.CommonFilters","ephox.powerpaste.legacy.filters.list.Emitter","ephox.powerpaste.legacy.filters.list.Lists","ephox.powerpaste.legacy.filters.list.ListTypes","ephox.powerpaste.legacy.filters.list.ListStates","ephox.powerpaste.legacy.filters.list.CommentHeuristics","ephox.powerpaste.legacy.filters.StripImages","ephox.powerpaste.legacy.filters.FilterInlineStyles","ephox.powerpaste.legacy.filters.StripBookmarks","ephox.powerpaste.legacy.filters.StripScripts","ephox.powerpaste.legacy.filters.StripLangAttribute","ephox.powerpaste.legacy.filters.Text","ephox.powerpaste.legacy.filters.StripTocLinks","ephox.powerpaste.legacy.filters.StripNoAttributeA","ephox.powerpaste.legacy.filters.InferListTags","ephox.powerpaste.legacy.filters.StripOPTags","ephox.powerpaste.legacy.filters.StripFormattingAttributes","ephox.powerpaste.legacy.filters.StripEmptyStyleAttributes","ephox.powerpaste.legacy.filters.StripEmptyInlineElements","ephox.powerpaste.legacy.filters.StripNamespaceDeclarations","ephox.powerpaste.legacy.filters.StripClassAttributes","ephox.powerpaste.legacy.filters.StripMetaAndLinkElements","ephox.powerpaste.legacy.filters.StripVMLAttributes","ephox.powerpaste.legacy.tinymce.Clipboard","ephox.powerpaste.legacy.tinymce.Settings","ephox.powerpaste.legacy.tinymce.Util","ephox.powerpaste.legacy.tinymce.BrowserFilters","ephox.powerpaste.tinymce.ModernPowerDrop","ephox.powerpaste.tinymce.ModernTinyDialog","ephox.powerpaste.tinymce.ModernPowerPaste","ephox.powerpaste.tinymce.ErrorDialog","ephox.powerpaste.tinymce.LegacyPowerPaste","ephox.powerpaste.tinymce.LegacyTinyDialog","ephox.powerpaste.tinymce.UndoRewriter","ephox.powerpaste.tinymce.TinyPowerPaste","ephox.powerpaste.imageupload.UploaderFactory","ephox.powerpaste.imageupload.TinyUploader","ephox.powerpaste.imageupload.EphoxUploader","ephox.powerpaste.imageupload.UploadError","global!document","global!tinymce","ephox.compass.Arr","ephox.peanut.Fun","ephox.perhaps.Option","ephox.salmon.api.Ephemera","ephox.sugar.api.Element","ephox.sugar.api.Elements","ephox.sugar.api.InsertAll","ephox.sugar.api.SelectorFilter","ephox.salmon.api.BlobCache","ephox.salmon.api.ImageTracker","ephox.salmon.api.UploadUtils","ephox.salmon.api.Uploaders","ephox.sugar.api.Attr","global!setTimeout","ephox.hermes.api.ImageAsset","ephox.hermes.api.ImageExtract","ephox.cement.api.Cement","ephox.sugar.api.Insert","ephox.sugar.api.Remove","ephox.sugar.api.SelectorExists","ephox.sugar.api.SelectorFind","ephox.porkbun.Event","ephox.porkbun.Events","ephox.sugar.api.DomEvent","global!Array","global!String","ephox.salmon.style.Styles","ephox.classify.Type","ephox.compass.Obj","global!Error","global!console","ephox.sugar.api.Traverse","ephox.sugar.api.PredicateFilter","ephox.sugar.api.Selectors","ephox.sugar.impl.ClosestOrAncestor","ephox.numerosity.api.URL","ephox.scullion.Struct","ephox.highway.Merger","ephox.scullion.ADT","ephox.perhaps.Result","ephox.salmon.ui.UploadUi","ephox.salmon.services.UploadCommon","ephox.salmon.services.UploadDirect","ephox.salmon.services.UploadFunction","ephox.hermes.utils.ImageExtract","ephox.cement.flash.Flash","ephox.cement.smartpaste.MergeSettings","ephox.cement.smartpaste.PasteBroker","ephox.limbo.api.RtfImage","ephox.plumber.tap.function.BlockTap","ephox.porkbun.SourceEvent","ephox.sloth.api.Paste","ephox.sugar.impl.FilteredEvent","ephox.flour.style.Resolver","ephox.scullion.Immutable","ephox.scullion.Immutable2","ephox.scullion.MixedBag","ephox.sugar.alien.Recurse","ephox.sugar.api.Compare","ephox.sugar.api.Body","ephox.bud.NodeTypes","ephox.numerosity.core.Global","ephox.sugar.api.Class","ephox.numerosity.api.FormData","ephox.violin.Strings","ephox.jax.plain.Ajax","ephox.numerosity.api.JSON","ephox.yuri.api.Resolver","ephox.epithet.Id","ephox.fred.PlatformDetection","ephox.numerosity.api.FileReader","ephox.bowerbird.api.Rtf","ephox.cement.flash.Correlation","ephox.cement.flash.FlashDialog","ephox.sugar.api.Css","ephox.sugar.api.Node","ephox.sugar.api.PredicateFind","ephox.sugar.api.Replication","ephox.cement.style.Styles","ephox.cement.smartpaste.Inspection","ephox.cement.smartpaste.PasteHandlers","ephox.perhaps.Options","global!RegExp","ephox.plumber.tap.control.BlockControl","ephox.plumber.tap.wrap.Tapped","ephox.scullion.BagUtils","global!Object","ephox.peanut.Thunk","ephox.epithet.Resolve","ephox.sugar.alien.Toggler","ephox
jsc*/
ephox.bolt.module.api.define("global!document", [], function () { return document; });
(function (define, require, demand) {
define(
  'ephox.powerpaste.util.NodeUtil',
  [
    'global!document'
  ],
  function(document){
    var nodeToString = function ( node ) {
      var tmpNode = document.createElement( "div" );
      tmpNode.appendChild( node.cloneNode( true ) );
      var str = tmpNode.innerHTML;
      tmpNode = node = null; // prevent memory leaks in IE
      return str;
    };

    return {
      nodeToString: nodeToString
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!tinymce", [], function () { return tinymce; });
(function (define, require, demand) {
define('ephox.powerpaste.i18n.I18n',

  [
    'global!tinymce'
  ],

  function(tinymce) {
    var missingFlash = function() {
      return "Your browser security settings may be preventing images from being imported.";
    };

    var flashClipboard = function() {
      return tinymce.Env.mac && tinymce.Env.webkit ? missingFlash() + " <a href=\"https://support.ephox.com/entries/59328357-Safari-6-1-and-7-Flash-Sandboxing\" style=\"text-decoration: underline\">More information on paste for Safari</a>" :
      missingFlash();
    };

    var english = {
      "cement.dialog.paste.title": "Paste Formatting Options",
      "cement.dialog.paste.instructions": "Choose to keep or remove formatting in the pasted content.",
      "cement.dialog.paste.merge": "Keep Formatting",
      "cement.dialog.paste.clean": "Remove Formatting",
      "cement.dialog.flash.title": "Local Image Import",
      "cement.dialog.flash.trigger-paste": "Trigger paste again from the keyboard to paste content with images.",
      "cement.dialog.flash.missing": "Adobe Flash is required to import images from Microsoft Office. Install the <a href=\"http://get.adobe.com/flashplayer/\" target=\"_blank\">Adobe Flash Player</a>.",
      "cement.dialog.flash.press-escape": "Press <span class=\"ephox-polish-help-kbd\">ESC</span> to ignore local images and continue editing.",
      "loading.wait" : "Please wait...",
      "flash.clipboard.no.rtf": flashClipboard(),
      "safari.imagepaste": "Safari does not support direct paste of images. <a href=\"https://support.ephox.com/entries/88543243-Safari-Direct-paste-of-images-does-not-work\" style=\"text-decoration: underline\">More information on image pasting for Safari</a>",
      "error.code.images.not.found": "The images service was not found: (",
      "error.imageupload": "Image failed to upload: (",
      "error.full.stop": ").",
      "errors.local.images.disallowed": "Local image paste has been disabled. Local images have been removed from pasted content."
    };

    var getEnglishText = function(key) {
      return english[key];
    };

    var translate = function (key) {
      //This function acts as a shim between tiny's translation engine, which uses raw strings
      //and cement's, which works off string pointers
      return tinymce.translate(getEnglishText(key));
    };

    return {
      translate: translate
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.alien.Once',

  [

  ],

  function () {
    // Maybe belongs in peanut.Fun?
    return function (f) {
      var called = false;
      return function () {
        if (!called) {
          called = true;
          f.apply(null, arguments);
        }
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!Array", [], function () { return Array; });
ephox.bolt.module.api.define("global!String", [], function () { return String; });
(function (define, require, demand) {
define(
  'ephox.compass.Arr',

  [
    'global!Array',
    'global!String'
  ],

  function (Array, String) {
    var eqC = function(x) {
      return function(y) {
        return x === y;
      };
    };

    var isTrue = eqC(true);

    var contains = function(xs, x) {
      return exists(xs, eqC(x));
    };

    var chunk = function (array, size) {
      var r = [];
      for (var i = 0; i < array.length; i += size) {
        var s = array.slice(i, i + size);
        r.push(s);
      }
      return r;
    };

    var map = function(xs, f) {
      var r = [];
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        r.push(f(x, i, xs));
      }
      return r;
    };

    var each = function(xs, f) {
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        f(x, i, xs);
      }
    };

    var partition = function(xs, pred) {
      var pass = [];
      var fail = [];
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        var arr = pred(x, i, xs) ? pass : fail;
        arr.push(x);
      }
      return { pass: pass, fail: fail };
    };

    var filter = function(xs, pred) {
      var r = [];
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          r.push(x);
        }
      }
      return r;
    };

    /*
     * Groups an array into contiguous arrays of like elements. Whether an element is like or not depends on f.
     *
     * f is a function that derives a value from an element - e.g. true or false, or a string.
     * Elements are like if this function generates the same value for them (according to ===).
     *
     *
     * Order of the elements is preserved. Arr.flatten() on the result will return the original list, as with Haskell groupBy function.
     *  For a good explanation, see the group function (which is a special case of groupBy)
     *  http://hackage.haskell.org/package/base-4.7.0.0/docs/Data-List.html#v:group
     */
    var groupBy = function (xs, f) {
      if (xs.length === 0) {
        return [];
      } else {
        var wasType = f(xs[0]); // initial case for matching
        var r = [];
        var group = [];

        each(xs, function (x) {
          var type = f(x);
          if (type !== wasType) {
            r.push(group);
            group = [];
          }
          wasType = type;
          group.push(x);
        });
        if (group.length !== 0) {
          r.push(group);
        }
        return r;
      }
    };

    var indexOf = function(xs, x) {
      if (arguments.length !== 2)
        throw 'Expected 2 arguments to indexOf';
      return findIndex(xs, eqC(x));
    };

    var foldr = function (xs, f, acc) {
      return foldl(reverse(xs), f, acc);
    };

    var foldl = function (xs, f, acc) {
      each(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };

    var find = function(xs, pred) {
      if (arguments.length !== 2)
        throw 'Expected 2 arguments to find';
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return x;
        }
      }
      return undefined;
    };

    var findOr = function (xs, f, default_) {
      var r = find(xs, f);
      return r !== undefined ? r : default_;
    };

    var findOrDie = function (xs, f, message) {
      var r = find(xs, f);
      if (r === undefined)
        throw message || 'Could not find element in array: ' + String(xs);
      return r;
    };

    var findIndex = function (xs, pred) {
      var fn = pred || isTrue;

      for (var i = 0; i < xs.length; ++i)
        if (fn(xs[i]) === true)
          return i;

      return -1;
    };

    var flatten = function (xs) {
      var r = [];
      for (var i = 0; i < xs.length; ++i)
        r = r.concat(xs[i]);
      return r;
    };

    var bind = function (xs, f) {
      var output = map(xs, f);
      return flatten(output);
    };

    var forall = function (xs, pred) {
      var fn = pred || isTrue;
      for (var i = 0; i < xs.length; ++i)
        if (fn(xs[i], i) !== true)
          return false;
      return true;
    };

    var exists = function (xs, pred) {
      var fn = pred || isTrue;
      for (var i = 0; i < xs.length; ++i)
        if (fn(xs[i]) === true)
          return true;
      return false;
    };

    var equal = function (a1, a2) {
      return a1.length === a2.length && forall(a1, function (x, i) {
        return x === a2[i];
      });
    };

    var reverse = function (xs) {
      var r = Array.prototype.slice.call(xs, 0);
      r.reverse();
      return r;
    };

    var difference = function (a1, a2) {
      return filter(a1, function (x) {
        return !contains(a2, x);
      });
    };

    var mapToObject = function(xs, f) {
      var r = {};
      each(xs, function(x, i) {
        r[String(x)] = f(x, i);
      });
      return r;
    };

    return {
      map: map,
      each: each,
      partition: partition,
      filter: filter,
      groupBy: groupBy,
      indexOf: indexOf,
      foldr: foldr,
      foldl: foldl,
      find: find,
      findIndex: findIndex,
      findOr: findOr,
      findOrDie: findOrDie,
      flatten: flatten,
      bind: bind,
      forall: forall,
      exists: exists,
      contains: contains,
      equal: equal,
      reverse: reverse,
      chunk: chunk,
      difference: difference,
      mapToObject: mapToObject
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.peanut.Fun',

  [
    'global!Array'
  ],

  function (Array) {
    var noop = function () { };

    var compose = function (fa, fb) {
      return function () {
        return fa(fb.apply(null, arguments));
      };
    };

    var constant = function (value) {
      return function () {
        return value;
      };
    };

    var identity = function (x) {
      return x;
    };

    var tripleEquals = function(a, b) {
      return a === b;
    };

    var curry = function (f) {
      var slice = Array.prototype.slice;
      var args = slice.call(arguments, 1);
      return function () {
        var all = args.concat(slice.call(arguments, 0));
        return f.apply(null, all);
      };
    };

    var not = function (f) {
      return function () {
        return !f.apply(null, arguments);
      };
    };

    var die = function (msg) {
      return function () {
        throw msg;
      };
    };

    var apply = function (f) {
      return f();
    };

    return {
      noop: noop,
      compose: compose,
      constant: constant,
      identity: identity,
      tripleEquals: tripleEquals,
      curry: curry,
      not: not,
      die: die,
      apply: apply
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.perhaps.Option',

  [
    'ephox.peanut.Fun'
  ],

  function (Fun) {

    /** some :: a -> Option a */
    var some = function (value) {
      return option(function (n, s) {
        return s(value);
      });
    };

    /** none :: () -> Option a */
    var none = function () {
      return option(function (n, s) {
        return n();
      });
    };

    /** from :: undefined|null|a -> Option a */
    var from = function (value) {
      return value === null || value === undefined ? none() : some(value);
    };

    /** option :: (() -> t, a -> t) -> Option a */
    var option = function (fold) {

      /** is :: this Option a -> a -> Boolean */
      var is = function (v) {
        return fold(Fun.constant(false), function (o) {
          return o === v;
        });
      };

      /** isSome :: this Option a -> () -> Boolean */
      var isSome = function () {
        return fold(Fun.constant(false), Fun.constant(true));
      };

      /** isNone :: this Option a -> () -> Boolean */
      var isNone = Fun.not(isSome);

      /** getOr :: this Option a -> a -> a */
      var getOr = function (value) {
        return fold(Fun.constant(value), Fun.identity);
      };

      /** getOrThunk :: this Option a -> (() -> a) -> a */
      var getOrThunk = function (f) {
        return fold(f, Fun.identity);
      };

      /** getOrDie :: this Option a -> String -> a */
      var getOrDie = function (msg) {
        return fold(Fun.die(msg || 'error: getOrDie called on none.'), Fun.identity);
      };

      /** or :: this Option a -> Option a -> Option a
       *  if some: return self
       *  if none: return opt
       */
      var or = function (opt) {
        return fold(Fun.constant(opt), some);
      };

      /** orThunk :: this Option a -> (() -> Option a) -> Option a
       *  Same as "or", but uses a thunk instead of a value
       */
      var orThunk = function (f) {
        return fold(f, some);
      };

      /** map :: this Option a -> (a -> b) -> Option b
       *  "fmap" operation on the Option Functor.
       */
      var map = function (f) {
        return bind(function (value) {
          return some(f(value));
        });
      };

      /** ap :: this Option a -> Option (a -> b) -> Option b)
       *  "apply" operation on the Option Apply/Applicative.
       *  Equivalent to <*> in Haskell/PureScript.
       */
      var ap = function(ofab) {
        return fold(none, function(a) {
          return ofab.fold(none, function(fab) {
            return some(fab(a));
          });
        });
      };

      /** each :: this Option a -> (a -> b) -> Option b */
      var each = map;

      /** bind :: this Option a -> (a -> Option b) -> Option b
       *  "bind"/"flatMap" operation on the Option Bind/Monad.
       *  Equivalent to >>= in Haskell/PureScript; flatMap in Scala.
       */
      var bind = function (f) {
        return fold(none, f);
      };

      /** flatten :: {this Option (Option a))} -> () -> Option a
       *  "flatten"/"join" operation on the Option Monad.
       */
      var flatten = function () {
        return fold(none, Fun.identity);
      };

      /** exists :: this Option a -> (a -> Boolean) -> Boolean */
      var exists = function (f) {
        return fold(Fun.constant(false), f);
      };

      /** forall :: this Option a -> (a -> Boolean) -> Boolean */
      var forall = function (f) {
        return fold(Fun.constant(true), f);
      };

      /** filter :: this Option a -> (a -> Boolean) -> Option a */
      var filter = function (f) {
        return fold(none, function (v) {
          return f(v) ? some(v) : none();
        });
      };

      /** equals :: this Option a -> Option a -> Boolean */
      var equals = function (o) {
        return fold(o.isNone, o.is);
      };

      /** equals_ :: this Option a -> (Option a, a -> Boolean) -> Boolean */
      var equals_ = function (o, elementEq) {
        return fold(o.isNone, function(x) {
          return o.fold(
            Fun.constant(false),
            Fun.curry(elementEq, x)
          );
        });
      };

      /** toArray :: this Option a -> () -> [a] */
      var toArray = function () {
        return fold(Fun.constant([]), function (val) {
          return [ val ];
        });
      };

      var toString = function() {
        return fold(Fun.constant("none()"), function(a) { return "some(" + a + ")"; });
      };

      return {
        is: is,
        isSome: isSome,
        isNone: isNone,
        getOr: getOr,
        getOrThunk: getOrThunk,
        getOrDie: getOrDie,
        or: or,
        orThunk: orThunk,
        fold: fold,
        map: map,
        each: each,
        bind: bind,
        ap: ap,
        flatten: flatten,
        exists: exists,
        forall: forall,
        equals: equals,
        equals_: equals_,
        filter: filter,
        toArray: toArray,
        toString: toString
      };
    };

    /** equals :: (Option a, Option a) -> Boolean */
    var equals = function(a, b) {
      return a.equals(b);
    };

    /** equals_ :: (Option a, Option a, (a -> a) -> Boolean */
    var equals_ = function(a, b, elementEq) {
      return a.equals_(b, elementEq);
    };

    return {
      some: some,
      none: none,
      from: from,
      equals: equals,
      equals_: equals_
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.imageupload.TinyUploader',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun'
  ],

  function (Arr, Fun) {
    return function (editor) {

      var uploadImages = function() {
        editor.uploadImages();
      };

      var prepareImages = function (assets) {
        Arr.each(assets, function (a) {
          a.fold(function (id, blob, objurl, data) {
              Arr.each(editor.dom.select('img[src="' + objurl + '"]'), function (img) {
                editor.dom.setAttrib(img, 'src', data.result);
              });
          }, Fun.noop);
        });
      };

      var getLocalURL = function (id, blob, objurl, data) {
        return data.result;
      };

      return {
        uploadImages: uploadImages,
        prepareImages: prepareImages,
        getLocalURL: getLocalURL
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.tinymce.ErrorDialog',
  [

  ],
  function() {
    return {
      showDialog: function(editor, errorText){

        var close = function() {
          win.close();
        };

        var controls = [{
          text: 'Ok',
          onclick: close
        }];

        var winSettings = {
          title: "Error",
          spacing: 10,
          padding: 10,
          items: [{
            type: 'container',
            html: errorText
          }],
          buttons: controls
        };

        //We could have done something similar through the use of windowmanager.alert
        //But it appears that alert doesn't allow us to use html.
        //So we create a custom dialog, again, and use .open instead.
        win = editor.windowManager.open(winSettings);
    }
  };
});
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.imageupload.UploadError',

  [
    'ephox.powerpaste.alien.Once',
    'ephox.powerpaste.i18n.I18n',
    'ephox.powerpaste.tinymce.ErrorDialog'
  ],

  function (Once, I18n, ErrorDialog) {
    return function (editor, url) {
      var serviceNotFound = function () { return I18n.translate('error.code.images.not.found') +  url + I18n.translate('error.full.stop');};

      var genericError = function () { return I18n.translate('error.imageupload') +  url + I18n.translate('error.full.stop');};

      var showDialog = function (err) {
        var status = err.status();

        // TODO: status === 0 seems to consistently be a CORS failure. Might be nice to have a better message.
        var notFound = status === 0 || (status >= 400 || status < 500);

        // TODO: Services give us more details than this. The response should include details (TBIO-1256).
        // 500+ falls through to generic error for now.
        var error = notFound ? serviceNotFound : genericError;
        ErrorDialog.showDialog(editor, error());
      };

      var instance = function () {
        // this ensures we only show one banner per upload request, even on multiple failures
        return Once(showDialog);
      };

      return {
        instance: instance
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.flour.style.Resolver',

  [
    'ephox.compass.Arr'
  ],

  function (Arr) {
    var create = function (projectNamespace) {
      var namespace = cssNamespace(projectNamespace);

      var resolve = function (cssClasses) {
        var classes = cssClasses.split(' ');

        var resolved = Arr.map(classes, function (cls) {
          return cssClass(namespace, cls);
        });

        return resolved.join(' ');
      };

      return {
        resolve: resolve
      };
    };

    // JavaScript namespaces are of the form "ephox.project"
    // CSS namespaces are of the form "ephox-project"
    var cssNamespace = function (namespace) {
      return namespace.replace(/\./g, '-');
    };

    // CSS namespaced classes are of the form "css-namespace-class"
    var cssClass = function (namespace, cls) {
      return namespace + '-' + cls;
    };

    return {
      create: create,
      cssNamespace: cssNamespace,
      cssClass: cssClass
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.style.Styles',

  [
    'ephox.flour.style.Resolver'
  ],

  function (Resolver) {
    var styles = Resolver.create('ephox-salmon');

    return {
      resolve: styles.resolve
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.classify.Type',

  [
    'global!Array',
    'global!String'
  ],

  function (Array, String) {
    var typeOf = function(x) {
      if (x === null) return 'null';
      var t = typeof x;
      if (t === 'object' && Array.prototype.isPrototypeOf(x)) return 'array';
      if (t === 'object' && String.prototype.isPrototypeOf(x)) return 'string';
      return t;
    };

    var isType = function (type) {
      return function (value) {
        return typeOf(value) === type;
      };
    };

    return {
      isString: isType('string'),
      isObject: isType('object'),
      isArray: isType('array'),
      isNull: isType('null'),
      isBoolean: isType('boolean'),
      isUndefined: isType('undefined'),
      isFunction: isType('function'),
      isNumber: isType('number')
    };
  }
);


})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.compass.Obj',

  [
  ],

  function () {
    var each = function (obj, f) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          var x = obj[i];
          f(x, i, obj);
        }
      }
    };

    var objectMap = function (obj, f) {
      return tupleMap(obj, function (x, i, obj) {
        return {
          k: i,
          v: f(x, i, obj)
        };
      });
    };

    var tupleMap = function (obj, f) {
      var r = {};
      each(obj, function (x, i) {
        var tuple = f(x, i, obj);
        r[tuple.k] = tuple.v;
      });
      return r;
    };

    var bifilter = function (obj, pred) {
      var t = {};
      var f = {};
      each(obj, function(x, i) {
        var branch = pred(x, i) ? t : f;
        branch[i] = x;
      });
      return {
        t: t,
        f: f
      };
    };

    var mapToArray = function (obj, f) {
      var r = [];
      each(obj, function(value, name) {
        r.push(f(value, name));
      });
      return r;
    };

    var find = function (obj, pred) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          var x = obj[i];
          if (pred(x, i, obj))
            return x;
        }
      }
      return undefined;
    };

    var keys = function (obj) {
      return mapToArray(obj, function (v, k) {
        return k;
      });
    };

    var values = function (obj) {
      return mapToArray(obj, function (v, k) {
        return v;
      });
    };

    var size = function (obj) {
      return values(obj).length;
    };

    return {
      bifilter: bifilter,
      each: each,
      map: objectMap,
      mapToArray: mapToArray,
      tupleMap: tupleMap,
      find: find,
      keys: keys,
      values: values,
      size: size
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!Error", [], function () { return Error; });
ephox.bolt.module.api.define("global!console", [], function () { if (typeof console === "undefined") console = { log: function () {} }; return console; });
(function (define, require, demand) {
define(
  'ephox.sugar.api.Attr',

  [
    'ephox.classify.Type',
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'global!Error',
    'global!console'
  ],

  /*
   * Direct attribute manipulation has been around since IE8, but
   * was apparently unstable until IE10.
   */
  function (Type, Arr, Obj, Error, console) {
    var rawSet = function (dom, key, value) {
      /*
       * JQuery coerced everything to a string, and silently did nothing on text node/null/undefined.
       *
       * We fail on those invalid cases, only allowing numbers and booleans.
       */
      if (Type.isString(value) || Type.isBoolean(value) || Type.isNumber(value)) {
        dom.setAttribute(key, value + '');
      } else {
        console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
        throw new Error('Attribute value was not simple');
      }
    };

    var set = function (element, key, value) {
      rawSet(element.dom(), key, value);
    };

    var setAll = function (element, attrs) {
      var dom = element.dom();
      Obj.each(attrs, function (v, k) {
        rawSet(dom, k, v);
      });
    };

    var get = function (element, key) {
      var v = element.dom().getAttribute(key);

      // undefined is the more appropriate value for JS, and this matches JQuery
      return v === null ? undefined : v;
    };

    var has = function (element, key) {
      var dom = element.dom();

      // return false for non-element nodes, no point in throwing an error
      return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
    };

    var remove = function (element, key) {
      element.dom().removeAttribute(key);
    };

    var hasNone = function (element) {
      var attrs = element.dom().attributes;
      return attrs === undefined || attrs === null || attrs.length === 0;
    };

    var clone = function (element) {
      return Arr.foldl(element.dom().attributes, function (acc, attr) {
        acc[attr.name] = attr.value;
        return acc;
      }, {});
    };

    return {
      clone: clone,
      set: set,
      setAll: setAll,
      get: get,
      has: has,
      remove: remove,
      hasNone: hasNone
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.scullion.Immutable2',

  [
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.peanut.Fun'
  ],

  function (Arr, Obj, Fun) {

    var $a = function(args) {
      return Array.prototype.slice.call(args);
    };

    var product = function(fields, eqs) {

      var nu = function(/* values */) {
        var values = $a(arguments);
        if (fields.length !== values.length)
          throw 'Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments';

        var struct = {};
        Arr.each(fields, function (name, i) {
          struct[name] = Fun.constant(values[i]);
        });
        return struct;
      };

      var eq = function(a, b) {
        for (var i = 0; i < fields.length; i++) {
          var qqq = (eqs && eqs[i]) || Fun.tripleEquals;
          var x = fields[i];
          if (!qqq(a[x](), b[x]())) {
            return false;
          }
        }
        return true;
      };

      var evaluate = function(o) {
        return Obj.map(o, function(f) {
          return f();
        });
      };

      return {
        nu: nu,
        eq: eq,
        evaluate: evaluate
      };
    };

    return {
      product: product
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.scullion.Immutable',

  [
    'ephox.scullion.Immutable2'
  ],

  function (Immutable2) {
    return function (/* fields */) {
      return Immutable2.product(arguments).nu;
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.scullion.BagUtils',

  [
    'ephox.classify.Type',
    'ephox.compass.Arr'
  ],

  function (Type, Arr) {
    var sort = function (arr) {
      return arr.slice(0).sort();
    };

    var reqMessage = function (required, keys) {
      throw 'All required keys (' + sort(required).join(', ') + ') were not specified. Specified keys were: ' + sort(keys).join(', ') + '.';
    };

    var unsuppMessage = function (unsupported) {
      throw 'Unsupported keys for object: ' + sort(unsupported).join(', ');
    };

    var validateStrArr = function (label, array) {
      if (!Type.isArray(array)) throw 'The ' + label + ' fields must be an array. Was: ' + array + '.';
      Arr.each(array, function (a) {
        if (!Type.isString(a)) throw 'The value ' + a + ' in the ' + label + ' fields was not a string.';
      });
    };

    var invalidTypeMessage = function (incorrect, type) {
      throw 'All values need to be of type: ' + type + '. Keys (' + sort(incorrect).join(', ') + ') were not.';
    };

    var checkDupes = function (everything) {
      var sorted = sort(everything);
      var dupe = Arr.find(sorted, function (s, i) {
        return i < sorted.length -1 && s === sorted[i + 1];
      });

      if (dupe !== undefined && dupe !== null) throw 'The field: ' + dupe + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].';
    };

    return {
      sort: sort,
      reqMessage: reqMessage,
      unsuppMessage: unsuppMessage,
      validateStrArr: validateStrArr,
      invalidTypeMessage: invalidTypeMessage,
      checkDupes: checkDupes
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!Object", [], function () { return Object; });
(function (define, require, demand) {
define(
  'ephox.scullion.MixedBag',

  [
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.scullion.BagUtils',
    'global!Object'
  ],

  function (Arr, Obj, Fun, Option, BagUtils, Object) {

    return function (required, optional) {
      var everything = required.concat(optional);
      if (everything.length === 0) throw 'You must specify at least one required or optional field.';

      BagUtils.validateStrArr('required', required);
      BagUtils.validateStrArr('optional', optional);

      BagUtils.checkDupes(everything);

      return function (obj) {
        var keys = Obj.keys(obj);

        // Ensure all required keys are present.
        var allReqd = Arr.forall(required, function (req) {
          return Arr.contains(keys, req);
        });

        if (! allReqd) BagUtils.reqMessage(required, keys);

        var unsupported = Arr.filter(keys, function (key) {
          return !Arr.contains(everything, key);
        });

        if (unsupported.length > 0) BagUtils.unsuppMessage(unsupported);

        var r = {};
        Arr.each(required, function (req) {
          r[req] = Fun.constant(obj[req]);
        });

        Arr.each(optional, function (opt) {
          r[opt] = Fun.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? Option.some(obj[opt]): Option.none());
        });

        return r;
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.scullion.Struct',

  [
    'ephox.scullion.Immutable',
    'ephox.scullion.Immutable2',
    'ephox.scullion.MixedBag'
  ],

  function (Immutable, Immutable2, MixedBag) {
    return {
      immutable: Immutable,
      immutable2: Immutable2,
      immutableBag: MixedBag
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.alien.Recurse',

  [

  ],

  function () {
    /**
     * Applies f repeatedly until it completes (by returning Option.none()).
     *
     * Normally would just use recursion, but JavaScript lacks tail call optimisation.
     *
     * This is what recursion looks like when manually unravelled :)
     */
    var toArray = function (target, f) {
      var r = [];

      var recurse = function (e) {
        r.push(e);
        return f(e);
      };

      var cur = f(target);
      do {
        cur = cur.bind(recurse);
      } while (cur.isSome());

      return r;
    };

    return {
      toArray: toArray
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.bud.NodeTypes',

  [

  ],

  function () {
    return {
      ATTRIBUTE:              2,
      CDATA_SECTION:          4,
      COMMENT:                8,
      DOCUMENT:               9,
      DOCUMENT_TYPE:          10,
      DOCUMENT_FRAGMENT:      11,
      ELEMENT:                1,
      TEXT:                   3,
      PROCESSING_INSTRUCTION: 7,
      ENTITY_REFERENCE:       5,
      ENTITY:                 6,
      NOTATION:               12
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Element',

  [
    'ephox.peanut.Fun',
    'global!Error',
    'global!console',
    'global!document'
  ],

  function (Fun, Error, console, document) {
    var fromHtml = function (html, scope) {
      var doc = scope || document;
      var div = doc.createElement('div');
      div.innerHTML = html;
      if (!div.hasChildNodes() || div.childNodes.length > 1) {
        console.error('HTML does not have a single root node', html);
        throw 'HTML must have a single root node';
      }
      return fromDom(div.childNodes[0]);
    };

    var fromTag = function (tag, scope) {
      var doc = scope || document;
      var node = doc.createElement(tag);
      return fromDom(node);
    };

    var fromText = function (text, scope) {
      var doc = scope || document;
      var node = doc.createTextNode(text);
      return fromDom(node);
    };

    var fromDom = function (node) {
      if (node === null || node === undefined) throw new Error('Node cannot be not null or undefined');
      return {
        dom: Fun.constant(node)
      };
    };

    return {
      fromHtml: fromHtml,
      fromTag: fromTag,
      fromText: fromText,
      fromDom: fromDom
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Selectors',

  [
    'ephox.bud.NodeTypes',
    'ephox.compass.Arr',
    'ephox.perhaps.Option',
    'ephox.sugar.api.Element',
    'global!Error',
    'global!document'
  ],

  function (NodeTypes, Arr, Option, Element, Error, document) {
    /*
     * There's a lot of code here; the aim is to allow the browser to optimise constant comparisons,
     * instead of doing object lookup feature detection on every call
     */
    var STANDARD = 0;
    var MSSTANDARD = 1;
    var WEBKITSTANDARD = 2;
    var FIREFOXSTANDARD = 3;

    var selectorType = (function () {
      var test = document.createElement('span');
      // As of Chrome 34 / Safari 7.1 / FireFox 34, everyone except IE has the unprefixed function.
      // Still check for the others, but do it last.
      return test.matches !== undefined ? STANDARD :
             test.msMatchesSelector !== undefined ? MSSTANDARD :
             test.webkitMatchesSelector !== undefined ? WEBKITSTANDARD :
             test.mozMatchesSelector !== undefined ? FIREFOXSTANDARD :
             -1;
    })();


    var ELEMENT = NodeTypes.ELEMENT;
    var DOCUMENT = NodeTypes.DOCUMENT;

    var is = function (element, selector) {
      var elem = element.dom();
      if (elem.nodeType !== ELEMENT) return false; // documents have querySelector but not matches

      // As of Chrome 34 / Safari 7.1 / FireFox 34, everyone except IE has the unprefixed function.
      // Still check for the others, but do it last.
      else if (selectorType === STANDARD) return elem.matches(selector);
      else if (selectorType === MSSTANDARD) return elem.msMatchesSelector(selector);
      else if (selectorType === WEBKITSTANDARD) return elem.webkitMatchesSelector(selector);
      else if (selectorType === FIREFOXSTANDARD) return elem.mozMatchesSelector(selector);
      else throw new Error('Browser lacks native selectors'); // unfortunately we can't throw this on startup :(
    };

    var bypassSelector = function (dom) {
      // Only elements and documents support querySelector
      return dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT ||
              // IE fix for complex queries on empty nodes: http://jsfiddle.net/spyder/fv9ptr5L/
              dom.childElementCount === 0;
    };

    var all = function (selector, scope) {
      var base = scope === undefined ? document : scope.dom();
      return bypassSelector(base) ? [] : Arr.map(base.querySelectorAll(selector), Element.fromDom);
    };

    var one = function (selector, scope) {
      var base = scope === undefined ? document : scope.dom();
      return bypassSelector(base) ? Option.none() : Option.from(base.querySelector(selector)).map(Element.fromDom);
    };

    return {
      all: all,
      is: is,
      one: one
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Compare',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Selectors'
  ],

  function (Arr, Fun, Selectors) {
    var eq = function (e1, e2) {
      return e1.dom() === e2.dom();
    };

    var member = function (element, elements) {
      return Arr.exists(elements, Fun.curry(eq, element));
    };

    return {
      eq: eq,
      member: member,

      // Only used by DomUniverse. Remove (or should Selectors.is move here?)
      is: Selectors.is
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Traverse',

  [
    'ephox.classify.Type',
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.scullion.Struct',
    'ephox.sugar.alien.Recurse',
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Element'
  ],

  function (Type, Arr, Fun, Option, Struct, Recurse, Compare, Element) {
    // The document associated with the current element
    var owner = function (element) {
      return Element.fromDom(element.dom().ownerDocument);
    };

    var documentElement = function (element) {
      // TODO: Avoid unnecessary wrap/unwrap here
      var doc = owner(element);
      return Element.fromDom(doc.dom().documentElement);
    };

    // The window element associated with the element
    var defaultView = function (element) {
      var el = element.dom();
      var defaultView = el.ownerDocument.defaultView;
      return Element.fromDom(defaultView);
    };

    var parent = function (element) {
      var dom = element.dom();
      return Option.from(dom.parentNode).map(Element.fromDom);
    };

    var findIndex = function (element) {
      return parent(element).bind(function (p) {
        // TODO: Refactor out children so we can avoid the constant unwrapping
        var kin = children(p);
        var index = Arr.findIndex(kin, function (elem) {
          return Compare.eq(element, elem);
        });

        return index > -1 ? Option.some(index) : Option.none();
      });
    };

    var parents = function (element, isRoot) {
      var stop = Type.isFunction(isRoot) ? isRoot : Fun.constant(false);
      return internalParents(element, stop);
    };

    var internalParents = function (element, stop) {
      return parent(element).fold(function () {
        return [];
      }, function (v) {
        var ret = [ v ];
        return stop(v) ? ret : ret.concat(internalParents(v, stop));
      });
    };

    var siblings = function (element) {
      // TODO: Refactor out children so we can just not add self instead of filtering afterwards
      var filterSelf = function (elements) {
        return Arr.filter(elements, function (x) {
          return !Compare.eq(element, x);
        });
      };

      return parent(element).map(children).map(filterSelf).getOr([]);
    };

    var offsetParent = function (element) {
      var dom = element.dom();
      return Option.from(dom.offsetParent).map(Element.fromDom);
    };

    var prevSibling = function (element) {
      var dom = element.dom();
      return Option.from(dom.previousSibling).map(Element.fromDom);
    };

    var nextSibling = function (element) {
      var dom = element.dom();
      return Option.from(dom.nextSibling).map(Element.fromDom);
    };

    var prevSiblings = function (element) {
      // This one needs to be reversed, so they're still in DOM order
      return Arr.reverse(Recurse.toArray(element, prevSibling));
    };

    var nextSiblings = function (element) {
      return Recurse.toArray(element, nextSibling);
    };

    var children = function (element) {
      var dom = element.dom();
      return Arr.map(dom.childNodes, Element.fromDom);
    };

    var child = function (element, index) {
      var children = element.dom().childNodes;
      return Option.from(children[index]).map(Element.fromDom);
    };

    var firstChild = function (element) {
      return child(element, 0);
    };

    var lastChild = function (element) {
      return child(element, element.dom().childNodes.length - 1);
    };

    var spot = Struct.immutable('element', 'offset');
    var leaf = function (element, offset) {
      var cs = children(element);
      return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
    };

    return {
      owner: owner,
      defaultView: defaultView,
      documentElement: documentElement,
      parent: parent,
      findIndex: findIndex,
      parents: parents,
      siblings: siblings,
      prevSibling: prevSibling,
      offsetParent: offsetParent,
      prevSiblings: prevSiblings,
      nextSibling: nextSibling,
      nextSiblings: nextSiblings,
      children: children,
      child: child,
      firstChild: firstChild,
      lastChild: lastChild,
      leaf: leaf
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Insert',

  [
    'ephox.sugar.api.Traverse'
  ],

  function (Traverse) {
    var before = function (marker, element) {
      var parent = Traverse.parent(marker);
      parent.each(function (v) {
        v.dom().insertBefore(element.dom(), marker.dom());
      });
    };

    var after = function (marker, element) {
      var sibling = Traverse.nextSibling(marker);
      sibling.fold(function () {
        var parent = Traverse.parent(marker);
        parent.each(function (v) {
          append(v, element);
        });
      }, function (v) {
        before(v, element);
      });
    };

    var prepend = function (parent, element) {
      var firstChild = Traverse.firstChild(parent);
      firstChild.fold(function () {
        append(parent, element);
      }, function (v) {
        parent.dom().insertBefore(element.dom(), v.dom());
      });
    };

    var append = function (parent, element) {
      parent.dom().appendChild(element.dom());
    };

    var appendAt = function (parent, element, index) {
      Traverse.child(parent, index).fold(function () {
        append(parent, element);
      }, function (v) {
        before(v, element);
      });
    };

    var wrap = function (element, wrapper) {
      before(element, wrapper);
      append(wrapper, element);
    };

    return {
      before: before,
      after: after,
      prepend: prepend,
      append: append,
      appendAt: appendAt,
      wrap: wrap
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.InsertAll',

  [
    'ephox.compass.Arr',
    'ephox.sugar.api.Insert'
  ],

  function (Arr, Insert) {
    var before = function (marker, elements) {
      Arr.each(elements, function (x) {
        Insert.before(marker, x);
      });
    };

    var after = function (marker, elements) {
      Arr.each(elements, function (x, i) {
        var e = i === 0 ? marker : elements[i - 1];
        Insert.after(e, x);
      });
    };

    var prepend = function (parent, elements) {
      Arr.each(elements.slice().reverse(), function (x) {
        Insert.prepend(parent, x);
      });
    };

    var append = function (parent, elements) {
      Arr.each(elements, function (x) {
        Insert.append(parent, x);
      });
    };

    return {
      before: before,
      after: after,
      prepend: prepend,
      append: append
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Remove',

  [
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Traverse'
  ],

  function (InsertAll, Traverse) {
    var empty = function (element) {
      // requires IE 9
      element.dom().textContent = '';
    };

    var remove = function (element) {
      var dom = element.dom();
      if (dom.parentNode !== null)
        dom.parentNode.removeChild(dom);
    };

    var unwrap = function (wrapper) {
      var children = Traverse.children(wrapper);
      if (children.length > 0)
        InsertAll.before(wrapper, children);
      remove(wrapper);
    };

    return {
      empty: empty,
      remove: remove,
      unwrap: unwrap
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.peanut.Thunk',

  [
  ],

  function () {

    var cached = function (f) {
      var called = false;
      var r;
      return function() {
        if (!called) {
          called = true;
          r = f.apply(null, arguments);
        }
        return r;
      };
    };

    return {
      cached: cached
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Node',

  [
    'ephox.bud.NodeTypes'
  ],

  function (NodeTypes) {
    var name = function (element) {
      var r = element.dom().nodeName;
      return r.toLowerCase();
    };

    var type = function (element) {
      return element.dom().nodeType;
    };

    var value = function (element) {
      return element.dom().nodeValue;
    };

    var isType = function (t) {
      return function (element) {
        return type(element) === t;
      };
    };

    var isComment = function (element) {
      return type(element) === NodeTypes.COMMENT || name(element) === '#comment';
    };

    var isElement = isType(NodeTypes.ELEMENT);
    var isText = isType(NodeTypes.TEXT);
    var isDocument = isType(NodeTypes.DOCUMENT);

    return {
      name: name,
      type: type,
      value: value,
      isElement: isElement,
      isText: isText,
      isDocument: isDocument,
      isComment: isComment
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Body',

  [
    'ephox.peanut.Thunk',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Node',
    'global!document'
  ],

  function (Thunk, Element, Node, document) {

    // Node.contains() is very, very, very good performance
    // http://jsperf.com/closest-vs-contains/5
    var inBody = function (element) {
      // Technically this is only required on IE, where contains() returns false for text nodes.
      // But it's cheap enough to run everywhere and Sugar doesn't have platform detection (yet).
      var dom = Node.isText(element) ? element.dom().parentNode : element.dom();

      // use ownerDocument.body to ensure this works inside iframes.
      // Normally contains is bad because an element "contains" itself, but here we want that.
      return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
    };

    var body = Thunk.cached(function () {
      var body = document.body;
      if (body === null || body === undefined) throw 'Body is not available yet';
      return Element.fromDom(body);
    });

    return {
      body: body,
      inBody: inBody
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.PredicateFilter',

  [
    'ephox.compass.Arr',
    'ephox.sugar.api.Body',
    'ephox.sugar.api.Traverse'
  ],

  function (Arr, Body, Traverse) {
    // maybe TraverseWith, similar to traverse but with a predicate?

    var all = function (predicate) {
      return descendants(Body.body(), predicate);
    };

    var ancestors = function (scope, predicate, isRoot) {
      return Arr.filter(Traverse.parents(scope, isRoot), predicate);
    };

    var siblings = function (scope, predicate) {
      return Arr.filter(Traverse.siblings(scope), predicate);
    };

    var children = function (scope, predicate) {
      return Arr.filter(Traverse.children(scope), predicate);
    };

    var descendants = function (scope, predicate) {
      var result = [];

      // Recurse.toArray() might help here
      Arr.each(Traverse.children(scope), function (x) {
        if (predicate(x)) {
          result = result.concat([ x ]);
        }
        result = result.concat(descendants(x, predicate));
      });
      return result;
    };

    return {
      all: all,
      ancestors: ancestors,
      siblings: siblings,
      children: children,
      descendants: descendants
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.SelectorFilter',

  [
    'ephox.sugar.api.PredicateFilter',
    'ephox.sugar.api.Selectors'
  ],

  function (PredicateFilter, Selectors) {
    var all = function (selector) {
      return Selectors.all(selector);
    };

    // For all of the following:
    //
    // jQuery does siblings of firstChild. IE9+ supports scope.dom().children (similar to Traverse.children but elements only).
    // Traverse should also do this (but probably not by default).
    //

    var ancestors = function (scope, selector, isRoot) {
      // It may surprise you to learn this is exactly what JQuery does
      // TODO: Avoid all this wrapping and unwrapping
      return PredicateFilter.ancestors(scope, function (e) {
        return Selectors.is(e, selector);
      }, isRoot);
    };

    var siblings = function (scope, selector) {
      // It may surprise you to learn this is exactly what JQuery does
      // TODO: Avoid all the wrapping and unwrapping
      return PredicateFilter.siblings(scope, function (e) {
        return Selectors.is(e, selector);
      });
    };

    var children = function (scope, selector) {
      // It may surprise you to learn this is exactly what JQuery does
      // TODO: Avoid all the wrapping and unwrapping
      return PredicateFilter.children(scope, function (e) {
        return Selectors.is(e, selector);
      });
    };

    var descendants = function (scope, selector) {
      return Selectors.all(selector, scope);
    };

    return {
      all: all,
      ancestors: ancestors,
      siblings: siblings,
      children: children,
      descendants: descendants
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.impl.ClosestOrAncestor',

  [
    'ephox.classify.Type',
    'ephox.perhaps.Option'
  ],

  function (Type, Option) {
    return function (is, ancestor, scope, a, isRoot) {
      return is(scope, a) ?
              Option.some(scope) :
              Type.isFunction(isRoot) && isRoot(scope) ?
                  Option.none() :
                  ancestor(scope, a, isRoot);
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.SelectorFind',

  [
    'ephox.perhaps.Option',
    'ephox.sugar.api.SelectorFilter',
    'ephox.sugar.api.Selectors',
    'ephox.sugar.impl.ClosestOrAncestor'
  ],

  function (Option, SelectorFilter, Selectors, ClosestOrAncestor) {
    // It's ridiculous to spend all that time finding everything and then just get the first.
    // Two suggestions:
    // * An internal SelectorFilter module that doesn't Element.fromDom() everything
    // * Re-implement using Selectors.one() instead of Selectors.all()

    var first = function (selector) {
      return Option.from(SelectorFilter.all(selector)[0]);
    };

    var ancestor = function (scope, selector, isRoot) {
      return Option.from(SelectorFilter.ancestors(scope, selector, isRoot)[0]);
    };

    var sibling = function (scope, selector) {
      return Option.from(SelectorFilter.siblings(scope, selector)[0]);
    };

    var child = function (scope, selector) {
      return Option.from(SelectorFilter.children(scope, selector)[0]);
    };

    var descendant = function (scope, selector) {
      return Option.from(SelectorFilter.descendants(scope, selector)[0]);
    };

    var closest = function (scope, selector, isRoot) {
      return ClosestOrAncestor(Selectors.is, ancestor, scope, selector, isRoot);
    };

    return {
      first: first,
      ancestor: ancestor,
      sibling: sibling,
      child: child,
      descendant: descendant,
      closest: closest
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.api.Ephemera',

  [
    'ephox.peanut.Fun',
    'ephox.salmon.style.Styles',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorFind'
  ],

  function (Fun, Styles, Attr, Remove, SelectorFind) {
    var uploadContainer = Styles.resolve('upload-image-container');
    var blobId = 'data-' + Styles.resolve('image-blob');

    var cleanup = function (element) {
      SelectorFind.child(element, 'img').each(cleanImg);
      Remove.unwrap(element);
    };

    var cleanImg = function (element) {
      Attr.remove(element, 'class');
    };

    return {
      uploadContainer: Fun.constant(uploadContainer),
      blobId: Fun.constant(blobId),
      cleanup: cleanup
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Elements',

  [
    'ephox.compass.Arr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Traverse',
    'global!document'
  ],

  function (Arr, Element, Traverse, document) {
    var fromHtml = function (html, scope) {
      var doc = scope || document;
      var div = doc.createElement('div');
      div.innerHTML = html;
      return Traverse.children(Element.fromDom(div));
    };

    var fromTags = function (tags, scope) {
      return Arr.map(tags, function (x) {
        return Element.fromTag(x, scope);
      });
    };

    var fromText = function (texts, scope) {
      return Arr.map(texts, function (x) {
        return Element.fromText(x, scope);
      });
    };

    var fromDom = function (nodes) {
      return Arr.map(nodes, Element.fromDom);
    };

    return {
      fromHtml: fromHtml,
      fromTags: fromTags,
      fromText: fromText,
      fromDom: fromDom
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define('ephox.powerpaste.tinymce.UndoRewriter',
  [
    'ephox.compass.Arr',
    'ephox.salmon.api.Ephemera',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Elements',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.SelectorFilter'
  ],
  function(Arr, UiEphemera, Element, Elements, InsertAll, SelectorFilter) {
    var unwrapHistory = function(editor) {
      //Start undomanager hack
      for (var i = 0; i < editor.undoManager.data.length; i ++) {
        //get the content of every undomanager back stack level
        var content = editor.undoManager.data[i].content;
        var temp = Element.fromTag('div');
        InsertAll.append(temp, Elements.fromHtml(content));
        //Find uploaded image containers
        var uploadContainers = SelectorFilter.descendants(temp, '.' + UiEphemera.uploadContainer());
        //Strip the containers
        Arr.each(uploadContainers, UiEphemera.cleanup);
        editor.undoManager.data[i].content = temp.dom().innerHTML;
      }
    };

    var resrcHistory = function(editor, b, result) {
      for (var i = 0; i < editor.undoManager.data.length; i ++) {
        editor.undoManager.data[i].content = editor.undoManager.data[i].content.split(b.objurl()).join(result.location);
      }
    };

    return {
      unwrapHistory: unwrapHistory,
      resrcHistory: resrcHistory
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.epithet.Global',

  [
  ],

  function () {
    return Function('return this;')();
  }
);


})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.epithet.Resolve',

  [
    'ephox.epithet.Global'
  ],

  function (Global) {
    var path = function (parts, scope) {
      var o = scope || Global;
      for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i)
        o = o[parts[i]];
      return o;
    };

    var resolve = function (p, scope) {
      var parts = p.split('.');
      return path(parts, scope);
    };

    return {
      path: path,
      resolve: resolve
    };
  }
);


})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.core.Global',

  [
    'ephox.epithet.Resolve'
  ],

  function (Resolve) {
    var unsafe = function (name, scope) {
      return Resolve.resolve(name, scope);
    };

    var getOrDie = function (name, scope) {
      var actual = unsafe(name, scope);

      // In theory, TBIO should refuse to load below IE10. But we'll enforce it here too.
      if (actual === undefined) throw name + ' not available on this browser';
      return actual;
    };

    return {
      getOrDie: getOrDie
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.api.URL',

  [
    'ephox.numerosity.core.Global'
  ],

  function (Global) {
    /*
     * IE10 and above per
     * https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL
     *
     * Also Safari 6.1+
     * Safari 6.0 has 'webkitURL' instead, but doesn't support flexbox so we
     * aren't supporting it anyway
     */
    var url = function () {
      return Global.getOrDie('URL');
    };

    var createObjectURL = function (blob) {
      return url().createObjectURL(blob);
    };

    var revokeObjectURL = function (u) {
      url().revokeObjectURL(u);
    };

    return {
      createObjectURL: createObjectURL,
      revokeObjectURL: revokeObjectURL
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.api.BlobCache',

  [
    'ephox.compass.Obj',
    'ephox.numerosity.api.URL',
    'ephox.perhaps.Option',
    'ephox.scullion.Struct'
  ],

  function (Obj, URL, Option, Struct) {
    var blobInfo = Struct.immutable('id', 'blob', 'objurl', 'data');

    return function () {
      var blobCache = {};

      var add = function (id, blob, objurl, data) {
        var info = blobInfo(id, blob, objurl, data);
        blobCache[id] = info;
        return info;
      };

      var get = function (id) {
        return Option.from(blobCache[id]);
      };

      var release = function (info) {
        URL.revokeObjectURL(info.objurl());
      };

      var lookupByData = function (data) {
        return Option.from(Obj.find(blobCache, function (c) {
          return c.data().result === data;
        }));
      };

      var remove = function (id) {
        var o = blobCache[id];
        delete blobCache[id];
        if (o !== undefined) release(o);
      };

      var destroy = function () {
        Obj.each(blobCache, release);
        blobCache = {};
      };

      return {
        add: add,
        get: get,
        remove: remove,
        lookupByData: lookupByData,
        destroy: destroy
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.porkbun.Event',

  [
    'ephox.compass.Arr',
    'ephox.scullion.Struct'
  ],
  function (Arr, Struct) {

    /** :: ([String]) -> Event */
    return function (fields) {
      var struct = Struct.immutable.apply(null, fields);

      var handlers = [];

      var bind = function (handler) {
        if (handler === undefined) {
          throw 'Event bind error: undefined handler';
        }
        handlers.push(handler);
      };

      var unbind = function(handler) {
        var index = Arr.indexOf(handlers, handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      };

      var trigger = function (/* values */) {
        // scullion does Array prototype slice, we don't need to as well
        var event = struct.apply(null, arguments);
        Arr.each(handlers, function (handler) {
          handler(event);
        });
      };

      return {
        bind: bind,
        unbind: unbind,
        trigger: trigger
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.porkbun.Events',

  [
    'ephox.compass.Obj'
  ],

  function (Obj) {

    /** :: {name : Event} -> Events */
    var create = function (typeDefs) {
      var registry = Obj.map(typeDefs, function (event) {
        return {
          bind: event.bind,
          unbind: event.unbind
        };
      });

      var trigger = Obj.map(typeDefs, function (event) {
        return event.trigger;
      });

      return {
        registry: registry,
        trigger: trigger
      };
    };
    return {
      create: create
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.api.ImageTracker',

  [
    'ephox.compass.Arr',
    'ephox.salmon.style.Styles',
    'ephox.salmon.api.Ephemera',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.SelectorFilter'
  ],

  function (Arr, Styles, Ephemera, Event, Events, Attr, SelectorFilter) {
    var uploadAttr = 'data-' + Styles.resolve('image-upload');

    var findById = function (body, id) {
      return SelectorFilter.descendants(body, 'img[' + uploadAttr + '="' + id + '"]');
    };

    var findAll = function (body) {
      // Find all images that are registered in the blob tracker, but aren't uploading
      return SelectorFilter.descendants(body, 'img:not([' + uploadAttr + '])[' + Ephemera.blobId() + ']');
    };

    return function () {
      var imgStack = [];
      var response = [];

      var events = Events.create({
        complete: Event(['response'])
      });

      var register = function (img, id) {
        Attr.set(img, uploadAttr, id);
        imgStack.push(id);
      };

      var deregister = function (id) {
        imgStack = Arr.filter(imgStack, function (val, index) {
          return val !== id;
        });
        if (inProgress() === false) finished();
      };

      var result = function (bool, element) {
        response.push({
          'success': bool,
          'element': element.dom()
        });
      };

      var report = function (id, images, success) {
        Arr.each(images, function (img) {
          Attr.remove(img, uploadAttr);
          result(success, img);
        });
        deregister(id);
      };

      var finished = function () {
        events.trigger.complete(response);
        response = [];
      };

      var inProgress = function () {
        return imgStack.length > 0;
      };

      var isActive = function (id) {
        return Arr.contains(imgStack, id);
      };

      return {
        findById: findById,
        findAll: findAll,
        register: register,
        report: report,
        inProgress: inProgress,
        isActive: isActive,
        events: events.registry
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.highway.Merger',

  [
    'ephox.classify.Type'
  ],

  function (Type) {

    var shallow = function (old, nu) {
      return nu;
    };

    var deep = function (old, nu) {
      var bothObjects = Type.isObject(old) && Type.isObject(nu);
      return bothObjects ? deepMerge(old, nu) : nu;
    };

    var baseMerge = function (merger) {
      return function() {
        var objects = Array.prototype.slice.call(arguments, 0);
        if (objects.length === 0) throw "Can't merge zero objects";

        var ret = {};
        for (var i = 0; i < objects.length; i++) {
          var curObject = objects[i];
          // FIX Merger 14/02/2012 Replace with the functional iterators / maps
          for (var key in curObject) if (Object.prototype.hasOwnProperty.call(curObject, key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
        }
        return ret;
      };
    };

    var deepMerge = baseMerge(deep);
    var merge = baseMerge(shallow);

    return {
      deepMerge: deepMerge,
      merge: merge
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.scullion.ADT',

  [
    'ephox.classify.Type',
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.peanut.Fun',
    'global!Array'
  ],

  function (Type, Arr, Obj, Fun, Array) {
    /*
     * Generates a church encoded ADT. No, I'm not going to explain what that is here.
     *
     * The aim of this file is to replace the extreme ADT syntax we have been using
     * (50 lines of code for a simple variant with 4 cases). Specifying the ADT
     * can now be done in one line per case, and proper validation is included.
     *
     * For syntax and use, look at the test code.
     */
    var generate = function (cases) {
      // validation
      if (!Type.isArray(cases)) {
        throw 'cases must be an array';
      }
      if (cases.length === 0) {
        throw 'there must be at least one case';
      }
      // adt is mutated to add the individual cases
      var adt = {};
      Arr.each(cases, function (acase, count) {
        var keys = Obj.keys(acase);

        // validation
        if (keys.length !== 1) {
          throw 'one and only one name per case';
        }

        var key = keys[0];
        var value = acase[key];

        // validation
        if (adt[key] !== undefined) {
          throw 'duplicate key detected:' + key;
        } else if (key === 'cata') {
          throw 'cannot have a case named cata (sorry)';
        } else if (!Type.isArray(value)) {
          // this implicitly checks if acase is an object
          throw 'case arguments must be an array';
        }
        //
        // constructor for key
        //
        adt[key] = function () {
          var args = Array.prototype.slice.call(arguments);
          // validation
          if (args.length !== value.length) {
            throw 'Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + args.length;
          }


          //
          // the fold function for key
          //
          return {
            fold: function (/* arguments */) {
              // runtime validation
              if (arguments.length !== cases.length) {
                throw 'Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length;
              }
              var target = arguments[count];
              return target.apply(null, args);
            }
          };
        };
      });

      return adt;
    };
    return {
      generate: generate
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.hermes.api.ImageAsset',

  [
    'ephox.highway.Merger',
    'ephox.scullion.ADT'
  ],

  function (Merger, ADT) {
    /*
     * An arbitrary common data structure for handling both local image files
     * and images from web urls.
     */
    var adt = ADT.generate([
      { 'blob': // Local image. W3C blob object (or File).
        [       // NOTE File is just a subclass of Blob
          'id',             // unique ID
          'blob',           // the entire blob object
          'objurl',         // an object URL - THIS MUST BE RELEASED WHEN DONE
          'data'            // FileReader instance - already complete - loaded using readAsDataURL().
                            //   we're storing this rather than result in the hope it will
                            //   keep the string native rather than convert to JS
        ]
      },
      { 'url':  ['id', 'url', 'raw'] } // Remote image. JS image object/element loaded via url

    ]);

    var cata = function (subject, onFile, onImage) {
      return subject.fold(onFile, onImage);
    };

    return Merger.merge(adt, {
      cata: cata
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.perhaps.Result',

  [
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  function (Fun, Option) {
    var value = function (r) {
      return result(function (e, v) {
        return v(r);
      });
    };

    var error = function (message) {
      return result(function (e, v) {
        return e(message);
      });
    };

    var result = function (fold) {

      var is = function (v) {
        return fold(Fun.constant(false), function (o) {
          return o === v;
        });
      };

      var isValue = function () {
        return fold(Fun.constant(false), Fun.constant(true));
      };

      var isError = Fun.not(isValue);

      var getOr = function (a) {
        return fold(Fun.constant(a), Fun.identity);
      };

      var getOrThunk = function (f) {
        return fold(f, Fun.identity);
      };

      var getOrDie = function () {
        return fold(function (m) {
          Fun.die(m)();
        }, Fun.identity);
      };

      var or = function (opt) {
        return fold(Fun.constant(opt), value);
      };

      var orThunk = function (f) {
        return fold(f, value);
      };

      var map = function (f) {
        return bind(function (a) {
          return value(f(a));
        });
      };

      var each = map;

      var bind = function (f) {
        return fold(error, f);
      };

      var exists = function (f) {
        return fold(Fun.constant(false), f);
      };

      var forall = function (f) {
        return fold(Fun.constant(true), f);
      };

      var toOption = function () {
        return fold(Option.none, Option.some);
      };

      return {
        is: is,
        isValue: isValue,
        isError: isError,
        getOr: getOr,
        getOrThunk: getOrThunk,
        getOrDie: getOrDie,
        or: or,
        orThunk: orThunk,
        fold: fold,
        map: map,
        each: each,
        bind: bind,
        exists: exists,
        forall: forall,
        toOption: toOption
      };
    };

    return {
      value: value,
      error: error
    };


  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.alien.Toggler',

  [
  ],

  function () {
    return function (turnOff, turnOn, initial) {
      var active = initial || false;

      var on = function () {
        turnOn();
        active = true;
      };

      var off = function () {
        turnOff();
        active = false;
      };

      var toggle = function () {
        var f = active ? off : on;
        f();
      };

      var isOn = function () {
        return active;
      };

      return {
        on: on,
        off: off,
        toggle: toggle,
        isOn: isOn
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Class',

  [
    'ephox.sugar.alien.Toggler',
    'ephox.sugar.api.Attr'
  ],

  function (Toggler, Attr) {
    /*
     * ClassList is IE10 minimum:
     * https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
     *
     * Note that IE doesn't support the second argument to toggle (at all).
     * If it did, the toggler could be better.
     */

    var add = function (element, clazz) {
      element.dom().classList.add(clazz);
    };

    var remove = function (element, clazz) {
      var classList = element.dom().classList;
      classList.remove(clazz);

      // classList is a "live list", so this is up to date already
      if (classList.length === 0) {
        // No more classes left, remove the class attribute as well
        Attr.remove(element, 'class');
      }
    };

    var toggle = function (element, clazz) {
      return element.dom().classList.toggle(clazz);
    };

    var toggler = function (element, clazz) {
      var classList = element.dom().classList;
      var off = function () {
        classList.remove(clazz);
      };
      var on = function () {
        classList.add(clazz);
      };
      return Toggler(off, on, has(element, clazz));
    };

    var has = function (element, clazz) {
      var classList = element.dom().classList;
      // Cereal has a nasty habit of calling this with a text node >.<
      return classList !== undefined && classList.contains(clazz);
    };

    // set deleted, risks bad performance. Be deterministic.

    return {
      add: add,
      remove: remove,
      toggle: toggle,
      toggler: toggler,
      has: has
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.ui.UploadUi',

  [
    'ephox.salmon.api.Ephemera',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorFind',
    'ephox.sugar.api.Traverse'
  ],

  function (Ephemera, Class, Element, Insert, InsertAll, Remove, SelectorFind, Traverse) {
    var removeUi = function (image) {
      SelectorFind.ancestor(image, '.' + Ephemera.uploadContainer()).each(function (wrapper) {
        var children = Traverse.children(wrapper);
        InsertAll.before(wrapper, children);
        Remove.remove(wrapper);
      });
    };

    var addUi = function (image) {
      var block = Element.fromTag('div');
      Class.add(block, Ephemera.uploadContainer());
      Insert.before(image, block);
      Insert.append(block, image);
    };

    return {
      removeUi: removeUi,
      addUi: addUi
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.api.UploadUtils',

  [
    'ephox.compass.Arr',
    'ephox.hermes.api.ImageAsset',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.perhaps.Result',
    'ephox.salmon.api.Ephemera',
    'ephox.salmon.ui.UploadUi',
    'ephox.scullion.ADT',
    'ephox.scullion.Struct',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.SelectorFind',
    'global!console'
  ],

  function (Arr, ImageAsset, Fun, Option, Result, UiEphemera, UploadUi, Adt, Struct, Attr, SelectorFind, console) {
    var imageBlob = Struct.immutable('image', 'blobInfo');

    var uploadResult = Adt.generate([
      { 'failure':     [ 'error' ] },
      { 'success':     [ 'result', 'images', 'blob' ] }
    ]);

    /* Register any not already active id in the image tracker and return Some if it isn't already active */
    var prepareForUpload = function (imageTracker, id, image) {
      // If this ID is already active, don't actually trigger the upload a second time
      var alreadyActive = imageTracker.isActive(id);

      // Register the id so ImageTracker can find it
      imageTracker.register(image, id);

      // Add the spinner wrapper.
      UploadUi.addUi(image);

      // separate the actual upload call so we don't have the img element in closure
      return !alreadyActive ? Option.some(id) : Option.none();
    };

    /* With each uploaded image, remove the uploading UI, update its src, and remove from the blob cache.
     * Return the blob info identified by the id
     */
    var updateImages = function (blobCache, images, id, result) {
      Arr.each(images, function (img) {
        Attr.set(img, 'src', result.location);
        Attr.remove(img, UiEphemera.blobId());
      });

      return removeFromCache(blobCache, id, images);
    };

    /* Upload a particular image, finding it afterwards and updating its source */
    var handleUpload = function (uploadManager, imageTracker, blobCache, container, id, blob, callback) {
      var internalError = function () {
        console.error('Internal error with blob cache', id);
        // anything over 500 is a generic error
        callback(uploadResult.failure({status: Fun.constant(666)}));
      };

      uploadManager.upload(blob, id, function (response) {
        var freshImgs = imageTracker.findById(container, id);

        // remove the image UI no matter what happened
        Arr.each(freshImgs, UploadUi.removeUi);

        response.fold(function (err) {
          callback(uploadResult.failure(err));
        }, function (result) {
          updateImages(blobCache, freshImgs, id, result).fold(internalError, function (blobInfo) {
            callback(uploadResult.success(result, freshImgs, blobInfo));
          });
        });

        imageTracker.report(id, freshImgs, response.isValue());
      });
    };

    var addToCache = function (blobCache, id, blob, objurl, data, image) {
      var blobInfo = blobCache.lookupByData(data.result).getOrThunk(function () { return blobCache.add(id, blob, objurl, data); });
      Attr.set(image, UiEphemera.blobId(), blobInfo.id());
      return Result.value(imageBlob(image, blobInfo));
    };


    var findInCache = function (blobCache, image) {
      var id = Attr.get(image, UiEphemera.blobId());
      return blobCache.get(id).fold(function () {
        return Result.error(id);
      }, function (blobInfo) {
        return Result.value(imageBlob(image, blobInfo));
      });
    };

    var removeFromCache = function (blobCache, id, images) {
      return blobCache.get(id).fold(function () {
        return Result.error('Internal error with blob cache');
      }, function (blobInfo) {
        blobCache.remove(id);
        return Result.value(blobInfo);
      });
    };

    /* Find all of the assets in the container, and return the (blobInfo, img) pairs */
    var registerAssets = function (blobCache, container, assets) {
      return Arr.bind(assets, function (asset) {
        return ImageAsset.cata(asset, function (id, blob, objurl, data) {
          var freshImg = SelectorFind.descendant(container, 'img[src="' + objurl + '"]');
          return freshImg.fold(function () {
            return [ Result.error('Image that was just inserted could not be found: ' + objurl) ];
          }, function (img) {
            return [ addToCache(blobCache, id, blob, objurl, data, img) ];
          });
        }, Fun.constant([]));
      });
    };

    var findBlobs = function(imageTracker, blobCache, container) {
      var images = imageTracker.findAll(container);
      if (imageTracker.inProgress()) return [];
      return Arr.map(images, function (image) {
        return findInCache(blobCache, image);
      });
    };

    return {
      prepareForUpload: prepareForUpload,
      handleUpload: handleUpload,
      registerAssets: registerAssets,
      findBlobs: findBlobs
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.api.FormData',

  [
    'ephox.numerosity.core.Global'
  ],

  function (Global) {
    /*
     * IE10 and above per
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData
     */
    return function () {
      var f = Global.getOrDie('FormData');
      return new f();
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!Math", [], function () { return Math; });
ephox.bolt.module.api.define("global!isFinite", [], function () { return isFinite; });
ephox.bolt.module.api.define("global!isNaN", [], function () { return isNaN; });
ephox.bolt.module.api.define("global!parseFloat", [], function () { return parseFloat; });
(function (define, require, demand) {
define(
  'ephox.violin.util.Validate',

  [
    'global!Math',
    'global!isFinite',
    'global!isNaN',
    'global!parseFloat'
  ],

  function(Math, isFinite, isNaN, parseFloat) {
    var vType = function(expectedType) {
      return function(name, value) {
        var t = typeof value;
        if (t !== expectedType) throw name + ' was not a ' + expectedType + '. Was: ' + value + ' (' + t + ')';
      };
    };

    var vString = vType('string');

    var vChar = function(name, value) {
      vString(name, value);
      var length = value.length;
      if (length !== 1) throw name + ' was not a single char. Was: ' + value;
    };

    var vNumber = vType('number');

    var vInt = function(name, value) {
      vNumber(name, value);
      if (value !== Math.abs(value)) throw name + ' was not an integer. Was: ' + value;
    };

    var pNum = function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    };

    var vNat = function(name, value) {
      vInt(name, value);
      if (value < 0) throw name + ' was not a natural number. Was: ' + value;
    };

    return {
      vString: vString,
      vChar: vChar,
      vInt: vInt,
      vNat: vNat,
      pNum: pNum
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
/**
 *  "violin" - stringed instrument, or rather, an instrument for dealing with strings.
 */
define(
  "ephox.violin.Strings",

  [
    'ephox.violin.util.Validate'
  ],

  function (Validate) {
    //common method
    var checkRange = function(str, substr, start) {
      if (substr === "") return true;
      if (str.length < substr.length) return false;
      var x = str.substr(start, start + substr.length);
      return x === substr;
    };

    /** Given a string and object, perform template-replacements on the string, as specified by the object.
     * Any template fields of the form ${name} are replaced by the string or number specified as obj["name"]
     * Based on Douglas Crockford's 'supplant' method for template-replace of strings. Uses different template format.
     */
    var supplant = function(str, obj) {
      var isStringOrNumber = function(a) {
        var t = typeof a;
        return t === "string" || t === "number";
      };

      return str.replace(/\${([^{}]*)}/g,
        function (a, b) {
          var value = obj[b];
          return isStringOrNumber(value) ? value : a;
        }
      );
    };

    var ignoringCase = function(fn) {
      var map = function(a, fn) {
        var r = [];
        for (var i = 0; i < a.length; i++) r.push(fn(a[i]));
        return r;
      };

      return function() {
        var args = map(arguments, function(x) {
          return typeof x === "string" ? x.toLowerCase() : x;
        });
        return fn.apply(this, args);
      };
    };

    /** Does 'str' start with 'prefix'?
     *  Note: all strings start with the empty string.
     *        More formally, for all strings x, startsWith(x, "").
     *        This is so that for all strings x and y, startsWith(y + x, y)
     */
    var startsWith = function(str, prefix) {
      return checkRange(str, prefix, 0);
    };

    var startsWithIgnoringCase = /* str, prefix */ ignoringCase(startsWith);

    /** Does 'str' end with 'suffix'?
     *  Note: all strings end with the empty string.
     *        More formally, for all strings x, endsWith(x, "").
     *        This is so that for all strings x and y, endsWith(x + y, y)
     */
    var endsWith = function(str, suffix) {
      return checkRange(str, suffix, str.length - suffix.length);
    };

    var endsWithIgnoringCase = /* str, suffix */ ignoringCase(endsWith);

    /** Return the first 'count' letters from 'str'.
     *  e.g. first("abcde", 2) === "ab"
     */
    var first = function(str, count) {
      return str.substr(0, count);
    };

    /** Return the last 'count' letters from 'str'.
     *  e.g. last("abcde", 2) === "de"
     */
    var last = function(str, count) {
      return str.substr(str.length - count, str.length);
    };

    var removeAppendage = function(checkFn, chopFn) {
      return function(str, appendage) {
        return checkFn(str, appendage) ? chopFn(str, str.length - appendage.length) : str;
      };
    };

    var removeLeading = /* str, prefix */ removeAppendage(startsWith, last);
    var removeTrailing = /* str, suffix */ removeAppendage(endsWith, first);

    var append = function(a, b) {
      return a + b;
    };

    var prepend = function(a, b) {
      return b + a;
    };

    var ensureAppendage = function(checkFn, concatter) {
      return function(str, appendage) {
        return checkFn(str, appendage) ? str : concatter(str, appendage);
      };
    };

    var ensureLeading = /* str, prefix */ ensureAppendage(startsWith, prepend);
    var ensureTrailing = /* str, suffix */ ensureAppendage(endsWith, append);

    /** removes all leading and trailing spaces */
    var trim = function(str) {
      return str.replace(/^\s+|\s+$/g, '');
    };

    var lTrim = function(str) {
      return str.replace(/^\s+/g, '');
    };

    var rTrim = function(str) {
      return str.replace(/\s+$/g, '');
    };

    /** Does 'str' contain 'substr'?
     *  Note: all strings contain the empty string.
     */
    var contains = function(str, substr) {
      return str.indexOf(substr) != -1;
    };

    var containsIgnoringCase = /* str, substr */ ignoringCase(contains);

    var htmlEncodeDoubleQuotes = function(str) {
      return str.replace(/\"/gm, "&quot;");
    };

    var equals = function(a, b) {
      return a === b;
    };
    var equalsIgnoringCase = /* a, b */ ignoringCase(equals);

    var head = function(str) {
      if (str === "") throw "head on empty string";
      return str.substr(0, 1);
    };

    var toe = function(str) {
      if (str === "") throw "toe on empty string";
      return str.substr(str.length - 1, str.length);
    };

    var tail = function(str) {
      if (str === "") throw "tail on empty string";
      return str.substr(1, str.length - 1);
    };

    var torso = function(str) {
      if (str === "") throw "torso on empty string";
      return str.substr(0, str.length - 1);
    };

    var capitalize = function(str) {
      if (str === "") return str;
      return head(str).toUpperCase() + tail(str);
    };

    var repeat = function(str, num) {
      Validate.vString('str', str);
      Validate.vNat('num', num);
      var r = '';
      for (var i = 0; i < num; i++) {
        r += str;
      }
      return r;
    };

    var pad = function(combiner) {
      return function(str, c, width) {
        Validate.vString('str', str);
        Validate.vChar('c', c);
        Validate.vNat('width', width);
        var l = str.length;
        return l >= width ? str : combiner(str, repeat(c, width - l));
      };
    };

    var padLeft  = pad(function(s, padding) { return padding + s; });
    var padRight = pad(function(s, padding) { return s + padding; });

    return {
      supplant: supplant,
      startsWith: startsWith,
      startsWithIgnoringCase: startsWithIgnoringCase,
      endsWith: endsWith,
      endsWithIgnoringCase: endsWithIgnoringCase,
      first: first,
      last: last,
      removeLeading: removeLeading,
      removeTrailing: removeTrailing,
      ensureLeading: ensureLeading,
      ensureTrailing: ensureTrailing,
      trim: trim,
      lTrim: lTrim,
      rTrim: rTrim,
      contains: contains,
      containsIgnoringCase: containsIgnoringCase,
      htmlEncodeDoubleQuotes: htmlEncodeDoubleQuotes,
      equals: equals,
      equalsIgnoringCase: equalsIgnoringCase,
      head: head,
      repead: repeat,
      padLeft: padLeft,
      padRight: padRight,
      toe: toe,
      tail: tail,
      torso: torso,
      capitalize: capitalize
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.services.UploadCommon',

  [
    'ephox.classify.Type',
    'ephox.compass.Arr',
    'ephox.numerosity.api.FormData',
    'ephox.scullion.Struct',
    'ephox.violin.Strings'
  ],

  function (Type, Arr, FormData, Struct, Strings) {
    var failureObject = Struct.immutable('message', 'status', 'contents');

    var known = [ 'jpg', 'png', 'gif', 'jpeg' ]; // I welcome more suggestions

    var buildFilename = function (file, identifier) {
      if (Type.isString(file.type) && Strings.startsWith(file.type, 'image/')) {
        var filetype = file.type.substr('image/'.length);

        // If it's a known extension, use it, otherwise just don't provide an extension
        return Arr.contains(known, filetype) ? identifier + '.' + filetype : identifier;
      } else {
        // things that aren't image/xxx can just have the default filename with no extension
        return identifier;
      }
    };

    var getFilename = function (file, identifier) {
      // file.name is the default, but if it's a blob the default name is 'blob'
      // TBIO-3151: On IE11 internet sites the filename ends in '.tmp' and we don't want to upload that.
      var useFilename = Type.isString(file.name) && !Strings.endsWith(file.name, '.tmp');
      return useFilename ? file.name : buildFilename(file, identifier);
    };

    var buildExtra = function (fieldName, file, filename) {
      var formData = FormData();
      formData.append(fieldName, file, filename);

      return {
        data: formData,
        // override Jax, which sets this to application/json (triggering pre-flight)
        contentType: false,
        // stop JQuery processing the data
        processData: false
      };
    };

    return {
      failureObject: failureObject,
      getFilename: getFilename,
      buildExtra: buildExtra
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.api.XMLHttpRequest',

  [
    'ephox.numerosity.core.Global'
  ],

  function (Global) {
    /*
     * IE8 and above per
     * https://developer.mozilla.org/en/docs/XMLHttpRequest
     */
    return function () {
      var f = Global.getOrDie('XMLHttpRequest');
      return new f();
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.jax.base.Ajax',

  [
    'ephox.classify.Type',
    'ephox.compass.Obj',
    'ephox.highway.Merger',
    'ephox.numerosity.api.XMLHttpRequest',
    'ephox.perhaps.Result',
    'ephox.violin.Strings',
    'global!console'
  ],

  function (Type, Obj, Merger, XMLHttpRequest, Result, Strings, console) {
    var accepts = {
      '*': '*/*',
      text: 'text/plain',
      html: 'text/html',
      xml: 'application/xml, text/xml',
      json: 'application/json, text/javascript'
    };

    /*
     *
     * This could be done better, but that would involve an API change. Or move some of it to numerosity.
     * Start by replicating JQuery API, and unravel later.
     *
     */

    var ajax = function (url, success, error, extra) {
      var base = {
        url: url,
        contentType: 'application/json',
        processData: false,
        type: 'GET'
      };

      var options = Merger.merge(base, extra);
      // This would be nice, but IE doesn't support responseType 'json' - might be an excuse to bring in platform detection
      /*
      if (Type.isString(options.responseType))
         request.responseType = options.responseType;
      */

      var request = XMLHttpRequest();

      request.open(options.type.toUpperCase(), options.url, true); // enforced async! enforced type as String!

      if (Type.isString(options.contentType)) { // set to string here, but overridden for form posting by TBIO-1255
        request.setRequestHeader('Content-Type', options.contentType);
      }

      // I'm not 100% sure why JQuery does this, but eh why not
      var odt = options.dataType;
      var a = Type.isString(odt) && odt !== '*' ?
        accepts[odt] + ', ' + accepts['*'] + '; q=0.01' :
        accepts['*'];

      request.setRequestHeader('Accept', a);

      if (options.xhrFields !== undefined && options.xhrFields.withCredentials === true) {
        request.withCredentials = true; // IE10 minimum
      }

      // Do this last, so the extra headers can override the above
      if (Type.isObject(options.headers)) Obj.each(options.headers, function (v, k) {
        if (!Type.isString(k) && !Type.isString(v)) console.error('Request header data was not a string: ', k ,' -> ', v);
        else request.setRequestHeader(k, v);
      });

      var onSuccess = function (data, status, jqxhr) {
        success(data);
      };

      var onError = function (jqxhr) {
        error('Could not load url "' + url + '": ' + jqxhr.status + ' ' + jqxhr.statusText, jqxhr.status, jqxhr.responseText);
      };

      var parseJson = function (jqxhr) {
        // If we do this inside the try block, an error in the success callback will be caught
        // by the "response was not JSON" catch block.
        try {
          return Result.value(JSON.parse(jqxhr.response));
        } catch (e) {
          return Result.error({
            status: jqxhr.status,
            statusText: 'Response was not JSON',
            responseText: jqxhr.responseText
          });
        }
      };

      var validateData = function (request) {
        var data = options.dataType === 'json' ? parseJson(request) : Result.value(request.response);
        data.fold(onError, function (xhrData) {
          onSuccess(xhrData, request.statusText, request);
        });
      };

      var onLoad = function () {
        if (request.status === 0) {
          // Local files and Cors errors return status 0.
          // The only way we can decifer a local request is request url starts with 'file:' and allow local files to succeed.
          if (Strings.startsWith(options.url, 'file:')) validateData(request);
          else error('Unknown HTTP error (possible cross-domain request)', request.status, request.responseText);

        } else if ( request.status < 100 || request.status >= 400) {
          // Technically only network errors trigger onerror; HTTP errors trigger onload.
          // In practice only IE does this. But we need to handle it.
          onError(request);
        } else {
          validateData(request);
        }
      };

      request.onerror = onError;
      request.onload = onLoad;
      // I suspect refactoring this at all will break stuff
      if (options.data === undefined) {
        request.send();
      } else {
        request.send(options.data);
      }
    };

    return {
      ajax: ajax
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.api.JSON',

  [
    'ephox.numerosity.core.Global'
  ],

  function (Global) {
    /*
     * IE8 and above per
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
     */
    var json = function () {
      return Global.getOrDie('JSON');
    };

    var parse = function (obj) {
      return json().parse(obj);
    };

    var stringify = function (obj) {
      return json().stringify(obj);
    };

    return {
      parse: parse,
      stringify: stringify
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.jax.plain.Ajax',

  [
    'ephox.highway.Merger',
    'ephox.jax.base.Ajax',
    'ephox.numerosity.api.JSON'
  ],

  function (Merger, Ajax, JSON) {
    var get = function (url, success, error, extra) {
      Ajax.ajax(url, success, error, Merger.merge({
        dataType: 'text',
        type: 'GET'
      }, extra));
    };

    var post = function (url, data, success, error, extra) {
      Ajax.ajax(url, success, error, Merger.merge({
        dataType: 'text',
        data: JSON.stringify(data),
        type: 'POST'
      }, extra));
    };

    return {
      get: get,
      post: post
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
// An implementation of the algorithm specified in section 5.3 of RFC 3986.
// See http://tools.ietf.org/html/rfc3986#section-5.3
define(
  'ephox.yuri.resolve.Recompose',

  [
  ],

  function () {
    var recompose = function (transformed) {
      var result = '';

      if (transformed.protocol !== '') {
        result += transformed.protocol;
        result += ':';
      }

      if (transformed.authority !== '') {
        result += '//';
        result += transformed.authority;
      }

      result += transformed.path;

      if (transformed.query !== '') {
        result += '?';
        result += transformed.query;
      }

      if (transformed.anchor !== '') {
        result += '#';
        result += transformed.anchor;
      }

      return result;
    };

    return {
      recompose: recompose
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
// Based on parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// http://blog.stevenlevithan.com/archives/parseuri
//
// Forked by Ephox on 2011-02-07. Source modified.
define(
  'ephox.yuri.api.Parser',

  [
    'ephox.highway.Merger'
  ],

  function (Merger) {
    var defaultOptions = {
      strictMode: false,
      key: [ 'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor' ],
      q: {
        name:   'queryKey',
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };

    var parseUri = function (str, options) {
      var o = options,
        m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
        uri = {},
        i = 14;

      while (i--) uri[o.key[i]] = m[i] || '';

      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
      });

      return uri;
    };

    var parse = function (str, options) {
      var augmentedOptions = Merger.merge(defaultOptions, options);
      return parseUri(str, augmentedOptions);
    };

    return {
      parse: parse
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
// An implementation of the algorithm specified in section 5.2.4 of RFC 3986.
// See http://tools.ietf.org/html/rfc3986#section-5.2.4
define(
  'ephox.yuri.normalize.Dots',

  [
    'ephox.violin.Strings'
  ],

  function (Strings) {
    var removeLastSegment = function (path) {
      return Strings.removeTrailing(path, lastSegment(path));
    };

    var firstSegment = function (path) {
      return path.match(/(^\/?.*?)(\/|$)/)[1];
    };

    var lastSegment = function (path) {
      return path.substring(path.lastIndexOf('/'));
    };

    var remove = function (path) {
      // 1.
      var input = path;
      var output = '';

      // 2.
      while (input !== '') {
        // 2. A
        if (Strings.startsWith(input, '../')) {
          input = Strings.removeLeading(input, '../');
        } else if (Strings.startsWith(input, './')) {
          input = Strings.removeLeading(input, './');
        // 2. B
        } else if (Strings.startsWith(input, '/./')) {
          input = '/' + Strings.removeLeading(input, '/./');
        } else if (input === '/.') {
          input = '/';
        // 2. C
        } else if (Strings.startsWith(input, '/../')) {
          input = '/' + Strings.removeLeading(input, '/../');
          output = removeLastSegment(output);
        } else if (input === '/..') {
          input = '/';
          output = removeLastSegment(output);
        // 2. D
        } else if (input === '.' || input === '..') {
          input = '';
        // 2. E
        } else {
          var first = firstSegment(input);
          input = Strings.removeLeading(input, first);
          output += first;
        }
      }

      // 3.
      return output;
    };

    return {
      remove: remove
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
// An implementation of the algorithm specified in section 5.2.3 of RFC 3986.
// See http://tools.ietf.org/html/rfc3986#section-5.2.3
define(
  'ephox.yuri.resolve.Merge',

  [
    'ephox.violin.Strings'
  ],

  function (Strings) {
    var merge = function (base, rel, baseAuthority) {
      if (baseAuthority !== '' && base === '')
        return '/' + rel;

      var last = base.substring(base.lastIndexOf('/') + 1);
      return Strings.removeTrailing(base, last) + rel;
    };

    return {
      merge: merge
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
// An implementation of the algorithm specified in section 5.2.2 of RFC 3986.
// See http://tools.ietf.org/html/rfc3986#section-5.2.2
define(
  'ephox.yuri.resolve.Transform',

  [
    'ephox.violin.Strings',
    'ephox.yuri.api.Parser',
    'ephox.yuri.normalize.Dots',
    'ephox.yuri.resolve.Merge'
  ],

  function (Strings, Parser, Dots, Merge) {
    var transform = function (base, relative) {
      var options = { strictMode: true };

      var b = Parser.parse(base, options);
      var rel = Parser.parse(relative, options);

      var ret = {};

      if (rel.protocol !== '') {
        ret.protocol = rel.protocol;
        ret.authority = rel.authority;
        ret.path = Dots.remove(rel.path);
        ret.query = rel.query;
      } else {
         if (rel.authority !== '') {
            ret.authority = rel.authority;
            ret.path = Dots.remove(rel.path);
            ret.query = rel.query;
         } else {
          if (rel.path === '') {
            ret.path = b.path;
            if (rel.query !== '') {
              ret.query = rel.query;
            } else {
              ret.query = b.query;
            }
          } else {
            if (Strings.startsWith(rel.path, '/')) {
               ret.path = Dots.remove(rel.path);
            } else {
              ret.path = Merge.merge(b.path, rel.path, base.authority);
              ret.path = Dots.remove(ret.path);
            }
            ret.query = rel.query;
          }
          ret.authority = b.authority;
        }
        ret.protocol = b.protocol;
      }

      ret.anchor = rel.anchor;

      return ret;
    };

    return {
      transform: transform
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.yuri.api.Resolver',

  [
    'ephox.yuri.resolve.Recompose',
    'ephox.yuri.resolve.Transform'
  ],

  function (Recompose, Transform) {
    var resolve = function (base, relative) {
      var transformed = Transform.transform(base, relative);
      return Recompose.recompose(transformed);
    };

    return {
      resolve: resolve
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.services.UploadDirect',

  [
    'ephox.classify.Type',
    'ephox.highway.Merger',
    'ephox.jax.plain.Ajax',
    'ephox.numerosity.api.JSON',
    'ephox.perhaps.Result',
    'ephox.salmon.services.UploadCommon',
    'ephox.violin.Strings',
    'ephox.yuri.api.Resolver'
  ],

  function (Type, Merger, Ajax, JSON, Result, UploadCommon, Strings, Resolver) {
    return function (settings) {

      /*
       * If a base is not provided by the config, use the directory where the
       * POST acceptor lives
       */
      var resolveBase = function () {
        var fullBase = settings.url;
        // The base is the string up to the last slash, unless that slash is at the start of the string.
        var lastSlash = fullBase.lastIndexOf('/');
        var base = lastSlash > 0 ? fullBase.substr(0, lastSlash) : fullBase;

        var _responseBase = settings.basePath === undefined ? base : settings.basePath;
        return Strings.endsWith(_responseBase, '/') ? _responseBase : _responseBase + '/';
      };

      // pre-calculate, don't need to do this on every upload
      var responseBase = resolveBase();


      /*
       * ELJ upload handler result location consists of:
       *
       * - If the response looks like a URL, use that as the filename
       * - Otherwise use the source filename
       * - take the filename, and resolve it relative to the base provided by the config
       */
      var calculateLocation = function (response, filename) {
        var splits = response.split(/\s+/);

        // If the response text is a simple string with no whitespace, it's a URL
        var serverFilename = (splits.length === 1 && splits[0] !== '') ? splits[0] : filename;

        // Resolve the settings base url to the response
        return Resolver.resolve(responseBase, serverFilename);
      };

      // ELJ style direct uploader, form field name 'image'
      var upload = function (blobInfo, identifier, callback) {
        var file = blobInfo.blob();
        var failure = function (message, status, contents) {
          callback(Result.error(UploadCommon.failureObject(message, status, contents)));
        };

        var filename = UploadCommon.getFilename(file, identifier);

        var useCreds = settings.credentials !== true ? {} : {
          xhrFields: {
            withCredentials: true
          }
        };

        var extra = Merger.merge(useCreds, UploadCommon.buildExtra('image', file, filename));

        var success = function (_response) {
          var response;
          // This is difficult to refactor; response is either a json parse failure, a json object, or a string.
          try {
            var json = JSON.parse(_response);
            // we have JSON, make sure it's valid
            if (!Type.isString(json.location)) {
              failure('JSON response did not contain a string location', 500, _response);
              return;
            } else {
              // we now support adding a base URL ELJ style, so we have to unwrap the JSON into a string
              response = json.location;
            }
          } catch (e) {
            // not JSON, assume it's an ELJ style url response
            response = _response;
          }

          var loc = calculateLocation(response, filename);

          callback(Result.value({
            // convert ELJ style response to TBIO expected response
            location: loc
          }));
        };

        Ajax.post(settings.url, {}, success, failure, extra);
      };

      return {
        upload: upload
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!setTimeout", [], function () { return setTimeout; });
(function (define, require, demand) {
define(
  'ephox.salmon.services.UploadFunction',

  [
    'ephox.classify.Type',
    'ephox.perhaps.Result',
    'ephox.salmon.services.UploadCommon',
    'ephox.scullion.Struct',
    'global!console',
    'global!setTimeout'
  ],

  function (Type, Result, UploadCommon, Struct, console, setTimeout) {
    var imageObjectApi = Struct.immutable('id', 'filename', 'blob', 'base64');

    // Customer handler function
    return function (handler) {

      var upload = function (blobInfo, identifier, callback) {
        var failure = function (message) {
          // SimpleError handles the variety of callback message types, so just pass it straight through
          callback(Result.error(message));
        };

        var success = function (result) {
          if (!Type.isString(result)) {
            console.error('Image upload result was not a string');
            failure('');
          } else {
            callback(Result.value({
              // convert to TBIO expected response
              location: result
            }));
          }
        };

        var filename = UploadCommon.getFilename(blobInfo.blob(), identifier);

        var api = imageObjectApi(identifier, filename, blobInfo.blob(), blobInfo.data().result);

        // wrap the custom handler in a setTimeout so that if it throws an error, that doesn't break the core editor
        setTimeout(function () {
          handler(api, success, failure);
        }, 0);
      };

      return {
        upload: upload
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.salmon.api.Uploaders',

  [
    'ephox.salmon.services.UploadCommon',
    'ephox.salmon.services.UploadDirect',
    'ephox.salmon.services.UploadFunction'
  ],

  function (UploadCommon, UploadDirect, UploadFunction) {
    var direct = function (settings) {
      return UploadDirect(settings);
    };

    var custom = function (handler) {
      return UploadFunction(handler);
    };

    var failureObject = function (message, status, contents) {
      return UploadCommon.failureObject(message, status, contents);
    };

    var getFilename = function (file, identifier) {
      return UploadCommon.getFilename(file, identifier);
    };

    var buildExtra = function (fieldName, file, filename) {
      return UploadCommon.buildExtra(fieldName, file, filename);
    };

    return {
      direct: direct,
      custom: custom,
      failureObject: failureObject,
      getFilename: getFilename,
      buildExtra: buildExtra
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.imageupload.EphoxUploader',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.powerpaste.imageupload.TinyUploader',
    'ephox.powerpaste.imageupload.UploadError',
    'ephox.powerpaste.tinymce.UndoRewriter',
    'ephox.salmon.api.BlobCache',
    'ephox.salmon.api.ImageTracker',
    'ephox.salmon.api.UploadUtils',
    'ephox.salmon.api.Uploaders',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element'
  ],

  function (Arr, Fun, Option, TinyUploader, UploadError, UndoRewriter, BlobCache, ImageTracker, UploadUtils, Uploaders, Attr, Element) {
    var enabled = function (editor, settings) {
      // Use polish dependencies.
      var blobCache = BlobCache();
      var imageTracker = ImageTracker();
      var errorHandler = UploadError();
      var errors = UploadError(editor, settings.url);

      // UploadDirect will need an error handler that is tiny specific.
      var uploadManager = Uploaders.direct(settings);

      var getBody = function () {
        return Element.fromDom(editor.getBody());
      };

      var updateImage = function (result, images, b) {
        Arr.each(images, function (img) {
          Attr.set(img, 'data-mce-src', result.location);
        });

        // undo hack.
        UndoRewriter.resrcHistory(editor, b, result);
      };

      imageTracker.events.complete.bind(function (event) {
        //Other undo hack.
        UndoRewriter.unwrapHistory(editor);
      });

      var uploadImage = function(id, blob, showError) {
        UploadUtils.handleUpload(uploadManager, imageTracker, blobCache, getBody(), id, blob, function (upResult) {
          upResult.fold(function (err) {
            // show error dialog
            showError(err);
          }, updateImage);
        });
      };

      var prepareForUpload = function (info, showError) {
        UploadUtils.prepareForUpload(imageTracker, info.blobInfo().id(), info.image()).each(function (id) {
          uploadImage(id, info.blobInfo(), showError);
        });
      };

      var uploadAssets = function (assets) {
        var showError = errors.instance();
        var candidates = UploadUtils.registerAssets(blobCache, getBody(), assets);
        Arr.each(candidates, function (candidate) {
          candidate.fold(function (err) {
            // a blob we do not know about.
            console.error(err);
          }, function(info) {
            prepareForUpload(info, showError);
          });
        });
      };

      // Need to fill this in.
      var reconstitute = function () {
        var showError = errors.instance();
        var imageBlobs = UploadUtils.findBlobs(imageTracker, blobCache, getBody());
        Arr.each(imageBlobs, function (imageBlob) {
          imageBlob.fold(function (id) {
            // Report the failure.
            imageTracker.report(id, Option.none(), false);
          }, function(info) {
            prepareForUpload(info, showError);
          });
        });
      };

      var uploadImages = function (assets) {
        reconstitute();

        uploadAssets(assets);
      };

      var getLocalURL = function (id, blob, objurl, data) {
        return objurl;
      };

      return {
        uploadImages: uploadImages,
        prepareImages: Fun.noop, //Images are already in Ephox uploader's required format (blobs)
        getLocalURL: getLocalURL
      };
    };


    var disabled = function(editor) {

      var tinyUploader = TinyUploader(editor);

      return {
        uploadImages: Fun.noop,
        prepareImages: tinyUploader.prepareImages, //Convert images back to base64 so they aren't unusable
        getLocalURL: tinyUploader.getLocalURL //As above
      };
    };

    return function (editor, settings) {
      return settings ? enabled(editor, settings) : disabled(editor);
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.imageupload.UploaderFactory',

  [
    'ephox.powerpaste.imageupload.EphoxUploader',
    'ephox.powerpaste.imageupload.TinyUploader'
  ],
  function (EphoxUploader, TinyUploader) {
    return function (editor) {
      //We'll only need to use ephox's uploader if Tiny's 4.0-4.1 and we have an images_upload_url setting
      var ephoxUploadSettings = !editor.uploadImages && editor.settings.images_upload_url ?
        {
              url: editor.settings.images_upload_url,
              basePath: editor.settings.images_upload_base_path,
              credentials: editor.settings.images_upload_credentials
        } : null;
      return !editor.uploadImages ? EphoxUploader(editor, ephoxUploadSettings) : TinyUploader(editor);
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.tinymce.Util',

  [
  ],

  function () {
    var bind = function(func, t) {
      return function() {
        return func.apply(t, arguments);
      };
    };

    // Useful utilities that may exist in libraries but aren't as common.
    // Currently we're providing our own implementation for these but want to track them.
    var ephoxGetComputedStyle = function(node) {
      if (node.ownerDocument.defaultView) {
        return node.ownerDocument.defaultView.getComputedStyle(node, null);
      }
      return node.currentStyle || {};
    };

    var log = function(msg) {
      if (typeof(console) !== 'undefined' && console.log) {
        console.log(msg);
      }
    };

    var compose = function(funs) {
      var args = Array.prototype.slice.call(funs).reverse();
      return function(input) {
        var r = input;
        for (var i = 0; i < args.length; i++) {
          var fun = args[i];
          r = fun(r);
        }
        return r;
      };
    };

    var extend = function(obj) {
      tinymce.each(Array.prototype.slice.call(arguments, 1), function(element){
        for (var prop in element) {
          obj[prop] = element[prop];
        }
      });
      return obj;
    };

    return {
      each: tinymce.each,
      trim: tinymce.trim,
      bind: bind,
      extend: extend,
      ephoxGetComputedStyle: ephoxGetComputedStyle,
      log: log,
      compose: compose
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
/**
 * Source code in this file has been taken under a commercial license from tinymce/jscripts/tiny_mce/plugins/paste/editor_plugin_src.js
 * Copyright 2009, Moxiecode Systems AB
 */
define(
  'ephox.powerpaste.legacy.tinymce.Clipboard',

  [
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Util) {
    var each = tinymce.each;
    // Note that there is only ever one instance of this module - it's not created specifically for each editor.

    // Private function that does the actual work of grabbing the clipboard content.
    // This can then be shared between the onpaste and onKeyDown listeners.
    var grabContent = function(ed, callback, e) {
      var n, or, rng, sel = ed.selection, dom = ed.dom, body = ed.getBody(), posY;

          // Check if browser supports direct plaintext access
          if (e.clipboardData && e.clipboardData.getData('text/html')) {
              e.preventDefault();
              var data = e.clipboardData.getData('text/html');
              var matched = data.match(/<html[\s\S]+<\/html>/i);
              // some browsers such as firefox don't wrap the content in a html tag
              var content = matched === null ? data : matched[0];
              return callback(content);
          }

          if (dom.get('_mcePaste'))
              return;

          // Create container to paste into
          n = dom.add(body, 'div', {id : '_mcePaste', 'class' : 'mcePaste'}, '\uFEFF<br _mce_bogus="1">');

          // If contentEditable mode we need to find out the position of the closest element
          if (body != ed.getDoc().body)
              posY = dom.getPos(ed.selection.getStart(), body).y;
          else
            posY = body.scrollTop;

          // Styles needs to be applied after the element is added to the document since WebKit will otherwise remove all styles
          dom.setStyles(n, {
              position : 'absolute',
              left : -10000,
              top : posY,
              width : 1,
              height : 1,
              overflow : 'hidden'
          });

          if (tinymce.isIE) {
              // Select the container
              rng = dom.doc.body.createTextRange();
              rng.moveToElementText(n);
              rng.execCommand('Paste');

              // Remove container
              dom.remove(n);

              // Check if the contents was changed, if it wasn't then clipboard extraction failed probably due
              // to IE security settings so we pass the junk though better than nothing right
              if (n.innerHTML === '\uFEFF') {
                  ed.execCommand('mcePasteWord');
                  e.preventDefault();
                  return;
              }

              // Process contents
              callback(n.innerHTML);

              // Block the real paste event
              return tinymce.dom.Event.cancel(e);
          } else {
              var block = function(e) {
                  e.preventDefault();
              };

              // Block mousedown and click to prevent selection change
              dom.bind(ed.getDoc(), 'mousedown', block);
              dom.bind(ed.getDoc(), 'keydown', block);

              // If pasting inside the same element and the contents is only one block
              // remove the block and keep the text since Firefox will copy parts of pre and h1-h6 as a pre element
              if (tinymce.isGecko) {
                  rng = ed.selection.getRng(true);
                  if (rng.startContainer == rng.endContainer && rng.startContainer.nodeType == 3) {
                      nodes = dom.select('p,h1,h2,h3,h4,h5,h6,pre', n);

                      if (nodes.length == 1)
                          dom.remove(nodes.reverse(), true);
                  }
              }

              or = ed.selection.getRng();

              // Move caret into hidden div
              n = n.firstChild;
              rng = ed.getDoc().createRange();
              rng.setStart(n, 0);
              rng.setEnd(n, 1);
              sel.setRng(rng);

              // Wait a while and grab the pasted contents
              window.setTimeout(function() {
                  var h = '', nl = dom.select('div.mcePaste');

                  // WebKit will split the div into multiple ones so this will loop through then all and join them to get the whole HTML string
                  Util.each(nl, function(n) {
                      var child = n.firstChild;

                      // WebKit inserts a DIV container with lots of odd styles
                      if (child && child.nodeName == 'DIV' && child.style.marginTop && child.style.backgroundColor) {
                          dom.remove(child, 1);
                      }

                      // WebKit duplicates the divs so we need to remove them
                      Util.each(dom.select('div.mcePaste', n), function(n) {
                          dom.remove(n, 1);
                      });

                      // Remove apply style spans
                      Util.each(dom.select('span.Apple-style-span', n), function(n) {
                          dom.remove(n, 1);
                      });

                      // Remove bogus br elements
                      Util.each(dom.select('br[_mce_bogus]', n), function(n) {
                          dom.remove(n);
                      });

                      h += n.innerHTML;
                  });

                  // Remove the nodes
                  Util.each(nl, function(n) {
                      dom.remove(n);
                  });

                  // Restore the old selection
                  if (or)
                      sel.setRng(or);

                  callback(h);

                  // Unblock events ones we got the contents
                  dom.unbind(ed.getDoc(), 'mousedown', block);
                  dom.unbind(ed.getDoc(), 'keydown', block);
              }, 0);
          }
    };

    /** Creates the function to attach to the onpaste event so that the pasted content can be intercepted.
     *
     * The returned function should capture the pasted content and pass it as the argument to the provided callback function.
     *
     * @param ed the editor this function is for.
     * @param callback the function to call with the clipboard content as the argument
     */
    var getOnPasteFunction = function(ed, callback) {
      return function(e) {
        grabContent(ed, callback, e);
      };
    };

    /** Creates the function to attach to the onKeyDown event so that the pasted content can be intercepted. If no onKeyDown function is required in the current browser
     * this should return null.
     *
     * The returned function should capture the pasted content and pass it as the argument to the provided callback function.
     *
     * @param ed the editor this function is for.
     * @param callback the function to call with the clipboard content as the argument
     */
    var getOnKeyDownFunction = function(ed, callback) {
      return function(e) {
              // Is it's Opera or older FF use key handler
              if (tinymce.isOpera || navigator.userAgent.indexOf('Firefox/2') > 0) {
                  if (((tinymce.isMac ? e.metaKey : e.ctrlKey) && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45))
                      grabContent(ed, callback, e);
        }
      };
    };

    return {
      getOnPasteFunction: getOnPasteFunction,
      getOnKeyDownFunction: getOnKeyDownFunction
    };
  });

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.data.Insert',

  [

  ],

  function () {
    var insert = function(fragment, editor) {
      var document = editor.getDoc(), marker, markerId = "ephoxInsertMarker", selection = editor.selection, dom = editor.dom;
      selection.setContent('<span id="' + markerId + '">&nbsp;</span>');
      marker = dom.get(markerId);
      var leadingText = document.createDocumentFragment();
      while (fragment.firstChild && !dom.isBlock(fragment.firstChild)) {
        leadingText.appendChild(fragment.firstChild);
      }
      var trailingText = document.createDocumentFragment();
      while (fragment.lastChild && !dom.isBlock(fragment.lastChild)) {
        trailingText.appendChild(fragment.lastChild);
      }

      marker.parentNode.insertBefore(leadingText, marker);
      dom.insertAfter(trailingText, marker);

      if (fragment.firstChild) {
        if (dom.isBlock(fragment.firstChild)) {
          while (!dom.isBlock(marker.parentNode) && marker.parentNode !== dom.getRoot()) {
            marker = dom.split(marker.parentNode, marker);
          }
          if (!dom.is(marker.parentNode, 'td,th') && marker.parentNode !== dom.getRoot()) {
            marker = dom.split(marker.parentNode, marker);
          }
        }

        dom.replace(fragment, marker);
      } else {
        dom.remove(marker);
      }
    };

    return {
      insert: insert
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.tinymce.Settings',

  [
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Util) {
    var settings_clean = {
      strip_class_attributes: 'all',
      retain_style_properties: 'none'
    };

    var settings_inline = {
      strip_class_attributes: 'none',
      retain_style_properties: 'valid'
    };

    var getImportSettings = function(pasteType, defaultSettings) {
      if (pasteType && typeof(pasteType) != 'string') {
        return pasteType;
      }

      switch (pasteType) {
        case 'clean': return settings_clean;
        case 'merge': return settings_inline;
        default: return defaultSettings;
      }
    };

    var getSettingsFor = function(pasteWordAs, pasteHtmlAs, base64Images) {
      var s = getImportSettings(pasteWordAs, pasteHtmlAs);
      s = Util.extend(s, {base_64_images: base64Images});
      return s;
    };

    var create = function(pasteWordAs, pasteHtmlAs, base64Images) {
      var wordSettings = getSettingsFor(pasteWordAs, settings_clean, base64Images);
      var htmlSettings = getSettingsFor(pasteHtmlAs, settings_inline, base64Images);

      var activeSettings = htmlSettings;

      var setWordContent = function(wordContent) {
        activeSettings = wordContent ? wordSettings : htmlSettings;
      };

      var get = function(name) {
        return activeSettings[name];
      };
      return {
        setWordContent: setWordContent,
        get: get
      };
    };

    return {
      create: create
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.data.tokens.Attributes',

  [
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Util) {
    var isAttrSpecified = function(attr) {
      return attr.specified !== false || (attr.nodeName === 'name' && attr.value !== '');
    };

    var combineFilters = function(filter1, filter2) {
      if (!filter1 || !filter2) {
        return filter1 || filter2;
      }
      return function(name, value) {
        return filter2(name, filter1(name, value));
      };
    };

    var manager = function(node) {
      var attributeCount = 0;
      var attributes;
      var getCachedAttributes = function() {
        return attributes;
      };

      var getAttributeMutableFunction;
      var getAttributes = function() {
        return getAttributeMutableFunction();
      };

      getAttributeMutableFunction = function() {
        attributes = {};
        attributeCount = 0;
        // Load from native.
        Util.each(node.attributes, function(attr) {
          var name = attr.nodeName, value = attr.value;
          if (isAttrSpecified(attr)) {
            if (value !== null && value !== undefined) {
              attributes[name] = value;
              attributeCount++;
            }
          }
        });
        if (attributes.style === undefined && node.style.cssText) {
          attributes.style = node.style.cssText;
          attributeCount++;
        }
        getAttributeMutableFunction = getCachedAttributes;
        return attributes;
      };

      var getAttributeCount = function() {
        getAttributeMutableFunction();
        return attributeCount;
      };

      var unappliedFilter;
      var unfilteredGetAttributes;

      var filter = function(f) {
        if (!unappliedFilter) {
          unfilteredGetAttributes = getAttributeMutableFunction;
        }

        unappliedFilter = combineFilters(unappliedFilter, f);
        // Defer applying the filter until we absolutely have to.
        getAttributeMutableFunction = function() {
          getAttributeMutableFunction = unfilteredGetAttributes;
          eachAttribute(function(name, value) {
            var newValue = unappliedFilter(name, value);
            if (newValue === null) {
              node.removeAttribute(name);
              delete attributes[name];
              attributeCount--;
            } else if (newValue !== value) {
              if (name === 'class') {
                node.className = newValue;
              } else {
                node.setAttribute(name, newValue);
              }
              attributes[name] = newValue;
            }
          });
          getAttributeMutableFunction = getCachedAttributes;
          return attributes;
        };
      };

      var get = function(name) {
        return getAttributeMutableFunction()[name];
      };

      var eachAttribute = function(callback) {
        Util.each(getAttributeMutableFunction(), function(value, name) {
          callback(name, value);
        });
      };

      return {
        get: get,
        each: eachAttribute,
        filter: filter,
        getAttributes: getAttributes,
        getAttributeCount: getAttributeCount
      };
    };
    return {
      manager: manager
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.data.tokens.Token',

  [
    'ephox.powerpaste.legacy.data.tokens.Attributes',
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Attributes, Util, TokenTypes) {
    var START_ELEMENT_TYPE = 'startElement';
    var END_ELEMENT_TYPE = 'endElement';
    var TEXT_TYPE = 'text';
    var COMMENT_TYPE = 'comment';

    var attributeManager = Attributes.manager;

    /**
     * Converts a style name from the CSS version (e.g. text-align) to the
     * DOM property equivalent (textAlign).
     *
     * @param name the style name to convert.
     * @returns the style name in DOM form.
     */
    var convertStyleName = function(name) {
      return name.replace(/-(.)/g, function(regex, capture) {
        return capture.toUpperCase();
      });
    };

    /**
     * Converts a style name from the DOM version (e.g. textAlign) to the
     * CSS equivalent (text-align). This is the reverse of convertStyleName.
     *
     * @param name the style name to convert.
     * @returns the style name in CSS form.
     */
    var convertStyleNameBack = function(name) {
      return name.replace(/([A-Z])/g, function(regex, capture) {
        return '-' + capture.toLowerCase();
      });
    };

    // This is shared across all instances because if we ever see an mso- style in the normal iteration
    // we can be certain they are included and don't need the extra check.
    var seenMsoStyle = false;
    var eachNativeStyle = function(node, syntheticStyles, callback) {
      var i, len = node.style.length, name, value, styles;
      styles = syntheticStyles || node.getAttribute("style");
      if (styles === undefined || styles === null || !styles.split) {
        styles = node.style.cssText;
      }
      Util.each(styles.split(';'), function(declaration) {
        var idx = declaration.indexOf(':');
        if (idx > 0) {
          name = Util.trim(declaration.substring(0, idx));
          if (name.toUpperCase() === name) {
            name = name.toLowerCase();
          }
          name = convertStyleNameBack(name);
          value = Util.trim(declaration.substring(idx + 1));
          if (!seenMsoStyle) seenMsoStyle = name.indexOf('mso-') === 0;
          callback(name, value);
        }
      });
      if (!seenMsoStyle) {
        // IE9 preserves unknown styles but provides no way to iterate them.
        // To deal with that, we look for the specific custom styles we care about.
        value = node.style['mso-list'];
        if (value) {
          callback('mso-list', value);
        }
      }
    };

    var token = function(node, endNode, syntheticStyles) {
      var tokenType;
      var tagName;
      var tokenText;
      var attributeStore;
      var tokenStyles;
      switch (node.nodeType) {
        case 1:
          if (endNode) {
            tokenType = END_ELEMENT_TYPE;
          } else {
            tokenType = START_ELEMENT_TYPE;
            attributeStore = attributeManager(node);

            tokenStyles = {};
            eachNativeStyle(node, syntheticStyles, function(name, value) {
              tokenStyles[name] = value;
            });
          }
          if (node.scopeName !== "HTML" && node.scopeName && node.tagName && node.tagName.indexOf(':') <= 0) {
            tagName = (node.scopeName + ":" + node.tagName).toUpperCase();
          } else {
            tagName = node.tagName;
          }

          break;
        case 3:
          tokenType = TEXT_TYPE;
          tokenText = node.nodeValue;
          break;
        case 8:
          tokenType = COMMENT_TYPE;
          tokenText = node.nodeValue;
          break;
        default:
          Util.log("WARNING: Unsupported node type encountered: " + node.nodeType);
          break;
      }

      var getNode = function() {
        // Make sure all filters are applied.
        if (attributeStore) attributeStore.getAttributes();
        return node;
      };

      var tag = function() {
        return tagName;
      };

      var type = function() {
        return tokenType;
      };

      var text = function() {
        return tokenText;
      };

      var toString = function() {
        return "Type: " + tokenType + ", Tag: " + tagName + " Text: " + tokenText;
      };

      var getAttribute = function(name) {
        return attributeStore.get(name.toLowerCase());
      };

      var filterAttributes = function(filter) {
        if (tokenType === START_ELEMENT_TYPE) {
          attributeStore.filter(filter);
        }
      };

      var filterStyles = function(filter) {
        if (type() === START_ELEMENT_TYPE) {
          var css = "";
          Util.each(tokenStyles, function(value, name) {
            var newValue = filter(name, value);
            if (newValue === null) {
              if (node.style.removeProperty) {
                node.style.removeProperty(convertStyleName(name));
              } else {
                node.style.removeAttribute(convertStyleName(name));
              }
              delete tokenStyles[name];
            } else {
              css += name + ': ' + newValue + '; ';
              tokenStyles[name] = newValue;
            }
          });
          css = css ? css : null;
          filterAttributes(function(name, value) {
            if (name === 'style') {
              return css;
            }
            return value;
          });
          node.style.cssText = css;
        }
      };

      var getAttributeCount = function() {
        return attributeStore.getAttributeCount();
      };

      var attributes = function(callback) {
        attributeStore.each(callback);
      };

      var getStyle = function(name) {
        return tokenStyles[name];
      };

      var styles = function(callback) {
        Util.each(tokenStyles, function(value, name) {
          callback(name, value);
        });
      };

      var getComputedStyle = function() {
        return Util.ephoxGetComputedStyle(node);
      };

      var isWhitespace = function() {
        return tokenType === TEXT_TYPE &&  /^[\s\u00A0]*$/.test(tokenText);
      };

      return {
        getNode: getNode,
        tag: tag,
        type: type,
        text: text,
        toString: toString,
        getAttribute: getAttribute,
        filterAttributes: filterAttributes,
        filterStyles: filterStyles,
        getAttributeCount: getAttributeCount,
        attributes: attributes,
        getStyle: getStyle,
        styles: styles,
        getComputedStyle: getComputedStyle,
        isWhitespace: isWhitespace
      };
    };

    var createStartElement = function(tag, attributes, styles, document) {
      var node = document.createElement(tag), css = "";
      Util.each(attributes, function(value, name) {
        node.setAttribute(name, value);
      });
      Util.each(styles, function(value, name) {
        css += name + ":" + value + ";";
        node.style[convertStyleName(name)] = value;
      });
      return token(node, false, css !== "" ? css : null);
    };

    var createEndElement = function(tag, document) {
      return token(document.createElement(tag), true);
    };

    var createComment = function(text, document) {
      return token(document.createComment(text), false);
    };

    var createText = function(text, document) {
      return token(document.createTextNode(text));
    };

    var FINISHED = createEndElement('HTML', window.document);

    return {
      START_ELEMENT_TYPE: START_ELEMENT_TYPE,
      END_ELEMENT_TYPE: END_ELEMENT_TYPE,
      TEXT_TYPE: TEXT_TYPE,
      COMMENT_TYPE: COMMENT_TYPE,
      FINISHED: FINISHED,
      token: token,
      createStartElement: createStartElement,
      createEndElement: createEndElement,
      createComment: createComment,
      createText: createText
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.data.tokens.Serializer',

  [
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Token) {
    var create = function(document) {
      var currentNode = document.createDocumentFragment();
      var initialNode = currentNode;

      var push = function(node) {
        append(node);
        currentNode = node;
      };

      var pop = function() {
        currentNode = currentNode.parentNode;
      };

      var append = function(node) {
        currentNode.appendChild(node);
      };

      var receive = function(token) {

        var startElement = function(token) {
          var node = token.getNode().cloneNode(false);
          push(node);
        };

        var text = function(token, serializer) {
          // IE7 will crash if you clone a text node that's a URL.
          // IE8 throws an invalid argument error.
          // So while cloning may be faster, we have to create a new node here.
          var node = document.createTextNode(token.text());
          append(node);
        };

        switch (token.type()) {
          case Token.START_ELEMENT_TYPE:
            startElement(token);
            break;
          case Token.TEXT_TYPE:
            text(token);
            break;
          case Token.END_ELEMENT_TYPE:
            pop();
            break;
          case Token.COMMENT_TYPE:
            // Ignore.
            break;
          default:
            throw { message: 'Unsupported token type: ' + token.type() };
        }
      };

      return {
        dom: initialNode,
        receive: receive
      };
    };

    return {
      create: create
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.data.tokens.Tokenizer',

  [
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Token) {
    var tokenize = function(html, document) {
      var container;
      document = document || window.document;
      container = document.createElement('div');
      document.body.appendChild(container);
      container.style.position = 'absolute';
      container.style.left = '-10000px';
      container.innerHTML = html;

      nextNode = container.firstChild || Token.FINISHED;

      var nodeStack = [];
      endNode = false;

      var getTokenForNode = function(node, endTag) {
        if (node === Token.FINISHED) {
          return node;
        } else if (node) {
          return Token.token(node, endTag);
        } else {
          return undefined;
        }
      };

      var next = function() {
        var currentNode = nextNode;
        var currentEndNode = endNode;
        if (!endNode && nextNode.firstChild) {
          nodeStack.push(nextNode);
          nextNode = nextNode.firstChild;
        } else if (!endNode && nextNode.nodeType === 1) {
          // Empty element.
          endNode = true;
        } else if (nextNode.nextSibling) {
          nextNode = nextNode.nextSibling;
          endNode = false;
        } else {
          nextNode = nodeStack.pop();
          endNode = true;
        }

        if (currentNode !== Token.FINISHED && !nextNode) {
          document.body.removeChild(container);
          nextNode = Token.FINISHED;
        }

        return getTokenForNode(currentNode, currentEndNode);
      };

      var hasNext = function() {
        return nextNode !== undefined;
      };

      return {
        hasNext: hasNext,
        next: next
      };
    };

    return {
      tokenize: tokenize
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.data.tokens.Filter',

  [
    'ephox.powerpaste.legacy.data.tokens.Token',
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Token, Util) {

    var createFilter = function(actualReceiver, clientReset) {
      var filter = function(nextFilter, settings, document) {
        var deferred;
        var receivedTokens, emittedTokens, inTransaction = false;

        var resetState = function() {
          if (clientReset) clientReset(api);
          inTransaction = false;
          receivedTokens = [];
          emittedTokens = [];
        };

        var emitTokens = function(tokens) {
          Util.each(tokens, function(tok) {
            nextFilter.receive(tok);
          });
        };

        var emit = function(token) {
          if (inTransaction) {
            emittedTokens.push(token);
          } else {
            nextFilter.receive(token);
          }
        };

        var receive = function(token) {
          if (clientReset) receivedTokens.push(token);
          actualReceiver(api, token);
          if (token === Token.FINISHED) {
            commit();
          }
        };

        var startTransaction = function() {
          inTransaction = true;
        };

        var rollback = function() {
          emitTokens(receivedTokens);
          resetState();
        };

        var commit = function() {
          emitDeferred();
          emitTokens(emittedTokens);
          resetState();
        };

        var defer = function(token) {
          deferred = deferred || [];
          deferred.push(token);
        };

        var hasDeferred = function() {
          return deferred && deferred.length > 0;
        };

        var emitDeferred = function() {
          Util.each(deferred, function(token) {
            emit(token);
          });
          dropDeferred();
        };

        var dropDeferred = function() {
          deferred = [];
        };

        var api = {
          document: document || window.document,
          settings: settings || {},
          emit: emit,
          receive: receive,
          startTransaction: startTransaction,
          rollback: rollback,
          commit: commit,
          defer: defer,
          hasDeferred: hasDeferred,
          emitDeferred: emitDeferred,
          dropDeferred: dropDeferred
        };

        resetState();
        return api;
      };
      return filter;
    };

    var createAttributeFilter = function(filter) {
      return createFilter(function(api, token) {
        token.filterAttributes(Util.bind(filter, api));
        api.emit(token);
      });
    };

    return {
      createFilter: createFilter,
      createAttributeFilter: createAttributeFilter
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.Text',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter',
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Filter, Token) {
    var lineBreakElements = /^(P|H[1-6]|T[DH]|LI|DIV|BLOCKQUOTE|PRE|ADDRESS|FIELDSET|DD|DT|CENTER)$/;
    var causesLinebreak = function(token) {
      return lineBreakElements.test(token.tag());
    };
    var removeFilter = function() {
      return null;
    };

    var inP = false;

    return Filter.createFilter(function(api, token) {
      var ensureInP = function() {
        if (!inP) {
          api.emit(Token.createStartElement('P', {}, {}, api.document));
          inP = true;
        }
      };
      switch (token.type()) {
        case Token.TEXT_TYPE:
          ensureInP();
          api.emit(token);
          break;
        case Token.END_ELEMENT_TYPE:
          if (inP && (causesLinebreak(token) || token === Token.FINISHED)) {
            api.emit(Token.createEndElement('P', api.document));
            inP = false;
          } else if (token.tag() === 'BR') {
            api.emit(token);
          }
          break;
        case Token.START_ELEMENT_TYPE:
          if (token.tag() === 'BR') {
            token.filterAttributes(removeFilter);
            token.filterStyles(removeFilter);
            api.emit(token);
          } else if (token.tag() === 'IMG' && token.getAttribute('alt')) {
            ensureInP();
            api.emit(Token.createText(token.getAttribute('alt'), api.document));
          }
          break;
      }
      if (token === Token.FINISHED) {
        api.emit(token);
      }
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.data.tokens.Helper',

  [
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Token) {
    var checkSupportsCustomStyles = function() {
      // Firefox 4 preserves these styles in the DOM, but strips them when pasting.
      // Since we can't trigger a paste there's no way to detect this situation apart from sniffing.
      if (navigator.userAgent.indexOf('Gecko') > 0 && navigator.userAgent.indexOf('WebKit') < 0) return false;
      var div = document.createElement('div');
      try {
        div.innerHTML = '<p style="mso-list: Ignore;">&nbsp;</p>';
      } catch (ex) {
        // Can't set innerHTML if we're in XHTML mode so just assume we don't get custom styles.
        return false;
      }
      return Token.token(div.firstChild).getStyle('mso-list') === 'Ignore';
    };

    var supportsCustomStyles = checkSupportsCustomStyles();

    var spanOrA = function(token) {
      return token.tag() === 'A' || token.tag() === 'SPAN';
    };

    var hasMsoListStyle = function(token) {
      var style = token.getStyle('mso-list');
      return style && style !== 'skip';
    };

    var hasNoAttributes = function(token, allowStyle) {
      if (token.type() === Token.START_ELEMENT_TYPE) {
        return token.getAttributeCount() === 0 ||
          (allowStyle && token.getAttributeCount() === 1 &&
            (token.getAttribute('style') !== null && token.getAttribute('style') !== undefined));
      } else {
        return token.type() === Token.END_ELEMENT_TYPE;
      }
    };

    return {
      hasNoAttributes: hasNoAttributes,
      supportsCustomStyles: supportsCustomStyles,
      spanOrA: spanOrA,
      hasMsoListStyle: hasMsoListStyle
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.list.ListTypes',

  [
    'ephox.powerpaste.legacy.data.tokens.Token',
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Token, Util) {
    var orderedListTypes = [
        { regex: /^\(?[dc][\.\)]$/, type: { tag: 'OL', type: 'lower-alpha' } },
        { regex: /^\(?[DC][\.\)]$/, type: { tag: 'OL', type: 'upper-alpha' } },
      { regex: /^\(?M*(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})[\.\)]$/, type: { tag: 'OL', type: 'upper-roman' } },
      { regex: /^\(?m*(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})[\.\)]$/, type: { tag: 'OL', type: 'lower-roman' } },
      { regex: /^\(?[0-9]+[\.\)]$/, type: { tag: 'OL' } },
      { regex: /^([0-9]+\.)*[0-9]+\.?$/, type: { tag: 'OL', variant: 'outline' } },
      { regex: /^\(?[a-z]+[\.\)]$/, type: { tag: 'OL', type: 'lower-alpha' } },
      { regex: /^\(?[A-Z]+[\.\)]$/, type: { tag: 'OL', type: 'upper-alpha' } }
    ];

    var ulChars = {
      '\u2022': { tag: 'UL', type: 'disc' },
      '\u00B7': { tag: 'UL', type: 'disc' },
      '\u00A7': { tag: 'UL', type: 'square' }
    };

    var ulNonSymbolChars = {
      'o': { tag: 'UL', type: 'circle' },
      '-': { tag: 'UL', type: 'disc' },
      '\u25CF': { tag: 'UL', type: 'disc' }
    };

    var createVariant = function(type, variant) {
      var newType = { tag: type.tag, type: type.type, variant: variant };
      if (type.start){
        newType.start = type.start;
      }
      if (!type.type) delete newType.type;
      return newType;
    };

    var guessListType = function(bulletInfo, preferredType, originalToken) {
      var listType = null, text, symbolFont, variant;
      if (bulletInfo) {
        text = bulletInfo.text;
        symbolFont = bulletInfo.symbolFont;
      }
      text = Util.trim(text);

      listType = ulNonSymbolChars[text];
      if (!listType) {
        if (symbolFont) {
          listType = ulChars[text];
          if (!listType) {
            listType = { tag: 'UL', variant: text };
          } else {
            listType = createVariant(listType, text);
          }
        } else {

          Util.each(orderedListTypes, function(def) {
            if (def.regex.test(text)) {
              if (preferredType && eqListType(def.type, preferredType, true)) {
                listType = def.type;
                listType.start=parseInt(text);
                return false;
              }
              if (!listType) listType = def.type;
              listType.start=parseInt(text);
            }
          });
          if (listType && !listType.variant) {
            if (text.charAt(0) === '(') variant = '()';
            else if (text.charAt(text.length - 1) === ')') variant = ')';
            else variant = '.';
            listType = createVariant(listType, variant);
          }
        }
      } else {
        listType = createVariant(listType, text);
      }

      if (listType && listType.tag === 'OL' &&
          originalToken && (originalToken.tag() !== 'P' || /^MsoHeading/.test(originalToken.getAttribute('class')))) {
        // Don't convert numbered headings but do convert bulleted headings.
        listType = null;
      }

      return listType;
    };

    var eqListType = function(t1, t2, ignoreVariant) {
      return t1 === t2 ||
        (t1 && t2 && t1.tag === t2.tag && t1.type === t2.type &&
            (ignoreVariant || t1.variant === t2.variant));
    };

    var checkFont = function(token, symbolFont) {
      if (token.type() == Token.START_ELEMENT_TYPE) {
        font = token.getStyle('font-family');
        if (font) {
          symbolFont = (font === 'Wingdings' || font === 'Symbol');
        } else if (/^(P|H[1-6]|DIV)$/.test(token.tag())) {
          symbolFont = false;
        }
      }
      return symbolFont;
    };

    return {
      guessListType: guessListType,
      eqListType: eqListType,
      checkFont: checkFont
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.list.CommentHeuristics',

  [
    'ephox.powerpaste.legacy.data.tokens.Token',
    'ephox.powerpaste.legacy.filters.list.ListTypes',
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Token, ListTypes, Util) {
    var isListWithoutCommentsOrStyles = function(token, state) {
      var indent, cls, node, symbolFont = false, value, listType;
      var checkFont = function(n) {
        var font = n.style.fontFamily;
        if (font) {
          symbolFont = (font === 'Wingdings' || font === 'Symbol');
        }
      };
      if (token.type() === Token.START_ELEMENT_TYPE && state.openedTag && token.tag() === 'SPAN') {
        node = state.openedTag.getNode();
        checkFont(node);
        if (node.childNodes.length > 1 && node.firstChild.tagName === 'A' && node.firstChild.textContent === '') {
          node = node.childNodes[1];
        }
        while (node.firstChild && (node.firstChild.tagName === 'SPAN' || node.firstChild.tagName === 'A')) {
          node = node.firstChild;
          checkFont(node);
        }
        node = node.firstChild;
        if (node && node.nodeType === 3) {
          value = node.value;
          if (!Util.trim(value)) {
            // This handles the case where there's a SPAN with nbsps before the bullet such as with roman numerals.
            node = node.parentNode.nextSibling;
            value = node ? node.value : '';
          }
          // Real lists have the bullet with NBSPs either side surrounded in a SPAN.  If there's anything else, it's not a list.
          if (!node || Util.trim(node.parentNode.textContent) != value) {
            return false;
          }
          listType = ListTypes.guessListType({ text: value, symbolFont: symbolFont }, null, state.originalToken);
          if (listType) {
            // Don't convert numbered headings to lists.
            return node.nextSibling && node.nextSibling.tagName === 'SPAN' && /^[\u00A0\s]/.test(node.nextSibling.firstChild.value) &&
                (state.openedTag.tag() === 'P' || listType.tag === 'UL');
          }
        } else {
          return node && node.tagName === 'IMG';
        }
      }
      return false;
    };


    var getLeftOffset = function(node, paragraph) {
      var parent, child, offset = 0;
      parent = node.parentNode;
      while (parent !== null && parent !== undefined && parent !== paragraph.parentNode) {
        offset += parent.offsetLeft;
        parent = parent.offsetParent;
      }
      return offset;
    };

    /** A simplified memoize function which only supports one or two function parameters.
     *
     * @param fn
     * @param param the funtion p
     * @returns
     */
    var memoize2 = function(fn) {
      var cache = {};
      return function(param1, param2) {
        var result, key = param1 + "," + param2;
        if (cache.hasOwnProperty(key)) {
          return cache[key];
        }
        result = fn.call(null, param1, param2);
        cache[key] = result;
        return result;
      };
    };

    var findStylesInner = function(selector) {
          var dotIndex = selector.indexOf('.');
          if (dotIndex >= 0 && Util.trim(selector.substring(dotIndex + 1)) === className) {
            match = results[2];
            return false;
          }
        };

    var findStyles = memoize2(function(css, className) {
      var results, matcher = /([^{]+){([^}]+)}/g, match, el, computedStyle;
      matcher.lastIndex = 0; // Firefox Mac reuses the same regex so we need to reset it.
      while ((results = matcher.exec(css)) !== null && !match) {
        Util.each(results[1].split(','), findStylesInner(selector)
        );
      }
      if (match) {
        el = document.createElement('p');
        el.setAttribute("style", match);
        computedStyle = Util.ephoxGetComputedStyle(el);
        return computedStyle ? "" + computedStyle.marginLeft : false;
      }
      return false;
    });

    var indentGuesser = function() {
      var listIndentAdjust;
      var listIndentAmount;
      var guessIndentLevel = function(currentToken, token, styles, bulletInfo) {
        var indentAmount, itemIndent, el, level = 1;

        if (bulletInfo && /^([0-9]+\.)+[0-9]+\.?$/.test(bulletInfo.text)) {
          // Outline list type so we can just count the number of sections.
          return bulletInfo.text.replace(/([0-9]+|\.$)/g, '').length + 1;
        }
        indentAmount = listIndentAmount || parseInt(findStyles(styles, token.getAttribute('class')));

        itemIndent = getLeftOffset(currentToken.getNode(), token.getNode());
        if (!indentAmount) {
          indentAmount = 48;
        } else {
          // We might get a 0 item indent if the list CSS code wasn't pasted as happens on Windows.
          if (listIndentAdjust) {
            itemIndent += listIndentAdjust;
          } else if (itemIndent === 0) {
            listIndentAdjust = indentAmount;
            itemIndent += indentAmount;
          }
        }
        listIndentAmount = indentAmount = Math.min(itemIndent, indentAmount);
        level = Math.max(1, Math.floor(itemIndent / indentAmount)) || 1;
        return level;
      };
      return {
        guessIndentLevel: guessIndentLevel
      };
    };

    var styles = function() {
      var inStyle = false;
      var styles = "";
      var check = function(token) {
        if (inStyle && token.type() === Token.TEXT_TYPE) {
          styles += token.text();
          return true;
        } else if (token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'STYLE') {
          inStyle = true;
          return true;
        } else if (token.type() === Token.END_ELEMENT_TYPE && token.tag() === 'STYLE') {
          inStyle = false;
          return true;
        }
        return false;
      };
      return {
        check: check
      };
    };

    return {
      isListWithoutCommentsOrStyles: isListWithoutCommentsOrStyles,
      indentGuesser: indentGuesser,
      styles: styles
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.list.Emitter',

  [
    'ephox.powerpaste.legacy.data.tokens.Token',
    'ephox.powerpaste.legacy.filters.list.ListTypes'
  ],

  function (Token, ListTypes) {
    var impliedULatLevel = [ 'disc', 'circle', 'square' ];

    var removeImpliedListType = function(type, level) {
      if (type.tag === 'UL') {
        if (impliedULatLevel[level - 1] === type.type) {
          type = { tag: 'UL' };
        }
      }
      return type;
    };

    return function(api, document) {
      var listTypes = [];
      var itemTags = [];
      var currentLevel = 0;
      var currentListType;

      var openList = function(type, useType) {
        var style = {}, attributes={};
        currentLevel++;
        if (useType) {
          if (type.type) {
            style = { 'list-style-type': type.type };
          }
        }
        if (type.start && type.start>1) {
          attributes={start:type.start};
        }
        listTypes.push(type);
        api.emit(Token.createStartElement(type.tag, attributes, style, document));
        currentListType = type;
      };

      var closeList = function() {
        api.emit(Token.createEndElement(listTypes.pop().tag, document));
        currentLevel--;
        currentListType = listTypes[listTypes.length - 1];
      };

      var closeAllLists = function() {
        while (currentLevel > 0) {
          closeItem();
          closeList();
        }
        api.commit();
      };

      var closeItem = function() {
        var tag = itemTags ? itemTags.pop() : 'P';
        if (tag != 'P') {
          api.emit(Token.createEndElement(tag, document));
        }
        api.emit(Token.createEndElement('LI', document));
      };

      var openLI = function(paragraphToken, type, skippedPara) {
        var style = {};
        if (!paragraphToken) {
          style['list-style-type'] = 'none';
        } else {
          var leftMargin = paragraphToken.getStyle('margin-left');
          if (leftMargin !== undefined) {
            style['margin-left'] = leftMargin;
          }
        }
        if (currentListType && !ListTypes.eqListType(currentListType, type)) {
          closeList();
          if (skippedPara) {
            api.emit(Token.createStartElement('P', {}, {}, document));
            api.emit(Token.createText('\u00A0', document));
            api.emit(Token.createEndElement('P', document));
          }
          openList(type, true);
        }
        api.emit(Token.createStartElement('LI', {}, style, document));
        if (paragraphToken && paragraphToken.tag() != 'P') {
          itemTags.push(paragraphToken.tag());
          paragraphToken.filterStyles(function() { return null; });
          api.emit(paragraphToken);
        } else {
          itemTags.push('P');
        }
      };

      var openItem = function(level, paragraphToken, type, skippedPara) {
        var style = {}, token;
        if (!type) return;
        if (!currentLevel) currentLevel = 0;
        while (currentLevel > level) {
          closeItem();
          closeList();
        }
        type = removeImpliedListType(type, level);
        if (currentLevel == level) {
          closeItem();
          openLI(paragraphToken, type, skippedPara);
        } else {
          // If there's a heading item we opened in the list we need to close it before creating the indented list
          if (level > 1 && itemTags.length > 0 && itemTags[itemTags.length - 1] !== 'P') {
            api.emit(Token.createEndElement(itemTags[itemTags.length - 1], document));
            itemTags[itemTags.length - 1] = 'P';
          }
          while (currentLevel < level) {
            openList(type, currentLevel == level - 1);
            openLI(currentLevel == level ? paragraphToken : undefined, type);
          }
        }
      };
      var getCurrentLevel = function() {
        return currentLevel;
      };
      var getCurrentListType = function() {
        return currentListType;
      };
      return {
        openList: openList,
        closelist: closeList,
        closeAllLists: closeAllLists,
        closeItem: closeItem,
        openLI: openLI,
        openItem: openItem,
        getCurrentListType: getCurrentListType,
        getCurrentLevel: getCurrentLevel
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.list.ListStates',

  [
    'ephox.powerpaste.legacy.data.tokens.Helper',
    'ephox.powerpaste.legacy.data.tokens.Token',
    'ephox.powerpaste.legacy.filters.list.CommentHeuristics',
    'ephox.powerpaste.legacy.filters.list.ListTypes',
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Helper, Token, CommentHeuristics, ListTypes, Util) {
    var unexpectedToken = function(api, token) {
      Util.log("Unexpected token in list conversion: " + token.toString());
      api.rollback();
    };

    var preferredListType = function(currentType, currentLevel, newLevel) {
      if (currentLevel == newLevel) {
        return currentType;
      }
      return null;
    };

    var afterListState = function(api, state, token) {
      if (token.type() === Token.TEXT_TYPE && Util.trim(token.text()) === '') {
        // Drop whitespace that's potentially between list items.
        api.defer(token);
      } else if (!state.skippedPara && token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'P' && !Helper.hasMsoListStyle(token)) {
        state.openedTag = token;
        api.defer(token);
        state.nextFilter = skipEmptyParaState;
      } else {
        noListState(api, state, token);
      }
    };

    var skipEmptyParaState = function(api, state, token) {
      if (token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'SPAN' && state.spanCount.length === 0 &&
          (Helper.supportsCustomStyles || !CommentHeuristics.isListWithoutCommentsOrStyles(token, state)) && !Helper.hasMsoListStyle(token)) {
        api.defer(token);
        state.spanCount.push(token);
      } else if (token.type() === Token.END_ELEMENT_TYPE) {
        if (token.tag() === 'SPAN') {
          api.defer(token);
          state.spanCount.pop();
        } else if (token.tag() === 'P') {
          api.defer(token);
          state.skippedPara = true;
          state.openedTag = null;
          state.nextFilter = afterListState;
        } else {
          // Not an empty paragraph.
          state.nextFilter = noListState;
          state.nextFilter(api, state, token);
        }
      } else if (token.isWhitespace()) {
        api.defer(token);
      } else {
        state.nextFilter = noListState;
        state.nextFilter(api, state, token);
      }
    };

    var msoListSkipState = function(api, state, token) {
      if (token.type() === Token.END_ELEMENT_TYPE && token.tag() === state.originalToken.tag()) {
        state.nextFilter = afterListState;
      } else if (token === Token.FINISHED) {
        state.emitter.closeAllLists();
        api.emit(token);
      }
      // Else drop.
    };

    var noListState = function(api, state, token) {
      var closeOutLists = function() {
        state.emitter.closeAllLists();
        api.emitDeferred();
        state.openedTag = null;
        api.emit(token);
        state.nextFilter = noListState;
      };
      if (token.type() === Token.START_ELEMENT_TYPE && Helper.hasMsoListStyle(token) && token.tag() !== 'LI') {
        var msoList = token.getStyle('mso-list');
        if (false && msoList === 'skip') {
          state.nextFilter = msoListSkipState;
          state.originalToken = token;
        } else {
          var lvl = / level([0-9]+)/.exec(token.getStyle('mso-list'));

          if (lvl && lvl[1]) {
            state.itemLevel = parseInt(lvl[1], 10) + state.styleLevelAdjust;
            // Tokens between lists should be dropped (they're just whitespace anyway)
            // however, tokens before a list should be emitted if we find an mso-list style
            // since this is the very first token of the list.
            if (state.nextFilter === noListState) {
              api.emitDeferred();
            } else {
              api.dropDeferred();
            }
            state.nextFilter = listStartState;
            api.startTransaction();
            state.originalToken = token;
            state.commentMode = false;
          } else {
            closeOutLists();
          }
        }
      } else if (!Helper.supportsCustomStyles &&
          ((token.type() === Token.COMMENT_TYPE && token.text() === '[if !supportLists]') ||
          (CommentHeuristics.isListWithoutCommentsOrStyles(token, api)))) {
        if (token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'SPAN') {
          state.spanCount.push(token);
        }
        state.nextFilter = listStartState;
        api.startTransaction();
        state.originalToken = state.openedTag;
        state.commentMode = true;
        state.openedTag = null;
        api.dropDeferred();
      } else if (token.type() === Token.END_ELEMENT_TYPE && Helper.spanOrA(token)) {
        api.defer(token);
        state.spanCount.pop();
      } else if (token.type() === Token.START_ELEMENT_TYPE) {
        // Might be the start of an item, store it and see if we get a comment next.
        if (Helper.spanOrA(token)) {
          api.defer(token);
          state.spanCount.push(token);
        } else {
          if (state.openedTag) {
            state.emitter.closeAllLists();
            api.emitDeferred();
          }
          state.openedTag = token;
          api.defer(token);
        }
      } else {
        closeOutLists();
      }
    };

    var afterNoBulletListState = function(api, state, token) {
      if (token.type() === Token.END_ELEMENT_TYPE && state.originalToken.tag() === token.tag()) {
        state.nextFilter = afterListState;
        state.styleLevelAdjust = -1;
      }
      api.emit(token);
    };

    var listStartState = function(api, state, token) {
      if (token.type() == Token.START_ELEMENT_TYPE && token.getStyle('mso-list') === 'Ignore') {
        state.nextFilter = findListTypeState;
      } if (token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'SPAN') {
        state.spanCount.push(token);
        if (state.commentMode && token.getAttribute("style") === "" || token.getAttribute("style") === null) {
          state.nextFilter = findListTypeState;
        }
        // Otherwise drop.
      } else if (token.tag() === 'A') {
        if (token.type() === Token.START_ELEMENT_TYPE) {
          state.spanCount.push(token);
        } else {
          state.spanCount.pop();
        }
      } else if (token.type() === Token.TEXT_TYPE) {
        if (state.commentMode) {
          state.nextFilter = findListTypeState;
          state.nextFilter(api, state, token);
        } else {
          // List type without a bullet, we should treat it as a paragraph.
          var start = state.originalToken;
          var spans = state.spanCount;
          state.emitter.closeAllLists();
          api.emit(start);
          Util.each(spans, Util.bind(api.emit, api));
          api.emit(token);
          api.commit();
          state.originalToken = start;
          state.nextFilter = afterNoBulletListState;
        }
      } else if (!state.commentMode && token.type() === Token.COMMENT_TYPE) {
        // Drop. We seem to be getting custom styles and comments.
      } else {
        unexpectedToken(api, token);
      }
    };

    var findListTypeState = function(api, state, token) {
      if (token.type() === Token.TEXT_TYPE) {
        if (token.isWhitespace()) {
          // Ignore whitespace node, it's padding before the actual list type.
        } else {
          state.nextFilter = beforeSpacerState;
          state.bulletInfo = { text: token.text(), symbolFont: state.symbolFont };
        }
      } else if (Helper.spanOrA(token)) {
        // Drop open and close span tags.
        if (token.type() === Token.START_ELEMENT_TYPE) {
          state.spanCount.push(token);
        } else {
          state.spanCount.pop();
        }
      } else if (token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'IMG') {
        // Custom list image type.  We can't access the image so use a normal bullet instead.
        // EditLive! may want this to come through as a CSS reference.
        state.nextFilter = beforeSpacerState;
        state.bulletInfo = { text: '\u2202', symbolFont: true };
      } else {
        unexpectedToken(api, token);
      }
    };

    var beforeSpacerState = function(api, state, token) {
      if (token.type() === Token.START_ELEMENT_TYPE && Helper.spanOrA(token)) {
        state.spanCount.push(token);
        state.nextFilter = spacerState;
      } else if (token.type() === Token.END_ELEMENT_TYPE && Helper.spanOrA(token)) {
        state.spanCount.pop();
        state.nextFilter = closeSpansState;
      } else if (token.type() === Token.END_ELEMENT_TYPE && token.tag() === 'IMG') {
        // Drop
      } else {
        unexpectedToken(api, token);
      }
    };

    var spacerState = function(api, state, token) {
      if (token.type() === Token.END_ELEMENT_TYPE) {
        if (Helper.spanOrA(token)) {
          state.spanCount.pop();
        }
        state.nextFilter = closeSpansState;
      }
      // Drop all other tokens.
    };

    var closeSpansState = function(api, state, token) {
      var moveToItemContentState = function(includeToken) {
        state.nextFilter = itemContentState;
        if (state.commentMode) state.itemLevel = state.indentGuesser.guessIndentLevel(token, state.originalToken, state.styles.styles, state.bulletInfo);
        state.listType = ListTypes.guessListType(state.bulletInfo, preferredListType(state.emitter.getCurrentListType(), state.emitter.getCurrentLevel(), state.itemLevel), state.originalToken);
        if (state.listType) {
          state.emitter.openItem(state.itemLevel, state.originalToken, state.listType, state.skippedPara);
          api.emitDeferred();
          while (state.spanCount.length > 0) {
            api.emit(state.spanCount.shift());
          }
          if (includeToken) {
            api.emit(token);
          }
        } else {
          Util.log("Unknown list type: "  + state.bulletInfo.text + " Symbol font? " + state.bulletInfo.symbolFont);
          api.rollback();
        }
      };

      if (token.type() === Token.TEXT_TYPE || token.type() === Token.START_ELEMENT_TYPE) {
        moveToItemContentState(true);
      } else if (token.type() === Token.COMMENT_TYPE) {
        moveToItemContentState(token.text() !== '[endif]');
      } else if (token.type() === Token.END_ELEMENT_TYPE) {
        if (Helper.spanOrA(token)) {
          state.spanCount.pop();
        }
      } else {
        unexpectedToken(api, token);
      }
    };

    var itemContentState = function(api, state, token) {
      if (token.type() === Token.END_ELEMENT_TYPE && token.tag() === state.originalToken.tag()) {
        state.nextFilter = afterListState;
        state.skippedPara = false;
      } else {
        api.emit(token);
      }
    };

    var initial = noListState;
    return {
      initial: initial
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.list.Lists',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter',
    'ephox.powerpaste.legacy.data.tokens.Helper',
    'ephox.powerpaste.legacy.data.tokens.Token',
    'ephox.powerpaste.legacy.filters.list.CommentHeuristics',
    'ephox.powerpaste.legacy.filters.list.Emitter',
    'ephox.powerpaste.legacy.filters.list.ListStates',
    'ephox.powerpaste.legacy.filters.list.ListTypes',
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Filter, Helper, Token, CommentHeuristics, Emitter, ListStates, ListTypes, Util) {

    var activeState = {};

    var resetActiveState = function(api) {
      //It would be nice if this was creating a fresh object, but listStartState() expects state mutation when api.commit() is called
      activeState.nextFilter = ListStates.initial;
      activeState.itemLevel = 0;
      activeState.originalToken = null;
      activeState.commentMode = false;
      activeState.openedTag = null;
      activeState.symbolFont = false;
      activeState.listType = null;
      activeState.indentGuesser = CommentHeuristics.indentGuesser();
      activeState.emitter = Emitter(api, api.document);
      activeState.styles = CommentHeuristics.styles();
      activeState.spanCount = [];
      activeState.skippedPara = false;
      activeState.styleLevelAdjust = 0;
      activeState.bulletInfo = undefined;
    };

    resetActiveState({});

    var resetState = function(api) {
      resetActiveState(api);
    };

    var receive = function(api, token) {
      if (activeState.styles.check(token)) {
        return;
      }
      activeState.symbolFont = ListTypes.checkFont(token, activeState.symbolFont);
      activeState.nextFilter(api, activeState, token);
    };

    return Filter.createFilter(receive, resetState);
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
/**
 * Source code in this file has been taken under a commercial license from tinymce/jscripts/tiny_mce/plugins/paste/editor_plugin_src.js
 * Copyright 2009, Moxiecode Systems AB
 */
define(
  'ephox.powerpaste.legacy.tinymce.BrowserFilters',

  [
    'ephox.powerpaste.legacy.tinymce.Util'
  ],

  function (Util) {
    var trailingSpaceCharacter = function(content) {
      var h = content;
      // Strip a trailing non-breaking, zero-width space which Firefox tends to insert.
      var hasCrazySpace = h.charCodeAt(h.length - 1) === 65279;
      return hasCrazySpace ?
        h.substring(0, h.length - 1) :
        content;
    };

    // IE9 adds BRs before/after block elements when contents is pasted from word or for example another browser
    var removeBrNextToBlock = function(content) {
      return (/<(h[1-6r]|p|div|address|pre|form|table|tbody|thead|tfoot|th|tr|td|li|ol|ul|caption|blockquote|center|dl|dt|dd|dir|fieldset)/).test(content) ?
        content.replace(/(?:<br>&nbsp;[\s\r\n]+|<br>)*(<\/?(h[1-6r]|p|div|address|pre|form|table|tbody|thead|tfoot|th|tr|td|li|ol|ul|caption|blockquote|center|dl|dt|dd|dir|fieldset)[^>]*>)(?:<br>&nbsp;[\s\r\n]+|<br>)*/g, '$1') :
        content;
    };

    // Replace multiple BR elements with uppercase BR to keep them intact when collapseBr runs
    var capitaliseMultipleBr = function(content) {
      return content.replace(/<br><br>/g, '<BR><BR>');
    };

    // Replace single br elements with space since they are word wrapping
    var removeSingleBr = function(content) {
      return content.replace(/<br>/g, ' ');
    };

    // Collapse double brs into a single BR
    var collapseBr = function(content) {
      return content.replace(/<BR><BR>/g, '<br>');
    };

    var baseFilters = [trailingSpaceCharacter];

    var filters = (tinymce.isIE && document.documentMode >= 9) ?
       [collapseBr, removeSingleBr, capitaliseMultipleBr, removeBrNextToBlock].concat(baseFilters) :
       baseFilters;

    var allFilters = Util.compose(filters);

    return {
      all: allFilters,
      textOnly: trailingSpaceCharacter
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.FilterInlineStyles',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    var removeStyles = /^(mso-.*|tab-stops|tab-interval|language|text-underline|text-effect|text-line-through|font-color|horiz-align|list-image-[0-9]+|separator-image|table-border-color-(dark|light)|vert-align|vnd\..*)$/;

    var filterFunction = function(styleFilter) {
      return function(name, value) {
        var preserve = false;
        switch (styleFilter) {
          case 'all':
          case '*':
            preserve = true;
            break;
          case 'valid':
            preserve = !removeStyles.test(name);
            break;
          case undefined:
          case 'none':
            preserve = name === 'list-style-type';
            break;
          default:
            preserve = (',' + styleFilter + ',').indexOf(',' + name + ',') >= 0;
            break;
        }
        return preserve ? value : null;
      };
    };

    return Filter.createFilter(function(api, token) {
      var styleFilter = api.settings.get('retain_style_properties');
      token.filterStyles(filterFunction(styleFilter));
      api.emit(token);
    });

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.InferListTags',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter',
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Filter, Token) {
    return Filter.createFilter(function(api, token) {
      if (api.seenList) {
        // As soon as we see a UL or OL tag we know we're getting complete lists.
        api.emit(token);
      } else if (api.inferring) {
        if (token.tag() === 'LI') {
          if (token.type() === Token.START_ELEMENT_TYPE) {
            api.inferring++;
          } else {
            api.inferring--;
            if (!api.inferring) {
              api.needsClosing = true;
            }
          }
        }
        api.emit(token);
      } else {
        if (token.tag() === 'OL' || token.tag() === 'UL') {
          api.seenList = true;
        } else if (token.tag() === 'LI') {
          api.inferring = 1;
          if (!api.needsClosing) {
            api.emit(Token.createStartElement('UL', {}, {}, api.document));
          }
        }
        if (api.needsClosing && !api.inferring && !token.isWhitespace()) {
          api.needsClosing = false;
          api.emit(Token.createEndElement('UL', api.document));
        }
        api.emit(token);
      }
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripBookmarks',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createAttributeFilter(function(name, value) {
      if (name === 'name' || name === 'id') {
        return null;
      }
      return value;
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripClassAttributes',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createAttributeFilter(function(name, value) {
      var classFilter;
      if (name === 'class') {
        classFilter = this.settings.get('strip_class_attributes');
        switch (classFilter) {
          case 'mso':
            return value.indexOf('Mso') === 0 ? null : value;
          case 'none':
            return value;
          default:
            return null;
        }
      }
      return value;
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripEmptyInlineElements',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter',
    'ephox.powerpaste.legacy.data.tokens.Helper',
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Filter, Helper, Token) {
    var deferred = [];
    var open = [];
    var hasContent = false;

    var removeMatchingSpan = function(len, pos) {
      var j, token, opened = 1;
      for (j = pos + 1; j < len; j++) {
        token = deferred[j];
        if (token && token.tag() === 'SPAN') {
          if (token.type() === Token.START_ELEMENT_TYPE) {
            opened++;
          } else if (token.type() === Token.END_ELEMENT_TYPE) {
            opened--;
            if (opened === 0) {
              // Save reallocating a shorter array, just null it out.
              deferred[j] = null;
              return;
            }
          }
        }
      }
    };

    var flushDeferred = function(api) {
      if (hasContent) {
        var tok, len = deferred.length, i;
        for (i = 0; i < len; i++) {
          tok = deferred[i];
          if (!tok) continue;
          if (tok.type() === Token.START_ELEMENT_TYPE && tok.tag() === 'SPAN' && Helper.hasNoAttributes(tok)) {
            // Omit token and find the last end span and remove it too.
            removeMatchingSpan(len, i);
          } else {
            api.emit(tok);
          }
        }
      }
      deferred = [];
      open = [];
      hasContent = false;
    };

    var internalDefer = function(api, token) {
      deferred.push(token);
      open = open || [];
      if (token.type() === Token.START_ELEMENT_TYPE) {
        open.push(token);
      } else if (token.type() === Token.END_ELEMENT_TYPE) {
        open.pop();
        if (open.length === 0) {
          // Didn't find anything to keep so dump everything.
          flushDeferred(api, token);
          return;
        }
      }
    };

    return Filter.createFilter(function(api, token) {
      var inlineTags = ',FONT,EM,STRONG,SAMP,ACRONYM,CITE,CODE,DFN,KBD,TT,B,I,U,S,SUB,SUP,INS,DEL,VAR,SPAN,';

      deferred = deferred || [];

      var alwaysKeep = function(token) {
        return !(inlineTags.indexOf(',' + token.tag() + ',') >= 0 && Helper.hasNoAttributes(token, true));
      };

      if (deferred.length === 0) {
        if (token.type() === Token.START_ELEMENT_TYPE) {
          if (alwaysKeep(token)) {
            api.emit(token);
          } else {
            internalDefer(api, token);
          }
        } else {
          api.emit(token);
        }
      } else {
        if (!hasContent) hasContent = alwaysKeep(token);
        internalDefer(api, token);
      }
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripEmptyStyleAttributes',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createAttributeFilter(function(name, value) {
      if (name === 'style' && value === '') {
        return null;
      }
      return value;
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripLangAttribute',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createAttributeFilter(function(name, value) {
      return name === 'lang' ? null : value;
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
'ephox.powerpaste.legacy.filters.StripImages',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter',
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Filter, Token) {
    return Filter.createFilter(function(api, token) {
      if (token.tag() === 'IMG') {
        if (token.type() === Token.END_ELEMENT_TYPE && api.skipEnd) {
          api.skipEnd = false;
          return;
        } else if (token.type() === Token.START_ELEMENT_TYPE) {
          if (/^file:/.test(token.getAttribute('src'))) {
            api.skipEnd = true;
            return;
          } else if (api.settings.get('base_64_images') && /^data:image\/.*;base64/.test(token.getAttribute('src'))) {
            api.skipEnd = true;
            return;
          }
        }
      }
      api.emit(token);
    });
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripMetaAndLinkElements',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createFilter(function(api, token) {
      if (token.tag() !== 'META' && token.tag() !== 'LINK') {
        api.emit(token);
      }
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripNoAttributeA',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter',
    'ephox.powerpaste.legacy.data.tokens.Helper',
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Filter, Helper, Token) {
    var keepA = function(token) {
      return !Helper.hasNoAttributes(token) && !/^OLE_LINK/.test(token.getAttribute('name'));
    };

    var stack = [];

    return Filter.createFilter(function(api, token) {
      var open;
      if (token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'A') {
        stack.push(token);
        if (keepA(token)) {
          api.defer(token);
        }
      } else if (token.type() === Token.END_ELEMENT_TYPE && token.tag() === 'A') {
        open = stack.pop();
        if (keepA(open)) {
          api.defer(token);
        }
        if (stack.length === 0) {
          api.emitDeferred();
        }
      } else if (api.hasDeferred()) {
        api.defer(token);
      } else {
        api.emit(token);
      }
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripScripts',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter',
    'ephox.powerpaste.legacy.data.tokens.Token'
  ],

  function (Filter, Token) {
    var script = false;
    return Filter.createFilter(function(api, token) {
      if (token.tag() === 'SCRIPT') {
        script = token.type() === Token.START_ELEMENT_TYPE;
      } else if (!script) {
        token.filterAttributes(function(name, value) {
          if (/^on/.test(name) || name === 'language') return null;
          return value;
        });
        api.emit(token);
      }
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.wordimport.CommonFilters',

  [
    'ephox.powerpaste.legacy.filters.FilterInlineStyles',
    'ephox.powerpaste.legacy.filters.InferListTags',
    'ephox.powerpaste.legacy.filters.StripBookmarks',
    'ephox.powerpaste.legacy.filters.StripClassAttributes',
    'ephox.powerpaste.legacy.filters.StripEmptyInlineElements',
    'ephox.powerpaste.legacy.filters.StripEmptyStyleAttributes',
    'ephox.powerpaste.legacy.filters.StripLangAttribute',
    'ephox.powerpaste.legacy.filters.StripImages',
    'ephox.powerpaste.legacy.filters.StripMetaAndLinkElements',
    'ephox.powerpaste.legacy.filters.StripNoAttributeA',
    'ephox.powerpaste.legacy.filters.StripScripts'
  ],

  function (FilterInlineStyles, InferListTags, StripBookmarks, StripClassAttributes, StripEmptyInlineElements, StripEmptyStyleAttributes, StripLangAttribute, StripImages, StripMetaAndLinkElements, StripNoAttributeA, StripScripts) {
    return [
      StripScripts,
      StripBookmarks,
      StripImages,
      FilterInlineStyles,
      StripLangAttribute,
      StripEmptyStyleAttributes,
      StripClassAttributes,
      StripNoAttributeA,
      StripEmptyInlineElements,
      StripMetaAndLinkElements,
      InferListTags
    ];
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripFormattingAttributes',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createFilter(function(api, token) {
      token.filterAttributes(function(name, value) {
        if (name === 'align') return null;
        if ((token.tag() === 'UL' || token.tag() === 'OL') &&
            name === 'type') return null;
        return value;
      });
      api.emit(token);
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripNamespaceDeclarations',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createAttributeFilter(function(name, value) {
      if (/^xmlns(:|$)/.test(name)) {
        return null;
      }
      return value;
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripOPTags',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createFilter(function(api, token) {
      if (!token.tag || !/^([OVWXP]|U[0-9]+|ST[0-9]+):/.test(token.tag())) {
        api.emit(token);
      }
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripTocLinks',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createAttributeFilter(function(name, value) {
      if (name === 'href' && (value.indexOf('#_Toc') >= 0 || value.indexOf('#_mso') >= 0)) {
        return null;
      }
      return value;
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.filters.StripVMLAttributes',

  [
    'ephox.powerpaste.legacy.data.tokens.Filter'
  ],

  function (Filter) {
    return Filter.createAttributeFilter(function(name, value) {
      if (/^v:/.test(name)) {
        return null;
      }
      return value;
    });
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.wordimport.WordOnlyFilters',

  [
    'ephox.powerpaste.legacy.filters.StripFormattingAttributes',
    'ephox.powerpaste.legacy.filters.StripNamespaceDeclarations',
    'ephox.powerpaste.legacy.filters.StripOPTags',
    'ephox.powerpaste.legacy.filters.StripTocLinks',
    'ephox.powerpaste.legacy.filters.StripVMLAttributes',
    'ephox.powerpaste.legacy.filters.list.Lists'
  ],

  function (StripFormattingAttributes, StripNamespaceDeclarations, StripOPTags, StripTocLinks, StripVMLAttributes, Lists) {
    return  [
      StripOPTags,
      Lists,
      StripTocLinks,
      StripVMLAttributes,
      StripNamespaceDeclarations,
      StripFormattingAttributes
    ];
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.legacy.wordimport.WordImport',

  [
    'ephox.powerpaste.legacy.data.tokens.Serializer',
    'ephox.powerpaste.legacy.data.tokens.Tokenizer',
    'ephox.powerpaste.legacy.filters.Text',
    'ephox.powerpaste.legacy.filters.list.Lists',
    'ephox.powerpaste.legacy.tinymce.BrowserFilters',
    'ephox.powerpaste.legacy.wordimport.CommonFilters',
    'ephox.powerpaste.legacy.wordimport.WordOnlyFilters'
  ],

  function (Serializer, Tokenizer, Text, Lists, BrowserFilters, CommonFilters, WordOnlyFilters) {
    var buildPipeline = function(filters, sink, settings, document) {
      var i, filter = sink;
      for (i = filters.length - 1; i >= 0; i--) {
        //This is calling the function defined by Filter.createFilter().
        //The best description I can come up with is "function composition using CPS".
        //Filters are run in reverse order to the loop, which is reversed so the arrays below define the order.
        //And then the sink comes last (which means it's injected on the first pass of the loop).
        filter = filters[i](filter, settings, document);
      }
      return filter;
    };

    var runPipeline = function(content, settings, document, requiredFilters) {
      var serializer = Serializer.create(document);
      var tokenizer = Tokenizer.tokenize(content, document);
      pipeline = buildPipeline(requiredFilters, serializer, settings, document);
      while (tokenizer.hasNext()) {
        pipeline.receive(tokenizer.next());
      }
      return serializer.dom;
    };

    /**
     * Accepts a string of content to filter and returns a filtered DOM structure.
     *
     * @param inputContent the content to filter
     * @param settings the settings object
     * @param document the target document that the content will be inserted into
     * @return a DOM fragment with the filtered content.
     */
    var filter = function(inputContent, settings, document) {
      var content = BrowserFilters.all(inputContent);

      var detectedAsWordContent = isWordContent(content);
      settings.setWordContent(detectedAsWordContent);

      var requiredFilters = CommonFilters;
      if (detectedAsWordContent) {
        requiredFilters = WordOnlyFilters.concat(CommonFilters);
      }
      return runPipeline(content, settings, document, requiredFilters);
    };

    var filterPlainText = function(inputContent, settings, document) {
      var content = BrowserFilters.textOnly(inputContent);

      return runPipeline(content, settings, document, [Text]);
    };

    var isWordContent = function(content) {
      return content.indexOf('<o:p>') >= 0 || // IE, Safari, Opera
        content.indexOf('p.MsoNormal, li.MsoNormal, div.MsoNormal') >= 0 || // Firefox Mac
        content.indexOf('MsoListParagraphCxSpFirst') >= 0 || // Windows list only selection
        content.indexOf('<w:WordDocument>') >= 0; // Firefox Windows
    };

    return {
      filter: filter,
      filterPlainText: filterPlainText,
      isWordContent: isWordContent
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.tinymce.LegacyTinyDialog',
  [
    'ephox.powerpaste.legacy.data.Insert',
    'ephox.powerpaste.legacy.tinymce.Settings',
    'ephox.powerpaste.legacy.wordimport.WordImport',
    'global!setTimeout'
  ],
  function(Insert, Settings, WordImport, setTimeout){
    return function(editor, translate) {
      var showDialog = function(content){

        var filterAndInsert = function(importSetting) {
          var data = {content: content};

          // run pre-filters
          editor.fire('PastePreProcess', data);

          // run main filter, always strip images
          var settings = Settings.create(importSetting || editor.settings.powerpaste_word_import, importSetting || editor.settings.powerpaste_html_import, true);
          var fragment = WordImport.filter(data.content, settings, editor.getDoc());

          // run post-filters
          editor.fire('PastePostProcess', fragment);
          //Set undo step
          editor.undoManager.transact(function() {
            // insert the DocumentFragment object into the editor
            Insert.insert(fragment, editor);
          });
        };

        //introduce the prompt option
        var cleanOrMerge = function(setting) {
          return setting === 'clean' || setting === 'merge';
        };

        var openDialog =function() {
          var win;

          var clean = function() {
            win.close();
            filterAndInsert('clean');
          };
          var merge = function() {
            win.close();
            filterAndInsert('merge');
          };

          var controls = [{
            text: translate('cement.dialog.paste.clean'),
            onclick: clean
          },
          {
            text: translate('cement.dialog.paste.merge'),
            onclick: merge
          }];

          var winSettings = {
            title: translate('cement.dialog.paste.title'),
            spacing: 10,
            padding: 10,
            items: [{
              type: 'container',
              html: translate('cement.dialog.paste.instructions')
            }],
            buttons: controls
          };

          win = editor.windowManager.open(winSettings);

          //IE appears to require that we blur the iframe
          setTimeout(function() {
            if (win) {
              win.getEl().focus();
            }
          }, 1);
        };

        if (WordImport.isWordContent(content) && !cleanOrMerge(editor.settings.powerpaste_word_import)) {
          openDialog();
        } else if (!cleanOrMerge(editor.settings.powerpaste_html_import)) {
          openDialog();
        } else {
          filterAndInsert();
        }

      };

      return {
        showDialog: showDialog
      };

    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.tinymce.LegacyPowerPaste',
  [
    'ephox.powerpaste.i18n.I18n',
    'ephox.powerpaste.legacy.tinymce.Clipboard',
    'ephox.powerpaste.tinymce.LegacyTinyDialog'
  ],
  function (I18n, Clipboard, LegacyTinyDialog) {
    return function (editor, settings) {
      var t = this, onPaste, onKeyDown;

      var tinyDialog = LegacyTinyDialog(editor, I18n.translate);

      var handlerAdapter = function(handler) {
        return function(e) {
          handler(e);
        };
      };

      // Register the getClipboardContent function onpaste and with the magical keyboard shortcuts for browsers that don't support that (Opera & FF2).
      onPaste = Clipboard.getOnPasteFunction(editor, tinyDialog.showDialog);
      editor.on('paste', handlerAdapter(onPaste));

      onKeyDown = Clipboard.getOnKeyDownFunction(editor, tinyDialog.showDialog);
      editor.on('keydown', handlerAdapter(onKeyDown));

      editor.addCommand('mceInsertClipboardContent', function(ui, data) {
        tinyDialog.showDialog(data.content || data);
      });

      if (editor.settings.paste_preprocess) {
        editor.on('PastePreProcess', function(e) {
          editor.settings.paste_preprocess.call(t, t, e);
        });
      }

    };

  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.epithet.Id',

  [
  ],

  function () {

    /**
     * Generate a unique identifier.
     *
     * The unique portion of the identifier only contains an underscore
     * and digits, so that it may safely be used within HTML attributes.
     *
     * The chance of generating a non-unique identifier has been minimized
     * by combining the current time, a random number and a one-up counter.
     *
     * @param {string} prefix Prepended to the identifier
     * @return {string} Unique identifier
     */
    var unique = 0;

    var generate = function (prefix) {
      var date   = new Date();
      var time   = date.getTime();
      var random = Math.floor(Math.random() * 1000000000);

      unique++;

      return prefix + "_" + random + unique + String(time);
    };

    return {
      generate: generate
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.DeviceType',

  [
    'ephox.peanut.Fun'
  ],

  function (Fun) {
    return function(osObj, browserObj, userAgent) {
      var isiPad = osObj.isiOS() && ( userAgent.search(/iPad/i) !== -1 );
      var isiPhone = osObj.isiOS() && !isiPad;
      var isAndroid3 = osObj.isAndroid() && ( osObj.version.major === 3 );
      var isAndroid4 = osObj.isAndroid() && ( osObj.version.major === 4 );
      var isTablet = isiPad || isAndroid3 || ( isAndroid4 && userAgent.search(/mobile/i) === -1 );
      var isTouch = ( osObj.isiOS() || osObj.isAndroid() );
      var isPhone = isTouch && !isTablet;

      return {
        isiPad : Fun.constant(isiPad),
        isiPhone: Fun.constant(isiPhone),
        isTablet: Fun.constant(isTablet),
        isPhone: Fun.constant(isPhone),
        isTouch: Fun.constant(isTouch),
        isAndroid: osObj.isAndroid,
        isiOS: osObj.isiOS
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.Platform',

  [
  ],

  function () {
    var create = function(browserName, browserVersion, osName) {
      return {
        browser: {
          current: browserName,
          version: browserVersion
        },
        os: {
          current: osName
        }
      };
    };

    return {
      create: create
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.GetterHelper',

  [
  ],

  function () {
    var getter = function(value) {
      return function() {
        return value;
      };
    };

    // Adapter between settings like IsMSIE and functions like EditLiveJava.browser.isIE()
    var attachGetters = function(scope, current, options) {
      for (var i = 0; i < options.length; i++) {
        scope['is' + options[i].name] = getter(options[i].name === current);
      }
    };

    return {
      getter: getter,
      attachGetters: attachGetters
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.Result',

  [
    'ephox.fred.core.GetterHelper'
  ],

  function (GetterHelper) {
    var create = function(options, current, version) {
      //-------------------------------------------------------------------------
      var attachGetters = GetterHelper.attachGetters;
      //-------------------------------------------------------------------------

      var result = {};
      result.current = current;
      result.version = version;
      attachGetters(result, result.current, options);
      return result;
    };

    return {
      create: create
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.SearchInfo',

  [
    'ephox.violin.Strings'
  ],

  function (V) {
    var contains = V.contains;
    var checkContains = function(x) {
      return function(uastring) {
        return contains(uastring, x);
      };
    };

    var chromeFrameChecker = function() {
      try {
        var i = new ActiveXObject('ChromeTab.ChromeFrame');
        return !!i;
      } catch(e) {
        return false;
      }
    };

    var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;

    var create = function(isChromeFrameEnabled) {
      var browsers = [
        {
          name : 'Spartan',
          versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
          search: function(uastring) {
            var monstrosity = contains(uastring, 'edge/') && contains(uastring, 'chrome') && contains(uastring, 'safari') && contains(uastring, 'applewebkit');
            return monstrosity;
          }
        },
        {
          name : 'ChromeFrame',
          versionRegexes: [/.*?chromeframe\/([0-9]+)\.([0-9]+).*/, normalVersionRegex],
          search: function(uastring) {
            return contains(uastring, 'chromeframe') ? isChromeFrameEnabled() : false;
          }
        },
        {
          name : 'Chrome',
          versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, normalVersionRegex],
          search : function(uastring) {
            return contains(uastring, 'chrome') && !contains(uastring, 'chromeframe');
          }
        },
        {
          name : 'IE',
          versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
          search: function(uastring) {
            var containsIE = (contains(uastring, 'msie') || contains(uastring, 'trident'));
            var containsChromeFrame = contains(uastring, 'chromeframe');
            return containsChromeFrame ? containsIE && !isChromeFrameEnabled() : containsIE;
          }
        },
        {
          name : 'Opera',
          versionRegexes: [normalVersionRegex, /.*?opera\/([0-9]+)\.([0-9]+).*/],
          search : checkContains('opera')
        },
        {
          name : 'Firefox',
          versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
          search : checkContains('firefox')
        },
        {
          name : 'Safari',
          versionRegexes: [normalVersionRegex],
          search : checkContains('safari')
        },
        {
          name : 'Envjs',
          versionRegexes: [/.*?envjs\/\ ?([0-9]+)\.([0-9]+).*/],
          search : checkContains('envjs')
        }
      ];

      var oses = [
        {
          name : 'Windows',
          search : checkContains('win'),
          versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
        },
        {
          name : 'iOS',
          search : function(uastring) {
            return contains(uastring, 'iphone') || contains(uastring, 'ipad');
          },
          versionRegexes: [/.*?version\/\ ?([0-9]+)\.([0-9]+).*/]
        },
        {
          name : 'Android',
          search : checkContains('android'),
          versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
        },
        {
          name : 'OSX',
          search : checkContains('os x'),
          versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
        },
        {
          name : 'Linux',
          search : checkContains('linux')
        },
        { name : 'Solaris',
          search : checkContains('sunos')
        },
        {
         name : 'FreeBSD',
         search : checkContains('freebsd')
        }
      ];


      return {
        browsers: browsers,
        oses: oses
      };
    };

    return {
      create: create,
      chromeFrameChecker: chromeFrameChecker
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.SpecTester',

  [
  ],

  function () {
    var meetsSpec = function(spec, browserVersion) {
      var t = typeof spec;
      if (t === 'boolean') {
        return !! spec;
      } else if (t === 'object') {
        var min = spec.minimum;
        return browserVersion.major > min.major || (browserVersion.major === min.major && browserVersion.minor >= min.minor);
      }

      throw('invalid spec');
    };

    return {
      meetsSpec: meetsSpec
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.Fn',

  [
  ],

  function () {
    var findOneInArrayOr = function(array, theDefault, predicate) {
      for (var i = 0; i < array.length; i++) {
        var x = array[i];
        if (predicate(x, i, array)) return x;
      }
      return theDefault;
    };

    return {
      findOneInArrayOr: findOneInArrayOr
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.UaStringDetector',

  [
    'ephox.fred.core.Fn'
  ],

  function (Fn) {
    var detect = function(scope, userAgent) {
      //-------------------------------------------------------------------------
      var findOneInArrayOr = Fn.findOneInArrayOr;
      //-------------------------------------------------------------------------

      var agent = String(userAgent).toLowerCase();
      return findOneInArrayOr(scope, {name: undefined}, function(x) {
        return x.search(agent);
      });
    };

    return {
      detect: detect
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.core.VersionDetector',

  [
  ],

  function () {
    var detectVersion = function(currentBrowser, agent) {
      function firstMatch(regexes, s) {
        for (var i = 0; i < regexes.length; i++) {
          var x = regexes[i];
          if (x.test(s)) return x;
        }
        return undefined;
      }

      function find(regexes, agent) {
        var r = firstMatch(regexes, agent);
        if (!r) return { major : 0, minor : 0 };
        var group = function(i) {
          return Number(agent.replace(r, '$' + i));
        };
        return {
          major : group(1),
          minor : group(2)
        };
      }

      var cleanedAgent = String(agent).toLowerCase();
      var versionRegexes = currentBrowser.versionRegexes;

      if (!versionRegexes) return { major : 0, minor : 0 };
      return find(versionRegexes, cleanedAgent);
    };

    return {
      detectVersion: detectVersion
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fred.PlatformDetection',

  [
    'ephox.fred.core.DeviceType',
    'ephox.fred.core.Platform',
    'ephox.fred.core.Result',
    'ephox.fred.core.SearchInfo',
    'ephox.fred.core.SpecTester',
    'ephox.fred.core.UaStringDetector',
    'ephox.fred.core.VersionDetector'
  ],

  function (DeviceType, Platform, Result, SearchInfo, SpecTester, UaStringDetector, VersionDetector) {
    //-------------------------------------------------------------------------
    var detectVersion = VersionDetector.detectVersion;
    var makeResult = Result.create;
    var meetsSpec = SpecTester.meetsSpec;
    var detectFromUaString = UaStringDetector.detect;
    //-------------------------------------------------------------------------

    var isSupported = function(supportMatrix, os, browser, browserVersion) {
        if (!!(supportMatrix[os])) {
          if (!!(supportMatrix[os][browser])) {
            return meetsSpec(supportMatrix[os][browser], browserVersion);
          } else {
            return !!(supportMatrix[os]["All"]);
          }
        } else {
          return false;
        }
    };

    var isSupportedPlatform = function(matrix, platform) {
      var browser = platform.browser;
      var os = platform.os;
      return isSupported(matrix, os.current, browser.current, browser.version);
    };

    var doDetect = function(userAgent, chromeFrameChecker) {
      var si = SearchInfo.create(chromeFrameChecker);

      var browsers = si.browsers;
      var oses = si.oses;

      var os = detectFromUaString(oses, userAgent);
      var osName = os.name;
      var osVersion = detectVersion(os, userAgent);

      var browser = detectFromUaString(browsers, userAgent);
      var browserName = browser.name;
      var browserVersion = detectVersion(browser, userAgent);


      var osObj = makeResult(oses, osName, osVersion);
      var browserObj = makeResult(browsers, browserName, browserVersion);

      var deviceType = DeviceType(osObj, browserObj, userAgent);

      var supported = function(supportMatrix) {
        return isSupported(supportMatrix, osName, browserName, browserVersion);
      };

      return {
        browser : browserObj,
        os : osObj,
        deviceType: deviceType,
        isSupported : supported
      };
    };

    var detect = function() {
      return doDetect(navigator.userAgent, SearchInfo.chromeFrameChecker);
    };

    return {
      Platform: Platform,
      detect: detect,
      doDetect: doDetect,
      isSupported: isSupported,
      isSupportedPlatform: isSupportedPlatform
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.api.FileReader',

  [
    'ephox.numerosity.core.Global'
  ],

  function (Global) {
    /*
     * IE10 and above per
     * https://developer.mozilla.org/en-US/docs/Web/API/FileReader
     */
    return function () {
      var f = Global.getOrDie('FileReader');
      return new f();
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.hermes.utils.ImageExtract',

  [
    'ephox.compass.Arr',
    'ephox.epithet.Id',
    'ephox.fred.PlatformDetection',
    'ephox.hermes.api.ImageAsset',
    'ephox.numerosity.api.FileReader',
    'ephox.numerosity.api.URL',
    'ephox.scullion.Struct'
  ],

  function (Arr, Id, PlatformDetection, ImageAsset, FileReader, URL, Struct) {
    var blobStruct = Struct.immutable('id', 'obj', 'objurl');

    var blob = function (obj) {
      return blobStruct(Id.generate('image'), obj, URL.createObjectURL(obj));
    };

    var platform = PlatformDetection.detect();

    /**
     * Converts a list of blobs into a list of ImageAssets. This is
     * asynchronous. The assets are passed to the callback
     * @param blobs the list of blobs
     * @param callback the callback function for the {ephox.hermes.asset.ImageAsset[]}
     */
    var fromBlobs = function (blobs, callback) {
      // edge case: where a drop of a non-file takes place
      if (blobs.length === 0) {
        callback([]);
        return;
      }

      var processed = [];

      var addAsset = function (asset) {
        processed.push(asset);
        if (processed.length === blobs.length) callback(processed);
      };

      var readBlob = function (blobData, f) {
        var fr = FileReader();
        fr.onload = function(e) {
          f(blobData, e.target);
        };
        fr.readAsDataURL(blobData);
      };

      Arr.each(blobs, function (b) {
        var uuid = b.id();
        var blobData = b.obj();
        var objurl = b.objurl();
        readBlob(blobData, function (b, data) {
          var asset = ImageAsset.blob(uuid, b, objurl, data);
          addAsset(asset);
        });
      });
    };

    /**
     * Converts a list of files into a list of ImageAssets. This is
     * asynchronous. The assets are passed to the callback
     * @param files the list of files
     * @param callback the callback function for the {ephox.hermes.asset.ImageAsset[]}
     */
    var toAssets = function (files, callback) {
      var blobs = Arr.map(files, function (file) {
        return blob(file);
      });

      fromBlobs(blobs, callback);
    };

    var toFiles = function (event) {
      return event.raw().target.files || event.raw().dataTransfer.files;
    };

    // The following functions are browser-specific ways of determining
    // whether a drag event contains files from the FILE SYSTEM and
    // NOT files being dragged from the host page
    var isFilesIe = function (types) {
      return types.length === 1 && Arr.contains(types, 'Files');
    };

    var isFilesFF = function (types) {
      return !Arr.contains(types, 'text/_moz_htmlcontext');
    };

    var isFilesWebkit = function (types) {
      return Arr.contains(types, 'Files');
    };

    var isFilesOthers = function (types) {
      // just assume we have files. It will just show a different
      // drop container and the browser will do nothing
      return true;
    };

    var fileDetection = function(){
      if( platform.browser.isChrome()
         || platform.browser.isSafari()
         || platform.browser.isOpera() ) {
        return isFilesWebkit;
      }else if( platform.browser.isFirefox() ) {
        return isFilesFF;
      }else if( platform.browser.isIE() ) {
        return isFilesIe;
      }
      return isFilesOthers;
    };

    var isFiles = fileDetection();

    /**
     * Maps raw global!Image objects to internal image assets,
     * suitable for adding to a gallery or the editor socket.
     * @param [global!Image] images to process
     * @return {ephox.hermes.asset.ImageAsset[]} mapped image assets
     */
    var fromImages = function (images) {
      return Arr.map(images, function (img) {
        var uuid = Id.generate('image');
        return ImageAsset.url(uuid, img.src, img);
      });
    };

    return {
      blob: blob,
      toAssets: toAssets,
      toFiles: toFiles,
      isFiles: isFiles,
      fromImages: fromImages,
      fromBlobs: fromBlobs
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.hermes.api.ImageExtract',

  [
    'ephox.hermes.utils.ImageExtract'
  ],

  function (ImageExtract) {
    /**
     * Converts a list of files into a list of ImageAssets. This is
     * asynchronous. The assets are passed to the callback
     * @param files the list of files
     * @param callback the callback function for the {ephox.hermes.asset.ImageAsset[]}
     */
    var toAssets = function (files, callback) {
      return ImageExtract.toAssets(files, callback);
    };

    /**
     * Converts a list of blobs into a list of ImageAssets. This is
     * asynchronous. The assets are passed to the callback
     * @param blobs the list of blobs
     * @param callback the callback function for the {ephox.hermes.asset.ImageAsset[]}
     */
    var fromBlobs = function (blobs, callback) {
      return ImageExtract.fromBlobs(blobs, callback);
    };

    return {
      toAssets: toAssets,
      fromBlobs: fromBlobs,
      blob: ImageExtract.blob
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.tinymce.ModernPowerDrop',
  [
    'ephox.compass.Arr',
    'ephox.hermes.api.ImageAsset',
    'ephox.hermes.api.ImageExtract',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'global!tinymce'
  ],
  function (Arr, ImageAsset, ImageExtract, Attr, Element, tinymce) {
    return function (editor, url, settings, uploader) {

      var draggingInternally, imageRegex = /^image\/(jpe?g|png|gif|bmp)$/i;

      editor.on('dragstart dragend', function(e) {
        draggingInternally = e.type === 'dragstart';
      });

      editor.on('dragover dragend dragleave', function(e) {
        e.preventDefault();
      });

      var extractImages = function (event) {

        //TODO: make this more explicit why it's been done
        var files = event.target.files || event.dataTransfer.files;

        return Arr.filter(files, function (file) {
          //If the file type tests as an image
          return imageRegex.test(file.type);
        });

      };

      var stringifyImages = function (assets) {

        return Arr.map(assets, function (asset) {

          var image = Element.fromTag('img');

          var src = ImageAsset.cata(asset,
            //If we're using PP's uploader, return the blob url, otherwise the data url
            uploader.getLocalURL,
            function (id, url, raw) { return url; }
          );

          Attr.set(image, 'src', src);

          return image.dom().outerHTML;

        }).join('');

      };

      var processImages = function (images) {

        ImageExtract.toAssets(images, function (assets) {

          var stringHTML = stringifyImages(assets);

          //Content insertion
          editor.insertContent(stringHTML, {merge: editor.settings.paste_merge_formats !== false});

          uploader.uploadImages(assets);

        });

      };

      editor.on('drop', function (e) {

        //If we're not dragging from within tiny
        if (!draggingInternally) {

          //If RangeUtils are exposed (4.2)
          if (tinymce.dom.RangeUtils && tinymce.dom.RangeUtils.getCaretRangeFromPoint) {

            var rng = tinymce.dom.RangeUtils.getCaretRangeFromPoint(e.clientX, e.clientY, editor.getDoc());

            //Set selection to where the mouse is pointing
            if (rng) editor.selection.setRng(rng);

          }

          var images = extractImages(e);

          if (images.length > 0) processImages(images);

          e.preventDefault();

        }

      });

    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.api.Blob',

  [
    'ephox.numerosity.core.Global'
  ],

  function (Global) {
    /*
     * IE10 and above per
     * https://developer.mozilla.org/en-US/docs/Web/API/Blob
     */
    return function (parts, properties) {
      var f = Global.getOrDie('Blob');
      return new f(parts, properties);
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.numerosity.api.Uint8Array',

  [
    'ephox.numerosity.core.Global'
  ],

  function (Global) {
    /*
     * https://developer.mozilla.org/en-US/docs/Web/API/Uint8Array
     *
     * IE10 and above per
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
     */
    return function (arr) {
      var f = Global.getOrDie('Uint8Array');
      return new f(arr);
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!parseInt", [], function () { return parseInt; });
(function (define, require, demand) {
define(
  'ephox.bowerbird.codes.HexToBlob',

  [
    'ephox.numerosity.api.Blob',
    'ephox.numerosity.api.Uint8Array',
    'global!Array',
    'global!Math',
    'global!String',
    'global!parseInt'
  ],

  function (Blob, Uint8Array, Array, Math, String, parseInt) {
    // This function is an unholy combination of two Stack Overflow posts:
    // http://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript
    // http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript

    // This all hinges on each hex digit being two characters.
    // Bytes are only 0-255 (hex 0-FF) though, so that's a pretty safe assumption.
    var toBytes = function (hex) {
      // Pre-allocating the array speeds things up
      var parts = new Array(hex.length / 2);
      for (var i = 0; i < hex.length; i += 2) {
        var h = hex.substr(i, 2);

        var index = Math.floor(i / 2); // Chrome works with indexes like 1.5, but I don't trust JS
        parts[index] = parseInt(h, 16);
      }
      return parts;
    };

    var convert = function (input, contentType) {
      if (input.length === 0) throw 'Zero length content passed to Hex conversion';

      var byteNumbers = toBytes(input);
      var byteArray = Uint8Array(byteNumbers);
      return Blob([byteArray], {type: contentType});
    };

    return {
      convert: convert
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.bowerbird.core.Species',

  [
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  function (Fun, Option) {
    var PICT_SIG = '{\\pict{';
    var PICT_ID_REF = 'i';
    var SHP_SIG = '{\\shp{';
    var SHP_ID_REF = 's';

    var getIndex = function (match, str, idx) {
      return str.indexOf(match, idx);
    };

    var common = function (start, end, bower, regex, idRef) {
      if (start === -1 || end === -1) return Option.none();
      else return Option.some({
        start: Fun.constant(start),
        end: Fun.constant(end),
        bower: bower, // I wish we had types
        regex: Fun.constant(regex),
        idRef: Fun.constant(idRef)
      });
    };

    var extractBower = function (str, start, end) {
      return function () {
        return str.substring(start, end);
      };
    };

    var endBracket = function (str, idx) {
      var nesting = 0;
      var max = str.length;
      var open, close;
      do {
        open = str.indexOf('{', idx);
        close = str.indexOf('}', idx);
        if (close > open && open !== -1) {
          // is open bracket {
          idx = open + 1;
          ++nesting;
        } else if ((open > close || open < 0) && close !== -1) {
          // is closed bracket }
          idx = close + 1;
          --nesting;
        }
        if (idx > max || close === -1) return -1;
      } while (nesting > 0);
      return idx;
    };

    var pict = function (str, idx, start) {
      var end = start === -1 ? start : endBracket(str, start);
      var bower = extractBower(str, start, end);
      var hexRegex = /([a-hA-H0-9]+)\}$/;
      return common(start, end, bower, hexRegex, PICT_ID_REF);
    };

    var shp = function (str, idx, start) {
      var end = start === -1 ? start : endBracket(str, start);
      var bower = extractBower(str, start, end);
      // On windows or ie there is this unique object which is 32bits long that we don't want to capture
      // {\*\blipuid 2c98da434043a6e60b0c2f43b22569bc}
      // there are ideas for optimising the capture which will make this regex redundant see TBIO-3070
      var hexRegex = /([a-hA-H0-9]{64,})(?:\}.*)/;
      return common(start, end, bower, hexRegex, SHP_ID_REF);
    };

    // Can identify 2 types of embedded RTF images, pict & shp, if we find more this needs to become generic.
    // It's complex because this is now a parser and either can come first.
    var identify = function (str, idx) {
      var pictStart = getIndex(PICT_SIG, str, idx);
      var shpStart = getIndex(SHP_SIG, str, idx);

      if (pictStart === -1 && shpStart === -1) return Option.none();
      else if (pictStart === -1)      return shp(str, idx, shpStart);
      else if (shpStart === -1)       return pict(str, idx, pictStart);
      else if (pictStart < shpStart)  return pict(str, idx, pictStart);
      else if (shpStart < pictStart)  return shp(str, idx, shpStart);
      else return Option.none(); // this should never happen, but just in case
    };

    return {
      identify: identify,
      endBracket: endBracket
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.bowerbird.core.Rtf',

  [
    'ephox.bowerbird.codes.HexToBlob',
    'ephox.bowerbird.core.Species',
    'ephox.perhaps.Option'
  ],

  function (HexToBlob, Species, Option) {

    var nextBower = function (s, currentIndex) {
      // the next nest of info that contains all the data about an image
      return Species.identify(s, currentIndex);
    };

    var extractContentType = function (pict) {
      //
      // The following picture types are ignored at the moment:
      //   \emfblip, \macpict, \pmmetafileN, \wmetafileN, \dibitmapN, \wbitmapN.
      //
      if (pict.indexOf('\\pngblip') >= 0) return Option.some('image/png');
      else if (pict.indexOf('\\jpegblip') >= 0) return Option.some('image/jpeg');
      else return Option.none();
    };

    var isValidHex = function (s) {
      return s.length % 2 === 0;
    };

    var removeCrLf = function (s) {
      return s.replace(/\r/g, '').replace(/\n/g, '');
    };

    var extractOnlyGroup = function (s, regex) {
      var result = s.match(regex);
      return result !== null ? Option.some(result[1]) : Option.none();
    };

    var extractHex = function (bower, regex) {
      return extractOnlyGroup(bower, regex).filter(isValidHex);
    };

    var extractId = function (pict) {
      var re = /\\shplid(\d+)/;
      return extractOnlyGroup(pict, re);
    };

    var imageFromData = function (data) {
      // extract a nest of data
      var bower = data.bower();
      var regex = data.regex();
      return extractId(bower).bind(function (id) {
        return extractContentType(bower).bind(function (contentType) {
          return extractHex(bower, regex).map(function (hex) {
            return {
              'id': data.idRef() + id,
              'contentType': contentType,
              'blob' : HexToBlob.convert(hex, contentType)
            };
          });
        });
      });
    };

    var extractBowers = function (rtf) {
      var images = [];
      var length = function () {
        return rtf.length; // break
      };

      var addImage = function (data) {
        var image = imageFromData(data);
        image.each(function (image) {
          images.push(image);
        });
        return data.end() + 1;
      };

      var currentIndex = 0;
      while (currentIndex < rtf.length) {
        currentIndex = nextBower(rtf, currentIndex).fold(length, addImage);
      }
      return images;
    };

    var images = function (rtf) {
      return extractBowers(removeCrLf(rtf));
    };

    return {
      nextBower: nextBower,
      extractId: extractId,
      extractContentType: extractContentType,
      extractHex: extractHex,
      images: images
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.bowerbird.api.Rtf',

  [
    'ephox.bowerbird.core.Rtf'
  ],

  function (Rtf) {
	  var images = function (rtf) {
	  	return Rtf.images(rtf);
	  };

  	return {
  		images: images
  	};
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.flash.Correlation',

  [
    'ephox.compass.Arr',
    'ephox.hermes.api.ImageExtract',
    'ephox.perhaps.Option',
    'ephox.scullion.Struct',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Class'
  ],

  function (Arr, ImageExtract, Option, Struct, Attr, Class) {
    var rtfData = Struct.immutable('id', 'url');

    var byCode = function (image, unique, _index) {
      var candidate = Arr.find(unique, function (u) {
        return Attr.get(image, 'data-image-id') === u.id();
      });

      return Option.from(candidate);
    };

    var byPosition = function (image, unique, index) {
      return Option.from(unique[index]);
    };

    var converters = {
      local: byPosition,
      code: byCode
    };

    var convert = function (images, imageData, callback) {
      var unique = [];

      // create the blob struct from the RTF data, and keep a record of unique ID -> url
      var blobs = Arr.bind(imageData, function (i) {
        var isUnique = !Arr.exists(unique, function (d) { return d.id() === i.id; });

        if (isUnique) {
          var blob = ImageExtract.blob(i.blob);

          unique.push(rtfData(i.id, blob.objurl()));

          return [blob];
        } else {
          return [];
        }
      });

      // load the blob data before updating the document and then firing the callback
      ImageExtract.fromBlobs(blobs, function (assets) {

        Arr.each(images, function (image, i) {
          // TODO: Standardise the names of these data attributes. Probably namespaced.
          var type = Attr.get(image, 'data-image-type');
          var converter = converters[type] !== undefined ? converters[type] : Option.none;
          converter(image, unique, i).each(function (candidate) {
            Attr.set(image, 'src', candidate.url());
          });
          Class.remove(image, 'rtf-data-image');
          Attr.remove(image, 'data-image-type');
          Attr.remove(image, 'data-image-id');
        });

        callback(assets);
      });
    };

    return {
      convert: convert
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.style.Styles',

  [
    'ephox.flour.style.Resolver'
  ],

  function (Resolver) {
    var styles = Resolver.create('ephox-cement');

    return {
      resolve: styles.resolve
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.flash.HelpCopy',

  [
    'ephox.cement.style.Styles',
    'ephox.fred.PlatformDetection',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.InsertAll'
  ],

  function (Styles, PlatformDetection, Class, Element, InsertAll) {

    var modifierKey = function () {
      var platform = PlatformDetection.detect();
      var mac = platform.os.isOSX();
      return mac ? ['\u2318'] : ['Ctrl'];
    };

    var pressEscape = function (translations) {
      return Element.fromHtml(
        '<p>' + translations('cement.dialog.flash.press-escape') + '</p>'
      );
    };

    var paste = function (translations) {
      var container = Element.fromTag('div');
      Class.add(container, Styles.resolve('flashbin-helpcopy'));

      var key = modifierKey();

      var instructions = Element.fromHtml(
        '<p>' + translations('cement.dialog.flash.trigger-paste') + '</p>');
      var kbd = Element.fromHtml(
          '<div>' +
            '<span class="ephox-polish-help-kbd">' +
              key +
            '</span>' +
            ' + ' +
            '<span class="ephox-polish-help-kbd">V</span>' +
          '</div>'
      );

      Class.add(kbd, Styles.resolve('flashbin-helpcopy-kbd'));

      InsertAll.append(container, [ instructions, kbd, pressEscape(translations) ]);

      return container;
    };

    var noflash = function (translations) {
      var container = Element.fromTag('div');
      Class.add(container, Styles.resolve('flashbin-helpcopy'));

      var instructions = Element.fromHtml(
        '<p>' + translations('cement.dialog.flash.missing') + '</p>'
      );

      InsertAll.append(container, [ instructions, pressEscape(translations) ]);

      return container;
    };

    var indicator = function (translations) {
      var loading = Element.fromTag('div');
      Class.add(loading, Styles.resolve('flashbin-loading'));

      var spinner = Element.fromTag('div');
      Class.add(spinner, Styles.resolve('flashbin-loading-spinner'));

      var loadNote = Element.fromTag('p');
      loadNote.dom().innerHTML = translations('loading.wait');

      InsertAll.append(loading, [spinner, loadNote]);

      return loading;
    };

    return {
      paste: paste,
      noflash: noflash,
      indicator: indicator
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!window", [], function () { return window; });
(function (define, require, demand) {
define(
  'ephox.sugar.api.Css',

  [
    'ephox.classify.Type',
    'ephox.compass.Obj',
    'ephox.perhaps.Option',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Body',
    'ephox.sugar.api.Element',
    'ephox.violin.Strings',
    'global!Error',
    'global!console',
    'global!window'
  ],

  function (Type, Obj, Option, Attr, Body, Element, Strings, Error, console, window) {
    var internalSet = function (dom, property, value) {
      // This is going to hurt. Apologies.
      // JQuery coerces numbers to pixels for certain property names, and other times lets numbers through.
      // we're going to be explicit; strings only.
      if (!Type.isString(value)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
        throw new Error('CSS value must be a string: ' + value);
      }

      // removed: support for dom().style[property] where prop is camel case instead of normal property name
      dom.style.setProperty(property, value);
    };

    var set = function (element, property, value) {
      var dom = element.dom();
      internalSet(dom, property, value);
    };

    var setAll = function (element, css) {
      var dom = element.dom();

      Obj.each(css, function (v, k) {
        internalSet(dom, k, v);
      });
    };

    /*
     * NOTE: For certain properties, this returns the "used value" which is subtly different to the "computed value" (despite calling getComputedStyle).
     * Blame CSS 2.0.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
     */
    var get = function (element, property) {
      var dom = element.dom();
      /*
       * IE9 and above per
       * https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle
       *
       * Not in numerosity, because it doesn't memoize and looking this up dynamically in performance critical code would be horrendous.
       *
       * JQuery has some magic here for IE popups, but we don't really need that.
       * It also uses element.ownerDocument.defaultView to handle iframes but that hasn't been required since FF 3.6.
       */
      var styles = window.getComputedStyle(dom);
      var r = styles.getPropertyValue(property);

      // jquery-ism: If r is an empty string, check that the element is not in a document. If it isn't, return the raw value.
      // Turns out we do this a lot.
      var v = (r === '' && !Body.inBody(element)) ? getUnsafeProperty(dom, property) : r;

      // undefined is the more appropriate value for JS. JQuery coerces to an empty string, but screw that!
      return v === null ? undefined : v;
    };

    var getUnsafeProperty = function (dom, property) {
      // removed: support for dom().style[property] where prop is camel case instead of normal property name
      return dom.style.getPropertyValue(property);
    };

    /*
     * Gets the raw value from the style attribute. Useful for retrieving "used values" from the DOM:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
     *
     * Returns NONE if the property isn't set, or the value is an empty string.
     */
    var getRaw = function (element, property) {
      var dom = element.dom();
      var raw = getUnsafeProperty(dom, property);

      return Option.from(raw).filter(function (r) { return r.length > 0; });
    };

    var isValidValue = function (tag, property, value) {
      var element = Element.fromTag(tag);
      set(element, property, value);
      var style = getRaw(element, property);
      return style.isSome();
    };

    var remove = function (element, property) {
      var dom = element.dom();
      /*
       * IE9 and above - MDN doesn't have details, but here's a couple of random internet claims
       *
       * http://help.dottoro.com/ljopsjck.php
       * http://stackoverflow.com/a/7901886/7546
       */
      dom.style.removeProperty(property);

      if (Attr.has(element, 'style') && Strings.trim(Attr.get(element, 'style')) === '') {
        // No more styles left, remove the style attribute as well
        Attr.remove(element, 'style');
      }
    };

    var preserve = function (element, f) {
      var oldStyles = Attr.get(element, 'style');
      var result = f(element);
      var restore = oldStyles === undefined ? Attr.remove : Attr.set;
      restore(element, 'style', oldStyles);
      return result;
    };

    var copy = function (source, target) {
      target.dom().style.cssText = source.dom().style.cssText;
    };

    var reflow = function (e) {
      /* NOTE:
       * do not rely on this return value.
       * It's here so the closure compiler doesn't optimise the property access away.
       */
      return e.dom().offsetWidth;
    };

    return {
      copy: copy,
      set: set,
      preserve: preserve,
      setAll: setAll,
      remove: remove,
      get: get,
      getRaw: getRaw,
      isValidValue: isValidValue,
      reflow: reflow
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!navigator", [], function () { return navigator; });
(function (define, require, demand) {
define(
  'ephox.cement.flash.FlashInfo',

  [
    'ephox.cement.flash.HelpCopy',
    'ephox.cement.style.Styles',
    'ephox.fred.PlatformDetection',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'global!navigator'
  ],

  function (HelpCopy, Styles, PlatformDetection, Fun, Class, Css, Element, Insert, InsertAll, navigator) {
    var platform = PlatformDetection.detect();

    // separated out to constrain the scope of the JSHint override
    var ieFlash = function () {
      /* global ActiveXObject */
      return new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    };

    var hasFlash = function () {
      try {
        var flashObj = platform.browser.isIE() ? ieFlash() : navigator.plugins['Shockwave Flash'];
        return flashObj !== undefined;
      } catch (err) {
        return false;
      }
    };

    var noflash = function (container, _bin, reflow, translations) {
      var help = HelpCopy.noflash(translations);
      Insert.append(container, help);

      return {
        reset: Fun.noop
      };
    };

    var flash = function (container, bin, reflow, translations) {
      var help = HelpCopy.paste(translations);
      var indicator = HelpCopy.indicator(translations);

      InsertAll.append(container, [ indicator, help, bin.element() ]);

      var indicatorHide = function () {
        /*
          X-browser magic that makes the flash blocker/s info display nicely with the cement spinner
        */
        Css.setAll(indicator, {
          'height': '0',
          'padding': '0'
        });
      };

      var reset = function () {
        Css.set(help, 'display', 'block');
        Css.set(indicator, 'display', 'none');
        reflow();
      };

      var busy = function () {
        Css.set(help, 'display', 'none');
        Css.set(indicator, 'display', 'block');
        Css.remove(indicator, 'height');
        Css.remove(indicator, 'padding');
        reflow();
      };

      bin.events.spin.bind(busy);
      bin.events.reset.bind(reset);
      bin.events.hide.bind(indicatorHide);

      return {
        reset: reset
      };
    };

    return function (bin, reflow, cementConfig) {
      console.log(bin, reflow, cementConfig)
      var container = Element.fromTag('div');
      var style = 'flashbin-wrapper-' + (platform.os.isOSX() ? 'cmd' : 'ctrl');

      Class.add(container, Styles.resolve(style));

      var loader = hasFlash() ? flash : noflash;
      var info = loader(container, bin, reflow, cementConfig.translations);

      return {
        element: Fun.constant(container),
        reset: info.reset
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!clearInterval", [], function () { return clearInterval; });
ephox.bolt.module.api.define("global!setInterval", [], function () { return setInterval; });
(function (define, require, demand) {
define(
  'ephox.cement.alien.WaitForFlash',

  [
    'ephox.classify.Type',
    'ephox.compass.Arr',
    'global!clearInterval',
    'global!setInterval'
  ],

  function (Type, Arr, clearInterval, setInterval) {
    return function (obj, flashFunctions, callback) {
      var functionsReady = function (dom) {
        // Plugin objects register functions on their DOM node *after* they load, until then they are undefined.
        return Arr.forall(flashFunctions, function (name) {
          return Type.isFunction(dom[name]);
        });
      };

      var search = function () {
        // Sometimes we never get the onload callback, but PercentLoaded reaches 100 indicating it is actually running.
        // If that happens, once the functions are available we are good to go.
        var dom = obj.dom();
        if (Type.isFunction(dom.PercentLoaded) && dom.PercentLoaded() === 100 && functionsReady(dom)) {
          stop();
          callback();
        }
      };

      var waiting = true;
      var reference = setInterval(search, 500);

      var stop = function () {
        if (waiting) {
          clearInterval(reference);
          waiting = false;
        }
      };
      return {
        stop: stop
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.epithet.Namespace',

  [
    'ephox.epithet.Global'
  ],

  function (Global) {
    var step = function (o, part) {
      if (o[part] === undefined || o[part] === null)
        o[part] = {};
      return o[part];
    };

    var namespace = function (name, target) {
      var o = target || Global;
      var parts = name.split('.');
      for (var i = 0; i < parts.length; ++i)
        o = step(o, parts[i]);
      return o;
    };

    return {
      namespace: namespace
    };
  }
);


})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.oilspill.callback.Globaliser',

  [
    'ephox.epithet.Namespace'
  ],

  function (Namespace) {
    var install = function (namespace) {
      var manager = Namespace.namespace(namespace);
      manager.callbacks = {};

      var count = 0;
      var next = function () {
        var ref = 'callback_' + count;
        count++;
        return ref;
      };

      var global = function (ref) {
        return namespace + '.callbacks.' + ref;
      };

      var register = function (callback, permanent) {
        var ref = next();
        manager.callbacks[ref] = function () {
          if (!permanent) unregister(ref);
          callback.apply(null, arguments);
        };
        return global(ref);
      };

      var ephemeral = function (callback) {
        return register(callback, false);
      };

      var permanent = function (callback) {
        return register(callback, true);
      };

      var unregister = function (spec) {
        var ref = spec.substring(spec.lastIndexOf('.') + 1);
        if (manager.callbacks[ref] !== undefined)
          delete manager.callbacks[ref];
      };

      manager.ephemeral = ephemeral;
      manager.permanent = permanent;
      manager.unregister = unregister;

      return manager;
    };

    return {
      install: install
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.PredicateFind',

  [
    'ephox.classify.Type',
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.sugar.api.Body',
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Element',
    'ephox.sugar.impl.ClosestOrAncestor'
  ],

  function (Type, Arr, Fun, Option, Body, Compare, Element, ClosestOrAncestor) {
    var first = function (predicate) {
      return descendant(Body.body(), predicate);
    };

    var ancestor = function (scope, predicate, isRoot) {
      var element = scope.dom();
      var stop = Type.isFunction(isRoot) ? isRoot : Fun.constant(false);

      while (element.parentNode) {
        element = element.parentNode;
        var el = Element.fromDom(element);

        if (predicate(el)) return Option.some(el);
        else if (stop(el)) break;
      }
      return Option.none();
    };

    var closest = function (scope, predicate, isRoot) {
      // This is required to avoid ClosestOrAncestor passing the predicate to itself
      var is = function (scope) {
        return predicate(scope);
      };
      return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
    };

    var sibling = function (scope, predicate) {
      var element = scope.dom();
      if (!element.parentNode) return Option.none();

      return child(Element.fromDom(element.parentNode), function (x) {
        return !Compare.eq(scope, x) && predicate(x);
      });
    };

    var child = function (scope, predicate) {
      var result = Arr.find(scope.dom().childNodes,
        Fun.compose(predicate, Element.fromDom));
      return Option.from(result).map(Element.fromDom);
    };

    var descendant = function (scope, predicate) {
      var descend = function (element) {
        for (var i = 0; i < element.childNodes.length; i++) {
          if (predicate(Element.fromDom(element.childNodes[i])))
            return Option.some(Element.fromDom(element.childNodes[i]));

          var res = descend(element.childNodes[i]);
          if (res.isSome())
            return res;
        }

        return Option.none();
      };

      return descend(scope.dom());
    };

    return {
      first: first,
      ancestor: ancestor,
      closest: closest,
      sibling: sibling,
      child: child,
      descendant: descendant
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.PredicateExists',

  [
    'ephox.sugar.api.PredicateFind'
  ],

  function (PredicateFind) {
    var any = function (predicate) {
      return PredicateFind.first(predicate).isSome();
    };

    var ancestor = function (scope, predicate, isRoot) {
      return PredicateFind.ancestor(scope, predicate, isRoot).isSome();
    };

    var closest = function (scope, predicate, isRoot) {
      return PredicateFind.closest(scope, predicate, isRoot).isSome();
    };

    var sibling = function (scope, predicate) {
      return PredicateFind.sibling(scope, predicate).isSome();
    };

    var child = function (scope, predicate) {
      return PredicateFind.child(scope, predicate).isSome();
    };

    var descendant = function (scope, predicate) {
      return PredicateFind.descendant(scope, predicate).isSome();
    };

    return {
      any: any,
      ancestor: ancestor,
      closest: closest,
      sibling: sibling,
      child: child,
      descendant: descendant
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Focus',

  [
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.PredicateExists',
    'ephox.sugar.api.Traverse',
    'global!document'
  ],

  function (Fun, Option, Compare, Element, PredicateExists, Traverse, document) {
    var focus = function (element) {
      element.dom().focus();
    };

    var blur = function (element) {
      element.dom().blur();
    };

    var hasFocus = function (element) {
      var doc = Traverse.owner(element).dom();
      return element.dom() === doc.activeElement;
    };

    var active = function (_doc) {
      var doc = _doc !== undefined ? _doc.dom() : document;
      return Option.from(doc.activeElement).map(Element.fromDom);
    };

    var focusInside = function (element) {
      // Only call focus if the focus is not already inside it.
      var doc = Traverse.owner(element);
      var inside = active(doc).filter(function (a) {
        return PredicateExists.closest(a, Fun.curry(Compare.eq, element));
      });

      inside.fold(function () {
        focus(element);
      }, Fun.noop);
    };

    /**
     * Return the descendant element that has focus.
     * Use instead of SelectorFind.descendant(container, ':focus')
     *  because the :focus selector relies on keyboard focus.
     */
    var search = function (element) {
      return active(Traverse.owner(element)).filter(function (e) {
        return element.dom().contains(e.dom());
      });
    };

    return {
      hasFocus: hasFocus,
      focus: focus,
      blur: blur,
      active: active,
      search: search,
      focusInside: focusInside
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!clearTimeout", [], function () { return clearTimeout; });
ephox.bolt.module.api.define("global!unescape", [], function () { return unescape; });
(function (define, require, demand) {
define(
  'ephox.cement.flash.Flashbin',

  [
    'ephox.cement.alien.WaitForFlash',
    'ephox.cement.style.Styles',
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.epithet.Id',
    'ephox.fred.PlatformDetection',
    'ephox.oilspill.callback.Globaliser',
    'ephox.perhaps.Option',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Focus',
    'ephox.sugar.api.Insert',
    'global!clearTimeout',
    'global!console',
    'global!setTimeout',
    'global!unescape',
    'global!window'
  ],

  function (WaitForFlash, Styles, Arr, Obj, Id, PlatformDetection, Globaliser, Option, Event, Events, Class, Css, Element, Focus, Insert, clearTimeout, console, setTimeout, unescape, window) {
    var globaliser = Globaliser.install('ephox.flash');
    var platform = PlatformDetection.detect();
    var unbinders = Option.none();

    return function (swfLoc) {
      var events = Events.create({
        response: Event(['rtf']),
        spin: Event([]),
        cancel: Event([]),
        error: Event(['message']),
        reset: Event([]),
        hide: Event([])
      });

      var hasLoaded = false;

      var target = Element.fromTag('div');
      Class.add(target, Styles.resolve('flashbin-target'));

      var process = function (rtfData) {
        // The setTimeout here is to detach it from the event stack/queue, so that the UI is updated
        // during this block.
        setTimeout(function () {
          events.trigger.response(unescape(rtfData));
        }, 0);
      };

      var loadComplete = function () {
        waiting.stop();
        if (hasLoaded) return;
        hasLoaded = true;
        try {
          var dom = bin.dom();
          Obj.each(flashFunctionMapping, function (v, k) {
            var f = dom[k];
            f.call(dom, v); // plugin requires 'this' to be set correctly
          });
          events.trigger.reset();
          clearOverTime();
          focus();
        } catch (e) {
          console.log('Flash dialog - Error during onLoad ', e);
        }
      };

      var onloadCallback = globaliser.permanent(loadComplete);

      var flashFunctionMapping = {
        'setSpinCallback': globaliser.permanent(events.trigger.spin),
        'setPasteCallback': globaliser.permanent(process),
        'setEscapeCallback': globaliser.permanent(events.trigger.cancel),
        'setErrorCallback': globaliser.permanent(events.trigger.error)
      };

      var createObject = function () {
        var swf = swfLoc.replace(/^https?:\/\//, '//');
        var flashVars = 'onLoad=' + onloadCallback;

        //
        // NOTE: the wmode (window mode) of "opaque" here has been suggested as on various forums as
        // required to get the swf to focus on Firefox. e.g.
        // http://stackoverflow.com/questions/7921690/how-do-i-make-my-flash-object-get-focus-on-load
        // This setting did not seem to cause problems on our other supported browsers.
        // Please do not return this setting to "transparent" without serious testing.
        //
        var commonParams =
          '    <param name="allowscriptaccess" value="always">' +
          '    <param name="wmode" value="opaque">' +
          '    <param name="FlashVars" value="' + flashVars + '">';

        if (platform.browser.isIE() && platform.browser.version.major === 10) {
          var id = Id.generate('flash-bin');
          return Element.fromHtml(
            '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="' + id + '">' +
              '<param name="movie" value="' + swf + '">' +
              commonParams +
            '</object>');
        } else {
          return Element.fromHtml(
            '<object type="application/x-shockwave-flash" data="' + swf + '">' +
              commonParams +
            '</object>');
        }
      };

      var bin = createObject();

      var binStealth = function () {
        Css.setAll(bin, {
          'width' : '2px',
          'height': '2px'
        });
      };

      binStealth();
      var waiting = WaitForFlash(bin, Obj.keys(flashFunctionMapping), loadComplete);

      Insert.append(target, bin);

      var element = function () {
        return target;
      };

      var focus = function () {
        if (platform.browser.isFirefox()) {
          // On Firefox, pasting into flash also fires a paste event wherever the window selection is
          window.getSelection().removeAllRanges();
        }
        Focus.focus(bin);
      };

      var timerHandle = null;

      var overTime = function () {
        Class.add(target, Styles.resolve('flash-activate'));
        Css.remove(bin, 'height');
        Css.remove(bin, 'width');
        events.trigger.hide();
      };

      var clearOverTime = function () {
        clearTimeout(timerHandle);
        Class.remove(target, Styles.resolve('flash-activate'));
        binStealth();
      };

      var activate = function () {
        // TODO: improvement create a custom poll event for .swf has loaded, then fire overtime.
        timerHandle = setTimeout(overTime, 3000);
        events.trigger.spin();
        Css.set(target, 'display', 'block');
        focus();
      };

      var deactivate = function () {
        Css.set(target, 'display', 'none');
        unbinders.each(function (unbinders) {
          Arr.each(unbinders, function (unbinder) {
            unbinder.unbind();
          });
        });
      };

      var destroy = function () {
        deactivate();
        Arr.each(Obj.values(flashFunctionMapping), function (s) {
          globaliser.unregister(s);
        });
        globaliser.unregister(onloadCallback);
        waiting.stop(); // in case the user cancels
      };

      return {
        focus: focus,
        element: element,
        activate: activate,
        deactivate: deactivate,
        destroy: destroy,
        events: events.registry
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.impl.FilteredEvent',

  [
    'ephox.peanut.Fun',
    'ephox.sugar.api.Element'
  ],

  function (Fun, Element) {

    var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
      // switched from a struct to manual Fun.constant() because we are passing functions now, not just values
      return {
        'target':  Fun.constant(target),
        'x':       Fun.constant(x),
        'y':       Fun.constant(y),
        'stop':    stop,
        'prevent': prevent,
        'kill':    kill,
        'raw':     Fun.constant(raw)
      };
    };

    var handle = function (filter, handler) {
      return function (rawEvent) {
        if (!filter(rawEvent)) return;

        // IE9 minimum
        var target = Element.fromDom(rawEvent.target);

        var stop = function () {
          rawEvent.stopPropagation();
        };

        var prevent = function () {
          rawEvent.preventDefault();
        };

        var kill = Fun.compose(prevent, stop); // more of a sequence than a compose, but same effect

        // FIX: Don't just expose the raw event. Need to identify what needs standardisation.
        var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
        handler(evt);
      };
    };

    var binder = function (element, event, filter, handler, useCapture) {
      var wrapped = handle(filter, handler);
      // IE9 minimum
      element.dom().addEventListener(event, wrapped, useCapture);

      return {
        unbind: Fun.curry(unbind, element, event, wrapped, useCapture)
      };
    };

    var bind = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, false);
    };

    var capture = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, true);
    };

    var unbind = function (element, event, handler, useCapture) {
      // IE9 minimum
      element.dom().removeEventListener(event, handler, useCapture);
    };

    return {
      bind: bind,
      capture: capture
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.DomEvent',

  [
    'ephox.peanut.Fun',
    'ephox.sugar.impl.FilteredEvent'
  ],

  function (Fun, FilteredEvent) {
    var filter = Fun.constant(true); // no filter on plain DomEvents

    var bind = function (element, event, handler) {
      return FilteredEvent.bind(element, event, filter, handler);
    };

    var capture = function (element, event, handler) {
      return FilteredEvent.capture(element, event, filter, handler);
    };

    return {
      bind: bind,
      capture: capture
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.flash.FlashDialog',

  [
    'ephox.cement.flash.FlashInfo',
    'ephox.cement.flash.Flashbin',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sugar.api.DomEvent',
    'ephox.sugar.api.Element',
    'global!window'
  ],

  function (FlashInfo, Flashbin, Event, Events, DomEvent, Element, window) {

    return function (createDialog, settings) {
      var translations = settings.translations;

      var events = Events.create({
        response: Event(['rtf', 'hide']),
        cancel: Event([]),
        error: Event(['message'])
      });

      var open = function () {
        var bin = Flashbin(settings.swf);
        bin.deactivate();

        var win = Element.fromDom(window);
        var clickEvent = DomEvent.bind(win, 'mouseup', bin.focus);

        var hide = function () {
          destroy();
        };

        var cancel = function () {
          hide();
          events.trigger.cancel();
        };

        bin.events.cancel.bind(cancel);
        bin.events.response.bind(function (event) {
          // Don't hide immediately - keep the please wait going until the images are converted
          events.trigger.response(event.rtf(), hide);
        });

        bin.events.error.bind(function (event) {
          hide();
          events.trigger.error(event.message());
        });

        var dialog = createDialog();
        dialog.setTitle( translations('cement.dialog.flash.title'));

        var information = FlashInfo(bin, dialog.reflow, settings);
        information.reset();
        dialog.setContent(information.element());

        dialog.events.close.bind(cancel);
        dialog.show();

        bin.activate();

        var destroy = function () {
          clickEvent.unbind();
          dialog.destroy();
          bin.destroy();
        };
      };

      return {
        open: open,
        events: events.registry
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Replication',

  [
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.Traverse'
  ],

  function (Attr, Element, Insert, InsertAll, Remove, Traverse) {
    var clone = function (original, deep) {
      return Element.fromDom(original.dom().cloneNode(deep));
    };

    /** Shallow clone - just the tag, no children */
    var shallow = function (original) {
      return clone(original, false);
    };

    /** Deep clone - everything copied including children */
    var deep = function (original) {
      return clone(original, true);
    };

    /** Shallow clone, with a new tag */
    var shallowAs = function (original, tag) {
      var nu = Element.fromTag(tag);

      var attributes = Attr.clone(original);
      Attr.setAll(nu, attributes);

      return nu;
    };

    /** Deep clone, with a new tag */
    var copy = function (original, tag) {
      var nu = shallowAs(original, tag);

      // NOTE
      // previously this used serialisation:
      // nu.dom().innerHTML = original.dom().innerHTML;
      //
      // Clone should be equivalent (and faster), but if TD <-> TH toggle breaks, put it back.

      var cloneChildren = Traverse.children(deep(original));
      InsertAll.append(nu, cloneChildren);

      return nu;
    };

    /** Change the tag name, but keep all children */
    var mutate = function (original, tag) {
      var nu = shallowAs(original, tag);

      Insert.before(original, nu);
      var children = Traverse.children(original);
      InsertAll.append(nu, children);
      Remove.remove(original);
      return nu;
    };

    return {
      shallow: shallow,
      shallowAs: shallowAs,
      deep: deep,
      copy: copy,
      mutate: mutate
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.limbo.api.RtfImage',

  [
    'ephox.perhaps.Option',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.PredicateFind',
    'ephox.sugar.api.Replication',
    'ephox.sugar.api.SelectorFilter',
    'ephox.violin.Strings'
  ],

  function (Option, Attr, Class, Css, Element, Node, PredicateFind, Replication, SelectorFilter, Strings) {
    var searchIn = function (comment, selector) {
      var innards = Node.value(comment);
      var container = Element.fromTag('div');
      var substr = innards.indexOf(']>');
      container.dom().innerHTML = innards.substr(substr + ']>'.length);
      // Note: It doesn't look like sizzle can pick up namespaced tags with selectors.
      return PredicateFind.descendant(container, function (elem) {
        return Node.name(elem) === selector;
      });
    };

    var scour = function (target) {
      return Node.isComment(target) ? searchIn(target, 'v:shape') : Option.none();
    };

    var vshape = function (original) {
      return scour(original).map(function (image) {
        // NOTE: If we discover more than 2 possible attributes, de-dupe with HtmlPaste somehow
        var spid = Attr.get(image, 'o:spid');
        var vShapeId = spid === undefined ? Attr.get(image, 'id') : spid;

        var result = Element.fromTag('img');
        Class.add(result, 'rtf-data-image');
        Attr.set(result, 'data-image-id', vShapeId.substr('_x0000_'.length));
        Attr.set(result, 'data-image-type', 'code');
        Css.setAll(result, {
          width: Css.get(image, 'width'),
          height: Css.get(image, 'height')
        });

        return result;
      });
    };

    var local = function (original) {
      if (Node.name(original) === 'img') {
        var src = Attr.get(original, 'src');
        if (src !== undefined && src !== null && Strings.startsWith(src, 'file://')) {
          var result = Replication.shallow(original);
          var parts = src.split(/[\/\\]/);
          var last = parts[parts.length - 1];
          Attr.set(result, 'data-image-id', last);
          Attr.remove(result, 'src');
          Attr.set(result, 'data-image-type', 'local');
          Class.add(result, 'rtf-data-image');
          return Option.some(result);
        } else {
          return Option.none();
        }
      } else {
        return Option.none();
      }
    };

    var exists = function (container) {
      return find(container).length > 0;
    };

    var find = function (container) {
      return SelectorFilter.descendants(container, '.rtf-data-image');
    };

    return {
      local: local,
      vshape: vshape,
      find: find,
      exists: exists,
      scour: scour
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.flash.Flash',

  [
    'ephox.bowerbird.api.Rtf',
    'ephox.cement.flash.Correlation',
    'ephox.cement.flash.FlashDialog',
    'ephox.compass.Arr',
    'ephox.limbo.api.RtfImage',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.Traverse'
  ],

  function (Rtf, Correlation, FlashDialog, Arr, RtfImage, Event, Events, Remove, Traverse) {
    return function (createDialog, cementConfig) {
      var events = Events.create({
        error: Event(['message']),
        insert: Event(['elements', 'assets'])
      });

      var gordon = function (content, baseAssets) {
        var response = function (event) {
          var hideDialog = event.hide();
          var imageData = Rtf.images(event.rtf());
          var images = RtfImage.find(content);

          Correlation.convert(images, imageData, function (assets) {
            events.trigger.insert(Traverse.children(content), assets.concat(baseAssets));

            // when images are pasted, the flash dialog doesn't automatically hide
            hideDialog();
          });
        };

        var cancelImages = function () {
          var images = RtfImage.find(content);
          Arr.each(images, Remove.remove);
          events.trigger.insert(Traverse.children(content), baseAssets);
        };

        if (cementConfig.allowLocalImages) {
          var flash = FlashDialog(createDialog, cementConfig);
          flash.events.response.bind(response);
          flash.events.cancel.bind(cancelImages);
          flash.events.error.bind(function (event) { events.trigger.error(event.message()); });
          flash.open();
        } else {
          cancelImages();
          events.trigger.error('errors.local.images.disallowed');
        }
      };

      return {
        events: events.registry,
        gordon: gordon
      };

    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.smartpaste.MergeSettings',

  [
    'ephox.cement.style.Styles',
    'ephox.highway.Merger',
    'ephox.peanut.Fun',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert'
  ],

  function (Styles, Merger, Fun, Event, Events, Class, Element, Insert) {
    return function (createDialog, settings) {
      var translations = settings.translations;

      var result = function (value, settings, callback) {
        callback(Merger.merge(settings, {
          mergeOfficeStyles: value,
          mergeHtmlStyles: value
        }));
      };

      var events = Events.create({
        open: Event([]),
        cancel: Event([]),
        close: Event([])
      });

      var showDialog = function (settings, callback) {
        var clean = function () {
          hide();
          result(false, settings, callback);
        };

        var merge = function () {
          hide();
          result(true, settings, callback);
        };

        var content = Element.fromTag('div');

        Class.add(content, Styles.resolve('styles-dialog-content'));

        var instructions = Element.fromTag('p');
        var text = Element.fromText(translations('cement.dialog.paste.instructions'));
        Insert.append(instructions, text);
        Insert.append(content, instructions);

        var cleanButton = {
          text: translations('cement.dialog.paste.clean'),
          tabindex: 0,
          className: Styles.resolve('clean-styles'),
          click: clean
        };
        var mergeButton = {
          text: translations('cement.dialog.paste.merge'),
          tabindex: 1,
          className: Styles.resolve('merge-styles'),
          click: merge
        };

        var dialog = createDialog(true);
        dialog.setTitle(translations('cement.dialog.paste.title'));
        dialog.setContent(content);
        dialog.setButtons([cleanButton, mergeButton]);
        dialog.show();

        var hide = function () {
          events.trigger.close();
          dialog.destroy();
        };

        var cancel = function () {
          events.trigger.cancel();
          hide();
        };

        dialog.events.close.bind(cancel);

        events.trigger.open();
      };

      var get = function (officePaste, callback) {
        var input = officePaste ? 'officeStyles' : 'htmlStyles';

        var settingToUse = settings[input];

        if (settingToUse === 'clean') {
          result(false, settings, callback);
        } else if (settingToUse === 'merge') {
          result(true, settings, callback);
        } else {
          // everything else is prompt
          showDialog(settings, callback);
        }
      };

      return {
        events: events.registry,
        get: get,
        destroy: Fun.noop
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.smartpaste.Inspection',

  [

  ],

  function () {
    var isValidData = function (data) {
      // IE doesn't even have data. Spartan has data, but no types.
      return data !== undefined && data.types !== undefined && data.types !== null;
    };

    return {
      isValidData: isValidData
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.html.Transform',

  [
    'ephox.classify.Type',
    'ephox.sugar.api.Attr'
  ],

  function (Type, Attr) {
    var rotateImage = function (img, vshapeAttrs) {
      // MS Word tends to store rotated images as raw with a rotation applied
      var style = vshapeAttrs.style;
      if (Attr.has(img, 'width') && Attr.has(img, 'height') && Type.isString(style)) {
        var rotation = style.match(/rotation:([^;]*)/);
        if (rotation !== null && (rotation[1] === '90' || rotation[1] === '-90')) {
          // We can't actually rotate the binary data, so just swap the width and height.
          // When we decide to rotate the data, we can't do it here.
          Attr.setAll(img, {
            width: Attr.get(img, 'height'),
            height: Attr.get(img, 'width')
          });
        }
      }
    };

    return {
      rotateImage: rotateImage
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Comments',

  [
    'ephox.fred.PlatformDetection',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Element',
    'global!document'
  ],

  function (PlatformDetection, Fun, Element, document) {

    var regularGetNodes = function (texas) {
      var ret = [];
      while (texas.nextNode() !== null) ret.push(Element.fromDom(texas.currentNode));
      return ret;
    };

    var ieGetNodes = function (texas) {
      // IE throws an error on nextNode() when there are zero nodes available, and any attempts I made to detect this
      // just resulted in throwing away valid cases
      try {
        return regularGetNodes(texas);
      } catch (e) {
        return [];
      }
    };

    // I hate needing platform detection in Sugar, but the alternative is to always try/catch which will swallow coding errors as well
    var browser = PlatformDetection.detect().browser;
    var getNodes = browser.isIE() || browser.isSpartan() ? ieGetNodes : regularGetNodes;

    // Weird, but oh well
    var noFilter = Fun.constant(Fun.constant(true));

    var find = function (node, filterOpt) {

      var vmlFilter = filterOpt.fold(noFilter, function (filter) {
        return function (comment) {
          return filter(comment.nodeValue);
        };
      });

      // the standard wants an object, IE wants a function. But everything is an object, so let's be sneaky
      // http://www.bennadel.com/blog/2607-finding-html-comment-nodes-in-the-dom-using-treewalker.htm
      vmlFilter.acceptNode = vmlFilter;

      // TODO: Add NodeFilter to numerosity (requires IE9 so can't be a global import)
      var texas = document.createTreeWalker(node.dom(), NodeFilter.SHOW_COMMENT, vmlFilter, false);

      return getNodes(texas);
    };
    return {
      find: find
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.alien.Comments',

  [
    'ephox.perhaps.Option',
    'ephox.sugar.api.Comments',
    'ephox.violin.Strings',
    'global!document'
  ],

  function (Option, Comments, Strings, document) {

    var find = function (node) {
      // TODO: Should this be in lingo?
      return Comments.find(node, Option.some(function (value) {
        return Strings.startsWith(value, '[if gte vml 1]'); // faster than contains on huge MS office comments
      }));
    };
    return {
      find: find
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.perhaps.Options',

  [
    'ephox.perhaps.Option'
  ],

  function (Option) {
    var cat = function (arr) {
      var r = [];
      var push = function (x) {
        r.push(x);
      };
      for (var i = 0; i < arr.length; i++) {
        arr[i].each(push);
      }
      return r;
    };

    var findMap = function (arr, f) {
      for (var i = 0; i < arr.length; i++) {
        var r = f(arr[i], i);
        if (r.isSome()) {
          return r;
        }
      }
      return Option.none();
    };

    /**
    if all elements in arr are 'some', their inner values are passed as arguments to f
    f must have arity arr.length
    */
    var liftN = function(arr, f) {
      var r = [];
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i];
        if (x.isSome()) {
          r.push(x.getOrDie());
        } else {
          return Option.none();
        }
      };
      return Option.some(f.apply(null, r));
    };

    return {
      cat: cat,
      findMap: findMap,
      liftN: liftN
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.images.ImageReference',

  [
    'ephox.cement.alien.Comments',
    'ephox.compass.Arr',
    'ephox.limbo.api.RtfImage',
    'ephox.perhaps.Option',
    'ephox.perhaps.Options',
    'ephox.scullion.Struct',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Elements',
    'ephox.sugar.api.SelectorFilter',
    'global!console'
  ],

  function (Comments, Arr, RtfImage, Option, Options, Struct, Attr, Elements, SelectorFilter, console) {
    var imgData = Struct.immutable('img', 'vshape');

    var getImageAttrs = function (image) {
      var imgAttrs = getAttrs(image);
      imgAttrs._rawElement = image.dom();
      return imgAttrs;
    };

    var getVshapeAttrs = function (vshape) {
      var vsAttr = getAttrs(vshape);
      vsAttr._rawElement = vshape.dom();
      return vsAttr;
    };

    var getAttrs = function (element) {
      return Attr.clone(element);
    };

    var extract = function (raw) {
      var nodes = Elements.fromHtml(raw);
      var images = Arr.bind(nodes, function (n) {
        return SelectorFilter.descendants(n, 'img');
      });

      var comments = Arr.bind(nodes, Comments.find);
      var vshapes = Options.cat(Arr.map(comments, RtfImage.scour));

      var list = Arr.map(images, function (image) {
        return traverse(image, vshapes);
      });
      return Options.cat(list);
    };

    var traverse = function (element, vshapes) {
      var vshapeTarget = Attr.get(element, 'v:shapes');

      var vshapeOpt = Option.from(Arr.find(vshapes, function (vshape) {
        return Attr.get(vshape, 'id') === vshapeTarget;
      }));

      if (vshapeOpt.isNone()) console.log('WARNING: unable to find data for image', element.dom());

      return vshapeOpt.map(function (vshape) {
        return pack(element, vshape);
      });
    };

    var pack = function (img, vshape) {
      return imgData(
        getImageAttrs(img),
        getVshapeAttrs(vshape)
      );
    };

    return {
      extract: extract
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.photon.Reader',

  [
    'ephox.perhaps.Option',
    'ephox.sugar.api.Element'
  ],

  function (Option, Element) {

    var iframeDoc = function (element) {
      var dom = element.dom();
      try {
        var idoc = dom.contentWindow ? dom.contentWindow.document : dom.contentDocument;
        return idoc !== undefined && idoc !== null ? Option.some(Element.fromDom(idoc)) : Option.none();
      } catch (err) {
        // ASSUMPTION: Permission errors result in an unusable iframe.
        console.log('Error reading iframe: ', dom);
        console.log('Error was: ' + err);
        return Option.none();
      }
    };

    var doc = function (element) {
      var optDoc = iframeDoc(element);
      return optDoc.fold(function () {
        return element;
      }, function (v) {
        return v;
      });
    };

    return {
      doc: doc
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.photon.Writer',

  [
    'ephox.photon.Reader',
    'ephox.sugar.api.Body'
  ],

  function (Reader, Body) {

    var write = function (element, content) {
      if (!Body.inBody(element)) throw 'Internal error: attempted to write to an iframe that is not in the DOM';

      var doc = Reader.doc(element);
      var dom = doc.dom();
      dom.open();
      dom.writeln(content);
      dom.close();
    };

    return {
      write: write
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Ready',

  [
    'ephox.sugar.api.DomEvent',
    'ephox.sugar.api.Element',
    'global!document'
  ],

  function (DomEvent, Element, document) {
    var execute = function (f) {
      /*
       * We only use this in one place, so creating one listener per ready request is more optimal than managing
       * a single event with a queue of functions.
       */

      /* The general spec describes three states: loading, complete, and interactive.
       * https://html.spec.whatwg.org/multipage/dom.html#current-document-readiness
       *
       * loading: the document is not ready (still loading)
       * interactive: the document is ready, but sub-resources are still loading
       * complete: the document is completely ready.
       *
       * Note, IE and w3 schools talk about: uninitialized and loaded. We may have to handle them in the future.
       */
      if (document.readyState === 'complete' || document.readyState === 'interactive') f();
      else {
        // Note that this fires when DOM manipulation is allowed, but before all resources are
        // available. This is the best practice but might be a bit weird.
        var listener = DomEvent.bind(Element.fromDom(document), 'DOMContentLoaded', function () { // IE9 minimum
          f();
          listener.unbind();
        });
      }
    };

    return {
      execute: execute
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.keurig.loader.GWTLoader',

  [
    'ephox.fred.PlatformDetection',
    'ephox.oilspill.callback.Globaliser',
    'ephox.peanut.Fun',
    'ephox.peanut.Thunk',
    'ephox.perhaps.Option',
    'ephox.photon.Writer',
    'ephox.sugar.api.Body',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.DomEvent',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Ready',
    'ephox.sugar.api.Remove'
  ],

  function (PlatformDetection, Globaliser, Fun, Thunk, Option, Writer, Body, Css, DomEvent, Element, Insert, Ready, Remove) {
    var globaliser = Globaliser.install('ephox.keurig.init');
    var cleanFunction = Option.none();

    // IE11 can't handle loading GWT in an iframe, not with the collapse into a single JS file instead of 5 HTML files.
    // It seems to load ok in WordTest.html, though, which does it directly - worth thinking about if we ever need GWT in IE.
    var load = PlatformDetection.detect().browser.isIE() ? Fun.noop : Thunk.cached(function (baseUrl) {
      var container = Element.fromTag('div');
      if (baseUrl === undefined) throw 'baseUrl was undefined';

      var iframe = Element.fromTag('iframe');

      Css.setAll(container, {
        display: 'none'
      });

      var frameLoad = DomEvent.bind(iframe, 'load', function () {
        // called when gwt moudle has finished loading.
        var gwtInitCallback = function (cleanDocument) {
          cleanFunction = Option.some(cleanDocument);
          if (!PlatformDetection.detect().browser.isSafari()) {
            // Safari can't handle executing JS in an iframe that has been removed from the page
            Remove.remove(container);
          }
        };

        var gwtInitRef = globaliser.ephemeral(gwtInitCallback);
        var gwtjs = baseUrl + '/wordimport.js';

        Writer.write(iframe,
        '<script type="text/javascript" src="' + gwtjs + '"></script>' +
        '<script type="text/javascript">' +
          'function gwtInited () {' +
            'parent.window.' + gwtInitRef + '(com.ephox.keurig.WordCleaner.cleanDocument);' +
          '};' +
        '</script>');
        frameLoad.unbind();
      });

      Ready.execute(function () {
        Insert.append(Body.body(), container);
        Insert.append(container, iframe);
      });
    });

    var cleanDocument = function (wordHTML, merge) {
      return cleanFunction.map(function (f) {
        // TODO: This should probably do something with the log instead of throwing it away in the Java side
        return f(wordHTML, merge);
      });
    };

    var ready = function () {
      return cleanFunction.isSome();
    };

    return {
      load: load,
      cleanDocument: cleanDocument,
      ready: ready
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.keurig.api.WordCleaner',

  [
    'ephox.keurig.loader.GWTLoader'
  ],

  function (GWTLoader) {
    return function (baseUrl) {
      if (!GWTLoader.ready()) GWTLoader.load(baseUrl);

      return {
        cleanDocument: GWTLoader.cleanDocument
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.photon.Sandbox',

  [
    'ephox.peanut.Fun',
    'ephox.photon.Writer',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.DomEvent',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Remove',
    'global!setTimeout'
  ],

  function (Fun, Writer, Css, DomEvent, Element, Insert, Remove, setTimeout) {
    return function (uiContainer) {
       /**
        * Creates a sandbox to play in.
        *
        * Asynchronously creates an iframe, runs the synchronous function `f` on the DOM, and then passes the result to the callback.
        *
        * This is done so that the sandbox can guarantee the iframe has been removed from the page, and available for garbage collection, before the callback is executed.
        *
        * html:
        *   source to load into the iframe
        * f: (document -> body -> A)
        *   function that operates on the iframe DOM, passed both document reference and body element
        * callback: (A -> Unit)
        *   function that receives the output of `f` when the iframe has been cleaned up
        */
      var play = function (html, f, callback) {
        var outputContainer = Element.fromTag('div');
        var iframe = Element.fromTag('iframe');

        Css.setAll(outputContainer, {
          display: 'none'
        });

        var load = DomEvent.bind(iframe, 'load', function () {
          Writer.write(iframe, html);

          var rawDoc = iframe.dom().contentWindow.document;
          if (rawDoc === undefined) throw "sandbox iframe load event did not fire correctly";
          var doc = Element.fromDom(rawDoc);

          var rawBody = rawDoc.body;
          if (rawBody === undefined) throw "sandbox iframe does not have a body";
          var body = Element.fromDom(rawBody);

          // cache
          var result = f(doc, body);

          // unbind and remove everything
          load.unbind();
          Remove.remove(outputContainer);

          // setTimeout should allow the garbage collector to cleanup if necessary
          setTimeout(Fun.curry(callback, result), 0);
        });
        Insert.append(outputContainer, iframe);
        Insert.append(uiContainer, outputContainer);
      };

      return {
        play: play
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.impl.NodeValue',

  [
    'ephox.perhaps.Option',
    'global!Error'
  ],

  function (Option, Error) {
    return function (is, name) {
      var get = function (element) {
        if (!is(element)) throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
        return getOption(element).getOr('');
      };

      var getOption = function (element) {
        try {
          return is(element) ? Option.some(element.dom().nodeValue) : Option.none();
        } catch (e) {
          return Option.none(); // Prevent IE10 from throwing exception when setting parent innerHTML clobbers (TBIO-451).
        }
      };

      var set = function (element, value) {
        if (!is(element)) throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
        element.dom().nodeValue = value;
      };

      return {
        get: get,
        getOption: getOption,
        set: set
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Comment',

  [
    'ephox.sugar.api.Node',
    'ephox.sugar.impl.NodeValue'
  ],

  function (Node, NodeValue) {
    var api = NodeValue(Node.isComment, 'comment');

    var get = function (element) {
      return api.get(element);
    };

    var getOption = function (element) {
      return api.getOption(element);
    };

    var set = function (element, value) {
      api.set(element, value);
    };

    return {
      get: get,
      getOption: getOption,
      set: set
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Html',

  [
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert'
  ],

  function ( Element, Insert) {
    var get = function (element) {
      return element.dom().innerHTML;
    };

    var set = function (element, content) {
      element.dom().innerHTML = content;
    };

    var getOuter = function (element) {
      var container = Element.fromTag('div');
      var clone = Element.fromDom(element.dom().cloneNode(true));
      Insert.append(container, clone);
      return get(container);
    };

    return {
      get: get,
      set: set,
      getOuter: getOuter
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.vogue.css.Set',

  [
    'ephox.sugar.api.Insert'
  ],

  function (Insert) {

    var setCss = function (style, css, element) {
      if (style.dom().styleSheet)
        style.dom().styleSheet.cssText = css;  // IE
      else
        Insert.append(style, element);
    };

    return {
      setCss: setCss
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.vogue.util.Regex',

  [
  ],

  function () {
    var escape = function (text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    };

    return {
      escape: escape
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

ephox.bolt.module.api.define("global!RegExp", [], function () { return RegExp; });
(function (define, require, demand) {
define(
  'ephox.vogue.css.Url',

  [
    'ephox.compass.Obj',
    'ephox.vogue.util.Regex',
    'global!RegExp'
  ],

  function (Obj, Regex, RegExp) {
    var replace = function (css, urlPrefix, replacement) {
      var r = new RegExp('url\\(\\s*[\'"]?' + Regex.escape(urlPrefix) + '(.*?)[\'"]?\\s*\\)', 'g');
      return css.replace(r, 'url("' + replacement + '$1")');
    };

    var replaceMany = function (css, replacements) {
      var current = css;
      Obj.each(replacements, function (value, key) {
        current = replace(current, key, value);
      });
      return current;
    };

    return {
      replace: replace,
      replaceMany: replaceMany
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.vogue.api.DocStyle',

  [
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.SelectorFind',
    'ephox.vogue.css.Set',
    'ephox.vogue.css.Url',
    'global!Array'
  ],

  function (Attr, Element, Insert, SelectorFind, Set, Url, Array) {

    var styletag = function (doc) {
      var style = Element.fromTag('style', doc.dom());
      Attr.set(style, 'type', 'text/css');
      return style;
    };

    var setCss = function (style, css, doc) {
      Set.setCss(style, css, Element.fromText(css, doc.dom()));
    };

    var inject = function (css, replacements, doc) {
      var style = styletag(doc);
      var replacedCss = replacements === undefined ? css : Url.replaceMany(css, replacements);
      setCss(style, replacedCss, doc);
      var head = SelectorFind.descendant(doc, 'head').getOrDie();
      Insert.append(head, style);
    };

    var stylesheets = function (doc) {
      var domStyleSheets = doc.dom().styleSheets;
      return Array.prototype.slice.call(domStyleSheets);
    };

    return {
      stylesheets: stylesheets,
      inject: inject
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.vogue.css.Rules',

  [
    'ephox.compass.Arr',
    'ephox.scullion.Struct'
  ],

  function (Arr, Struct) {
    var ruleStruct = Struct.immutable('selector', 'style');

    var extract = function (stylesheet) {
      var domRules = stylesheet.cssRules;
      return Arr.map(domRules, function (rule) {
        var selector = rule.selectorText;
        var style = rule.style.cssText;
        if (style === undefined) {
          // This should be picked up in testing, and perhaps delete the check eventually
          throw "WARNING: Browser does not support cssText property";
        }
        return ruleStruct(selector, style);
      });
    };

    var extractAll = function (stylesheets) {
      return Arr.bind(stylesheets, extract);
    };

    return {
      extract: extract,
      extractAll: extractAll
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.vogue.api.Rules',

  [
    'ephox.vogue.css.Rules'
  ],

  function (Rules) {
    var extract = function (stylesheet) {
      return Rules.extract(stylesheet);
    };

    var extractAll = function (stylesheets) {
      return Rules.extractAll(stylesheets);
    };

    return {
      extract: extract,
      extractAll: extractAll
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.html.HtmlPaste',

  [
    'ephox.cement.html.Transform',
    'ephox.cement.images.ImageReference',
    'ephox.classify.Type',
    'ephox.compass.Arr',
    'ephox.keurig.api.WordCleaner',
    'ephox.peanut.Fun',
    'ephox.photon.Sandbox',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Comment',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Elements',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorFilter',
    'ephox.sugar.api.Traverse',
    'ephox.vogue.api.DocStyle',
    'ephox.vogue.api.Rules',
    'global!document'
  ],

  function (Transform, ImageReference, Type, Arr, WordCleaner, Fun, Sandbox, Event, Events, Attr, Class, Comment, Element, Elements, Html, Remove, SelectorFilter, Traverse, DocStyle, Rules, document) {
    var flagAttribute = 'data-textbox-image';

    var emptyString = function (s)  {
      return s === undefined || s === null || s.length === 0;
    };

    var stripImageSources = function (html) {
      var count = 1;
      return html.replace(/(<img[^>]*)src=".*?"/g, function (match, p1, offset) {
        // the actual contents are irrelevant, it just needs to be unique
        return p1 + flagAttribute + '="' + count++ +  '"';
      });
    };

    var removeFragmentComments = function (body) {
      var bodyChildren = Traverse.children(body);
      Arr.each(bodyChildren, function (c) {
        Comment.getOption(c).each(function (commentText) {
          if (commentText === 'StartFragment' || commentText === 'EndFragment') {
            Remove.remove(c);
          }
        });
      });
    };

    var insertRtfCorrelation = function (sourceImageList, tordImages) {
      Arr.each(tordImages, function (img) {
        var imageCounter = Attr.get(img, flagAttribute);
        Arr.each(sourceImageList, function (imgData) {
          var imgAttrs = imgData.img();
          var vshapeAttrs = imgData.vshape();
          if (imgAttrs[flagAttribute] == imageCounter) {
            // NOTE: If we discover more than 2 possible attributes, de-dupe with RtfImage somehow
            var spid = vshapeAttrs['o:spid'];
            var vshapeId = spid === undefined ? vshapeAttrs.id : spid;

            Transform.rotateImage(img, vshapeAttrs);

            Class.add(img, 'rtf-data-image');
            Attr.set(img, 'data-image-id', vshapeId.substr('_x0000_'.length));
            Attr.set(img, 'data-image-type', 'code');
            Attr.remove(img, flagAttribute);
          }
        });
      });
    };

    var mergeInlineStyles = function (body, stylesheets) {
      var rules = Rules.extractAll(stylesheets);
      Arr.each(rules, function (rule) {

        var matchingElements = SelectorFilter.descendants(body, rule.selector());

        Arr.each(matchingElements, function (element) {
          Attr.remove(element, 'class');
          Attr.set(element, 'style', rule.style());
        });
      });
    };

    var tordPostProcessor = function (sourceImageList, mergeStyles) {
      var sandbox = Sandbox(Element.fromDom(document.body));
      return function (dump, callback) {
        // loading dump into the sandbox *will* perform some built-in browser cleanup operations,
        // we are hoping this is a suitable replacement for the use of HTML Tidy in ELJ.
        sandbox.play(dump, function (iframeDoc, body) {
          var images = SelectorFilter.descendants(body, 'img');

          // post-tord DOM filters
          removeFragmentComments(body);
          insertRtfCorrelation(sourceImageList, images);
          if (mergeStyles) {
            mergeInlineStyles(body, DocStyle.stylesheets(iframeDoc));
          }

          return Html.get(body);
        }, callback);
      };
    };

    var cleanEnd = function (raw) {
      // Trim any weirdness that exists after the closing HTML tag.
      var i = raw.indexOf('</html>');
      return (i > -1) ? raw.substr(0, i + '</html>'.length) : raw;
    };

    return function (mergeSettings, pasteSettings) {
      var cleaner = WordCleaner(pasteSettings.baseUrl);

      var events = Events.create({
        paste: Event(['elements', 'assets']),
        error: Event(['message'])
      });

      var handler = function (raw) {
        var html = cleanEnd(raw);
        // This will only be called if we have word styles, so force true
        mergeSettings.get(true, function (settings) {
          var mergeStyles = settings.mergeOfficeStyles;

          // remove local file references, so that loading the HTML into a DOM does not trigger console warnings
          var safeHtml = stripImageSources(html);

          var sourceImageList = ImageReference.extract(safeHtml);

          var postProcess = tordPostProcessor(sourceImageList, mergeStyles);

          cleaner.cleanDocument(safeHtml, mergeStyles).fold(function () {
            events.trigger.error('errors.paste.word.notready');
          }, function (dump) {
            if (emptyString(dump)) events.trigger.paste([], []);
            else {
              // postProcess is basically String -> Future (String)
              postProcess(dump, function (tordHtml) {
                var elements = Elements.fromHtml(tordHtml);
                events.trigger.paste(elements, []);
              });
            }

          });
        });
        return true;
      };

      return {
        handler: handler,
        isSupported: Fun.constant(true),
        events: events.registry
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.images.ImagePaste',

  [
    'ephox.compass.Arr',
    'ephox.fred.PlatformDetection',
    'ephox.hermes.api.ImageAsset',
    'ephox.hermes.api.ImageExtract',
    'ephox.peanut.Fun',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'global!console'
  ],

  function (Arr, PlatformDetection, ImageAsset, ImageExtract, Fun, Event, Events, Attr, Element, console) {
    return function (pasteSettings) {
      var platform = PlatformDetection.detect();
      var CAPTUTED_EVENT = true;

      //IE & FF handle image paste conversion into base64 data URIs automatically
      var isSupported = !platform.browser.isIE() && !platform.browser.isFirefox();

      var events = Events.create({
        paste: Event(['elements', 'assets']),
        error: Event(['message'])
      });

      var readImages = function (assets) {
        return Arr.bind(assets, function (asset) {
          return ImageAsset.cata(asset,
            function (id, file, objurl, data) {
              // create an image and inject it at the current selection
              var image = Element.fromTag('img');
              Attr.set(image, 'src', objurl);
              return image;
            },
            function (id, url, raw) {
              // TODO: Is this the best way?
              console.log('Internal error: Paste operation produced an image URL instead of a Data URI: ', url);
            }
          );
        });
      };

      var actualHandler = function (clipboardItems) {
        var images = Arr.filter(clipboardItems, function (item) {
          return item.kind === 'file' && /image/.test(item.type);
        });

        var files = Arr.map(images, function (image) {
          return image.getAsFile();
        });

        ImageExtract.toAssets(files, function (assets) {
          // perform the insert (SmartPaste handles undo and focus trickery)
          var elements = readImages(assets);
          events.trigger.paste(elements, assets);
        });
        //prevent other content from coming through
        return CAPTUTED_EVENT;
      };

      var safariHandler = function () {
        events.trigger.error('safari.imagepaste');
        // prevent default paste
        return CAPTUTED_EVENT;
      };

      var imageDisabled = function () {
        events.trigger.error('errors.local.images.disallowed');
        return CAPTUTED_EVENT;
      };

      var imageHandler = platform.browser.isSafari() ? safariHandler : actualHandler;

      var handler = pasteSettings.allowLocalImages ? imageHandler : imageDisabled;

      return {
        handler: handler,
        isSupported: Fun.constant(isSupported),
        events: events.registry
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.api.CementConstants',

  [
    'ephox.cement.style.Styles',
    'ephox.peanut.Fun'
  ],

  function (Styles, Fun) {

    /*
      The filter history may not quite work as I would hope. The problem it is likely to
      have is that it might be the content's selection as well, which means that we are
      changing what is about to used as serialisation ... likely leading to issues. I think
      it just only sets valid selections, so it will probably be ok .. but the cursor will
      be jarring.

      The paste bin class is added when the paste event is being triggered in the setTimeout.
      That may be too late for it not to end up in the undo history, but currently it seems
      like it will possibly work. Adding the class directly to the element would be more reliable,
      but I haven't thought of a clean enough way to do that yet.
    */
    var bin = Styles.resolve('smartpaste-eph-bin');

    return {
      binStyle: Fun.constant(bin)
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.knoch.core.Bounce',

  [
    'global!Array'
  ],

  function (Array) {

    var bounce = function(f) {
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var me = this;
        setTimeout(function() {
          f.apply(me, args);
        }, 0);
      };
    };

    return {
      bounce: bounce
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.knoch.core.FutureOps',

  [
  ],

  function () {

    return function (nu, get) {

      /** map :: this Future a -> (a -> b) -> Future b */
      var map = function(fab) {
        return nu(function(callback) {
          get(function(a) {
            callback(fab(a));
          });
        });
      };

      /** bind :: this Future a -> (a -> Future b) -> Future b */
      var bind = function(aFutureB) {
        return nu(function(callback) {
          get(function(a) {
            aFutureB(a).get(callback);
          });
        });
      };

      /** anonBind :: this Future a -> Future b -> Future b
       *  Returns a future, which evaluates the first future, ignores the result, then evaluates the second.
       */
      var anonBind = function(futureB) {
        return nu(function(callback) {
          get(function(a) {
            futureB.get(callback);
          });
        });
      };

      return {
        get: get,
        map: map,
        bind: bind,
        anonBind: anonBind
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.knoch.future.Future',

  [
    'ephox.compass.Arr',
    'ephox.knoch.core.Bounce',
    'ephox.knoch.core.FutureOps'
  ],

  /** A future value that is evaluated on demand. The base function is re-evaluated each time 'get' is called. */
  function (Arr, Bounce, FutureOps) {

    // baseFn is a function(callback) { ... }
    var nu = function(baseFn) {

      var get = function(callback) {
        baseFn(Bounce.bounce(callback));
      };

      return FutureOps(nu, get);
    };

    /** [Future a] -> Future [a] */
    var par = function(futures) {
      return nu(function(callback) {
        var r = [];
        var count = 0;

        var cb = function(i) {
          return function(value) {
            r[i] = value;
            count++;
            if (count >= futures.length) {
              callback(r);
            }
          };
        };

        if (futures.length === 0) {
          callback([]);
        } else {
          Arr.each(futures, function(future, i) {
            future.get(cb(i));
          });
        }
      });
    };

    /** [a] -> (a -> Future b) -> Future [b] */
    var mapM = function(as, fn) {
      return par(Arr.map(as, fn));
    };

    /** (Future a, Future b) -> ((a, b) -> c) -> Future C
      * Executes the two futures in "parallel" with respect to browser JS threading.
      */
    var lift2 = function(fa, fb, abc) {
      return nu(function(callback) {
        var completeA = false;
        var completeB = false;
        var valueA = undefined;
        var valueB = undefined;

        var done = function() {
          if (completeA && completeB) {
            var c = abc(valueA, valueB);
            callback(c);
          }
        };

        fa.get(function(a) {
          valueA = a;
          completeA = true;
          done();
        });

        fb.get(function(b) {
          valueB = b;
          completeB = true;
          done();
        });
      });
    };

    return {
      nu: nu,
      par: par,
      mapM: mapM,
      lift2: lift2
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.knoch.future.CachedFuture',

  [
    'ephox.compass.Arr',
    'ephox.highway.Merger',
    'ephox.knoch.core.Bounce',
    'ephox.knoch.core.FutureOps',
    'ephox.knoch.future.Future',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  /**
   *  A future value.
   *  The base function is evaluated eagerly, and only evaluated once.
   *  Each call to 'get' queues a callback, which is invoked when the value is available.
   */
  function (Arr, Merger, Bounce, FutureOps, Future, Fun, Option) {

    // f is a function(callback) { ... }
    var nu = function (baseFn) {

      var data = Option.none();
      var callbacks = [];

      var get = function (callback) {
        isSet() ? call(callback) : callbacks.push(callback);
      };

      var set = function (x) {
        data = Option.some(x);
        run(callbacks);
        callbacks = [];
      };

      var isSet = function() {
        return data.isSome();
      };

      var run = function (cbs) {
        Arr.each(cbs, call);
      };

      var call = function(cb) {
        data.each(function(x) {
          Bounce.bounce(cb)(x);
        });
      };

      Future.nu(baseFn).get(set);

      var ops = FutureOps(nu, get);

      return Merger.merge(ops, {
        isSet: isSet
      });
    };

    return {
      nu: nu
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.pastiche.IeBlob',

  [
    'ephox.compass.Arr',
    'ephox.epithet.Resolve',
    'ephox.hermes.api.ImageExtract',
    'ephox.knoch.future.CachedFuture',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  function (Arr, Resolve, ImageExtract, CachedFuture, Fun, Option) {
    var convertURL = function (raw) {
      return raw.convertURL !== undefined ? raw.convertURL     // Use standard if available.
           : raw.msConvertURL !== undefined ? raw.msConvertURL
           : undefined;
    };

    var convert = function (raw) {
      // IE11 defines data on the window, but requires the event to convert... /headdesk
      var files = Resolve.resolve('window.clipboardData.files');

      var convert = convertURL(raw);

      if (files !== undefined && convert !== undefined && files.length > 0) {
        var blobs = Arr.map(files, function (file) {
          var blob = ImageExtract.blob(file);
          convert.apply(raw, [file, 'specified', blob.objurl()]);

          return blob;
        });

        // do the async operation in a future
        var future = CachedFuture.nu(function (callback) {
          ImageExtract.fromBlobs(blobs, callback);
        });

        // initiate the conversion immediately
        future.get(Fun.noop);

        return Option.some(future);
      } else {
        return Option.none();
      }
    };

    return {
      convert: convert
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.api.Situ',

  [
  ],

  function () {
    var on = function (element, offset) {
      return folder(function (b, o, a) {
        return o(element, offset);
      });
    };

    var before = function (element) {
      return folder(function (b, o, a) {
        return b(element);
      });
    };

    var after = function (element) {
      return folder(function (b, o, a) {
        return a(element);
      });
    };


    var folder = function(fold) {
      return {
        fold: fold
      };
    };

    return {
      on: on,
      before: before,
      after: after
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.api.SelectionRange',

  [
    'ephox.fussy.api.Situ',
    'ephox.scullion.Struct',
    'ephox.sugar.api.Element'
  ],

  function (Situ, Struct, Element) {
    var read = Struct.immutable('start', 'soffset', 'finish', 'foffset');
    var general = Struct.immutable('start', 'soffset', 'finish', 'foffset');
    var write = Struct.immutable('start', 'finish');

    var writeFromNative = function (range) {
      var start = Element.fromDom(range.startContainer);
      var finish = Element.fromDom(range.endContainer);
      return write(
        Situ.on(start, range.startOffset),
        Situ.on(finish, range.endOffset)
      );
    };

    return {
      read: read,
      general: general,
      write: write,
      writeFromNative: writeFromNative
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.api.Supported',

  [
  ],

  function () {
    var run = function (win, w3c) {
      // this is scaffolding for what was an alternate selection model.
      // We now only have one but the concept could be useful later.
      if (win.getSelection) return w3c(win, win.getSelection());
      else throw 'No selection model supported.';
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.DocumentPosition',

  [
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Traverse'
  ],

  function (Compare, Traverse ) {
    var after = function (start, soffset, finish, foffset) {
      var doc = Traverse.owner(start);

      // TODO: Find a sensible place to put the native range creation code.
      var rng = doc.dom().createRange();
      rng.setStart(start.dom(), soffset);
      rng.setEnd(finish.dom(), foffset);

      var same = Compare.eq(start, finish) && soffset === foffset;
      return rng.collapsed && !same;
    };

    return {
      after: after
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.wwwc.Directions',

  [
    'ephox.fussy.api.SelectionRange',
    'ephox.sugar.api.DocumentPosition',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Traverse'
  ],

  function (SelectionRange, DocumentPosition, Element, Traverse) {
    var isReversed = function (model) {
      return DocumentPosition.after(Element.fromDom(model.anchorNode), model.anchorOffset, Element.fromDom(model.focusNode), model.focusOffset);
    };

    var flipGet = function (model, range) {
      var start = Element.fromDom(range.startContainer);
      var finish = Element.fromDom(range.endContainer);
      return isReversed(model) ?
        SelectionRange.read(finish, range.endOffset, start, range.startOffset) :
        SelectionRange.read(start, range.startOffset, finish, range.endOffset);
    };

    var isRtlGet = function (model) {
      return isReversed(model);
    };

    var flipSet = function (start, startOffset, end, endOffset) {
      return function (model) {
        if (model.extend) {
          model.collapse(start.dom(), startOffset);
          model.extend(end.dom(), endOffset);
        } else {
          // this is IE... we can’t have a backwards range, so reverse it.
          var range = Traverse.owner(start).dom().createRange();
          range.setStart(end.dom(), endOffset);
          range.setEnd(start.dom(), startOffset);
          model.removeAllRanges();
          model.addRange(range);
        }
      };
    };

    var isRtlSet = function (start, startOffset, end, endOffset) {
      return DocumentPosition.after(start, startOffset, end, endOffset);
    };

    var read = function () {
      return {
        flip: flipGet,
        isRtl: isRtlGet
      };
    };

    var write = function () {
      return {
        flip: flipSet,
        isRtl: isRtlSet
      };
    };

    return {
      read: read,
      write: write
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.wwwc.DomRange',

  [
    'ephox.fussy.api.SelectionRange',
    'ephox.fussy.wwwc.Directions',
    'ephox.perhaps.Option',
    'ephox.sugar.api.DocumentPosition',
    'ephox.sugar.api.Element'
  ],

  function (SelectionRange, Directions, Option, DocumentPosition, Element) {

    /*
     * The approach here is to create a range using the selection. If it collapses,
     * and the inverse of the selection does not collapse ... then it is a backwards
     * selection.
     */
    var reversed = function (win, selection) {
      // Calculate the range going from start -> finish
      var startToFinish = toNativeFrom(win, selection.start(), selection.finish());
      // If it is collapsed, there is a chance that it only collapsed because it was RTL
      if (startToFinish.collapsed === true) {
        // Check that the inverted selection isn't collapsed.
        // If the inverted selection is not collapsed ... it is a backwards selection, otherwise it is just collapsed anyway
        var finishToStart = toNativeFrom(win, selection.finish(), selection.start());
        return finishToStart.collapsed === true ? Option.none() : Option.some(SelectionRange.general(
          Element.fromDom(finishToStart.endContainer),
          finishToStart.endOffset,
          Element.fromDom(finishToStart.startContainer),
          finishToStart.startOffset
        ));
      } else {
        return Option.none();
      }
    };

    var forceRange = function (win, selection) {
      var range = toNativeFrom(win, selection.start(), selection.finish());
      return range.collapsed === true ? toNativeFrom(win, selection.finish(), selection.start()) : range;
    };

    var toNativeFrom = function (win, start, finish) {
      var range = create(win);

      start.fold(function (e) {
        range.setStartBefore(e.dom());
      }, function (e, o) {
        range.setStart(e.dom(), o);
      }, function (e) {
        range.setStartAfter(e.dom());
      });

      finish.fold(function (e) {
        range.setEndBefore(e.dom());
      }, function (e, o) {
        range.setEnd(e.dom(), o);
      }, function (e) {
        range.setEndAfter(e.dom());
      });

      return range;
    };

    var toNative = function (win, selection) {
      return toNativeFrom(win, selection.start(), selection.finish());
    };

    var toExactNative = function (win, s, so, e, eo) {
      var backwards = DocumentPosition.after(s, so, e, eo);
      var range = win.document.createRange();
      if (backwards) {
        range.setStart(e.dom(), eo);
        range.setEnd(s.dom(), so);
      } else {
        range.setStart(s.dom(), so);
        range.setEnd(e.dom(), eo);
      }
      return range;
    };

    var forwards = function (win, selection) {
      var range = toNative(win, selection);

      return function (model) {
        model.addRange(range);
      };
    };

    var build = function (win, selection) {
      var backwards = reversed(win, selection);
      return backwards.fold(function () {
        return forwards(win, selection);
      }, function (range) {
        return Directions.write().flip(range.start(), range.soffset(), range.finish(), range.foffset());
      });
    };

    var create = function (win) {
      return win.document.createRange();
    };

    return {
      create: create,
      build: build,
      toNative: toNative,
      forceRange: forceRange,
      toExactNative: toExactNative
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.search.Within',

  [
    'ephox.compass.Arr',
    'ephox.fussy.wwwc.DomRange',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.SelectorFilter',
    'ephox.sugar.api.Selectors'
  ],

  function (Arr, DomRange, Element, Node, SelectorFilter, Selectors) {
    // Adapted from: http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
    var inRange = function (tempRange, range, element) {
      tempRange.selectNodeContents(element.dom());
      return tempRange.compareBoundaryPoints(range.END_TO_START, range) < 1 && tempRange.compareBoundaryPoints(range.START_TO_END, range) > -1;
    };

    var withinContainer = function (win, container, range, selector) {
      var tempRange = win.document.createRange();
      var self = Selectors.is(container, selector) ? [ container ] : [];
      var elements = self.concat(SelectorFilter.descendants(container, selector));
      return Arr.filter(elements, function (elem) {
        return inRange(tempRange, range, elem);
      });
    };

    var find = function (win, raw, selector) {
      // Reverse the selection if it is RTL when doing the comparison
      var range  = DomRange.forceRange(win, raw);
      var container = Element.fromDom(range.commonAncestorContainer);
      // Note, this might need to change when we have to start looking for non elements.
      return Node.isElement(container) ? withinContainer(win, container, range, selector) : [];
    };

    return {
      find: find
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.wwwc.Prefilter',

  [
    'ephox.fussy.api.SelectionRange',
    'ephox.fussy.api.Situ',
    'ephox.sugar.api.Node'
  ],

  function (SelectionRange, Situ, Node) {
    var beforeBr = function (element, offset) {
      return Node.name(element) === 'br' ? Situ.before(element) : Situ.on(element, offset);
    };

    var preprocess = function (selection) {
      var start = selection.start().fold(Situ.before, beforeBr, Situ.after);
      var finish = selection.finish().fold(Situ.before, beforeBr, Situ.after);
      return SelectionRange.write(start, finish);
    };

    return {
      preprocess: preprocess
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Fragment',

  [
    'ephox.compass.Arr',
    'ephox.sugar.api.Element',
    'global!document'
  ],

  function (Arr, Element, document) {
    var fromElements = function (elements, scope) {
      var doc = scope || document;
      var fragment = doc.createDocumentFragment();
      Arr.each(elements, function (element) {
        fragment.appendChild(element.dom());
      });
      return Element.fromDom(fragment);
    };

    return {
      fromElements: fromElements
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.wwwc.WwwcModel',

  [
    'ephox.fussy.api.SelectionRange',
    'ephox.fussy.wwwc.Directions',
    'ephox.fussy.wwwc.DomRange',
    'ephox.fussy.wwwc.Prefilter',
    'ephox.perhaps.Option',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Fragment'
  ],

  function (SelectionRange, Directions, DomRange, Prefilter, Option, Element, Fragment) {
    var set = function (raw) {
      return function (win, model) {
        var selection = Prefilter.preprocess(raw);
        var modifier = DomRange.build(win, selection);
        if (model !== undefined && model !== null) {
          model.removeAllRanges();
          modifier(model);
        }
      };
    };

    var selectElementContents = function (element) {
      return function (win, model) {
        var rng = DomRange.create(win);
        rng.selectNodeContents(element.dom());
        model.removeAllRanges();
        model.addRange(rng);
      };
    };

    var normaliseRange = function (win, model) {
      // In a multiple rangeset we take the first and the last item in the range, and create a new range model
      var first = model.getRangeAt(0);
      var last = model.getRangeAt(model.rangeCount - 1);
      var range = win.document.createRange();
      range.setStart(first.startContainer, first.startOffset);
      range.setEnd(last.endContainer, last.endOffset);
      return range;
    };

    var fromNative = function (model, range) {
      var start = Element.fromDom(range.startContainer);
      var finish = Element.fromDom(range.endContainer);

      return Directions.read().isRtl(model) ?
        Directions.read().flip(model, range) :
        SelectionRange.read(start, range.startOffset, finish, range.endOffset);
    };

    var getNative = function (win, model) {
      return model !== undefined && model !== null && model.rangeCount > 0 ? Option.from(normaliseRange(win, model)) : Option.none();
    };

    var get = function (win, model) {
      var range = getNative(win, model);
      return range.map(function (r) {
        return fromNative(model, r);
      });
    };

    var replace = function (elements) {
      return function (win, model) {
        var selection = getNative(win, model);
        selection.each(function (range) {
          doReplaceRange(win, range, elements);
        });
      };
    };

    var doReplaceRange = function (win, range, elements) {
      // Note: this document fragment approach may not work on IE9.
      var fragment = Fragment.fromElements(elements, win.document);
      range.deleteContents();
      range.insertNode(fragment.dom());
    };

    var replaceRange = function (raw, elements) {
      return function (win, model) {
        var selection = Prefilter.preprocess(raw);
        // NOTE: This selection has to be LTR, or the range will collapse.
        var range = DomRange.toNative(win, selection);
        doReplaceRange(win, range, elements);
      };
    };

    var deleteRange = function (s, so, e, eo) {
      return function (win, model) {
        var rng = DomRange.toExactNative(win, s, so, e, eo);
        rng.deleteContents();
      };
    };

    var cloneFragment = function (s, so, e, eo) {
      return function (win, model) {
        var rng = DomRange.toExactNative(win, s, so, e, eo);
        var fragment = rng.cloneContents();
        return Element.fromDom(fragment);
      };
    };

    var rectangleAt = function (s, so, e, eo) {
      return function (win, model) {
        var rng = DomRange.toExactNative(win, s, so, e, eo);
        var rects = rng.getClientRects();
        // ASSUMPTION: The first rectangle is the start of the selection
        var bounds = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
        return bounds.width > 0 || bounds.height > 0  ? Option.some(bounds) : Option.none();
      };
    };

    var clearSelection = function (win, model) {
      win.getSelection().removeAllRanges();
    };

    return {
      get: get,
      set: set,
      selectElementContents: selectElementContents,
      replace: replace,
      replaceRange: replaceRange,
      deleteRange: deleteRange,
      cloneFragment: cloneFragment,
      rectangleAt: rectangleAt,
      clearSelection: clearSelection
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.fussy.api.WindowSelection',

  [
    'ephox.fussy.api.SelectionRange',
    'ephox.fussy.api.Situ',
    'ephox.fussy.api.Supported',
    'ephox.fussy.search.Within',
    'ephox.fussy.wwwc.DomRange',
    'ephox.fussy.wwwc.WwwcModel',
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Element'
  ],

  function (SelectionRange, Situ, Supported, Within, DomRange, WwwcModel, Compare, Element) {
    var get = function (win) {
      return Supported.run(win, WwwcModel.get);
    };

    var set = function (win, raw) {
      Supported.run(win, WwwcModel.set(raw));
    };

    var setExact = function (win, s, so, e, eo) {
      var raw = SelectionRange.write(
        Situ.on(s, so),
        Situ.on(e, eo)
      );
      set(win, raw);
    };

    var selectElementContents = function (win, element) {
      Supported.run(win, WwwcModel.selectElementContents(element));
    };

    var replace = function (win, elements) {
      Supported.run(win, WwwcModel.replace(elements));
    };

    var replaceRange = function (win, raw, elements) {
      Supported.run(win, WwwcModel.replaceRange(raw, elements));
    };

    var deleteRange = function (win, s, so, e, eo) {
      Supported.run(win, WwwcModel.deleteRange(s, so, e, eo));
    };

    var cloneFragment = function (win, s, so, e, eo) {
      return Supported.run(win, WwwcModel.cloneFragment(s, so, e, eo));
    };

    var isCollapsed = function (s, so, e, eo) {
      return Compare.eq(s, e) && so === eo;
    };

    var rectangleAt = function (win, s, so, e, eo) {
      return Supported.run(win, WwwcModel.rectangleAt(s, so, e, eo));
    };

    var findWithin = function (win, raw, selector) {
      // Note, we don't need the getSelection() model for this.
      return Within.find(win, raw, selector);
    };

    var findWithinExact = function (win, s, so, e, eo, selector) {
      var raw = SelectionRange.write(
        Situ.on(s, so),
        Situ.on(e, eo)
      );
      // Note, we don't need the getSelection() model for this.
      return findWithin(win, raw, selector);
    };

    var deriveExact = function (win, raw) {
      var rng = DomRange.forceRange(win, raw);
      return SelectionRange.general(Element.fromDom(rng.startContainer), rng.startOffset, Element.fromDom(rng.endContainer), rng.endOffset);
    };

    var clearAll = function (win) {
      Supported.run(win, WwwcModel.clearSelection);
    };

    return {
      get: get,
      set: set,
      setExact: setExact,
      selectElementContents: selectElementContents,
      replace: replace,
      replaceRange: replaceRange,
      deleteRange: deleteRange,
      isCollapsed: isCollapsed,
      cloneFragment: cloneFragment,
      rectangleAt: rectangleAt,
      findWithin: findWithin,
      findWithinExact: findWithinExact,
      deriveExact: deriveExact,
      clearAll: clearAll
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.api.HtmlPatterns',

  [

  ],

  function () {
    return {
      validStyles: function () {
        return /^(mso-.*|tab-stops|tab-interval|language|text-underline|text-effect|text-line-through|font-color|horiz-align|list-image-[0-9]+|separator-image|table-border-color-(dark|light)|vert-align|vnd\..*)$/;
      },
      specialInline: function () {
        return /^(font|em|strong|samp|acronym|cite|code|dfn|kbd|tt|b|i|u|s|sub|sup|ins|del|var|span)$/;
      }
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.violin.StringMatch',

  [

  ],

  function () {
    var starts = function (value) {
      return folder(function (s, p, c, e, a, n) {
        return s(value);
      });
    };

    var pattern = function (regex) {
      return folder(function (s, p, c, e, a, n) {
        return p(regex);
      });
    };

    var contains = function (value) {
      return folder(function (s, p, c, e, a, n) {
        return c(value);
      });
    };

    var exact = function (value) {
      return folder(function (s, p, c, e, a, n) {
        return e(value);
      });
    };

    var all = function () {
      return folder(function (s, p, c, e, a, n) {
        return a();
      });
    };

    var not = function (sm) {
      return folder(function (s, p, c, e, a, n) {
        return n(sm);
      });
    };

    var folder = function (fold) {
      var matches = function (str) {
        return fold(function (value) {
          return str.toLowerCase().indexOf(value.toLowerCase()) === 0;
        }, function (regex) {
          return regex.test(str.toLowerCase());
        }, function (value) {
          return str.toLowerCase().indexOf(value.toLowerCase()) >= 0;
        }, function (value) {
          return str.toLowerCase() === value.toLowerCase();
        }, function () {
          return true;
        }, function (other) {
          return !other.matches(str);
        });
      };

      return {
        fold: fold,
        matches: matches
      };
    };

    var cata = function (subject, s, p, c, e, a, n) {
      return subject.fold(s, p, c, e, a, n);
    };

    return {
      starts: starts,
      pattern: pattern,
      contains: contains,
      exact: exact,
      all: all,
      not: not,
      cata: cata
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.api.RuleMatch',

  [
    'ephox.peanut.Fun',
    'ephox.sugar.api.Node',
    'ephox.violin.StringMatch'
  ],

  function (Fun, Node, StringMatch) {
    var keyval = function (element, value, key, rule) {
      var ruleName = rule.name;
      var ruleCondition = rule.condition !== undefined ? rule.condition : Fun.constant(true);
      var ruleValue = rule.value !== undefined ? rule.value : StringMatch.all();
      return ruleName.matches(key) && ruleValue.matches(value) && ruleCondition(element);
    };

    var name = function (element, rule) {
      var tag = Node.name(element);
      var ruleName = rule.name;
      var ruleCondition = rule.condition !== undefined ? rule.condition : Fun.constant(true);
      return ruleName.matches(tag) && ruleCondition(element);
    };

    return {
      keyval: keyval,
      name: name
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.cleanup.AttributeAccess',

  [
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Attr'
  ],

  function (Arr, Obj, Fun, Attr) {
    var filter = function (element, predicate) {
      var r = {};
      Arr.each(element.dom().attributes, function (a) {
        if (!predicate(a.value, a.name)) r[a.name] = a.value;
      });
      return r;
    };

    var update = function (element, names, keepers) {
      Arr.each(names, function (name) {
        Attr.remove(element, name);
      });

      Obj.each(keepers, function (v, k) {
        Attr.set(element, k, v);
      });
    };

    var clobber = function (element, supported, _unsupported) {
      var names = Arr.map(element.dom().attributes, function (attribute) {
        return attribute.name;
      });

      if (Obj.size(supported) !== names.length) update(element, names, supported);
    };

    return {
      filter: filter,
      clobber: clobber,
      // There are no hidden attributes that I know about.
      scan: Fun.constant({})
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.cleanup.StyleAccess',

  [
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Css',
    'ephox.violin.Strings'
  ],

  function (Arr, Obj, Attr, Css, Strings) {
    var separate = function (style) {
      var css = {};
      var bits = style !== undefined && style !== null ? style.split(';') : [];
      Arr.each(bits, function (bit) {
        var parts = bit.split(':');
        if (parts.length === 2) {
          css[Strings.trim(parts[0])] = Strings.trim(parts[1]);
        }
      });
      return css;
    };

    var get = function (element, property) {
      return element.dom().style.getPropertyValue(property);
    };

    var filter = function (element, predicate) {
      var r = {};
      Arr.each(element.dom().style, function (property) {
        var value = get(element, property);
        if (!predicate(value, property)) r[property] = value;
      });
      return r;
    };

    var set = function (element, property, value) {
      Css.set(element, property, value);
    };

    // Find the style for any special styles.
    var scan = function (element, special, predicate) {
      var style = element.dom().getAttribute('style');
      var css = separate(style);

      var before = {};
      Arr.each(special, function (property) {
        var value = css[property];
        if (value !== undefined && !predicate(value, property)) before[property] = value;
      });

      return before;
    };

    var serialise = function (unsupported) {
      var preserved = Obj.keys(unsupported);
      return Arr.map(preserved, function (pre) {
        return pre + ': ' + unsupported[pre];
      }).join('; ');
    };

    var clobber = function (element, supported, unsupported) {
      Attr.set(element, 'style', '');

      var numSupported = Obj.size(supported);
      var numUnsupported = Obj.size(unsupported);

      if (numSupported === 0 && numUnsupported === 0) Attr.remove(element, 'style');
      else if (numSupported === 0) Attr.set(element, 'style', serialise(unsupported));
      else {
        Obj.each(supported, function (v, k) {
          set(element, k, v);
        });

        var base = Attr.get(element, 'style');
        var extra = numUnsupported > 0 ? serialise(unsupported) + '; ' : '';
        Attr.set(element, 'style', extra + base);
      }
    };

    return {
      filter: filter,
      clobber: clobber,
      scan: scan
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.cleanup.Cleaners',

  [
    'ephox.pastiche.cleanup.AttributeAccess',
    'ephox.pastiche.cleanup.StyleAccess',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Element'
  ],

  function (AttributeAccess, StyleAccess, Fun, Element) {
    var special = [ 'mso-list' ];

    var style = function (element, predicate) {
      var unsupported = StyleAccess.scan(element, special, predicate);
      var supported = StyleAccess.filter(element, predicate);
      StyleAccess.clobber(element, supported, unsupported);
    };

    var attribute = function (element, predicate) {
      var keepers = AttributeAccess.filter(element, predicate);
      AttributeAccess.clobber(element, keepers, {});
    };

    var validateStyles = function (element) {
      var supported = StyleAccess.filter(element, Fun.constant(false));
      StyleAccess.clobber(element, supported, {});
    };

    var styleDom = function (dom, predicate) {
      style(Element.fromDom(dom), predicate);
    };

    var attributeDom = function (dom, predicate) {
      attribute(Element.fromDom(dom), predicate);
    };

    return {
      style: style,
      attribute: attribute,
      styleDom: styleDom,
      attributeDom: attributeDom,
      validateStyles: validateStyles
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Classes',

  [
    'ephox.compass.Arr',
    'ephox.sugar.api.Class',
    'global!Array'
  ],

  function (Arr, Class, Array) {
    /*
     * ClassList is IE10 minimum:
     * https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
     */

    var add = function (element, classes) {
      Arr.each(classes, function (x) {
        Class.add(element, x);
      });
    };

    var remove = function (element, classes) {
      Arr.each(classes, function (x) {
        Class.remove(element, x);
      });
    };

    var toggle = function (element, classes) {
      Arr.each(classes, function (x) {
        Class.toggle(element, x);
      });
    };

    var hasAll = function (element, classes) {
      return Arr.forall(classes, function (clazz) {
        return Class.has(element, clazz);
      });
    };

    var hasAny = function (element, classes) {
      return Arr.exists(classes, function (clazz) {
        return Class.has(element, clazz);
      });
    };

    var get = function (element) {
      var classList = element.dom().classList;
      var r = new Array(classList.length);
      for (var i = 0; i < classList.length; i++) {
        r[i] = classList.item(i);
      }
      return r;
    };

    // set deleted, risks bad performance. Be deterministic.

    return {
      add: add,
      remove: remove,
      toggle: toggle,
      hasAll: hasAll,
      hasAny: hasAny,
      get: get
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.engine.Pipeless',

  [
    'ephox.compass.Arr',
    'ephox.highway.Merger',
    'ephox.pastiche.api.RuleMatch',
    'ephox.pastiche.cleanup.Cleaners',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Classes',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorFilter'
  ],

  function (Arr, Merger, RuleMatch, Cleaners, Fun, Attr, Class, Classes, Remove, SelectorFilter) {
    var cleaner = function (type, rules, element) {
      // Use Cleaners.style or Cleaners.attribute as "type".
      type(element, function (value, key) {
        return Arr.exists(rules, function (rule) {
          return RuleMatch.keyval(element, value, key, rule);
        });
      });
    };

    var remover = function (container, strat) {
      var strategy = Merger.merge({ styles: [], attributes: [], classes: [], tags: [] }, strat);

      var elements = SelectorFilter.descendants(container, '*');
      Arr.each(elements, function (element) {
        cleaner(Cleaners.style, strategy.styles, element);
        cleaner(Cleaners.attribute, strategy.attributes, element);

        Arr.each(strategy.classes, function (rule) {
          var actual = Attr.has(element, 'class') ? Classes.get(element) : [];
          Arr.each(actual, function (act) {
            if (rule.name.matches(act)) Class.remove(element, act);
          });
        });
      });

      // Now, remove the tags.
      var postElements = SelectorFilter.descendants(container, '*');
      Arr.each(postElements, function (element) {
        var matching = Arr.exists(strategy.tags, Fun.curry(RuleMatch.name, element));
        if (matching) Remove.remove(element);
      });
    };

    var unwrapper = function (container, strat) {
      var strategy = Merger.merge({ tags: [] }, strat);

      var elements = SelectorFilter.descendants(container, '*');
      Arr.each(elements, function (element) {
        var matching = Arr.exists(strategy.tags, Fun.curry(RuleMatch.name, element));
        if (matching) Remove.unwrap(element);
      });
    };

    var transformer = function (container, strat) {
      var strategy = Merger.merge({ tags: [] }, strat);

      var elements = SelectorFilter.descendants(container, '*');
      Arr.each(elements, function (element) {
        var rule = Arr.find(strategy.tags, Fun.curry(RuleMatch.name, element));
        if (rule !== undefined && rule !== null) rule.mutate(element);
      });
    };

    var validator = function (container) {
      var elements = SelectorFilter.descendants(container, '*');
      Arr.each(elements, function (element) {
        Cleaners.validateStyles(element);
      });
    };

    return {
      remover: remover,
      unwrapper: unwrapper,
      transformer: transformer,
      validator: validator
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.engine.Token',

  [
    'ephox.compass.Obj',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element'
  ],

  function (Obj, Css, Element) {
    var START_ELEMENT_TYPE = 'startElement';
    var END_ELEMENT_TYPE = 'endElement';
    var TEXT_TYPE = 'text';
    var COMMENT_TYPE = 'comment';

    var token = function(node, endNode, syntheticStyles) {
      var tokenType;
      var tagName;
      var tokenText;

      var element = Element.fromDom(node);

      switch (node.nodeType) {
        case 1:
          if (endNode) {
            tokenType = END_ELEMENT_TYPE;
          } else {
            tokenType = START_ELEMENT_TYPE;

            Css.setAll(element, syntheticStyles || {});
          }
          if (node.scopeName !== "HTML" && node.scopeName && node.tagName && node.tagName.indexOf(':') <= 0) {
            tagName = (node.scopeName + ":" + node.tagName).toUpperCase();
          } else {
            tagName = node.tagName;
          }

          break;
        case 3:
          tokenType = TEXT_TYPE;
          tokenText = node.nodeValue;
          break;
        case 8:
          tokenType = COMMENT_TYPE;
          tokenText = node.nodeValue;
          break;
        default:
          console.log("WARNING: Unsupported node type encountered: " + node.nodeType);
          break;
      }

      var getNode = function() {
        return node;
      };

      var tag = function() {
        return tagName;
      };

      var type = function() {
        return tokenType;
      };

      var text = function() {
        return tokenText;
      };

      return {
        getNode: getNode,
        tag: tag,
        type: type,
        text: text
      };
    };

    var createStartElement = function(tag, attributes, styles, document) {
      var node = document.createElement(tag), css = "";

      Obj.each(attributes, function(value, name) {
        node.setAttribute(name, value);
      });

      return token(node, false, styles);
    };

    var createEndElement = function(tag, document) {
      return token(document.createElement(tag), true);
    };

    var createComment = function(text, document) {
      return token(document.createComment(text), false);
    };

    var createText = function(text, document) {
      return token(document.createTextNode(text));
    };

    var FINISHED = createEndElement('HTML', window.document);

    return {
      START_ELEMENT_TYPE: START_ELEMENT_TYPE,
      END_ELEMENT_TYPE: END_ELEMENT_TYPE,
      TEXT_TYPE: TEXT_TYPE,
      COMMENT_TYPE: COMMENT_TYPE,
      FINISHED: FINISHED,
      token: token,
      createStartElement: createStartElement,
      createEndElement: createEndElement,
      createComment: createComment,
      createText: createText
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.engine.Serialiser',

  [
    'ephox.pastiche.engine.Token'
  ],

  function (Token) {
    var create = function (doc) {
      var currentNode = doc.createDocumentFragment();
      var initialNode = currentNode;

      var push = function(node) {
        append(node);
        currentNode = node;
      };

      var pop = function() {
        currentNode = currentNode.parentNode;
      };

      var append = function(node) {
        currentNode.appendChild(node);
      };

      var receive = function(token) {
        var startElement = function(token) {
          var node = token.getNode().cloneNode(false);
          push(node);
        };

        var text = function(token, serializer) {
          // IE7 will crash if you clone a text node that's a URL.
          // IE8 throws an invalid argument error.
          // So while cloning may be faster, we have to create a new node here.
          var node = doc.createTextNode(token.text());
          append(node);
        };

        switch (token.type()) {
          case Token.START_ELEMENT_TYPE:
            startElement(token);
            break;
          case Token.TEXT_TYPE:
            text(token);
            break;
          case Token.END_ELEMENT_TYPE:
            pop();
            break;
          case Token.COMMENT_TYPE:
            // Ignore.
            break;
          default:
            throw { message: 'Unsupported token type: ' + token.type() };
        }
      };

      return {
        dom: initialNode,
        receive: receive,
        label: 'SERIALISER'
      };
    };

    return {
      create: create
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.engine.Tokeniser',

  [
    'ephox.pastiche.engine.Token'
  ],

  function (Token) {
    var tokenise = function(html, document) {
      var container;
      document = document || window.document;
      container = document.createElement('div');
      document.body.appendChild(container);
      container.style.position = 'absolute';
      container.style.left = '-10000px';
      container.innerHTML = html;

      nextNode = container.firstChild || Token.FINISHED;

      var nodeStack = [];
      endNode = false;

      var getTokenForNode = function(node, endTag) {
        if (node === Token.FINISHED) {
          return node;
        } else if (node) {
          return Token.token(node, endTag);
        } else {
          return undefined;
        }
      };

      var next = function() {
        var currentNode = nextNode;
        var currentEndNode = endNode;
        if (!endNode && nextNode.firstChild) {
          nodeStack.push(nextNode);
          nextNode = nextNode.firstChild;
        } else if (!endNode && nextNode.nodeType === 1) {
          // Empty element.
          endNode = true;
        } else if (nextNode.nextSibling) {
          nextNode = nextNode.nextSibling;
          endNode = false;
        } else {
          nextNode = nodeStack.pop();
          endNode = true;
        }

        if (currentNode !== Token.FINISHED && !nextNode) {
          document.body.removeChild(container);
          nextNode = Token.FINISHED;
        }

        return getTokenForNode(currentNode, currentEndNode);
      };

      var hasNext = function() {
        return nextNode !== undefined;
      };

      return {
        hasNext: hasNext,
        next: next
      };
    };

    return {
      tokenise: tokenise
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.engine.Pipeline',

  [
    'ephox.pastiche.engine.Serialiser',
    'ephox.pastiche.engine.Tokeniser'
  ],

  function (Serialiser, Tokeniser) {
    var build = function(doc, filters, sink) {
      var i, filter = sink;
      for (i = filters.length - 1; i >= 0; i--) {
        //This is calling the function defined by Filter.createFilter().
        //The best description I can come up with is "function composition using CPS".
        //Filters are run in reverse order to the loop, which is reversed so the arrays below define the order.
        //And then the sink comes last (which means it's injected on the first pass of the loop).
        // filter = filters[i](doc, filter);

        // TEMPORARY:
        filter = filters[i](filter, {}, doc);
      }
      return filter;
    };

    var run = function(doc, content, filters) {
      var sink = Serialiser.create(doc);
      var tokeniser = Tokeniser.tokenise(content, doc);
      var pipeline = build(doc, filters, sink);
      while (tokeniser.hasNext()) {
        var token = tokeniser.next();
        pipeline.receive(token);
      }
      return sink.dom;
    };

    return {
      build: build,
      run: run
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.api.HybridAction',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.engine.Pipeless',
    'ephox.pastiche.engine.Pipeline',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.Traverse'
  ],

  function (Arr, Pipeless, Pipeline, Element, Html, Remove, Traverse) {
    var removal = function (spec) {
      return function (container) {
        Pipeless.remover(container, spec);
      };
    };

    var unwrapper = function (spec) {
      return function (container) {
        Pipeless.unwrapper(container, spec);
      };
    };

    var transformer = function (spec) {
      return function (container) {
        Pipeless.transformer(container, spec);
      };
    };

    var validate = function () {
      return function (container) {
        Pipeless.validator(container);
      };
    };

    var pipeline = function (pipes) {
      return function (container) {
        var html = Html.get(container);
        var doc = Traverse.owner(container);
        var sink = Pipeline.run(doc.dom(), html, pipes);
        Remove.empty(container);
        container.dom().appendChild(sink);
      };
    };

    var go = function (doc, input, actions) {
      var container = Element.fromTag('div', doc.dom());
      container.dom().innerHTML = input;
      Arr.each(actions, function (action) {
        action(container);
      });
      return Html.get(container);
    };

    var isWordContent = function (content) {
      return content.indexOf('<o:p>') >= 0 || // IE, Safari, Opera
        content.indexOf('p.MsoNormal, li.MsoNormal, div.MsoNormal') >= 0 || // Firefox Mac
        content.indexOf('MsoListParagraphCxSpFirst') >= 0 || // Windows list only selection
        content.indexOf('<w:WordDocument>') >= 0; // Firefox Windows
    };

    return {
      removal: removal,
      unwrapper: unwrapper,
      transformer: transformer,
      validate: validate,
      pipeline: pipeline,
      isWordContent: isWordContent,
      go: go
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.api.RuleConditions',

  [
    'ephox.compass.Arr',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.PredicateExists'
  ],

  function (Arr, Attr, Html, Node, PredicateExists) {
    var isNotImage = function (elem) {
      return Node.name(elem) !== 'img';
    };

    var isImportantSpan = function (elem) {
      var attrs = elem.dom().attributes;
      var hasAttrs = attrs !== undefined && attrs !== null && attrs.length > 0;
      return Node.name(elem) === 'span' ? hasAttrs : true;
    };

    var hasContent = function (elem) {
      if (!hasNoAttributes(elem)) return true;
      else {
        return isImportantSpan(elem) && PredicateExists.descendant(elem, function (e) {
          var hasAttributes = !hasNoAttributes(e);
          var isContentTag = !Arr.contains([
            'font', 'em', 'strong', 'samp', 'acronym', 'cite', 'code', 'dfn', 'kbd', 'tt', 'b', 'i',
            'u', 's', 'sub', 'sup', 'ins', 'del', 'var', 'span'
          ], Node.name(e));

          return Node.isText(e) || hasAttributes || isContentTag;
        });
      }
    };

    var isList = function (elem) {
      return Node.name(elem) === 'ol' || Node.name(elem) === 'ul';
    };

    var isLocal = function (element) {
      var src = Attr.get(element, 'src');
      return (/^file:/).test(src);
    };

    var hasNoAttributes = function (elem) {
      if (elem.dom().attributes === undefined || elem.dom().attributes === null) return true;
      return elem.dom().attributes.length === 0 || (elem.dom().attributes.length === 1 && elem.dom().attributes[0].name === 'style');
    };

    var isEmpty = function (elem) {
      // Note, this means that things with zero width cursors are NOT considered empty
      return Html.get(elem).length === 0;
    };

    return {
      isNotImage: isNotImage,
      hasContent: hasContent,
      isList: isList,
      isLocal: isLocal,
      hasNoAttributes: hasNoAttributes,
      isEmpty: isEmpty
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.api.RuleMutations',

  [
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.Traverse'
  ],

  function (Arr, Obj, Attr, Css, Element, Html, Insert, InsertAll, Node, Remove, Traverse) {
    var changeTag = function (tag, element) {
      // We cannot use replication because it uses innerHTML rather than setting the children.
      // Which means that any further transformations done to the children are not represented
      // in the final output.
      var replica = Element.fromTag(tag);
      Insert.before(element, replica);

      var attributes = element.dom().attributes;
      Arr.each(attributes, function (attr) {
        replica.dom().setAttribute(attr.name, attr.value);
      });

      var children = Traverse.children(element);
      InsertAll.append(replica, children);
      Remove.remove(element);
      return replica;
    };

    // Adds a <br> tag to any <p> tags that are empty
    var addBrTag = function (element) {
      if (Html.get(element).length === 0) {
        Insert.append(element, Element.fromTag('br'));
      }
    };

    var properlyNest = function (element) {
      Traverse.parent(element).each(function (parent) {
        var tag = Node.name(parent);
        if (Arr.contains([ 'ol', 'ul' ], tag)) {
          var li = Element.fromTag('li');
          Css.set(li, 'list-style-type', 'none');
          Insert.wrap(element, li);
        }
      });
    };

    var fontToSpan = function (element) {
      var span = changeTag('span', element);
      var conversions = {
        face: 'font-family',
        size: 'font-size',
        color: 'font-color'
      };

      var values = {
        'font-size': {
          '1': '8pt',
          '2': '10pt',
          '3': '12pt',
          '4': '14pt',
          '5': '18pt',
          '6': '24pt',
          '7': '36pt'
        }
      };

      Obj.each(conversions, function (style, attribute) {
        if (Attr.has(span, attribute)) {
          var value = Attr.get(span, attribute);
          var cssValue = values[style] !== undefined && values[style][value] !== undefined ? values[style][value] : value;
          Css.set(span, style, cssValue);
          Attr.remove(span, attribute);
        }
      });
    };

    return {
      changeTag: changeTag,
      addBrTag: addBrTag,
      properlyNest: properlyNest,
      fontToSpan: fontToSpan
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.engine.Filter',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.engine.Token'
  ],

  function (Arr, Token) {
    var createFilter = function(actualReceiver, clientReset, label) {
      var filter = function(nextFilter, settings, document, _logger) {
        var logger = _logger !== undefined ? _logger : [];

        var deferred;
        var receivedTokens, emittedTokens, inTransaction = false;

        var resetState = function() {
          if (clientReset) clientReset(api);
          inTransaction = false;
          receivedTokens = [];
          emittedTokens = [];
        };

        var emitTokens = function(tokens) {
          Arr.each(tokens, function(tok) {
            nextFilter.receive(tok);
          });
        };

        var emit = function(token) {
          if (inTransaction) {
            emittedTokens.push(token);
          } else {
            nextFilter.receive(token);
          }
        };

        var receive = function(token) {
          if (clientReset) receivedTokens.push(token);
          actualReceiver(api, token);
          if (token === Token.FINISHED) {
            commit();
          }
        };

        var startTransaction = function() {
          inTransaction = true;
        };

        var rollback = function() {
          emitTokens(receivedTokens);
          resetState();
        };

        var commit = function() {
          emitDeferred();
          emitTokens(emittedTokens);
          resetState();
        };

        var defer = function(token) {
          deferred = deferred || [];
          deferred.push(token);
        };

        var hasDeferred = function() {
          return deferred && deferred.length > 0;
        };

        var emitDeferred = function() {
          Arr.each(deferred || [], function(token) {
            emit(token);
          });
          dropDeferred();
        };

        var dropDeferred = function() {
          deferred = [];
        };

        var api = {
          document: document || window.document,
          settings: settings || {},
          emit: emit,
          receive: receive,
          startTransaction: startTransaction,
          rollback: rollback,
          commit: commit,
          defer: defer,
          hasDeferred: hasDeferred,
          emitDeferred: emitDeferred,
          dropDeferred: dropDeferred,
          label: label
        };

        resetState();
        return api;
      };
      return filter;
    };

    return {
      createFilter: createFilter
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.engine.TokenUtil',

  [
    'ephox.pastiche.cleanup.StyleAccess',
    'ephox.pastiche.engine.Token',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element'
  ],

  function (StyleAccess, Token, Fun, Attr, Css, Element) {
    var getAttribute = function (token, property) {
      var element = Element.fromDom(token.getNode());
      return Attr.get(element, property);
    };

    var getStyle = function (token, property) {
      var element = Element.fromDom(token.getNode());
      return Css.get(element, property);
    };

    var isWhitespace = function (token) {
      return token.type() === Token.TEXT_TYPE &&  /^[\s\u00A0]*$/.test(token.text());
    };

    var getMsoList = function (token) {
      var element = Element.fromDom(token.getNode());
      var styles = StyleAccess.scan(element, [ 'mso-list' ], Fun.constant(false));
      return styles['mso-list'];
    };

    return {
      getAttribute: getAttribute,
      getStyle: getStyle,
      isWhitespace: isWhitespace,
      getMsoList: getMsoList
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.detect.ListSymbols',

  [
    'ephox.compass.Arr',
    'ephox.highway.Merger'
  ],

  function (Arr, Merger) {

    var orderedListTypes = [
      { regex: /^\(?[dc][\.\)]$/, type: { tag: 'OL', type: 'lower-alpha' } },
      { regex: /^\(?[DC][\.\)]$/, type: { tag: 'OL', type: 'upper-alpha' } },
      { regex: /^\(?M*(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})[\.\)]$/, type: { tag: 'OL', type: 'upper-roman' } },
      { regex: /^\(?m*(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})[\.\)]$/, type: { tag: 'OL', type: 'lower-roman' } },
      { regex: /^\(?[0-9]+[\.\)]$/, type: { tag: 'OL' } },
      { regex: /^([0-9]+\.)*[0-9]+\.?$/, type: { tag: 'OL', variant: 'outline' } },
      { regex: /^\(?[a-z]+[\.\)]$/, type: { tag: 'OL', type: 'lower-alpha' } },
      { regex: /^\(?[A-Z]+[\.\)]$/, type: { tag: 'OL', type: 'upper-alpha' } }
    ];

    var ulChars = {
      '\u2022': { tag: 'UL', type: 'disc' },
      '\u00B7': { tag: 'UL', type: 'disc' },
      '\u00A7': { tag: 'UL', type: 'square' }
    };

    var ulNonSymbolChars = {
      'o': { tag: 'UL', type: 'circle' },
      '-': { tag: 'UL', type: 'disc' },
      '\u25CF': { tag: 'UL', type: 'disc' },
      '�': { tag: 'UL', type: 'circle' }
    };

    var getVariant = function (type, text) {
      if (type.variant !== undefined) return type.variant;
      else if (text.charAt(0) === '(') return '()';
      else if (text.charAt(text.length - 1) === ')') return ')';
      else return '.';
    };

    var getStart = function (text) {
      var number = parseInt(text, 10);
      return isNaN(number) ? { } : { start: number };
    };

    var match = function (text, inSymbol) {
      var nonSymbols = ulNonSymbolChars[text] ? [ ulNonSymbolChars[text] ] : [];
      var symbols = inSymbol && ulChars[text] ? [ ulChars[text] ] : inSymbol ? [{ tag: 'UL', variant: text }] : [];
      var ordered = Arr.bind(orderedListTypes, function (o) {
        return o.regex.test(text) ? [ Merger.merge(o.type, getStart(text), {
          variant: getVariant(o.type, text)
        })] : [];
      });

      var result = nonSymbols.concat(symbols).concat(ordered);
      return Arr.map(result, function (x) {
        return x.variant !== undefined ? x : Merger.merge(x, {
          variant: text
        });
      });
    };

    return {
      match: match
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.detect.ListGuess',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.list.detect.ListSymbols',
    'ephox.perhaps.Option',
    'ephox.violin.Strings'
  ],

  function (Arr, ListSymbols, Option, Strings) {

    var guess = function(bulletInfo, preferredType) {
      var text = bulletInfo ? Strings.trim(bulletInfo.text) : '';
      var symbolFont = bulletInfo ? !!bulletInfo.symbolFont : false;
      var candidates = ListSymbols.match(text, symbolFont);
      var preferred = Arr.find(candidates, function (c) {
        // The original code only ran preferred types for ordered lists. I have
        // no idea whether this is a condition that we want preserved, but one
        // of the QUnit tests implicitly stated it is.
        return c.tag === 'UL' || (preferredType && eqListType(c, preferredType, true));
      });
      return preferred !== undefined ? Option.some(preferred) :
        candidates.length > 0 ? Option.some(candidates[0]) : Option.none();
    };

    var eqListType = function(t1, t2, ignoreVariant) {
      return t1 === t2 ||
        (t1 && t2 && t1.tag === t2.tag && t1.type === t2.type &&
            (ignoreVariant || t1.variant === t2.variant));
    };

    return {
      guess: guess,
      eqListType: eqListType
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.detect.ListTypes',

  [
    'ephox.pastiche.engine.Token',
    'ephox.pastiche.engine.TokenUtil',
    'ephox.pastiche.list.detect.ListGuess'
  ],

  function (Token, TokenUtil, ListGuess) {

    var guess = function(bulletInfo, preferredType, originalToken) {
      var candidate = ListGuess.guess(bulletInfo, preferredType);
      return candidate.fold(function () {
        return null;
      }, function (c) {
        if (c.tag === 'OL' && originalToken && (originalToken.tag() !== 'P' || /^MsoHeading/.test(TokenUtil.getAttribute(originalToken, 'class')))) {
          // Don't convert numbered headings but do convert bulleted headings.
          listType = null;
        } else {
          return c;
        }
      });
    };

    var eqListType = ListGuess.eqListType;

    var checkFont = function(token, symbolFont) {
      if (token.type() == Token.START_ELEMENT_TYPE) {
        font = TokenUtil.getStyle(token, 'font-family');
        if (font) {
          symbolFont = (font === 'Wingdings' || font === 'Symbol');
        } else if (/^(P|H[1-6]|DIV)$/.test(token.tag())) {
          symbolFont = false;
        }
      }
      return symbolFont;
    };

    return {
      guess: guess,
      eqListType: eqListType,
      checkFont: checkFont
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Microsoft',

  [
    'ephox.pastiche.engine.Token',
    'ephox.pastiche.engine.TokenUtil'
  ],

  function (Token, TokenUtil) {
    var isList = function (state, token) {
      var style = TokenUtil.getMsoList(token);
      return style && style !== 'skip';
    };

    var isIgnore = function (state, token) {
      return token.type() == Token.START_ELEMENT_TYPE && TokenUtil.getMsoList(token) === 'Ignore';
    };

    return {
      isList: isList,
      isIgnore: isIgnore
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Tags',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.engine.Token',
    'ephox.violin.Strings'
  ],

  function (Arr, Token, Strings) {
    var isStart = function (state, token) {
      return token.type() === Token.START_ELEMENT_TYPE;
    };

    var isEnd = function (state, token) {
      return token.type() === Token.END_ELEMENT_TYPE;
    };

    var isTag = function (tag) {
      return function (state, token) {
        return token.tag() === tag;
      };
    };

    var isWhitespace = function (tag) {
      return function (state, token) {
        return isTag(tag)(state, token) && Strings.trim(token.getNode().textContent) === '';
      };
    };

    var isStartOf = function (tag) {
      return function (state, token) {
        return isStart(state, token) && token.tag() === tag;
      };
    };

    var isEndOf = function (tag) {
      return function (state, token) {
        return isEnd(state, token) && token.tag() === tag;
      };
    };

    var isStartAny = function (tags) {
      return function (state, token) {
        return isStart(state, token) && Arr.contains(tags, token.tag());
      };
    };

    var isEndAny = function (tags) {
      return function (state, token, tags) {
        return isEnd(state, token) && Arr.contains(tags, token.tag());
      };
    };

    return {
      isStart: isStart,
      isEnd: isEnd,
      isTag: isTag,
      isStartOf: isStartOf,
      isEndOf: isEndOf,
      isStartAny: isStartAny,
      isEndAny: isEndAny,
      isWhitespace: isWhitespace
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Paragraphs',

  [
    'ephox.pastiche.inspect.Microsoft',
    'ephox.pastiche.inspect.Tags'
  ],

  function (Microsoft, Tags) {
    // MOVE ME.
    var isNormal = function (state, token) {
      return !state.skippedPara.get() && Tags.isStart(state, token, 'P') && !Microsoft.isList(state, token);
    };

    return {
      isNormal: isNormal
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Texts',

  [
    'ephox.pastiche.engine.Token',
    'ephox.pastiche.engine.TokenUtil',
    'ephox.violin.Strings'
  ],

  function (Token, TokenUtil, Strings) {
    var isWhitespace = function (state, token) {
      return is(state, token) && TokenUtil.isWhitespace(token);
    };

    var is = function (state, token) {
      return token.type() === Token.TEXT_TYPE;
    };

    var eq = function (value) {
      return function (state, token) {
        return is(state, token) && token.text() === value;
      };
    };

    var matches = function (value) {
      return function (state, token) {
        return is(state, token) && value.test(token.text());
      };
    };

    // CHECK: Is this equivalent to isWhitespace?
    var isBlank = function (state, token) {
      return is(state, token) && Strings.trim(token.text()) === '';
    };

    return {
      isWhitespace: isWhitespace,
      is: is,
      isBlank: isBlank,
      eq: eq,
      matches: matches
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.Handler',

  [
    'ephox.peanut.Fun'
  ],

  function (Fun) {
    return function (pred, action, label) {
      return {
        pred: pred,
        action: action,
        label: Fun.constant(label)
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.Handlers',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  function (Arr, Fun, Option) {
    var logger = function (label, action) {
      return function (api, state, token) {
        // console.log('LOGGER: ', label, token.getNode().cloneNode(false));
        return action(api, state, token);
      };
    };

    return function (name, handlers, fallback) {
      var logFallback = logger(name + ' :: FALLBACK --- ', fallback);

      var r = function (api, state, token) {
        // console.log('token: ', token.getNode().cloneNode(true));
        var match = Option.from(Arr.find(handlers, function (x) {
          return x.pred(state, token);
        }));

        var action = match.fold(Fun.constant(logFallback), function (m) {
          var label = m.label();
          return label === undefined ? m.action : logger(name + ' :: ' + label, m.action);
        });
        action(api, state, token);
      };

      r.toString = function () { return 'Handlers for ' + name; };
      return r;
    };


  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.state.Transitions',

  [
  ],

  function () {
    var next = function (state, listState) {
      if (state === undefined || listState === undefined) {
        console.trace();
        throw 'brick';
      }
      state.nextFilter.set(listState);
    };

    var setNext = function (listState) {
      return function (api, state, token) {
        next(state, listState);
      };
    };

    var go = function (api, state, token) {
      var nextFilter = state.nextFilter.get();
      nextFilter(api, state, token);
    };

    var jump = function (listState) {
      return function (api, state, token) {
        next(state, listState);
        go(api, state, token);
      };
    };

    var isNext = function (state, listState) {
      return state.nextFilter.get() === listState;
    };

    return {
      next: next,
      go: go,
      jump: jump,
      isNext: isNext,
      setNext: setNext
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.AfterListState',

  [
    'ephox.pastiche.inspect.Paragraphs',
    'ephox.pastiche.inspect.Texts',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Transitions'
  ],

  function (Paragraphs, Texts, Handler, Handlers, Transitions) {
    var run = function (skipEmptyParaState, noListState) {

      var blankAction = function (api, state, token) {
        api.defer(token);
      };

      var normalParaAction = function (api, state, token) {
        state.openedTag.set(token);
        api.defer(token);
        Transitions.next(state, skipEmptyParaState);
      };

      var fallback = function (api, state, token) {
        noListState(api, state, token);
      };

      return Handlers('AfterListState', [
        Handler(Texts.isBlank, blankAction, 'blank text'),
        Handler(Paragraphs.isNormal, normalParaAction, 'normal paragraph')
      ], fallback);
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.States',

  [
    'ephox.pastiche.engine.Token'
  ],

  function (Token) {
    // MOVE ME?
    var isCloser = function (state, token) {
      return token.type() === Token.END_ELEMENT_TYPE && state.originalToken.get() && token.tag() === state.originalToken.get().tag();
    };

    return {
      isCloser: isCloser
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.AfterNoBulletListState',

  [
    'ephox.pastiche.inspect.States',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Transitions'
  ],

  function (States, Handler, Handlers, Transitions) {
    var run = function (afterListState) {

      var action = function (api, state, token) {
        Transitions.next(state, afterListState);
        /*
          I think that this should be 0, but it breaks qUnit test cases in powerpaste if it isn't -1. Probably
          need to look into it in more detail. The level 0 check in ListModel in the emitter should
          take care of it anyway.
        */
        state.styleLevelAdjust.set(-1);
        api.emit(token);
      };

      var fallback = function (api, state, token) {
        api.emit(token);
      };

      return Handlers('AfterNoBullet', [
        Handler(States.isCloser, action, ' closing open tag')
      ], fallback);
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Images',

  [
    'ephox.pastiche.inspect.Tags'
  ],

  function (Tags) {

    var isEnd = Tags.isEndOf('IMG');
    var isStart = Tags.isStartOf('IMG');

    return {
      isStart: isStart,
      isEnd: isEnd
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Markers',

  [
    'ephox.pastiche.engine.Token'
  ],

  function (Token) {

    var is = function (state, token) {
      return token.tag() === 'A' || token.tag() === 'SPAN';
    };

    var isStart = function (state, token) {
      return token.type() === Token.START_ELEMENT_TYPE && is(state, token);
    };

    var isEnd = function (state, token) {
      return token.type() === Token.END_ELEMENT_TYPE && is(state, token);
    };

    return {
      isStart: isStart,
      isEnd: isEnd,
      is: is
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.state.Spans',

  [
    'ephox.pastiche.list.state.Transitions'
  ],

  function (Transitions) {
    var deferAndPop = function (api, state, token) {
      api.defer(token);
      pop(api, state, token);
    };

    var deferAndPush = function (api, state, token) {
      api.defer(token);
      push(api, state, token);
    };

    var push = function (api, state, token) {
      state.spanCount.get().push(token);
    };

    var pop = function (api, state, token) {
      state.spanCount.get().pop();
    };

    var pushThen = function (listState) {
      return function (api, state, token) {
        push(api, state, token);
        Transitions.next(state, listState);
      };
    };

    var popThen = function (listState) {
      return function (api, state, token) {
        pop(api, state, token);
        Transitions.next(state, listState);
      };
    };

    return {
      deferAndPush: deferAndPush,
      deferAndPop: deferAndPop,
      push: push,
      pop: pop,
      pushThen: pushThen,
      popThen: popThen
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.BeforeSpacerState',

  [
    'ephox.pastiche.inspect.Images',
    'ephox.pastiche.inspect.Markers',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Spans',
    'ephox.peanut.Fun'
  ],

  function (Images, Markers, Handler, Handlers, Spans, Fun) {
    var run = function (spacerState, closeSpansState, unexpectedToken) {

      var fallback = function (api, state, token) {
        unexpectedToken(api, token);
      };

      return Handlers('BeforeSpacer', [
        Handler(Markers.isStart, Spans.pushThen(spacerState), 'start marker'),
        Handler(Markers.isEnd, Spans.popThen(closeSpansState), 'end marker'),
        Handler(Images.isEnd, Fun.noop, 'end image')
      ], fallback);

    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Comments',

  [
    'ephox.pastiche.engine.Token'
  ],

  function (Token) {

    var is = function (state, token) {
      return token.type() === Token.COMMENT_TYPE;
    };

    var isNotEndIf = function (state, token) {
      return is(state, token) && token.text() !== '[endif]';
    };

    var isEndIf = function (state, token) {
      return is(state, token) && token.text() === '[endif]';
    };

    var isListSupport = function (state, token) {
      return is(state, token) && token.text() === '[if !supportLists]';
    };

    return {
      is: is,
      isNotEndIf: isNotEndIf,
      isEndIf: isEndIf,
      isListSupport: isListSupport
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Logic',

  [
    'ephox.compass.Arr'
  ],

  function (Arr) {
    var any = function (conditions) {
      return function (state, token) {
        return Arr.exists(conditions, function (c) {
          return c(state, token);
        });
      };
    };

    var all = function (conditions) {
      return function (state, token) {
        return Arr.forall(conditions, function (c) {
          return c(state, token);
        });
      };
    };

    return {
      any: any,
      all: all
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.CloseSpansState',

  [
    'ephox.pastiche.inspect.Comments',
    'ephox.pastiche.inspect.Logic',
    'ephox.pastiche.inspect.Markers',
    'ephox.pastiche.inspect.Tags',
    'ephox.pastiche.inspect.Texts',
    'ephox.pastiche.list.detect.ListTypes',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Spans',
    'ephox.pastiche.list.state.Transitions',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.perhaps.Result'
  ],

  function (Comments, Logic, Markers, Tags, Texts, ListTypes, Handler, Handlers, Spans, Transitions, Fun, Option, Result) {
    var run = function (itemContentState, unexpectedToken) {

      var getListType = function (state) {
        var currentType = state.emitter.getCurrentListType();
        var currentLevel = state.emitter.getCurrentLevel();
        // FIX: Don't coerce types.
        var preferred = currentLevel == state.itemLevel.get() ? currentType : null;
        return Option.from(ListTypes.guess(state.bulletInfo.get(), preferred, state.originalToken.get()));
      };

      var openItem = function (api, state, token) {
        state.emitter.openItem(state.itemLevel.get(), state.originalToken.get(), state.listType.get(), state.skippedPara.get());
        api.emitDeferred();
        while (state.spanCount.get().length > 0) {
          api.emit(state.spanCount.get().shift());
        }
      };

      var updateState = function (state, token) {
        Transitions.next(state, itemContentState);
        if (state.commentMode.get()) {
          var indent = state.indentGuesser.guessIndentLevel(token, state.originalToken.get(), state.styles, state.bulletInfo.get());
          state.itemLevel.set(indent);
        }
      };

      var tryItem = function (api, state, token) {
        var listType = getListType(state);
        return listType.fold(function () {
          state.listType.set(null);
          return Result.error("Unknown list type: "  + state.bulletInfo.get().text + " Symbol font? " + state.bulletInfo.get().symbolFont);
        }, function (type) {
          state.listType.set(type);
          return Result.value(openItem);
        });
      };

      var updateAndEmit = function (api, state, token) {
        updateState(state, token);
        var emitter = tryItem(api, state, token);
        emitter.fold(function (msg) {
          console.log(msg);
          api.rollback();
        }, function (x) {
          x(api, state, token);
          api.emit(token);
        });
      };

      var skipComment = function (api, state, token) {
        updateState(state, token);
        var emitter = tryItem(api, state, token);
        emitter.fold(function (msg) {
          console.log(msg);
          api.rollback();
        }, function (x) {
          x(api, state, token);
        });
      };

      var handlers = [
        Handler(Logic.any([ Texts.is, Tags.isStart ]), updateAndEmit, 'text or start tag'),
        Handler(Comments.isNotEndIf, updateAndEmit, 'non-endif comment'),
        Handler(Comments.isEndIf, skipComment, 'endif comment'),
        Handler(Markers.isEnd, Spans.pop, 'end marker'),
        Handler(Tags.isEnd, Fun.noop, 'end tag')
      ];

      return Handlers('CloseSpans', handlers, function (api, state, token) {
        unexpectedToken(api, token);
      });
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.FindListTypeState',

  [
    'ephox.pastiche.inspect.Images',
    'ephox.pastiche.inspect.Markers',
    'ephox.pastiche.inspect.Texts',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Spans',
    'ephox.pastiche.list.state.Transitions',
    'ephox.peanut.Fun'
  ],

  function (Images, Markers, Texts, Handler, Handlers, Spans, Transitions, Fun) {
    var run = function (beforeSpacerState, unexpectedToken) {
      var action = function (bullets) {
        return function (api, state, token) {
          Transitions.next(state, beforeSpacerState);
          state.bulletInfo.set(bullets(state, token));
        };
      };

      var textAction = action(function (state, token) {
        return {
          text: token.text(),
          symbolFont: state.symbolFont.get()
        };
      });

      var imageAction = action(function (state, token) {
        // Custom list image type.  We can't access the image so use a normal bullet instead.
        // EditLive! may want this to come through as a CSS reference.
        return {
          text: '\u2202',
          symbolFont: true
        };
      });

      var fallback = function (api, state, token) {
        unexpectedToken(api, token);
      };

      return Handlers('FindListType', [
        Handler(Texts.isWhitespace, Fun.noop, 'text is whitespace'),
        Handler(Texts.is, textAction, 'text'),
        Handler(Markers.isStart, Spans.push, 'start marker'),
        Handler(Markers.isEnd, Spans.pop, 'end marker'),
        Handler(Images.isStart, imageAction, 'start image')
      ], fallback);
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.ItemContentState',

  [
    'ephox.pastiche.inspect.States',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Transitions'
  ],

  function (States, Handler, Handlers, Transitions) {
    var run = function (afterListState) {

      var closeItem = function (api, state, token) {
        Transitions.next(state, afterListState);
        state.skippedPara.set(false);
      };

      var handlers = [
        Handler(States.isCloser, closeItem, 'Closing open tag')
      ];

      return Handlers('ItemContentState', handlers, function (api, state, token) {
        api.emit(token);
      });
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.state.CommentOff',

  [
    'ephox.pastiche.inspect.Comments',
    'ephox.pastiche.inspect.Texts'
  ],

  function (Comments, Texts) {
    var isText = function (state, token) {
      return !state.commentMode.get() && Texts.is(state, token);
    };

    var isComment = function (state, token) {
      return !state.commentMode.get() && Comments.is(state, token);
    };

    return {
      isText: isText,
      isComment: isComment
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.state.CommentOn',

  [
    'ephox.pastiche.engine.TokenUtil',
    'ephox.pastiche.inspect.Comments',
    'ephox.pastiche.inspect.Texts'
  ],

  function (TokenUtil, Comments, Texts) {
    var isText = function (state, token) {
      return state.commentMode.get() && Texts.is(state, token);
    };

    var isComment = function (state, token) {
      return state.commentMode.get() && Comments.is(state, token);
    };

    var isUnstyled = function (state, token) {
      var style = TokenUtil.getAttribute(token, 'style');
      return state.commentMode.get() && style === "" || style === null;
    };

    return {
      isText: isText,
      isComment: isComment,
      isUnstyled: isUnstyled
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.ListStartState',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.inspect.Logic',
    'ephox.pastiche.inspect.Microsoft',
    'ephox.pastiche.inspect.Tags',
    'ephox.pastiche.inspect.Texts',
    'ephox.pastiche.list.detect.ListSymbols',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.CommentOff',
    'ephox.pastiche.list.state.CommentOn',
    'ephox.pastiche.list.state.Spans',
    'ephox.pastiche.list.state.Transitions',
    'ephox.peanut.Fun'
  ],

  function (Arr, Logic, Microsoft, Tags, Texts, ListSymbols, Handler, Handlers, CommentOff, CommentOn, Spans, Transitions, Fun) {
    var run = function (findListTypeState, afterNoBulletListState, unexpectedToken) {

      /* In one of the adhoc tests on Word 2007, Win XP ... a span with a massive number of nbsp was
      added at the ListStart stage. This was added to jump to the end of it. */
      var skipWhitespace = function () {
        return Handlers('TESTER', [
          Handler(Tags.isEndOf('SPAN'), Transitions.setNext(result), 'Finishing span'),
          Handler(Texts.isWhitespace, Fun.noop, 'Is whitespace')
        ], function (api, state, token) {
          unexpectedToken(api, token);
        });
      };

      var noBullet = function (api, state, token) {
        // List type without a bullet, we should treat it as a paragraph.

        // What about if it is 1. or something similar?
        var start = state.originalToken.get();
        var spans = state.spanCount.get();
        state.emitter.closeAllLists();
        api.emit(start);
        Arr.each(spans, api.emit);
        api.emit(token);
        api.commit();
        state.originalToken.set(start);
        Transitions.next(state, afterNoBulletListState);
      };

      var isBulletSymbol = function (s, t) {
        return Texts.is(s, t) && ListSymbols.match(t.text(), s.symbolFont.get()).length > 0;
      };

      var result = function (api, state, token) {
        if (Microsoft.isIgnore(state, token)) {
          Transitions.next(state, findListTypeState);
        }

        var r = Handlers('ListStartState', [
          Handler(
            Logic.all([ Tags.isStartOf('SPAN'), CommentOn.isUnstyled ]),
            Spans.pushThen(findListTypeState),
            'unstyled span'
          ),

          // This handler was added due to adhoc Word 2007 XP content. It breaks QUnit tests.
          /* Handler(Logic.all([ Tags.isStart, Tags.isWhitespace('SPAN') ]), Transitions.setNext(skipWhitespace()), 'a whitespace tag'), */
          Handler(Tags.isStartOf('SPAN'), Spans.push, 'starting span'),
          Handler(Tags.isStartOf('A'), Spans.push, 'starting a'),
          Handler(Tags.isEndOf('A'), Spans.pop, 'ending a'),
          Handler(CommentOn.isText, Transitions.jump(findListTypeState), 'commentOn -> text'),
          // This handler is new. It may be a problem.
          Handler(isBulletSymbol, Transitions.jump(findListTypeState), 'mogran :: text is [1-9].'),
          Handler(Texts.is, noBullet, 'text'),
          Handler(CommentOff.isComment, Fun.noop, 'commentOff -> comment'),

          // This was added to handle more gracefully the images in some of the test data. May be wrong.
          Handler(Tags.isStartOf('IMG'), Transitions.jump(findListTypeState), 'mogran :: start image tag')
        ], function (api, state, token) {
          unexpectedToken(api, token);
        });

        return r(api, state, token);
      };

      result.toString = function () { return 'Handlers for ListStartState'; };
      return result;
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Browser',

  [
    'ephox.pastiche.engine.Token',
    'ephox.pastiche.inspect.Microsoft',
    'global!document',
    'global!navigator'
  ],

  function (Token, Microsoft, document, navigator) {
    var supportsCustomStyles = function () {
      // Firefox 4 preserves these styles in the DOM, but strips them when pasting.
      // Since we can't trigger a paste there's no way to detect this situation apart from sniffing.
      if (navigator.userAgent.indexOf('Gecko') > 0 && navigator.userAgent.indexOf('WebKit') < 0) return false;
      var div = document.createElement('div');
      try {
        div.innerHTML = '<p style="mso-list: Ignore;">&nbsp;</p>';
      } catch (ex) {
        // Can't set innerHTML if we're in XHTML mode so just assume we don't get custom styles.
        return false;
      }

      var token = Token.token(div.firstChild);
      // INVESTIGATE: Does this need to be lowercased?
      return Microsoft.isIgnore({}/*state*/, token);
    };

    return {
      supportsCustomStyles: supportsCustomStyles
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.detect.ImageList',

  [
  ],

  function () {
    var is = function (state, node, symbol) {
      var alt = node !== undefined && node !== null && node.getAttribute !== undefined && node.getAttribute !== null ? node.getAttribute('alt') : '';
      // The check here for === * is because we are disabling image lists as they
      // interfere with regular images. The one exception where it is reasonable
      // to assume it is a list is if the alt text is *.
      return !!node && node.tagName === 'IMG' && alt === '*';
    };

    return {
      is: is
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.detect.TextList',

  [
    'ephox.pastiche.list.detect.ListTypes',
    'ephox.violin.Strings'
  ],

  function (ListTypes, Strings) {
    var is = function (state, rawNode, symbol) {
      var node = rawNode;
      var value = node.nodeValue;
      if (!Strings.trim(value)) {
        // This handles the case where there's a SPAN with nbsps before the bullet such as with roman numerals.
        node = node.parentNode.nextSibling;
        value = node ? node.nodeValue : '';
      }

      // Real lists have the bullet with NBSPs either side surrounded in a SPAN.  If there's anything else, it's not a list.
      if (!node || Strings.trim(node.parentNode.textContent) != value) {
        return false;
      }
      listType = ListTypes.guess({ text: value, symbolFont: symbol }, null, state.originalToken.get());

      if (listType) {

        // Don't convert numbered headings to lists.
        var r = !!node.nextSibling && node.nextSibling.tagName === 'SPAN' && /^[\u00A0\s]/.test(node.nextSibling.firstChild.nodeValue) &&
            (state.openedTag.get().tag() === 'P' || listType.tag === 'UL');
        return r;
      } else {
        return false;
      }
    };

    return {
      is: is
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.detect.ListDetect',

  [
    'ephox.highway.Merger',
    'ephox.pastiche.inspect.Tags',
    'ephox.pastiche.list.detect.ImageList',
    'ephox.pastiche.list.detect.TextList'
  ],

  function (Merger, Tags, ImageList, TextList) {

    var update = function (output) {
      var node = output.node;
      var font = node.style.fontFamily;
      return font ? Merger.merge(output, { symbol: (font === 'Wingdings' || font === 'Symbol') }) : output;
    };

    var hasMarkerFirst = function (node) {
      return !!node.firstChild && (node.firstChild.tagName === 'SPAN' || node.firstChild.tagName === 'A');
    };

    var findItem = function (node) {
      var output = update({ node: node });

      var initialEmptyA = node.childNodes.length > 1 && output.node.firstChild.tagName === 'A' && output.node.firstChild.textContent === '';
      output = initialEmptyA ? { node: output.node.childNodes[1], symbol: output.symbol } : output;

      while (hasMarkerFirst(output.node)) {
        output = update({ node: output.node.firstChild, symbol: output.symbol });
      }

      return {
        node: output.node.firstChild,
        symbol: output.symbol
      };
    };

    var isUnofficialList = function (state, token) {
      if (!Tags.isStartOf('SPAN')(state, token) || !state.openedTag.get()) return false;
      var node = state.openedTag.get().getNode();
      var item = findItem(node);
      var detector = item.node && item.node.nodeType === 3 ? TextList : ImageList;
      return detector.is(state, item.node, item.symbol);
    };

    return {
      isUnofficialList: isUnofficialList
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.inspect.Lists',

  [
    'ephox.pastiche.engine.TokenUtil',
    'ephox.pastiche.inspect.Browser',
    'ephox.pastiche.inspect.Comments',
    'ephox.pastiche.inspect.Microsoft',
    'ephox.pastiche.inspect.Tags',
    'ephox.pastiche.list.detect.ListDetect',
    'ephox.perhaps.Option'
  ],

  function (TokenUtil, Browser, Comments, Microsoft, Tags, ListDetect, Option) {
    var getLevel = function (token) {
      var msoList = TokenUtil.getMsoList(token);
      var lvl = / level([0-9]+)/.exec(msoList);
      return lvl && lvl[1] ? Option.some(parseInt(lvl[1], 10)) : Option.none();
    };

    var isStart = function (state, token) {
      return Tags.isStart(state, token) && Microsoft.isList(state, token) && token.tag() !== 'LI';
    };

    var isValidStart = function (state, token) {
      return isStart(state, token) && getLevel(token).isSome();
    };

    var isInvalidStart = function (state, token) {
      return isStart(state, token) && getLevel(token).isNone();
    };

    var isSpecial = function (state, token) {
      var custom = Browser.supportsCustomStyles();
      return !custom && Comments.isListSupport(state, token) || ListDetect.isUnofficialList(state, token);
    };

    return {
      getLevel: getLevel,
      isStart: isStart,
      isValidStart: isValidStart,
      isInvalidStart: isInvalidStart,
      isSpecial: isSpecial
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.NoListState',

  [
    'ephox.pastiche.inspect.Lists',
    'ephox.pastiche.inspect.Markers',
    'ephox.pastiche.inspect.Tags',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Spans',
    'ephox.pastiche.list.state.Transitions'
  ],

  function (Lists, Markers, Tags, Handler, Handlers, Spans, Transitions) {
    var run = function (lazyListStartState) {

      var startList = function (api, state, token) {
        var level = Lists.getLevel(token);
        level.each(function (l) {
          state.itemLevel.set(l + state.styleLevelAdjust.get());
          // Tokens between lists should be dropped (they're just whitespace anyway)
          // however, tokens before a list should be emitted if we find an mso-list style
          // since this is the very first token of the list.
          var deferring = Transitions.isNext(state, result) ? api.emitDeferred : api.dropDeferred;
          deferring();

          Transitions.next(state, lazyListStartState());
          api.startTransaction();
          state.originalToken.set(token);
          state.commentMode.set(false);
        });
      };

      var specialList = function (api, state, token) {
        if (Tags.isStartOf('SPAN')(state, token)) {
          Spans.push(api, state, token);
        }
        Transitions.next(state, lazyListStartState());
        api.startTransaction();
        state.originalToken.set(state.openedTag.get());
        state.commentMode.set(true);
        state.openedTag.set(null);
        api.dropDeferred();
      };

      var startTag = function (api, state, token) {
        if (state.openedTag.get()) {
          state.emitter.closeAllLists();
          api.emitDeferred();
        }
        state.openedTag.set(token);
        api.defer(token);
      };

      var closeOutLists = function (api, state, token) {
        state.emitter.closeAllLists();
        api.emitDeferred();
        state.openedTag.set(null);
        api.emit(token);
        Transitions.next(state, result);
      };

      var result = Handlers('NoListState', [
        Handler(Lists.isValidStart, startList, 'valid list so start it'),
        Handler(Lists.isInvalidStart, closeOutLists, 'invalid list so close lists'),
        Handler(Lists.isSpecial, specialList, 'special list'),
        Handler(Markers.isEnd, Spans.deferAndPop, 'closing marker'),
        Handler(Markers.isStart, Spans.deferAndPush, 'starting marker'),
        Handler(Tags.isStart, startTag, 'starting tag')
      ], closeOutLists);

      return result;
    };

    return {
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.SkipEmptyParaState',

  [
    'ephox.pastiche.inspect.Browser',
    'ephox.pastiche.inspect.Logic',
    'ephox.pastiche.inspect.Microsoft',
    'ephox.pastiche.inspect.Tags',
    'ephox.pastiche.inspect.Texts',
    'ephox.pastiche.list.detect.ListDetect',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Spans',
    'ephox.pastiche.list.state.Transitions'
  ],

  function (Browser, Logic, Microsoft, Tags, Texts, ListDetect, Handler, Handlers, Spans, Transitions) {
    var run = function (noListState, lazyAfterListState) {

      var isFirstMarker = function (state, token) {
        return Tags.isStartOf('SPAN')(state, token) && state.spanCount.get().length === 0;
      };

      var isNotList = function (state, token) {
        return (Browser.supportsCustomStyles() || !ListDetect.isUnofficialList(state, token)) && !Microsoft.isList(state, token);
      };

      var skip = function (api, state, token) {
        api.defer(token);
        state.skippedPara.set(true);
        state.openedTag.set(null);
        Transitions.next(state, lazyAfterListState());
      };

      var defer = function (api, state, token) {
        api.defer(token);
      };

      return Handlers('SkipEmptyPara', [
        Handler(Logic.all([ isFirstMarker, isNotList ]), Spans.deferAndPush, 'first marker or not list'),
        Handler(Tags.isEndOf('SPAN'), Spans.deferAndPop, 'end span'),
        Handler(Tags.isEndOf('P'), skip, 'end p'),
        Handler(Tags.isEnd, Transitions.jump(noListState), 'end tag'),
        Handler(Texts.isWhitespace, defer, 'whitespace')
      ], Transitions.jump(noListState));
    };

    return {
      run: run
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.stage.SpacerState',

  [
    'ephox.pastiche.inspect.Markers',
    'ephox.pastiche.inspect.Tags',
    'ephox.pastiche.list.stage.Handler',
    'ephox.pastiche.list.stage.Handlers',
    'ephox.pastiche.list.state.Spans',
    'ephox.pastiche.list.state.Transitions',
    'ephox.peanut.Fun'
  ],

  function (Markers, Tags, Handler, Handlers, Spans, Transitions, Fun) {
    var run = function (closeSpansState) {
      return Handlers('Spacer', [
        Handler(Markers.isEnd, Spans.popThen(closeSpansState), 'end marker'),
        Handler(Tags.isEnd, Transitions.setNext(closeSpansState), 'end tag')
      ], Fun.noop);
    };

    return {
      run: run
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.Emission',

  [
    'ephox.scullion.Struct'
  ],

  function (Struct) {
    var result = Struct.immutable('state', 'result');
    var value = Struct.immutable('state', 'value');
    var state = Struct.immutable('level', 'type', 'types', 'items');

    return {
      state: state,
      value: value,
      result: result
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.ItemStack',

  [
    'ephox.pastiche.list.emit.Emission',
    'ephox.perhaps.Option'
  ],

  function (Emission, Option) {
    var finish = function (state) {
      var stack = state.items().slice(0);
      if (stack.length > 0 && stack[stack.length - 1] !== 'P') {
        var item = stack[stack.length - 1];
        stack[stack.length - 1] = 'P';
        var newState = Emission.state(state.level(), state.type(), state.types(), stack);
        return Emission.value(newState, Option.some(item));
      } else {
        return Emission.value(state, Option.none());
      }
    };

    var start = function (state, tag) {
      var stack = state.items().slice(0);
      var value = tag !== undefined && tag !== 'P' ? Option.some(tag) : Option.none();

      value.fold(function () {
        stack.push('P');
      }, function (v) {
        stack.push(v);
      });

      var newState = Emission.state(state.level(), state.type(), state.types(), stack);
      return Emission.value(newState, value);
    };

    return {
      start: start,
      finish: finish
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.ListLevels',

  [
    'ephox.pastiche.list.emit.Emission'
  ],

  function (Emission) {
    var moveUntil = function (state, predicate, f) {
      var tokens = [];

      var current = state;
      while (predicate(current)) {
        var acc = f(current);
        current = acc.state();
        tokens = tokens.concat(acc.result());
      }
      return Emission.result(current, tokens);
    };

    var moveRight = function (state, level, open) {
      var predicate = function (s) {
        return s.level() < level;
      };

      return moveUntil(state, predicate, open);
    };

    var moveLeft = function (state, level, close) {
      var predicate = function (state) {
        return state.level() > level;
      };

      return moveUntil(state, predicate, close);
    };

    return {
      moveRight: moveRight,
      moveLeft: moveLeft,
      moveUntil: moveUntil
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.ListItemStyles',

  [
    'ephox.pastiche.engine.TokenUtil'
  ],

  function (TokenUtil) {

    var unsafeFrom = function (token) {
      var leftMargin = TokenUtil.getStyle(token, 'margin-left');
      return leftMargin !== undefined && leftMargin !== '0px' ? { 'margin-left': leftMargin } : {};
    };

    var from = function (token) {
      var noToken = {
        'list-style-type': 'none'
      };

      return !token ? noToken : unsafeFrom(token);
    };

    return {
      from: from
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.SkippedTokens',

  [
    'ephox.pastiche.engine.Token',
    'ephox.peanut.Fun'
  ],

  function (Token, Fun) {
    var para = function (doc) {
      return [
        Fun.curry(Token.createStartElement, 'P', {}, {}),
        Fun.curry(Token.createText, '\u00A0'),
        Fun.curry(Token.createEndElement, 'P')
      ];
    };

    return {
      para: para
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.ListTokens',

  [
    'ephox.pastiche.cleanup.Cleaners',
    'ephox.pastiche.engine.Token',
    'ephox.pastiche.list.detect.ListTypes',
    'ephox.pastiche.list.emit.Emission',
    'ephox.pastiche.list.emit.ItemStack',
    'ephox.pastiche.list.emit.ListItemStyles',
    'ephox.pastiche.list.emit.SkippedTokens',
    'ephox.peanut.Fun'
  ],

  function (Cleaners, Token, ListTypes, Emission, ItemStack, ListItemStyles, SkippedTokens, Fun) {
    var open = function(state, type, style) {
      var attributes = type.start && type.start > 1 ? { start: type.start } : {};
      var level = state.level() + 1;
      var listType = type;
      var listTypes = state.types().concat([type]);
      var result = [ Fun.curry(Token.createStartElement, type.tag, attributes, style) ];
      var newState = Emission.state(level, listType, listTypes, state.items());
      return Emission.result(newState, result);
    };

    var close = function(state) {
      var listTypes = state.types().slice(0);
      var result = [ Fun.curry(Token.createEndElement, listTypes.pop().tag) ];
      var level = state.level() - 1;
      var listType = listTypes[listTypes.length - 1];
      var newState = Emission.state(level, listType, listTypes, state.items());
      return Emission.result(newState, result);
    };

    var shuffle = function (state, type, skippedPara) {
      var e1 = close(state);
      var extra = skippedPara ? SkippedTokens.para() : [];
      var e2 = open(e1.state(), type, type.type ? { 'list-style-type': type.type } : {});
      return Emission.result(e2.state(), e1.result().concat(extra).concat(e2.result()));
    };

    var openItem = function(state, paragraphToken, type, skippedPara) {
      var attributes = {};
      var style = ListItemStyles.from(paragraphToken);

      var e1 = state.type() && !ListTypes.eqListType(state.type(), type) ?
        shuffle(state, type, skippedPara) :
        Emission.result(state, []);
      var tokens = [ Fun.curry(Token.createStartElement, 'LI', attributes, style) ];

      var e2 = ItemStack.start(e1.state(), paragraphToken && paragraphToken.tag());
      var moreTokens = e2.value().map(function (v) {
        Cleaners.styleDom(paragraphToken.getNode(), Fun.constant(true));
        return [ Fun.constant(paragraphToken) ];
      }).getOr([]);

      return Emission.result(e2.state(), e1.result().concat(tokens).concat(moreTokens));
    };

    var closeItem = function(state) {
      var li = Fun.curry(Token.createEndElement, 'LI');
      var e1 = ItemStack.finish(state);
      var r = e1.value().fold(function () {
        return [ li ];
      }, function (item) {
        return [ Fun.curry(Token.createEndElement, item), li ];
      });
      return Emission.result(e1.state(), r);
    };

    return {
      open: open,
      openItem: openItem,
      close: close,
      closeItem: closeItem
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.ListModel',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.engine.Token',
    'ephox.pastiche.list.emit.Emission',
    'ephox.pastiche.list.emit.ItemStack',
    'ephox.pastiche.list.emit.ListLevels',
    'ephox.pastiche.list.emit.ListTokens',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  function (Arr, Token, Emission, ItemStack, ListLevels, ListTokens, Fun, Option) {
    var compose = function (emissions) {
      if (emissions.length === 0) throw 'Compose must have at least one element in the list';
      var last = emissions[emissions.length - 1];
      var tokens = Arr.bind(emissions, function (emission) {
        return emission.result();
      });
      return Emission.result(last.state(), tokens);
    };

    var closeLevel = function (state) {
      var e1 = ListTokens.closeItem(state);
      var e2 = ListTokens.close(e1.state());
      return compose([ e1, e2 ]);
    };

    var openLevel = function (state, type, level, paragraphToken) {
      var style = state.level() === level - 1 && type.type ? { 'list-style-type': type.type } : {};
      var e1 = ListTokens.open(state, type, style);
      var e2 = ListTokens.openItem(e1.state(), e1.state().level() == level ? paragraphToken : undefined, type);
      return compose([ e1, e2 ]);
    };

    var sameLevel = function (state, type, paragraphToken, skippedPara) {
      var e1 = state.level() > 0 ? ListTokens.closeItem(state) : Emission.result(state, []);
      var e2 = ListTokens.openItem(e1.state(), paragraphToken, type, skippedPara);
      return compose([ e1, e2 ]);
    };

    var openLevels = function (state, type, level, paragraphToken) {
      return ListLevels.moveRight(state, level, function (s) {
        return openLevel(s, type, level, paragraphToken);
      });
    };

    var closeLevels = function (state, level) {
      return ListLevels.moveLeft(state, level, closeLevel);
    };

    var jumpToLevel = function (state, type, level, paragraphToken) {
      var e1 = level > 1 ? ItemStack.finish(state) : Emission.value(state, Option.none());
      var tokens = e1.value().map(function (tag) {
        return [ Fun.curry(Token.createEndElement, tag) ];
      }).getOr([]);

      var numLevels = level - e1.state().level();
      var e2 = openLevels(e1.state(), type, level, paragraphToken);
      return Emission.result(e2.state(), tokens.concat(e2.result()));
    };

    var openItem = function(state, level, paragraphToken, type, skippedPara) {
      var e1 = state.level() > level ? closeLevels(state, level) : Emission.result(state, []);
      var e2 = e1.state().level() === level ?
        sameLevel(e1.state(), type, paragraphToken, skippedPara) :
        jumpToLevel(e1.state(), type, level, paragraphToken);
      return compose([ e1, e2 ]);
    };

    var closeAllLists = closeLevels;

    return {
      openItem: openItem,
      closeAllLists: closeAllLists
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.emit.Emitter',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.list.emit.Emission',
    'ephox.pastiche.list.emit.ListModel'
  ],

  function (Arr, Emission, ListModel) {
    var impliedULatLevel = [ 'disc', 'circle', 'square' ];

    var removeImpliedListType = function(type, level) {
      if (type.tag === 'UL') {
        if (impliedULatLevel[level - 1] === type.type) {
          type = { tag: 'UL' };
        }
      }
      return type;
    };

    return function (api, doc) {

      var state = Emission.state(0, undefined, [], []);

      var emit = function (emission) {
        Arr.each(emission.result(), function (x) {
          var token = x(doc);
          api.emit(token);
        });
      };

      var closeAllLists = function() {
        var e1 = ListModel.closeAllLists(state, 0);
        state = e1.state();
        emit(e1);
        api.commit();
      };

      var openItem = function(level, paragraphToken, type, skippedPara) {
        var style = {}, token;
        if (!type) return;
        var cleanType = removeImpliedListType(type, level);
        var e1 = ListModel.openItem(state, level, paragraphToken, cleanType, skippedPara);
        state = e1.state();
        emit(e1);
      };

      var getCurrentLevel = function() {
        return state.level();
      };
      var getCurrentListType = function() {
        return state.type();
      };

      return {
        closeAllLists: closeAllLists,
        openItem: openItem,
        getCurrentListType: getCurrentListType,
        getCurrentLevel: getCurrentLevel
      };
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.indent.ListIndent',

  [
    'ephox.compass.Arr',
    'ephox.pastiche.engine.TokenUtil',
    'ephox.violin.Strings',
    'global!Math'
  ],

  function (Arr, TokenUtil, Strings, Math) {
    var getLeftOffset = function(node, paragraph) {
      var parent, child, offset = 0;
      parent = node.parentNode;
      while (parent !== null && parent !== paragraph.parentNode) {
        offset += parent.offsetLeft;
        parent = parent.offsetParent;
      }
      return offset;
    };

    var ephoxGetComputedStyle = function(node) {
      if (node.ownerDocument.defaultView) {
        return node.ownerDocument.defaultView.getComputedStyle(node, null);
      }
      return node.currentStyle || {};
    };


    /** A simplified memoize function which only supports one or two function parameters.
     *
     * @param fn
     * @param param the funtion p
     * @returns
     */
    var memoize2 = function(fn) {
      var cache = {};
      return function(param1, param2) {
        var result, key = param1 + "," + param2;
        if (cache.hasOwnProperty(key)) {
          return cache[key];
        }
        result = fn.call(null, param1, param2);
        cache[key] = result;
        return result;
      };
    };

    var findStyles = memoize2(function(css, className) {
      var results, matcher = /([^{]+){([^}]+)}/g, match, el, computedStyle;
      matcher.lastIndex = 0; // Firefox Mac reuses the same regex so we need to reset it.
      while ((results = matcher.exec(css)) !== null && !match) {
        Arr.each(results[1].split(','), function(selector) {
          var dotIndex = selector.indexOf('.');
          if (dotIndex >= 0 && Strings.trim(selector.substring(dotIndex + 1)) === className) {
            match = results[2];
            return false;
          }
        });
      }
      if (match) {
        el = document.createElement('p');
        el.setAttribute("style", match);
        computedStyle = ephoxGetComputedStyle(el);
        return computedStyle ? "" + computedStyle.marginLeft : false;
      }
      return false;
    });

    var indentGuesser = function() {

      var listIndentAdjust;
      var listIndentAmount;
      var guessIndentLevel = function(currentToken, token, styles, bulletInfo) {
        var indentAmount, itemIndent, el, level = 1;

        if (bulletInfo && /^([0-9]+\.)+[0-9]+\.?$/.test(bulletInfo.text)) {
          // Outline list type so we can just count the number of sections.
          return bulletInfo.text.replace(/([0-9]+|\.$)/g, '').length + 1;
        }
        indentAmount = listIndentAmount || parseInt(findStyles(styles, TokenUtil.getAttribute(token, 'class')));

        itemIndent = getLeftOffset(currentToken.getNode(), token.getNode());
        if (!indentAmount) {
          indentAmount = 48;
        } else {
          // We might get a 0 item indent if the list CSS code wasn't pasted as happens on Windows.
          if (listIndentAdjust) {
            itemIndent += listIndentAdjust;
          } else if (itemIndent === 0) {
            listIndentAdjust = indentAmount;
            itemIndent += indentAmount;
          }
        }
        listIndentAmount = indentAmount = Math.min(itemIndent, indentAmount);
        level = Math.max(1, Math.floor(itemIndent / indentAmount)) || 1;
        return level;
      };
      return {
        guessIndentLevel: guessIndentLevel
      };
    };

    return {
      indentGuesser: indentGuesser
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.state.ListStyles',

  [
    'ephox.pastiche.engine.Token'
  ],

  function (Token) {
    return function () {
      var inStyle = false;
      var styles = "";
      var check = function(token) {
        if (inStyle && token.type() === Token.TEXT_TYPE) {
          styles += token.text();
          return true;
        } else if (token.type() === Token.START_ELEMENT_TYPE && token.tag() === 'STYLE') {
          inStyle = true;
          return true;
        } else if (token.type() === Token.END_ELEMENT_TYPE && token.tag() === 'STYLE') {
          inStyle = false;
          return true;
        }
        return false;
      };
      return {
        check: check
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.scullion.Cell',

  [
  ],

  function () {
    var Cell = function (initial) {
      var value = initial;

      var get = function () {
        return value;
      };

      var set = function (v) {
        value = v;
      };

      var clone = function () {
        return Cell(get());
      };

      return {
        get: get,
        set: set,
        clone: clone
      };
    };

    return Cell;
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.list.state.ListState',

  [
    'ephox.pastiche.list.emit.Emitter',
    'ephox.pastiche.list.indent.ListIndent',
    'ephox.pastiche.list.state.ListStyles',
    'ephox.peanut.Fun',
    'ephox.scullion.Cell'
  ],

  function (Emitter, ListIndent, ListStyles, Fun, Cell) {

    var indentGuesser = ListIndent.indentGuesser();
    var styles = ListStyles();


    var emitter = {
      getCurrentListType: function () {
        return lazyEmitter().getCurrentListType();
      },
      getCurrentLevel: function () {
        return lazyEmitter().getCurrentLevel();
      },
      closeAllLists: function () {
        return lazyEmitter().closeAllLists.apply(undefined, arguments);
      },
      openItem: function () {
        return lazyEmitter().openItem.apply(undefined, arguments);
      }
    };

    var lazyEmitter = function () {
      return {
        getCurrentListType: Fun.constant({}),
        getCurrentLevel: Fun.constant(1),
        closeAllLists: Fun.identity,
        openItem: Fun.identity
      };
    };

    return function (initialState) {
      var nextFilter = Cell(initialState);
      var itemLevel = Cell(0);
      var originalToken = Cell(null);
      var commentMode = Cell(false);
      var openedTag = Cell(null);
      var symbolFont = Cell(false);
      var listType = Cell(null);
      var spanCount = Cell([]);
      var skippedPara = Cell(false);
      var styleLevelAdjust = Cell(0);
      var bulletInfo = Cell(undefined);
      var logger = Cell([]);

      var reset = function (api) {
        nextFilter.set(initialState);
        itemLevel.set(0);
        originalToken.set(null);
        commentMode.set(false);
        openedTag.set(null);
        symbolFont.set(false);
        listType.set(null);
        spanCount.set([]);
        skippedPara.set(false);
        styleLevelAdjust.set(0);
        bulletInfo.set(undefined);
        logger.set([]);

        // ASSUMPTION: I think this approach in the past also papered over the stack needing resetting in the emitter.
        _emitter = Emitter(api, api.document);
        lazyEmitter = Fun.constant(_emitter);
      };

      return {
        reset: reset,
        nextFilter: nextFilter,
        itemLevel: itemLevel,
        originalToken: originalToken,
        commentMode: commentMode,
        openedTag: openedTag,
        symbolFont: symbolFont,
        listType: listType,
        spanCount: spanCount,
        skippedPara: skippedPara,
        styleLevelAdjust: styleLevelAdjust,
        bulletInfo: bulletInfo,
        logger: logger,

        emitter: emitter,
        styles: styles,
        indentGuesser: indentGuesser
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.pastiche.filter.Lists',

  [
    'ephox.pastiche.engine.Filter',
    'ephox.pastiche.list.detect.ListTypes',
    'ephox.pastiche.list.stage.AfterListState',
    'ephox.pastiche.list.stage.AfterNoBulletListState',
    'ephox.pastiche.list.stage.BeforeSpacerState',
    'ephox.pastiche.list.stage.CloseSpansState',
    'ephox.pastiche.list.stage.FindListTypeState',
    'ephox.pastiche.list.stage.ItemContentState',
    'ephox.pastiche.list.stage.ListStartState',
    'ephox.pastiche.list.stage.NoListState',
    'ephox.pastiche.list.stage.SkipEmptyParaState',
    'ephox.pastiche.list.stage.SpacerState',
    'ephox.pastiche.list.state.ListState',
    'ephox.pastiche.list.state.Transitions'
  ],

  function (Filter, ListTypes, AfterListState, AfterNoBulletListState, BeforeSpacerState, CloseSpansState, FindListTypeState, ItemContentState, ListStartState, NoListState, SkipEmptyParaState, SpacerState, ListState, Transitions) {
    var unexpectedToken = function(api, token) {
      var info = 'Type: ' + token.type() + ', Tag: ' + token.tag() + ' Text: ' + token.text();
      console.log('Unexpected token in list conversion: ' + info, activeState.nextFilter.get());
      api.rollback();
    };

    var noListState = NoListState.run(function () {
      return listStartState;
    });
    var skipEmptyParaState = SkipEmptyParaState.run(noListState, function () {
      return afterListState;
    });
    var afterListState = AfterListState.run(skipEmptyParaState, noListState);
    var itemContentState = ItemContentState.run(afterListState);
    var closeSpansState = CloseSpansState.run(itemContentState, unexpectedToken);
    var spacerState = SpacerState.run(closeSpansState);
    var beforeSpacerState = BeforeSpacerState.run(spacerState, closeSpansState, unexpectedToken);
    var findListTypeState = FindListTypeState.run(beforeSpacerState, unexpectedToken);
    var afterNoBulletListState = AfterNoBulletListState.run(afterListState);
    var listStartState = ListStartState.run(findListTypeState, afterNoBulletListState, unexpectedToken);

    var activeState = ListState(noListState);

    var receive = function(api, token) {
      if (activeState.styles && activeState.styles.check(token)) {
        return;
      }

      activeState.symbolFont.set(ListTypes.checkFont(token, activeState.symbolFont.get()));
      Transitions.go(api, activeState, token);
    };

    return Filter.createFilter(receive, activeState.reset, 'lists');

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.limbo.process.Strategies',

  [
    'ephox.pastiche.api.HtmlPatterns',
    'ephox.pastiche.api.HybridAction',
    'ephox.pastiche.api.RuleConditions',
    'ephox.pastiche.api.RuleMutations',
    'ephox.pastiche.filter.Lists',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Css',
    'ephox.violin.StringMatch'
  ],

  function (HtmlPatterns, HybridAction, RuleConditions, RuleMutations, Lists, Fun, Class, Css, StringMatch) {
    // This will UNWRAP! tags such as <O:> and <U1:>
    // Context: Word copy and paste.
    var unwrapWordTags = HybridAction.unwrapper({
      tags: [
        { name: StringMatch.pattern(/^([OVWXP]|U[0-9]+|ST[0-9]+):/i) }
      ]
    });

    // This will try and turn p tags into ol,ul and li tags where appropriate
    // Context: Word copy and paste.
    var parseLists = HybridAction.pipeline([ Lists ]);

    // This will remove attributes matching: v:.., href with #_toc|#_mso, xmlns:, align
    // and type on lists.
    // Context: Word copy and paste.
    var removeWordAttributes = HybridAction.removal({
      attributes: [
        { name: StringMatch.pattern(/^v:/) },
        { name: StringMatch.exact('href'), value: StringMatch.contains('#_toc') },
        { name: StringMatch.exact('href'), value: StringMatch.contains('#_mso') },
        { name: StringMatch.pattern(/^xmlns(:|$)/) },
        { name: StringMatch.exact('align') },
        { name: StringMatch.exact('type'), condition: RuleConditions.isList }
      ]
    });

    // This will remove script,meta,link,empty-style tags and on,id,name,lang attributes
    // or styles containing OLE_LINK
    // Context: All
    var removeExcess = HybridAction.removal({
      tags: [
        { name: StringMatch.exact('script') },
        { name: StringMatch.exact('meta') },
        { name: StringMatch.exact('link') },
        { name: StringMatch.exact('style'), condition: RuleConditions.isEmpty }
      ],
      attributes: [
        { name: StringMatch.starts('on') },
        { name: StringMatch.exact('"') },
        { name: StringMatch.exact('id') },
        { name: StringMatch.exact('name') },
        { name: StringMatch.exact('lang') },
        { name: StringMatch.exact('language') }
        // INVESTIGATE: Should language go here as well ?
      ],
      styles: [
        { name: StringMatch.all(), value: StringMatch.pattern(/OLE_LINK/i) }
      ]
    });

    var isNotTransformed = function (element) {
      return !Class.has(element, 'ephox-limbo-transform');
    };

    // This will remove any styles that are not list-style-type for all tags, and keep the width and height
    // styles only for images.
    // Context: Clean copy and paste.
    var cleanStyles = HybridAction.removal({
      styles: [
        {
          name: StringMatch.not(
            StringMatch.pattern(/width|height|list-style-type/)
          ),
          condition: isNotTransformed
        },
        { name: StringMatch.pattern(/width|height/), condition: RuleConditions.isNotImage }
      ]
    });

    // This will remove all classes that are not 'rtf-data-image'
    // Context: Clean copy and paste.
    var cleanClasses = HybridAction.removal({
      classes: [
        {
          name: StringMatch.not(
            StringMatch.exact('rtf-data-image')
          )
        }
      ]
    });

    // This will remove all styles that are not considered valid.
    // Context: Merge copy and paste.
    var mergeStyles = HybridAction.removal({
      styles: [
        { name: StringMatch.pattern(HtmlPatterns.validStyles()) }
      ]
    });

    // This will remove all classes that have mso in them.
    // Context: Merge copy and paste.
    var mergeClasses = HybridAction.removal({
      classes: [
        { name: StringMatch.pattern(/mso/i) }
      ]
    });

    // This will remove (unwrap) all images that have a file protocol
    // Context: Copy and paste with images.
    var removeLocalImages = HybridAction.unwrapper({
      tags: [
        { name: StringMatch.exact('img'), condition: RuleConditions.isLocal },
        // OLE_LINK exact part.
        { name: StringMatch.exact('a'), condition: RuleConditions.hasNoAttributes }
      ]
    });

    // This will unwrap any <a> tags that have no attributes (i.e. are essentially useless)
    // Context: Any
    var removeVacantLinks = HybridAction.unwrapper({
      tags: [
        { name: StringMatch.exact('a'), condition: RuleConditions.hasNoAttributes }
      ]
    });

    // This will remove any style attribute that has no content.
    // Context: Any
    var removeEmptyStyle = HybridAction.removal({
      attributes: [
        { name: StringMatch.exact('style'), value: StringMatch.exact(''), debug: true }
      ]
    });

    // This will remove any style attribute that has no content.
    // Context: Any
    var removeEmptyClass = HybridAction.removal({
      attributes: [
        { name: StringMatch.exact('class'), value: StringMatch.exact(''), debug: true }
      ]
    });

    // This will remove any inline elements that no longer serve a purpose:
    // Fancy inline elements: contain no content
    // Span inline elements: have no attributes
    // Context: Any
    var pruneInlineTags = HybridAction.unwrapper({
      tags: [
        {
          name: StringMatch.pattern(HtmlPatterns.specialInline()),
          condition: Fun.not(RuleConditions.hasContent)
        }
      ]
    });

    var addPlaceholders = HybridAction.transformer({
      tags: [
        { name: StringMatch.exact('p'), mutate: RuleMutations.addBrTag }
      ]
    });

    var toUnderline = function (element) {
      var span = RuleMutations.changeTag('span', element);
      Class.add(span, 'ephox-limbo-transform');
      Css.set(span, 'text-decoration', 'underline');
    };

    var nestedListFixes = HybridAction.transformer({
      tags: [
        { name: StringMatch.pattern(/ol|ul/), mutate: RuleMutations.properlyNest }
      ]
    });

    var inlineTagFixes = HybridAction.transformer({
      tags: [
        { name: StringMatch.exact('b'), mutate: Fun.curry(RuleMutations.changeTag, 'strong') },
        { name: StringMatch.exact('i'), mutate: Fun.curry(RuleMutations.changeTag, 'em') },
        { name: StringMatch.exact('u'), mutate: toUnderline },
        { name: StringMatch.exact('s'), mutate: Fun.curry(RuleMutations.changeTag, 'strike') },
        { name: StringMatch.exact('font'), mutate: RuleMutations.fontToSpan, debug: true }
      ]
    });

    // This will remove all classes that were put in to preserve transformations.
    // Context: Any
    var cleanupFlags = HybridAction.removal({
      classes: [
        { name: StringMatch.exact('ephox-limbo-transform') }
      ]
    });

    // This will remove any href attributes of a tags that are local.
    // Context: Any
    var removeLocalLinks = HybridAction.removal({
      attributes: [
        { name: StringMatch.exact('href'), value: StringMatch.starts('file:///'), debug: true }
      ]
    });

    return {
      unwrapWordTags: unwrapWordTags,
      removeWordAttributes: removeWordAttributes,
      parseLists: parseLists,
      removeExcess: removeExcess,
      cleanStyles: cleanStyles,
      cleanClasses: cleanClasses,
      mergeStyles: mergeStyles,
      mergeClasses: mergeClasses,
      removeLocalImages: removeLocalImages,
      removeVacantLinks: removeVacantLinks,
      removeEmptyStyle: removeEmptyStyle,
      removeEmptyClass: removeEmptyClass,
      pruneInlineTags: pruneInlineTags,
      addPlaceholders: addPlaceholders,
      nestedListFixes: nestedListFixes,
      inlineTagFixes: inlineTagFixes,
      cleanupFlags: cleanupFlags,
      removeLocalLinks: removeLocalLinks,
      none: Fun.noop
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.limbo.process.PasteFilters',

  [
    'ephox.compass.Arr',
    'ephox.limbo.api.RtfImage',
    'ephox.limbo.process.Strategies',
    'ephox.pastiche.api.HybridAction',
    'ephox.pastiche.engine.Filter',
    'ephox.pastiche.engine.Token',
    'ephox.sugar.api.Element'
  ],

  function (Arr, RtfImage, Strategies, HybridAction, Filter, Token, Element) {
    var isIE11 = function (platform) {
      return platform.browser.isIE() && platform.browser.version.major >= 11;
    };

    var transform = function (f) {
      // TODO: Move this to API in pastiche or change how this works.
      // I think the reason I want to keep it in the tokenizer is because
      // it needs to access comments.
      return Filter.createFilter(function (api, token) {
        var next = f(Element.fromDom(token.getNode())).fold(function () {
          return token;
        }, function (sugared) {
          var node = sugared.dom();
          return Token.token(node, token.type() === Token.END_ELEMENT_TYPE, {});
        });
        api.emit(next);
      });
    };

    var images = function (isWord, merging, platform) {
      var searcher = platform.browser.isFirefox() ? RtfImage.local : RtfImage.vshape;
      var transformer = isIE11(platform) ? Strategies.none : HybridAction.pipeline([ transform(searcher) ]);
      var local = searcher === RtfImage.local ? Strategies.none : Strategies.removeLocalImages;
      var annotate = isWord ? transformer : Strategies.none;

      return {
        annotate: [ annotate ],
        local: [ local ]
      };
    };

    var styling = function (isWord, merging, platform) {
      var merge = [ Strategies.mergeStyles, Strategies.mergeClasses ];
      var clean = [ Strategies.cleanStyles, Strategies.cleanClasses ];
      return merging ? merge : clean;
    };

    var word = function (isWord, merging, platform) {
      if (!isWord) return Strategies.none;
      var base = [ Strategies.unwrapWordTags ];
      var lists = isIE11(platform) ? [] : Strategies.parseLists;
      return base.concat(lists);
    };

    var derive = function (isWord, merging, platform) {
      var imageFilters = images(isWord, merging, platform);

      return Arr.flatten([
        imageFilters.annotate,
        [ Strategies.inlineTagFixes ],
        word(isWord, merging, platform),
        [ Strategies.nestedListFixes ],
        [ Strategies.removeExcess ],
        imageFilters.local,
        styling(isWord, merging, platform),
        [ Strategies.removeLocalLinks, Strategies.removeVacantLinks ],
        [ Strategies.removeEmptyStyle ],
        [ Strategies.removeEmptyClass ],
        [ Strategies.pruneInlineTags ],
        [ Strategies.addPlaceholders ],
        [ Strategies.cleanupFlags ]
      ]);
    };

    return {
      derive: derive
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.boss.common.TagBoundaries',

  [

  ],

  function () {
    // TODO: We need to consolidate this list. I think when we get rid of boss/universe, we can do it then.
    return [
      'body',
      'p',
      'div',
      'article',
      'aside',
      'figcaption',
      'figure',
      'footer',
      'header',
      'nav',
      'section',
      'ol',
      'ul',
      'li',
      'table',
      'thead',
      'tbody',
      'caption',
      'tr',
      'td',
      'th',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'pre',
      'address'
    ];
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.Text',

  [
    'ephox.sugar.api.Node',
    'ephox.sugar.impl.NodeValue'
  ],

  function (Node, NodeValue) {
    var api = NodeValue(Node.isText, 'text');

    var get = function (element) {
      return api.get(element);
    };

    var getOption = function (element) {
      return api.getOption(element);
    };

    var set = function (element, value) {
      api.set(element, value);
    };

    return {
      get: get,
      getOption: getOption,
      set: set
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.boss.api.DomUniverse',

  [
    'ephox.boss.common.TagBoundaries',
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Compare',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.PredicateFilter',
    'ephox.sugar.api.PredicateFind',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorFilter',
    'ephox.sugar.api.SelectorFind',
    'ephox.sugar.api.Text',
    'ephox.sugar.api.Traverse'
  ],

  function (TagBoundaries, Arr, Fun, Attr, Compare, Css, Element, Insert, InsertAll, Node, PredicateFilter, PredicateFind, Remove, SelectorFilter, SelectorFind, Text, Traverse) {
    return function () {
      var clone = function (element) {
        return Element.fromDom(element.dom().cloneNode(false));
      };

      var isBoundary = function (element) {
        if (!Node.isElement(element)) return false;
        if (Node.name(element) === 'body') return true;
        var display = Css.get(element, 'display');
        // When the read display value is empty, we need to check the node name.
        return display !== undefined && display.length > 0 ?
          Arr.contains(['block', 'table-cell', 'table-row', 'table', 'list-item'], display) :
          Arr.contains(TagBoundaries, Node.name(element));
      };

      var isEmptyTag = function (element) {
        if (!Node.isElement(element)) return false;
        return Arr.contains(['br', 'img', 'hr'], Node.name(element));
      };

      var comparePosition = function (element, other) {
        return element.dom().compareDocumentPosition(other.dom());
      };

      var copyAttributesTo = function (source, destination) {
        var as = Attr.clone(source);
        Attr.setAll(destination, as);
      };

      return {
        up: Fun.constant({
          selector: SelectorFind.ancestor,
          closest: SelectorFind.closest,
          predicate: PredicateFind.ancestor,
          all: Traverse.parents
        }),
        down: Fun.constant({
          selector: SelectorFilter.descendants,
          predicate: PredicateFilter.descendants
        }),
        styles: Fun.constant({
          get: Css.get,
          set: Css.set,
          remove: Css.remove
        }),
        attrs: Fun.constant({
          get: Attr.get,
          set: Attr.set,
          remove: Attr.remove,
          copyTo: copyAttributesTo
        }),
        insert: Fun.constant({
          before: Insert.before,
          after: Insert.after,
          afterAll: InsertAll.after,
          append: Insert.append,
          appendAll: InsertAll.append,
          prepend: Insert.prepend,
          wrap: Insert.wrap
        }),
        remove: Fun.constant({
          unwrap: Remove.unwrap,
          remove: Remove.remove
        }),
        create: Fun.constant({
          nu: Element.fromTag,
          clone: clone,
          text: Element.fromText
        }),
        query: Fun.constant({
          comparePosition: comparePosition,
          prevSibling: Traverse.prevSibling,
          nextSibling: Traverse.nextSibling
        }),
        property: Fun.constant({
          children: Traverse.children,
          name: Node.name,
          parent: Traverse.parent,
          isText: Node.isText,
          isElement: Node.isElement,
          getText: Text.get,
          setText: Text.set,
          isBoundary: isBoundary,
          isEmptyTag: isEmptyTag
        }),
        eq: Compare.eq,
        is: Compare.is
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.api.data.NamedPattern',

  [
    'ephox.scullion.Struct'
  ],

  function (Struct) {
    return Struct.immutable('word', 'pattern');
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.api.data.Spot',

  [
    'ephox.scullion.Struct'
  ],

  function (Struct) {
    var point = Struct.immutable('element', 'offset');
    var delta = Struct.immutable('element', 'deltaOffset');
    var range = Struct.immutable('element', 'start', 'finish');
    var points = Struct.immutable('begin', 'end');
    var text = Struct.immutable('element', 'text');

    return {
      point: point,
      delta: delta,
      range: range,
      points: points,
      text: text
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.extract.TypedItem',

  [
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  /**
   * Church encoded ADT representing whether an element is:
   * - boundary (block tag or inline tag with block CSS display)
   * - empty
   * - text
   */
  function (Fun, Option) {
    var no = Fun.constant(false);
    var yes = Fun.constant(true);

    var boundary = function (item, universe) {
      return folder(function (b, e, t) {
        return b(item, universe);
      });
    };

    var empty = function (item, universe) {
      return folder(function (b, e, t) {
        return e(item, universe);
      });
    };

    var text = function (item, universe) {
      return folder(function (b, e, t) {
        return t(item, universe);
      });
    };

    var folder = function (fold) {
      var isBoundary = function () {
        return fold(yes, no, no);
      };

      var toText = function () {
        return fold(Option.none, Option.none, function (item, universe) {
          return Option.some(item);
        });
      };

      var is = function (other) {
        return fold(no, no, function (item, universe) {
          return universe.eq(item, other);
        });
      };

      var len = function () {
        return fold(Fun.constant(0), Fun.constant(1), function (item, universe) {
          return universe.property().getText(item).length;
        });
      };

      return {
        isBoundary: isBoundary,
        fold: fold,
        toText: toText,
        is: is,
        len: len
      };
    };

    return {
      text: text,
      boundary: boundary,
      empty: empty
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.array.Boundaries',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun'
  ],

  function (Arr, Fun) {
    var boundAt = function (xs, left, right, comparator) {
      var leftIndex = Arr.findIndex(xs, Fun.curry(comparator, left));
      var first = leftIndex > -1 ?  leftIndex : 0;
      var rightIndex = Arr.findIndex(xs, Fun.curry(comparator, right));
      var last = rightIndex > -1  ? rightIndex + 1 : xs.length;
      return xs.slice(first, last);
    };

    return {
      boundAt: boundAt
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.array.Slice',

  [
    'ephox.compass.Arr'
  ],

  function (Arr) {
    /**
     * Slice an array at the first item matched by the predicate
     */
    var sliceby = function (list, pred) {
      var index = Arr.findIndex(list, pred);
      return list.slice(0, index);
    };

    return {
      sliceby: sliceby
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.array.Split',

  [
    'ephox.compass.Arr'
  ],

  function (Arr) {
    /**
     * Split an array into chunks matched by the predicate
     */
    var splitby = function (xs, pred) {
      var r = [];
      var part = [];
      Arr.each(xs, function (x) {
        if (pred(x)) {
          r.push(part);
          part = [];
        } else {
          part.push(x);
        }
      });

      if (part.length > 0) r.push(part);
      return r;
    };

    return {
      splitby: splitby
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.api.Arrays',

  [
    'ephox.polaris.array.Boundaries',
    'ephox.polaris.array.Slice',
    'ephox.polaris.array.Split'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Boundaries, Slice, Split) {
    var boundAt = function (xs, left, right, comparator) {
      return Boundaries.boundAt(xs, left, right, comparator);
    };

    var splitby = function (array, predicate) {
      return Split.splitby(array, predicate);
    };

    var sliceby = function (array, predicate) {
      return Slice.sliceby(array, predicate);
    };

    return {
      splitby: splitby,
      sliceby: sliceby,
      boundAt: boundAt
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.extract.TypedList',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.phoenix.api.data.Spot',
    'ephox.polaris.api.Arrays'
  ],

  /**
   * Extracts various information from a list of TypedItem
   */
  function (Arr, Fun, Option, Spot, Arrays) {

    var count = function (parray) {
      return Arr.foldr(parray, function (b, a) {
        return a.len() + b;
      }, 0);
    };

    var dropUntil = function (parray, target) {
      return Arrays.sliceby(parray, function (x) {
        return x.is(target);
      });
    };

    /**
     * Transform a TypedItem into a range representing that item from the start position.
     *
     * The generation function for making a PositionArray out of a list of TypedItems.
     */
    var gen = function (unit, start) {
      return unit.fold(Option.none, function (e) {
        return Option.some(Spot.range(e, start, start + 1));
      }, function (t) {
        return Option.some(Spot.range(t, start, start + unit.len()));
      });
    };

    var justText = function (parray) {
      return Arr.bind(parray, function (x) {
        return x.fold(Fun.constant([]), Fun.constant([]), Fun.identity);
      });
    };

    return {
      count: count,
      dropUntil: dropUntil,
      gen: gen,
      justText: justText
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.extract.Extract',

  [
    'ephox.compass.Arr',
    'ephox.phoenix.api.data.Spot',
    'ephox.phoenix.extract.TypedItem',
    'ephox.phoenix.extract.TypedList'
  ],

  function (Arr, Spot, TypedItem, TypedList) {
    /**
     * Flattens the item tree into TypedItem representations.
     *
     * Boundaries are returned twice, before and after their children.
     */
    var typed = function (universe, item, optimise) {
      if (universe.property().isText(item)) {
        return [ TypedItem.text(item, universe) ];
      } else if (universe.property().isEmptyTag(item)) {
        return [ TypedItem.empty(item, universe) ];
      } else if (universe.property().isElement(item)) {
        var children = universe.property().children(item);
        var boundary = universe.property().isBoundary(item) ? [TypedItem.boundary(item, universe)] : [];
        var rest = optimise !== undefined && optimise(item) ? [] : Arr.bind(children, function (child) {
          return typed(universe, child, optimise);
        });
        return boundary.concat(rest).concat(boundary);
      } else {
        return [];
      }
    };

    /**
     * Returns just the actual elements from a call to typed().
     */
    var items = function (universe, item, optimise) {
      var typedItemList = typed(universe, item, optimise);

      var raw = function (item, universe) { return item; };

      return Arr.map(typedItemList, function (typedItem) {
        return typedItem.fold(raw, raw, raw);
      });
    };

    var extractToElem = function (universe, child, offset, item, optimise) {
      var extractions = typed(universe, item, optimise);
      var prior = TypedList.dropUntil(extractions, child);
      var count = TypedList.count(prior);
      return Spot.point(item, count + offset);
    };

    /**
     * Generates an absolute point in the child's parent
     * that can be used to reference the offset into child later.
     *
     * To find the exact reference later, use Find.
     */
    var extract = function (universe, child, offset, optimise) {
      return universe.property().parent(child).fold(function () {
        return Spot.point(child, offset);
      }, function (parent) {
        return extractToElem(universe, child, offset, parent, optimise);
      });
    };

    /**
     * Generates an absolute point that can be used to reference the offset into child later.
     * This absolute point will be relative to a parent node (specified by predicate).
     *
     * To find the exact reference later, use Find.
     */
    var extractTo = function (universe, child, offset, pred, optimise) {
      return universe.up().predicate(child, pred).fold(function () {
        return Spot.point(child, offset);
      }, function (v) {
        return extractToElem(universe, child, offset, v, optimise);
      });
    };

    return {
      typed: typed,
      items: items,
      extractTo: extractTo,
      extract: extract
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.extract.ExtractText',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.phoenix.extract.Extract'
  ],

  function (Arr, Fun, Extract) {
    var newline = '\n';
    var space = ' ';

    var onEmpty = function (item, universe) {
      return universe.property().name(item) === 'img' ? space : newline;
    };

    var from = function (universe, item, optimise) {
      var typed = Extract.typed(universe, item, optimise);
      return Arr.map(typed, function (t) {
        return t.fold(Fun.constant(newline), onEmpty, universe.property().getText);
      }).join('');
    };

    return {
      from: from
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.parray.Generator',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun'
  ],

  function (Arr, Fun) {

    /**
     * Generate a PositionArray
     *
     * xs:     list of thing
     * f:      thing -> Optional unit
     * _start: sets the start position to search at
     */
    var make = function (xs, f, _start) {

      var init = {
        len: _start !== undefined ? _start : 0,
        list: []
      };

      var r = Arr.foldl(xs, function (b, a) {
        var value = f(a, b.len);
        return value.fold(Fun.constant(b), function (v) {
          return {
            len: v.finish(),
            list: b.list.concat([v])
          };
        });
      }, init);

      return r.list;
    };

    return {
      make: make
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.parray.Query',

  [
    'ephox.compass.Arr',
    'ephox.perhaps.Option'
  ],

  function (Arr, Option) {

    /**
     * Simple "is position within unit" utility function
     */
    var inUnit = function (unit, position) {
      return position >= unit.start() && position <= unit.finish();
    };

    /**
     * Finds the unit in the PositionArray that contains this offset (if there is one)
     */
    var get = function (parray, offset) {
      var unit = Arr.find(parray, function (x) {
        return inUnit(x, offset);
      });

      return Option.from(unit);
    };

    var startindex = function (parray, offset) {
      return Arr.findIndex(parray, function (unit) {
        return unit.start() === offset;
      });
    };

    var tryend = function (parray, finish) {
      var finishes = parray[parray.length - 1] && parray[parray.length - 1].finish() === finish;
      return finishes ? parray.length + 1 : -1;
    };


    /**
     * Extracts the pieces of the PositionArray that are bounded *exactly* on the start and finish offsets
     */
    var sublist = function (parray, start, finish) {
      var first = startindex(parray, start);
      var rawlast = startindex(parray, finish);
      var last = rawlast > -1 ? rawlast : tryend(parray, finish);

      return first > -1 && last > -1 ? parray.slice(first, last) : [];
    };

    var find = function (parray, pred) {
      return Option.from(Arr.find(parray, pred));
    };

    return {
      get: get,
      find: find,
      inUnit: inUnit,
      sublist: sublist
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.parray.Translate',

  [
    'ephox.compass.Arr',
    'ephox.highway.Merger',
    'ephox.peanut.Fun'
  ],

  function (Arr, Merger, Fun) {
    /** Adjust a PositionArray positions by an offset */
    var translate = function (parray, offset) {
      return Arr.map(parray, function (unit) {
        return Merger.merge(unit, {
          start: Fun.constant(unit.start() + offset),
          finish: Fun.constant(unit.finish() + offset)
        });
      });
    };

    return {
      translate: translate
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.parray.Split',

  [
    'ephox.compass.Arr',
    'ephox.polaris.parray.Query',
    'ephox.polaris.parray.Translate'
  ],

  function (Arr, Query, Translate) {
    /**
     * After subdivide has split the unit, update the resulting PositionArray based on the unit start position.
     */
    var divide = function (unit, positions, subdivide) {
      var mini = subdivide(unit, positions);
      return Translate.translate(mini, unit.start());
    };

    /**
     * Adds extra split points into a PositionArray, using subdivide to split if necessary
     */
    var splits = function (parray, positions, subdivide) {
      if (positions.length === 0) return parray;

      return Arr.bind(parray, function (unit) {
        var relevant = Arr.bind(positions, function (pos) {
          return Query.inUnit(unit, pos) ? [ pos - unit.start() ] : [];
        });

        return relevant.length > 0 ? divide(unit, relevant, subdivide) : [ unit ];
      });
    };

    return {
      splits: splits
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.api.PositionArray',

  [
    'ephox.polaris.parray.Generator',
    'ephox.polaris.parray.Query',
    'ephox.polaris.parray.Split',
    'ephox.polaris.parray.Translate'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Generator, Query, Split, Translate) {
    var generate = function (items, generator, _start) {
      return Generator.make(items, generator, _start);
    };

    var get = function (parray, offset) {
      return Query.get(parray, offset);
    };

    var find = function (parray, pred) {
      return Query.find(parray, pred);
    };

    var splits = function (parray, positions, subdivide) {
      return Split.splits(parray, positions, subdivide);
    };

    var translate = function (parray, amount) {
      return Translate.translate(parray, amount);
    };

    var sublist = function (parray, start, finish) {
      return Query.sublist(parray, start, finish);
    };

    return {
      generate: generate,
      get: get,
      find: find,
      splits: splits,
      translate: translate,
      sublist: sublist
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.extract.Find',

  [
    'ephox.phoenix.api.data.Spot',
    'ephox.phoenix.extract.Extract',
    'ephox.phoenix.extract.TypedList',
    'ephox.polaris.api.PositionArray'
  ],

  function (Spot, Extract, TypedList, PositionArray) {

    /**
     * Finds an exact reference to a document point generated by Extract
     */
    var find = function (universe, parent, offset, optimise) {
      var extractions = Extract.typed(universe, parent, optimise);

      var parray = PositionArray.generate(extractions, TypedList.gen);
      var spot = PositionArray.get(parray, offset);
      return spot.map(function (v) {
        return Spot.point(v.element(), offset - v.start());
      });
    };

    return {
      find: find
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.api.general.Extract',

  [
    'ephox.phoenix.extract.Extract',
    'ephox.phoenix.extract.ExtractText',
    'ephox.phoenix.extract.Find'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Extract, ExtractText, Find) {

    var from = function (universe, item, optimise) {
      return Extract.typed(universe, item, optimise);
    };

    var all = function (universe, item, optimise) {
      return Extract.items(universe, item, optimise);
    };

    var extract = function (universe, child, offset, optimise) {
      return Extract.extract(universe, child, offset, optimise);
    };

    var extractTo = function (universe, child, offset, pred, optimise) {
      return Extract.extractTo(universe, child, offset, pred, optimise);
    };

    var find = function (universe, parent, offset, optimise) {
      return Find.find(universe, parent, offset, optimise);
    };

    var toText = function (universe, item, optimise) {
      return ExtractText.from(universe, item, optimise);
    };

    return {
      extract: extract,
      extractTo: extractTo,
      all: all,
      from: from,
      find: find,
      toText: toText
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.family.Group',

  [
    'ephox.compass.Arr',
    'ephox.phoenix.api.general.Extract',
    'ephox.polaris.api.Arrays'
  ],

  function (Arr, Extract, Arrays) {
    /**
     * Return an array of arrays split by boundaries
     */
    var group = function (universe, items, optimise) {
      var extractions = Arr.bind(items, function (item) {
        return Extract.from(universe, item, optimise);
      });

      var segments = Arrays.splitby(extractions, function (item) {
        return item.isBoundary();
      });

      return Arr.filter(segments, function (x) { return x.length > 0; });
    };

    return {
      group: group
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.family.Parents',

  [
    'ephox.compass.Arr',
    'ephox.perhaps.Option'
  ],

  function (Arr, Option) {
    /**
     * Search the parents of both items for a common element
     */
    var common = function (universe, item1, item2) {
      var item1parents = [item1].concat(universe.up().all(item1));
      var item2parents = [item2].concat(universe.up().all(item2));

      var r = Arr.find(item1parents, function (x) {
        return Arr.exists(item2parents, function (y) {
          return universe.eq(y, x);
        });
      });

      return Option.from(r);
    };

    return {
      common: common
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.wrap.OrphanText',

  [
    'ephox.compass.Arr'
  ],

  function (Arr) {
    // Textnodes cannot be children of these tags
    var textBlacklist = [ 'table', 'tbody', 'thead', 'tfoot', 'tr', 'ul', 'ol' ];

    return function (universe) {
      var domUtils = universe.property();
      var validateParent = function (node, blacklist) {
        return domUtils.parent(node).map(domUtils.name).map(function (name) {
          return !Arr.contains(blacklist, name);
        }).getOr(false);
      };

      var validateText = function (textNode) {
        return domUtils.isText(textNode) && validateParent(textNode, textBlacklist);
      };

      return {
        validateText: validateText
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.family.Range',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.phoenix.api.general.Extract',
    'ephox.phoenix.family.Parents',
    'ephox.phoenix.wrap.OrphanText'
  ],

  function (Arr, Fun, Extract, Parents, OrphanText) {
    var index = function (universe, items, item) {
      return Arr.findIndex(items, Fun.curry(universe.eq, item));
    };

    var order = function (items, a, delta1, b, delta2) {
      return a < b ? items.slice(a + delta1, b + delta2) : items.slice(b + delta2, a + delta1);
    };

    /**
     * Returns a flat array of text nodes between two defined nodes.
     *
     * Deltas are a broken concept. They control whether the item passed is included in the result.
     */
    var range = function (universe, item1, delta1, item2, delta2) {
      if (universe.eq(item1, item2)) return [item1];

      return Parents.common(universe, item1, item2).fold(function () {
        return []; // no common parent, therefore no intervening path. How does this clash with Path in robin?
      }, function (parent) {
        var items = [ parent ].concat(Extract.all(universe, parent, Fun.constant(false)));
        var start = index(universe, items, item1);
        var finish = index(universe, items, item2);
        var result = start > -1 && finish > -1 ? order(items, start, delta1, finish, delta2) : [];
        var orphanText = OrphanText(universe);
        return Arr.filter(result, orphanText.validateText);
      });
    };

    return {
      range: range
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.api.general.Family',

  [
    'ephox.phoenix.family.Group',
    'ephox.phoenix.family.Range'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Group, Range) {
    var range = function (universe, start, startDelta, finish, finishDelta) {
      return Range.range(universe, start, startDelta, finish, finishDelta);
    };

    var group = function (universe, items, optimise) {
      return Group.group(universe, items, optimise);
    };

    return {
      range: range,
      group: group
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.string.Sanitise',

  [

  ],

  function () {
    /**
     * Sanitises a string for use in a CSS class name
     */
    var css = function (str) {
      // special case; the first character must a letter. More strict than CSS, but easier to implement.
      var r = /^[a-zA-Z]/.test(str) ? '' : 'e';

      // any non-word character becomes a hyphen
      var sanitised = str.replace(/[^\w]/gi, '-');

      return r + sanitised;
    };

    return {
      css: css
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.string.Split',

  [
    'ephox.compass.Arr'
  ],

  function (Arr) {
    /**
     * Splits a string into multiple chunks
     */
    var splits = function (value, indices) {
      if (indices.length === 0) return [value];

      var divisions = Arr.foldl(indices, function (acc, x) {
        if (x === 0) return acc;

        var part = value.substring(acc.prev, x);
        return {
          prev: x,
          values: acc.values.concat([part])
        };
      }, { prev: 0, values: [] });

      var lastPoint = indices[indices.length - 1];
      return lastPoint < value.length ? divisions.values.concat(value.substring(lastPoint)) : divisions.values;
    };

    return {
      splits: splits
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.api.Strings',

  [
    'ephox.polaris.string.Sanitise',
    'ephox.polaris.string.Split'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Sanitise, Split) {
    var splits = function (text, points) {
      return Split.splits(text, points);
    };

    var cssSanitise = function (str) {
      return Sanitise.css(str);
    };

    return {
      cssSanitise: cssSanitise,
      splits: splits
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.search.Splitter',

  [
    'ephox.compass.Arr',
    'ephox.perhaps.Option',
    'ephox.phoenix.api.data.Spot',
    'ephox.polaris.api.PositionArray',
    'ephox.polaris.api.Strings'
  ],

  function (Arr, Option, Spot, PositionArray, Strings) {

    /**
     * Re-generates an item's text nodes, split as defined by the positions array.
     *
     * Returns a PositionArray of the result.
     */
    var subdivide = function (universe, item, positions) {
      var text = universe.property().getText(item);
      var pieces = Arr.filter(Strings.splits(text, positions), function (section) {
        return section.length > 0;
      });

      if (pieces.length <= 1) return [ Spot.range(item, 0, text.length) ];
      universe.property().setText(item, pieces[0]);

      var others = PositionArray.generate(pieces.slice(1), function (a, start) {
        var nu = universe.create().text(a);
        var result = Spot.range(nu, start, start + a.length);
        return Option.some(result);
      }, pieces[0].length);

      var otherElements = Arr.map(others, function (a) { return a.element(); });
      universe.insert().afterAll(item, otherElements);

      return [ Spot.range(item, 0, pieces[0].length) ].concat(others);
    };

    return {
      subdivide: subdivide
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.search.MatchSplitter',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.phoenix.search.Splitter',
    'ephox.polaris.api.PositionArray'
  ],

  function (Arr, Fun, Splitter, PositionArray) {
    /**
     * Split each text node in the list using the match endpoints.
     *
     * Each match is then mapped to the word it matched and the elements that make up the word.
     */
    var separate = function (universe, list, matches) {
      var allPositions = Arr.bind(matches, function (match) {
        return [ match.start(), match.finish() ];
      });

      var subdivide = function (unit, positions) {
        return Splitter.subdivide(universe, unit.element(), positions);
      };

      var structure = PositionArray.splits(list, allPositions, subdivide);

      var collate = function (match) {
        var sub = PositionArray.sublist(structure, match.start(), match.finish());

        var elements = Arr.map(sub, function (unit) { return unit.element(); });

        var exact = Arr.map(elements, universe.property().getText).join('');
        return {
          elements: Fun.constant(elements),
          word: match.word,
          exact: Fun.constant(exact)
        };
      };

      return Arr.map(matches, collate);
    };

    return {
      separate: separate
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.bud.Unicode',

  [
  ],

  function () {
    // \u200B needs to be removed manually as it is not considered whitespace when trimming
    // \uFEFF does not need to be removed manually. It is considered whitespace when trimming
    var zeroWidth = function () {
      return '\u200B';
    };

    // Note, we are separating these out so that we are accounting for the subtle differences
    // between them. Eventually, we'll want to combine them again.
    var trimNative = function (str) {
      return str.replace(/\u200B/, '').trim();
    };

    var trimWithRegex = function (str) {
      return str.replace(/^\s+|\s+$/g, '').replace(/\u200B/, '');
    };

    return {
      zeroWidth: zeroWidth,
      trimNative: trimNative,
      trimWithRegex: trimWithRegex
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.pattern.Chars',

  [
    'ephox.bud.Unicode',
    'ephox.peanut.Fun'
  ],

  function (Unicode, Fun) {
    // \w is a word character
    // \' is an apostrophe
    // '-' is a hyphen
    // \u00C0 - \u00FF are various language characters
    // \u2018 and \u2019 are the smart quote characters
    var chars = '\\w' + '\'' + '\\-' + '\\u00C0-\\u00FF' + Unicode.zeroWidth() + '\\u2018\\u2019';
    var wordbreak = '[^' + chars + ']';
    var wordchar = '[' + chars + ']';

    return {
      chars: Fun.constant(chars),
      wordbreak: Fun.constant(wordbreak),
      wordchar: Fun.constant(wordchar)
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.pattern.Custom',

  [
    'global!RegExp'
  ],

  function (RegExp) {
    return function (regex, prefix, suffix, flags) {
      var term = function () {
        return new RegExp(regex, flags.getOr('g'));
      };

      return {
        term: term,
        prefix: prefix,
        suffix: suffix
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.pattern.Unsafe',

  [
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.polaris.pattern.Chars',
    'ephox.polaris.pattern.Custom'
  ],

  function (Fun, Option, Chars, Custom) {

    /**
     * Tokens have no prefix or suffix
     */
    var token = function (input) {
      return Custom(input, Fun.constant(0), Fun.constant(0), Option.none());
    };

    /**
     * Words have complex rules as to what a "word break" actually is.
     *
     * These are consumed by the regex and then excluded by prefix/suffix lengths.
     */
    var word = function (input) {
      var regex = '((?:^\'?)|(?:' + Chars.wordbreak() + '+\'?))' + input + '((?:\'?$)|(?:\'?' + Chars.wordbreak() + '+))';

      // ASSUMPTION: There are no groups in their input
      var prefix = function (match) {
        return match.length > 1 ? match[1].length : 0;
      };

      var suffix = function (match) {
        return match.length > 2 ? match[2].length : 0;
      };

      return Custom(regex, prefix, suffix, Option.none());
    };

    return {
      token: token,
      word: word
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.pattern.Safe',

  [
    'ephox.polaris.pattern.Unsafe'
  ],

  /** Sanitises all inputs to Unsafe */
  function (Unsafe) {
    /** Escapes regex characters in a string */
    var sanitise = function (input) {
      return input.replace(/[-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    };

    var word = function (input) {
      var value = sanitise(input);
      return Unsafe.word(value);
    };

    var token = function (input) {
      var value = sanitise(input);
      return Unsafe.token(value);
    };

    return {
      sanitise: sanitise,
      word: word,
      token: token
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.api.Pattern',

  [
    'ephox.polaris.pattern.Chars',
    'ephox.polaris.pattern.Custom',
    'ephox.polaris.pattern.Safe',
    'ephox.polaris.pattern.Unsafe'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Chars, Custom, Safe, Unsafe) {
    var safeword = function (input) {
      return Safe.word(input);
    };

    var safetoken = function (input) {
      return Safe.token(input);
    };

    var custom = function (input, prefix, suffix, flags) {
      return Custom(input, prefix, suffix, flags);
    };

    var unsafeword = function (input) {
      return Unsafe.word(input);
    };

    var unsafetoken = function (input) {
      return Unsafe.token(input);
    };

    var sanitise = function (input) {
      return Safe.sanitise(input);
    };

    var chars = function () {
      return Chars.chars();
    };

    var wordbreak = function () {
      return Chars.wordbreak();
    };

    var wordchar = function () {
      return Chars.wordchar();
    };

    return {
      safeword: safeword,
      safetoken: safetoken,
      custom: custom,
      unsafeword: unsafeword,
      unsafetoken: unsafetoken,
      sanitise: sanitise,
      chars: chars,
      wordbreak: wordbreak,
      wordchar: wordchar
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.search.Find',

  [
    'ephox.peanut.Fun'
  ],

  function (Fun) {

    /**
     * Returns the offset pairs of all matches of pattern on the input string, adjusting for prefix and suffix offsets
     */
    var all = function (input, pattern) {
      var term = pattern.term();
      var r = [];
      var match = term.exec(input);
      while (match) {
        var start = match.index + pattern.prefix(match);
        var length = match[0].length - pattern.prefix(match) - pattern.suffix(match);
        r.push({
          start: Fun.constant(start),
          finish: Fun.constant(start + length)
        });
        term.lastIndex = start + length;
        match = term.exec(input);
      }
      return r;
    };

    return {
      all: all
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.search.Sleuth',

  [
    'ephox.compass.Arr',
    'ephox.highway.Merger',
    'ephox.polaris.search.Find',
    'global!Array'
  ],

  function (Arr, Merger, Find, Array) {
    var sort = function (array) {
      var r = Array.prototype.slice.call(array, 0);
      r.sort(function (a, b) {
        if (a.start() < b.start()) return -1;
        else if (b.start() < a.start()) return 1;
        else return 0;
      });
      return r;
    };

    /**
     * For each target (pattern, ....), find the matching text (if there is any) and record the start and end offsets.
     *
     * Then sort the result by start point.
     */
    var search = function (text, targets) {
      var unsorted = Arr.bind(targets, function (t) {
        var results = Find.all(text, t.pattern());
        return Arr.map(results, function (r) {
          return Merger.merge(t, {
            start: r.start,
            finish: r.finish
          });
        });
      });

      return sort(unsorted);
    };

    return {
      search: search
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.polaris.api.Search',

  [
    'ephox.polaris.search.Find',
    'ephox.polaris.search.Sleuth'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Find, Sleuth) {
    var findall = function (input, pattern) {
      return Find.all(input, pattern);
    };

    var findmany = function (input, targets) {
      return Sleuth.search(input, targets);
    };

    return {
      findall: findall,
      findmany: findmany
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.search.Searcher',

  [
    'ephox.compass.Arr',
    'ephox.perhaps.Option',
    'ephox.phoenix.api.data.NamedPattern',
    'ephox.phoenix.api.data.Spot',
    'ephox.phoenix.api.general.Family',
    'ephox.phoenix.extract.TypedList',
    'ephox.phoenix.search.MatchSplitter',
    'ephox.polaris.api.Pattern',
    'ephox.polaris.api.PositionArray',
    'ephox.polaris.api.Search'
  ],

  function (Arr, Option, NamedPattern, Spot, Family, TypedList, MatchSplitter, Pattern, PositionArray, Search) {
    var gen = function (universe, input) {
      return PositionArray.generate(input, function (unit, offset) {
        var finish = offset + universe.property().getText(unit).length;
        return Option.from(Spot.range(unit, offset, finish));
      });
    };

    /**
     * Extracts groups of elements separated by boundaries.
     *
     * For each group, search the text for pattern matches.
     *
     * Returns a list of matches.
     */
    var run = function (universe, elements, patterns, optimise) {
      var sections = Family.group(universe, elements, optimise);
      var result = Arr.bind(sections, function (x) {
        var input = TypedList.justText(x);
        var text = Arr.map(input, universe.property().getText).join('');

        var matches = Search.findmany(text, patterns);
        var plist = gen(universe, input);

        return MatchSplitter.separate(universe, plist, matches);
      });

      return result;
    };


    /**
     * Runs a search for one or more words
     */
    var safeWords = function (universe, elements, words, optimise) {
      var patterns = Arr.map(words, function (word) {
        var pattern = Pattern.safeword(word);
        return NamedPattern(word, pattern);
      });
      return run(universe, elements, patterns, optimise);
    };


    /**
     * Runs a search for a single token
     */
    var safeToken = function (universe, elements, token, optimise) {
      var pattern = NamedPattern(token, Pattern.safetoken(token));
      return run(universe, elements, [pattern], optimise);
    };

    return {
      safeWords: safeWords,
      safeToken: safeToken,
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.api.general.Search',

  [
    'ephox.phoenix.search.Searcher'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Searcher) {
    var run = function (universe, items, patterns, optimise) {
      return Searcher.run(universe, items, patterns, optimise);
    };

    var safeWords = function (universe, items, words, optimise) {
      return Searcher.safeWords(universe, items, words, optimise);
    };

    var safeToken = function (universe, items, token, optimise) {
      return Searcher.safeToken(universe, items, token, optimise);
    };

    return {
      safeWords: safeWords,
      safeToken: safeToken,
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.phoenix.api.dom.DomSearch',

  [
    'ephox.boss.api.DomUniverse',
    'ephox.phoenix.api.general.Search'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (DomUniverse, Search) {
    var universe = DomUniverse();

    var run = function (elements, patterns, optimise) {
      return Search.run(universe, elements, patterns, optimise);
    };

    var safeWords = function (elements, words, optimise) {
      return Search.safeWords(universe, elements, words, optimise);
    };

    var safeToken = function (elements, token, optimise) {
      return Search.safeToken(universe, elements, token, optimise);
    };

    return {
      safeWords: safeWords,
      safeToken: safeToken,
      run: run
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sugar.api.SelectorExists',

  [
    'ephox.sugar.api.SelectorFind'
  ],

  function (SelectorFind) {
    var any = function (selector) {
      return SelectorFind.first(selector).isSome();
    };

    var ancestor = function (scope, selector, isRoot) {
      return SelectorFind.ancestor(scope, selector, isRoot).isSome();
    };

    var sibling = function (scope, selector) {
      return SelectorFind.sibling(scope, selector).isSome();
    };

    var child = function (scope, selector) {
      return SelectorFind.child(scope, selector).isSome();
    };

    var descendant = function (scope, selector) {
      return SelectorFind.descendant(scope, selector).isSome();
    };

    var closest = function (scope, selector, isRoot) {
      return SelectorFind.closest(scope, selector, isRoot).isSome();
    };

    return {
      any: any,
      ancestor: ancestor,
      sibling: sibling,
      child: child,
      descendant: descendant,
      closest: closest
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.limbo.process.Preprocessor',

  [
    'ephox.compass.Arr',
    'ephox.perhaps.Option',
    'ephox.phoenix.api.dom.DomSearch',
    'ephox.polaris.api.Pattern',
    'ephox.scullion.Struct',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.SelectorExists'
  ],

  function (Arr, Option, DomSearch, Pattern, Struct, Attr, Css, Element, Html, Insert, InsertAll, Node, SelectorExists) {
    //the big fat holy grail of URL pattern matching..
    var regex = '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[\\-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9\\.\\-]+|(?:www\\.|[\\-;:&=\\+\\$,\\w]+@)[A-Za-z0-9\\.\\-]+)(:[0-9]+)?((?:\\/[\\+~%\\/\\.\\w\\-_]*)?\\??(?:[\\-\\+=&;%@\\.\\w_]*)#?(?:[\\.\\!\\/\\\\\\w]*))?)';

    var findLinks = function (elements) {
      var data = Struct.immutable('word', 'pattern');
      var term = Pattern.unsafetoken(regex);
      var pattern = data('__INTERNAL__', term);
      return DomSearch.run(elements, [pattern]);
    };

    var notInLink = function (element) {
      // return true;
      return !SelectorExists.closest(element, 'a');
    };

    var wrap = function (elements) {
      return Option.from(elements[0]).filter(notInLink).map(function (first) {
        var tag = Element.fromTag('a');
        Insert.before(first, tag);
        InsertAll.append(tag, elements);
        Attr.set(tag, 'href', Html.get(tag));
        return tag;
      });
    };

    var links = function (elements) {
      var matches = findLinks(elements);
      Arr.each(matches, function (match) {
        // TBIO-2444 Do not wrap anything with @ symbol, it could be an email
        if(match.exact().indexOf('@') < 0) wrap(match.elements());
      });
    };

    var position = function (elements) {
      Arr.each(elements, function (elem) {
        if (Node.isElement(elem)) Css.remove(elem, 'position');
      });
    };

    return {
      links: links,
      position: position
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.limbo.api.RunPaste',

  [
    'ephox.compass.Arr',
    'ephox.limbo.process.PasteFilters',
    'ephox.limbo.process.Preprocessor',
    'ephox.pastiche.api.HybridAction',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Traverse'
  ],

  function (Arr, PasteFilters, Preprocessor, HybridAction, Html, Traverse) {
    var preprocess = function (platform, container) {
      var children = Traverse.children(container);
      Arr.each([ Preprocessor.links, Preprocessor.position ], function (f) {
        f(children);
      });
    };

    var go = function (doc, platform, container, merging, isWord) {
      preprocess(platform, container);
      var html = Html.get(container);
      var filters = PasteFilters.derive(isWord, merging, platform);
      return HybridAction.go(doc, html, filters);
    };

    return {
      go: go
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.limbo.api.Sources',

  [
    'ephox.pastiche.api.HybridAction',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.PredicateExists'
  ],

  function (HybridAction, Attr, Html, PredicateExists) {
    var ie11 = function (container) {
      // This looks expensive. Using grep on corpus,
      // string searching for "<font" or "mso-list:" picked up all relevant cases
      return PredicateExists.descendant(container, function (el) {
        return Attr.has(el, 'style') ? Attr.get(el, 'style').indexOf('mso-') > -1 : false;
      });
    };

    var other = function (container) {
      var html = Html.get(container);
      return HybridAction.isWordContent(html);
    };

    var isWord = function (platform, container) {
      var browser = platform.browser;
      var detector = browser.isIE() && browser.version.major >= 11 ? ie11 : other;
      return detector(container);
    };

    return {
      isWord: isWord
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sloth.data.Range',

  [
    'ephox.peanut.Fun',
    'ephox.sugar.api.Compare'
  ],

  function (Fun, Compare) {
    return function (startContainer, startOffset, endContainer, endOffset) {
      var collapsed = Compare.eq(startContainer, endContainer) && startOffset === endOffset;

      return {
        startContainer: Fun.constant(startContainer),
        startOffset: Fun.constant(startOffset),
        endContainer: Fun.constant(endContainer),
        endOffset: Fun.constant(endOffset),
        collapsed: Fun.constant(collapsed)
      };
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sloth.api.BodySwitch',

  [
    'ephox.sloth.data.Range',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.Traverse'
  ],

  function (Range, Element, Insert, Remove, Traverse) {
    return function (selection) {

      var placeholder = Element.fromTag('br');

      var toOn = function (element, offscreen) {
        element.dom().focus();
      };

      var getWin = function (offscreen) {
        var doc = Traverse.owner(offscreen);
        return doc.dom().defaultView;
      };

      var toOff = function (element, offscreen) {
        var win = getWin(offscreen);
        win.focus();
        Insert.append(offscreen, placeholder);
        selection.set(win, Range(placeholder, 0, placeholder, 0));
      };

      var cleanup = function () {
        Remove.remove(placeholder);
      };

      return {
        cleanup: cleanup,
        toOn: toOn,
        toOff: toOff
      };
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sloth.api.DivSwitch',

  [
    'ephox.peanut.Fun'
  ],

  function (Fun) {
    return function () {
      var toOn = function (element, offscreen) {
        element.dom().focus();
      };

      var toOff = function (element, offscreen) {
        offscreen.dom().focus();
      };

      var cleanup = Fun.identity;

      return {
        toOn: toOn,
        toOff: toOff,
        cleanup: cleanup
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.plumber.tap.control.BlockControl',

  [
  ],

  function () {
    var create = function () {
      var blocked = false;
      var isBlocked = function () { return blocked; };
      var block = function () { blocked = true; };
      var unblock = function () { blocked = false; };

      return {
        isBlocked: isBlocked,
        block: block,
        unblock: unblock
      }
    };

    return {
      create: create
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.plumber.tap.wrap.Tapped',

  [
  ],

  function () {
    var create = function (control, instance) {
      return {
        control: control,
        instance: instance
      }
    };

    return {
      create: create
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.plumber.tap.function.BlockTap',

  [
    'ephox.plumber.tap.control.BlockControl',
    'ephox.plumber.tap.wrap.Tapped'
  ],

  function (BlockControl, Tapped) {
    var tap = function (fn) {
      var control = BlockControl.create();

      var instance = function () {
        if (!control.isBlocked())
          fn.apply(null, arguments);
      };

      return Tapped.create(control, instance);
    };

    return {
      tap: tap
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sloth.api.Paste',

  [
    'ephox.fred.PlatformDetection',
    'ephox.peanut.Fun',
    'global!setTimeout'
  ],

  function (PlatformDetection, Fun, setTimeout) {
    var detection = PlatformDetection.detect();

    var ie10 = function (doc, tap, postpaste) {
      // Block the tap, and fire a paste.
      tap.control.block();
      doc.dom().execCommand('paste');
      postpaste();
      tap.control.unblock();
    };

    var others = function (doc, tap, postpaste) {
      setTimeout(postpaste, 1);
    };

    // Most browsers can just let the paste event continue.
    // on IE10, the paste event must be cancelled and done manually
    var willBlock = detection.browser.isIE() && detection.browser.version.major <= 10;

    var runner = willBlock ? ie10 : others;

    var run = function (doc, tap, postpaste) {
      return runner(doc, tap, postpaste);
    };

    return {
      willBlock: Fun.constant(willBlock),
      run: run
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sloth.engine.Consolidator',

  [
    'ephox.compass.Arr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.Traverse'
  ],

  function (Arr, Element, Insert, InsertAll, Remove, Traverse) {
    // TBIO-2440. In some situations on Windows 7 Chrome, pasting into the offscreen div
    // actually splits the div in two. The purpose of this function is to incorporate
    // any of the split divs into the main one.
    var consolidate = function (offscreen, isOffscreen) {
      Traverse.nextSibling(offscreen).filter(isOffscreen).each(function (other) {
        var children = Traverse.children(other);
        InsertAll.append(offscreen, children);
        Remove.remove(other);
      });
      oneChild(offscreen, isOffscreen);
    };
    // TBIO-3010: In Chrome (reproducible in both Windows and Mac) when pasting from notepad the offscreen div
    // generates multiple sloth divs, causing the content to be not pasted correctly. This function
    // runs across the children of the offscreen div and if it is a sloth element then it extract
    // the content and wraps it in a normal div.
    var cleanChild = function (child, offscreen) {
      var children = Traverse.children(child);
      var wrapper = Element.fromTag('div', Traverse.owner(child).dom());
      InsertAll.append(wrapper, children);
      Insert.before(child, wrapper);
      Remove.remove(child);
    };

    var oneChild = function (offscreen, isOffscreen) {
      var children = Traverse.children(offscreen);
      Arr.each(children, function (child) {
        if (isOffscreen(child)) cleanChild(child, offscreen);
      });
    };

    return {
      consolidate: consolidate
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sloth.engine.Offscreen',

  [
    'ephox.epithet.Id',
    'ephox.scullion.Struct',
    'ephox.sloth.engine.Consolidator',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Css',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorFind',
    'ephox.sugar.api.Traverse'
  ],

  function (Id, Struct, Consolidator, Attr, Class, Css, Element, Html, Insert, Remove, SelectorFind, Traverse) {
    var hash = Id.generate('ephox-sloth-bin');

    return function (switcher) {
      var offscreen = Element.fromTag('div');
      Attr.set(offscreen, 'contenteditable', 'true');
      Class.add(offscreen, hash);
      Css.setAll(offscreen, {
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '0px',
        height: '0px',
        overflow: 'hidden'
      });

      var attach = function (target) {
        Remove.empty(offscreen);
        Insert.append(target, offscreen);
      };

      var focus = function () {
        var body = SelectorFind.ancestor(offscreen, 'body');
        body.each(function (b) {
          switcher.toOff(b, offscreen);
        });
      };

      var isOffscreen = function (other) {
        return Class.has(other, hash);
      };

      var contents = function () {
        Consolidator.consolidate(offscreen, isOffscreen);
        var data = Struct.immutable('elements', 'html', 'container');
        var elements = Traverse.children(offscreen);
        var html = Html.get(offscreen);
        return data(elements, html, offscreen);
      };

      var detach = function () {
        Remove.remove(offscreen);
      };

      var container = function () {
        return offscreen;
      };

      return {
        attach: attach,
        focus: focus,
        contents: contents,
        container: container,
        detach: detach
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.sloth.api.ProxyPaste',

  [
    'ephox.peanut.Fun',
    'ephox.plumber.tap.function.BlockTap',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sloth.api.Paste',
    'ephox.sloth.engine.Offscreen',
    'ephox.sugar.api.Traverse'
  ],

  function (Fun, BlockTap, Event, Events, Paste, Offscreen, Traverse) {
    return function (switcher, element) {
      var offscreen = Offscreen(switcher);

      var postpaste = function () {
        switcher.cleanup();
        var contents = offscreen.contents();
        offscreen.detach();
        events.trigger.after(contents.elements(), contents.html(), offscreen.container());
      };

      var tap = BlockTap.tap(function () {
        events.trigger.before();
        offscreen.attach(element);
        offscreen.focus();
        Paste.run(Traverse.owner(element), tap, postpaste);
      });

      var handler = function () {
        tap.instance();
      };

      var events = Events.create({
        before: Event([]),
        after: Event(['elements', 'html', 'container'])
      });

      var destroy = Fun.noop;

      return {
        instance: Fun.constant(handler),
        destroy: destroy,
        events: events.registry
      };
    };

  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.pastiche.Pastiche',

  [
    'ephox.cement.api.CementConstants',
    'ephox.cement.pastiche.IeBlob',
    'ephox.compass.Arr',
    'ephox.fred.PlatformDetection',
    'ephox.fussy.api.WindowSelection',
    'ephox.limbo.api.RunPaste',
    'ephox.limbo.api.Sources',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.sloth.api.BodySwitch',
    'ephox.sloth.api.DivSwitch',
    'ephox.sloth.api.ProxyPaste',
    'ephox.sugar.api.Class',
    'ephox.sugar.api.Elements',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.Traverse',
    'global!console',
    'global!setTimeout'
  ],

  function (CementConstants, IeBlob, Arr, PlatformDetection, WindowSelection, RunPaste, Sources, Fun, Option, Event, Events, BodySwitch, DivSwitch, ProxyPaste, Class, Elements, Node, Remove, Traverse, console, setTimeout) {
    var platform = PlatformDetection.detect();

    return function (prePasteFilter, body, mergeSettings, intraFlag) {
      // Temporary hack until we restructure in TBIO-1515
      var findClipboardTags = function (container, isWord) {
        return (intraFlag !== undefined && !isWord) ? intraFlag.findClipboardTags(Traverse.children(container)) : Option.none();
      };


      var events = Events.create({
        paste: Event(['elements', 'assets']),
        error: Event(['message'])
      });

      var fakeSelecton = {
        // dupe from hare.selection.Selection
        set: function (win, range) {
          WindowSelection.setExact(win, range.startContainer(), range.startOffset(), range.endContainer(), range.endOffset());
        }
      };

      // TBIO-2019: scrollbar lock on paste.
      // When using DivSwitch for inline editing, FF & webkit browsers will lock the scrollbar after paste
      // This is because the the offscreen div was not used and hence no filtration was run and the scrollbar unlock code never got called
      // To verify this paste formatted html and see the formatting unchanged <span style="color:red">test</span>
      // DivSwitch calls focus on the offscreen div, FF & Webkit do not set selection on focus,
      // so inserting into offscreen div fails, bypassing the rest of the past process.
      // It works in IE because amazingly IE sets selection on focus.
      // Calling BodySwitch with IE inline mode paste fails altogether, the cause of the failure is unknown
      var switchF = platform.browser.isIE() && Node.name(body) !== 'body' ? DivSwitch: BodySwitch;
      var switcher = switchF(fakeSelecton);
      var documentElement = Traverse.owner(body);
      var proxyPaste = ProxyPaste(switcher, body);
      var backgroundAssets = Option.none();

      proxyPaste.events.after.bind(function (event) {
        var container = event.container();
        switcher.toOn(body, container);

        // Run a paste filter over the off-screen div.
        prePasteFilter(container);

        Class.add(container, CementConstants.binStyle());
        var isWord = Sources.isWord(platform, container);

        var pasteImpl = function (pasteSettings) {
          var merging = (isWord && pasteSettings.mergeOfficeStyles) === true || (!isWord && pasteSettings.mergeHtmlStyles === true);

          try {
            var dump = RunPaste.go(documentElement, platform, container, merging, isWord);
            if (dump !== undefined && dump !== null && dump.length > 0) {
              var elements = Elements.fromHtml(dump);

              backgroundAssets.fold(function () {
                events.trigger.paste(elements, []);
              }, function (future) {
                future.get(function (assets) {
                  events.trigger.paste(elements, assets);
                });
              });
              backgroundAssets = Option.none();
            } else {
              // This is required to stop the scroll blocking. (TBIO-2440)
              events.trigger.paste([], []);
            }
          } catch (e) {
            console.error(e);
            events.trigger.error('errors.paste.process.failure');
          }
        };

        // This potentially prompts the user, so it needs to be a callback
        var normalPaste = Fun.curry(mergeSettings.get, isWord, pasteImpl);

        // Temporary hack until we restructure in TBIO-1515
        findClipboardTags(container, isWord).fold(normalPaste, function (tags) {
          Arr.each(tags, Remove.remove);
          // making sure it's asynchronous in both scenarios
          setTimeout(function () {
            // No need to call mergeSettings.get, we're just hard coding true
            pasteImpl({ mergeHtmlStyles: true });
          }, 0);
        });
      });

      var destroy = function () {
        proxyPaste.destroy();
      };

      var handler = function (raw) {
        try {
          backgroundAssets = IeBlob.convert(raw);
          var instance = proxyPaste.instance();
          instance();
        } catch (e) {
          console.error(e);
          events.trigger.error('errors.paste.process.failure');
        }
      };

      return {
        handler: handler,
        isSupported: Fun.constant(true),
        events: events.registry,
        destroy: destroy
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.smartpaste.PasteHandlers',

  [
    'ephox.cement.html.HtmlPaste',
    'ephox.cement.images.ImagePaste',
    'ephox.cement.pastiche.Pastiche',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.scullion.Struct',
    'ephox.violin.Strings'
  ],

  function (HtmlPaste, ImagePaste, Pastiche, Event, Events, Struct, Strings) {
    var result = Struct.immutable('captured');

    var dataContainsMicrosoftOfficeUrn = function (data) {
      // copied from ELJ, this logic doesn't exist in Tord and Pastiche's version isn't good enough
      return Strings.contains(data, '<html') &&
        (Strings.contains(data, 'xmlns:o="urn:schemas-microsoft-com:office:office"') ||
         Strings.contains(data, 'xmlns:x="urn:schemas-microsoft-com:office:excel"'));
    };

    return function (prePasteFilter, body, mergeSettings, pasteSettings) {
      // Temporary hack until we restructure in TBIO-1515
      var intraFlag = pasteSettings.intraFlag;

      var htmlPaste = HtmlPaste(mergeSettings, pasteSettings);
      var imagePaste = ImagePaste(pasteSettings);
      var fallback = Pastiche(prePasteFilter, body, mergeSettings, intraFlag);

      var events = Events.create({
        paste: Event(['elements', 'assets']),
        error: Event(['message']),
        cancel: Event([])
      });

      var bindEvents = function (source) {
        // why can't this be easy
        source.events.error.bind(function (event) {
          events.trigger.error(event.message());
        });
        source.events.paste.bind(function (event) {
          var elements = event.elements();
          var assets = event.assets();

          if (elements.length === 0 && assets.length === 0)
               events.trigger.cancel();
          else events.trigger.paste(elements, assets);
        });
      };

      bindEvents(htmlPaste);
      bindEvents(imagePaste);
      bindEvents(fallback);

      var htmlRawImpl = function (raw, preferredType) {
        var data = raw.clipboardData.getData(preferredType);
        // the decision was made that non-word HTML paste uses pastiche,
        // rather than run pastiche after tord
        var captured = dataContainsMicrosoftOfficeUrn(data) ?
                htmlPaste.handler(data) :
                execFallback(raw, preferredType);

        return result(captured);
      };

      var imageRawImpl = function (raw, _) {
        var captured = imagePaste.handler(raw.clipboardData.items);
        return result(captured);
      };

      // has it's own function to ensure when the arguments change both places are updated
      var execFallback = function (raw, _) {
        fallback.handler(raw);
        return false;
      };

      var fallbackImpl = function (raw, preferredType) {
        var captured = execFallback(raw, preferredType);
        return result(captured);
      };

      // this must contain everything from the priority list in PasteBroker
      var handlers = {
        'html': htmlRawImpl,
        'image': imagePaste.isSupported() ? imageRawImpl : fallbackImpl,
        'files': imagePaste.isSupported() ? imageRawImpl : fallbackImpl,
        'fallback': fallbackImpl
      };

      // Temporary hack until we restructure in TBIO-1515
      if (intraFlag !== undefined) {
        handlers[intraFlag.clipboardType()] = fallbackImpl;
      }

      var destroy = function () {
        fallback.destroy();
      };

      return {
        events: events.registry,
        handlers: handlers,
        destroy: destroy
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.smartpaste.PasteBroker',

  [
    'ephox.cement.smartpaste.Inspection',
    'ephox.cement.smartpaste.PasteHandlers',
    'ephox.perhaps.Option',
    'ephox.perhaps.Options',
    'global!RegExp'
  ],

  function (Inspection, PasteHandlers, Option, Options, RegExp) {
    // these must match the list of handler functions in PasteHandlers
    var defaultPriority = ['html', 'image', 'files'];

    var unknownFlavor = { flavor: 'fallback' };

    var getPreferredFlavor = function (priority, data) {
      if (!Inspection.isValidData(data)) return unknownFlavor;
      var types = data.types;

      var r = Options.findMap(priority, function (p) {
        // case insensitive match on priority text (e.g. 'html' matches 'text/html')
        var pmatch = new RegExp(p, 'i');
        return Options.findMap(types, function (t) {
          return t.match(pmatch) !== null ?
                    Option.some({ type: t, flavor: p }) :
                    Option.none();
        });
      });
      return r.getOr(unknownFlavor);
    };

    // extracted to enforce separation of concerns between events, priority order and handling functions
    var createHandler = function (intraFlag, handlers) {

      // Temporary hack until we restructure in TBIO-1515
      var priority = intraFlag === undefined ? defaultPriority : [ intraFlag.clipboardType() ].concat(defaultPriority);

      return function (raw) {
        var preferred = getPreferredFlavor(priority, raw.clipboardData);
        var impl = handlers[preferred.flavor];
        var result = impl(raw, preferred.type);
        if (result.captured()) {
          raw.preventDefault();
        }
      };
    };

    return function (prePasteFilter, body, mergeSettings, pasteSettings) {
      var pasteHandlers = PasteHandlers(prePasteFilter, body, mergeSettings, pasteSettings);

      var handlePaste = createHandler(pasteSettings.intraFlag, pasteHandlers.handlers);

      var destroy = function () {
        pasteHandlers.destroy();
      };

      return {
        events: pasteHandlers.events,
        handlePaste: handlePaste,
        destroy: destroy
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.porkbun.SourceEvent',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.porkbun.Event'
  ],

  function (Arr, Fun, Event) {

    /** An event sourced from another event.

      :: ([String], {bind: ..., unbind: ...}) -> SourceEvent
    */
    return function (fields, source) {
      var mine = Event(fields);
      var numHandlers = 0;

      var triggerer = function(evt) {
        // yay! Let's unbox this event, convert it to a varargs, so it can be re-boxed!
        var args = Arr.map(fields, function (field) {
          return evt[field]();
        });
        mine.trigger.apply(null, args);
      };

      var bind = function (handler) {
        mine.bind(handler);
        numHandlers++;
        if (numHandlers === 1) {
          source.bind(triggerer);
        }
      };

      var unbind = function (handler) {
        mine.unbind(handler);
        numHandlers--;
        if (numHandlers === 0) {
          source.unbind(triggerer);
        }
      };

      return {
        bind: bind,
        unbind: unbind,
        trigger: Fun.die("Cannot trigger a source event.")
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.cement.api.Cement',

  [
    'ephox.cement.flash.Flash',
    'ephox.cement.smartpaste.MergeSettings',
    'ephox.cement.smartpaste.PasteBroker',
    'ephox.limbo.api.RtfImage',
    'ephox.plumber.tap.function.BlockTap',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.porkbun.SourceEvent',
    'ephox.sloth.api.Paste',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.InsertAll'
  ],

  function (Flash, MergeSettings, PasteBroker, RtfImage, BlockTap, Event, Events, SourceEvent, Paste, Element, InsertAll) {
    return function (body, createDialog, prePasteFilter, cementConfig) {
      var flash = Flash(createDialog, cementConfig);
      var mergeSettings = MergeSettings(createDialog, cementConfig);
      var pasteSettings = { baseUrl: cementConfig.baseUrl, allowLocalImages: cementConfig.allowLocalImages, intraFlag: cementConfig.intraFlag };
      var pasteBroker = PasteBroker(prePasteFilter, body, mergeSettings, pasteSettings);

      var events = Events.create({
        cancel: SourceEvent([], mergeSettings.events.cancel), // only merge settings can cancel paste, not flash
        error: Event(['message']),
        insert: Event(['elements', 'assets'])
      });

      var insert = function (event) {
        pasteTap.control.unblock();
        events.trigger.insert(event.elements(), event.assets());
      };

      flash.events.insert.bind(insert);

      var pasteTap = BlockTap.tap(function (nativeEvent) {
        if (Paste.willBlock()) {
          /*
             On IE10, a second paste is required. That happens synchronously, before we can
             return anything that says "block the tap".
             In order to make this code reentrant, we need to eagerly block.
          */
          pasteTap.control.block();

          /*
            We then need to cancel the native event, because due to reentrancy the "is blocked"
            check below actually returns false. If we don't prevent default here, we allow the
            default paste to complete on the initial paste event.
           */
          nativeEvent.preventDefault();
        }

        pasteBroker.handlePaste(nativeEvent);

        // If dialogs are opened, we set the block and need to prevent default
        if (pasteTap.control.isBlocked()) nativeEvent.preventDefault();
      });

      // block the broker from receiving paste events while the merge window is open.
      mergeSettings.events.open.bind(pasteTap.control.block);
      mergeSettings.events.close.bind(pasteTap.control.unblock);

      pasteBroker.events.paste.bind(function (event) {
        var elements = event.elements();
        var content = Element.fromTag('div');
        InsertAll.append(content, elements);

        if (RtfImage.exists(content)) {
          // block the broker from receiving paste events while the flash window is open.
          pasteTap.control.block();
          flash.gordon(content, event.assets());
        } else {
          insert(event);
        }
      });

      var destroy = function () {
        pasteBroker.destroy();
      };

      var passThroughError = function (event) {
        pasteTap.control.unblock();
        events.trigger.error(event.message());
      };
      flash.events.error.bind(passThroughError);
      pasteBroker.events.error.bind(passThroughError);

      return {
        paste: pasteTap.instance,
        isBlocked: pasteTap.control.isBlocked,
        destroy: destroy,
        events: events.registry
      };
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.settings.Defaults',

  [

  ],

  function() {
    return {
      officeStyles: 'prompt',
      htmlStyles: 'clean'
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.styles.Styles',

  [
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorExists',
    'ephox.sugar.api.SelectorFind',
    'global!document'
  ],

  function(Attr, Element, Insert, Remove, SelectorExists, SelectorFind, document) {
    var styleid = 'powerpaste-styles';
    var styleidselector = '#' + styleid;

    var injectStyles = function(url) {
      if (!SelectorExists.any(styleidselector)){
        var htmlString =
          '<style>' +
            '.ephox-cement-flashbin-helpcopy-kbd ' +
            '{font-size: 3em !important; text-align: center !important; vertical-align: middle !important; margin: .5em 0} ' +
            '.ephox-cement-flashbin-helpcopy-kbd .ephox-polish-help-kbd ' +
            '{font-size: 3em !important; vertical-align: middle !important;} ' +
            '.ephox-cement-flashbin-helpcopy a ' +
            '{text-decoration: underline} ' +
            '.ephox-cement-flashbin-loading-spinner ' +
            '{background-image: url(' + url + ') !important; width: 96px !important; height:96px !important; display: block; margin-left: auto !important; margin-right: auto !important; margin-top: 2em !important; margin-bottom: 2em !important;} ' +
            '.ephox-cement-flashbin-loading p ' +
            '{text-align: center !important; margin: 2em 0 !important} ' +
            '.ephox-cement-flashbin-target ' +
            '{height: 1px !important;} ' +
            '.ephox-cement-flashbin-target.ephox-cement-flash-activate ' +
            '{height: 150px !important; width: 100% !important;} ' +
            '.ephox-cement-flashbin-target object ' +
            '{height: 1px !important;} ' +
            '.ephox-cement-flashbin-target.ephox-cement-flash-activate object ' +
            '{height: 150px !important; width: 100% !important;} ' +
          '</style>';

        var style = Element.fromHtml(htmlString);
        Attr.set(style, 'type', 'text/css');
        Attr.set(style, 'id', styleid);

        var head = SelectorFind.first('head').getOrDie('Head element could not be found.');

        Insert.append(head, style);

      }
    };

    var removeStyles = function() {
      if (SelectorExists.any(styleidselector)) {

        var head = SelectorFind.first('head').getOrDie('Head element could not be found.');
        var style = SelectorFind.descendant(head, styleidselector).getOrDie('The style element could not be removed');

        Remove.remove(style);

      }
    };

    return {
      injectStyles: injectStyles,
      removeStyles: removeStyles
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.tinymce.ModernTinyDialog',

  [
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.powerpaste.util.NodeUtil',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.Remove',
    'ephox.sugar.api.SelectorFind'
  ],

  function(Event, Events, NodeUtil, Attr, Element, Insert, Remove, SelectorFind) {
    return function(editor) {
      var createDialog = function() {
        var win, title = "", content = "", controls = [], dialogContent = null;

        var events = Events.create({
          close: Event([])
        });

        var setTitle = function(label) {
          title = label;
        };

        var setContent = function(c) {
          if (tinymce.Env.safari) {

          }
          var contentString = NodeUtil.nodeToString(c.dom());
          content = [{
            type: 'container',
            html: contentString
          }];
          dialogContent = c;
        };

        var setButtons = function(buttons) {
          var tinyButtons = [];

          buttons.forEach(function(element, index, array){
            //Convert cement buttons into tiny buttons
            tinyButtons.push({
              text: element.text,
              onclick: element.click
            });
          });

          controls = tinyButtons;

        };

        var winCloseEvent = function(e) {
          events.trigger.close();
        };

        var programmaticWinClose = function() {
          //Unbind the close event, as the dialog close event has already triggered and doesn't need to be triggered again
          win.off('close', winCloseEvent);
          win.close('close');
        };

        var show = function() {
          //If we don't have any buttons, we need to add one (even if it just closes the dialog)
          if (controls.length === 0) {
            //This gives us back the capability to hit esc to close the dialog & the dialog doesn't take focus away from the editor
            controls = [{
              text: 'Close',
              onclick: function() {
                win.close();
              }
            }];
          }

          var winSettings = {
            title: title,
            spacing: 10,
            padding: 10,
            items: content,
            buttons: controls
          };

          win = editor.windowManager.open(winSettings);

          var tinyWindow = Element.fromDom(win.getEl());
          var proxy = SelectorFind.descendant(tinyWindow, '.' + Attr.get(dialogContent, 'class')).getOrDie('We must find this element or we cannot continue');
          Insert.before(proxy, dialogContent);
          Remove.remove(proxy);

          win.on('close', winCloseEvent);

        };

        var hide = function() {
          programmaticWinClose();
        };

        var destroy = function() {
          programmaticWinClose();
        };

        var reflow = function() {
          //(this doesn't work, reflow doesn't calc based on what's actually there, it works it out based on what's in the container on tiny's side)
          //So we could update the items, but for now the dialog sizes match so...
        };

        return {
          events: events.registry,
          setTitle: setTitle,
          setContent: setContent,
          setButtons: setButtons,
          show: show,
          hide: hide,
          destroy: destroy,
          reflow: reflow
        };
      };

      return {
        createDialog: createDialog
      };
    };

  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.tinymce.ModernPowerPaste',
  [
    'ephox.cement.api.Cement',
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.powerpaste.i18n.I18n',
    'ephox.powerpaste.settings.Defaults',
    'ephox.powerpaste.styles.Styles',
    'ephox.powerpaste.tinymce.ErrorDialog',
    'ephox.powerpaste.tinymce.ModernTinyDialog',
    'ephox.powerpaste.util.NodeUtil',
    'ephox.sugar.api.DomEvent',
    'ephox.sugar.api.Element',
    'global!setTimeout',
    'global!tinymce'
  ],
  function (Cement, Arr, Fun, I18n, Defaults, Styles, ErrorDialog, ModernTinyDialog, NodeUtil, DomEvent, Element, setTimeout, tinymce) {
    return function (editor, url, settings, uploader) {

      var bm, swfUrl, imgUrl, cssUrl, jsUrl;

      jsUrl = (settings ? settings.swfUrl : url) + '/js';
      swfUrl = (settings ? settings.swfUrl : url) + '/flash/textboxpaste.swf';
      imgUrl = (settings ? settings.imgUrl : url) + '/img/spinner_96.gif';
      cssUrl = (settings ? settings.cssUrl : url) + '/css/editorcss.css';

      editor.on('init', function(e) {
        //Inject the styles for our dialog into the page
        Styles.injectStyles(imgUrl);

        //Inject css into editor
        editor.dom.loadCSS(cssUrl);

        var cementSettings = {
          baseUrl: jsUrl,
          swf: swfUrl,
          officeStyles: editor.settings.powerpaste_word_import || Defaults.officeStyles,
          htmlStyles: editor.settings.powerpaste_html_import || Defaults.htmlStyles,
          translations: I18n.translate,
          allowLocalImages: editor.settings.powerpaste_allow_local_images
        };

        var tinyDialog = ModernTinyDialog(editor);
        var ed = Element.fromDom(editor.getBody());
        var cement = Cement(ed, tinyDialog.createDialog, Fun.noop, cementSettings);

        cement.events.cancel.bind(function() {
          bm = null;
        });

        cement.events.error.bind(function(event) {

          bm = null;

          ErrorDialog.showDialog(editor,
            I18n.translate(
              event.message()
            )
          );
        });

        cement.events.insert.bind(function(event) {

          var stringHTML = Arr.map(event.elements(), function (element) {
              return NodeUtil.nodeToString(element.dom());
            }).join('');

          //This code was taken from tiny4
          if (editor.hasEventListeners('PastePostProcess')) {
            // We need to attach the element to the DOM so Sizzle selectors work on the contents
            var tempBody = editor.dom.add(editor.getBody(), 'div', {style: 'display:none'}, stringHTML);
            stringHTML = editor.fire('PastePostProcess', {node: tempBody}).node.innerHTML;
            editor.dom.remove(tempBody);
          }

          //Ensure the editor has focus
          editor.focus();

          //Wait for focus to come back (ie10)
          setTimeout(function(){

            //Once we've got the html we want to insert and have performed post processing, return the
            editor.selection.moveToBookmark(bm); //the selection to where it was

            //Delete the bookmark reference so we can do it all again
            bm = null;

            editor.undoManager.transact(function(){
              //Content insertion
              editor.insertContent(stringHTML, {merge: editor.settings.paste_merge_formats !== false});

              uploader.prepareImages(event.assets());
            });

            uploader.uploadImages(event.assets());

          }, 1);


        });

        DomEvent.bind(ed, 'paste', function (e) {
          //We need to bookmark the selection before we paste the content
          //So that it knows where to place it back in to the editor when we insert from cement.

          if (!bm) {
            //Since ie pastes twice, we need to get the bookmark once and ignore the second
            bm = editor.selection.getBookmark();
          }

          cement.paste(e.raw());

          //IE appears to require that we blur the iframe
          setTimeout(function() {
            if (editor.windowManager.windows[0]) {
              editor.windowManager.windows[0].getEl().focus();
            }
          }, 1);
        });

      });

      editor.on('remove', function(e) {
        //When we're removing the last editor, we need to remove our injected styles
        if (tinymce.editors.length === 1) {
          Styles.removeStyles();
        }
      });
    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.tinymce.TinyPowerPaste',
  [
    'ephox.powerpaste.imageupload.UploaderFactory',
    'ephox.powerpaste.tinymce.LegacyPowerPaste',
    'ephox.powerpaste.tinymce.ModernPowerDrop',
    'ephox.powerpaste.tinymce.ModernPowerPaste',
    'global!tinymce'
  ],

  function (UploaderFactory, LegacyPowerPaste, ModernPowerDrop, ModernPowerPaste, tinymce) {
    /*jshint jquery:true */
    return function (settings) {

      return function (editor, url) {

        var setupModern = function () {
          var uploader = UploaderFactory(editor);

          ModernPowerPaste(editor, url, settings, uploader);

          if (!editor.settings.powerpaste_block_drop) {
            ModernPowerDrop(editor, url, settings, uploader);
          }
        };

        var setupLegacy = function () {
          LegacyPowerPaste(editor, settings);
        };

        if (tinymce.Env.ie && tinymce.Env.ie < 10) {
          setupLegacy();
        } else {
          setupModern();
        }

        var blockDragEvents = function (element) {
          editor.dom.bind(element, 'drop dragstart dragend dragover dragenter dragleave dragdrop draggesture', function(e) {
            return tinymce.dom.Event.cancel(e);
          });
        };

        if (editor.settings.powerpaste_block_drop) {
          editor.on('init', function(e) {
            blockDragEvents(editor.getBody());
            blockDragEvents(editor.getDoc());
          });
        }

        if (editor.settings.paste_postprocess) {
          editor.on('PastePostProcess', function(e) {
            editor.settings.paste_postprocess.call(this, this, e);
          });
        }
      };
    };
  }
);

})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

(function (define, require, demand) {
define(
  'ephox.powerpaste.PowerPastePlugin',
  [
    'ephox.powerpaste.tinymce.TinyPowerPaste',
    'global!tinymce'
  ],
  function(TinyPowerPaste, tinymce) {
    return function(settings) {
      tinymce.PluginManager.requireLangPack('powerpaste', 'ar,ca,cs,da,de,el,es,fa,fi,fr_FR,he_IL,hr,hu_HU,it,ja,kk,ko_KR,nb_NO,nl,pl,pt_BR,pt_PT,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,zh_CN,zh_TW');
      tinymce.PluginManager.add('powerpaste', TinyPowerPaste(settings));

    };
  }
);
})(ephox.bolt.module.api.define, ephox.bolt.module.api.require, ephox.bolt.module.api.demand);

dem('ephox.powerpaste.PowerPastePlugin')();
  if (this.ephox && this.ephox.bolt)
    this.ephox.bolt = old;
})();
