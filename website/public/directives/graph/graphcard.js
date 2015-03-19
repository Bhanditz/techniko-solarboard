app.directive('ngGraph', function(generated, moment, weather) {
    return {
        restrict: 'AE',
        templateUrl: './directives/graph/graphcard.html',
        scope: {
            title: "@",
            graphDate: "="
        },
        link: function(scope, iElement, attr, ctrl) {
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
                series: []
            };

            scope.$watch('graphDate', function(newValue, oldValue) {
                console.log("WOW");
                if (!newValue) {
                    newValue = moment().startOf('day').format('X');
                }
                scope.graph.series = [];
                addDay(newValue);
            }, true);

            var addDay = function(unixDay) {
                generated.getDay(unixDay).success(function(data, status, headers, config) {
                    if (data) {
                        scope.graph.series = [];
                        var day = moment.unix(unixDay).startOf('day');
                        var outputData = [];
                        var present = moment();
                        var maxDay = moment(day).add(1, 'days');
                        data.forEach(function(solar) {
                            var total = 0;
                            var yieldData = [];
                            var i = 0;
                            while (day < present && day < maxDay) {
                                var generated = solar[day.hours()][day.minutes() / 5];
                                if (!generated) generated = 0;
                                total += generated;
                                yieldData.push(Math.round((total / 1000) * 1000000) / 1000000);

                                if (!outputData[i]) outputData[i] = 0;
                                outputData[i] += Math.round(generated * 3600 / 300 * 100) / 100; //Get output by dividing with an hour (Wh / hour = W)
                                day.add(5, 'minutes');
                                i++;
                            }
                            day.subtract(1, 'hours').startOf('day');
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

                        if (outputData.length !== 0) {
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
                    }
                });
            };
        }
    };
});