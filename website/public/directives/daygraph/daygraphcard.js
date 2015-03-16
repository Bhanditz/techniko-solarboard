app.directive('ngDayGraph', function (generated, moment, weather) {
    return {
        restrict: 'AE',
        templateUrl: './directives/daygraph/daygraphtemplate.html',
        require: '?ngDay',
        scope: {
            ngDay: '@'
        },
        link: function (scope, iElement, iAttrs, ctrl) {
            scope.graph = {
                options: {
                    xAxis: {
                        type: 'datetime',
                        title: {
                            text: "Tijdstip"
                        }
                    },

                    yAxis: [{
                        labels: {
                            format: "{value} kWh"
                        },
                        floor: 0,
                        title: {
                            text: "Opgewekt"
                        }
                    }, {
                        labels: {
                            format: "{value} W"
                        },
                        floor: 0,
                        opposite: true,
                        title: {
                            text: "Output"
                        }
                    }],

                    chart: {
                        zoomType: "xy"
                    },

                    plotOptions: {
                        series: {
                            stacking: 'normal',
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        shared: true
                    }
                },
                title: {
                    text: ""
                },
                series: [
                ]
            };
            generated.getDay(scope.ngDay).success(function (data, status, headers, config) {
                if (data) {
                    if (!scope.ngDay) scope.ngDay = moment().startOf('day').format('X');
                    var day = moment.unix(scope.ngDay);
                    var today = moment().startOf('day');
                    var outputData = [];
                    data.forEach(function (solar) {
                        var current = moment();
                        var total = 0;
                        var yieldData = [];
                        var i = 0;
                        parentLoop: for (var hour = 0; hour < 24; hour++) {
                            for (var minute = 0; minute < 12; minute++) {
                                //Check if time has already passed
                                if (minute * 5 > current.minutes() && hour >= current.hours() && scope.ngDay >= today.format('X')) {
                                    break parentLoop;
                                }
                                var generated = solar[hour.toString()][minute];
                                if (!generated) generated = 0;
                                total += generated;
                                yieldData.push(Math.round((total / 1000) * 1000000) / 1000000);

                                if (!outputData[i]) outputData[i] = 0;
                                outputData[i] += Math.round(generated * 3600 / 300 * 100) / 100; //Get output by dividing with an hour (Wh / hour = W)
                                i++;
                            }
                        }

                        scope.graph.series.push({
                            name: solar.solar,
                            type: 'areaspline',
                            data: yieldData,
                            tooltip: {
                                valueSuffix: " kWh"
                            },
                            yAxis: 0,
                            pointStart: Date.UTC(day.year(), day.month(), day.date()),
                            pointInterval: 1000 * 60 * 5
                        });
                    });

                    scope.graph.series.push({
                        name: "Output",
                        type: "spline",
                        data: outputData,
                        tooltip: {
                            valueSuffix: " W"
                        },
                        yAxis: 1,
                        pointStart: Date.UTC(day.year(), day.month(), day.date()),
                        pointInterval: 1000 * 60 * 5
                    });
                }
            });
        }
    };
});