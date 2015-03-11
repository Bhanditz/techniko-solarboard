app.controller('DashboardController', function ($rootScope, $http, moment) {
    var vm = this;

    $http.get('http://127.0.0.1:1337/solar').success(function (data, status, headers, config) {
        vm.outputData = data;
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

    this.getFromNow = function (date) {
        return moment(date).fromNow();
    };
});