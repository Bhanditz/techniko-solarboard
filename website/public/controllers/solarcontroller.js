app.controller('SolarController', function($scope, $stateParams, $interval, generated, solars, outputs, moment) {
    vm = this;
    this.solar = ($stateParams.solar);
    vm.output = 0;

    solars.solar(this.solar).success(function(data) {
        vm.data = data;
        vm.outputpeak = data.output / data.peak;
        vm.percentageOnline = getPercentageOnline();

        getTotalGenerated();
        getOutput();
        getYesterdayOutput();
    });
    var timer = $interval(function() {
        getOutput();
    }, 3000);

    function getOutput() {
        if (vm.solar) {
            outputs.solar(vm.solar).success(function(data) {
                vm.output = data.output;
                vm.outputpeak = data.output / vm.data.peak;
                vm.outputDiff = vm.output - vm.outputYesterday * 3600 / 300;
            });
        }
    }

    function getPercentageOnline() {
        var now = moment();
        var then = moment(vm.data.dateAdded);
        var duration = moment.duration(now.diff(then));

        return (vm.data.hoursOnline / duration.asHours()) * 100;
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

    function getYesterdayOutput() {
        var now = moment();
        var yesterday = moment.utc().startOf('day').subtract(1, 'days').format('X');
        generated.getDay(yesterday, vm.solar).success(function(data) {
            if (data) {
                if (data[now.hours()][now.minutes() - now.minutes() % 5])
                    vm.outputYesterday = data[now.hours()][now.minutes() - now.minutes() % 5];
                else
                    vm.outputYesterday = 0;
            } else {
                vm.outputYesterday = 0;
            }
        });
    }

    function isHigher() {
        if (!vm.outputDiff)
            return "hoger";
        return vm.outputDiff < 0 ? "lager" : "hoger";
    }
});