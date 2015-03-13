app.controller('DashboardController', function ($rootScope, $http, moment, solars, generated) {
    var vm = this;
    this.connectionError = false;

    $rootScope.pageTitle = "Overzicht";

    this.outputData = solars.data;

    this.overviewGraph = {
        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: 'areaspline'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: "Date"
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

    generated.getToday().success(function (data, status, headers, config) {
        if (data) {
            data.forEach(function (solar) {
                var day = moment().startOf('day');
                var current = moment();
                var total = 0;
                var newData = [];
                parentLoop:
                    for (var hour = 0; hour < 24; hour++) {
                        for (var minute = 0; minute < 12; minute++) {
                            //Check if minute has already passed
                            if (minute * 5 > current.minutes() && hour == current.hours()) {
                                break parentLoop;
                            }
                            var generated = solar[hour.toString()][minute];
                            if (!generated) generated = 0;
                            total += generated;
                            newData.push(total);
                        }
                    }

                vm.overviewGraph.series.push({
                    name: solar._id.split(':')[0],
                    data: newData,
                    pointStart: Date.UTC(day.year(), day.month(), day.date()),
                    pointInterval: 1000 * 60 * 5
                });
            });
        }
    });

    this.getTotalOutput = function () {
        var total = 0;
        if (vm.outputData) {
            vm.outputData.forEach(function (solar) {
                var output = solar.output;
                if (output) total += output;
            });
        }
        return total;
    };

    this.getTotalYield = function () {
        var total = 0;
        if (vm.outputData) {
            vm.outputData.forEach(function (solar) {
                var tYield = solar.totalYield;
                if (tYield) total += tYield;
            });
        }
        return total;
    };

    this.getFromNow = function (date) {
        return moment(date).fromNow();
    };
});