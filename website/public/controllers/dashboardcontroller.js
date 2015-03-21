app.controller('DashboardController', function($rootScope, $scope, $http, moment, solars) {
    var vm = this;
    this.connectionError = false;

    $rootScope.pageTitle = "Overzicht";

    var now = new Date();
    $scope.graphDate = {
        type: 'day',
        date: Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 1000
    };

    this.outputData = solars.data;

    this.getFromNow = function(date) {
        return moment(date).fromNow();
    };
});