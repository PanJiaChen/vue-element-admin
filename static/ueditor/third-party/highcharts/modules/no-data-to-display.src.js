/**
 * @license Highcharts JS v3.0.6 (2013-10-04)
 * Plugin for displaying a message when there is no data visible in chart.
 *
 * (c) 2010-2013 Highsoft AS
 * Author: Øystein Moseng
 *
 * License: www.highcharts.com/license
 */

(function (H) { // docs
	
	var seriesTypes = H.seriesTypes,
		chartPrototype = H.Chart.prototype,
		defaultOptions = H.getOptions(),
		extend = H.extend;

	// Add language option
	extend(defaultOptions.lang, {
		noData: 'No data to display'
	});
	
	// Add default display options for message
	defaultOptions.noData = {
		position: {
			x: 0,
			y: 0,			
			align: 'center',
			verticalAlign: 'middle'
		},
		attr: {						
		},
		style: {	
			fontWeight: 'bold',		
			fontSize: '12px',
			color: '#60606a'		
		}
	};

	/**
	 * Define hasData functions for series. These return true if there are data points on this series within the plot area
	 */	
	function hasDataPie() {
		return !!this.points.length; /* != 0 */
	}

	seriesTypes.pie.prototype.hasData = hasDataPie;

	if (seriesTypes.gauge) {
		seriesTypes.gauge.prototype.hasData = hasDataPie;
	}

	if (seriesTypes.waterfall) {
		seriesTypes.waterfall.prototype.hasData = hasDataPie;
	}

	H.Series.prototype.hasData = function () {
		return this.dataMax !== undefined && this.dataMin !== undefined;
	};
	
	/**
	 * Display a no-data message.
	 *
	 * @param {String} str An optional message to show in place of the default one 
	 */
	chartPrototype.showNoData = function (str) {
		var chart = this,
			options = chart.options,
			text = str || options.lang.noData,
			noDataOptions = options.noData;

		if (!chart.noDataLabel) {
			chart.noDataLabel = chart.renderer.label(text, 0, 0, null, null, null, null, null, 'no-data')
				.attr(noDataOptions.attr)
				.css(noDataOptions.style)
				.add();
			chart.noDataLabel.align(extend(chart.noDataLabel.getBBox(), noDataOptions.position), false, 'plotBox');
		}
	};

	/**
	 * Hide no-data message	
	 */	
	chartPrototype.hideNoData = function () {
		var chart = this;
		if (chart.noDataLabel) {
			chart.noDataLabel = chart.noDataLabel.destroy();
		}
	};

	/**
	 * Returns true if there are data points within the plot area now
	 */	
	chartPrototype.hasData = function () {
		var chart = this,
			series = chart.series,
			i = series.length;

		while (i--) {
			if (series[i].hasData() && !series[i].options.isInternal) { 
				return true;
			}	
		}

		return false;
	};

	/**
	 * Show no-data message if there is no data in sight. Otherwise, hide it.
	 */
	function handleNoData() {
		var chart = this;
		if (chart.hasData()) {
			chart.hideNoData();
		} else {
			chart.showNoData();
		}
	}

	/**
	 * Add event listener to handle automatic display of no-data message
	 */
	chartPrototype.callbacks.push(function (chart) {
		H.addEvent(chart, 'load', handleNoData);
		H.addEvent(chart, 'redraw', handleNoData);
	});

}(Highcharts));
