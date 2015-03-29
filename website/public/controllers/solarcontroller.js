app.controller('SolarController', function($scope, $stateParams, $interval, solars, outputs, moment) {
    vm = this;
    this.solar = ($stateParams.solar);
    vm.output = 0;

    solars.solar(this.solar).success(function(data) {
        vm.data = data;
        vm.outputpeak = data.output / data.peak;
        vm.percentageOnline = getPercentageOnline();

        getTotalGenerated();
    });
    getOutput();
    var timer = $interval(function() {
        getOutput();
    }, 3000);

    function getOutput() {
        if (vm.solar) {
            outputs.solar(vm.solar).success(function(data) {
                vm.output = data.output;
            });
        }
    }

    function getPercentageOnline() {
        var now = moment();
        var then = moment(vm.data.dateAdded);
        var difference = now.diff(then);

        return (vm.data.hoursOnline / difference) * 100;
    }

    function getTotalGenerated() {
        solars.all.success(function(data) {
            var total = 0;
            data.forEach(function(solar) {
                total += parseInt(solar.totalYield);
            });
            vm.totalGenerated = total;
        });
    }
});