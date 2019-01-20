/*
 Highcharts JS v3.0.6 (2013-10-04)
 MooTools adapter

 (c) 2010-2013 Torstein Hønsi

 License: www.highcharts.com/license
*/
(function(){var e=window,h=document,f=e.MooTools.version.substring(0,3),i=f==="1.2"||f==="1.1",j=i||f==="1.3",g=e.$extend||function(){return Object.append.apply(Object,arguments)};e.HighchartsAdapter={init:function(a){var b=Fx.prototype,c=b.start,d=Fx.Morph.prototype,e=d.compute;b.start=function(b,d){var e=this.element;if(b.d)this.paths=a.init(e,e.d,this.toD);c.apply(this,arguments);return this};d.compute=function(b,c,d){var f=this.paths;if(f)this.element.attr("d",a.step(f[0],f[1],d,this.toD));else return e.apply(this,
arguments)}},adapterRun:function(a,b){if(b==="width"||b==="height")return parseInt($(a).getStyle(b),10)},getScript:function(a,b){var c=h.getElementsByTagName("head")[0],d=h.createElement("script");d.type="text/javascript";d.src=a;d.onload=b;c.appendChild(d)},animate:function(a,b,c){var d=a.attr,f=c&&c.complete;if(d&&!a.setStyle)a.getStyle=a.attr,a.setStyle=function(){var a=arguments;this.attr.call(this,a[0],a[1][0])},a.$family=function(){return!0};e.HighchartsAdapter.stop(a);c=new Fx.Morph(d?a:$(a),
g({transition:Fx.Transitions.Quad.easeInOut},c));if(d)c.element=a;if(b.d)c.toD=b.d;f&&c.addEvent("complete",f);c.start(b);a.fx=c},each:function(a,b){return i?$each(a,b):Array.each(a,b)},map:function(a,b){return a.map(b)},grep:function(a,b){return a.filter(b)},inArray:function(a,b,c){return b?b.indexOf(a,c):-1},offset:function(a){a=a.getPosition();return{left:a.x,top:a.y}},extendWithEvents:function(a){a.addEvent||(a.nodeName?$(a):g(a,new Events))},addEvent:function(a,b,c){typeof b==="string"&&(b===
"unload"&&(b="beforeunload"),e.HighchartsAdapter.extendWithEvents(a),a.addEvent(b,c))},removeEvent:function(a,b,c){typeof a!=="string"&&a.addEvent&&(b?(b==="unload"&&(b="beforeunload"),c?a.removeEvent(b,c):a.removeEvents&&a.removeEvents(b)):a.removeEvents())},fireEvent:function(a,b,c,d){b={type:b,target:a};b=j?new Event(b):new DOMEvent(b);b=g(b,c);if(!b.target&&b.event)b.target=b.event.target;b.preventDefault=function(){d=null};a.fireEvent&&a.fireEvent(b.type,b);d&&d(b)},washMouseEvent:function(a){if(a.page)a.pageX=
a.page.x,a.pageY=a.page.y;return a},stop:function(a){a.fx&&a.fx.cancel()}}})();
