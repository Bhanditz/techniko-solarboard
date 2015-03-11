app.controller('DashboardController', function ($rootScope, $http, moment) {
    var vm = this;
    this.connectionError = false;

    $rootScope.pageTitle = "Overzicht";

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
                    stacking: 'normal'
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

    $http.get('http://192.168.1.70:1337/solar')
        .success(function (data, status, headers, config) {
            vm.outputData = data;
            vm.getChartData(data);
        })
        .error(function (data, status, headers, config) {
            vm.connectionError = true;
        });

    this.getChartData = function (solars) {
        solars.forEach(function (solar) {
            var day = moment().startOf('day');
            $http.get('http://192.168.1.70:1337/solar/generated/' + solar._id + '/' + day.format('X')).success(function (data, status, headers, config) {
                if (data) {
                    var newData = [];
                    for (var hour = 0; hour < 24; hour++) {
                        for (var minute = 0; minute < 12; minute++) {
                            var generated = data[hour.toString()][minute];
                            if (!generated) generated = 0;
                            newData.push(generated);
                        }
                    }

                    vm.overviewGraph.series.push({
                        name: data._id.split(':')[0],
                        data: newData,
                        pointStart: Date.UTC(day.year(), day.month(), day.date()),
                        pointInterval: 1000 * 60 * 5
                    });
                    console.log();
                    console.log(vm.overviewGraph.series);
                }
            });
        });
    };

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