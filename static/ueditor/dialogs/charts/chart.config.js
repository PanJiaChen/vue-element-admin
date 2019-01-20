/*
 * 图表配置文件
 * */


//不同类型的配置
var typeConfig = [
    {
        chart: {
            type: 'line'
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        }
    }, {
        chart: {
            type: 'line'
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        }
    }, {
        chart: {
            type: 'area'
        }
    }, {
        chart: {
            type: 'bar'
        }
    }, {
        chart: {
            type: 'column'
        }
    }, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ ( Math.round( this.point.percentage*100 ) / 100 ) +' %';
                    }
                }
            }
        }
    }
];
