app.controller('SolarController', function($scope, $stateParams, solars, outputs, moment) {
    vm = this;
    this.solar = ($stateParams.solar);
    vm.output = 0;
    outputs.solar(this.solar).success(function(data) {
        vm.output = data.output;
    });
    solars.solar(this.solar).success(function(data) {
        vm.data = data;
        vm.outputpeak = data.output / data.peak;
        vm.percentageOnline = getPercentageOnline();

        getTotalGenerated();
    });


    function getPercentageOnline() {
        var now = moment();
        var then = moment(vm.data.dateAdded);
        var difference = now.diff(then);

        return (vm.data.hoursOnline / difference) * 100;
    }

    function getTotalGenerated() {
        console.log("Trying");
        solars.all.success(function(data) {
            var total = 0;
            console.log(data);
            data.forEach(function(solar) {
                console.log(solar);
                total += parseInt(solar.totalYield);
            });
            vm.totalGenerated = total;
        });
    }
});