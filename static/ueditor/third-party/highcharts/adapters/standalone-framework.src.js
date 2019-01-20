/**
 * @license Highcharts JS v3.0.6 (2013-10-04)
 *
 * Standalone Highcharts Framework
 *
 * License: MIT License
 */


/*global Highcharts */
var HighchartsAdapter = (function () {

var UNDEFINED,
	doc = document,
	emptyArray = [],
	timers = [],
	timerId,
	Fx;

Math.easeInOutSine = function (t, b, c, d) {
	return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};



/**
 * Extend given object with custom events
 */
function augment(obj) {
	function removeOneEvent(el, type, fn) {
		el.removeEventListener(type, fn, false);
	}

	function IERemoveOneEvent(el, type, fn) {
		fn = el.HCProxiedMethods[fn.toString()];
		el.detachEvent('on' + type, fn);
	}

	function removeAllEvents(el, type) {
		var events = el.HCEvents,
			remove,
			types,
			len,
			n;

		if (el.removeEventListener) {
			remove = removeOneEvent;
		} else if (el.attachEvent) {
			remove = IERemoveOneEvent;
		} else {
			return; // break on non-DOM events
		}


		if (type) {
			types = {};
			types[type] = true;
		} else {
			types = events;
		}

		for (n in types) {
			if (events[n]) {
				len = events[n].length;
				while (len--) {
					remove(el, n, events[n][len]);
				}
			}
		}
	}

	if (!obj.HCExtended) {
		Highcharts.extend(obj, {
			HCExtended: true,

			HCEvents: {},

			bind: function (name, fn) {
				var el = this,
					events = this.HCEvents,
					wrappedFn;

				// handle DOM events in modern browsers
				if (el.addEventListener) {
					el.addEventListener(name, fn, false);

				// handle old IE implementation
				} else if (el.attachEvent) {
					
					wrappedFn = function (e) {
						fn.call(el, e);
					};

					if (!el.HCProxiedMethods) {
						el.HCProxiedMethods = {};
					}

					// link wrapped fn with original fn, so we can get this in removeEvent
					el.HCProxiedMethods[fn.toString()] = wrappedFn;

					el.attachEvent('on' + name, wrappedFn);
				}


				if (events[name] === UNDEFINED) {
					events[name] = [];
				}

				events[name].push(fn);
			},

			unbind: function (name, fn) {
				var events,
					index;

				if (name) {
					events = this.HCEvents[name] || [];
					if (fn) {
						index = HighchartsAdapter.inArray(fn, events);
						if (index > -1) {
							events.splice(index, 1);
							this.HCEvents[name] = events;
						}
						if (this.removeEventListener) {
							removeOneEvent(this, name, fn);
						} else if (this.attachEvent) {
							IERemoveOneEvent(this, name, fn);
						}
					} else {
						removeAllEvents(this, name);
						this.HCEvents[name] = [];
					}
				} else {
					removeAllEvents(this);
					this.HCEvents = {};
				}
			},

			trigger: function (name, args) {
				var events = this.HCEvents[name] || [],
					target = this,
					len = events.length,
					i,
					preventDefault,
					fn;

				// Attach a simple preventDefault function to skip default handler if called
				preventDefault = function () {
					args.defaultPrevented = true;
				};
				
				for (i = 0; i < len; i++) {
					fn = events[i];

					// args is never null here
					if (args.stopped) {
						return;
					}

					args.preventDefault = preventDefault;
					args.target = target;
					args.type = name; // #2297	
					
					// If the event handler return false, prevent the default handler from executing
					if (fn.call(this, args) === false) {
						args.preventDefault();
					}
				}
			}
		});
	}

	return obj;
}


return {
	/**
	 * Initialize the adapter. This is run once as Highcharts is first run.
	 */
	init: function (pathAnim) {

		/**
		 * Compatibility section to add support for legacy IE. This can be removed if old IE 
		 * support is not needed.
		 */
		if (!doc.defaultView) {
			this._getStyle = function (el, prop) {
				var val;
				if (el.style[prop]) {
					return el.style[prop];
				} else {
					if (prop === 'opacity') {
						prop = 'filter';
					}
					/*jslint unparam: true*/
					val = el.currentStyle[prop.replace(/\-(\w)/g, function (a, b) { return b.toUpperCase(); })];
					if (prop === 'filter') {
						val = val.replace(
							/alpha\(opacity=([0-9]+)\)/, 
							function (a, b) { 
								return b / 100; 
							}
						);
					}
					/*jslint unparam: false*/
					return val === '' ? 1 : val;
				} 
			};
			this.adapterRun = function (elem, method) {
				var alias = { width: 'clientWidth', height: 'clientHeight' }[method];

				if (alias) {
					elem.style.zoom = 1;
					return elem[alias] - 2 * parseInt(HighchartsAdapter._getStyle(elem, 'padding'), 10);
				}
			};
		}

		if (!Array.prototype.forEach) {
			this.each = function (arr, fn) { // legacy
				var i = 0, 
					len = arr.length;
				for (; i < len; i++) {
					if (fn.call(arr[i], arr[i], i, arr) === false) {
						return i;
					}
				}
			};
		}

		if (!Array.prototype.indexOf) {
			this.inArray = function (item, arr) {
				var len, 
					i = 0;

				if (arr) {
					len = arr.length;
					
					for (; i < len; i++) {
						if (arr[i] === item) {
							return i;
						}
					}
				}

				return -1;
			};
		}

		if (!Array.prototype.filter) {
			this.grep = function (elements, callback) {
				var ret = [],
					i = 0,
					length = elements.length;

				for (; i < length; i++) {
					if (!!callback(elements[i], i)) {
						ret.push(elements[i]);
					}
				}

				return ret;
			};
		}

		//--- End compatibility section ---


		/**
		 * Start of animation specific code
		 */
		Fx = function (elem, options, prop) {
			this.options = options;
			this.elem = elem;
			this.prop = prop;
		};
		Fx.prototype = {
			
			update: function () {
				var styles,
					paths = this.paths,
					elem = this.elem,
					elemelem = elem.element; // if destroyed, it is null

				// Animating a path definition on SVGElement
				if (paths && elemelem) {
					elem.attr('d', pathAnim.step(paths[0], paths[1], this.now, this.toD));
				
				// Other animations on SVGElement
				} else if (elem.attr) {
					if (elemelem) {
						elem.attr(this.prop, this.now);
					}

				// HTML styles
				} else {
					styles = {};
					styles[elem] = this.now + this.unit;
					Highcharts.css(elem, styles);
				}
				
				if (this.options.step) {
					this.options.step.call(this.elem, this.now, this);
				}

			},
			custom: function (from, to, unit) {
				var self = this,
					t = function (gotoEnd) {
						return self.step(gotoEnd);
					},
					i;

				this.startTime = +new Date();
				this.start = from;
				this.end = to;
				this.unit = unit;
				this.now = this.start;
				this.pos = this.state = 0;

				t.elem = this.elem;

				if (t() && timers.push(t) === 1) {
					timerId = setInterval(function () {
						
						for (i = 0; i < timers.length; i++) {
							if (!timers[i]()) {
								timers.splice(i--, 1);
							}
						}

						if (!timers.length) {
							clearInterval(timerId);
						}
					}, 13);
				}
			},
			
			step: function (gotoEnd) {
				var t = +new Date(),
					ret,
					done,
					options = this.options,
					i;

				if (this.elem.stopAnimation) {
					ret = false;

				} else if (gotoEnd || t >= options.duration + this.startTime) {
					this.now = this.end;
					this.pos = this.state = 1;
					this.update();

					this.options.curAnim[this.prop] = true;

					done = true;
					for (i in options.curAnim) {
						if (options.curAnim[i] !== true) {
							done = false;
						}
					}

					if (done) {
						if (options.complete) {
							options.complete.call(this.elem);
						}
					}
					ret = false;

				} else {
					var n = t - this.startTime;
					this.state = n / options.duration;
					this.pos = options.easing(n, 0, 1, options.duration);
					this.now = this.start + ((this.end - this.start) * this.pos);
					this.update();
					ret = true;
				}
				return ret;
			}
		};

		/**
		 * The adapter animate method
		 */
		this.animate = function (el, prop, opt) {
			var start,
				unit = '',
				end,
				fx,
				args,
				name;

			el.stopAnimation = false; // ready for new

			if (typeof opt !== 'object' || opt === null) {
				args = arguments;
				opt = {
					duration: args[2],
					easing: args[3],
					complete: args[4]
				};
			}
			if (typeof opt.duration !== 'number') {
				opt.duration = 400;
			}
			opt.easing = Math[opt.easing] || Math.easeInOutSine;
			opt.curAnim = Highcharts.extend({}, prop);
			
			for (name in prop) {
				fx = new Fx(el, opt, name);
				end = null;
				
				if (name === 'd') {
					fx.paths = pathAnim.init(
						el,
						el.d,
						prop.d
					);
					fx.toD = prop.d;
					start = 0;
					end = 1;
				} else if (el.attr) {
					start = el.attr(name);
				} else {
					start = parseFloat(HighchartsAdapter._getStyle(el, name)) || 0;
					if (name !== 'opacity') {
						unit = 'px';
					}
				}
	
				if (!end) {
					end = parseFloat(prop[name]);
				}
				fx.custom(start, end, unit);
			}	
		};
	},

	/**
	 * Internal method to return CSS value for given element and property
	 */
	_getStyle: function (el, prop) {
		return window.getComputedStyle(el).getPropertyValue(prop);
	},

	/**
	 * Downloads a script and executes a callback when done.
	 * @param {String} scriptLocation
	 * @param {Function} callback
	 */
	getScript: function (scriptLocation, callback) {
		// We cannot assume that Assets class from mootools-more is available so instead insert a script tag to download script.
		var head = doc.getElementsByTagName('head')[0],
			script = doc.createElement('script');

		script.type = 'text/javascript';
		script.src = scriptLocation;
		script.onload = callback;

		head.appendChild(script);
	},

	/**
	 * Return the index of an item in an array, or -1 if not found
	 */
	inArray: function (item, arr) {
		return arr.indexOf ? arr.indexOf(item) : emptyArray.indexOf.call(arr, item);
	},


	/**
	 * A direct link to adapter methods
	 */
	adapterRun: function (elem, method) {
		return parseInt(HighchartsAdapter._getStyle(elem, method), 10);
	},

	/**
	 * Filter an array
	 */
	grep: function (elements, callback) {
		return emptyArray.filter.call(elements, callback);
	},

	/**
	 * Map an array
	 */
	map: function (arr, fn) {
		var results = [], i = 0, len = arr.length;

		for (; i < len; i++) {
			results[i] = fn.call(arr[i], arr[i], i, arr);
		}

		return results;
	},

	offset: function (el) {
		var left = 0,
			top = 0;

		while (el) {
			left += el.offsetLeft;
			top += el.offsetTop;
			el = el.offsetParent;
		}

		return {
			left: left,
			top: top
		};
	},

	/**
	 * Add an event listener
	 */
	addEvent: function (el, type, fn) {
		augment(el).bind(type, fn);
	},

	/**
	 * Remove event added with addEvent
	 */
	removeEvent: function (el, type, fn) {
		augment(el).unbind(type, fn);
	},

	/**
	 * Fire an event on a custom object
	 */
	fireEvent: function (el, type, eventArguments, defaultFunction) {
		var e;

		if (doc.createEvent && (el.dispatchEvent || el.fireEvent)) {
			e = doc.createEvent('Events');
			e.initEvent(type, true, true);
			e.target = el;

			Highcharts.extend(e, eventArguments);

			if (el.dispatchEvent) {
				el.dispatchEvent(e);
			} else {
				el.fireEvent(type, e);
			}

		} else if (el.HCExtended === true) {
			eventArguments = eventArguments || {};
			el.trigger(type, eventArguments);
		}

		if (eventArguments && eventArguments.defaultPrevented) {
			defaultFunction = null;
		}

		if (defaultFunction) {
			defaultFunction(eventArguments);
		}
	},

	washMouseEvent: function (e) {
		return e;
	},


	/**
	 * Stop running animation
	 */
	stop: function (el) {
		el.stopAnimation = true;
	},

	/**
	 * Utility for iterating over an array. Parameters are reversed compared to jQuery.
	 * @param {Array} arr
	 * @param {Function} fn
	 */
	each: function (arr, fn) { // modern browsers
		return Array.prototype.forEach.call(arr, fn);
	}
};
}());
