/*
 Highcharts JS v3.0.6 (2013-10-04)
 Plugin for displaying a message when there is no data visible in chart.

 (c) 2010-2013 Highsoft AS
 Author: Øystein Moseng

 License: www.highcharts.com/license
*/
(function(c){function f(){return!!this.points.length}function g(){this.hasData()?this.hideNoData():this.showNoData()}var d=c.seriesTypes,e=c.Chart.prototype,h=c.getOptions(),i=c.extend;i(h.lang,{noData:"No data to display"});h.noData={position:{x:0,y:0,align:"center",verticalAlign:"middle"},attr:{},style:{fontWeight:"bold",fontSize:"12px",color:"#60606a"}};d.pie.prototype.hasData=f;if(d.gauge)d.gauge.prototype.hasData=f;if(d.waterfall)d.waterfall.prototype.hasData=f;c.Series.prototype.hasData=function(){return this.dataMax!==
void 0&&this.dataMin!==void 0};e.showNoData=function(a){var b=this.options,a=a||b.lang.noData,b=b.noData;if(!this.noDataLabel)this.noDataLabel=this.renderer.label(a,0,0,null,null,null,null,null,"no-data").attr(b.attr).css(b.style).add(),this.noDataLabel.align(i(this.noDataLabel.getBBox(),b.position),!1,"plotBox")};e.hideNoData=function(){if(this.noDataLabel)this.noDataLabel=this.noDataLabel.destroy()};e.hasData=function(){for(var a=this.series,b=a.length;b--;)if(a[b].hasData()&&!a[b].options.isInternal)return!0;
return!1};e.callbacks.push(function(a){c.addEvent(a,"load",g);c.addEvent(a,"redraw",g)})})(Highcharts);
