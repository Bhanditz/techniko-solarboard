app.directive('ngGraph', function($q, generated, moment, weather, datepicker) {
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
                        zoomType: "xy",
                        events: {
                            drillup: function(e) {

                            },
                            drilldown: function(e) {
                                //this.showLoading("Laden...");
                                var chart = this;
                                scope.$apply(function() {
                                    datepicker.day = moment.utc(e.point.x / 1000, 'X').date();
                                });

                                //scope.graph.series = [];
                                //getDaySeries(e.point.x / 1000).then(function(data) {
                                //    data.forEach(function(childData) {
                                //        scope.graph.series.push(childData);
                                //    });
                                //});
                            }
                        }
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

            scope.lol = function() {
                datepicker.year = "231";
            };

            scope.$watch('graphDate', function(newValue, oldValue) {
                if (!newValue) {
                    newValue = moment.utc().startOf('day').format('X');
                }
                scope.graph.series = [];
                processDate(newValue);
            }, true);

            var processDate = function(date) {
                switch (date.type) {
                    case 'year':
                        //TODO
                        break;
                    case 'month':
                        addMonth(date.date);
                        break;
                    case 'day':
                        getDaySeries(date.date).then(function(data) {
                            data.forEach(function(childData) {
                                scope.graph.series.push(childData);
                            });
                        });
                        break;
                }
            };

            var getDaySeries = function(unixDay) {
                return $q(function(resolve, reject) {
                    generated.getDay(unixDay).then(function(data) {
                        var series = [];
                        if (data) {
                            var day = moment.utc(unixDay, 'X').startOf('day');
                            var unixDate = Date.UTC(day.year(), day.month(), day.date());
                            var outputData = [];
                            var present = moment.utc();
                            var maxDay = moment.utc(day).add(1, 'days');
                            data.data.forEach(function(solar) {
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


                                series.push({
                                    name: solar.solar,
                                    type: 'areaspline',
                                    data: yieldData,
                                    tooltip: {
                                        valueSuffix: " kWh"
                                    },
                                    yAxis: 0,
                                    xAxis: 0,
                                    pointStart: unixDate,
                                    pointInterval: 1000 * 60 * 5
                                });
                            });

                            if (outputData.length !== 0) {
                                series.push({
                                    name: "Output",
                                    type: "spline",
                                    data: outputData,
                                    tooltip: {
                                        valueSuffix: " W"
                                    },
                                    yAxis: 1,
                                    xAxis: 0,
                                    pointStart: unixDate,
                                    pointInterval: 1000 * 60 * 5
                                });
                            }
                            resolve(series);
                        }
                    });
                });
            };

            var addMonth = function(month) {
                generated.getMonth(month, true).then(function(data) {
                    var date = moment.utc(month, 'X').startOf('month');
                    if (data) {
                        var generatedData = [];
                        for (var i = 0; i < date.daysInMonth(); i++) {
                            if (data.data[i]) {
                                var unixDate = new Date(data.data[i].date).getTime();
                                generatedData.push({
                                    x: unixDate,
                                    y: data.data[i].total / 1000,
                                    drilldown: true
                                });
                            }
                        }
                        scope.graph.series.push({
                            name: "Opgewekt",
                            type: "column",
                            data: generatedData
                        });
                    }
                });
            };
        }
    };
});