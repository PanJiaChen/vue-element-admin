(function (Highcharts) {
	var seriesTypes = Highcharts.seriesTypes,
		each = Highcharts.each;
	
	seriesTypes.heatmap = Highcharts.extendClass(seriesTypes.map, {
		colorKey: 'z',
		useMapGeometry: false,
		pointArrayMap: ['y', 'z'],
		translate: function () {
			var series = this,
				options = series.options,
				dataMin = Number.MAX_VALUE,
				dataMax = Number.MIN_VALUE;

			series.generatePoints();
	
			each(series.data, function (point) {
				var x = point.x,
					y = point.y,
					value = point.z,
					xPad = (options.colsize || 1) / 2,
					yPad = (options.rowsize || 1) / 2;

				point.path = [
					'M', x - xPad, y - yPad,
					'L', x + xPad, y - yPad,
					'L', x + xPad, y + yPad,
					'L', x - xPad, y + yPad,
					'Z'
				];
				
				point.shapeType = 'path';
				point.shapeArgs = {
					d: series.translatePath(point.path)
				};
				
				if (typeof value === 'number') {
					if (value > dataMax) {
						dataMax = value;
					} else if (value < dataMin) {
						dataMin = value;
					}
				}
			});
			
			series.translateColors(dataMin, dataMax);
		},
		
		getBox: function () {}
			
	});
	
}(Highcharts));
