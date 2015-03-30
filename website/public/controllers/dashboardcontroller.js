app.controller('DashboardController', function($rootScope, $scope, $http, moment, solars, outputs) {
    var vm = this;
    this.connectionError = false;

    $rootScope.pageTitle = "Overzicht";

    var now = new Date();
    solars.all.success(function(data) {
        vm.solarData = data;
    });

    outputs.all().success(function(data) {
        vm.outputData = data;
    });

    this.getFromNow = function(date) {
        return moment(date).fromNow();
    };
});