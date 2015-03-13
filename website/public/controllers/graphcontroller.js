app.controller("GraphController", function($rootScope) {
    $rootScope.pageTitle = "Opwekking";
    var vm = this;
    vm.chartConfig = {
        options: {
            chart: {
                type: 'areaspline',
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    stacking: "normal"
                }
            }
        },
        series: [],
        title: {
            text: 'Output'
        },
        useHighStocks: true,
        loading: false
    };

    this.populateCharts = function(data) {
        vm.chartConfig.series = [];
        data.forEach(function(solar) {
            var outputs = [];
            solar.outputs.forEach(function(output) {
                outputs.push([new Date(output.date).getTime(), output.output]);
            });
            vm.chartConfig.series.push({
                name: solar._id,
                data: outputs
            });
        });
    };

});